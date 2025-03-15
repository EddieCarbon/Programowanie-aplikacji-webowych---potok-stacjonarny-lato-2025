export class ActiveProjectService {
  private static readonly STORAGE_KEY = "activeProject";

  static getActiveProject(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static setActiveProject(projectId: string): void {
    localStorage.setItem(this.STORAGE_KEY, projectId);
  }

  static clearActiveProject(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
