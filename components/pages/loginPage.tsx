"use client";
import React from "react";
import { Label } from "../ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Fingerprint, Lock, User } from "lucide-react";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const LoginPage = () => {
  const [isPassVisible, setIsPassVisible] = React.useState<boolean>(false);
  const handlePasswordVisiblity = () => {
    setIsPassVisible((prev) => !prev);
  };

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
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
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password. Make sure to register first.");
      } else {
        setFormData({ email: "", password: "" });
        window.location.replace(`/`);
      }
    } catch (err) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
            <User />
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
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
};

export default LoginPage;
