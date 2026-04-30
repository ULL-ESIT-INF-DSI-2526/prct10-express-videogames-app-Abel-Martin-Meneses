import mongoose from 'mongoose';
import { Trail } from './models/trail.js';

/**
 * Obtiene una ruta por su ID.
 * @param id - El ID de la ruta a obtener.
 * @returns Una promesa que resuelve con la ruta encontrada.
 */
export async function getTrailById(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error('Formato de ID incorrecto');
  }
  
  return await Trail.findById(id).populate('location');
}