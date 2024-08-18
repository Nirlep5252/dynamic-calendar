import { EventModel, useDeleteEvent, useUpdateEvent } from "@/queries/events";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePopups } from "@/stores/popups";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import React from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  event?: EventModel & { id: string };
  setEvent: React.Dispatch<
    React.SetStateAction<
      | (EventModel & {
          id: string;
        })
      | undefined
    >
  >;
}

export const UpdateOrDeleteEvent: React.FC<Props> = (props: Props) => {
  const { event, setEvent } = props;
  const { mutateAsync: updateEvent } = useUpdateEvent();
  const { mutateAsync: deleteEvent } = useDeleteEvent();

  const queryClient = useQueryClient();
  const { updateOrDeleteEvent: open, toggleUpdateOrDeleteEvent: toggleOpen } =
    usePopups();

  if (!event) return <></>;
  return (
    <>
      <Dialog open={open} onOpenChange={toggleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <Label className="flex flex-col gap-1">
              Title
              <Input
                value={event.title}
                onChange={(e) => {
                  setEvent((prev) => ({
                    ...(prev || event),
                    title: e.target.value,
                  }));
                }}
              />
            </Label>
            <Label className="flex flex-col gap-1">
              Description
              <Input
                value={event.description}
                onChange={(e) => {
                  setEvent((prev) => ({
                    ...(prev || event),
                    description: e.target.value,
                  }));
                }}
              />
            </Label>
            <Label className="flex flex-col gap-1">
              Start Time
              <Input
                value={event.start}
                type="datetime-local"
                onChange={(e) => {
                  setEvent((prev) => ({
                    ...(prev || event),
                    start: e.target.value,
                  }));
                }}
              />
            </Label>

            <Label className="flex flex-col gap-1">
              End Time
              <Input
                value={event.end}
                type="datetime-local"
                onChange={(e) => {
                  setEvent((prev) => ({
                    ...(prev || event),
                    end: e.target.value,
                  }));
                }}
              />
            </Label>
            <Label className="flex items-center justify-center gap-2">
              <Checkbox
                checked={event.all_day}
                onCheckedChange={(checked: boolean) => {
                  setEvent((prev) => ({
                    ...(prev || event),
                    all_day: checked,
                  }));
                }}
              />
              <div className="flex w-full">All Day</div>
            </Label>
          </div>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={async () => {
                try {
                  await deleteEvent(event.id);
                  queryClient.invalidateQueries({
                    queryKey: ["events"],
                    exact: true,
                  });
                  toast.success("Event deleted successfully");
                  toggleOpen();
                } catch (e) {
                  toast.error(`Failed to delete event ${e}`);
                }
              }}
            >
              Delete Event
            </Button>
            <Button
              onClick={async () => {
                try {
                  await updateEvent(event);
                  queryClient.invalidateQueries({
                    queryKey: ["events"],
                    exact: true,
                  });
                  toast.success("Event updated successfully");
                  toggleOpen();
                } catch (e) {
                  toast.error(`Failed to update event ${e}`);
                }
              }}
            >
              Update Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
