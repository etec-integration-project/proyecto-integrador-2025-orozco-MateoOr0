const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.env || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos PERSISTENTE
const dbPath = path.join(__dirname, 'bookhaven.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
  } else {
    console.log('📊 Connected to SQLite database:', dbPath);
  }
});

// Inicializar base de datos
const initializeDatabase = () => {
  db.serialize(() => {
    // Crear tabla de usuarios
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla de productos
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL,
        description TEXT,
        category TEXT,
        image TEXT,
        author TEXT,
        pages INTEGER
      )
    `);

    // Crear tabla de órdenes MEJORADA
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        customer_name TEXT,
        customer_lastname TEXT,
        customer_email TEXT,
        customer_address TEXT,
        customer_city TEXT,
        customer_zip TEXT,
        card_number TEXT,
        card_holder TEXT,
        card_expiry TEXT,
        card_cvv TEXT,
        total REAL,
        date TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Crear tabla de items de órdenes
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT,
        product_id INTEGER,
        quantity INTEGER,
        FOREIGN KEY(order_id) REFERENCES orders(id)
      )
    `);

    // Crear usuario admin por defecto
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`
      INSERT OR IGNORE INTO users (email, password, name)
      VALUES (?, ?, ?)
    `, ['admin@bookhaven.com', defaultPassword, 'Administrador']);

    // Verificar si hay productos y insertar datos de ejemplo
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (err) {
        console.error('Error checking products:', err);
        return;
      }

      if (row.count === 0) {
        console.log('📚 Inserting sample books into database...');
        const insertBook = db.prepare(`
          INSERT INTO products
          (id, name, price, description, category, image, author, pages)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const books = [
        [1, 'Cien Años de Soledad', 4500, 'Obra maestra de Gabriel García Márquez.', 'Realismo Mágico', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop&auto=format&q=80', 'Gabriel García Márquez', 471],
        [2, '1984', 3800, 'Distopía clásica de George Orwell.', 'Ciencia Ficción', 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop&auto=format&q=80', 'George Orwell', 328],
        [3, 'El Principito', 2800, 'Fábula poética de Antoine de Saint-Exupéry.', 'Literatura Infantil', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop&auto=format&q=80', 'Antoine de Saint-Exupéry', 96],
        [4, 'Orgullo y Prejuicio', 4200, 'Novela romántica de Jane Austen.', 'Romance Clásico', 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop&auto=format&q=80', 'Jane Austen', 432],
        [5, 'El Señor de los Anillos', 5800, 'Trilogía épica de J.R.R. Tolkien.', 'Fantasía', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&auto=format&q=80', 'J.R.R. Tolkien', 450],
        [6, 'Crimen y Castigo', 3900, 'Novela psicológica de Fiódor Dostoyevski.', 'Clásicos Rusos', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop&auto=format&q=80', 'Fiódor Dostoyevski', 527]
        ];

        books.forEach(book => {
          insertBook.run(...book, (err) => {
            if (err) {
              console.error('Error inserting book:', err);
            }
          });
        });

        insertBook.finalize();
        console.log('✅ Sample books inserted successfully!');
      } else {
        console.log(`✅ Database already contains ${row.count} books`);
      }
    });
  });
};

// Inicializar al iniciar
initializeDatabase();

// Middleware para verificar autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  }

  try {
    const user = JSON.parse(Buffer.from(token, 'base64').toString());
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido.' });
  }
};

// Rutas de Autenticación
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Error en la base de datos' });
      }

      if (row) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name || email],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error creando usuario' });
          }

          const token = Buffer.from(JSON.stringify({
            id: this.lastID,
            email: email,
            name: name || email
          })).toString('base64');

          res.json({
            message: 'Usuario creado exitosamente',
            token: token,
            user: {
              id: this.lastID,
              email: email,
              name: name || email
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name
    })).toString('base64');

    res.json({
      message: 'Login exitoso',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('❌ Error en el servidor durante el login:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Rutas de la API (protegidas)
app.get('/api/products', authenticateToken, (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Error al obtener productos' });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/external-books', authenticateToken, async (req, res) => {
  const { search = 'literatura' } = req.query;

  if (search.length < 2) {
    return res.status(400).json({ error: 'La búsqueda debe tener al menos 2 caracteres' });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}&maxResults=12&langRestrict=es`
    );

    if (!response.ok) {
      throw new Error(`Google Books API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items) {
      return res.json([]);
    }

    const books = data.items.map((item, index) => {
      const volumeInfo = item.volumeInfo || {};

      return {
        id: `google-${item.id || index}`,
        name: volumeInfo.title || 'Título no disponible',
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor desconocido',
        price: Math.floor(Math.random() * 4000) + 1500,
        description: volumeInfo.description || 'Descripción no disponible en este momento.',
        category: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
        image: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
        pages: volumeInfo.pageCount || 0,
        external: true
      };
    });

    res.json(books);

  } catch (error) {
    console.error('❌ Error Google Books API:', error.message);
    res.status(500).json({
      error: 'No se pudo conectar con Google Books API',
      details: error.message
    });
  }
});

// NUEVA RUTA: Simulación de pago
app.post('/api/payment', authenticateToken, (req, res) => {
  const { amount } = req.body;

  // Aquí iría la lógica real de procesamiento de pago
  // Para este ejemplo, siempre devuelve un éxito simulado
  console.log(`✅ Pago simulado exitoso por un total de: $${amount}`);

  res.json({
    status: 'success',
    tx: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    reason: 'Pago procesado exitosamente'
  });
});

// Modificación de la ruta para guardar toda la info de pago
app.post('/api/orders', authenticateToken, (req, res) => {
  const {
    id,
    customer_name,
    customer_lastname,
    customer_email,
    customer_address,
    customer_city,
    customer_zip,
    card_number,
    card_holder,
    card_expiry,
    card_cvv,
    items,
    total
  } = req.body;

  // Enmascarar número de tarjeta y CVV para seguridad
  const maskedCard = card_number ? '****-****-****-' + card_number.slice(-4) : '';
  const maskedCvv = card_cvv ? '***' : '';

  db.run(`
    INSERT INTO orders (
      id, user_id, customer_name, customer_lastname, customer_email,
      customer_address, customer_city, customer_zip,
      card_number, card_holder, card_expiry, card_cvv, total, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `, [
    id, req.user.id, customer_name, customer_lastname, req.user.email, // Usar el email del usuario logueado
    customer_address, customer_city, customer_zip,
    maskedCard, card_holder, card_expiry, maskedCvv, total
  ], function(err) {
    if (err) {
      console.error('Error creating order:', err);
      res.status(500).json({ error: 'Error al crear la orden' });
      return;
    }

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES (?, ?, ?)
    `);

    items.forEach(item => {
      insertItem.run(id, item.id, item.qty);
    });

    insertItem.finalize();

    res.json({
      status: 'success',
      orderId: id,
      message: 'Orden creada exitosamente'
    });
  });
});

// Obtener órdenes del usuario
app.get('/api/orders', authenticateToken, (req, res) => {
  db.all(`
    SELECT o.*, COUNT(oi.id) as items_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.date DESC
  `, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error obteniendo órdenes' });
    }
    res.json(rows);
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});