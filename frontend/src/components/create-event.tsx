import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateEvent } from "@/queries/events";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { usePopups } from "@/stores/popups";
import { useCreateEventStore } from "@/stores/create-event";

export const CreateEvent: React.FC = () => {
  const { mutateAsync: createEvent } = useCreateEvent();

  const { event, setEvent, resetEvent } = useCreateEventStore();
  const queryClient = useQueryClient();

  const { createEvent: open, toggleCreateEvent: toggleOpen } = usePopups();
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          if (open) {
            resetEvent();
          }
          toggleOpen();
        }}
      >
        {/* <DialogTrigger asChild>
          <Button>Create Event</Button>
        </DialogTrigger> */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <Label className="flex flex-col gap-1">
              Title
              <Input
                onChange={(e) => {
                  setEvent({
                    title: e.target.value,
                  });
                }}
              />
            </Label>
            <Label className="flex flex-col gap-1">
              Description
              <Input
                onChange={(e) => {
                  setEvent({
                    description: e.target.value,
                  });
                }}
              />
            </Label>
            <Label className="flex flex-col gap-1">
              Start Time
              <Input
                value={event.start}
                type="datetime-local"
                onChange={(e) => {
                  setEvent({
                    start: e.target.value,
                  });
                }}
              />
            </Label>

            <Label className="flex flex-col gap-1">
              End Time
              <Input
                value={event.end}
                type="datetime-local"
                onChange={(e) => {
                  setEvent({
                    end: e.target.value,
                  });
                }}
              />
            </Label>
            <Label className="flex items-center justify-center gap-2">
              <Checkbox
                onCheckedChange={(checked: boolean) => {
                  setEvent({
                    all_day: checked,
                  });
                }}
              />
              <div className="flex w-full">All Day</div>
            </Label>
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                try {
                  await createEvent(event);
                  queryClient.invalidateQueries({
                    queryKey: ["events"],
                    exact: true,
                  });
                  toast.success("Event created successfully");
                  toggleOpen();
                } catch (e) {
                  toast.error(`Failed to create event ${e}`);
                }
              }}
            >
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
