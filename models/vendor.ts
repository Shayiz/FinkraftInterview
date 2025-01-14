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

const vendorSchema = {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  vendorName: {
    type: STRING,
    allowNull: false,
  },

  vendorLocation: {
    type: STRING,
    allowNull: false,
  },
  active: {
    type: BOOLEAN,
    allowNull: true,
  },

  createdAt: {
    type: DATE,
  },
  updatedAt: {
    type: DATE,
  },
};

export class Vendor extends Model<
  InferAttributes<Vendor>,
  InferCreationAttributes<Vendor>
> {
  declare id: CreationOptional<string>;

  declare vendorName: string;

  declare vendorLocation: string;

  declare active: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Vendor.init(vendorSchema, {
  sequelize,
  modelName: "vendor",
  tableName: "vendor",
  timestamps: true,
});
