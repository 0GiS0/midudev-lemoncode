const heroesService = require('../services/heroesServiceMongo');

const getAllHeroes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, universe } = req.query;
    
    const result = await heroesService.getAllHeroes({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      universe
    });

    res.json({
      success: true,
      data: result.heroes,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

const getHeroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hero = await heroesService.getHeroById(parseInt(id));

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Héroe no encontrado'
      });
    }

    res.json({
      success: true,
      data: hero
    });
  } catch (error) {
    next(error);
  }
};

const createHero = async (req, res, next) => {
  try {
    const heroData = req.body;
    const newHero = await heroesService.createHero(heroData);

    res.status(201).json({
      success: true,
      message: 'Héroe creado exitosamente',
      data: newHero
    });
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const { id } = req.params;
    const heroData = req.body;
    
    const updatedHero = await heroesService.updateHero(parseInt(id), heroData);

    if (!updatedHero) {
      return res.status(404).json({
        success: false,
        message: 'Héroe no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Héroe actualizado exitosamente',
      data: updatedHero
    });
  } catch (error) {
    next(error);
  }
};

const deleteHero = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await heroesService.deleteHero(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Héroe no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Héroe eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero
};
