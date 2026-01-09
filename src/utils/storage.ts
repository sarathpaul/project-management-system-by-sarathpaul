import { Project } from "@/types/project";
import { User } from "@/types/user";

const projects_key = "projects";
const users_key = "users";

export const getProjects = () => {
  try {
    const data = localStorage.getItem(projects_key);
    return data ? (JSON.parse(data) as Project[]) : [];
  } catch (error) {
    console.error("Unable to fetch projects", error);
  }
};

export const AddProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(projects_key, JSON.stringify(projects));
  } catch (error) {
    console.error("Unable to add projects", error);
  }
};


export const getUsers = () => {
  try {
    const data = localStorage.getItem(users_key);
    return data ? (JSON.parse(data) as User[]) : [];
  } catch (error) {
    console.error("Unable to fetch Users", error);
  }
};

export const AddUser = (users: User[]) => {
  try {
    localStorage.setItem(users_key, JSON.stringify(users));
  } catch (error) {
    console.error("Unable to add user", error);
  }
};