import { Location } from "./models/location.js";
import { Trail, TrailDocument } from "./models/trail.js";

/**
 * Obtiene una lista de rutas que coinciden con los filtros especificados.
 * @param filter - Objeto que contiene los filtros para la consulta de rutas.
 * @returns Una promesa que resuelve con la lista de rutas encontradas.
 */
export async function getTrails(filter?: { difficulty?: string; country?: string }) {
  const query: any = {};

  if (filter?.difficulty) {
    query.difficulty = filter.difficulty;
  }

  if (filter?.country) {
    const locations = await Location.find({ country: filter.country }, '_id');
    const locationIds = locations.map(loc => loc._id);
    
    query.location = { $in: locationIds };
  }

  return await Trail.find(query).populate('location');
}