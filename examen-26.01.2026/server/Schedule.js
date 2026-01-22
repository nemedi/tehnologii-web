import { DataTypes } from "sequelize";
import { connection } from "./connection.js";

export const Schedule = connection.define(
  "Schedule",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    hallId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hour: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);
