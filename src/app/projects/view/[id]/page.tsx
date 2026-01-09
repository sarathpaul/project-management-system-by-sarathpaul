"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { getProjects, AddProjects } from "@/utils/storage";
import { Project, Task } from "@/types/project";
import { User } from "@/types/user";
import { userList } from "@/utils/data";
import ProgressBar from "@/components/ui/ProgressBar";

export default function page() {
  const params = useParams();
  const id = params.id;
  const [project, setProject] = useState<Project>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>(userList);
  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState<Task>({
    id: "",
    name: "",
    description: "",
    assignedUserId: "",
    status: "Todo",
  });

  const assignedInitials = users
    .filter((user) => project?.assigneeIds.includes(user.id)) // Only keep users whose ID is in the list
    .map((user) => user.initials);

  useEffect(() => {
    const projectList = getProjects();

    const safeList = projectList ?? [];

    if (safeList.length > 0) {
      setProject(safeList.find((itm) => itm.id == id));
      setProjects(safeList);
    }
  }, []);

  const getCompletionPercentage = (project: Project) => {
    const totalTasks = project.tasks?.length ?? 0;
    if (totalTasks === 0) return 0;
    const completedTasks =
      project.tasks?.filter((t) => t.status === "Done").length ?? 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const handleChange = (key: keyof Task, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEdit = (task: Task) => {
    setMode("edit");
    setFormData({
      id: task.id,
      name: task.name,
      description: task.description,
      assignedUserId: task.assignedUserId,
      status: task.status,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    // 1. Map through projects to find the parent
    const updatedProjects = projects.map((p) => {
      if (p.id === project?.id) {
        return {
          ...p,
          // 2. Filter out the task with the matching ID
          tasks: p.tasks?.filter((t) => t.id !== taskId) || [],
        };
      }
      return p;
    });

    // 3. Update both State and LocalStorage
    AddProjects(updatedProjects);

    // 4. Update the current project view so the table refreshes
    const refreshedProject = updatedProjects.find((p) => p.id === project?.id);
    if (refreshedProject) setProject(refreshedProject);
    setProjects(updatedProjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.assignedUserId || !formData.description)
      return;

    try {
      let finalProjectsList;

      if (mode === "edit") {
        finalProjectsList = projects.map((p) => {
          if (p.id === project?.id) {
            return {
              ...p,
              tasks: p.tasks?.map((t) =>
                t.id === formData.id ? { ...t, ...formData } : t
              ),
            };
          }
          return p;
        });
      } else {
        const newTask = { ...formData, id: Date.now().toString() };
        finalProjectsList = projects.map((p) => {
          if (p.id === project?.id) {
            return { ...p, tasks: [...(p.tasks || []), newTask] };
          }
          return p;
        });
      }
      AddProjects(finalProjectsList);
      setFormData({
        id: "",
        name: "",
        description: "",
        assignedUserId: "",
        status: "Todo",
      });
      setMode("add");
      const currentProject = finalProjectsList.find((itm) => itm.id === id);
      if (currentProject) setProject(currentProject);
      setProjects(finalProjectsList);
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" leftIcon={<ArrowLeft />}>
            Back to Dashboard
          </Button>
        </Link>

        <Link href={`/projects/edit/${id}`}>
          <Button variant="primary">Edit Project</Button>
        </Link>
      </div>
      <div className="bg-white rounded-b-lg p-6">
        <h2 className="font-bold text-2xl mb-4">Project Details</h2>
        <h3 className="font-medium text-gray-800 text-lg mb-4">
          {project?.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{project?.description}</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div>
            <div className="flex gap-2">
              <CalendarDays />
              <span className="text-sm text-gray-600 mb-4">Timeline</span>
            </div>
            <div className="flex gap-2 text-sm text-gray-600 mb-2">
              <p>Start Date: </p>
              <p>{project?.startDate}</p>
            </div>
            <div className="flex gap-2 text-sm text-gray-600">
              <p>End Date: </p>
              <p>{project?.endDate}</p>
            </div>
          </div>

          <div>
            <div className="flex gap-2">
              <Users />
              <span className="text-sm text-gray-600 mb-4">Team</span>
            </div>
            <div className="flex gap-2 mb-2 text-sm">
              <p className="text-gray-600">Manager: </p>
              {users?.find((itm) => itm.id === project?.managerId)?.name ||
                "No Manager Assigned"}
            </div>
            <div className="font-medium">
              <div className="flex items-center -space-x-3">
                {assignedInitials.length !== 0 &&
                  assignedInitials.map((itm) => (
                    <div
                      key={itm}
                      className="relative inline-flex items-center justify-center w-9 h-9 text-xs font-medium text-white bg-blue-500 border-2 border-white rounded-full hover:z-10 transition-all cursor-default"
                    >
                      <p>{itm}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-2">Overall Tasks Progress</p>
            <div className="flex justify-between mb-1 text-gray-600 text-sm">
              {project && <p>{getCompletionPercentage(project)}% Completed</p>}
            </div>
            {project && (
              <ProgressBar progress={getCompletionPercentage(project)} />
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-b-lg p-6 mt-8">
        <h3 className="font-medium text-gray-800 text-lg mb-4">
          Tasks: {project?.tasks?.length}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 p-6 rounded-lg"
        >
          <div className="grid grid-cols-2 gap-5">
            <div className="">
              <label htmlFor="name">Task Name</label>
              <input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border border-gray-300 rounded-sm w-full px-4 py-2 mt-2"
              />
            </div>

            <div className="">
              <label htmlFor="assignee">Assign To</label>
              <select
                value={formData.assignedUserId}
                onChange={(e) => handleChange("assignedUserId", e.target.value)}
                name="assignee"
                id="assignee"
                className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
              >
                <option value="">Select</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor="description">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                id="description"
                className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
              />
            </div>
            <div>
              <label htmlFor="status">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                name="status"
                id="status"
                className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
              >
                <option value="">Select</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end my-6">
            <Button variant="primary" size="lg">
              {mode === "add" ? "Create Task" : "Edit Task"}
            </Button>
          </div>
        </form>

        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  No.
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Task Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Description
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Assignee
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {project?.tasks &&
                project?.tasks.map((itm, idx) => (
                  <tr
                    key={itm.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-700">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {itm.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {itm.description}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {userList.find((user) => user.id === itm.assignedUserId)
                        ?.name || "Unassigned"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{itm.status}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(itm)}
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteTask(itm.id || "")}
                          size="sm"
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

              {project?.tasks && project.tasks.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500 italic"
                  >
                    No tasks added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
