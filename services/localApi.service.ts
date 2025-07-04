type WithId = { id: number };

export class LocalApiService<T extends WithId> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  getAll(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  getById(id: number): T | undefined {
    return this.getAll().find((item) => item.id === id);
  }

  create(item: Omit<T, "id">): T {
    const items = this.getAll();
    const newId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newItem = { ...item, id: newId } as T;
    items.push(newItem);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return newItem;
  }

  update(id: number, data: Partial<T>): T | undefined {
    const items = this.getAll();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...data };
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return items[idx];
  }

  delete(id: number): void {
    const items = this.getAll().filter((i) => i.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  setAll(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
