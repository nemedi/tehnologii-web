import { DataTypes } from "sequelize";
import { connection } from "./connection.js";

export const Reservation = connection.define(
  "Reservation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    scheduleId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    seat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    timestamps: false,
  }
);
