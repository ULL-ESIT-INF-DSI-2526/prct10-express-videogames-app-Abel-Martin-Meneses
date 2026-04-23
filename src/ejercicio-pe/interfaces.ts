/**
 * Interfaz para representar un personaje de la serie Rick and Morty, con sus propiedades id, name, status, species, gender y episode (array de URLs de episodios en los que aparece el personaje).
 */
export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  episode: string[];
}

/**
 * Interfaz para representar un episodio de la serie Rick and Morty, con sus propiedades id, name y air_date.
 */
export interface Episode {
  id: number;
  name: string;
  air_date: string;
}