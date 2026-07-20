import { Plus } from "lucide-react";
import { COLORS, fmt } from "../utils/helpers";

export default function OrdersView({ orders, onNewOrder }) {
  return (
    <div className="view">
      <div className="toolbar toolbar--right">
        <button className="btn btn--primary" onClick={onNewOrder}><Plus size={15} /> New order</button>
      </div>
      <div className="panel panel--table">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date &amp; time</th>
              <th>Items</th>
              <th>Total units</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={5} className="table__empty">No orders yet — process your first order to see it here.</td></tr>
            )}
            {[...orders].reverse().map((o) => (
              <tr key={o.id}>
                <td className="mono">{o.id}</td>
                <td>{new Date(o.date).toLocaleString()}</td>
                <td>
                  <div className="order-item-list">
                    {o.items.map((it) => (
                      <span key={it.productId} className="order-item-chip">
                        {it.sku} × {fmt(it.qty)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="mono">{fmt(o.items.reduce((s, i) => s + i.qty, 0))}</td>
                <td><span className="badge" style={{ color: COLORS.good, background: "rgba(47,158,68,0.10)", borderColor: COLORS.good }}>FULFILLED</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
