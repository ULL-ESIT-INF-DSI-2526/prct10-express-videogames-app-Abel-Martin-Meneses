import mongoose from 'mongoose';
import { Trail, TrailDocument } from './models/trail.js';

/**
 * Actualiza una ruta por su ID.
 * @param id - El ID de la ruta a actualizar.
 * @param updates - Objeto que contiene los campos a actualizar.
 * @returns Una promesa que resuelve con la ruta actualizada.
 */
export async function updateTrailById(id: string, updates: Partial<TrailDocument>) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error('Formato de ID incorrecto');
  }

  if (Object.keys(updates).includes('createdAt')) {
    throw new Error('No está permitido modificar la fecha de creación (createdAt)');
  }

  return await Trail.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}