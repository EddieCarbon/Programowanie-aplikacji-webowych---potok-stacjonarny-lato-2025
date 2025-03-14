"use client";

import { useEffect, useState } from "react";
import { Project, ProjectService } from "@/services/projectService";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProjectPage({
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
      }
      setLoading(false);
    };

    fetchProject();
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (project) {
      ProjectService.updateProject(project);
      router.push(`/projects/${project.id}`);
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
        <Link
          href={`/projects/${project.id}`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Project
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Project</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              required
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={project.description}
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={5}
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
            <Link
              href={`/projects/${project.id}`}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
