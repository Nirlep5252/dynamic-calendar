import ky from "ky";
import { createMutation, createQuery } from "react-query-kit";
import config from "../config";

export interface EventModel {
  title: string;
  description: string;
  start: string;
  end: string;
  all_day: boolean;
}

export const useEvents = createQuery({
  queryKey: ["events"],
  fetcher: async () => {
    return await ky<{
      events: (EventModel & { id: string })[];
    }>(`${config.API_URL}/events`).json();
  },
});

export const useCreateEvent = createMutation({
  mutationFn: async (event: EventModel) => {
    return await ky
      .post(`${config.API_URL}/events`, {
        json: event,
        hooks: {
          beforeError: [
            async (error) => {
              const { response } = error;
              if (response && response.body) {
                error.name = "Error";
                const message = (await response.json()) as { detail: string };
                error.message = `${message.detail} (${response.status})`;
              }

              return error;
            },
          ],
        },
      })
      .json();
  },
});
