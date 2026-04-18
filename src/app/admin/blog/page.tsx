"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  thumbnailUrl: string | null;
  status: "published" | "draft";
  createdAt: string;
}

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  thumbnailUrl: string;
  status: "published" | "draft";
}

const EMPTY_FORM: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  thumbnailUrl: "",
  status: "draft",
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR");
  } catch {
    return dateStr;
  }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      category: post.category ?? "",
      tags: post.tags ?? "",
      thumbnailUrl: post.thumbnailUrl ?? "",
      status: post.status,
    });
    setShowForm(true);
  }

  function updateForm(field: keyof BlogForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !editingId) {
      setForm((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9가-힣\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      }));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, thumbnailUrl: data.url }));
      } else {
        const data = await res.json();
        alert(data.error || "이미지 업로드에 실패했습니다.");
      }
    } catch {
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form };
      const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingId) {
          setPosts((prev) => prev.map((p) => (p.id === editingId ? saved : p)));
        } else {
          setPosts((prev) => [saved, ...prev]);
        }
        setShowForm(false);
        setForm(EMPTY_FORM);
        setEditingId(null);
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">블로그 관리</h1>
          <p className="mt-1 text-slate-600">블로그 글을 작성하고 관리합니다.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white hover:bg-brand-800 min-w-[160px]"
        >
          + 글 작성
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "글 수정" : "새 글 작성"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  제목 *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder="글 제목을 입력하세요"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  슬러그 *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => updateForm("slug", e.target.value)}
                  placeholder="post-slug"
                />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                대표 이미지
              </label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  />
                  <p className="mt-1 text-xs text-slate-500">JPG, PNG, GIF, WebP (최대 5MB)</p>
                  {uploading && <p className="mt-1 text-sm text-brand-700">업로드 중...</p>}
                </div>
                {form.thumbnailUrl && (
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200">
                    <Image
                      src={form.thumbnailUrl}
                      alt="썸네일 미리보기"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, thumbnailUrl: "" }))}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
                    >
                      x
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                요약
              </label>
              <input
                type="text"
                value={form.excerpt}
                onChange={(e) => updateForm("excerpt", e.target.value)}
                placeholder="글 요약을 입력하세요"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                본문 *
              </label>
              <textarea
                rows={10}
                required
                value={form.content}
                onChange={(e) => updateForm("content", e.target.value)}
                placeholder="글 내용을 입력하세요"
                className="w-full"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  카테고리
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  placeholder="예: 칼럼, 뉴스"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  태그 (쉼표 구분)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => updateForm("tags", e.target.value)}
                  placeholder="태그1, 태그2"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium text-slate-700">
                  상태
                </label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                >
                  <option value="draft">임시 저장</option>
                  <option value="published">게시</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white hover:bg-brand-800 disabled:opacity-50"
              >
                {saving ? "저장 중..." : editingId ? "수정" : "작성"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-medium hover:bg-slate-50"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600 w-16">이미지</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">제목</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">카테고리</th>
                <th className="px-4 py-3 text-center font-medium text-slate-600">상태</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">작성일</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600">액션</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    로딩 중...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    등록된 글이 없습니다.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      {post.thumbnailUrl ? (
                        <div className="relative h-10 w-14 overflow-hidden rounded-lg">
                          <Image src={post.thumbnailUrl} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                          없음
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-slate-500">{post.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{post.category || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {post.status === "published" ? "게시됨" : "임시 저장"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(post.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(post)}
                          className="rounded-lg px-4 py-2 font-medium text-brand-700 hover:bg-brand-50"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="rounded-lg px-4 py-2 font-medium text-red-600 hover:bg-red-50"
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
