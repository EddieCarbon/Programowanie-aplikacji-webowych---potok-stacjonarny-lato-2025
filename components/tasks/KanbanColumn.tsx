import { TaskApi } from "@/models/task.model";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  label: string;
  tasks: TaskApi[];
  getUserName: (id?: string) => string;
  getStoryName: (id?: string) => string;
  onEdit: (task: TaskApi, e: React.MouseEvent) => void;
  onDelete: (task: TaskApi, e: React.MouseEvent) => void;
  onCardClick: (task: TaskApi) => void;
}

export function KanbanColumn({
  label,
  tasks,
  getUserName,
  getStoryName,
  onEdit,
  onDelete,
  onCardClick,
}: KanbanColumnProps) {
  return (
    <div className="bg-slate-50 dark:bg-zinc-900 rounded p-2 min-h-[300px]">
      <h2 className="text-xl font-semibold mb-2">{label}</h2>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          getUserName={getUserName}
          getStoryName={getStoryName}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
