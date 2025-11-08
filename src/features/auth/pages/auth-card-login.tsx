import { useAuth } from "@/contexts/auth-context";
import AuthCard from "../components/auth-card";

export default function AuthCardLogin() {
  const {login}= useAuth()
  
  const handleLogin=(data: { email: string; password: string; name?: string })=> {
    login(data.email,data.password)
  }
  return (
    <AuthCard
      mode="login"
      onSubmit={(data) => handleLogin(data)}
    />
  );
}
