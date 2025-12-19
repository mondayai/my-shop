"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

type User = {
  id: string;
  name: string | null;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Nav />
      <div className="container-custom py-12 pt-24">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[var(--foreground)]">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-2">
                Welcome back, {user?.name || user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              Log out
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">My Profile</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage your account settings
              </p>
              <div className="text-xs text-gray-400 font-mono">{user?.id}</div>
              <div className="text-sm font-medium mt-1">{user?.email}</div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
              <h3 className="font-semibold text-lg mb-2">Orders</h3>
              <p className="text-sm text-gray-600">No recent orders</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
              <h3 className="font-semibold text-lg mb-2">Wishlist</h3>
              <p className="text-sm text-gray-600">Your wishlist is empty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
