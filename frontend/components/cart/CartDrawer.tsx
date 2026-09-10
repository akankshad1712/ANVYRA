"use client";

import { useCartStore } from "@/store/cart.store";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/providers/toast-provider";
import { Spinner } from "@/components/common/Loading";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, isLoading } = useCartStore();
  const { error: showError } = useToast();

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    try {
      await updateQuantity(itemId, newQty);
    } catch {
      showError("Failed to update quantity");
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await removeItem(itemId);
    } catch {
      showError("Failed to remove item");
    }
  };

  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Your Cart ({cart?.totalItems ?? 0})</h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="mb-4 h-16 w-16 text-zinc-300" />
                  <h3 className="text-lg font-semibold">Your cart is empty</h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    Start shopping to add items.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {item.productImage ? (
                        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-24 w-20 flex-shrink-0 rounded-lg bg-zinc-100" />
                      )}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h4 className="text-sm font-medium line-clamp-2">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-zinc-400 hover:text-zinc-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="mt-1 text-xs text-zinc-500">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && " • "}
                            {item.selectedColor && `${item.selectedColor}`}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                              className="rounded-lg border border-zinc-200 p-1 hover:bg-zinc-50 disabled:opacity-40"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              className="rounded-lg border border-zinc-200 p-1 hover:bg-zinc-50 disabled:opacity-40"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold">
                            ₹{item.subtotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t px-6 py-4 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-base font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex w-full items-center justify-center rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  {isLoading ? <Spinner size="sm" className="text-white" /> : "Checkout"}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-sm text-zinc-600 hover:text-zinc-900"
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
