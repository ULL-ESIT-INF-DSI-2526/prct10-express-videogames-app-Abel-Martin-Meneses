import mongoose from 'mongoose';
import { describe, it, expect, beforeEach, afterAll, beforeAll } from 'vitest';
import { Trail } from '../../src/P11/models/trail.js';      
import { Location } from '../../src/P11/models/location.js';
import { createTrail } from '../../src/P11/createTrail.js';  

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/hiking-app-test-create');
});

beforeEach(async () => {
  await Trail.deleteMany();
  await Location.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pruebas de Creación de Rutas (createTrail)', () => {

  it('Debe crear una ruta exitosamente con todos los campos válidos', async () => {
    const location = new Location({
      country: 'España',
      region: 'Canarias',
      coordinates: { lat: 28.272, lon: -16.642 } 
    });
    await location.save();

    const newTrail = await createTrail({
      name: 'Pico del Teide',
      difficulty: 'Expert',
      distanceKm: 9.3,
      durationMinutes: 300,
      location: location._id, 
      tags: ['volcán', 'senderismo', 'paisaje']
    } as any);

    expect(newTrail.name).toBe('Pico del Teide');
    expect(newTrail._id).toBeDefined();
    expect(newTrail.createdAt).toBeDefined();
    expect(newTrail.location.toString()).toBe(location._id.toString());
  });

  it('Debe rechazar la creación de una ruta con nombre duplicado', async () => {
    const location = await new Location({
      country: 'España',
      region: 'Canarias',
      coordinates: { lat: 28.0, lon: -17.0 }
    }).save();

    await createTrail({
      name: 'Ruta Prueba',
      distanceKm: 10,
      durationMinutes: 60,
      location: location._id
    } as any);

    await expect(createTrail({
      name: 'Ruta Prueba',
      distanceKm: 15,
      durationMinutes: 120,
      location: location._id
    } as any)).rejects.toThrow('Ya existe una ruta con ese nombre');
  });

  it('Debe fallar por validación de coordenadas fuera de rango', async () => {
    const invalidLocation = new Location({
      country: 'Cualquiera',
      region: 'Región Inexistente',
      coordinates: { lat: 150, lon: -200 } 
    });

    await expect(invalidLocation.save()).rejects.toThrow();
  });

});