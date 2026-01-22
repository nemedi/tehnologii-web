import { DataTypes } from "sequelize";
import { connection } from "./connection.js";

export const Hall = connection.define(
  "Hall",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },    
    cinemaId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    layout: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    timestamps: false
  }
);
