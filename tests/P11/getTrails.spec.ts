import mongoose from 'mongoose';
import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import { Trail } from '../../src/P11/models/trail.js';      
import { Location } from '../../src/P11/models/location.js';
import { getTrails } from '../../src/P11/getTrails.js';

let locSpainId: mongoose.Types.ObjectId;
let locFranceId: mongoose.Types.ObjectId;

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/hiking-app-test-get');
});

beforeEach(async () => {
  await Trail.deleteMany();
  await Location.deleteMany();

  const locSpain = await new Location({
    country: 'España',
    region: 'Canarias',
    coordinates: { lat: 28.272, lon: -16.642 }
  }).save();
  locSpainId = locSpain._id as mongoose.Types.ObjectId;

  const locFrance = await new Location({
    country: 'Francia',
    region: 'Alpes',
    coordinates: { lat: 45.832, lon: 6.865 }
  }).save();
  locFranceId = locFrance._id as mongoose.Types.ObjectId;

  await new Trail({
    name: 'Pico del Teide',
    difficulty: 'Expert',
    distanceKm: 9.3,
    durationMinutes: 300,
    location: locSpainId
  }).save();

  await new Trail({
    name: 'Roque Nublo',
    difficulty: 'Easy',
    distanceKm: 3.0,
    durationMinutes: 90,
    location: locSpainId
  }).save();

  await new Trail({
    name: 'Prueba Francia',
    difficulty: 'Hard',
    distanceKm: 15.0,
    durationMinutes: 420,
    location: locFranceId
  }).save();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de Obtención y Filtrado de Rutas (getTrails)', () => {

  it('Debe obtener todas las rutas si no se pasan filtros', async () => {
    const trails = await getTrails();
    expect(trails.length).toBe(3);
  });

  it('Debe filtrar correctamente por dificultad (difficulty)', async () => {
    const expertTrails = await getTrails({ difficulty: 'Expert' });
    expect(expertTrails.length).toBe(1);
    expect(expertTrails[0].name).toBe('Pico del Teide');

    const easyTrails = await getTrails({ difficulty: 'Easy' });
    expect(easyTrails.length).toBe(1);
    expect(easyTrails[0].name).toBe('Roque Nublo');
  });

  it('Debe filtrar correctamente por país usando la referencia (country)', async () => {
    const spainTrails = await getTrails({ country: 'España' });
    expect(spainTrails.length).toBe(2);
    
    expect((spainTrails[0].location as any).country).toBe('España');
    expect((spainTrails[1].location as any).country).toBe('España');

    const franceTrails = await getTrails({ country: 'Francia' });
    expect(franceTrails.length).toBe(1);
    expect(franceTrails[0].name).toBe('Prueba Francia');
  });

  it('Debe devolver un array vacío si el filtro no coincide con nada', async () => {
    const noTrails = await getTrails({ country: 'Japon' });
    expect(noTrails.length).toBe(0);
    expect(Array.isArray(noTrails)).toBe(true);
  });

  it('Debe aplicar varios filtros a la vez (difficulty y country)', async () => {
    const filteredTrails = await getTrails({ difficulty: 'Expert', country: 'España' });
    expect(filteredTrails.length).toBe(1);
    expect(filteredTrails[0].name).toBe('Pico del Teide');
  });

});