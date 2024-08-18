import { EventModel } from "@/queries/events";
import { create } from "zustand";

interface State {
  event: EventModel;
}

interface Action {
  setEvent: (event: Partial<EventModel>) => void;
  resetEvent: () => void;
}

export const useCreateEventStore = create<State & Action>((set) => {
  return {
    event: {
      title: "",
      description: "",
      start: "",
      end: "",
      all_day: false,
    },
    setEvent: (event) =>
      set((prev) => ({
        event: {
          ...prev.event,
          ...event,
        },
      })),
    resetEvent: () =>
      set({
        event: {
          title: "",
          description: "",
          start: "",
          end: "",
          all_day: false,
        },
      }),
  };
});
