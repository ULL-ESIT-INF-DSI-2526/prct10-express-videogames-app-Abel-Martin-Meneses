import mongoose from 'mongoose';
import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import { Trail } from '../../src/P11/models/trail.js';      
import { Location } from '../../src/P11/models/location.js';
import { updateTrailById } from '../../src/P11/updateTrailById.js'; 

let testTrailId: mongoose.Types.ObjectId;
let originalDate: Date;

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/hiking-app-test-update');
});

beforeEach(async () => {
  await Trail.deleteMany();
  await Location.deleteMany();

  const location = await new Location({
    country: 'España',
    region: 'Madrid',
    coordinates: { lat: 40.781, lon: -4.012 }
  }).save();

  const trail = await new Trail({
    name: 'Camino Prueba',
    difficulty: 'Easy',
    distanceKm: 6.5,
    durationMinutes: 150,
    location: location._id
  }).save();

  testTrailId = trail._id as mongoose.Types.ObjectId;
  originalDate = trail.createdAt;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de Actualización de Rutas (updateTrailById)', () => {

  it('Debe actualizar parcialmente una ruta de forma exitosa', async () => {
    const updated = await updateTrailById(testTrailId.toString(), { 
      distanceKm: 7.0,
      durationMinutes: 180 
    } as any);

    expect(updated).not.toBeNull();
    expect(updated?.distanceKm).toBe(7.0);
    expect(updated?.durationMinutes).toBe(180);
    expect(updated?.name).toBe('Camino Prueba');
  });

  it('Debe rechazar la modificación del campo createdAt', async () => {
    const attemptUpdate = updateTrailById(testTrailId.toString(), { 
      createdAt: new Date('2020-01-01') 
    } as any);

    await expect(attemptUpdate).rejects.toThrow('No está permitido modificar la fecha de creación');
    
    const checkTrail = await Trail.findById(testTrailId);
    expect(checkTrail?.createdAt.getTime()).toBe(originalDate.getTime());
  });

  it('Debe fallar si los nuevos datos no cumplen los validadores del esquema', async () => {
    const attemptUpdate = updateTrailById(testTrailId.toString(), { 
      distanceKm: -5 
    } as any);

    await expect(attemptUpdate).rejects.toThrow();
  });

  it('Debe devolver null al intentar actualizar un ID válido que no existe', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const result = await updateTrailById(fakeId, { distanceKm: 10 } as any);
    
    expect(result).toBeNull();
  });

  it('Debe lanzar error al intentar actualizar con un formato de ID incorrecto', async () => {
    await expect(updateTrailById('id-invalido', { distanceKm: 10 } as any))
      .rejects.toThrow('Formato de ID incorrecto');
  });

});