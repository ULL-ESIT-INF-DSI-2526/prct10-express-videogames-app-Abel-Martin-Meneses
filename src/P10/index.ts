import express from 'express';
import { ResponseType } from './types.js';
import { readVideogame, listVideogames, addVideogame, removeVideogame, updateVideogame } from './videogameManager.js';
import { parse } from 'node:path';

const app = express();

app.use(express.json());

/**
 * Obtiene la lista de videojuegos o un videojuego específico para un usuario.
 */
app.get('/videogames', async (req, res) => {
  const user = req.query.user as string;
  const id = req.query.id ? parseInt(req.query.id as string) : undefined;

  if (!user) return res.status(400).send({ success: false, message: 'Falta el usuario.' });

  try {
    if (id) {
      const game = await readVideogame(user, id);
      res.send({ success: true, videogames: [game] });
    } else {
      const games = await listVideogames(user);
      res.send({ success: true, videogames: games });
    }
  } catch (err) {
    res.status(404).send({ success: false, message: "No se encontraron datos." });
  }
})

/**
 * Agrega un nuevo videojuego para un usuario. El videojuego se envía en el cuerpo de la petición.
 * Si el videojuego ya existe (mismo ID), se devuelve un error.
 */
app.post('/videogames', async (req, res) => {
  const user = req.query.user as string;
  if (!user) return res.status(400).send({ success: false, message: 'Falta el usuario.' });

  try {
    const msg = await addVideogame(user, req.body);
    res.status(201).send({ success: true, message: msg });
  } catch (err: any) {
    res.status(400).send({ success: false, message: String(err) });
  }
})

/**
 * Modifica un videojuego existente para un usuario. El videojuego modificado se envía en el cuerpo de la petición.
 * Si el videojuego no existe, se devuelve un error.
 */
app.patch('/videogames', async (req, res) => {
  const user = req.query.user as string;
  if (!user) return res.status(400).send({ success: false, message: 'Falta el usuario' });

  try {
    const msg = await updateVideogame(user, req.body);
    res.status(201).send({ success: true, message: msg });
  } catch (err) {
    res.status(404).send({ success: false, message: 'El videojuego no existe.' });
  }
})

/**
 * Elimina un videojuego existente para un usuario. El ID del videojuego a eliminar se envía como query parameter.
 * Si el videojuego no existe, se devuelve un error.
 */
app.delete('/videogames', async (req, res) => {
  const user = req.query.user as string;
  const id = parseInt(req.query.id as string);
  if (!user) return res.status(400).send({ success: false, message: 'Falta el usuario.' });
  if (!id) return res.status(400).send({ success: false, message: 'Falta el id.' });

  try {
    const msg = await removeVideogame(user, id);
    res.status(201).send({ success: true, message: msg });
  } catch (err) {
    res.status(404).send({ success: false, message: 'El videojuego no existe.' });
  }
})

/**
 * Inicia el servidor en el puerto 3000 para que los tests puedan realizar las peticiones.
 * El servidor se ejecutará durante toda la suite de tests y se cerrará al finalizar.
 */
export const server = app.listen(3000, () => {
  console.log('Servidor ejecutándose para los tests...');
});