import { useState } from "react";
import { X } from "lucide-react";
import { UNITS, uid } from "../utils/helpers";

export default function ProductModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || {
      sku: "", name: "", category: "", location: "",
      qty: 0, reorderPoint: 0, maxLevel: 0, unit: "pcs",
    }
  );
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit() {
    if (!form.sku.trim() || !form.name.trim() || !form.category.trim() || !form.location.trim()) {
      setError("SKU, name, category, and location are all required.");
      return;
    }
    if ([form.qty, form.reorderPoint, form.maxLevel].some((v) => v === "" || isNaN(v) || Number(v) < 0)) {
      setError("Quantity, reorder point, and max level must be zero or greater.");
      return;
    }
    onSave({
      ...form,
      qty: Number(form.qty),
      reorderPoint: Number(form.reorderPoint),
      maxLevel: Number(form.maxLevel),
      id: initial ? initial.id : uid("p"),
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>{initial ? "Edit product" : "Add product"}</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <div className="form-grid">
            <label className="field">
              <span>SKU</span>
              <input value={form.sku} onChange={(e) => update("sku", e.target.value)} placeholder="ELX-1042" className="mono" />
            </label>
            <label className="field">
              <span>Unit</span>
              <select value={form.unit} onChange={(e) => update("unit", e.target.value)}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </label>
            <label className="field field--wide">
              <span>Product name</span>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Wireless Mouse M2" />
            </label>
            <label className="field">
              <span>Category</span>
              <input value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Electronics" />
            </label>
            <label className="field">
              <span>Location (aisle-rack-shelf)</span>
              <input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="A-03-2" className="mono" />
            </label>
            <label className="field">
              <span>Quantity on hand</span>
              <input type="number" min="0" value={form.qty} onChange={(e) => update("qty", e.target.value)} className="mono" />
            </label>
            <label className="field">
              <span>Reorder point</span>
              <input type="number" min="0" value={form.reorderPoint} onChange={(e) => update("reorderPoint", e.target.value)} className="mono" />
            </label>
            <label className="field">
              <span>Max level</span>
              <input type="number" min="0" value={form.maxLevel} onChange={(e) => update("maxLevel", e.target.value)} className="mono" />
            </label>
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={submit}>{initial ? "Save changes" : "Add to inventory"}</button>
        </div>
      </div>
    </div>
  );
}
