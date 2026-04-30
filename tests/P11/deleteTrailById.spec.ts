import mongoose from 'mongoose';
import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import { Trail } from '../../src/P11/models/trail.js';      
import { Location } from '../../src/P11/models/location.js';
import { deleteTrailById } from '../../src/P11/deleteTrailById.js'; 

let testTrailId: mongoose.Types.ObjectId;

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/hiking-app-test-delete');
});

beforeEach(async () => {
  await Trail.deleteMany();
  await Location.deleteMany();

  const location = await new Location({
    country: 'España',
    region: 'Canarias',
    coordinates: { lat: 42.880, lon: -8.545 }
  }).save();

  const trail = await new Trail({
    name: 'Camino Prueba',
    difficulty: 'Moderate',
    distanceKm: 114.0,
    durationMinutes: 4320, 
    location: location._id
  }).save();

  testTrailId = trail._id as mongoose.Types.ObjectId;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de Eliminación de Rutas (deleteTrail)', () => {

  it('Debe eliminar una ruta correctamente', async () => {
    const deletedTrail = await deleteTrailById(testTrailId.toString());
    
    expect(deletedTrail).not.toBeNull();
    expect(deletedTrail?.name).toBe('Camino Prueba');

    const searchResult = await Trail.findById(testTrailId);
    expect(searchResult).toBeNull();
  });

  it('Debe devolver null al intentar eliminar una ruta inexistente con ID válido', async () => {
    const fakeValidId = new mongoose.Types.ObjectId().toString();
    
    const result = await deleteTrailById(fakeValidId);
    
    expect(result).toBeNull();
  });

  it('Debe lanzar error al intentar eliminar con un formato de ID incorrecto', async () => {
    const invalidId = 'un-id-completamente-invalido';
    
    await expect(deleteTrailById(invalidId)).rejects.toThrow('Formato de ID incorrecto');
  });

});