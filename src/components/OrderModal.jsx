import { useState, useMemo } from "react";
import { Search, Plus, Trash2, X } from "lucide-react";
import { fmt } from "../utils/helpers";

export default function OrderModal({ products, onClose, onSubmit }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]); // {productId, qty}
  const [error, setError] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => p.qty > 0 && (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [query, products]);

  function addItem(product) {
    if (items.find((i) => i.productId === product.id)) return;
    setItems((its) => [...its, { productId: product.id, qty: 1 }]);
    setQuery("");
  }

  function setQty(productId, qty) {
    setItems((its) => its.map((i) => (i.productId === productId ? { ...i, qty } : i)));
  }

  function removeItem(productId) {
    setItems((its) => its.filter((i) => i.productId !== productId));
  }

  function submit() {
    if (items.length === 0) {
      setError("Add at least one product to the order.");
      return;
    }
    for (const it of items) {
      const p = products.find((pp) => pp.id === it.productId);
      const q = Number(it.qty);
      if (!q || q <= 0) {
        setError(`Enter a valid quantity for ${p.name}.`);
        return;
      }
      if (q > p.qty) {
        setError(`Only ${fmt(p.qty)} ${p.unit} of ${p.name} available.`);
        return;
      }
    }
    onSubmit(items.map((i) => ({ ...i, qty: Number(i.qty) })));
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>New order</h3>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal__body">
          <label className="field field--wide">
            <span>Find product by name or SKU</span>
            <div className="search-input">
              <Search size={15} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inventory..." />
            </div>
          </label>
          {results.length > 0 && (
            <div className="order-results">
              {results.map((p) => (
                <button key={p.id} className="order-result" onClick={() => addItem(p)}>
                  <span className="mono order-result__sku">{p.sku}</span>
                  <span className="order-result__name">{p.name}</span>
                  <span className="order-result__avail">{fmt(p.qty)} {p.unit} available</span>
                  <Plus size={14} />
                </button>
              ))}
            </div>
          )}

          <div className="order-items">
            {items.length === 0 && <p className="empty-note">No line items yet — search above to add products.</p>}
            {items.map((it) => {
              const p = products.find((pp) => pp.id === it.productId);
              return (
                <div key={it.productId} className="order-item">
                  <div className="order-item__info">
                    <span className="mono">{p.sku}</span>
                    <span>{p.name}</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={p.qty}
                    value={it.qty}
                    onChange={(e) => setQty(it.productId, e.target.value)}
                    className="mono order-item__qty"
                  />
                  <span className="order-item__unit">{p.unit}</span>
                  <button className="icon-btn" onClick={() => removeItem(it.productId)}><Trash2 size={15} /></button>
                </div>
              );
            })}
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={submit}>Process order</button>
        </div>
      </div>
    </div>
  );
}
