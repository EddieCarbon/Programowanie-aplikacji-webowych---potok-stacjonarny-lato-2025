import { Story, StoryStatus } from "@/models/story";
import Link from "next/link";

interface StoryCardProps {
  story: Story;
  onDelete: (id: string) => void;
  onStatusChange: (story: Story, newStatus: StoryStatus) => void;
}

export default function StoryCard({
  story,
  onDelete,
  onStatusChange,
}: StoryCardProps) {
  const priorityClasses = {
    low: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    high: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(story, e.target.value as StoryStatus);
  };

  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{story.name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${priorityClasses[story.priority]}`}
        >
          {story.priority}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {story.description}
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Created: {new Date(story.createdAt).toLocaleDateString()}
          </span>

          <select
            value={story.status}
            onChange={handleStatusChange}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Link
            href={`/projects/${story.projectId}/stories/${story.id}`}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
          >
            View
          </Link>
          <Link
            href={`/projects/${story.projectId}/stories/${story.id}/edit`}
            className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(story.id)}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
