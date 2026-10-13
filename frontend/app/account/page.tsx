"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import { addressesService } from "@/services/addresses.service";
import { api } from "@/lib/api-client";
import Container from "@/components/common/Container";
import { PageLoader, Spinner } from "@/components/common/Loading";
import Link from "next/link";
import {
  User as UserIcon, MapPin, Package, Heart,
  Plus, Trash2, CheckCircle, LogOut, Edit2, Phone, Mail, Lock, Eye, EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "profile" | "addresses" | "password";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading, fetchMe, logout } = useAuthStore();
  const { success, error: showError } = useToast();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login?from=/account");
  }, [isAuthenticated, authLoading, router]);

  const [profileData, setProfileData] = useState({
    firstName:   user?.firstName   ?? "",
    lastName:    user?.lastName    ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrent,  setShowCurrent]  = useState(false);
  const [showNew,      setShowNew]      = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Inline add address state
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", postalCode: "", country: "India", isDefault: false as boolean,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName:   user.firstName,
        lastName:    user.lastName,
        phoneNumber: user.phoneNumber ?? "",
      });
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

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("Passwords do not match"); return;
    }
    if (passwordData.newPassword.length < 8) {
      showError("Password must be at least 8 characters"); return;
    }
    setPasswordSaving(true);
    try {
      await api.put("/users/me/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showError(err.message ?? "Failed to update password");
    } finally {
      setPasswordSaving(false);
    }
  };

  const createAddressMutation = useMutation({
    mutationFn: addressesService.create,
    onSuccess: () => {
      success("Address added!");
      setShowAddAddressForm(false);
      setNewAddressData({ fullName: "", phone: "", street: "", city: "", state: "", postalCode: "", country: "India", isDefault: false });
      refetchAddresses();
    },
    onError: (err: any) => showError(err.message ?? "Failed to add address"),
  });

  const { data: addresses = [], refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressesService.getAll,
    enabled: isAuthenticated && tab === "addresses",
  });

  const deleteAddressMutation = useMutation({
    mutationFn: addressesService.delete,
    onSuccess: () => { success("Address removed"); refetchAddresses(); },
    onError: (err: any) => showError(err.message ?? "Failed to delete"),
  });

  const setDefaultMutation = useMutation({
    mutationFn: addressesService.setDefault,
    onSuccess: () => { success("Default address updated"); refetchAddresses(); },
    onError: (err: any) => showError(err.message),
  });

  if (authLoading || !user) return <PageLoader />;

  const inputCls =
    "w-full rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] px-4 py-3 text-[#3D1A0A] placeholder:text-[#A0673A]/40 focus:border-[#C4956A] focus:outline-none focus:ring-2 focus:ring-[#C4956A]/15 transition";
  const labelCls = "block text-sm font-semibold text-[#3D1A0A] mb-1.5";

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",   label: "Profile",   icon: <UserIcon className="h-4 w-4" /> },
    { id: "addresses", label: "Addresses", icon: <MapPin   className="h-4 w-4" /> },
    { id: "password",  label: "Password",  icon: <Lock     className="h-4 w-4" /> },
  ];

  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <main className="min-h-screen bg-[#F7F3EE] py-8 lg:py-12">
      <Container>
        {/* Page heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#A0673A]">Account</p>
          <h1 className="mt-2 font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04] lg:text-4xl">
            My Account
          </h1>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* ── Sidebar ──────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl border border-[#D6CCBF] bg-white p-5 shadow-sm">
              {/* Avatar */}
              <div className="flex flex-col items-center py-4 mb-3 border-b border-[#EDE8E0]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#C4956A] to-[#5C2E1A] text-[#F7F3EE] font-bold text-xl shadow-md">
                  {initials}
                </div>
                <p className="mt-3 font-semibold text-[#3D1A0A]">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-[#A0673A] mt-0.5 truncate max-w-full">{user.email}</p>
                {user.role === "ADMIN" && (
                  <span className="mt-2 rounded-full bg-[#5C2E1A]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5C2E1A]">
                    Admin
                  </span>
                )}
              </div>

              {/* Tabs */}
              <div className="space-y-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      tab === t.id
                        ? "bg-[#5C2E1A] text-[#F7F3EE] shadow-sm"
                        : "text-[#5C2E1A] hover:bg-[#EDE8E0]"
                    )}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <hr className="my-3 border-[#EDE8E0]" />

              {/* Quick links */}
              <div className="space-y-1">
                <Link
                  href="/orders"
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
                >
                  <Package className="h-4 w-4" /> My Orders
                </Link>
                <Link
                  href="/wishlist"
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
                >
                  <Heart className="h-4 w-4" /> Wishlist
                </Link>
              </div>

              <hr className="my-3 border-[#EDE8E0]" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </motion.aside>

          {/* ── Main content ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Profile tab */}
            {tab === "profile" && (
              <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Edit2 className="h-5 w-5 text-[#C4956A]" />
                  <h2 className="font-semibold text-lg text-[#1C0A04]">Profile Information</h2>
                </div>

                {/* Read-only info cards */}
                <div className="grid gap-3 sm:grid-cols-2 mb-6">
                  <div className="flex items-center gap-3 rounded-xl bg-[#F7F3EE] p-4">
                    <Mail className="h-4 w-4 text-[#C4956A] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#A0673A]">Email</p>
                      <p className="text-sm font-medium text-[#3D1A0A] truncate">{user.email}</p>
                    </div>
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center gap-3 rounded-xl bg-[#F7F3EE] p-4">
                      <Phone className="h-4 w-4 text-[#C4956A] flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#A0673A]">Phone</p>
                        <p className="text-sm font-medium text-[#3D1A0A]">{user.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>First Name</label>
                      <input
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className={inputCls}
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name</label>
                      <input
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className={inputCls}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      value={user.email}
                      disabled
                      className={cn(inputCls, "cursor-not-allowed opacity-50")}
                    />
                    <p className="mt-1 text-xs text-[#A0673A]">Email cannot be changed.</p>
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      value={profileData.phoneNumber}
                      onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                      className={inputCls}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="rounded-full bg-[#1C0A04] px-8 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {profileSaving ? (
                        <><Spinner size="sm" className="text-[#F7F3EE]" /> Saving…</>
                      ) : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses tab */}
            {tab === "addresses" && (
              <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#C4956A]" />
                    <h2 className="font-semibold text-lg text-[#1C0A04]">Saved Addresses</h2>
                  </div>
                  <Link
                    href="/checkout"
                    className="flex items-center gap-1.5 rounded-full border border-[#D6CCBF] px-4 py-2 text-sm font-medium text-[#5C2E1A] hover:border-[#C4956A] hover:bg-[#EDE8E0] transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add via checkout
                  </Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-[#D6CCBF] p-8 text-center">
                    <MapPin className="mx-auto h-10 w-10 text-[#C4956A]/40 mb-3" />
                    <p className="text-sm font-medium text-[#5C2E1A]">No addresses saved yet</p>
                    <p className="mt-1 text-xs text-[#A0673A]">Add an address during checkout to save it here.</p>
                    <Link
                      href="/checkout"
                      className="mt-4 inline-block rounded-full bg-[#5C2E1A] px-6 py-2.5 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
                    >
                      Go to Checkout
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={cn(
                          "rounded-xl border-2 p-4 transition-colors",
                          addr.isDefault ? "border-[#C4956A] bg-[#FFF8F2]" : "border-[#E6DFD5] hover:border-[#D6CCBF]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-sm space-y-0.5 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-[#3D1A0A]">{addr.fullName}</p>
                              {addr.isDefault && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  <CheckCircle className="h-2.5 w-2.5" /> Default
                                </span>
                              )}
                            </div>
                            <p className="text-[#A0673A]">{addr.street}</p>
                            <p className="text-[#A0673A]">
                              {addr.city}, {addr.state} — {addr.postalCode}
                            </p>
                            <p className="text-[#A0673A]">{addr.country} · 📞 {addr.phone}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {!addr.isDefault && (
                              <button
                                onClick={() => setDefaultMutation.mutate(addr.id)}
                                disabled={setDefaultMutation.isPending}
                                className="text-xs font-medium text-[#5C2E1A] hover:text-[#3D1A0A] underline underline-offset-2 transition-colors disabled:opacity-50"
                              >
                                Set default
                              </button>
                            )}
                            <button
                              onClick={() => deleteAddressMutation.mutate(addr.id)}
                              disabled={deleteAddressMutation.isPending}
                              className="p-1.5 rounded-lg text-[#A0673A] hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                              aria-label="Delete address"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline add address */}
                <div className="mt-4">
                  <button
                    onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                    className="flex items-center gap-2 rounded-full border-2 border-dashed border-[#C4956A]/50 px-5 py-2.5 text-sm font-medium text-[#5C2E1A] hover:border-[#C4956A] hover:bg-[#FFF8F2] transition-colors w-full justify-center"
                  >
                    <Plus className="h-4 w-4" />
                    {showAddAddressForm ? "Cancel" : "Add New Address"}
                  </button>

                  {showAddAddressForm && (
                    <form
                      onSubmit={(e) => { e.preventDefault(); createAddressMutation.mutate(newAddressData); }}
                      className="mt-4 space-y-3 rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] p-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Full Name *</label>
                          <input required value={newAddressData.fullName} placeholder="Full name"
                            onChange={(e) => setNewAddressData({ ...newAddressData, fullName: e.target.value })}
                            className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Phone *</label>
                          <input required value={newAddressData.phone} placeholder="10-digit number"
                            onChange={(e) => setNewAddressData({ ...newAddressData, phone: e.target.value })}
                            className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Street *</label>
                        <input required value={newAddressData.street} placeholder="House no., Street, Area"
                          onChange={(e) => setNewAddressData({ ...newAddressData, street: e.target.value })}
                          className={inputCls} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">City *</label>
                          <input required value={newAddressData.city} placeholder="City"
                            onChange={(e) => setNewAddressData({ ...newAddressData, city: e.target.value })}
                            className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">State *</label>
                          <input required value={newAddressData.state} placeholder="State"
                            onChange={(e) => setNewAddressData({ ...newAddressData, state: e.target.value })}
                            className={inputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Pincode *</label>
                          <input required value={newAddressData.postalCode} placeholder="6-digit pincode"
                            onChange={(e) => setNewAddressData({ ...newAddressData, postalCode: e.target.value })}
                            className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Country</label>
                          <input value={newAddressData.country}
                            onChange={(e) => setNewAddressData({ ...newAddressData, country: e.target.value })}
                            className={inputCls} />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={newAddressData.isDefault}
                          onChange={(e) => setNewAddressData({ ...newAddressData, isDefault: e.target.checked })}
                          className="accent-[#C4956A] h-4 w-4" />
                        <span className="text-sm text-[#5C2E1A]">Set as default address</span>
                      </label>
                      <button
                        type="submit"
                        disabled={createAddressMutation.isPending}
                        className="rounded-full bg-[#5C2E1A] px-6 py-2.5 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors"
                      >
                        {createAddressMutation.isPending ? "Saving…" : "Save Address"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Password tab */}
            {tab === "password" && (
              <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="h-5 w-5 text-[#C4956A]" />
                  <h2 className="font-semibold text-lg text-[#1C0A04]">Change Password</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  {/* Current password */}
                  <div>
                    <label className={labelCls}>Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className={cn(inputCls, "pr-12")}
                      />
                      <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0673A] hover:text-[#5C2E1A] transition-colors">
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className={labelCls}>New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        required
                        minLength={8}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Min. 8 characters"
                        className={cn(inputCls, "pr-12")}
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0673A] hover:text-[#5C2E1A] transition-colors">
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordData.newPassword.length > 0 && (
                      <div className="mt-1.5 flex gap-1">
                        {[1,2,3,4].map((n) => (
                          <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${
                            passwordData.newPassword.length >= n * 3
                              ? passwordData.newPassword.length >= 12 ? "bg-emerald-500" : "bg-[#C4956A]"
                              : "bg-[#D6CCBF]"
                          }`} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className={labelCls}>Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Re-enter new password"
                      className={inputCls}
                    />
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordSaving || (!!passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword)}
                      className="rounded-full bg-[#1C0A04] px-8 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {passwordSaving ? <><Spinner size="sm" className="text-[#F7F3EE]" /> Updating…</> : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </main>
  );
}
