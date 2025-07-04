"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StoryApi } from "@/models/story.model";
import { UserApi } from "@/models/user.model";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryApi[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<string>("medium");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<string>("medium");
  const [editStatus, setEditStatus] = useState<string>("todo");
  const [filterStatus, setFilterStatus] = useState<string | "all">("all");
  const [owners, setOwners] = useState<{ [key: string]: UserApi | null }>({});

  const { data: session } = useSession();
  const isGuest = session?.user?.role === "guest";

  async function fetchStories() {
    const res = await fetch("/api/stories");
    const data = await res.json();
    setStories(data);
  }

  useEffect(() => {
    fetchStories();
    const stored = localStorage.getItem("activeProjectId");
    if (stored) setActiveProjectId(stored);
  }, []);

  useEffect(() => {
    if (stories.length > 0) {
      fetchOwners(stories);
    }
  }, [stories]);

  async function fetchOwners(stories: StoryApi[]) {
    const result: { [key: string]: UserApi | null } = {};
    await Promise.all(
      stories.map(async (story) => {
        if (story.owner) {
          try {
            const res = await fetch(`/api/users/${story.owner}`);
            if (res.ok) {
              const user = await res.json();
              result[story._id] = user;
            } else {
              result[story._id] = null;
            }
          } catch {
            result[story._id] = null;
          }
        } else {
          result[story._id] = null;
        }
      })
    );
    setOwners(result);
  }

  const filteredStories = stories.filter(
    (s) =>
      s.project.toString() === activeProjectId &&
      (filterStatus === "all" || s.state === filterStatus)
  );

  const handleAdd = async () => {
    if (!newTitle || !activeProjectId) return;
    await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newTitle,
        description: newDescription,
        priority: newPriority,
        project: activeProjectId,
        state: "todo",
        owner: session?.user?._id,
      }),
    });
    fetchStories();
    setNewTitle("");
    setNewDescription("");
    setNewPriority("medium");
    setShowAddDialog(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/stories/${id}`, { method: "DELETE" });
    fetchStories();
  };

  const handleEdit = (id: string) => {
    const story = stories.find((s) => s._id === id);
    if (story) {
      setEditId(id);
      setEditTitle(story.name);
      setEditDescription(story.description!);
      setEditPriority(story.priority);
      setEditStatus(story.state);
      setShowEditDialog(true);
    }
  };

  const handleEditSave = async () => {
    if (editId !== null) {
      await fetch(`/api/stories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editTitle,
          description: editDescription,
          priority: editPriority,
          state: editStatus,
        }),
      });
      fetchStories();
    }
    setShowEditDialog(false);
    setEditId(null);
  };

  return (
    <div className="p-8">
      {isGuest && (
        <div className="mb-4 p-3 bg-yellow-100 text-sm text-yellow-800 rounded">
          Tryb tylko do podglądu (guest) – nie możesz edytować ani dodawać
          historii.
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Historie</h1>
        <div className="flex gap-4 items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Stan</SelectLabel>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="todo">Do zrobienia</SelectItem>
                <SelectItem value="doing">W trakcie</SelectItem>
                <SelectItem value="done">Zamknięte</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setShowAddDialog(true)}
            disabled={isGuest || !activeProjectId}
          >
            Dodaj historię
          </Button>
        </div>
      </div>
      {!activeProjectId ? (
        <div className="text-base text-center text-slate-300">
          Najpierw wybierz aktywny projekt, aby zobaczyć historie.
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="text-center text-base text-slate-300">
          Brak historii dla tego projektu.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStories.map((story) => {
            const owner = owners[story._id];
            return (
              <div
                key={story._id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <div className="text-lg font-semibold">{story.name}</div>
                  <div className="text-sm text-gray-500">
                    {story.description}
                  </div>
                  <div className="flex w-full flex-wrap gap-2 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-500 text-white dark:bg-blue-600"
                    >
                      Priorytet:{" "}
                      {story.priority === "low"
                        ? "Niski"
                        : story.priority === "medium"
                        ? "Średni"
                        : "Wysoki"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-500 text-white dark:bg-green-600"
                    >
                      Stan:{" "}
                      {story.state === "todo"
                        ? "Do zrobienia"
                        : story.state === "doing"
                        ? "W trakcie"
                        : "Zamknięte"}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-gray-500 text-white dark:bg-gray-600"
                    >
                      Właściciel: {owner ? owner.name : "-"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(story._id)}
                    disabled={isGuest}
                  >
                    Edytuj
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(story._id)}
                    disabled={isGuest}
                  >
                    Usuń
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog dodawania historii */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj nową historię</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Tytuł"
            value={newTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTitle(e.target.value)
            }
            className="mb-2"
          />
          <Input
            placeholder="Opis"
            value={newDescription}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewDescription(e.target.value)
            }
            className="mb-2"
          />
          <Select value={newPriority} onValueChange={setNewPriority}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Priorytet" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priorytet</SelectLabel>
                <SelectItem value="low">Niski</SelectItem>
                <SelectItem value="medium">Średni</SelectItem>
                <SelectItem value="high">Wysoki</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleAdd}>Zapisz</Button>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Anuluj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog edycji historii */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edycja historii</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Tytuł"
            value={editTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditTitle(e.target.value)
            }
            className="mb-2"
          />
          <Input
            placeholder="Opis"
            value={editDescription}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditDescription(e.target.value)
            }
            className="mb-2"
          />
          <Select value={editPriority} onValueChange={setEditPriority}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Priorytet" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Priorytet</SelectLabel>
                <SelectItem value="low">Niski</SelectItem>
                <SelectItem value="medium">Średni</SelectItem>
                <SelectItem value="high">Wysoki</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Status (shadcn Select) */}
          <Select value={editStatus} onValueChange={setEditStatus}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="todo">Do zrobienia</SelectItem>
                <SelectItem value="doing">W trakcie</SelectItem>
                <SelectItem value="done">Zamknięte</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleEditSave}>Zapisz</Button>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Anuluj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
