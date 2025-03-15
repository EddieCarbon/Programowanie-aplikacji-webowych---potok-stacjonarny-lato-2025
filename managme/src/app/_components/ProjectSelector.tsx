"use client";

import { useEffect, useState } from "react";
import { ProjectService } from "@/services/projectService";
import { Project } from "@/models/project";
import { ActiveProjectService } from "@/services/activeProjectService";
import { useRouter } from "next/navigation";

export default function ProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProjects = () => {
      const allProjects = ProjectService.getAllProjects();
      setProjects(allProjects);

      const currentActiveProject = ActiveProjectService.getActiveProject();
      setActiveProjectId(currentActiveProject);
    };

    loadProjects();
  }, []);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId === "") {
      ActiveProjectService.clearActiveProject();
      setActiveProjectId(null);
    } else {
      ActiveProjectService.setActiveProject(selectedId);
      setActiveProjectId(selectedId);
      router.push(`/projects/${selectedId}/stories`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="project-select" className="text-sm font-medium">
        Active Project:
      </label>
      <select
        id="project-select"
        value={activeProjectId || ""}
        onChange={handleProjectChange}
        className="border rounded py-1 px-2 text-sm bg-gray-700 text-white"
      >
        <option value="">Select a project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
}
