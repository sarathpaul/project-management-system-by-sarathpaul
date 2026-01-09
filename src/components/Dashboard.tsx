import Link from "next/link";
import Button from "@/components/ui/Button";
import { Project } from "@/types/project";
import OverallProjectDetails from "@/components/OverallProjectDetails";

interface DashboardProps {
  projects: Project[];
}

const Dashboard = ({ projects }: DashboardProps) => {
  return (
    <div>
      <div className="grid md:grid-cols-4">
        <div className="md:col-span-3">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Track, manage, and deliver projects efficiently
          </p>
        </div>
        <div className="flex mt-5 md:mt-0 md:justify-end">
          <Link href="/projects/add">
            <Button variant="primary">Create Project</Button>
          </Link>
        </div>
      </div>
      <OverallProjectDetails projects={projects} />
    </div>
  );
};

export default Dashboard;
