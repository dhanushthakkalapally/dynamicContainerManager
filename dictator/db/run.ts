import {DataTypes, Model} from "sequelize";
import sequelize from "./setup";

class Run extends Model {

    declare id: string;

    declare status: string;

    declare snippet: string;

    declare containerName: string;
}

Run.init({
  // Model attributes are defined here
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    snippet : {
        type: DataTypes.TEXT,
        allowNull: false
    },
    containerName: {
        type: DataTypes.STRING,
        allowNull: true
    }
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