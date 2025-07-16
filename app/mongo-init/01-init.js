// Script de inicialización para MongoDB
// Este script se ejecuta automáticamente cuando se crea el contenedor

// Crear base de datos y usuario
db = db.getSiblingDB('heroes_db');

// Crear usuario para la aplicación
db.createUser({
  user: 'heroes_user',
  pwd: 'heroes_password',
  roles: [
    {
      role: 'readWrite',
      db: 'heroes_db'
    }
  ]
});

// Crear colección de héroes con algunos datos de ejemplo
db.heroes.insertMany([
  {
    name: "Spider-Man",
    power: "Spider abilities, web-slinging, spider-sense",
    universe: "Marvel",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Batman",
    power: "Intelligence, martial arts, technology",
    universe: "DC",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Wonder Woman",
    power: "Super strength, flight, lasso of truth",
    universe: "DC",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Iron Man",
    power: "Powered armor suit, genius intellect",
    universe: "Marvel",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Superman",
    power: "Flight, super strength, heat vision, invulnerability",
    universe: "DC",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Crear índices para mejor rendimiento
db.heroes.createIndex({ name: 1 });
db.heroes.createIndex({ universe: 1 });
db.heroes.createIndex({ isActive: 1 });
db.heroes.createIndex({ name: "text", power: "text" }); // Para búsqueda de texto

print("✅ Base de datos inicializada correctamente");
print("📊 Insertados", db.heroes.countDocuments(), "héroes");
print("🔍 Índices creados para optimizar consultas");
