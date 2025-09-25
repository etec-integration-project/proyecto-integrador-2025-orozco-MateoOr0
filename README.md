BOOKHAVEN - GUÍA DE INSTALACIÓN PASO A PASO
ESTIMADO PROFESOR:
Esta guía le permitirá instalar y ejecutar la aplicación Full-Stack BookHaven (Frontend: React/Vite, Backend: Node.js/Express) en su computadora. Siga las instrucciones en ORDEN y al pie de la letra.

TIEMPO ESTIMADO: 10-15 minutos
NIVEL DE DIFICULTAD: Básico (no se requieren conocimientos técnicos avanzados)

📋 PRERREQUISITOS
Estado	Requisito	Notas
✅	Node.js instalado (versión 18 o superior)	Descargue la versión LTS de nodejs.org. Instálelo con todos los valores por defecto.
⚠️	Git instalado (Opcional)	O puede descargar el proyecto como ZIP.
✅	Navegador Web moderno	Chrome, Firefox, Edge, Safari.
🚀 PASO 1: OBTENER EL PROYECTO Y ESTRUCTURA
OPCIÓN A (RECOMENDADA): Descargar como ZIP
Vaya al repositorio de GitHub (o la fuente provista)

Haga clic en el botón verde "Code"

Seleccione "Download ZIP"

Extraiga el archivo ZIP en una carpeta de su elección (Ej: Escritorio/BookHaven-Project)

ESTRUCTURA DE LA CARPETA
Al extraer, su carpeta raíz debe contener DOS subcarpetas esenciales:

text
bookhaven-project/
├── 📁 backend/    (Contiene el servidor Node.js/Express)
└── 📁 frontend/   (Contiene la aplicación React/Vite)
⚙️ PASO 2: INSTALAR DEPENDENCIAS
⚠️ ¡IMPORTANTE! Debe abrir DOS ventanas de terminal/consola.

A. INSTALACIÓN DE DEPENDENCIAS DEL BACKEND
Abra la Terminal/Consola:

Windows: Presione Tecla Windows + R, escriba cmd y presione Enter

Mac/Linux: Busque y abra la aplicación "Terminal"

Navegue a la carpeta backend:

bash
cd [RUTA_DE_SU_PROYECTO]/bookhaven-project/backend
Ejemplo (si está en el Escritorio): cd Desktop/bookhaven-project/backend

Instale las dependencias (solo una vez):

bash
npm install
Debe ver: added XXX packages... y found 0 vulnerabilities

B. INSTALACIÓN DE DEPENDENCIAS DEL FRONTEND
Abra una SEGUNDA ventana de Terminal/Consola (No cierre la primera terminal del backend)

Navegue a la carpeta frontend:

bash
cd [RUTA_DE_SU_PROYECTO]/bookhaven-project/frontend
Ejemplo: cd Desktop/bookhaven-project/frontend

Instale las dependencias (solo una vez):

bash
npm install
Debe ver: added YYY packages... y found 0 vulnerabilities

🏃‍♂️ PASO 3: EJECUTAR LA APLICACIÓN
⚠️ ¡IMPORTANTE! Mantenga AMBAS terminales abiertas y ejecutándose.

A. INICIAR EL BACKEND (TERMINAL 1)
Asegúrese de estar en la carpeta backend (Terminal 1)

Ejecute el servidor backend:

bash
npm run dev
✅ DEBE VER ESTOS MENSAJES:

text
📊 Connected to SQLite database: /ruta/al/proyecto/backend/bookhaven.db
📚 Servidor BookHaven ejecutándose en http://localhost:3001
✅ Database already contains 6 books
B. INICIAR EL FRONTEND (TERMINAL 2)
Asegúrese de estar en la carpeta frontend (Terminal 2)

Ejecute la aplicación frontend:

bash
npm run dev
✅ DEBE VER ESTOS MENSAJES:

text
  VITE v7.1.7  ready in XXX ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
🌐 PASO 4: VERIFICAR Y PROBAR LA APLICACIÓN
Abra su navegador web (Chrome, Firefox, Edge, etc.)

Vaya a esta dirección: http://localhost:5173

VERIFICACIÓN TÉCNICA (Opcional)
Mientras el frontend carga, puede verificar el estado del backend en una nueva pestaña:

Estado del Backend: http://localhost:3001/api/health

Debe mostrar: {"status":"OK","message":"Servidor funcionando correctamente"}

🧪 PRUEBAS DE FUNCIONALIDAD
Realice estas pruebas para confirmar que la aplicación funciona correctamente:

Prueba	Acción	Verificación
🔐 Login	Use credenciales: Email: admin@bookhaven.com Password: admin123	Debe ver el catálogo de libros y carrito
📚 Catálogo	Navegue por los libros	Se muestran 6 libros de ejemplo con imágenes
🛒 Carrito	Agregue 2 libros con "Agregar"	Los ítems aparecen en el carrito lateral
🔍 Búsqueda	Use la barra de búsqueda (ej: "Harry Potter")	Muestra resultados de Google Books API
💳 Checkout	Haga clic en "Finalizar Compra" → Complete datos → "Confirmar Pago"	Mensaje de éxito y orden procesada
🆘 SOLUCIÓN DE PROBLEMAS RÁPIDA
Problema	Solución
"npm no se reconoce"	Reinstalar Node.js desde nodejs.org
La página no carga	Verifique que ambas terminales estén ejecutándose y use http://localhost:5173
Error: "Cannot connect to backend"	Backend no está activo. Verifique Terminal 1 con npm run dev
Error de dependencias	Ejecute npm install nuevamente en ambas carpetas y reinicie
🏗️ ESTRUCTURA TÉCNICA COMPLETA
Frontend: React 19 + Vite (Puerto 5173)

Backend: Node.js + Express.js (Puerto 3001)

Base de datos: SQLite (archivo bookhaven.db persistente)

Seguridad: Autenticación con bcryptjs + tokens JWT

Funcionalidades: Registro/Login, Catálogo, Carrito, Checkout, Google Books API