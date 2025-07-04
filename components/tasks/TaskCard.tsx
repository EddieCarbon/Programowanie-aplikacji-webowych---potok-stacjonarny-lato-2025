import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TaskApi } from "@/models/task.model";
import React from "react";

interface TaskCardProps {
  task: TaskApi;
  getUserName: (id?: string) => string;
  getStoryName: (id?: string) => string;
  onEdit: (task: TaskApi, e: React.MouseEvent) => void;
  onDelete: (task: TaskApi, e: React.MouseEvent) => void;
  onClick: (task: TaskApi) => void;
}

export function TaskCard({
  task,
  getUserName,
  getStoryName,
  onEdit,
  onDelete,
  onClick,
}: TaskCardProps) {
  return (
    <div
      className="bg-white dark:bg-zinc-800 rounded shadow p-3 mb-2 cursor-pointer"
      onClick={() => onClick(task)}
    >
      <div className="font-bold">{task.name}</div>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-800"
        >
          {getStoryName(task.story?.toString())}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-sky-500 text-white dark:bg-sky-800"
        >
          {getUserName(task.assignee?.toString() || "")}
        </Badge>
        <Badge
          variant="secondary"
          className={
            task.state === "todo"
              ? "bg-rose-500 text-white dark:bg-rose-800"
              : task.state === "doing"
              ? "bg-orange-500 text-white dark:bg-orange-800"
              : "bg-emerald-500 text-white dark:bg-emerald-800"
          }
        >
          {task.state === "todo"
            ? "Do zrobienia"
            : task.state === "doing"
            ? "W trakcie"
            : "Zamknięte"}
        </Badge>
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <Button size={"sm"} variant="outline" onClick={(e) => onEdit(task, e)}>
          Edytuj
        </Button>
        <Button
          size={"sm"}
          variant="destructive"
          onClick={(e) => onDelete(task, e)}
        >
          Usuń
        </Button>
      </div>
    </div>
  );
}
