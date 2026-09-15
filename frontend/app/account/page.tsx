"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import { addressesService } from "@/services/addresses.service";
import { api } from "@/lib/api-client";
import Container from "@/components/common/Container";
import { PageLoader, Spinner } from "@/components/common/Loading";
import { User as UserIcon, MapPin, Package, Heart, Plus, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Tab = "profile" | "addresses";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading, fetchMe } = useAuthStore();
  const { success, error: showError } = useToast();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName ?? "",
    lastName:  user?.lastName  ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    if (user) setProfileData({ firstName: user.firstName, lastName: user.lastName, phoneNumber: user.phoneNumber ?? "" });
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

  const inputCls =
    "w-full rounded-lg border border-[#D6CCBF] bg-[#F7F3EE] px-4 py-2.5 text-[#3D1A0A] placeholder:text-[#A0673A]/50 focus:border-[#C4956A] focus:outline-none focus:ring-2 focus:ring-[#C4956A]/20 transition";
  const labelCls = "block text-sm font-medium text-[#5C2E1A] mb-1";

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",   label: "Profile",   icon: <UserIcon className="h-4 w-4" /> },
    { id: "addresses", label: "Addresses", icon: <MapPin   className="h-4 w-4" /> },
  ];

  return (
    <main className="py-10 bg-[#F7F3EE]">
      <Container>
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04]">My Account</h1>
          <p className="text-[#A0673A] mt-1">Welcome back, {user.firstName}!</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-[#D6CCBF] bg-white p-4 space-y-1">
              {/* Avatar area */}
              <div className="flex flex-col items-center py-4 mb-2 border-b border-[#EDE8E0]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDE8E0] text-[#5C2E1A] font-bold text-xl">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <p className="mt-2 font-medium text-[#3D1A0A] text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-[#A0673A]">{user.email}</p>
              </div>

              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    tab === t.id
                      ? "bg-[#5C2E1A] text-[#F7F3EE]"
                      : "text-[#5C2E1A] hover:bg-[#EDE8E0]"
                  )}
                >
                  {t.icon} {t.label}
                </button>
              ))}
              <hr className="my-2 border-[#EDE8E0]" />
              <Link href="/orders" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
                <Package className="h-4 w-4" /> Orders
              </Link>
              <Link href="/wishlist" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
                <Heart className="h-4 w-4" /> Wishlist
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {tab === "profile" && (
              <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6">
                <h2 className="font-semibold text-lg text-[#1C0A04] mb-6">Profile Information</h2>
                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input value={user.email} disabled className={cn(inputCls, "cursor-not-allowed opacity-60")} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input value={profileData.phoneNumber} onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })} className={inputCls} placeholder="10-digit mobile" />
                  </div>
                  <button type="submit" disabled={profileSaving}
                    className="rounded-full bg-[#5C2E1A] px-8 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors"
                  >
                    {profileSaving ? <Spinner size="sm" className="text-[#F7F3EE] mx-auto" /> : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {tab === "addresses" && (
              <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg text-[#1C0A04]">Saved Addresses</h2>
                  <Link href="/checkout" className="flex items-center gap-1 text-sm font-medium text-[#5C2E1A] hover:text-[#3D1A0A]">
                    <Plus className="h-4 w-4" /> Add via checkout
                  </Link>
                </div>
                {addresses.length === 0 ? (
                  <p className="text-sm text-[#A0673A]">No addresses saved yet. Add one during checkout.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="rounded-xl border border-[#D6CCBF] p-4">
                        <div className="flex items-start justify-between">
                          <div className="text-sm">
                            <p className="font-medium text-[#3D1A0A]">{addr.fullName}</p>
                            <p className="text-[#A0673A] mt-0.5">{addr.street}</p>
                            <p className="text-[#A0673A]">{addr.city}, {addr.state} {addr.postalCode}</p>
                            <p className="text-[#A0673A]">{addr.country} · {addr.phone}</p>
                            {addr.isDefault && (
                              <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                                <CheckCircle className="h-3 w-3" /> Default
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {!addr.isDefault && (
                              <button onClick={() => setDefaultMutation.mutate(addr.id)}
                                className="text-xs text-[#A0673A] hover:text-[#5C2E1A] underline transition-colors">
                                Set default
                              </button>
                            )}
                            <button onClick={() => deleteAddressMutation.mutate(addr.id)}
                              className="p-1 text-[#A0673A] hover:text-red-600 transition-colors">
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
