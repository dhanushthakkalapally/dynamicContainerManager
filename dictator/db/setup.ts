import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres', 'sanju', 'Dhanush97', {
  host: 'db',
  dialect: 'postgres',
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;
