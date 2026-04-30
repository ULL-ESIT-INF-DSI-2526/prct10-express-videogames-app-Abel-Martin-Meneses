import { Schema, Document, model } from 'mongoose';

/**
 * Interfaz que representa un documento de ubicación en la base de datos.
 */
export interface LocationDocument extends Document {
  country: string,
  region: string,
  coordinates: {
    lat: number,
    lon: number
  }
}

/**
 * Esquema de Mongoose para la colección de ubicaciones, con validaciones para los campos y restricciones en las coordenadas geográficas.
 */
const LocationSchema = new Schema<LocationDocument>({
  country: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
      min: [-90, 'La latitud no puede ser menor a -90'], 
      max: [90, 'La latitud no puede ser mayor a 90']
    },
    lon: {
      type: Number,
      required: true,
      min: [-180, 'La longitud no puede ser menor a -180'], 
      max: [180, 'La longitud no puede ser mayor a 180']
    }
  }
})

/**
 * Modelo de Mongoose para la colección de ubicaciones, que se exporta para ser utilizado en otras partes de la aplicación, como en la creación y consulta de rutas.
 */
export const Location = model<LocationDocument>('Location', LocationSchema);