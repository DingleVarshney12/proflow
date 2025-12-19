export interface Task {
  _id: string;
  title: string;
  status: "Pending" | "Ongoing" | "Completed";
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Project {
  _id: string;
  title: string;
  status: string;
  clientId: string;
  freelancerId: string;
}
