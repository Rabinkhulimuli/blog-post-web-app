import { useAuth} from "@/contexts/auth-context";
import AuthCard from "../components/auth-card";

export default function AuthCardRegister() {
  const {register}= useAuth()
  const handleregister=(data: { email: string; password: string; name?: string })=> {
    const id= Date.now().toString()
      register({...data,id: id,name:data.name??""})
  }
  return (
    <AuthCard
      mode="register"
      onSubmit={(data) => handleregister(data)}
    />
  );
}
