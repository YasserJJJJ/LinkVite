"use client";

import {
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";



export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      const token = localStorage.getItem("linkvite_token");

      if (!token) {
        router.push("/signin");
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
        localStorage.setItem("linkvite_user", JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem("linkvite_token");
        localStorage.removeItem("linkvite_user");
        router.push("/signin");
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyUser();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("linkvite_token");
    localStorage.removeItem("linkvite_user");
    router.push("/signin");
  }

  if (checkingAuth) {
    return <div className="p-10">Checking access...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="fixed top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full cursor-pointer focus:outline-none">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
                <AvatarBadge className="bg-green-600 dark:bg-green-800" />
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="pt-16">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome{user ? `, ${user.first_name}` : ""}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This is your dashboard.
        </p>
      </div>
    </div>
  );
}