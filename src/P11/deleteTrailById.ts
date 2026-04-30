import mongoose from 'mongoose';
import { Trail } from './models/trail.js';

/**
 * Elimina una ruta por su ID.
 * @param id - El ID de la ruta a eliminar.
 * @returns Una promesa que resuelve con la ruta eliminada.
 */
export async function deleteTrailById(id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error('Formato de ID incorrecto');
  }

  return await Trail.findByIdAndDelete(id);
}