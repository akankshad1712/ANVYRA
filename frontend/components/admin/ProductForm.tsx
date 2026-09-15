"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories.service";
import { Spinner } from "@/components/common/Loading";
import type { Product, ProductRequest } from "@/types";
import { Plus, X } from "lucide-react";

interface ProductFormProps {
  initial?: Product;
  onSubmit: (data: ProductRequest) => Promise<void>;
  loading: boolean;
  submitLabel: string;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductForm({ initial, onSubmit, loading, submitLabel }: ProductFormProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesService.getAll,
  });

  const [form, setForm] = useState<ProductRequest>({
    name:          initial?.name          ?? "",
    description:   initial?.description   ?? "",
    brand:         initial?.brand         ?? "",
    price:         initial?.price         ?? 0,
    discountPrice: initial?.discountPrice ?? 0,
    quantity:      initial?.quantity      ?? 0,
    active:        initial?.active        ?? true,
    featured:      initial?.featured      ?? false,
    images:        initial?.images        ?? [],
    sizes:         initial?.sizes         ?? [],
    colors:        initial?.colors        ?? [],
    categoryId:    initial?.category?.id  ?? undefined,
  });

  const [newImage, setNewImage] = useState("");
  const [newColor, setNewColor] = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});

  const set = (key: keyof ProductRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setNum = (key: "price" | "discountPrice" | "quantity") => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((f) => ({ ...f, [key]: Number(e.target.value) }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name?.trim())  errs.name  = "Product name is required";
    if (!form.brand?.trim()) errs.brand = "Brand is required";
    if (!form.price || form.price <= 0) errs.price = "Price must be greater than 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const toggleSize = (size: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes?.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...(f.sizes ?? []), size],
    }));

  const addImage = () => {
    if (!newImage.trim()) return;
    setForm((f) => ({ ...f, images: [...(f.images ?? []), newImage.trim()] }));
    setNewImage("");
  };

  const removeImage = (i: number) =>
    setForm((f) => ({ ...f, images: f.images?.filter((_, idx) => idx !== i) }));

  const addColor = () => {
    if (!newColor.trim()) return;
    setForm((f) => ({ ...f, colors: [...(f.colors ?? []), newColor.trim()] }));
    setNewColor("");
  };

  const removeColor = (c: string) =>
    setForm((f) => ({ ...f, colors: f.colors?.filter((x) => x !== c) }));

  const inputCls = "w-full rounded-lg border border-[#D6CCBF] bg-white px-4 py-2.5 text-sm text-[#3D1A0A] focus:border-[#C4956A] focus:outline-none focus:ring-2 focus:ring-[#C4956A]/20 transition";
  const labelCls = "block text-sm font-medium text-[#5C2E1A] mb-1";
  const errCls   = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 space-y-5">
        <h3 className="font-semibold text-[#1C0A04]">Product Information</h3>
        <div>
          <label className={labelCls}>Name *</label>
          <input value={form.name} onChange={set("name")} className={inputCls} placeholder="e.g. Premium Cotton Tee" />
          {errors.name && <p className={errCls}>{errors.name}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Brand *</label>
            <input value={form.brand} onChange={set("brand")} className={inputCls} />
            {errors.brand && <p className={errCls}>{errors.brand}</p>}
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select
              value={form.categoryId ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value ? Number(e.target.value) : undefined }))}
              className={inputCls}
            >
              <option value="">No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea value={form.description} onChange={set("description")}
            rows={4} className={inputCls + " resize-none"} placeholder="Describe this product…" />
        </div>
      </div>

      {/* Pricing + stock */}
      <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 space-y-5">
        <h3 className="font-semibold text-[#1C0A04]">Pricing &amp; Stock</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Price (₹) *</label>
            <input type="number" min="0" step="0.01" value={form.price} onChange={setNum("price")} className={inputCls} />
            {errors.price && <p className={errCls}>{errors.price}</p>}
          </div>
          <div>
            <label className={labelCls}>Discount Price (₹)</label>
            <input type="number" min="0" step="0.01" value={form.discountPrice ?? 0} onChange={setNum("discountPrice")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Stock Quantity</label>
            <input type="number" min="0" value={form.quantity ?? 0} onChange={setNum("quantity")} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 space-y-3">
        <h3 className="font-semibold text-[#1C0A04]">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button key={size} type="button" onClick={() => toggleSize(size)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                form.sizes?.includes(size)
                  ? "border-[#5C2E1A] bg-[#5C2E1A] text-[#F7F3EE]"
                  : "border-[#D6CCBF] text-[#5C2E1A] hover:border-[#C4956A]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 space-y-3">
        <h3 className="font-semibold text-[#1C0A04]">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {form.colors?.map((color) => (
            <span key={color} className="flex items-center gap-1 rounded-full bg-[#EDE8E0] px-3 py-1 text-sm text-[#5C2E1A]">
              {color}
              <button type="button" onClick={() => removeColor(color)} className="hover:text-red-600 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newColor} onChange={(e) => setNewColor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
            placeholder="e.g. Black, Navy Blue" className={inputCls + " flex-1"} />
          <button type="button" onClick={addColor}
            className="rounded-lg border border-[#D6CCBF] px-4 py-2 text-sm text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Images — URL-based (Cloudinary-ready) */}
      <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6 space-y-3">
        <h3 className="font-semibold text-[#1C0A04]">Images</h3>
        <p className="text-xs text-[#A0673A]">Enter public image URLs. Cloudinary upload will be added in the next phase.</p>
        <div className="space-y-2">
          {form.images?.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={url}
                onChange={(e) => setForm((f) => ({
                  ...f,
                  images: f.images?.map((img, idx) => idx === i ? e.target.value : img),
                }))}
                className={inputCls + " flex-1"} placeholder="https://..." />
              <button type="button" onClick={() => removeImage(i)}
                className="p-2 text-[#A0673A] hover:text-red-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newImage} onChange={(e) => setNewImage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            placeholder="https://cdn.example.com/image.jpg" className={inputCls + " flex-1"} />
          <button type="button" onClick={addImage}
            className="rounded-lg border border-[#D6CCBF] px-4 py-2 text-sm text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Flags */}
      <div className="rounded-2xl border border-[#D6CCBF] bg-white p-6">
        <h3 className="font-semibold text-[#1C0A04] mb-4">Visibility &amp; Flags</h3>
        <div className="flex flex-wrap gap-6">
          {[
            { key: "active" as const,   label: "Active (visible in store)" },
            { key: "featured" as const, label: "Featured (highlight on homepage)" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" checked={!!form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
                  className="sr-only peer" />
                <div className="h-5 w-9 rounded-full border border-[#D6CCBF] bg-[#EDE8E0] transition peer-checked:border-[#C4956A] peer-checked:bg-[#C4956A]" />
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
              </div>
              <span className="text-sm text-[#5C2E1A]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={() => window.history.back()}
          className="rounded-full border border-[#D6CCBF] px-6 py-2.5 text-sm font-medium text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 rounded-full bg-[#5C2E1A] px-6 py-2.5 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors">
          {loading ? <Spinner size="sm" className="text-[#F7F3EE]" /> : null}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
