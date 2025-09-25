import { useState, useEffect } from 'react'
import './App.css'

// Componente de Login MEJORADO
function LoginForm({ onLogin, onRegister, loading }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  // Limpiar formulario al cambiar entre login/registro
  useEffect(() => {
    setFormData({
      email: '',
      password: '',
      name: ''
    });
    setError('');
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      return;
    }

    if (!isLogin && !formData.name) {
      setError('Nombre es requerido para registrarse');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    // Validación de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      if (isLogin) {
        await onLogin(formData.email, formData.password);
      } else {
        await onRegister(formData.email, formData.password, formData.name);
      }
    } catch (err) {
      setError(err.message || 'Error al procesar la solicitud');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-book"></i>
            </div>
            <div className="logo-text">
              <div className="logo-main">BookHaven</div>
              <div className="logo-sub">Tu Refugio Literario</div>
            </div>
          </div>
          <h2>{isLogin ? 'Bienvenido de vuelta' : 'Crear tu cuenta'}</h2>
          <div className="login-subtitle">
            {isLogin ? 'Inicia sesión en tu cuenta' : 'Únete a nuestra comunidad literaria'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">
                <i className="fas fa-user"></i> Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Tu nombre completo"
                disabled={loading}
                autoComplete="off"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="tu.email@ejemplo.com"
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder={isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                {isLogin ? ' Iniciando sesión...' : ' Creando cuenta...'}
              </>
            ) : (
              <>
                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
                {isLogin ? ' Iniciar Sesión' : ' Crear Cuenta'}
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? '¿Primera vez en BookHaven?' : '¿Ya tienes una cuenta?'}
            <button
              type="button"
              className="link-btn"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? ' Regístrate aquí' : ' Inicia sesión aquí'}
            </button>
          </p>
        </div>

        <div className="demo-credentials">
          <h4>
            <i className="fas fa-rocket"></i> Credenciales de Demo
          </h4>
          <p>🎯 <strong>Email:</strong> admin@bookhaven.com</p>
          <p>🔑 <strong>Contraseña:</strong> admin123</p>
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#744210' }}>
            <i className="fas fa-info-circle"></i> Usa estas credenciales para probar la aplicación
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente de Perfil
function ProfileMenu({ user, onLogout, isOpen, onToggle }) {
  if (!isOpen) return null;

  return (
    <div className="profile-menu">
      <div className="profile-header">
        <i className="fas fa-user-circle"></i>
        <div>
          <strong>{user.name}</strong>
          <div className="user-email">{user.email}</div>
        </div>
      </div>
      <div className="profile-actions">
        <button className="profile-btn" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

// Componente de Producto
function ProductCard({ product, onView, onAddToCart }) {
  return (
    <div className="card">
      <div className="catalog-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="card-content">
        <span className="badge category-badge">
          {product.external ? '🌍 ' : ''}{product.category}
        </span>
        <div style={{ fontWeight: 700, margin: '10px 0', fontSize: '18px' }}>{product.name}</div>
        <div className="small" style={{ fontStyle: 'italic', marginBottom: '5px' }}>por {product.author}</div>
        <div className="small">{product.description}</div>
        <div className="price">${product.price.toLocaleString('es-AR')}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 15 }}>
          <button className="btn btn-primary" onClick={() => onAddToCart(product)}>
            <i className="fas fa-cart-plus"></i> Agregar
          </button>
          <button className="btn btn-ghost" onClick={() => onView(product)}>
            <i className="fas fa-eye"></i> Ver
          </button>
        </div>
        {product.external && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <i className="fas fa-external-link-alt"></i> Libro desde Google Books API
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de Item del Carrito
function CartItem({ item, onChangeQty, onRemove }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-content">
        <div style={{ fontWeight: 700 }}>{item.name}</div>
        <div className="small" style={{ fontStyle: 'italic' }}>por {item.author}</div>
        <div className="small">Cantidad: {item.qty} — ${(item.price * item.qty).toLocaleString('es-AR')}</div>
        <div className="cart-item-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => onChangeQty(item.id, -1)}>
            <i className="fas fa-minus"></i>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => onChangeQty(item.id, 1)}>
            <i className="fas fa-plus"></i>
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => onRemove(item.id)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente Principal
function App() {
  // Estados de Autenticación
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('bookhaven_token'));
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Estados de la Aplicación
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('bookhaven_cart')) || [];
    } catch(e) {
      return [];
    }
  });
  const [view, setView] = useState('catalog');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [payStatus, setPayStatus] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Estados para Google Books API
  const [externalBooks, setExternalBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showExternal, setShowExternal] = useState(false);

  // Nuevo estado para el formulario de pago
  const [checkoutData, setCheckoutData] = useState({
    customer_name: '',
    customer_lastname: '',
    customer_address: '',
    customer_city: '',
    customer_zip: '',
    card_number: '',
    card_holder: '',
    card_expiry: '',
    card_cvv: '',
    customer_email: ''
  });

  // Verificar token al cargar
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            loadProducts();
          } else {
            sessionStorage.removeItem('bookhaven_token');
            setToken(null);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          sessionStorage.removeItem('bookhaven_token');
          setToken(null);
        }
      }
    };

    verifyToken();
  }, [token]);

  // Cargar productos (solo si está autenticado)
  const loadProducts = async () => {
    if (!token) return;

    try {
      setLoadingProducts(true);
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar libros');
      }

      const productsData = await response.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Guardar carrito en sessionStorage
  useEffect(() => {
    sessionStorage.setItem('bookhaven_cart', JSON.stringify(cart));
  }, [cart]);

  // Funciones de Autenticación
  const handleLogin = async (email, password) => {
    setLoadingAuth(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      sessionStorage.setItem('bookhaven_token', data.token);
      setToken(data.token);
      setUser(data.user);
      loadProducts();
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleRegister = async (email, password, name) => {
    setLoadingAuth(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      sessionStorage.setItem('bookhaven_token', data.token);
      setToken(data.token);
      setUser(data.user);
      loadProducts();
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bookhaven_token');
    sessionStorage.removeItem('bookhaven_cart');
    setToken(null);
    setUser(null);
    setCart([]);
    setProfileMenuOpen(false);
  };

  // Funciones de la aplicación
  const categories = ['All', ...new Set(products.map(p => p.category))];

  function filteredProducts() {
    return category === 'All' ? products : products.filter(p => p.category === category);
  }

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const found = prev.find(x => x.id === product.id);
      if (found) {
        return prev.map(x =>
          x.id === product.id ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [...prev, { ...product, qty }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(x => x.id !== id));
  }

  function changeQty(id, delta) {
    setCart(prev => prev.map(x =>
      x.id === id ? { ...x, qty: Math.max(1, x.qty + delta) } : x
    ));
  }

  function total() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  function goDetail(product) {
    setCurrentProduct(product);
    setView('detail');
  }

  const searchExternalBooks = async (query) => {
    if (!query.trim()) {
      setExternalBooks([]);
      setShowExternal(false);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`/api/external-books?search=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }

      const books = await response.json();
      setExternalBooks(books);
      setShowExternal(true);
    } catch (error) {
      console.error('Error buscando libros externos:', error);
      setExternalBooks([]);
      setShowExternal(false);
    } finally {
      setSearching(false);
    }
  };

  async function pay() {
    const {
      customer_name,
      customer_lastname,
      customer_address,
      customer_city,
      customer_zip,
      card_number,
      card_holder,
      card_expiry,
      card_cvv
    } = checkoutData;

    // Validación para que no se rompa si los campos están vacíos
    if (!customer_name || !customer_lastname || !customer_address || !customer_city || !customer_zip || !card_number || !card_holder || !card_expiry || !card_cvv) {
      setPayStatus({ status: 'fail', reason: 'Completá todos los campos de pago.' });
      return;
    }

    setLoadingPay(true);
    setPayStatus(null);

    const currentTotal = total();

    try {
      // Fetch al NUEVO endpoint de pago
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: currentTotal })
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.reason || 'Error en el pago');
      }

      setPayStatus(paymentResult);

      if (paymentResult.status === 'success') {
        const order = {
          id: paymentResult.tx,
          items: cart,
          total: currentTotal,
          ...checkoutData
        };

        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(order)
        });

        if (!orderResponse.ok) {
          throw new Error('Error al crear la orden');
        }

        setLastOrderTotal(currentTotal);
        setCart([]);
        setView('payresult');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPayStatus({ status: 'fail', reason: error.message });
    } finally {
      setLoadingPay(false);
    }
  }

  // Si no está autenticado, mostrar login
  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={loadingAuth}
      />
    );
  }

  // Aplicación principal (usuario autenticado)
  return (
    <div className="wrap">
      <header>
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="logo-text">
            <div className="logo-main">BookHaven</div>
            <div className="logo-sub">Tu Refugio Literario</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="muted">
            <span className="cart-badge" data-count={cart.reduce((sum, item) => sum + item.qty, 0)}>
              <i className="fas fa-shopping-cart"></i> Carrito
            </span>
          </div>

          {/* Perfil del usuario */}
          <div className="profile-container">
            <button
              className="profile-btn"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <i className="fas fa-user-circle"></i>
              <span>{user.name}</span>
              <i className={`fas fa-chevron-${profileMenuOpen ? 'up' : 'down'}`}></i>
            </button>

            <ProfileMenu
              user={user}
              onLogout={handleLogout}
              isOpen={profileMenuOpen}
              onToggle={setProfileMenuOpen}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={() => {
              setView('catalog');
              setCurrentProduct(null);
              setShowExternal(false);
              setSearchQuery('');
            }}>
              <i className="fas fa-th-large"></i> Catálogo
            </button>
            <button className="btn btn-ghost" onClick={() => setView('checkout')}>
              <i className="fas fa-credit-card"></i> Checkout
            </button>
          </div>
        </div>
      </header>

      {view === 'catalog' && (
        <div className="hero">
          <h2>¡Bienvenido de vuelta, {user.name}!</h2>
          <p>Descubre mundos infinitos entre páginas. Envío gratis en compras superiores a $10.000</p>
        </div>
      )}

      <div className="layout">
        <div className="main">
          {view === 'catalog' && (
            <>
              <div className="filters">
                <div className="muted">
                  <i className="fas fa-filter"></i> Filtrar por género:
                </div>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={cat === category ? 'btn btn-primary' : 'btn btn-ghost'}
                    onClick={() => {
                      setCategory(cat)
                      setShowExternal(false)
                      setSearchQuery('')
                    }}
                  >
                    {cat === 'All' ? 'Todos los Géneros' : cat}
                  </button>
                ))}
              </div>

              {/* Sección de Búsqueda en Google Books API */}
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: 'var(--border-radius)',
                marginBottom: '20px',
                border: '2px solid var(--primary)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '15px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-search"></i> Búsqueda en Google Books API
                </h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Ej: Harry Potter, Ciencia Ficción, Romance, Stephen King..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '2px solid var(--light-gray)',
                      borderRadius: '8px',
                      fontFamily: 'inherit',
                      fontSize: '16px',
                      transition: 'var(--transition)'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && searchExternalBooks(searchQuery)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => searchExternalBooks(searchQuery)}
                    disabled={searching}
                    style={{ padding: '12px 20px', minWidth: '120px' }}
                  >
                    {searching ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Buscando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search"></i> Buscar
                      </>
                    )}
                  </button>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-info-circle"></i>
                  Busca entre millones de libros reales usando Google Books API
                </div>
              </div>

              <h2 className="section-title">
                <i className="fas fa-book-open"></i>
                {showExternal && externalBooks.length > 0 ? 'Resultados de Búsqueda' : 'Nuestro Catálogo Literario'}
              </h2>

              {loadingProducts ? (
                <div className="empty-state">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>Cargando biblioteca...</p>
                </div>
              ) : (
                <div className="catalog">
                  {showExternal && externalBooks.length > 0 ? (
                    <>
                      <div style={{
                        width: '100%',
                        textAlign: 'center',
                        marginBottom: '20px',
                        padding: '15px',
                        background: 'var(--light)',
                        borderRadius: '8px',
                        border: '1px solid var(--light-gray)'
                      }}>
                        <button
                          className="btn btn-ghost"
                          onClick={() => {
                            setShowExternal(false)
                            setSearchQuery('')
                            setExternalBooks([])
                          }}
                          style={{ marginRight: '15px' }}
                        >
                          <i className="fas fa-arrow-left"></i> Volver al catálogo local
                        </button>
                        <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                          📚 Mostrando {externalBooks.length} resultados de Google Books API
                        </span>
                      </div>

                      {externalBooks.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onView={goDetail}
                          onAddToCart={addToCart}
                        />
                      ))}
                    </>
                  ) : (
                    filteredProducts().map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onView={goDetail}
                        onAddToCart={addToCart}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {view === 'detail' && currentProduct && (
            <div>
              <h2 className="section-title">
                <i className="fas fa-info-circle"></i>
                Detalle del Libro
              </h2>
              <div className="card" style={{ maxWidth: 500 }}>
                <div className="image-container">
                  <img src={currentProduct.image} alt={currentProduct.name} className="product-image" />
                </div>
                <div className="card-content">
                  <span className="badge category-badge">
                    {currentProduct.external ? '🌍 ' : ''}{currentProduct.category}
                  </span>
                  <div style={{ fontWeight: 700, fontSize: '22px', margin: '10px 0' }}>{currentProduct.name}</div>
                  <div className="small" style={{ fontStyle: 'italic', marginBottom: '10px' }}>
                    por {currentProduct.author} • {currentProduct.pages} páginas
                  </div>
                  <div className="small" style={{ marginBottom: '15px' }}>{currentProduct.description}</div>
                  <div className="price" style={{ fontSize: '24px' }}>${currentProduct.price.toLocaleString('es-AR')}</div>
                  {currentProduct.external && (
                    <div style={{ marginTop: '10px', padding: '8px', background: '#f0f8ff', borderRadius: '5px', fontSize: '14px' }}>
                      <i className="fas fa-external-link-alt"></i> Este libro fue obtenido de Google Books API
                    </div>
                  )}
                  <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
                    <button className="btn btn-primary" onClick={() => { addToCart(currentProduct); setView('catalog') }}>
                      <i className="fas fa-cart-plus"></i> Agregar y volver
                    </button>
                    <button className="btn btn-ghost" onClick={() => setView('catalog')}>
                      <i className="fas fa-arrow-left"></i> Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'checkout' && (
            <div>
              <h2 className="section-title">
                <i className="fas fa-credit-card"></i>
                Finalizar Compra
              </h2>
              {cart.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-shopping-cart"></i>
                  <h3>Tu carrito está vacío</h3>
                  <p>Agregá libros antes de proceder al pago</p>
                  <button className="btn btn-primary" onClick={() => setView('catalog')} style={{ marginTop: '15px' }}>
                    <i className="fas fa-arrow-left"></i> Volver al catálogo
                  </button>
                </div>
              ) : (
                <div className="card">
                  <h3 style={{ padding: '15px', borderBottom: '1px solid var(--light-gray)' }}>
                    <i className="fas fa-list"></i> Resumen de Compra
                  </h3>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{item.name}</div>
                        <div className="small" style={{ fontStyle: 'italic' }}>por {item.author}</div>
                        <div className="small">Cantidad: {item.qty} — ${(item.price * item.qty).toLocaleString('es-AR')}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, padding: '15px' }}>
                    <h3 style={{ marginBottom: '15px' }}>
                      <i className="fas fa-user"></i> Información de Envío y Pago
                    </h3>
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <label>Nombre</label>
                        <input
                          type="text"
                          value={checkoutData.customer_name}
                          onChange={e => setCheckoutData({ ...checkoutData, customer_name: e.target.value })}
                          placeholder="Tu nombre"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label>Apellido</label>
                        <input
                          type="text"
                          value={checkoutData.customer_lastname}
                          onChange={e => setCheckoutData({ ...checkoutData, customer_lastname: e.target.value })}
                          placeholder="Tu apellido"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <label>Dirección</label>
                    <input
                      type="text"
                      value={checkoutData.customer_address}
                      onChange={e => setCheckoutData({ ...checkoutData, customer_address: e.target.value })}
                      placeholder="Calle y número"
                      autoComplete="off"
                    />
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                      <div>
                        <label>Ciudad</label>
                        <input
                          type="text"
                          value={checkoutData.customer_city}
                          onChange={e => setCheckoutData({ ...checkoutData, customer_city: e.target.value })}
                          placeholder="Tu ciudad"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label>Código Postal</label>
                        <input
                          type="text"
                          value={checkoutData.customer_zip}
                          onChange={e => setCheckoutData({ ...checkoutData, customer_zip: e.target.value })}
                          placeholder="Tu código postal"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <h3 style={{ margin: '25px 0 15px 0', borderTop: '1px solid var(--light-gray)', paddingTop: '15px' }}>
                      <i className="fas fa-credit-card"></i> Detalles de la Tarjeta
                    </h3>
                    <label>Número de Tarjeta (Falso)</label>
                    <input
                      type="text"
                      value={checkoutData.card_number}
                      onChange={e => setCheckoutData({ ...checkoutData, card_number: e.target.value })}
                      placeholder="xxxx-xxxx-xxxx-xxxx"
                      autoComplete="off"
                    />
                    <label>Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      value={checkoutData.card_holder}
                      onChange={e => setCheckoutData({ ...checkoutData, card_holder: e.target.value })}
                      placeholder="Como aparece en la tarjeta"
                      autoComplete="off"
                    />
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                      <div>
                        <label>Vencimiento (MM/AA)</label>
                        <input
                          type="text"
                          value={checkoutData.card_expiry}
                          onChange={e => setCheckoutData({ ...checkoutData, card_expiry: e.target.value })}
                          placeholder="MM/AA"
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label>CVV</label>
                        <input
                          type="text"
                          value={checkoutData.card_cvv}
                          onChange={e => setCheckoutData({ ...checkoutData, card_cvv: e.target.value })}
                          placeholder="CVC"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                      <button className="btn btn-success" onClick={pay} disabled={loadingPay} style={{ padding: '12px 20px' }}>
                        {loadingPay ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Procesando...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check"></i> Confirmar Pago
                          </>
                        )}
                      </button>
                      <button className="btn btn-ghost" onClick={() => setView('catalog')} style={{ marginLeft: 8 }}>
                        <i className="fas fa-arrow-left"></i> Seguir Comprando
                      </button>
                    </div>
                    {payStatus && payStatus.status === 'success' && (
                      <div className="success">
                        <i className="fas fa-check-circle"></i> Pago exitoso — Tx: {payStatus.tx}
                      </div>
                    )}
                    {payStatus && payStatus.status === 'fail' && (
                      <div className="error">
                        <i className="fas fa-exclamation-circle"></i> Pago fallido — {payStatus.reason}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'payresult' && (
            <div>
              <h2 className="section-title">
                <i className="fas fa-check-circle"></i>
                ¡Compra Realizada con Éxito!
              </h2>
              <div className="card">
                <div className="empty-state" style={{ padding: '30px' }}>
                  <i className="fas fa-check-circle" style={{ color: '#2E8B57', fontSize: '64px' }}></i>
                  <h3 style={{ margin: '15px 0' }}>¡Gracias por tu compra literaria!</h3>
                  <p>Tu pedido de libros fue procesado correctamente. Recibirás un email con los detalles de envío.</p>
                  <div style={{ marginTop: 20, fontSize: '20px', fontWeight: '700' }}>
                    Total: ${lastOrderTotal.toLocaleString('es-AR')}
                  </div>
                  <div style={{ marginTop: 30 }}>
                    <button className="btn btn-primary" onClick={() => setView('catalog')}>
                      <i className="fas fa-arrow-left"></i> Volver al Catálogo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar">
          <h3 className="section-title">
            <i className="fas fa-shopping-cart"></i>
            Resumen del Carrito
          </h3>
          {cart.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-shopping-cart"></i>
              <p>Carrito vacío</p>
              <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--gray)' }}>
                Agregá libros desde el catálogo
              </div>
            </div>
          ) : (
            <div>
              <div style={{
                padding: '10px',
                background: 'var(--light)',
                borderRadius: '8px',
                marginBottom: '15px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                <i className="fas fa-info-circle"></i> {cart.length} producto{cart.length !== 1 ? 's' : ''} en el carrito
              </div>

              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onChangeQty={changeQty}
                  onRemove={removeFromCart}
                />
              ))}

              <div className="total-display">
                <span>Total:</span>
                <span>${total().toLocaleString('es-AR')}</span>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => setView('checkout')}
                style={{
                  width: '100%',
                  marginTop: '15px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-credit-card"></i> Finalizar Compra
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;