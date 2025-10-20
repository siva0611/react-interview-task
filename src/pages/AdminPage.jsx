import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './AdminPage.css';

function AdminPage() {
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    fetch('http://localhost:3001/orders')
      .then(res => res.json())
      .then(data => {
        
        const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      })
      .catch(error => console.error("Failed to fetch orders", error));
  }, []);

  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated!');
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div>
      <h2>Admin Panel - Manage Orders</h2>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card-admin">
              <h4>Order ID: {order.id}</h4>
              <p>User ID: {order.userId}</p>
              <p>Date: {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Subtotal: ₹{order.subtotal.toLocaleString('en-IN')}</p>
              <div className="status-control">
                <label>Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="On Process">On Process</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPage;