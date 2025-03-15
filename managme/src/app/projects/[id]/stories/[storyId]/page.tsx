"use client";

import { useEffect, useState } from "react";
import { StoryService } from "@/services/storyService";
import { Story } from "@/models/story";
import { UserService } from "@/services/userService";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StoryDetailsPage({
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      StoryService.deleteStory(params.storyId);
      router.push(`/projects/${params.id}/stories`);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "doing":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  // Format the status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "doing":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href={`/projects/${params.id}/stories`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Stories
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-2">{story.name}</h1>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(story.priority)}`}
              >
                {story.priority.charAt(0).toUpperCase() +
                  story.priority.slice(1)}{" "}
                Priority
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(story.status)}`}
              >
                {formatStatus(story.status)}
              </span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Created on {new Date(story.createdAt).toLocaleDateString()} at{" "}
            {new Date(story.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-line">
            {story.description || "No description provided."}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Owner</h2>
          <p>
            {UserService.getCurrentUser().firstName}{" "}
            {UserService.getCurrentUser().lastName}
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/projects/${params.id}/stories/${story.id}/edit`}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Edit Story
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete Story
          </button>
        </div>
      </div>
    </div>
  );
}
