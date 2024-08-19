import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { EventModel, useEvents, useUpdateEvent } from "@/queries/events";
import { CreateEvent } from "@/components/create-event";
import { useCallback, useState } from "react";
import { usePopups } from "@/stores/popups";
import { UpdateOrDeleteEvent } from "@/components/edit-event";
import { useCreateEventStore } from "@/stores/create-event";
import { useQueryClient } from "@tanstack/react-query";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<EventModel & { id: string }>(Calendar);

function App() {
  const { data: events_data } = useEvents();

  const { mutateAsync: updateEvent } = useUpdateEvent();
  const queryClient = useQueryClient();

  const [selectedEvent, setSelectedEvent] = useState<
    EventModel & { id: string }
  >();
  const { toggleCreateEvent, toggleUpdateOrDeleteEvent } = usePopups();
  const { setEvent } = useCreateEventStore();
  const handleSelectSlot = useCallback(
    ({ start, end }: { start: Date; end: Date }) => {
      // remove timezone difference from start and end
      start = new Date(start.getTime() - start.getTimezoneOffset() * 60000);
      end = new Date(end.getTime() - end.getTimezoneOffset() * 60000);

      setEvent({
        start: start.toISOString().slice(0, 16),
        end: end.toISOString().slice(0, 16),
      });
      toggleCreateEvent();
    },
    [toggleCreateEvent, setEvent],
  );

  const handleSelectEvent = useCallback(
    (event: EventModel & { id: string }) => {
      setSelectedEvent(event);
      toggleUpdateOrDeleteEvent();
    },
    [setSelectedEvent, toggleUpdateOrDeleteEvent],
  );

  const handleMoveEvent = useCallback(
    async ({
      event,
      start,
      end,
      isAllDay: droppedOnAllDaySlot = false,
    }: {
      event: EventModel & { id: string };
      start: string;
      end: string;
      isAllDay: boolean;
    }) => {
      const { all_day } = event;
      if (!all_day && droppedOnAllDaySlot) {
        event.all_day = true;
      }
      if (all_day && !droppedOnAllDaySlot) {
        event.all_day = false;
      }
      // convert start and end to datetime-local format similar to "2021-09-01T10:00"
      // and subtract timezone difference
      const st = new Date(start);
      const en = new Date(end);
      start = new Date(st.getTime() - st.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      end = new Date(en.getTime() - en.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      event.start = start;
      event.end = end;

      await updateEvent(event);
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    [updateEvent, queryClient],
  );

  const handleResizeEvent = useCallback(
    async ({
      event,
      start,
      end,
    }: {
      event: EventModel & { id: string };
      start: string;
      end: string;
    }) => {
      // convert start and end to datetime-local format similar to "2021-09-01T10:00"
      // and subtract timezone difference
      const st = new Date(start);
      const en = new Date(end);
      start = new Date(st.getTime() - st.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      end = new Date(en.getTime() - en.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      event.start = start;
      event.end = end;

      await updateEvent(event);
      queryClient.invalidateQueries({
        queryKey: ["events"],
      });
    },
    [updateEvent, queryClient],
  );

  return (
    <div className="flex h-screen w-screen gap-10 p-10">
      <div className="left-sidebar flex h-full w-[20%] flex-col items-center p-4">
        <CreateEvent />
        <UpdateOrDeleteEvent
          event={selectedEvent}
          setEvent={setSelectedEvent}
        />
      </div>
      <div className="h-full w-[80%]">
        <DnDCalendar
          localizer={localizer}
          events={events_data?.events}
          startAccessor={(event) => new Date(event.start)}
          endAccessor={(event) => new Date(event.end)}
          allDayAccessor={(event) => event.all_day}
          selectable
          popup
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          // @ts-expect-error onEventDrop and onEventResize are not in the types
          onEventDrop={handleMoveEvent}
          // @ts-expect-error onEventDrop and onEventResize are not in the types
          onEventResize={handleResizeEvent}
        />
      </div>
    </div>
  );
}

export default App;
