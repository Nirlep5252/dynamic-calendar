import { create } from "zustand";

interface State {
  createEvent: boolean;
  updateOrDeleteEvent: boolean;
}

interface Action {
  toggleCreateEvent: () => void;
  toggleUpdateOrDeleteEvent: () => void;
}

export const usePopups = create<State & Action>((set) => {
  return {
    createEvent: false,
    updateOrDeleteEvent: false,
    toggleCreateEvent: () =>
      set((state) => ({ createEvent: !state.createEvent })),
    toggleUpdateOrDeleteEvent: () =>
      set((state) => ({ updateOrDeleteEvent: !state.updateOrDeleteEvent })),
  };
});
