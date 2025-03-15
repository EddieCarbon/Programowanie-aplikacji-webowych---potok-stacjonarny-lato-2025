"use client";

import { useEffect, useState } from "react";
import { StoryService } from "@/services/storyService";
import { Story, StoryPriority, StoryStatus } from "@/models/story";
import { ProjectService } from "@/services/projectService";
import { Project } from "@/models/project";
import { ActiveProjectService } from "@/services/activeProjectService";
import StoryCard from "./_componets/StoryCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StoriesPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [todoStories, setTodoStories] = useState<Story[]>([]);
  const [doingStories, setDoingStories] = useState<Story[]>([]);
  const [doneStories, setDoneStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<StoryStatus | "all">("all");
  const router = useRouter();

  useEffect(() => {
    const fetchProject = () => {
      const foundProject = ProjectService.getProjectById(params.id);
      if (foundProject) {
        setProject(foundProject);
        // Ustaw ten projekt jako aktywny
        ActiveProjectService.setActiveProject(foundProject.id);
        loadStories(foundProject.id);
      }
    };

    fetchProject();
  }, [params.id]);

  const loadStories = (projectId: string) => {
    setTodoStories(StoryService.getStoriesByStatus(projectId, "todo"));
    setDoingStories(StoryService.getStoriesByStatus(projectId, "doing"));
    setDoneStories(StoryService.getStoriesByStatus(projectId, "done"));
  };

  const handleDeleteStory = (storyId: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      StoryService.deleteStory(storyId);
      if (project) {
        loadStories(project.id);
      }
    }
  };

  const handleStatusChange = (story: Story, newStatus: StoryStatus) => {
    const updatedStory = { ...story, status: newStatus };
    StoryService.updateStory(updatedStory);
    if (project) {
      loadStories(project.id);
    }
  };

  if (!project) {
    return <div className="p-6 text-center">Loading project data...</div>;
  }

  const renderStoriesByFilter = () => {
    if (filter === "all") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h2 className="font-semibold text-xl mb-4 text-center">To Do</h2>
            <div className="space-y-4">
              {todoStories.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No stories to do
                </p>
              ) : (
                todoStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onDelete={handleDeleteStory}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h2 className="font-semibold text-xl mb-4 text-center">
              In Progress
            </h2>
            <div className="space-y-4">
              {doingStories.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No stories in progress
                </p>
              ) : (
                doingStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onDelete={handleDeleteStory}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <h2 className="font-semibold text-xl mb-4 text-center">Done</h2>
            <div className="space-y-4">
              {doneStories.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No stories done
                </p>
              ) : (
                doneStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onDelete={handleDeleteStory}
                    onStatusChange={handleStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      );
    } else {
      let stories: Story[] = [];
      if (filter === "todo") stories = todoStories;
      else if (filter === "doing") stories = doingStories;
      else if (filter === "done") stories = doneStories;

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-6">
              No stories found with status: {filter}
            </p>
          ) : (
            stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onDelete={handleDeleteStory}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href={`/projects/${project.id}`}
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Project
          </Link>
          <h1 className="text-3xl font-bold">{project.name}: Stories</h1>
        </div>
        <Link
          href={`/projects/${project.id}/stories/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add New Story
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("todo")}
            className={`px-3 py-1 rounded ${filter === "todo" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            To Do ({todoStories.length})
          </button>
          <button
            onClick={() => setFilter("doing")}
            className={`px-3 py-1 rounded ${filter === "doing" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            In Progress ({doingStories.length})
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-3 py-1 rounded ${filter === "done" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
          >
            Done ({doneStories.length})
          </button>
        </div>

        {renderStoriesByFilter()}
      </div>
    </div>
  );
}
