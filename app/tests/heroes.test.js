const request = require('supertest');
const app = require('../src/index');

describe('Heroes API', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);

      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/heroes', () => {
    it('should return all heroes with pagination', async () => {
      const res = await request(app)
        .get('/api/heroes')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter heroes by universe', async () => {
      const res = await request(app)
        .get('/api/heroes?universe=Marvel')
        .expect(200);

      expect(res.body.success).toBe(true);
      res.body.data.forEach(hero => {
        expect(hero.universe).toBe('Marvel');
      });
    });

    it('should search heroes by name', async () => {
      const res = await request(app)
        .get('/api/heroes?search=Spider')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/heroes/:id', () => {
    it('should return a hero by ID', async () => {
      const res = await request(app)
        .get('/api/heroes/1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id', 1);
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('power');
    });

    it('should return 404 for non-existent hero', async () => {
      const res = await request(app)
        .get('/api/heroes/999')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Héroe no encontrado');
    });

    it('should return 400 for invalid ID', async () => {
      const res = await request(app)
        .get('/api/heroes/invalid')
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/heroes', () => {
    it('should create a new hero', async () => {
      const newHero = {
        name: 'Test Hero',
        power: 'Test Power',
        universe: 'Test Universe'
      };

      const res = await request(app)
        .post('/api/heroes')
        .send(newHero)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe(newHero.name);
      expect(res.body.data.power).toBe(newHero.power);
    });

    it('should return validation error for missing name', async () => {
      const invalidHero = {
        power: 'Test Power'
      };

      const res = await request(app)
        .post('/api/heroes')
        .send(invalidHero)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Errores de validación');
    });
  });

  describe('PUT /api/heroes/:id', () => {
    it('should update an existing hero', async () => {
      const updateData = {
        name: 'Updated Hero',
        power: 'Updated Power'
      };

      const res = await request(app)
        .put('/api/heroes/1')
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(updateData.name);
      expect(res.body.data.power).toBe(updateData.power);
    });

    it('should return 404 for non-existent hero', async () => {
      const updateData = {
        name: 'Updated Hero',
        power: 'Updated Power'
      };

      const res = await request(app)
        .put('/api/heroes/999')
        .send(updateData)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/heroes/:id', () => {
    it('should delete an existing hero', async () => {
      // Primero crear un héroe para eliminar
      const newHero = {
        name: 'Hero to Delete',
        power: 'Temporary Power'
      };

      const createRes = await request(app)
        .post('/api/heroes')
        .send(newHero);

      const heroId = createRes.body.data.id;

      // Ahora eliminarlo
      const deleteRes = await request(app)
        .delete(`/api/heroes/${heroId}`)
        .expect(200);

      expect(deleteRes.body.success).toBe(true);
      expect(deleteRes.body.message).toBe('Héroe eliminado exitosamente');
    });

    it('should return 404 for non-existent hero', async () => {
      const res = await request(app)
        .delete('/api/heroes/999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });
});
