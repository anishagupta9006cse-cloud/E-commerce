import React, { useState } from 'react';

// Sample Products Data with Ratings & Reviews
const initialProducts = [
  {
    id: 1,
    name: "Gaming Laptop",
    category: "Electronics",
    price: 45000,
    description: "High performance gaming laptop with 16GB RAM & RTX Graphics.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    rating: 4.8,
    reviews: [
      { user: "Rahul", comment: "Amazing speed and screen display!", rating: 5 },
      { user: "Priya", comment: "Good value for money.", rating: 4 }
    ]
  },
  {
  id: 2, // Har product ka ID alag (unique) hona chahiye
  name: "Wireless Earbuds",
  category: "Audio",
  price: 2499,
  rating: 4.6,
  description: "Crystal clear sound with noise cancellation.",
  image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400"
},
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Audio",
    price: 1999,
    description: "High quality sound with active noise cancellation and 30hr battery.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.5,
    reviews: [
      { user: "Aman", comment: "Deep bass, excellent build quality.", rating: 5 }
    ]
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Wearables",
    price: 2499,
    description: "Track your fitness, heart rate, sleep cycles, and phone calls.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    rating: 4.2,
    reviews: [
      { user: "Neha", comment: "Very stylish and comfortable to wear.", rating: 4 }
    ]
  },
  {
    id: 5,
    name: "Smartphone X",
    category: "Mobiles",
    price: 15999,
    rating: 4.5,
    description: "Fast processor and great camera.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
  },
  {
    id: 6,
    name: "Smart Watch Pro",
    category: "Wearables",
    price: 3999,
    rating: 4.2,
    description: "Fitness tracking and AMOLED display.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
  },
  {
    id: 7,
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 2499,
    rating: 4.6,
    description: "RGB backlit mechanical keyboard with tactile switches.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300"
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    category: "Audio",
    price: 3499,
    description: "Waterproof portable speaker with 360-degree surround sound.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    rating: 4.6,
    reviews: [
      { user: "Vikas", comment: "Loud sound, great for outdoor parties!", rating: 5 }
    ]
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [trackOrderId, setTrackOrderId] = useState('');
  
  // Auth State
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Wishlist Toggle
  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Cart Functions
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

  // Handle Checkout / Place Order
  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
      status: "Processing"
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveTab('orders');
  };

  // Handle Auth
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      const name = authMode === 'register' ? authName : authEmail.split('@')[0];
      setUser({ name, email: authEmail });
      setActiveTab('home');
    }
  };

  // Add Review Function
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewComment || !selectedProduct) return;

    const updatedReviews = [
      ...selectedProduct.reviews,
      { user: user ? user.name : "Guest User", comment: newReviewComment, rating: Number(newReviewRating) }
    ];

    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? { ...p, reviews: updatedReviews } : p
    );

    setProducts(updatedProducts);
    setSelectedProduct({ ...selectedProduct, reviews: updatedReviews });
    setNewReviewComment('');
  };

  // Filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div style={{ fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 🔴 HEADER / NAVBAR */}
      <header style={{ background: '#0f172a', padding: '12px 20px', color: '#fff', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ margin: 0, color: '#38bdf8', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>🛍️ TechStore</h2>
          
          <nav style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span onClick={() => setActiveTab('home')} style={{ cursor: 'pointer', color: activeTab === 'home' ? '#38bdf8' : '#fff', fontWeight: 'bold' }}>Home</span>
            <span onClick={() => setActiveTab('products')} style={{ cursor: 'pointer', color: activeTab === 'products' ? '#38bdf8' : '#fff', fontWeight: 'bold' }}>Products</span>
            <span onClick={() => setActiveTab('wishlist')} style={{ cursor: 'pointer', color: activeTab === 'wishlist' ? '#38bdf8' : '#fff', fontWeight: 'bold' }}>❤️ Wishlist ({wishlist.length})</span>
            <span onClick={() => setActiveTab('orders')} style={{ cursor: 'pointer', color: activeTab === 'orders' ? '#38bdf8' : '#fff', fontWeight: 'bold' }}>📦 Orders ({orders.length})</span>
            
            <button 
              onClick={() => setActiveTab('cart')}
              style={{ background: '#0284c7', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🛒 Cart ({totalCartCount})
            </button>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '14px' }}>👤 {user.name}</span>
                <button onClick={() => setUser(null)} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
              </div>
            ) : (
              <button onClick={() => setActiveTab('login')} style={{ background: '#f59e0b', border: 'none', color: '#000', padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                🔑 Login
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* 🔵 MAIN CONTENT AREA */}
      <div style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '20px', boxSizing: 'border-box' }}>
        
        {/* 1️⃣ HOME TAB */}
        {activeTab === 'home' && (
          <div>
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #0284c7)', color: 'white', padding: '50px 20px', borderRadius: '12px', textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0' }}>Discover Next-Gen Electronics</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Top Brands, Best Prices, Fast Delivery Guaranteed.</p>
              <button onClick={() => setActiveTab('products')} style={{ marginTop: '15px', background: '#f59e0b', color: '#000', border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>Browse Catalog</button>
            </div>

            <h2>Featured Categories</h2>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
              {['All', 'Electronics', 'Audio', 'Wearables'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => { setSelectedCategory(cat); setActiveTab('products'); }}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #0284c7', background: '#fff', cursor: 'pointer', fontWeight: 'bold', color: '#0284c7' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2>Top Rated Products</h2>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {products.slice(0, 3).map(p => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlist={wishlist.some(w => w.id === p.id)} onViewDetails={() => setSelectedProduct(p)} />
              ))}
            </div>
          </div>
        )}

        {/* 2️⃣ PRODUCTS CATALOG (SEARCH + FILTER) */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
              <h2>Catalog ({filteredProducts.length})</h2>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '600px' }}>
                <input 
                  type="text" 
                  placeholder="🔍 Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
                
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlist={wishlist.some(w => w.id === p.id)} onViewDetails={() => setSelectedProduct(p)} />
              ))}
            </div>
          </div>
        )}

        {/* 3️⃣ WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div>
            <h2>My Wishlist ❤️</h2>
            {wishlist.length === 0 ? (
              <p>No products added to wishlist yet!</p>
            ) : (
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {wishlist.map(p => (
                  <ProductCard key={p.id} product={p} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlist={true} onViewDetails={() => setSelectedProduct(p)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4️⃣ CART & CHECKOUT TAB */}
        {activeTab === 'cart' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Shopping Cart 🛒</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div>
                        <h4 style={{ margin: 0 }}>{item.name}</h4>
                        <p style={{ margin: '3px 0 0 0', color: '#16a34a', fontWeight: 'bold' }}>₹{item.price}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ padding: '4px 10px' }}>-</button>
                      <span><strong>{item.qty}</strong></span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ padding: '4px 10px' }}>+</button>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}>Remove</button>
                    </div>
                  </div>
                ))}
                
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginTop: '20px', textAlign: 'right' }}>
                  <h3>Total Price: ₹{cart.reduce((sum, item) => sum + item.price * item.qty, 0).toLocaleString('en-IN')}</h3>
                  <button onClick={handleCheckout} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Place Order 💳</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5️⃣ ORDERS & TRACKING TAB */}
        {activeTab === 'orders' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Order Tracking & History 📦</h2>
            
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3>Track Order Status</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Enter Order ID (e.g. ORD-123456)" 
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              {trackOrderId && (
                <div style={{ marginTop: '15px', padding: '10px', background: '#e0f2fe', borderRadius: '6px', color: '#0369a1' }}>
                  Status for <strong>{trackOrderId}</strong>: 🟢 Out for Delivery (Expected Delivery: Today)
                </div>
              )}
            </div>

            <h3>Recent Orders</h3>
            {orders.length === 0 ? (
              <p>No orders placed yet.</p>
            ) : (
              orders.map(o => (
                <div key={o.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '15px', borderLeft: '5px solid #16a34a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Order ID: {o.id}</h4>
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{o.status}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>Date: {o.date} | Total Items: {o.items.length}</p>
                  <p style={{ fontWeight: 'bold', color: '#16a34a' }}>Total Amount: ₹{o.total.toLocaleString('en-IN')}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* 6️⃣ AUTH TAB (LOGIN / REGISTER) */}
        {activeTab === 'login' && (
          <div style={{ maxWidth: '400px', margin: '40px auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center' }}>{authMode === 'login' ? '🔑 Sign In' : '📝 Register'}</h2>
            <form onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>Full Name</label>
                  <input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>Email Address</label>
                <input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>Password</label>
                <input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ width: '100%', background: '#0284c7', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {authMode === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
              {authMode === 'login' ? "Don't have an account?" : "Already registered?"}{' '}
              <span onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} style={{ color: '#0284c7', cursor: 'pointer', fontWeight: 'bold' }}>
                {authMode === 'login' ? 'Register' : 'Login'}
              </span>
            </p>
          </div>
        )}

      </div>
{/* 🟡 PRODUCT DETAIL & REVIEW MODAL */}
{selectedProduct && (
  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
    <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '600px', padding: '20px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
      <button 
        onClick={() => setSelectedProduct(null)} 
        style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}
      >
        ✕
      </button>

      <h2>{selectedProduct.name}</h2>
      <p style={{ color: '#666' }}>{selectedProduct.description}</p>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{selectedProduct.price}</p>
    </div>
      </div>
   )}
  </div>
);
}

export default App;
// Product Card Component
function ProductCard({ product, addToCart, toggleWishlist, isWishlist, onViewDetails }) {
  return (
    <div style={{ background: '#fff', borderRadius: '10px', padding: '15px', width: '240px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
      <button 
        onClick={() => toggleWishlist(product)}
        style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
      >
        {isWishlist ? '❤️' : '🤍'}
      </button>

      <div>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }} onClick={onViewDetails} />
        <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', marginTop: '8px', display: 'inline-block' }}>{product.category}</span>
        <h3 style={{ fontSize: '16px', margin: '8px 0 4px 0', cursor: 'pointer' }} onClick={onViewDetails}>{product.name}</h3>
        <p style={{ fontSize: '12px', color: '#f59e0b', margin: '0 0 8px 0' }}>⭐ {product.rating} / 5</p>
      </div>

      <div>
        <h4 style={{ color: '#16a34a', fontSize: '18px', margin: '5px 0 10px 0' }}>₹{product.price.toLocaleString('en-IN')}</h4>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => addToCart(product)} style={{ flex: 1, background: '#0284c7', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
            Add to Cart 🛒
          </button>
          <button onClick={onViewDetails} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
            Details
          </button>
        </div>
      </div>
    </div>
  );
}