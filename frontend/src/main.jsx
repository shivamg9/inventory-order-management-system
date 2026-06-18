import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  PackagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { api } from "./api";
import "./styles.css";

const emptyProduct = { name: "", sku: "", price: "", quantity_in_stock: "" };
const emptyCustomer = { full_name: "", email: "", phone_number: "" };

function money(value) {
  return Number(value || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function App() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [orderForm, setOrderForm] = useState({ customer_id: "", product_id: "", quantity: 1 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [dashboardData, productData, customerData, orderData] = await Promise.all([
        api.dashboard(),
        api.products(),
        api.customers(),
        api.orders(),
      ]);
      setDashboard(dashboardData);
      setProducts(productData);
      setCustomers(customerData);
      setOrders(orderData);
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function showNotice(message, type = "success") {
    setNotice({ message, type });
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => setNotice(null), 3500);
  }

  async function submitProduct(event) {
    event.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      quantity_in_stock: Number(productForm.quantity_in_stock),
    };
    try {
      if (editingProductId) {
        await api.updateProduct(editingProductId, payload);
        showNotice("Product updated");
      } else {
        await api.createProduct(payload);
        showNotice("Product added");
      }
      setProductForm(emptyProduct);
      setEditingProductId(null);
      loadData();
    } catch (error) {
      showNotice(error.message, "error");
    }
  }

  function editProduct(product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity_in_stock: product.quantity_in_stock,
    });
  }

  async function removeProduct(id) {
    try {
      await api.deleteProduct(id);
      showNotice("Product deleted");
      loadData();
    } catch (error) {
      showNotice(error.message, "error");
    }
  }

  async function submitCustomer(event) {
    event.preventDefault();
    try {
      await api.createCustomer(customerForm);
      setCustomerForm(emptyCustomer);
      showNotice("Customer added");
      loadData();
    } catch (error) {
      showNotice(error.message, "error");
    }
  }

  async function removeCustomer(id) {
    try {
      await api.deleteCustomer(id);
      showNotice("Customer deleted");
      loadData();
    } catch (error) {
      showNotice(error.message, "error");
    }
  }

  async function submitOrder(event) {
    event.preventDefault();
    try {
      const order = await api.createOrder({
        customer_id: Number(orderForm.customer_id),
        items: [{ product_id: Number(orderForm.product_id), quantity: Number(orderForm.quantity) }],
      });
      setOrderForm({ customer_id: "", product_id: "", quantity: 1 });
      setSelectedOrder(order);
      showNotice("Order created and inventory reduced");
      loadData();
    } catch (error) {
      showNotice(error.message, "error");
    }
  }

  async function removeOrder(id) {
    try {
      await api.deleteOrder(id);
      setSelectedOrder(null);
      showNotice("Order deleted");
      loadData();
    } catch (error) {
      showNotice(error.message, "error");
    }
  }

  const lowStock = useMemo(
    () => products.filter((product) => Number(product.quantity_in_stock) <= 5),
    [products],
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Production-ready assessment</p>
          <h1>Inventory & Order Management</h1>
        </div>
        <button className="icon-button" type="button" onClick={loadData} title="Refresh data">
          <RefreshCw size={18} />
        </button>
      </header>

      {notice && (
        <div className={`notice ${notice.type}`}>
          {notice.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          {notice.message}
        </div>
      )}

      <section className="summary-grid">
        <Summary icon={<Boxes />} label="Products" value={dashboard?.total_products ?? 0} />
        <Summary icon={<Users />} label="Customers" value={dashboard?.total_customers ?? 0} />
        <Summary icon={<ClipboardList />} label="Orders" value={dashboard?.total_orders ?? 0} />
        <Summary icon={<BarChart3 />} label="Low stock" value={dashboard?.low_stock_products ?? 0} />
      </section>

      <nav className="tabs" aria-label="Management sections">
        {["products", "customers", "orders"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {loading ? <p className="loading">Loading workspace...</p> : null}

      {activeTab === "products" && (
        <section className="workspace">
          <form className="panel" onSubmit={submitProduct}>
            <h2>{editingProductId ? "Update product" : "Add product"}</h2>
            <Field label="Product name" value={productForm.name} onChange={(name) => setProductForm({ ...productForm, name })} />
            <Field label="SKU/code" value={productForm.sku} onChange={(sku) => setProductForm({ ...productForm, sku })} />
            <Field type="number" min="0.01" step="0.01" label="Price" value={productForm.price} onChange={(price) => setProductForm({ ...productForm, price })} />
            <Field type="number" min="0" label="Quantity in stock" value={productForm.quantity_in_stock} onChange={(quantity_in_stock) => setProductForm({ ...productForm, quantity_in_stock })} />
            <div className="button-row">
              <button type="submit"><PackagePlus size={17} />{editingProductId ? "Save" : "Add"}</button>
              {editingProductId && <button type="button" className="secondary" onClick={() => { setProductForm(emptyProduct); setEditingProductId(null); }}>Cancel</button>}
            </div>
          </form>
          <DataTable
            title="Products"
            empty="No products yet"
            columns={["Name", "SKU", "Price", "Stock", "Actions"]}
            rows={products.map((product) => [
              product.name,
              product.sku,
              money(product.price),
              product.quantity_in_stock,
              <ActionButtons key={product.id} onEdit={() => editProduct(product)} onDelete={() => removeProduct(product.id)} />,
            ])}
          />
        </section>
      )}

      {activeTab === "customers" && (
        <section className="workspace">
          <form className="panel" onSubmit={submitCustomer}>
            <h2>Add customer</h2>
            <Field label="Full name" value={customerForm.full_name} onChange={(full_name) => setCustomerForm({ ...customerForm, full_name })} />
            <Field type="email" label="Email" value={customerForm.email} onChange={(email) => setCustomerForm({ ...customerForm, email })} />
            <Field label="Phone number" value={customerForm.phone_number} onChange={(phone_number) => setCustomerForm({ ...customerForm, phone_number })} />
            <button type="submit"><Plus size={17} />Add</button>
          </form>
          <DataTable
            title="Customers"
            empty="No customers yet"
            columns={["Name", "Email", "Phone", "Actions"]}
            rows={customers.map((customer) => [
              customer.full_name,
              customer.email,
              customer.phone_number,
              <button key={customer.id} className="icon-button danger" type="button" onClick={() => removeCustomer(customer.id)} title="Delete customer"><Trash2 size={16} /></button>,
            ])}
          />
        </section>
      )}

      {activeTab === "orders" && (
        <section className="workspace">
          <form className="panel" onSubmit={submitOrder}>
            <h2>Create order</h2>
            <label>
              Customer
              <select required value={orderForm.customer_id} onChange={(event) => setOrderForm({ ...orderForm, customer_id: event.target.value })}>
                <option value="">Select customer</option>
                {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.full_name}</option>)}
              </select>
            </label>
            <label>
              Product
              <select required value={orderForm.product_id} onChange={(event) => setOrderForm({ ...orderForm, product_id: event.target.value })}>
                <option value="">Select product</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name} ({product.quantity_in_stock} available)</option>)}
              </select>
            </label>
            <Field type="number" min="1" label="Quantity ordered" value={orderForm.quantity} onChange={(quantity) => setOrderForm({ ...orderForm, quantity })} />
            <button type="submit"><ClipboardList size={17} />Place order</button>
          </form>
          <div className="stack">
            <DataTable
              title="Orders"
              empty="No orders yet"
              columns={["ID", "Customer", "Total", "Actions"]}
              rows={orders.map((order) => [
                `#${order.id}`,
                order.customer.full_name,
                money(order.total_amount),
                <div className="actions" key={order.id}>
                  <button type="button" className="secondary" onClick={() => setSelectedOrder(order)}>View</button>
                  <button className="icon-button danger" type="button" onClick={() => removeOrder(order.id)} title="Delete order"><Trash2 size={16} /></button>
                </div>,
              ])}
            />
            {selectedOrder && (
              <section className="panel">
                <h2>Order #{selectedOrder.id}</h2>
                <p className="muted">{selectedOrder.customer.full_name} - {money(selectedOrder.total_amount)}</p>
                {selectedOrder.items.map((item) => (
                  <div className="order-line" key={item.id}>
                    <span>{item.product.name}</span>
                    <strong>{item.quantity} x {money(item.unit_price)}</strong>
                  </div>
                ))}
              </section>
            )}
          </div>
        </section>
      )}

      {lowStock.length > 0 && (
        <section className="low-stock">
          <h2>Low stock products</h2>
          <div>
            {lowStock.map((product) => <span key={product.id}>{product.name}: {product.quantity_in_stock}</span>)}
          </div>
        </section>
      )}
    </main>
  );
}

function Summary({ icon, label, value }) {
  return (
    <article className="summary-card">
      {React.cloneElement(icon, { size: 22 })}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function Field({ label, value, onChange, type = "text", ...props }) {
  return (
    <label>
      {label}
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} {...props} />
    </label>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="actions">
      <button className="icon-button" type="button" onClick={onEdit} title="Edit product"><Pencil size={16} /></button>
      <button className="icon-button danger" type="button" onClick={onDelete} title="Delete product"><Trash2 size={16} /></button>
    </div>
  );
}

function DataTable({ title, columns, rows, empty }) {
  return (
    <section className="panel table-panel">
      <h2>{title}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row, index) => (
              <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
            )) : (
              <tr><td colSpan={columns.length} className="empty">{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
