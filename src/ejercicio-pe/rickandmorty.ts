import request from "request";
import { Character, Episode } from "./interfaces.js";

/**
 * Tipo para el estado del personaje, puede ser 'alive', 'dead', 'unknown' o undefined si no se especifica
 */
type Status = 'alive' | 'dead' | 'unknown' | undefined;

/**
 * Busca personajes en la API de Rick and Morty filtrando por nombre, estado, especie y género. Devuelve una promesa que se resuelve con un array de personajes.
 * @param url - URL base de la API para buscar personajes
 * @param name - Nombre del personaje a buscar (opcional)
 * @param status - Estado del personaje a buscar (opcional, puede ser 'alive', 'dead', 'unknown' o undefined)
 * @param specie - Especie del personaje a buscar (opcional)
 * @param gender - Género del personaje a buscar (opcional)
 * @returns Promesa que se resuelve con un array de personajes
 */
export const findCharacter = (url: string, name?: string, status?: Status, specie?: string, gender?: string): Promise<Character[]> => {
  let params: string[] = [];

  if (name !== undefined) params.push(`name=${encodeURIComponent(name)}`);
  if (status !== undefined) params.push(`status=${encodeURIComponent(status)}`);
  if (specie !== undefined) params.push(`specie=${encodeURIComponent(specie)}`);
  if (gender !== undefined) params.push(`gender=${encodeURIComponent(gender)}`);

  url = `${url}${params.join('&')}`;

  return new Promise((resolve, reject) => {
    request({ url: url, json: true}, (error: Error, response) => {
      if (error) {
        reject(`Error en la petición a la API: ${error.message}`);
      } else if (response.statusCode !== 200) {
        reject(`Error en la API con código: ${response.statusCode}`);
      } else {
        const body = response.body;
        resolve(body.results);
      }
    });
  });
}

/**
 * Lista episodios específicos en la API de Rick and Morty. Devuelve una promesa que se resuelve con un array de episodios.
 * @param url - URL base de la API para listar episodios
 * @param ids - Array de IDs de episodios a listar
 * @returns Promesa que se resuelve con un array de episodios
 */
export const listEpisodes = (url: string, ids: number[]): Promise<Episode[]> => {
  return new Promise((resolve, reject) => {
    if (!ids || ids.length === 0) {
      reject('No se proporcionaron IDs de episodios');
    }
    url = `${url}${ids.join(',')}`;

    request({ url: url, json: true}, (error: Error, response) => {
      if (error) {
        reject(`Error en la petición a la API: ${error.message}`);
      } else if (response.statusCode !== 200) {
        reject(`Error en la API con código: ${response.statusCode}`);
      } else {
        const body = response.body;

        const results = Array.isArray(body) ? body : [body];
        if (results.length === 0) {
          reject('No se obtuvo ningún resultado');
        } else {
          const episodes: Episode[] = results.map((ep: any) => ({
            id: ep.id,
            name: ep.name,
            air_date: ep.air_date
          }));
          resolve(episodes);
        }
      }
    })
  })
}