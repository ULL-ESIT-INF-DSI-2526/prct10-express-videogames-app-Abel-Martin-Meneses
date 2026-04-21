import { describe, test, expect, beforeAll, afterAll } from "vitest";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { Videogame, Platform, Genre, Developer } from "../src/types.js";
import { server } from "../src/index.js";

const baseURL = "http://localhost:3000/videogames";
const testUser = "test_user_dsi";
const testDir = path.join("./collections", testUser);

// Datos de prueba
const testGame: Videogame = {
  id: 999,
  name: "Juego de Prueba",
  description: "Un juego creado automáticamente por Vitest",
  platform: Platform.PC,
  genre: Genre.ACTION,
  developer: Developer.ROCKSTAR,
  year: 2026,
  multiplayer: true,
  hours: 50,
  value: 19.99
};

// Función para limpiar la carpeta de pruebas antes y después
const cleanUpTestUser = async () => {
  try {
    await fs.rm(testDir, { recursive: true, force: true });
  } catch (error) {
    // Si la carpeta no existe, no pasa nada, ignoramos el error
  }
};

describe("Pruebas de la API Express de Videojuegos", () => {
  
  // Limpiamos antes de empezar y al terminar todos los tests
  beforeAll(async () => await cleanUpTestUser());
  afterAll(async () => {
    await cleanUpTestUser()
    server.close();
  });

  // 1. Prueba de POST (Añadir exitoso)
  test("POST /videogames - Debería añadir un videojuego nuevo (Status 201)", () => {
    return axios.post(`${baseURL}?user=${testUser}`, testGame).then((response) => {
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toBe("Videojuego añadido correctamente.");
    });
  });

  // 2. Prueba de POST (Añadir duplicado - Error)
  test("POST /videogames - Debería dar error al añadir un ID existente (Status 400)", () => {
    return axios.post(`${baseURL}?user=${testUser}`, testGame).catch((error) => {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toMatch(/exists|existe/i);
    });
  });

  // 3. Prueba de GET (Leer un videojuego concreto)
  test("GET /videogames - Debería devolver un videojuego por su ID (Status 200)", () => {
    return axios.get(`${baseURL}?user=${testUser}&id=${testGame.id}`).then((response) => {
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      // Comprobamos que el ID del juego devuelto coincide
      expect(response.data.videogames[0].id).toBe(testGame.id);
      expect(response.data.videogames[0].name).toBe("Juego de Prueba");
    });
  });

  // 4. Prueba de GET (Listar todos los videojuegos)
  test("GET /videogames - Debería listar todos los videojuegos del usuario (Status 200)", () => {
    return axios.get(`${baseURL}?user=${testUser}`).then((response) => {
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.videogames.length).toBeGreaterThan(0);
    });
  });

  // 5. Prueba de PATCH (Modificar el videojuego)
  test("PATCH /videogames - Debería actualizar un videojuego existente (Status 201)", () => {
    const updatedGame = { ...testGame, name: "Juego Actualizado", hours: 100 };
    
    return axios.patch(`${baseURL}?user=${testUser}`, updatedGame).then((response) => {
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toBe("Videojuego modificado correctamente.");
    });
  });

  // 6. Prueba de DELETE (Eliminar el videojuego)
  test("DELETE /videogames - Debería borrar un videojuego existente (Status 201)", () => {
    return axios.delete(`${baseURL}?user=${testUser}&id=${testGame.id}`).then((response) => {
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toBe("Videojuego eliminado correctamente.");
    });
  });

  // 7. Prueba de DELETE (Eliminar un juego que ya no existe)
  test("DELETE /videogames - Debería fallar al borrar un juego inexistente (Status 404)", () => {
    return axios.delete(`${baseURL}?user=${testUser}&id=${testGame.id}`).catch((error) => {
      expect(error.response.status).toBe(404);
      expect(error.response.data.success).toBe(false);
    });
  });

  test("Cualquier ruta - Debería dar error 400 si falta el parámetro de usuario", () => {
    // Hacemos una petición sin "?user=..."
    return axios.get(baseURL).catch((error) => {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Falta el usuario.");
    });
  });

  test("POST /videogames - Debería dar error 400 si falta el usuario", () => {
    // Enviamos el body, pero no ponemos ?user= en la URL
    return axios.post(baseURL, testGame).catch((error) => {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
    });
  });

  test("PATCH /videogames - Debería dar error 400 si falta el usuario", () => {
    return axios.patch(baseURL, testGame).catch((error) => {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
    });
  });

  test("DELETE /videogames - Debería dar error 400 si falta el usuario", () => {
    // Un delete completamente vacío
    return axios.delete(baseURL).catch((error) => {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
    });
  });

  test("DELETE /videogames - Debería dar error 400 si se envía el usuario pero falta el ID", () => {
    // Enviamos el usuario en la query, pero omitimos el &id=...
    return axios.delete(`${baseURL}?user=${testUser}`).catch((error) => {
      expect(error.response.status).toBe(400);
      expect(error.response.data.success).toBe(false);
      expect(error.response.data.message).toBe("Falta el id.");
    });
  });

  // Prueba para cubrir el catch de GET (Juego no encontrado)
  test("GET /videogames - Debería dar error 404 si se busca un ID que no existe", () => {
    // Buscamos el ID 99999 que no hemos creado
    return axios.get(`${baseURL}?user=${testUser}&id=99999`).catch((error) => {
      expect(error.response.status).toBe(404);
      expect(error.response.data.success).toBe(false);
    });
  });

  // Prueba para cubrir el catch de PATCH (Modificar juego no encontrado)
  test("PATCH /videogames - Debería dar error 404 si se intenta modificar un juego inexistente", () => {
    const fakeGame = { ...testGame, id: 99999 };
    
    return axios.patch(`${baseURL}?user=${testUser}`, fakeGame).catch((error) => {
      expect(error.response.status).toBe(404);
      expect(error.response.data.success).toBe(false);
    });
  });
});