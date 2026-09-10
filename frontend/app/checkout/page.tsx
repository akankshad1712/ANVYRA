"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import { addressesService } from "@/services/addresses.service";
import { ordersService } from "@/services/orders.service";
import Container from "@/components/common/Container";
import { PageLoader, Spinner } from "@/components/common/Loading";
import type { Address, PaymentMethod } from "@/types";
import { CreditCard, Truck, Package, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; desc: string }[] = [
  { value: "COD", label: "Cash on Delivery", desc: "Pay when your order arrives" },
  { value: "UPI", label: "UPI", desc: "Pay via UPI apps (requires gateway setup)" },
  { value: "CARD", label: "Credit / Debit Card", desc: "Secure card payment (requires gateway setup)" },
  { value: "NET_BANKING", label: "Net Banking", desc: "Pay via internet banking (requires gateway setup)" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { success, error: showError } = useToast();

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "", phone: "", street: "", city: "", state: "", postalCode: "", country: "India", isDefault: false
  });

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const { data: addresses = [], refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressesService.getAll,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    const def = addresses.find((a) => a.isDefault);
    if (def && !selectedAddress) setSelectedAddress(def.id);
    else if (addresses.length > 0 && !selectedAddress) setSelectedAddress(addresses[0].id);
  }, [addresses]);

  const createAddressMutation = useMutation({
    mutationFn: addressesService.create,
    onSuccess: (addr) => {
      setSelectedAddress(addr.id);
      setShowAddAddress(false);
      refetchAddresses();
    },
    onError: (err: any) => showError(err.message ?? "Failed to save address"),
  });

  const placeOrderMutation = useMutation({
    mutationFn: ordersService.placeOrder,
    onSuccess: (order) => {
      success("Order placed successfully!");
      router.push(`/order-success?orderNumber=${order.orderNumber}`);
    },
    onError: (err: any) => showError(err.message ?? "Failed to place order"),
  });

  if (!isAuthenticated) return <PageLoader />;

  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="py-20 text-center">
        <Container>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/shop" className="underline text-zinc-600">Start shopping</Link>
        </Container>
      </main>
    );
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress) { showError("Please select a shipping address"); return; }
    placeOrderMutation.mutate({ shippingAddressId: selectedAddress, paymentMethod });
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    createAddressMutation.mutate(newAddress);
  };

  return (
    <main className="py-10">
      <Container>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery address */}
            <section className="rounded-2xl border border-zinc-100 p-6">
              <h2 className="font-semibold text-lg mb-4">Delivery Address</h2>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-xl border p-4 transition",
                      selectedAddress === addr.id ? "border-black bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"
                    )}
                  >
                    <input type="radio" name="address" value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-zinc-600">{addr.street}{addr.street2 ? `, ${addr.street2}` : ""}</p>
                      <p className="text-zinc-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-zinc-600">{addr.country} · {addr.phone}</p>
                      {addr.isDefault && <span className="text-xs text-emerald-600 font-medium">Default</span>}
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-black transition"
                >
                  <Plus className="h-4 w-4" />
                  {showAddAddress ? "Cancel" : "Add new address"}
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleSaveAddress} className="mt-4 space-y-4 rounded-xl border border-zinc-200 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: "fullName", label: "Full Name", required: true },
                      { key: "phone", label: "Phone", required: true },
                    ].map(({ key, label, required }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">{label}</label>
                        <input required={required} value={(newAddress as any)[key]}
                          onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                      </div>
                    ))}
                  </div>
                  {[
                    { key: "street", label: "Street Address", required: true },
                    { key: "city", label: "City", required: true },
                  ].map(({ key, label, required }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">{label}</label>
                      <input required={required} value={(newAddress as any)[key]}
                        onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    {[{ key: "state", label: "State" }, { key: "postalCode", label: "Postal Code" }].map(({ key, label }) => (
                      <div key={key}>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">{label}</label>
                        <input required value={(newAddress as any)[key]}
                          onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-black focus:outline-none" />
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={createAddressMutation.isPending}
                    className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50">
                    {createAddressMutation.isPending ? "Saving…" : "Save Address"}
                  </button>
                </form>
              )}
            </section>

            {/* Payment method */}
            <section className="rounded-2xl border border-zinc-100 p-6">
              <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.value}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-xl border p-4 transition",
                      paymentMethod === m.value ? "border-black bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"
                    )}
                  >
                    <input type="radio" name="payment" value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className="text-xs text-zinc-500">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {paymentMethod !== "COD" && (
                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
                  ⚠️ Payment gateway integration requires configuring credentials via environment variables (RAZORPAY_KEY_ID, STRIPE_SECRET_KEY). For now, please use Cash on Delivery.
                </div>
              )}
            </section>
          </div>

          {/* Order summary */}
          <div className="rounded-2xl border border-zinc-100 p-6 h-fit space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-700 line-clamp-1 flex-1 pr-2">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium whitespace-nowrap">₹{item.subtotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placeOrderMutation.isPending || !selectedAddress}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 transition"
            >
              {placeOrderMutation.isPending
                ? <><Spinner size="sm" className="text-white" /> Placing Order…</>
                : <><Package className="h-4 w-4" /> Place Order</>
              }
            </button>
            <p className="text-xs text-center text-zinc-400">
              By placing your order, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
