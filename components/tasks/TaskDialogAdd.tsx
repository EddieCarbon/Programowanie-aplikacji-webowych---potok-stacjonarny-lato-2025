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
import React from "react";

interface TaskDialogAddProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: {
    name: string;
    description: string;
    priority: string;
    story: string;
    estimatedHours: number;
  };
  setNewTask: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      priority: string;
      story: string;
      estimatedHours: number;
    }>
  >;
  stories: StoryApi[];
  onSave: () => void;
  onCancel: () => void;
}

export function TaskDialogAdd({
  open,
  onOpenChange,
  newTask,
  setNewTask,
  stories,
  onSave,
  onCancel,
}: TaskDialogAddProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj zadanie</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nazwa zadania"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          className="mb-2"
        />
        <Input
          placeholder="Opis"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="mb-2"
        />
        <Select
          value={newTask.priority}
          onValueChange={(v) => setNewTask({ ...newTask, priority: v })}
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
          value={newTask.story || undefined}
          onValueChange={(v) => setNewTask({ ...newTask, story: v })}
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
          value={newTask.estimatedHours}
          onChange={(e) =>
            setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })
          }
          className="mb-2"
        />
        <DialogFooter>
          <Button onClick={onSave}>Zapisz</Button>
          <Button variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
