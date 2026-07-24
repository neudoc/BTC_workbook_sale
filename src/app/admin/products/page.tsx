"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  salePrice: number | null;
  category: string;
  stock: number;
  thumbnailUrl: string | null;
  tags: string;
  isActive: boolean;
}

interface ProductForm {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  salePrice: string;
  category: string;
  stock: string;
  thumbnailUrl: string;
  tags: string;
}

const EMPTY_FORM: ProductForm = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  salePrice: "",
  category: "",
  stock: "0",
  thumbnailUrl: "",
  tags: "",
};

function formatPrice(won: number) {
  return `${won.toLocaleString("ko-KR")}원`;
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditingSlug(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setEditingSlug(product.slug);
    setForm({
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription ?? "",
      description: product.description ?? "",
      price: String(product.price),
      salePrice: product.salePrice != null ? String(product.salePrice) : "",
      category: product.category ?? "",
      stock: String(product.stock),
      thumbnailUrl: product.thumbnailUrl ?? "",
      tags: product.tags ?? "",
    });
    setShowForm(true);
  }

  function updateForm(field: keyof ProductForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      slug: field === "name" && !editingSlug ? toSlug(value) : prev.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const body = {
        name: form.name,
        slug: form.slug,
        shortDescription: form.shortDescription,
        description: form.description,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        category: form.category,
        stock: Number(form.stock),
        thumbnailUrl: form.thumbnailUrl || null,
        tags: form.tags,
      };

      const url = editingSlug ? `/api/products/${editingSlug}` : "/api/products";
      const method = editingSlug ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("상품 저장에 실패했습니다.");
        return;
      }

      const saved = await res.json();
      if (editingSlug) {
        setProducts((prev) => prev.map((product) => (product.slug === editingSlug ? saved : product)));
      } else {
        setProducts((prev) => [saved, ...prev]);
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingSlug(null);
    } catch {
      alert("상품 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/products/${product.slug}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((item) => item.slug !== product.slug));
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">상품 관리</h1>
          <p className="mt-1 text-slate-600">판매 상품을 등록하고 관리합니다.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800"
        >
          상품 추가
        </button>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">
            {editingSlug ? "상품 수정" : "새 상품 등록"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">상품명 *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="상품명을 입력하세요"
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">슬러그 *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => updateForm("slug", e.target.value)}
                  placeholder="product-slug"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">짧은 설명</label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => updateForm("shortDescription", e.target.value)}
                placeholder="목록에 표시할 설명"
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">상세 설명</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="상품 상세 설명을 입력하세요"
                className="w-full"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">가격 *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">할인가</label>
                <input
                  type="number"
                  min="0"
                  value={form.salePrice}
                  onChange={(e) => updateForm("salePrice", e.target.value)}
                  placeholder="선택 입력"
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">재고 *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => updateForm("stock", e.target.value)}
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  썸네일 이미지 URL
                </label>
                <input
                  type="text"
                  value={form.thumbnailUrl}
                  onChange={(e) => updateForm("thumbnailUrl", e.target.value)}
                  placeholder="/images/products/example.jpg"
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">카테고리</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  placeholder="교재세트"
                  className="w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  태그
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => updateForm("tags", e.target.value)}
                  placeholder="태그1, 태그2"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
              >
                {saving ? "저장 중..." : editingSlug ? "수정" : "등록"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSlug(null);
                  setForm(EMPTY_FORM);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">상품명</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">카테고리</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">가격</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">재고</th>
                <th className="px-4 py-3 text-center font-medium text-slate-600">상태</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">작업</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    로딩 중...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    등록된 상품이 없습니다.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-slate-500">{product.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{product.category || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-medium">{formatPrice(product.price)}</div>
                      {product.salePrice != null ? (
                        <div className="text-xs text-red-600 line-through">
                          {formatPrice(product.salePrice)}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">{product.stock}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.isActive ? "판매중" : "비활성"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
