const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(  
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    power: {
      type: String,
      required: [true, 'El poder es obligatorio'],
      trim: true,
      minlength: [5, 'El poder debe tener al menos 5 caracteres'],
      maxlength: [500, 'El poder no puede exceder 500 caracteres']
    },
    universe: {
      type: String,
      required: [true, 'El universo es obligatorio'],
      enum: {
        values: ['Marvel', 'DC', 'Other'],
        message: 'El universo debe ser Marvel, DC u Other'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }, {
  collection: 'heroes', // Asegurarse de que se usa la colección correcta
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para mejorar el rendimiento
heroSchema.index({ name: 1 });
heroSchema.index({ universe: 1 });
heroSchema.index({ isActive: 1 });
heroSchema.index({ name: 'text', power: 'text' }); // Para búsqueda de texto

// Middleware pre-save para validaciones adicionales
heroSchema.pre('save', function (next) {
  // Capitalizar la primera letra del nombre
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  next();
});

// Métodos estáticos
heroSchema.statics.findByUniverse = function (universe) {
  return this.find({ universe, isActive: true });
};

heroSchema.statics.searchByNameOrPower = function (searchTerm) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { power: { $regex: searchTerm, $options: 'i' } }
        ]
      }
    ]
  });
};

// Métodos de instancia
heroSchema.methods.activate = function () {
  this.isActive = true;
  return this.save();
};

heroSchema.methods.deactivate = function () {
  this.isActive = false;
  return this.save();
};

const Hero = mongoose.model('Hero', heroSchema);

module.exports = Hero;
