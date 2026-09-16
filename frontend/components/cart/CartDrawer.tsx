"use client";

import { useCartStore } from "@/store/cart.store";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/providers/toast-provider";
import { Spinner } from "@/components/common/Loading";
import { DEFAULT_FALLBACK } from "@/lib/product-images";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, isLoading } = useCartStore();
  const { error: showError } = useToast();

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    try { await updateQuantity(itemId, newQty); }
    catch { showError("Failed to update quantity"); }
  };

  const handleRemove = async (itemId: number) => {
    try { await removeItem(itemId); }
    catch { showError("Failed to remove item"); }
  };

  const items    = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total    = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-[#1C0A04]/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col bg-[#F7F3EE] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D6CCBF] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#3D1A0A]">
                Your Cart ({cart?.totalItems ?? 0})
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="mb-4 h-16 w-16 text-[#C4956A]/50" />
                  <h3 className="text-lg font-semibold text-[#3D1A0A]">Your cart is empty</h3>
                  <p className="mt-2 text-sm text-[#A0673A]">Start shopping to add items.</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-[#5C2E1A] px-6 py-3 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.productImage ? (
                        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#EDE8E0]">
                          <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#EDE8E0]">
                          <Image src={DEFAULT_FALLBACK} alt={item.productName} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium text-[#3D1A0A] line-clamp-2">{item.productName}</h4>
                          <button onClick={() => handleRemove(item.id)} className="text-[#A0673A] hover:text-[#5C2E1A] transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="mt-1 text-xs text-[#A0673A]">
                            {[item.selectedSize && `Size: ${item.selectedSize}`, item.selectedColor].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                              className="rounded-lg border border-[#D6CCBF] p-1 text-[#5C2E1A] hover:bg-[#EDE8E0] disabled:opacity-40 transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-[#3D1A0A]">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              className="rounded-lg border border-[#D6CCBF] p-1 text-[#5C2E1A] hover:bg-[#EDE8E0] disabled:opacity-40 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-[#3D1A0A]">₹{item.subtotal.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#D6CCBF] px-6 py-4 space-y-4 bg-[#F7F3EE]">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#A0673A]">Subtotal</span>
                    <span className="font-medium text-[#3D1A0A]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0673A]">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? "text-emerald-700" : "text-[#3D1A0A]"}`}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#D6CCBF] pt-2 text-base font-semibold text-[#3D1A0A]">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center rounded-full bg-[#5C2E1A] px-6 py-3.5 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
                >
                  {isLoading ? <Spinner size="sm" className="text-[#F7F3EE]" /> : "Checkout"}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-sm text-[#A0673A] hover:text-[#5C2E1A] transition-colors"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
