"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/providers/toast-provider";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import ProductForm from "@/components/admin/ProductForm";
import type { ProductRequest } from "@/types";

export default function NewProductPage() {
  const router = useRouter();
  const qc     = useQueryClient();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ProductRequest) => {
    setLoading(true);
    try {
      await adminService.createProduct(data);
      success("Product created!");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      router.push("/admin/products");
    } catch (e: any) {
      showError(e.message ?? "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminBreadcrumb crumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Products",  href: "/admin/products" },
        { label: "New Product" },
      ]} />
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04] mb-6">
        Create Product
      </h1>
      <ProductForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Product" />
    </div>
  );
}
