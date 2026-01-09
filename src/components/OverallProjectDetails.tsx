import { Project } from "@/types/project";
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface ProjectDetailsProps {
  projects: Project[];
}

const OverallProjectDetails = ({ projects }: ProjectDetailsProps) => {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (p) => p.status === "Completed"
  ).length;
  const inProgressProjects = projects.filter(
    (p) => p.status === "In Progress"
  ).length;
  const onHoldProjects = projects.filter((p) => p.status === "On Hold").length;

  const projectsInfo = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: completedProjects,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "In Progress",
      value: inProgressProjects,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "On Hold",
      value: onHoldProjects,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
      {projectsInfo.map((itm) => {
        const Icon = itm.icon;
        return (
          <div
            className="col-span-1 p-4 rounded-xl border border-gray-300 bg-white"
            key={itm.title}
          >
            <div className="flex justify-between">
              <h4>{itm.title}</h4>
              <Icon className={`h-5 w-5 ${itm.color}`} />
            </div>
            <div className="text-3xl font-bold mt-7">{itm.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default OverallProjectDetails;
