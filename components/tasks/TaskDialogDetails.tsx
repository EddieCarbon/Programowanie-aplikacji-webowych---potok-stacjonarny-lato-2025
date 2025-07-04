import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { TaskApi } from "@/models/task.model";
import { UserApi } from "@/models/user.model";
import React from "react";
import { DetailGrid } from "./DetailGrid";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

interface TaskDialogDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskApi | null;
  users: UserApi[];
  onAssign: (task: TaskApi, userId: string) => void;
  onMarkDone: (task: TaskApi) => void;
  getUserName: (id?: string) => string;
  getStoryName: (id?: string) => string;
}

export function TaskDialogDetails({
  open,
  onOpenChange,
  task,
  users,
  onAssign,
  onMarkDone,
  getUserName,
  getStoryName,
}: TaskDialogDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Szczegóły zadania</DialogTitle>
        </DialogHeader>
        {task && (
          <DetailGrid
            details={[
              { label: "Nazwa:", value: task.name },
              { label: "Opis:", value: task.description },
              {
                label: "Historyjka:",
                value: getStoryName(task.story?.toString()),
              },
              { label: "Szacowane godziny:", value: task.estimatedHours },
              {
                label: "Przypisana osoba:",
                value: getUserName(task.assignee?.toString()),
              },
              { label: "Stan:", value: task.state },
              {
                label: "Data startu:",
                value: task.startedAt
                  ? new Date(task.startedAt).toLocaleString()
                  : "-",
              },
              {
                label: "Data zakończenia:",
                value: task.finishedAt
                  ? new Date(task.finishedAt).toLocaleString()
                  : "-",
              },
              { label: "Roboczogodziny:", value: task.workedHours ?? "-" },
            ]}
          />
        )}

        {/* Przypisanie osoby */}
        {task && task.state === "todo" && (
          <div className="flex justify-between items-center">
            <span className="text-sm leading-none font-medium">
              Przypisz osobę:
            </span>
            <Select
              onValueChange={(userId) => onAssign(task, userId)}
              defaultValue=""
            >
              <SelectTrigger className="ml-2 w-48">
                <SelectValue placeholder="Wybierz osobę" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {users
                    .filter(
                      (u) => u.role === "devops" || u.role === "developer"
                    )
                    .map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Zmiana stanu na done */}
        {task && task.state === "doing" && (
          <Button onClick={() => onMarkDone(task)}>
            Oznacz jako zakończone
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
