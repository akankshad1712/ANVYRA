"use client";

import { useCartStore } from "@/store/cart.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, Truck } from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, isLoading } = useCartStore();
  const { error: showError } = useToast();

  const items    = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shipping = subtotal >= 999 ? 0 : subtotal === 0 ? 0 : 99;
  const total    = subtotal + shipping;

  const handleQty = async (itemId: number, qty: number) => {
    try { await updateQuantity(itemId, qty); }
    catch { showError("Failed to update quantity"); }
  };
  const handleRemove = async (itemId: number) => {
    try { await removeItem(itemId); }
    catch { showError("Failed to remove item"); }
  };

  if (items.length === 0) {
    return (
      <main className="py-20 bg-[#F7F3EE]">
        <Container>
          <EmptyState
            icon={<ShoppingBag className="h-12 w-12" />}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet."
            action={{ label: "Continue Shopping", href: "/shop" }}
          />
        </Container>
      </main>
    );
  }

  const btnQty = "rounded-lg border border-[#D6CCBF] p-1 text-[#5C2E1A] hover:bg-[#EDE8E0] disabled:opacity-40 transition-colors";

  return (
    <main className="py-10 bg-[#F7F3EE]">
      <Container>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#1C0A04] mb-8">
          Shopping Cart <span className="text-[#A0673A] font-normal text-xl">({cart?.totalItems})</span>
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-[#D6CCBF] bg-white p-4">
                <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#EDE8E0]">
                  {item.productImage && (
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-[#3D1A0A] line-clamp-2">{item.productName}</h3>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-xs text-[#A0673A] mt-0.5">
                          {[item.selectedSize, item.selectedColor].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-[#A0673A] hover:text-[#5C2E1A] ml-2 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 rounded-lg border border-[#D6CCBF] px-1 py-0.5">
                      <button onClick={() => handleQty(item.id, item.quantity - 1)} disabled={isLoading || item.quantity <= 1} className={btnQty}>
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-[#3D1A0A]">{item.quantity}</span>
                      <button onClick={() => handleQty(item.id, item.quantity + 1)} disabled={isLoading} className={btnQty}>
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-semibold text-[#3D1A0A]">₹{item.subtotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 h-fit space-y-4">
            <h2 className="font-semibold text-lg text-[#1C0A04]">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A0673A]">Subtotal ({cart?.totalItems} items)</span>
                <span className="text-[#3D1A0A]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0673A]">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-700 font-medium" : "text-[#3D1A0A]"}>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[#A0673A] flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Add ₹{(999 - subtotal).toFixed(0)} more for free shipping
                </p>
              )}
              <div className="border-t border-[#D6CCBF] pt-3 flex justify-between font-bold text-base text-[#1C0A04]">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="block w-full rounded-full bg-[#5C2E1A] py-3.5 text-center font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="block text-center text-sm text-[#A0673A] hover:text-[#5C2E1A] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
