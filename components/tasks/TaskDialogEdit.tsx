import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { StoryApi } from "@/models/story.model";
import { TaskApi } from "@/models/task.model";
import React from "react";

interface TaskDialogEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTask: TaskApi | null;
  setEditTask: React.Dispatch<React.SetStateAction<TaskApi | null>>;
  stories: StoryApi[];
  onSave: () => void;
  onCancel: () => void;
}

export function TaskDialogEdit({
  open,
  onOpenChange,
  editTask,
  setEditTask,
  stories,
  onSave,
  onCancel,
}: TaskDialogEditProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edycja zadania</DialogTitle>
        </DialogHeader>
        {editTask && (
          <>
            <Input
              placeholder="Nazwa zadania"
              value={editTask.name}
              onChange={(e) =>
                setEditTask({ ...editTask, name: e.target.value })
              }
              className="mb-2"
            />
            <Input
              placeholder="Opis"
              value={editTask.description ?? ""}
              onChange={(e) =>
                setEditTask({ ...editTask, description: e.target.value })
              }
              className="mb-2"
            />
            <Select
              value={editTask.priority}
              onValueChange={(v) =>
                setEditTask({
                  ...editTask,
                  priority: v as "low" | "medium" | "high",
                })
              }
            >
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Priorytet" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priorytet</SelectLabel>
                  <SelectItem value="low">Niski</SelectItem>
                  <SelectItem value="medium">Średni</SelectItem>
                  <SelectItem value="high">Wysoki</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={editTask.story ? editTask.story.toString() : undefined}
              onValueChange={(v) => setEditTask({ ...editTask, story: v })}
            >
              <SelectTrigger className="w-full mb-2">
                <SelectValue placeholder="Historyjka" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Historyjka</SelectLabel>
                  {stories.map((s) => (
                    <SelectItem key={s._id} value={s._id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={1}
              placeholder="Szacowane godziny"
              value={editTask.estimatedHours ?? 1}
              onChange={(e) =>
                setEditTask({
                  ...editTask,
                  estimatedHours: Number(e.target.value),
                })
              }
              className="mb-2"
            />
            <DialogFooter>
              <Button onClick={onSave}>Zapisz</Button>
              <Button variant="outline" onClick={onCancel}>
                Anuluj
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
