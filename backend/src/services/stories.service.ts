import type { Story } from "../models/story/story.model";
import type { WithoutId } from "mongodb";
import { dbService } from "./db.service";

class StoriesService {
  private collectionName = "stories";
  getStories(query: Record<string, any>) {
    return dbService.find<Story>(query, this.collectionName);
  }
  getStory(id: string) {
    return dbService.findOne<Story>(id, this.collectionName);
  }
  async createStory(story: WithoutId<Story>) {
    return dbService.create(story, this.collectionName);
  }
  updateStory(id: string, story: WithoutId<Story>) {
    return dbService.replace(id, story, this.collectionName);
  }
  patchStory(id: string, story: Partial<WithoutId<Story>>) {
    return dbService.patch(id, story, this.collectionName);
  }
  deleteStory(id: string) {
    return dbService.delete(id, this.collectionName);
  }
}

export const storiesService = new StoriesService();
