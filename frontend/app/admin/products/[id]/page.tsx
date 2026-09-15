"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/providers/toast-provider";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import ProductForm from "@/components/admin/ProductForm";
import { PageLoader } from "@/components/common/Loading";
import type { ProductRequest } from "@/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const qc      = useQueryClient();
  const { success, error: showError } = useToast();
  const [saving, setSaving] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => adminService.getProduct(Number(id)),
  });

  const handleSubmit = async (data: ProductRequest) => {
    setSaving(true);
    try {
      await adminService.updateProduct(Number(id), data);
      success("Product updated!");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["product", id] });
      router.push("/admin/products");
    } catch (e: any) {
      showError(e.message ?? "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !product) return <PageLoader />;

  return (
    <div>
      <AdminBreadcrumb crumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Products",  href: "/admin/products" },
        { label: product.name },
      ]} />
      <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04] mb-6">
        Edit Product
      </h1>
      <ProductForm
        initial={product}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel="Save Changes"
      />
    </div>
  );
}
