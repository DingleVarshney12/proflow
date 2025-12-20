import LoginPage from "@/components/pages/loginPage";
import RegisterPage from "@/components/pages/registerPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
const Auth = () => {
  return (
    <section className="w-full flex items-center justify-center px-2 py-8">
      <Tabs
        defaultValue="login"
        className="w-full max-w-lg rounded-lg shadow-xl shadow-foreground/10 px-4 py-4"
      >
        <div className="flex items-center space-x-2 mb-8 flex-col">
          <div className="relative w-18 h-18 md:w-10 md:h-10  rounded-full overflow-hidden">
            <Image src={"/logo.png"} alt="company logo" fill priority />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-center">ProFlow</h1>
            <p>Role-based project and task management application</p>
          </div>
        </div>
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginPage />
        </TabsContent>
        <TabsContent value="register">
          <RegisterPage />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default Auth;
