import mongoose from 'mongoose';
import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import { Trail } from '../../src/P11/models/trail.js';      
import { Location } from '../../src/P11/models/location.js';
import { getTrailById } from '../../src/P11/getTrailById.js';  

let testTrailId: mongoose.Types.ObjectId;

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/hiking-app-test-getById');
});

beforeEach(async () => {
  await Trail.deleteMany();
  await Location.deleteMany();

  const location = await new Location({
    country: 'España',
    region: 'Canarias',
    coordinates: { lat: 37.177, lon: -3.598 }
  }).save();

  const trail = await new Trail({
    name: 'Ruta Prueba',
    difficulty: 'Moderate',
    distanceKm: 22.0,
    durationMinutes: 360,
    location: location._id
  }).save();

  // Guardamos el ID de la ruta generada para usarlo en las pruebas
  testTrailId = trail._id as mongoose.Types.ObjectId;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de Búsqueda por ID (getTrailById)', () => {

  it('Debe consultar por un ID válido y devolver la ruta correspondiente', async () => {
    const trail = await getTrailById(testTrailId.toString());
    
    expect(trail).not.toBeNull();
    expect(trail?.name).toBe('Ruta Prueba');
    expect(trail?.difficulty).toBe('Moderate');
    
    expect((trail?.location as any).country).toBe('España');
  });

  it('Debe devolver null al buscar un ID válido que no existe en la base de datos', async () => {
    const fakeValidId = new mongoose.Types.ObjectId().toString();
    const trail = await getTrailById(fakeValidId);
    
    expect(trail).toBeNull();
  });

  it('Debe lanzar un error al consultar por un ID con formato incorrecto', async () => {
    const invalidId = 'este-id-es-falso-y-mal-formateado';
    
    await expect(getTrailById(invalidId)).rejects.toThrow('Formato de ID incorrecto');
  });

});