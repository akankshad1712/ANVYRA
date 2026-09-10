"use client";

import { useCartStore } from "@/store/cart.store";
import { useToast } from "@/providers/toast-provider";
import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, isLoading } = useCartStore();
  const { error: showError } = useToast();

  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shipping = subtotal >= 999 ? 0 : subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

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
      <main className="py-20">
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

  return (
    <main className="py-10">
      <Container>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-8">
          Shopping Cart ({cart?.totalItems})
        </h1>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-zinc-100 p-4">
                <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  {item.productImage && (
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium line-clamp-2">{item.productName}</h3>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {[item.selectedSize, item.selectedColor].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-zinc-400 hover:text-zinc-900 ml-2">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-1 py-0.5">
                      <button onClick={() => handleQty(item.id, item.quantity - 1)} disabled={isLoading || item.quantity <= 1}
                        className="p-1 disabled:opacity-40 hover:bg-zinc-50 rounded">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => handleQty(item.id, item.quantity + 1)} disabled={isLoading}
                        className="p-1 disabled:opacity-40 hover:bg-zinc-50 rounded">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-semibold">₹{item.subtotal.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-zinc-100 p-6 h-fit space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">Subtotal ({cart?.totalItems} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-zinc-400 flex items-center gap-1">
                  <Truck className="h-3 w-3" /> Add ₹{(999 - subtotal).toFixed(0)} more for free shipping
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout"
              className="block w-full rounded-full bg-black py-3.5 text-center font-semibold text-white hover:bg-zinc-800 transition">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="block text-center text-sm text-zinc-500 hover:text-zinc-900">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
