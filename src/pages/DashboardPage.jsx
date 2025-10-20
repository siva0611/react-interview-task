import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';
import './DashboardPage.css';

function DashboardPage() {
  const { currentUser } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', zip: '' });
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3001/addresses?userId=${currentUser.uid}`).then(res => res.json()).then(data => setAddresses(data));
      
      fetch(`http://localhost:3001/orders?userId=${currentUser.uid}`)
        .then(res => res.json())
        .then(data => {
          const sortedOrders = data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
          setOrders(sortedOrders);
        });
    }
  }, [currentUser]);

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.zip) return toast.error('Please fill out all address fields.');
    const addressToSave = { ...newAddress, userId: currentUser.uid };
    try {
      const response = await fetch('http://localhost:3001/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(addressToSave) });
      const savedAddress = await response.json();
      setAddresses(prev => [...prev, savedAddress]);
      setNewAddress({ street: '', city: '', zip: '' });
      toast.success('Address saved successfully!');
    } catch (error) { toast.error('Failed to save address.'); }
  };

  const handleRemoveAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await fetch(`http://localhost:3001/addresses/${addressId}`, { method: 'DELETE' });
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast.success('Address removed!');
      } catch (error) { toast.error('Failed to remove address.'); }
    }
  };

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.salePrice * item.quantity, 0);
  }, [cartItems]);

  const handleConfirmOrder = async () => {
    if (!selectedAddressId) return toast.error('Please select a shipping address.');
    try {
      const stockUpdatePromises = cartItems.map(async (item) => {
        const productRes = await fetch(`http://localhost:3001/products/${item.id}`);
        if (!productRes.ok) throw new Error(`Product with id ${item.id} not found.`);
        const productData = await productRes.json();
        const newStock = productData.stock - item.quantity;
        return fetch(`http://localhost:3001/products/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stock: newStock }) });
      });
      await Promise.all(stockUpdatePromises);
      const orderData = { userId: currentUser.uid, items: cartItems, shippingAddressId: selectedAddressId, subtotal: cartSubtotal, status: 'On Process', orderDate: new Date().toISOString() };
      const response = await fetch('http://localhost:3001/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
      const newOrder = await response.json();
      setOrders(prev => [newOrder, ...prev]); 
      toast.success('Order placed successfully!');
      clearCart();
      setSelectedAddressId('');
    } catch (error) { console.error("Order confirmation error:", error); toast.error('Failed to place order.'); }
  };

  return (
    <div>
      <h2>My Dashboard</h2>
      <p>Welcome, {currentUser?.displayName}!</p>
      <hr />
      <h3>My Cart</h3>
      <div className="cart-container">
        {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
          <>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p>₹{item.salePrice.toLocaleString('en-IN')}</p>
                </div>
                <div className="cart-item-controls">
                  <label>Qty:</label>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="quantity-input" />
                  <button onClick={() => removeFromCart(item.id)} className="remove-button">Remove</button>
                </div>
              </div>
            ))}
            <div className="cart-summary">
              <h4>Subtotal: ₹{cartSubtotal.toLocaleString('en-IN')}</h4>
              <div className="checkout-flow">
                <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)} className="address-select">
                  <option value="" disabled>Select a shipping address</option>
                  {addresses.map(addr => (<option key={addr.id} value={addr.id}>{addr.street}, {addr.city}</option>))}
                </select>
                <button className="checkout-button" onClick={handleConfirmOrder} disabled={!selectedAddressId || addresses.length === 0}>Confirm Order</button>
              </div>
            </div>
          </>
        )}
      </div>
      <hr />
      <h3>My Wishlist</h3>
      <div className="wishlist-container">
        {wishlistItems.length === 0 ? <p>Your wishlist is empty.</p> : (
          wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <img src={item.image} alt={item.name} className="wishlist-item-image" />
              <span>{item.name}</span>
              <button onClick={() => toggleWishlist(item)} className="remove-button">Remove</button>
            </div>
          ))
        )}
      </div>
      <hr />
      <h3>My Shipping Addresses</h3>
      <div className="address-list">
        {addresses.length === 0 ? <p>You have no saved addresses.</p> : (
          addresses.map(addr => (
            <div key={addr.id} className="address-card">
              <p>{addr.street}, {addr.city}, {addr.zip}</p>
              <button onClick={() => handleRemoveAddress(addr.id)} className="remove-address-btn">Remove</button>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleAddressSubmit} className="address-form">
        <h4>Add a New Address</h4>
        <input name="street" value={newAddress.street} onChange={handleAddressInputChange} placeholder="Street Address" />
        <input name="city" value={newAddress.city} onChange={handleAddressInputChange} placeholder="City" />
        <input name="zip" value={newAddress.zip} onChange={handleAddressInputChange} placeholder="ZIP Code" />
        <button type="submit">Save Address</button>
      </form>
      <hr />
      <h3>Order History</h3>
      <div className="order-history-list">
        {orders.length === 0 ? <p>You have no past orders.</p> : (
          orders.map(order => (
            <div key={order.id} className="order-card-user">
              <div className="order-summary">
                <h5>Order ID: {order.id}</h5>
                <p>Date: {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p>Total: ₹{order.subtotal.toLocaleString('en-IN')}</p>
                <p>Status: <span className={`status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span></p>
              </div>
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item.id} className="order-item-brief">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name} (Qty: {item.quantity})</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;