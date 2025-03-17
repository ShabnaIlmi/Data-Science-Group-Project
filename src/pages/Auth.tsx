
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { FlaskConical } from "lucide-react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[450px]">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <div className="flex justify-center mb-2">
            <Link to="/" className="flex items-center gap-2">
              <FlaskConical className="w-10 h-10 text-teal-500" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold">Welcome to ChemRisk AI</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access advanced chemical risk assessment tools
          </p>
        </div>
        
        <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <LoginForm />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <button 
                className="text-teal-500 hover:text-teal-600 font-medium"
                onClick={() => setActiveTab("signup")}
              >
                Sign up
              </button>
            </div>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <SignupForm />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <button 
                className="text-teal-500 hover:text-teal-600 font-medium"
                onClick={() => setActiveTab("login")}
              >
                Sign in
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
