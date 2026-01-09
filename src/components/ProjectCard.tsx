import { useState, useEffect } from "react";
import { Project } from "@/types/project";
import Badge from "./ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { userList } from "@/utils/data";
import { User } from "@/types/user";

interface ProjectCardProps {
  project: Project;
}

const getProjectStatusBadge = (status: string) => {
  if (status === "Planned") {
    return <Badge variant="default">{status}</Badge>;
  } else if (status === "In Progress") {
    return <Badge variant="info">{status}</Badge>;
  } else if (status === "Completed") {
    return <Badge variant="success">{status}</Badge>;
  } else if (status === "On Hold") {
    return <Badge variant="warning">{status}</Badge>;
  } else {
    return <Badge variant="default">Unknown</Badge>;
  }
};

const getPriorityBadge = (status: string) => {
  if (status === "Low") {
    return <Badge variant="success">{status}</Badge>;
  } else if (status === "Medium") {
    return <Badge variant="warning">{status}</Badge>;
  } else if (status === "High") {
    return <Badge variant="danger">{status}</Badge>;
  } else {
    return <Badge variant="default">Unknown</Badge>;
  }
};

const getCompletionPercentage = (project: Project) => {
  const totalTasks = project.tasks?.length ?? 0;
  if (totalTasks === 0) return 0;
  const completedTasks =
    project.tasks?.filter((t) => t.status === "Done").length ?? 0;
  return Math.round((completedTasks / totalTasks) * 100);
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [users, setUsers] = useState<User[]>(userList);

  const assignedInitials = users
    .filter((user) => project.assigneeIds.includes(user.id)) // Only keep users whose ID is in the list
    .map((user) => user.initials);

  return (
    <div className="bg-white gap-6 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <h2 className="mb-2 text-lg font-semibold">{project.name}</h2>
      <p className="text-gray-600 text-sm mb-4">{project.description}</p>
      <div className="flex gap-2 mb-4">
        <span>{getProjectStatusBadge(project.status)}</span>
        <span>{getPriorityBadge(project.priority)}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-4 text-gray-600 text-sm">
          <p>Progress</p>
          <p>{getCompletionPercentage(project)}%</p>
        </div>
        <ProgressBar progress={getCompletionPercentage(project)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600 text-sm">Tasks</label>
          <p>{project.tasks?.length ? project.tasks?.length : "-"}</p>
        </div>
        <div>
          <label className="text-gray-600 text-sm">Due Date</label>
          <p className="font-medium">
            {project.endDate ? project.endDate : "-"}
          </p>
        </div>
        <div className="col-span-2">
          <div className="text-gray-600 text-sm mb-2">Assignees</div>
          <div className="font-medium">
            <div className="flex items-center -space-x-3">
              {assignedInitials.length !== 0 &&
                assignedInitials.map((itm) => (
                  <div key={itm} className="relative inline-flex items-center justify-center w-9 h-9 text-xs font-medium text-white bg-blue-500 border-2 border-white rounded-full hover:z-10 transition-all cursor-default">
                    <p>{itm}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
