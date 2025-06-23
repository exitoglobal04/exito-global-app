const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('database.db');

// Configurar Express
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Crear tabla de usuarios si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    telefono TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL
  )
`);

// Ruta para registrar un usuario
app.post('/api/registrar', (req, res) => {
  const { nombre, correo, telefono, tipoUsuario } = req.body;
  if (!nombre || !correo || !telefono || !tipoUsuario) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  db.run(
    `INSERT INTO usuarios (nombre, correo, telefono, tipo_usuario) VALUES (?, ?, ?, ?)`,
    [nombre, correo, telefono, tipoUsuario],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar usuario: ' + err.message });
      }
      res.status(200).json({ mensaje: 'Usuario registrado exitosamente', id_usuario: this.lastID });
    }
  );
});

// Ruta de prueba
app.get('/test', (req, res) => {
  res.send('Servidor funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});