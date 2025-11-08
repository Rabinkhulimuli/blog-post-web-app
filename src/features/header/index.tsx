import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/configs/routes";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { Menu, X, PenSquare,LogOut, Sun, Moon } from "lucide-react";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigation = [
    { name: "Home", href: ROUTES.HOME },
    ...(isAuthenticated ? [{ name: "Dashboard", href: ROUTES.DASHBOARD.BASE }] : []),
  ];

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to={ROUTES.HOME}>
            <h1 className="text-primary font-serif text-2xl font-bold">BlogHub</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <span
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover-elevate ${
                    location.pathname === item.href ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right-side buttons */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>

            {/* Authenticated user dropdown */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={"/profile-image.webp"} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex flex-col items-start">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-muted-foreground text-xs">{user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.DASHBOARD.CREATE_POST} className="flex items-center gap-2">
                      <PenSquare className="h-4 w-4" /> Write Post
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to={ROUTES.AUTH.LOGIN}>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    Sign In
                  </Button>
                </Link>
                <Link to={ROUTES.AUTH.REGISTER}>
                  <Button variant="default" size="sm" className="hidden md:flex">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <Button
              ref={toggleRef}
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden space-y-3 border-t py-4"
          >
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} onClick={()=> setMobileMenuOpen(false)}>
                <div className="block rounded-md px-3 py-2 text-base font-medium hover-elevate">
                  {item.name}
                </div>
              </Link>
            ))}

            <div className="border-t pt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to={ROUTES.DASHBOARD.CREATE_POST}>
                    <Button variant="default" className="w-full" onClick={()=> setMobileMenuOpen(false)}>
                      <PenSquare className="mr-2 h-4 w-4" /> Write
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={()=> {
                    setMobileMenuOpen(false)
                    logout()}}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.AUTH.LOGIN}>
                    <Button variant="ghost" className="w-full" onClick={()=> setMobileMenuOpen(false)}>
                      Sign In
                    </Button>
                  </Link>
                  <Link to={ROUTES.AUTH.REGISTER}>
                    <Button variant="default" className="w-full" onClick={()=> setMobileMenuOpen(false)}>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
