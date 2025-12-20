"use client";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useProjectStore } from "@/store/useProjectStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const CreateProject = () => {
  const { projects, setProjects } = useProjectStore();
  const router = useRouter();
  const { data: session } = useSession();
  const freelancerId = session?.user.email;
  const [formData, setFormData] = React.useState({
    title: "",
    clientId: "",
  });
  const [loading, setLoading] = React.useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, freelancerId }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Project cannot be created");
        return;
      }
      toast.success(data.message);
      if (data.project) {
        setProjects([...projects, data.project]);
      }
      setFormData({
        title: "",
        clientId: "",
      });
      router.push(``);
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="md:max-w-10/12 w-full mx-auto py-[5%] px-2">
      <h2 className="text-2xl font-bold mb-4">Create Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-3 mt-4">
          <Label htmlFor="title">Project Title</Label>
          <InputGroup>
            <InputGroupInput
              name="title"
              placeholder="Project title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>
        <div className="grid gap-3 mt-4">
          <Label htmlFor="clientId">Client Email</Label>
          <InputGroup>
            <InputGroupInput
              name="clientId"
              placeholder="Client Email"
              type="email"
              value={formData.clientId}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>
        <div className="grid gap-3 mt-8">
          <Button
            type="submit"
            disabled={loading || !session}
            className="cursor-pointer hover:scale-105"
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
