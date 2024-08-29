"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

import { User } from "@/models/User";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, X } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const router = useRouter();

  useEffect(() => {
    const userDetails = Cookies.get("mailtales_user_details");

    if (userDetails) {
      const user = JSON.parse(userDetails);

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("mailtales_user_token");
    Cookies.remove("mailtales_user_email");
    Cookies.remove("mailtales_user_details");
    router.push("/sign-up");
    setUser(null);
  };

  // Rerender the page if cookies are deleted
  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get("mailtales_user_token");
      if (!token) {
        // router.push("/sign-up");
        setUser(null);
      }
    };

    checkToken();
    const intervalId = setInterval(checkToken, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">MailTales</span>
            </Link>
            <div className="hidden md:block ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user && (
                <>
                  <span className="text-sm font-medium text-foreground mr-2">
                    {user?.name}
                  </span>
                  <Avatar>
                    <AvatarImage src={user?.picture} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    size="icon"
                    className="ml-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                  <span className="sr-only">Open main menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      href={item.href}
                      className={pathname === item.href ? "bg-accent" : ""}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                {user && (
                  <>
                    <DropdownMenuItem className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user?.picture} alt={user?.name} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user?.name}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
