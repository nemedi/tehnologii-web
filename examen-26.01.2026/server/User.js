import { DataTypes } from "sequelize";
import { connection } from "./connection.js";

export const User = connection.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    timestamps: false,
  }
);
