import { Schema, Document, model } from 'mongoose';
import { LocationDocument } from './location.js';

/**
 * Interfaz que representa un documento de ruta en la base de datos, con campos para el nombre, descripción, dificultad, distancia, desnivel, duración, ubicación, etiquetas y fecha de creación. Se incluyen validaciones para los campos numéricos y restricciones en la longitud de la descripción.
 */
export interface TrailDocument extends Document {
  name: string,
  description?: string,
  difficulty?: 'Easy' | 'Moderate' | 'Hard' | 'Expert',
  distanceKm: number,
  elevationGainM?: number,
  durationMinutes: number,
  location: LocationDocument,
  tags?: string[],
  createdAt: Date
}

/**
 * Esquema de Mongoose para la colección de rutas, con validaciones para los campos numéricos, restricciones en la longitud de la descripción y referencias a la colección de ubicaciones. Se establece el campo "name" como único para evitar duplicados y se define un campo "createdAt" que se asigna automáticamente al crear una nueva ruta.
 */
const TrailSchema = new Schema<TrailDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'La descripción no puede superar los 500 caracteres']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Hard', 'Expert']
  },
  distanceKm: {
    type: Number,
    required: true,
    min: [0.01, 'La distancia debe ser un número decimal positivo']
  },
  elevationGainM: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: 'El desnivel debe ser un número entero'
    },
    min: [0, 'El desnivel no puede ser negativo']
  },
  durationMinutes: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: 'La duración debe ser un número entero'
    },
    min: [1, 'La duración debe ser positiva']
  },
  location: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Location'
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

/**
 * Modelo de Mongoose para la colección de rutas, que se exporta para ser utilizado en otras partes de la aplicación, como en la creación, consulta, actualización y eliminación de rutas. Este modelo se basa en el esquema definido anteriormente y se asocia con la colección "Trail" en la base de datos.
 */
export const Trail = model<TrailDocument>('Trail', TrailSchema);