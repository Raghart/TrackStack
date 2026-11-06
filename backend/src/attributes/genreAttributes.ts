import { Optional } from 'sequelize';

export interface GenresAttributes {
  id: number;
  genre: string;
}

export type GenresCreationAttributtes = Optional<GenresAttributes, 'id'>;
