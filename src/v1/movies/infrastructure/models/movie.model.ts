import { DataTypes, Model, Sequelize } from 'sequelize';
import { makeUaSortKey } from '../../../../shared/helpers/make-ua-sort-key.helper';

export class MovieModel extends Model {
  declare id: string;
  declare title: string;
  declare year: number;
  declare format: string;
  declare actors: string; // stored as JSON string
  declare titleSort: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function initMovieModel(sequelize: Sequelize): typeof MovieModel {
  MovieModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      format: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },

      actors: {
        type: DataTypes.TEXT, // JSON string in SQLite
        allowNull: false,
      },
      titleSort: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        defaultValue: '',
      },
    },
    {
      sequelize,
      tableName: 'movies',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['title', 'year'],
        },
      ],
    }
  );

  MovieModel.beforeValidate((movie) => {
    if (typeof movie.title === 'string') {
      movie.titleSort = makeUaSortKey(movie.title);
    }
  });

  return MovieModel;
}
