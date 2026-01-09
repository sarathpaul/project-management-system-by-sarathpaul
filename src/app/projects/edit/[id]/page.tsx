"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { User } from "@/types/user";
import { Project, ProjectStatus, Priority } from "@/types/project";
import { userList, projectsData } from "@/utils/data";
import { getUsers, AddUser, AddProjects, getProjects } from "@/utils/storage";
import { Task, Reminder } from "@/types/project";
import MultiSelect from "@/components/ui/MultiSelect";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  assigneeIds: string[];
  managerId: string;
  status: ProjectStatus;
  priority: Priority;
  tasks: Task[];
  reminders: Reminder[];
}

const page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project>();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAssinees, setSelectedAssinees] = useState<string[]>([]);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    assigneeIds: [],
    managerId: "",
    status: "Planned",
    priority: "Low",
    tasks: [
      {
        id: "",
        name: "",
        description: "",
        assignedUserId: "",
        status: "Todo",
      },
    ],
    reminders: [],
  });

  useEffect(() => {
    const projectList = getProjects();

    const safeList = projectList ?? [];

    if (safeList.length > 0) {
      setProjects(safeList);
      const selectedProject = safeList.find((itm) => itm.id == id);
      if (selectedProject) {
        setProject(selectedProject);
        setFormData({
          name: selectedProject.name,
          description: selectedProject.description,
          startDate: selectedProject.startDate,
          endDate: selectedProject.endDate,
          assigneeIds: selectedProject.assigneeIds,
          managerId: selectedProject.managerId,
          status: selectedProject.status,
          priority: selectedProject.priority,
          tasks: selectedProject.tasks ?? [],
          reminders: selectedProject.reminders ?? [],
        });
        setSelectedAssinees(selectedProject.assigneeIds);
        setReminders(selectedProject.reminders);
      }
    } else {
      setProjects(projectsData);
      AddProjects(projectsData);
    }
  }, []);

  useEffect(() => {
    const users = getUsers();

    const safeList = users ?? [];

    if (safeList.length > 0) {
      setUsers(safeList);
    } else {
      setUsers(userList);
      AddUser(userList);
    }
  }, []);

  const handleChange = (
    field: keyof FormData,
    value: string | boolean | string[] | File | null
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      return newData;
    });
  };

  const handleReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderDate || !reminderDescription) return;
    const newEntry: Reminder = {
      id: Math.random().toString(36).substr(2, 9),
      date: reminderDate,
      description: reminderDescription,
    };
    setReminders([...reminders, newEntry]);
    setReminderDate("");
    setReminderDescription("");
  };

  const handleDeleteReminder = (idx: number) => {
    setReminders((prevReminders) =>
      prevReminders.filter((_, index) => index !== idx)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name == "") {
      alert("Please Input Project name");
      return;
    }
    const payload = {
      ...formData,
      assigneeIds: selectedAssinees,
      reminders: reminders,
    };
    try {
      const updatedProjects = projects.map((p) =>
        p.id === id ? { ...p, ...payload } : p
      );
      AddProjects(updatedProjects);
      router.push("/");
    } catch (error) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white">
      {/* <Link href="/">Back to Dashboard</Link> */}
      <Link href="/">
        <Button variant="ghost" leftIcon={<ArrowLeft />}>
          Back to Dashboard
        </Button>
      </Link>
      <h2 className="text-3xl font-bold mb-5">Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 mb-4">
          <div className="">
            <label htmlFor="name">Project Name</label>
            <input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
            />
          </div>
        </div>
        <div className="grid gap-5 mb-4">
          <div className="">
            <label htmlFor="description">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              id="description"
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 mb-4">
          <div className="">
            <label htmlFor="name">Start Date</label>
            <input
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              id="name"
              type="date"
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
            />
          </div>
          <div className="">
            <label htmlFor="name">End Date</label>
            <input
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              id="name"
              type="date"
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 mb-4">
          <div className="">
            <label htmlFor="assignees">Assignees</label>
            <MultiSelect
              label=""
              options={users}
              selectedValues={selectedAssinees}
              onChange={setSelectedAssinees}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 mb-4">
          <div className="">
            <label htmlFor="manager">Project Manager</label>
            <select
              value={formData.managerId}
              onChange={(e) => handleChange("managerId", e.target.value)}
              name="manager"
              id="manager"
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <label htmlFor="status">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              name="status"
              id="status"
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 mb-4">
          <div className="">
            <label htmlFor="priority">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              name="priority"
              id="priority"
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 p-5 border border-gray-200 rounded-lg">
          <div className="col-span-3">
            <h4 className="text-xl font-bold mb-4">Reminders</h4>
          </div>
          <div className="col-span-3  md:col-span-1">
            <label htmlFor="reminder">Date</label>
            <input
              id="reminder"
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
            />
          </div>
          <div className="col-span-3 md:col-span-1">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              className="border border-gray-300 rounded-sm w-full px-4 py-2.5 mt-2"
              value={reminderDescription}
              onChange={(e) => setReminderDescription(e.target.value)}
            />
          </div>
          <div className="my-4 md:my-9 col-span-3 md:col-span-1 flex justify-end md:block">
            <button
              className="bg-[#030213] text-white rounded-lg p-2 cursor-pointer"
              onClick={handleReminder}
              type="button"
            >
              Add Reminder
            </button>
          </div>
          <div className="col-span-3">
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {reminders.map((itm, idx) => (
                    <tr
                      key={itm.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-700">{idx + 1}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {new Date(itm.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {itm.description}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteReminder(idx)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {reminders.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-500 italic"
                      >
                        No reminders added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-end my-6">
          <Button variant="primary" size="lg">
            Edit Project
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
