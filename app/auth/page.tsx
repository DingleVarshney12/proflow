import LoginPage from "@/components/pages/loginPage";
import RegisterPage from "@/components/pages/registerPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Auth = () => {
  return (
    <section className="h-screen w-full flex items-center justify-center pc-2 py-8">
      <Tabs defaultValue="login" className="w-full max-w-lg rounded-lg shadow-xl shadow-foreground/10 px-2 py-4">
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
