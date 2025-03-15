"use client";

import { useEffect, useState } from "react";
import { StoryService } from "@/services/storyService";
import { Story, StoryPriority, StoryStatus } from "@/models/story";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditStoryPage({
  params,
}: {
  params: { id: string; storyId: string };
}) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStory = () => {
      const foundStory = StoryService.getStoryById(params.storyId);
      if (foundStory) {
        setStory(foundStory);
      }
      setLoading(false);
    };

    fetchStory();
  }, [params.storyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (story) {
      StoryService.updateStory(story);
      router.push(`/projects/${params.id}/stories/${story.id}`);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!story) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">Story not found</p>
        <Link
          href={`/projects/${params.id}/stories`}
          className="text-blue-600 hover:underline"
        >
          Back to Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href={`/projects/${params.id}/stories/${story.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Story
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Story</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Story Name</label>
            <input
              type="text"
              value={story.name}
              onChange={(e) => setStory({ ...story, name: e.target.value })}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={story.description}
              onChange={(e) =>
                setStory({ ...story, description: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={5}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Priority</label>
            <select
              value={story.priority}
              onChange={(e) =>
                setStory({
                  ...story,
                  priority: e.target.value as StoryPriority,
                })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Status</label>
            <select
              value={story.status}
              onChange={(e) =>
                setStory({ ...story, status: e.target.value as StoryStatus })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
            <Link
              href={`/projects/${params.id}/stories/${story.id}`}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
