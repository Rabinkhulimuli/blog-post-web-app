import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import bcrypt from 'bcryptjs';
import type { User } from '@/types/services/auth.types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

// Extended user type for registration
export interface RegisterUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isRegisterIn: boolean;
  register: (data: RegisterUser) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fake JWT generator
const generateFakeJWT = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // expires in 1 hour
  };
  return btoa(JSON.stringify(payload)); // simple fake encoding
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterIn, setIsRegisterIn] = useState(false);
  const navigate = useNavigate();

  //  Load user/token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setAccessToken(storedToken);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  /**
   *  Register
   */
  const register = useCallback(
    async (data: RegisterUser) => {
      const { name, email, password } = data;

      // Check if user exists
      const existing = localStorage.getItem('registered_user');
      if (existing) {
        const existingUser = JSON.parse(existing) as RegisterUser;
        if (existingUser.email === email) {
          toast.error('User already registered with this email.');
          return;
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: RegisterUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
      };

      // Save new user
      localStorage.setItem('registered_user', JSON.stringify(newUser));
      setIsRegisterIn(true);
      toast.success('Registration successful! You can now log in.');

      // Optional: redirect to login
      navigate('/auth/login');
    },
    [navigate]
  );

  /**
   * 🔑 Login
   */
  const login = useCallback(
    async (email: string, password: string) => {
      const stored = localStorage.getItem('registered_user');
      if (!stored) {
        toast.error('No registered user found. Please register first.');
        return;
      }

      const savedUser: RegisterUser = JSON.parse(stored) as RegisterUser;

      // Check email
      if (savedUser.email !== email) {
        toast.error('Invalid email.');
        return;
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, savedUser.password);
      if (!isPasswordValid) {
        toast.error('Incorrect password.');
        return;
      }

      // Generate token
      const token = generateFakeJWT(savedUser);

      // Save session
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(savedUser));

      // Update state
      setUser(savedUser);
      setAccessToken(token);
      setIsLoggedIn(true);
      toast.success(`Welcome back, ${savedUser.name}!`);

      navigate('/');
    },
    [navigate]
  );

  /**
   *  Logout
   */
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setAccessToken(null);
    setIsLoggedIn(false);
    toast.success('Logged out successfully.');
    navigate('/auth/login');
  }, [navigate]);

  /**
   * Memoized context value
   */
  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!user && !!accessToken,
      isLoggedIn,
      isRegisterIn,
      register,
      login,
      logout,
    }),
    [user, accessToken, isLoggedIn, isRegisterIn, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook for consuming AuthContext
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
