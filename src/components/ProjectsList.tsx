import { Project } from "@/types/project";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";

interface ProjectsListProps {
  projects: Project[];
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  return (
    <div className="mt-8">
      <h3 className="font-bold text-2xl mb-6">All Projects</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/view/${project.id}`}>
            <div className="">
              <ProjectCard project={project} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
