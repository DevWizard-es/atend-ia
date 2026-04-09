"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, Package, PlusCircle, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
};

const ICONS = ["🍔", "🍕", "🌭", "🥩", "🥗", "🥪", "🌮", "🌯", "🍜", "🍣", "🍦", "🍩", "🍷", "🍺", "☕", "🍹", "🛍️", "🔧", "✂️", "📦"];

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({ name: "", description: "", price: "", icon: "🍔" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/catalog");
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        await fetchProducts();
        setShowModal(false);
        setForm({ name: "", description: "", price: "", icon: "🍔" });
      }
    } catch (e) {}
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/catalog/${id}`, { method: "DELETE" });
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {}
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between bg-white/80 backdrop-blur sticky top-8 z-10 py-4 -my-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" /> Catálogo de Productos
          </h1>
          <p className="text-slate-500 font-medium">Gestiona tu menú o inventario para mostrar al público.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        </div>
      </header>

      {/* Main Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-3xl"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Tu catálogo está vacío</h2>
          <p className="text-slate-500 max-w-md mx-auto">Comienza a añadir productos o servicios para que tus leads puedan descubrirlos en tu enlace público.</p>
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors mt-4">
            Añadir primer producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(p.id)} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-full flex items-center justify-center transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-slate-100 shrink-0 transform group-hover:scale-105 transition-transform">
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{p.name}</h3>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-black mt-2">
                    <Tag className="w-3 h-3" /> {p.price.toFixed(2)}€
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-auto line-clamp-2 leading-relaxed">
                {p.description || "Sin descripción adicional."}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg mx-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-indigo-600" /> Añadir Producto
              </h2>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              
              {/* Icon map */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-3">Establecer Icono</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-2 bg-slate-50 rounded-2xl border border-slate-100">
                  {ICONS.map((ic) => (
                    <button 
                      key={ic}
                      type="button"
                      onClick={() => setForm({ ...form, icon: ic })}
                      className={cn(
                        "text-3xl w-12 h-12 flex items-center justify-center rounded-xl transition-all",
                        form.icon === ic ? "bg-white shadow-md scale-110 ring-2 ring-indigo-500" : "hover:bg-slate-200"
                      )}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Nombre del producto</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    placeholder="Ej: Pizza Margarita"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
                  <textarea
                    rows={2}
                    maxLength={150}
                    placeholder="Ingredientes o descripción breve..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">Precio (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="9.99"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm font-medium bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {saving ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
