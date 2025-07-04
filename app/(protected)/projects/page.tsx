"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ProjectApi } from "@/models/project.model";
import { UserApi } from "@/models/user.model";

function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectApi[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [owners, setOwners] = useState<{ [key: string]: UserApi | null }>({});

  const { data: session } = useSession();
  const isGuest = session?.user?.role === "guest";

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  async function fetchOwners(projects: ProjectApi[]) {
    const result: { [key: string]: UserApi | null } = {};
    await Promise.all(
      projects.map(async (project) => {
        if (project.ownerId) {
          try {
            const res = await fetch(`/api/users/${project.ownerId}`);
            if (res.ok) {
              const user = await res.json();
              result[project._id] = user;
            } else {
              result[project._id] = null;
            }
          } catch {
            result[project._id] = null;
          }
        } else {
          result[project._id] = null;
        }
      })
    );
    setOwners(result);
  }

  useEffect(() => {
    fetchProjects();
    const stored = localStorage.getItem("activeProjectId");
    if (stored) setActiveProjectId(stored);
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      fetchOwners(projects);
    }
  }, [projects]);

  const handleSetActive = (id: string) => {
    setActiveProjectId(id);
    localStorage.setItem("activeProjectId", id);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
    if (activeProjectId === id) {
      setActiveProjectId(null);
      localStorage.removeItem("activeProjectId");
    }
  };

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p._id === id);
    if (project) {
      setEditId(id);
      setEditName(project.name);
      setEditDescription(project.description!);
      setShowDialog(true);
    }
  };

  const handleEditSave = async () => {
    if (editId !== null) {
      await fetch(`/api/projects/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });
      fetchProjects();
    }
    setShowDialog(false);
    setEditId(null);
  };

  const handleAdd = async () => {
    if (!newName) return;
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        description: newDescription,
        ownerId: session?.user?._id,
      }),
    });
    fetchProjects();
    setNewName("");
    setNewDescription("");
    setShowAddDialog(false);
  };

  return (
    <div className="p-8">
      {isGuest && (
        <div className="mb-4 p-3 bg-yellow-100 text-sm text-yellow-800 rounded">
          Tryb tylko do podglądu (guest) – nie możesz edytować ani dodawać
          projektów.
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Projekty</h1>
        <Button
          variant="outline"
          onClick={() => setShowAddDialog(true)}
          disabled={isGuest}
        >
          Utwórz projekt
        </Button>
      </div>
      <div className="space-y-4">
        {projects.map((project) => {
          const owner = owners[project._id];
          return (
            <div
              key={project._id}
              className={`flex items-center justify-between border rounded-lg p-4 ${
                activeProjectId === project._id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : ""
              }`}
            >
              <div>
                <div className="text-lg font-semibold">{project.name}</div>
                <div className="text-sm text-gray-500">
                  {project.description}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Właściciel: {owner ? owner.name : "-"}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleSetActive(project._id)}
                  disabled={activeProjectId === project._id || isGuest}
                >
                  {activeProjectId === project._id
                    ? "Aktywny"
                    : "Ustaw jako aktywny"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleEdit(project._id)}
                  disabled={isGuest}
                >
                  Edytuj
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(project._id)}
                  disabled={isGuest}
                >
                  Usuń
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dodaj nowy projekt</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Nazwa nowego projektu"
            value={newName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewName(e.target.value)
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
          <DialogFooter>
            <Button onClick={handleAdd}>Zapisz</Button>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Anuluj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edycja projektu</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Nazwa"
            value={editName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditName(e.target.value)
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
          <DialogFooter>
            <Button onClick={handleEditSave}>Zapisz</Button>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Anuluj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProjectsPage;
