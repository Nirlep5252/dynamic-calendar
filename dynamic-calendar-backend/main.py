import os
from dotenv import load_dotenv

from typing import Optional
from typing_extensions import Annotated

from fastapi import FastAPI, status, Body
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field, ConfigDict
from pydantic.functional_validators import BeforeValidator

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument

load_dotenv()
app = FastAPI()
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")
assert DATABASE_URL, "DATABASE_URL is not set"

client: AsyncIOMotorClient = AsyncIOMotorClient(DATABASE_URL)
db = client.dynamic_calendar
events = db.events

PyObjectId = Annotated[str, BeforeValidator(str)]


class EventModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str = Field()
    description: str = Field()

    # Start and end are time strings
    all_day: bool = Field(default=False)
    start: str = Field()
    end: str = Field()

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=False,
    )


class UpdateEventModel(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    all_day: Optional[bool] = None
    start: Optional[str] = None
    end: Optional[str] = None


class EventCollection(BaseModel):
    events: list[EventModel]


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post(
    "/events",
    response_description="Add new event",
    response_model=EventModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_event(event: EventModel = Body(...)):
    if not event.title:
        raise HTTPException(status_code=400, detail="Title is required")
    if not event.description:
        raise HTTPException(status_code=400, detail="Description is required")
    if not event.start or not event.start:
        raise HTTPException(
            status_code=400,
            detail="Start time and End time are required or set all_day to true",
        )
    new_event = await events.insert_one(event.model_dump(by_alias=True, exclude={"id"}))
    created_event = await events.find_one({"_id": new_event.inserted_id})
    return created_event


@app.get(
    "/events",
    response_description="Get all events",
    response_model=EventCollection,
    response_model_by_alias=False,
)
async def get_events():
    return EventCollection(events=await events.find().to_list(None))


@app.put(
    "/events/{event_id}",
    response_description="Update an event",
    response_model=EventModel,
    response_model_by_alias=False,
)
async def update_event(event_id: PyObjectId, event: UpdateEventModel = Body(...)):
    new_data = {
        k: v for k, v in event.model_dump(by_alias=True).items() if v is not None
    }
    update_result = await events.find_one_and_update(
        {"_id": ObjectId(event_id)},
        {"$set": new_data},
        return_document=ReturnDocument.AFTER,
    )
    if update_result:
        return update_result
    raise HTTPException(status_code=404, detail=f"Event {event_id} not found")


@app.delete(
    "/events/{event_id}",
    response_description="Delete an event",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_event(event_id: PyObjectId):
    delete_result = await events.delete_one({"_id": ObjectId(event_id)})
    if delete_result.deleted_count:
        return
    raise HTTPException(status_code=404, detail=f"Event {event_id} not found")
