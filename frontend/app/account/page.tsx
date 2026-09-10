"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import { addressesService } from "@/services/addresses.service";
import { api } from "@/lib/api-client";
import type { User, Address } from "@/types";
import Container from "@/components/common/Container";
import { PageLoader, Spinner } from "@/components/common/Loading";
import { User as UserIcon, MapPin, Package, Heart, Settings, Plus, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Tab = "profile" | "addresses" | "orders";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading, fetchMe } = useAuthStore();
  const { success, error: showError } = useToast();
  const [tab, setTab] = useState<Tab>("profile");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber ?? "" });
    }
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await api.put("/users/me", profileData);
      await fetchMe();
      success("Profile updated!");
    } catch (err: any) {
      showError(err.message ?? "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  // Addresses
  const { data: addresses = [], refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressesService.getAll,
    enabled: isAuthenticated && tab === "addresses",
  });

  const deleteAddressMutation = useMutation({
    mutationFn: addressesService.delete,
    onSuccess: () => { success("Address deleted"); refetchAddresses(); },
    onError: (err: any) => showError(err.message ?? "Failed to delete"),
  });

  const setDefaultMutation = useMutation({
    mutationFn: addressesService.setDefault,
    onSuccess: () => { success("Default address updated"); refetchAddresses(); },
    onError: (err: any) => showError(err.message),
  });

  if (authLoading || !user) return <PageLoader />;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <UserIcon className="h-4 w-4" /> },
    { id: "addresses", label: "Addresses", icon: <MapPin className="h-4 w-4" /> },
  ];

  return (
    <main className="py-10">
      <Container>
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold">My Account</h1>
          <p className="text-zinc-500 mt-1">Welcome back, {user.firstName}!</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-zinc-100 p-4 space-y-1">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                    tab === t.id ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-50"
                  )}
                >
                  {t.icon} {t.label}
                </button>
              ))}
              <hr className="my-2 border-zinc-100" />
              <Link href="/orders"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition">
                <Package className="h-4 w-4" /> Orders
              </Link>
              <Link href="/wishlist"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition">
                <Heart className="h-4 w-4" /> Wishlist
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === "profile" && (
              <div className="rounded-2xl border border-zinc-100 p-6">
                <h2 className="font-semibold text-lg mb-6">Profile Information</h2>
                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">First Name</label>
                      <input value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Last Name</label>
                      <input value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                    <input value={user.email} disabled
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-zinc-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Phone</label>
                    <input value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 focus:border-black focus:outline-none" />
                  </div>
                  <button type="submit" disabled={profileSaving}
                    className="rounded-full bg-black px-8 py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition">
                    {profileSaving ? <Spinner size="sm" className="text-white mx-auto" /> : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {tab === "addresses" && (
              <div className="rounded-2xl border border-zinc-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg">Saved Addresses</h2>
                  <Link href="/checkout"
                    className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-black">
                    <Plus className="h-4 w-4" /> Add via checkout
                  </Link>
                </div>
                {addresses.length === 0 ? (
                  <p className="text-sm text-zinc-500">No addresses saved yet. Add one during checkout.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="rounded-xl border border-zinc-200 p-4">
                        <div className="flex items-start justify-between">
                          <div className="text-sm">
                            <p className="font-medium">{addr.fullName}</p>
                            <p className="text-zinc-600 mt-0.5">{addr.street}</p>
                            <p className="text-zinc-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                            <p className="text-zinc-600">{addr.country} · {addr.phone}</p>
                            {addr.isDefault && (
                              <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                <CheckCircle className="h-3 w-3" /> Default
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!addr.isDefault && (
                              <button onClick={() => setDefaultMutation.mutate(addr.id)}
                                className="text-xs text-zinc-500 hover:text-zinc-900 underline">
                                Set default
                              </button>
                            )}
                            <button onClick={() => deleteAddressMutation.mutate(addr.id)}
                              className="p-1 text-zinc-400 hover:text-red-500 transition">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
