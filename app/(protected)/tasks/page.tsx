"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserApi } from "@/models/user.model";
import { TaskApi } from "@/models/task.model";
import { StoryApi } from "@/models/story.model";
import { KanbanColumn } from "@/components/tasks/KanbanColumn";
import { TaskDialogAdd } from "@/components/tasks/TaskDialogAdd";
import { TaskDialogEdit } from "@/components/tasks/TaskDialogEdit";
import { TaskDialogDetails } from "@/components/tasks/TaskDialogDetails";

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskApi[]>([]);
  const [stories, setStories] = useState<StoryApi[]>([]);
  const [users, setUsers] = useState<UserApi[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetails, setShowDetails] = useState<TaskApi | null>(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    priority: "medium",
    story: "",
    estimatedHours: 1,
  });
  const [editTask, setEditTask] = useState<TaskApi | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchStories();
    fetchUsers();
    const stored = localStorage.getItem("activeProjectId");
    if (stored) setActiveProjectId(stored);
  }, []);

  async function fetchTasks() {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  }
  async function fetchStories() {
    const res = await fetch("/api/stories");
    const data = await res.json();
    setStories(data);
  }
  async function fetchUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  }

  const filteredTasks = tasks.filter((t) => {
    const story = stories.find((s) => s._id === t.story?.toString());
    return story && story.project?.toString() === activeProjectId;
  });

  const kanbanColumns = [
    { key: "todo", label: "Do zrobienia" },
    { key: "doing", label: "W trakcie" },
    { key: "done", label: "Zamknięte" },
  ];

  function tasksByStatus(status: string) {
    return filteredTasks.filter((t) => t.state === status);
  }

  async function handleAdd() {
    if (!newTask.name || !newTask.story) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newTask, state: "todo" }),
    });
    setShowAddDialog(false);
    setNewTask({
      name: "",
      description: "",
      priority: "medium",
      story: "",
      estimatedHours: 1,
    });
    fetchTasks();
  }

  async function handleEditSave() {
    if (!editTask) return;
    await fetch(`/api/tasks/${editTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTask),
    });
    setShowEditDialog(false);
    setEditTask(null);
    fetchTasks();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  }

  async function handleAssign(task: TaskApi, userId: string) {
    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        assignee: userId,
        state: "doing",
        startedAt: new Date().toISOString(),
      }),
    });
    setShowDetails(null);
    fetchTasks();
  }

  async function handleMarkDone(task: TaskApi) {
    await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...task,
        state: "done",
        finishedAt: new Date().toISOString(),
      }),
    });
    setShowDetails(null);
    fetchTasks();
  }

  function getUserName(id?: string) {
    const user = users.find((u) => u._id === (id?.toString() || ""));
    return user ? user.name : "-";
  }
  function getStoryName(id?: string) {
    const story = stories.find((s) => s._id === (id?.toString() || ""));
    return story ? story.name : "-";
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Zadania</h1>
        <Button variant={"outline"} onClick={() => setShowAddDialog(true)}>
          Dodaj zadanie
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kanbanColumns.map((col) => (
          <KanbanColumn
            key={col.key}
            label={col.label}
            tasks={tasksByStatus(col.key)}
            getUserName={getUserName}
            getStoryName={getStoryName}
            onEdit={(task, e) => {
              e.stopPropagation();
              setEditTask(task);
              setShowEditDialog(true);
            }}
            onDelete={(task, e) => {
              e.stopPropagation();
              handleDelete(task._id);
            }}
            onCardClick={setShowDetails}
          />
        ))}
      </div>
      <TaskDialogAdd
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        newTask={newTask}
        setNewTask={setNewTask}
        stories={stories}
        onSave={handleAdd}
        onCancel={() => setShowAddDialog(false)}
      />
      <TaskDialogEdit
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editTask={editTask}
        setEditTask={setEditTask}
        stories={stories}
        onSave={handleEditSave}
        onCancel={() => setShowEditDialog(false)}
      />
      <TaskDialogDetails
        open={!!showDetails}
        onOpenChange={() => setShowDetails(null)}
        task={showDetails}
        users={users}
        onAssign={handleAssign}
        onMarkDone={handleMarkDone}
        getUserName={getUserName}
        getStoryName={getStoryName}
      />
    </div>
  );
}
