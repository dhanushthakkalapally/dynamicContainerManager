
import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "./setup";

class Run extends Model {}

Run.init({
  // Model attributes are defined here
    id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  timestamps: true,
    tableName: 'run',
    underscored: true
    // We need to choose the model name
});

// This will run .sync() only if database name ends with '_test'
sequelize.sync({ alter: true}).then(console.log)

export default Run;