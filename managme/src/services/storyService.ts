import { UserService } from "./userService";
import { generateUniqueId } from "@/utils/idGenerator";

import { Story, StoryPriority, StoryStatus } from "@/models/story";

export class StoryService {
  private static readonly STORAGE_KEY = "stories";

  static getAllStories(): Story[] {
    const stories = localStorage.getItem(this.STORAGE_KEY);
    return stories ? JSON.parse(stories) : [];
  }

  static getStoriesByProjectId(projectId: string): Story[] {
    const stories = this.getAllStories();
    return stories.filter((story) => story.projectId === projectId);
  }

  static getStoryById(id: string): Story | undefined {
    const stories = this.getAllStories();
    return stories.find((story) => story.id === id);
  }

  static createStory(
    storyData: Omit<Story, "id" | "createdAt" | "ownerId">,
  ): Story {
    const stories = this.getAllStories();

    const newStory: Story = {
      id: generateUniqueId(),
      ...storyData,
      createdAt: new Date().toISOString(),
      ownerId: UserService.getCurrentUser().id,
    };

    stories.push(newStory);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));

    return newStory;
  }

  static updateStory(updatedStory: Story): void {
    const stories = this.getAllStories();
    const storyIndex = stories.findIndex(
      (story) => story.id === updatedStory.id,
    );

    if (storyIndex !== -1) {
      stories[storyIndex] = updatedStory;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }
  }

  static deleteStory(id: string): void {
    const stories = this.getAllStories();
    const filteredStories = stories.filter((story) => story.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredStories));
  }

  static getStoriesByStatus(projectId: string, status: StoryStatus): Story[] {
    const projectStories = this.getStoriesByProjectId(projectId);
    return projectStories.filter((story) => story.status === status);
  }
}
