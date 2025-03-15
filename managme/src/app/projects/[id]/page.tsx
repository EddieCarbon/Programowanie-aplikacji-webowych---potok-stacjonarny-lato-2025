"use client";

import { useEffect, useState } from "react";
import { ProjectService } from "@/services/projectService";
import { Project } from "@/models/project";
import { ActiveProjectService } from "@/services/activeProjectService";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = () => {
      const foundProject = ProjectService.getProjectById(params.id);
      if (foundProject) {
        setProject(foundProject);
        // Ustaw ten projekt jako aktywny przy wejściu na jego stronę
        ActiveProjectService.setActiveProject(foundProject.id);
      }
      setLoading(false);
    };

    fetchProject();
  }, [params.id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      ProjectService.deleteProject(params.id);
      ActiveProjectService.clearActiveProject(); // Wyczyść aktywny projekt po usunięciu
      router.push("/projects");
    }
  };

  const handleSetActive = () => {
    if (project) {
      ActiveProjectService.setActiveProject(project.id);
      alert("Project has been set as active");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">Project not found</p>
        <Link href="/projects" className="text-blue-600 hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/projects" className="text-blue-600 hover:underline">
          ← Back to Projects
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-line">
            {project.description || "No description provided."}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleSetActive}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Set as Active Project
          </button>

          <Link
            href={`/projects/${project.id}/stories`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            View User Stories
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/projects/${project.id}/edit`}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Edit Project
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
}
