import { describe, test, expect } from "vitest";
import { findCharacter, listEpisodes } from "../../src/ejercicio-pe/rickandmorty.js";

describe('Pruebas API de Rick and Morty', () => {

  test('Debería encadenar findCharacter y listEpisodes para "Rick Sanchez"', () => {
    return findCharacter('https://rickandmortyapi.com/api/character/?', 'Rick Sanchez')
      .then((characters) => {
        expect(characters.length).toBeGreaterThan(0);

        const uniqueEpisodeIds = new Set<number>();

        characters.forEach((character) => {
          character.episode.forEach((url) => {
            const parts = url.split('/');
            const id = parseInt(parts[parts.length - 1], 10);
            uniqueEpisodeIds.add(id);
          });
        });

        const idsArray = Array.from(uniqueEpisodeIds);
        expect(idsArray.length).toBeGreaterThan(0);

        return listEpisodes('https://rickandmortyapi.com/api/episode/', idsArray);
      })
      .then((episodes) => {
        expect(episodes.length).toBeGreaterThan(0);
        expect(episodes[0]).toHaveProperty('id');
        expect(episodes[0]).toHaveProperty('name');
        expect(episodes[0]).toHaveProperty('air_date');
      });
  });

  test('Debería encadenar ambas funciones filtrando por nombre, estado y especie', () => {
    return findCharacter('https://rickandmortyapi.com/api/character/?', 'Morty Smith', 'alive', 'Human')
      .then((characters) => {
        const uniqueEpisodeIds = new Set<number>();

        characters.forEach((char) => {
          char.episode.forEach((url) => {
            const parts = url.split('/');
            const id = parseInt(parts[parts.length - 1], 10);
            uniqueEpisodeIds.add(id);
          });
        });

        const idsArray = Array.from(uniqueEpisodeIds).slice(0, 3);
        
        return listEpisodes('https://rickandmortyapi.com/api/episode/', idsArray);
      })
      .then((episodes) => {
        expect(episodes.length).toBeLessThanOrEqual(3);
        expect(episodes[0].name).toBe('Pilot');
      });
  });

  test('Debería encadenar ambas funciones filtrando por estado y especie', () => {
    return findCharacter('https://rickandmortyapi.com/api/character/?', undefined, 'alive', 'Alien')
      .then((characters) => {
        expect(characters.length).toBeGreaterThan(0);

        const uniqueEpisodeIds = new Set<number>();

        characters.forEach((character) => {
          character.episode.forEach((url) => {
            const parts = url.split('/');
            const id = parseInt(parts[parts.length - 1], 10);
            uniqueEpisodeIds.add(id);
          });
        });

        const idsArray = Array.from(uniqueEpisodeIds);
        expect(idsArray.length).toBeGreaterThan(0);

        return listEpisodes('https://rickandmortyapi.com/api/episode/', idsArray);
      })
      .then((episodes) => {
        expect(episodes.length).toBeGreaterThan(0);
        expect(episodes[0]).toHaveProperty('id');
        expect(episodes[0]).toHaveProperty('name');
        expect(episodes[0]).toHaveProperty('air_date');
      });
  });

  test('Debería encadenar ambas funciones filtrando por nombre, estado, especie y género', () => {
    return findCharacter('https://rickandmortyapi.com/api/character/?', 'Body Guard Morty', 'dead', 'Human', 'Male')
      .then((characters) => {
        const uniqueEpisodeIds = new Set<number>();

        characters.forEach((char) => {
          char.episode.forEach((url) => {
            const parts = url.split('/');
            const id = parseInt(parts[parts.length - 1], 10);
            uniqueEpisodeIds.add(id);
          });
        });

        const idsArray = Array.from(uniqueEpisodeIds)
        
        return listEpisodes('https://rickandmortyapi.com/api/episode/', idsArray);
      })
      .then((episodes) => {
        expect(episodes.length).toEqual(1);
        expect(episodes[0].name).toBe('The Ricklantis Mixup');
      });
  });

  test('Debería fallar correctamente en el primer paso si el personaje no existe', () => {
    return findCharacter('https://rickandmortyapi.com/api/character/?', 'PersonajeQueNoExiste123')
      .catch((err) => {
        expect(err).toMatch(/Error en la API con código: /);
      });
  });

  test('Debería fallar correctamente en el primer paso si la url es errónea', () => {
    return findCharacter('https://r.com/api/character/?', 'Rick Sanchez')
      .catch((err) => {
        expect(err).toMatch(/Error en la petición a la API: /);
      });
  });

  test('Debería fallar correctamente en la segunda función si no se le pasan ids', () => {
    return listEpisodes('https://rickandmortyapi.com/api/episode/', [])
      .catch((err) => {
        expect(err).toMatch(/No se proporcionaron IDs de episodios/);
      });
  });

  test('Debería fallar correctamente en la segunda función si la url es errónea', () => {
    return listEpisodes('https://r.com/api/episode/', [1, 2])
      .catch((err) => {
        expect(err).toMatch(/Error en la petición a la API: /);
      });
  });

  test('Debería fallar correctamente en la segunda función si los ids no son números válidos', () => {
    return listEpisodes('https://rickandmortyapi.com/api/episode/', [parseInt('f'), parseInt('j')])
      .catch((err) => {
        expect(err).toMatch(/Error en la API con código: /);
      });
  });

  test('Debería fallar correctamente en la segunda función si los números de episodio no existen', () => {
    return listEpisodes('https://rickandmortyapi.com/api/episode/', [1000, 2000])
      .catch((err) => {
        expect(err).toMatch(/No se obtuvo ningún resultado/);
      });
  });

});