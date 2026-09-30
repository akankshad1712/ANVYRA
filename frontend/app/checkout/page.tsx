"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/providers/toast-provider";
import { addressesService } from "@/services/addresses.service";
import { ordersService } from "@/services/orders.service";
import Container from "@/components/common/Container";
import { PageLoader, Spinner } from "@/components/common/Loading";
import Image from "next/image";
import Link from "next/link";
import type { PaymentMethod } from "@/types";
import { DEFAULT_FALLBACK } from "@/lib/product-images";
import {
  MapPin, CreditCard, Package, Plus, CheckCircle,
  Truck, ShieldCheck, ArrowLeft, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; desc: string; icon: string }[] = [
  { value: "COD",         label: "Cash on Delivery",    desc: "Pay when your order arrives",               icon: "💵" },
  { value: "UPI",         label: "UPI",                 desc: "PhonePe · GPay · Paytm (gateway required)", icon: "📱" },
  { value: "CARD",        label: "Credit / Debit Card", desc: "Visa · Mastercard · RuPay",                 icon: "💳" },
  { value: "NET_BANKING", label: "Net Banking",         desc: "All major Indian banks",                    icon: "🏦" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart }            = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { success, error: showError } = useToast();

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod,   setPaymentMethod]   = useState<PaymentMethod>("COD");
  const [showAddAddress,  setShowAddAddress]  = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "", phone: "", street: "", city: "",
    state: "", postalCode: "", country: "India", isDefault: false as boolean,
  });

  // Redirect if not logged in (backup for middleware)
  useEffect(() => {
    if (!isAuthenticated) router.push("/login?from=/checkout");
  }, [isAuthenticated, router]);

  const { data: addresses = [], refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressesService.getAll,
    enabled: isAuthenticated,
  });

  // Auto-select default / first address
  useEffect(() => {
    if (selectedAddress) return;
    const def = addresses.find((a) => a.isDefault);
    if (def) setSelectedAddress(def.id);
    else if (addresses.length > 0) setSelectedAddress(addresses[0].id);
  }, [addresses, selectedAddress]);

  const createAddressMutation = useMutation({
    mutationFn: addressesService.create,
    onSuccess: (addr) => {
      setSelectedAddress(addr.id);
      setShowAddAddress(false);
      setNewAddress({ fullName: "", phone: "", street: "", city: "", state: "", postalCode: "", country: "India", isDefault: false });
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

  const items    = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total    = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F7F3EE]">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-[#C4956A]/40 mb-4" />
          <h1 className="text-2xl font-bold text-[#1C0A04] mb-2">Your cart is empty</h1>
          <p className="text-[#A0673A] mb-6">Add some items before checking out.</p>
          <Link href="/shop" className="rounded-full bg-[#5C2E1A] px-8 py-3 font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors">
            Browse Products
          </Link>
        </div>
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

  const radioCard = (active: boolean) => cn(
    "flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition-all duration-200",
    active
      ? "border-[#C4956A] bg-[#FFF8F2] shadow-sm"
      : "border-[#E6DFD5] bg-white hover:border-[#C4956A]/50"
  );

  const inputCls =
    "w-full rounded-lg border border-[#D6CCBF] bg-white px-3 py-2.5 text-sm text-[#3D1A0A] placeholder:text-[#A0673A]/40 focus:border-[#C4956A] focus:outline-none focus:ring-2 focus:ring-[#C4956A]/15 transition";

  return (
    <main className="min-h-screen bg-[#F7F3EE] py-8 lg:py-12">
      <Container>
        {/* ── Back link + heading ──────────────────────────── */}
        <div className="mb-8">
          <Link href="/cart" className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#A0673A] hover:text-[#5C2E1A] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to cart
          </Link>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04] lg:text-4xl">
            Checkout
          </h1>
        </div>

        {/* ── Steps indicator ──────────────────────────────── */}
        <div className="mb-10 flex items-center gap-2">
          {[
            { icon: MapPin,      label: "Address" },
            { icon: CreditCard,  label: "Payment" },
            { icon: Package,     label: "Confirm" },
          ].map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                i === 0 ? "bg-[#5C2E1A] text-[#F7F3EE]" : "bg-[#EDE8E0] text-[#A0673A]"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn("hidden text-sm font-medium sm:block", i === 0 ? "text-[#3D1A0A]" : "text-[#A0673A]")}>
                {label}
              </span>
              {i < 2 && <div className="mx-2 h-px w-8 bg-[#D6CCBF] sm:w-16" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* ── Left col: address + payment ─────────────────── */}
          <div className="lg:col-span-3 space-y-6">

            {/* Delivery address */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE8E0]">
                  <MapPin className="h-4 w-4 text-[#C4956A]" />
                </div>
                <h2 className="font-semibold text-lg text-[#1C0A04]">Delivery Address</h2>
              </div>

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label key={addr.id} className={radioCard(selectedAddress === addr.id)}>
                    <input
                      type="radio" name="address" value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-0.5 accent-[#C4956A]"
                    />
                    <div className="flex-1 text-sm">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#3D1A0A]">{addr.fullName}</p>
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            <CheckCircle className="h-2.5 w-2.5" /> Default
                          </span>
                        )}
                      </div>
                      <p className="text-[#A0673A] mt-0.5">{addr.street}</p>
                      <p className="text-[#A0673A]">{addr.city}, {addr.state} — {addr.postalCode}</p>
                      <p className="text-[#A0673A]">{addr.country} · 📞 {addr.phone}</p>
                    </div>
                    {selectedAddress === addr.id && (
                      <CheckCircle className="h-5 w-5 text-[#C4956A] flex-shrink-0 mt-0.5" />
                    )}
                  </label>
                ))}

                {addresses.length === 0 && !showAddAddress && (
                  <p className="text-sm text-[#A0673A] py-2">No saved addresses. Add one below.</p>
                )}

                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="flex items-center gap-2 rounded-lg border border-dashed border-[#C4956A]/50 px-4 py-2.5 text-sm font-medium text-[#5C2E1A] hover:border-[#C4956A] hover:bg-[#FFF8F2] transition-colors w-full"
                >
                  <Plus className="h-4 w-4" />
                  {showAddAddress ? "Cancel" : "Add new address"}
                </button>
              </div>

              <AnimatePresence>
                {showAddAddress && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSaveAddress}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="space-y-3 rounded-xl border border-[#D6CCBF] bg-[#F7F3EE] p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Full Name *</label>
                          <input required placeholder="John Doe" value={newAddress.fullName}
                            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Phone *</label>
                          <input required placeholder="10-digit number" value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Street Address *</label>
                        <input required placeholder="House no., Street, Area" value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className={inputCls} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">City *</label>
                          <input required placeholder="Mumbai" value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">State *</label>
                          <input required placeholder="Maharashtra" value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className={inputCls} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Postal Code *</label>
                          <input required placeholder="400001" value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#5C2E1A] mb-1">Country</label>
                          <input value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} className={inputCls} />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
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
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Payment method */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE8E0]">
                  <CreditCard className="h-4 w-4 text-[#C4956A]" />
                </div>
                <h2 className="font-semibold text-lg text-[#1C0A04]">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.value} className={radioCard(paymentMethod === m.value)}>
                    <input
                      type="radio" name="payment" value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className="mt-0.5 accent-[#C4956A]"
                    />
                    <span className="text-xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#3D1A0A]">{m.label}</p>
                      <p className="text-xs text-[#A0673A]">{m.desc}</p>
                    </div>
                    {paymentMethod === m.value && (
                      <CheckCircle className="h-5 w-5 text-[#C4956A] flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>

              {paymentMethod !== "COD" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"
                >
                  ⚠️ Online payment gateway requires configuration. Please use Cash on Delivery for now.
                </motion.div>
              )}
            </motion.section>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 text-xs text-[#A0673A]">
              {[
                { Icon: Lock,       text: "SSL secured checkout" },
                { Icon: ShieldCheck,text: "100% authentic products" },
                { Icon: Truck,      text: "Free shipping on ₹999+" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-[#C4956A]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right col: order summary ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-2"
          >
            <div className="sticky top-24 rounded-2xl border border-[#D6CCBF] bg-white p-6 shadow-sm space-y-5">
              <h2 className="font-semibold text-lg text-[#1C0A04]">
                Order Summary
                <span className="ml-2 text-sm font-normal text-[#A0673A]">({items.length} item{items.length !== 1 ? "s" : ""})</span>
              </h2>

              {/* Item list with thumbnails */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#EDE8E0]">
                      <Image
                        src={item.productImage || DEFAULT_FALLBACK}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#5C2E1A] text-[9px] font-bold text-[#F7F3EE]">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#3D1A0A] line-clamp-2">{item.productName}</p>
                      {item.selectedSize && (
                        <p className="text-[10px] text-[#A0673A]">Size: {item.selectedSize}</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#3D1A0A] flex-shrink-0">
                      ₹{item.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#EDE8E0] pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A0673A]">Subtotal</span>
                  <span className="text-[#3D1A0A] font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0673A]">Shipping</span>
                  <span className={cn("font-medium", shipping === 0 ? "text-emerald-700" : "text-[#3D1A0A]")}>
                    {shipping === 0 ? "🎉 Free" : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-[#A0673A] bg-[#F7F3EE] rounded-lg px-3 py-1.5">
                    Add ₹{(999 - subtotal).toFixed(0)} more for free shipping
                  </p>
                )}
                <div className="flex justify-between font-bold text-base border-t border-[#EDE8E0] pt-2.5 text-[#1C0A04]">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Place order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={placeOrderMutation.isPending || !selectedAddress}
                className="w-full rounded-xl bg-[#1C0A04] py-4 font-bold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1C0A04]/20 flex items-center justify-center gap-2"
              >
                {placeOrderMutation.isPending ? (
                  <><Spinner size="sm" className="text-[#F7F3EE]" /> Placing Order…</>
                ) : (
                  <><Lock className="h-4 w-4" /> Place Order · ₹{total.toLocaleString()}</>
                )}
              </button>

              <p className="text-[11px] text-center text-[#A0673A] leading-relaxed">
                By placing your order you agree to ANVYRA&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </main>
  );
}
