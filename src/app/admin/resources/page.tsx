"use client";

import { useEffect, useState } from "react";

interface Resource {
  id: number;
  title: string;
  category: string;
  description: string;
  content: string | null;
  fileUrl: string | null;
  visibility: string;
  createdAt: string;
}

const emptyForm = { title: "", category: "", description: "", content: "", visibility: "expert_only" };

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch("/api/admin/resources")
      .then((r) => r.json())
      .then((d) => setResources(Array.isArray(d) ? d : []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function startEdit(r: Resource) {
    setEditingId(r.id);
    setForm({ title: r.title, category: r.category, description: r.description, content: r.content || "", visibility: r.visibility });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = editingId ? "/api/admin/resources" : "/api/admin/resources";
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { id: editingId, ...form } : form;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      cancelEdit();
      load();
    } else {
      alert("저장에 실패했습니다.");
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch("/api/admin/resources", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">전문가 자료 관리</h1>
        <p className="mt-1 text-slate-600">전문가센터에 제공할 교육자료와 양식을 관리합니다.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="font-semibold">{editingId ? "자료 수정" : "새 자료 등록"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium">제목</label>
            <input className="w-full rounded-xl border border-slate-200 px-4 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">카테고리</label>
            <select className="w-full rounded-xl border border-slate-200 px-4 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">선택</option>
              <option value="교육자료">교육자료</option>
              <option value="평가양식">평가양식</option>
              <option value="운영가이드">운영가이드</option>
              <option value="기타">기타</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">설명</label>
          <input className="w-full rounded-xl border border-slate-200 px-4 py-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">내용</label>
          <textarea className="w-full rounded-xl border border-slate-200 px-4 py-2 min-h-32" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50">
            {saving ? "저장 중..." : editingId ? "수정" : "등록"}
          </button>
          {editingId ? (
            <button type="button" onClick={cancelEdit} className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              취소
            </button>
          ) : null}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">로딩 중...</div>
      ) : resources.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">등록된 자료가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {resources.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-slate-600">{r.category} · {r.visibility === "expert_only" ? "전문가 전용" : "공개"}</div>
                  {r.description ? <div className="mt-1 text-sm text-slate-500">{r.description}</div> : null}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(r)} className="text-sm text-brand-700 hover:underline">수정</button>
                  <button onClick={() => handleDelete(r.id)} className="text-sm text-red-600 hover:underline">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
