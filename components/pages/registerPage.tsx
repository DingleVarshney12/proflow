"use client";
import React from "react";
import { Label } from "../ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { CodeXml, Fingerprint, Lock, Mail, User } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "Client" | "Freelancer";
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "Client",
  });
  const [loading, setLoading] = React.useState(false);
  const [isPassVisible, setIsPassVisible] = React.useState<boolean>(false);

  const handlePasswordVisiblity = () => {
    setIsPassVisible((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      role: value as "Client" | "Freelancer",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");

        return;
      }
      toast.success("Register Successfully || Login Now🚀")

      setFormData({ name: "", email: "", password: "", role: "Client" }); 
    } catch (err) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-3 mt-4 grid-cols-2">
        <Label className="border rounded-lg grid gap-2 place-content-center justify-items-center py-4">
          <input
            type="radio"
            name="role"
            value="Client"
            checked={formData.role === "Client"}
            onChange={handleRoleChange}
          />
          <User />
          <h4>Client</h4>
        </Label>
        <Label className="border rounded-lg grid gap-2 place-content-center justify-items-center py-4">
          <input
            type="radio"
            name="role"
            value="Freelancer"
            checked={formData.role === "Freelancer"}
            onChange={handleRoleChange}
          />
          <CodeXml />
          <h4>Freelancer</h4>
        </Label>
      </div>
      <div className="grid gap-3 mt-4">
        <Label htmlFor="name">Name</Label>
        <InputGroup>
          <InputGroupInput
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            type="text"
            required
          />
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="grid gap-3 mt-4">
        <Label htmlFor="email">Email</Label>
        <InputGroup>
          <InputGroupInput
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            type="email"
            required
          />
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="grid gap-3 mt-4">
        <Label htmlFor="password">Password</Label>
        <InputGroup>
          <InputGroupInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            type={isPassVisible ? "text" : "password"}
            required
          />
          <InputGroupAddon>
            <Lock />
          </InputGroupAddon>
          <InputGroupButton
            type="button"
            onClick={handlePasswordVisiblity}
            className="cursor-pointer"
          >
            <Fingerprint />
          </InputGroupButton>
        </InputGroup>
      </div>
      <div className="grid gap-3 mt-8">
        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>
    </form>
  );
};

export default RegisterPage;
