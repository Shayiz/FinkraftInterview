import {
  BOOLEAN,
  CreationOptional,
  DATE,
  DATEONLY,
  ForeignKey,
  INTEGER,
  InferAttributes,
  InferCreationAttributes,
  Model,
  STRING,
  DECIMAL,
  TEXT,
  UUID,
  UUIDV4,
  BIGINT,
  NUMBER,
  DOUBLE,
} from "sequelize";
import { sequelize } from "../database";
import { Vendor } from "./vendor";

const BookingSchema = {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  bookingId: {
    type: STRING,
    allowNull: false,
  },

  customerName: {
    type: STRING,
    allowNull: false,
  },
  bookingDate: {
    type: DATE,
  },
  active: {
    type: BOOLEAN,
    allowNull: true,
  },
  amount: {
    type: DOUBLE,
  },
  vendorId: {
    type: UUID,
    references: {
      model: Vendor,
      key: "id",
    },
    allowNull: true,
  },

  createdAt: {
    type: DATE,
  },
  updatedAt: {
    type: DATE,
  },
};

export class Booking extends Model<
  InferAttributes<Booking>,
  InferCreationAttributes<Booking>
> {
  declare id: CreationOptional<string>;

  declare customerName: string;

  declare bookingId: string;

  declare bookingDate: Date;

  declare amount: number;

  declare vendorId: ForeignKey<Vendor["id"]>;

  declare active: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Booking.init(BookingSchema, {
  sequelize,
  modelName: "booking",
  tableName: "booking",
  timestamps: true,
});

Booking.belongsTo(Vendor, {
  as: "Vendor",
  foreignKey: "vendorId",
});
