import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEvents } from "@/queries/events";
import { CreateEvent } from "./components/create-event";

const localizer = momentLocalizer(moment);

function App() {
  const { data: events_data } = useEvents();

  return (
    <div className="flex h-screen w-screen gap-10 p-10">
      <div className="left-sidebar flex h-full w-[20%] flex-col items-center p-4">
        <CreateEvent />
      </div>
      <div className="h-full w-[80%]">
        <Calendar
          localizer={localizer}
          events={events_data?.events}
          startAccessor={(event) => new Date(event.start)}
          endAccessor={(event) => new Date(event.end)}
          showAllEvents={true}
        />
      </div>
    </div>
  );
}

export default App;
