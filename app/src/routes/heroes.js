const express = require('express');
const { body, param, validationResult } = require('express-validator');
const heroesController = require('../controllers/heroesController');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

// Validaciones
const heroValidation = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('power')
    .notEmpty()
    .withMessage('El poder es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El poder debe tener entre 2 y 100 caracteres'),
  body('universe')
    .optional()
    .isLength({ max: 30 })
    .withMessage('El universo no puede exceder 30 caracteres'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser un valor booleano')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('El ID debe ser un ObjectId válido de MongoDB')
];

// Rutas
router.get('/', heroesController.getAllHeroes);
router.get('/:id', idValidation, validateRequest, heroesController.getHeroById);
router.post('/', heroValidation, validateRequest, heroesController.createHero);
router.put('/:id', [...idValidation, ...heroValidation], validateRequest, heroesController.updateHero);
router.delete('/:id', idValidation, validateRequest, heroesController.deleteHero);

module.exports = router;
