import fs from 'fs/promises';
import path from 'path';
import { Videogame } from './types.js';

const DB_DIR = './collections';

/**
 * Agrega un nuevo videojuego para un usuario.
 * @param user - El nombre del usuario al que se le añadirá el videojuego
 * @param game - El objeto Videogame que se desea añadir
 * @returns Una promesa que resuelve con un mensaje de éxito o error
 */
export const addVideogame = async (user: string, game: Videogame): Promise<string> => {
  const userDir = path.join(DB_DIR, user);
  const filePath = path.join(userDir, `${game.id}.json`);
  await fs.mkdir(userDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(game, null, 2), { flag: 'wx' });
  return "Videojuego añadido correctamente.";
};

/**
 * Modifica un videojuego existente para un usuario.
 * @param user - El nombre del usuario al que se le modificará el videojuego
 * @param game - El objeto Videogame que se desea modificar
 * @returns Una promesa que resuelve con un mensaje de éxito o error
 */
export const updateVideogame = async (user: string, game: Videogame): Promise<string> => {
  const filePath = path.join(DB_DIR, user, `${game.id}.json`);
  await fs.access(filePath); // Si no existe, lanza error al catch
  await fs.writeFile(filePath, JSON.stringify(game, null, 2));
  return "Videojuego modificado correctamente.";
};

/**
 * Elimina un videojuego existente para un usuario.
 * @param user - El nombre del usuario al que se le eliminará el videojuego
 * @param id - El ID del videojuego que se desea eliminar
 * @returns Una promesa que resuelve con un mensaje de éxito o error
 */
export const removeVideogame = async (user: string, id: number): Promise<string> => {
  const filePath = path.join(DB_DIR, user, `${id}.json`);
  await fs.rm(filePath);
  return "Videojuego eliminado correctamente.";
};

/**
 * Lista todos los videojuegos para un usuario.
 * @param user - El nombre del usuario para el que se listarán los videojuegos
 * @returns Una promesa que resuelve con un array de videojuegos
 */
export const listVideogames = async (user: string): Promise<Videogame[]> => {
  const userDir = path.join(DB_DIR, user);
  const files = await fs.readdir(userDir);
  const promises = files.map(f => fs.readFile(path.join(userDir, f), 'utf-8'));
  const data = await Promise.all(promises);
  return data.map(d => JSON.parse(d));
};

/**
 * Lee un videojuego específico para un usuario.
 * @param user - El nombre del usuario para el que se leerá el videojuego
 * @param id - El ID del videojuego que se desea leer
 * @returns Una promesa que resuelve con el objeto Videogame correspondiente
 */
export const readVideogame = async (user: string, id: number): Promise<Videogame> => {
  const data = await fs.readFile(path.join(DB_DIR, user, `${id}.json`), 'utf-8');
  return JSON.parse(data);
};