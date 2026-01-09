"use client";
import Dashboard from "@/components/Dashboard"
import ProjectsList from "@/components/ProjectsList"
import { useState, useEffect } from "react";
import { getProjects, AddProjects } from "@/utils/storage";
import { Project } from "@/types/project";
import { projectsData } from "@/utils/data";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const projectList = getProjects();

    const safeList = projectList ?? [];

    if (safeList.length > 0) {
      setProjects(safeList);
    } else {
      setProjects(projectsData);
      AddProjects(projectsData);
    }
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Dashboard projects={projects} />
      <ProjectsList projects={projects} />
    </div>
  );
}
