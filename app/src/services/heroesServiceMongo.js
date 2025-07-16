const Hero = require('../models/Hero');

class HeroesService {
  async getAllHeroes(options = {}) {
    try {
      const { page = 1, limit = 10, universe, search } = options;
      const skip = (page - 1) * limit;
      const query = { isActive: true };

      // Filtrar por universo si se proporciona
      if (universe) {
        query.universe = universe;
      }

      // Búsqueda por nombre o poder si se proporciona
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { power: { $regex: search, $options: 'i' } }
        ];
      }

      const [heroes, total] = await Promise.all([
        Hero.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(), // Usar lean() para mejor rendimiento
        Hero.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        heroes,
        page,
        limit,
        total,
        totalPages
      };
    } catch (error) {
      throw new Error(`Error al obtener héroes: ${error.message}`);
    }
  }

  async getHeroById(id) {
    try {
      const hero = await Hero.findById(id);
      
      if (!hero || !hero.isActive) {
        return null;
      }

      return hero;
    } catch (error) {
      if (error.name === 'CastError') {
        return null; // ID inválido
      }
      throw new Error(`Error al obtener héroe: ${error.message}`);
    }
  }

  async createHero(heroData) {
    try {
      const hero = new Hero(heroData);
      const savedHero = await hero.save();
      return savedHero;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw new Error(`Datos inválidos: ${messages.join(', ')}`);
      }
      throw new Error(`Error al crear héroe: ${error.message}`);
    }
  }

  async updateHero(id, updateData) {
    try {
      const hero = await Hero.findById(id);
      
      if (!hero || !hero.isActive) {
        return null;
      }

      // Actualizar campos
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          hero[key] = updateData[key];
        }
      });

      const updatedHero = await hero.save();
      return updatedHero;
    } catch (error) {
      if (error.name === 'CastError') {
        return null; // ID inválido
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        throw new Error(`Datos inválidos: ${messages.join(', ')}`);
      }
      throw new Error(`Error al actualizar héroe: ${error.message}`);
    }
  }

  async deleteHero(id) {
    try {
      const hero = await Hero.findById(id);
      
      if (!hero || !hero.isActive) {
        return null;
      }

      // Soft delete - marcar como inactivo en lugar de eliminar
      hero.isActive = false;
      await hero.save();
      
      return hero;
    } catch (error) {
      if (error.name === 'CastError') {
        return null; // ID inválido
      }
      throw new Error(`Error al eliminar héroe: ${error.message}`);
    }
  }

  // Métodos adicionales útiles
  async getHeroesByUniverse(universe) {
    try {
      const heroes = await Hero.findByUniverse(universe);
      return heroes;
    } catch (error) {
      throw new Error(`Error al obtener héroes por universo: ${error.message}`);
    }
  }

  async searchHeroes(searchTerm) {
    try {
      const heroes = await Hero.searchByNameOrPower(searchTerm);
      return heroes;
    } catch (error) {
      throw new Error(`Error en búsqueda: ${error.message}`);
    }
  }

  async getStats() {
    try {
      const [totalHeroes, activeHeroes, marvelHeroes, dcHeroes, otherHeroes] = await Promise.all([
        Hero.countDocuments(),
        Hero.countDocuments({ isActive: true }),
        Hero.countDocuments({ universe: 'Marvel', isActive: true }),
        Hero.countDocuments({ universe: 'DC', isActive: true }),
        Hero.countDocuments({ universe: 'Other', isActive: true })
      ]);

      return {
        total: totalHeroes,
        active: activeHeroes,
        inactive: totalHeroes - activeHeroes,
        byUniverse: {
          Marvel: marvelHeroes,
          DC: dcHeroes,
          Other: otherHeroes
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = new HeroesService();
