const heroesData = require('../data/heroes');

class HeroesService {
  constructor() {
    this.heroes = [...heroesData];
    this.nextId = Math.max(...this.heroes.map(h => h.id)) + 1;
  }

  async getAllHeroes(options = {}) {
    const { page = 1, limit = 10, search, universe } = options;
    
    let filteredHeroes = [...this.heroes];

    // Filtro por búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      filteredHeroes = filteredHeroes.filter(hero =>
        hero.name.toLowerCase().includes(searchLower) ||
        hero.power.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por universo
    if (universe) {
      filteredHeroes = filteredHeroes.filter(hero =>
        hero.universe && hero.universe.toLowerCase() === universe.toLowerCase()
      );
    }

    // Paginación
    const total = filteredHeroes.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const heroes = filteredHeroes.slice(startIndex, endIndex);

    return {
      heroes,
      page,
      limit,
      total,
      totalPages
    };
  }

  async getHeroById(id) {
    return this.heroes.find(hero => hero.id === id);
  }

  async createHero(heroData) {
    const newHero = {
      id: this.nextId++,
      name: heroData.name,
      power: heroData.power,
      universe: heroData.universe || 'Desconocido',
      isActive: heroData.isActive !== undefined ? heroData.isActive : true,
      createdAt: new Date().toISOString()
    };

    this.heroes.push(newHero);
    return newHero;
  }

  async updateHero(id, heroData) {
    const heroIndex = this.heroes.findIndex(hero => hero.id === id);
    
    if (heroIndex === -1) {
      return null;
    }

    const updatedHero = {
      ...this.heroes[heroIndex],
      ...heroData,
      id, // Mantener el ID original
      updatedAt: new Date().toISOString()
    };

    this.heroes[heroIndex] = updatedHero;
    return updatedHero;
  }

  async deleteHero(id) {
    const heroIndex = this.heroes.findIndex(hero => hero.id === id);
    
    if (heroIndex === -1) {
      return false;
    }

    this.heroes.splice(heroIndex, 1);
    return true;
  }
}

module.exports = new HeroesService();
