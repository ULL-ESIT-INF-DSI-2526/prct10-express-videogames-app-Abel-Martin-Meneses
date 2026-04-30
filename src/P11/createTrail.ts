import { Trail, TrailDocument } from "./models/trail.js";

/**
 * Crea una nueva ruta en la base de datos.
 * @param trailData - Objeto que contiene los datos de la ruta a crear, incluyendo el nombre, descripción, dificultad, distancia, desnivel, duración, ubicación, etiquetas y fecha de creación. El campo "name" es obligatorio y debe ser único, mientras que los demás campos son opcionales. Se validan los campos numéricos para asegurarse de que sean positivos y se limita la longitud de la descripción a 500 caracteres.
 * @returns Una promesa que resuelve con la ruta creada.
 */
export async function createTrail(trailData: TrailDocument) {
  try {
    const trail = new Trail(trailData);
    return await trail.save();
  } catch (error: any) {
    if (error.code === 11000) {
      throw new Error('Ya existe una ruta con ese nombre');
    }
    throw error;
  }
}