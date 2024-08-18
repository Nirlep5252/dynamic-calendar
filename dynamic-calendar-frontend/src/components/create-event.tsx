import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EventModel, useCreateEvent } from "@/queries/events";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const CreateEvent: React.FC = () => {
  const { mutateAsync: createEvent } = useCreateEvent();

  const [event, setEvent] = React.useState<EventModel>({
    title: "",
    description: "",
    start: "",
    end: "",
    all_day: false,
  });

  const queryClient = useQueryClient();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create Event</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <Label className="flex flex-col gap-1">
              Title
              <Input
                onChange={(e) => {
                  setEvent((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                }}
              />
            </Label>
            <Label className="flex flex-col gap-1">
              Description
              <Input
                onChange={(e) => {
                  setEvent((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
              />
            </Label>
            <Label className="flex flex-col gap-1">
              Start Time
              <Input
                type="datetime-local"
                onChange={(e) => {
                  setEvent((prev) => ({
                    ...prev,
                    start: e.target.value,
                  }));
                }}
              />
            </Label>

            <Label className="flex flex-col gap-1">
              End Time
              <Input
                type="datetime-local"
                onChange={(e) => {
                  setEvent((prev) => ({
                    ...prev,
                    end: e.target.value,
                  }));
                }}
              />
            </Label>
            <Label className="flex items-center justify-center gap-2">
              <Checkbox
                onCheckedChange={(checked: boolean) => {
                  console.log(checked);
                  setEvent((prev) => ({
                    ...prev,
                    all_day: checked,
                  }));
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
