import { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";
import { NAV, statusOf, uid } from "./utils/helpers";
import { loadKey, saveKey } from "./utils/storage";
import { SEED_PRODUCTS } from "./data/seedData";

import Dashboard from "./components/Dashboard";
import InventoryView from "./components/InventoryView";
import OrdersView from "./components/OrdersView";
import AlertsView from "./components/AlertsView";
import ProductModal from "./components/ProductModal";
import OrderModal from "./components/OrderModal";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [productModal, setProductModal] = useState(null); // null | {} | product
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      const p = await loadKey("products", null);
      const o = await loadKey("orders", null);
      if (p && p.length) {
        setProducts(p);
      } else {
        setProducts(SEED_PRODUCTS);
        await saveKey("products", SEED_PRODUCTS);
      }
      setOrders(o || []);
      setLoading(false);
      initialized.current = true;
    })();
  }, []);

  function persistProducts(next) {
    setProducts(next);
    if (initialized.current) saveKey("products", next);
  }

  function persistOrders(next) {
    setOrders(next);
    if (initialized.current) saveKey("orders", next);
  }

  function handleSaveProduct(product) {
    const exists = products.some((p) => p.id === product.id);
    const next = exists ? products.map((p) => (p.id === product.id ? product : p)) : [...products, product];
    persistProducts(next);
    setProductModal(null);
  }

  function handleDeleteProduct(id) {
    persistProducts(products.filter((p) => p.id !== id));
  }

  function handleSubmitOrder(items) {
    const withNames = items.map((it) => {
      const p = products.find((pp) => pp.id === it.productId);
      return { productId: it.productId, sku: p.sku, name: p.name, qty: it.qty };
    });
    const nextProducts = products.map((p) => {
      const line = items.find((it) => it.productId === p.id);
      return line ? { ...p, qty: p.qty - line.qty } : p;
    });
    const order = { id: uid("ORD"), date: new Date().toISOString(), items: withNames };
    persistProducts(nextProducts);
    persistOrders([...orders, order]);
    setOrderModalOpen(false);
  }

  const activeNav = NAV.find((n) => n.id === tab);

  return (
    <div className="wms-app">
      <div className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark" />
          <div>
            <div className="sidebar__brand-text">RACKTRACK</div>
            <div className="sidebar__brand-sub">WAREHOUSE OPS</div>
          </div>
        </div>
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`nav-item ${tab === n.id ? "nav-item--active" : ""}`}
            onClick={() => setTab(n.id)}
          >
            <span className="nav-item__num mono">{n.num}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </div>

      <div className="main">
        <div className="topbar">
          <div className="topbar__title">{activeNav.label}</div>
          <div className="topbar__right">
            <span className="live-label"><span className="live-dot" />LIVE</span>
            <span className="mono">
              <Clock size={12} style={{ verticalAlign: "-2px", marginRight: 4 }} />
              {now.toLocaleTimeString()} · {now.toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="content">
          {loading ? (
            <div className="loading-screen">Loading warehouse data...</div>
          ) : (
            <>
              {tab === "dashboard" && <Dashboard products={products} orders={orders} setTab={setTab} />}
              {tab === "inventory" && (
                <InventoryView
                  products={products}
                  onAdd={() => setProductModal({})}
                  onEdit={(p) => setProductModal(p)}
                  onDelete={handleDeleteProduct}
                />
              )}
              {tab === "orders" && (
                <OrdersView products={products} orders={orders} onNewOrder={() => setOrderModalOpen(true)} />
              )}
              {tab === "alerts" && <AlertsView products={products} />}
            </>
          )}
        </div>
      </div>

      {productModal !== null && (
        <ProductModal
          initial={productModal.id ? productModal : null}
          onClose={() => setProductModal(null)}
          onSave={handleSaveProduct}
        />
      )}
      {orderModalOpen && (
        <OrderModal
          products={products}
          onClose={() => setOrderModalOpen(false)}
          onSubmit={handleSubmitOrder}
        />
      )}
    </div>
  );
}
