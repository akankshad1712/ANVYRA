"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { useToast } from "@/providers/toast-provider";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Spinner } from "@/components/common/Loading";
import { Plus, Pencil, Trash2, Tag, X, Check } from "lucide-react";
import type { Category, CategoryRequest } from "@/types";
import { cn } from "@/lib/utils";

type EditState = { id: number | null; form: CategoryRequest };

const emptyForm: CategoryRequest = { name: "", description: "", imageUrl: "", slug: "" };

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const { success, error: showError } = useToast();

  const [edit,     setEdit]     = useState<EditState>({ id: null, form: emptyForm });
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: adminService.listCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoryRequest) => adminService.createCategory(data),
    onSuccess: () => {
      success("Category created");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setShowForm(false);
      setEdit({ id: null, form: emptyForm });
    },
    onError: (e: any) => showError(e.message ?? "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryRequest> }) =>
      adminService.updateCategory(id, data),
    onSuccess: () => {
      success("Category updated");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setEdit({ id: null, form: emptyForm });
    },
    onError: (e: any) => showError(e.message ?? "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteCategory(id),
    onSuccess: () => {
      success("Category deleted");
      qc.invalidateQueries({ queryKey: ["categories"] });
      setDeleteId(null);
    },
    onError: (e: any) => { showError(e.message ?? "Failed to delete — category may have products"); setDeleteId(null); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit.form.name.trim()) return;
    if (edit.id !== null) {
      updateMutation.mutate({ id: edit.id, data: edit.form });
    } else {
      createMutation.mutate(edit.form);
    }
  };

  const startEdit = (cat: Category) => {
    setEdit({ id: cat.id, form: { name: cat.name, description: cat.description ?? "", imageUrl: cat.imageUrl ?? "", slug: cat.slug } });
    setShowForm(true);
  };

  const inputCls = "w-full rounded-lg border border-[#D6CCBF] bg-white px-3 py-2 text-sm text-[#3D1A0A] focus:border-[#C4956A] focus:outline-none";
  const labelCls = "block text-xs font-medium text-[#5C2E1A] mb-1";
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <AdminBreadcrumb crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Categories" }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#1C0A04]">Categories</h1>
          <p className="text-sm text-[#A0673A] mt-0.5">{categories.length} categories</p>
        </div>
        <button
          onClick={() => { setEdit({ id: null, form: emptyForm }); setShowForm(true); }}
          className="flex items-center gap-2 rounded-full bg-[#5C2E1A] px-4 py-2.5 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] transition-colors"
        >
          <Plus className="h-4 w-4" /> New Category
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-[#C4956A]/50 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-[#1C0A04]">
              {edit.id !== null ? "Edit Category" : "New Category"}
            </h3>
            <button type="button" onClick={() => { setShowForm(false); setEdit({ id: null, form: emptyForm }); }}
              className="text-[#A0673A] hover:text-[#5C2E1A]"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name *</label>
              <input required value={edit.form.name}
                onChange={(e) => setEdit((s) => ({ ...s, form: { ...s.form, name: e.target.value } }))}
                className={inputCls} placeholder="e.g. Men" />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input value={edit.form.slug ?? ""}
                onChange={(e) => setEdit((s) => ({ ...s, form: { ...s.form, slug: e.target.value } }))}
                className={inputCls} placeholder="men (auto-generated if blank)" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <input value={edit.form.description ?? ""}
              onChange={(e) => setEdit((s) => ({ ...s, form: { ...s.form, description: e.target.value } }))}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Image URL</label>
            <input type="url" value={edit.form.imageUrl ?? ""}
              onChange={(e) => setEdit((s) => ({ ...s, form: { ...s.form, imageUrl: e.target.value } }))}
              className={inputCls} placeholder="https://..." />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => { setShowForm(false); setEdit({ id: null, form: emptyForm }); }}
              className="rounded-full border border-[#D6CCBF] px-5 py-2 text-sm font-medium text-[#5C2E1A] hover:bg-[#EDE8E0] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="flex items-center gap-2 rounded-full bg-[#5C2E1A] px-5 py-2 text-sm font-semibold text-[#F7F3EE] hover:bg-[#3D1A0A] disabled:opacity-50 transition-colors">
              {isSaving ? <Spinner size="sm" className="text-[#F7F3EE]" /> : <Check className="h-4 w-4" />}
              {edit.id !== null ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      )}

      {/* Category list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#EDE8E0]" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Tag className="h-12 w-12 text-[#C4956A]/50 mb-4" />
          <p className="font-semibold text-[#3D1A0A]">No categories yet</p>
          <p className="text-sm text-[#A0673A] mt-1">Create your first category to organise products.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#D6CCBF] bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[#EDE8E0] bg-[#F7F3EE]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A0673A]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8E0]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#F7F3EE] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#3D1A0A]">{cat.name}</p>
                    {cat.description && <p className="text-xs text-[#A0673A] mt-0.5 line-clamp-1">{cat.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-[#A0673A] font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      cat.active ? "bg-emerald-100 text-emerald-700" : "bg-[#EDE8E0] text-[#A0673A]"
                    )}>
                      {cat.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(cat)}
                        className="rounded-lg p-1.5 text-[#A0673A] hover:bg-[#EDE8E0] hover:text-[#5C2E1A] transition-colors"
                        aria-label={`Edit ${cat.name}`}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteId(cat.id)}
                        className="rounded-lg p-1.5 text-[#A0673A] hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label={`Delete ${cat.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Category"
        description="Products in this category will lose their category assignment. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => deleteId !== null && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
