import { DataTypes } from "sequelize";
import { connection } from "./connection.js";

export const Movie = connection.define(
  "Movie",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Duration in minutes"
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Genre (Action, Drama, Comedy etc.)"
    },
    posterUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);
