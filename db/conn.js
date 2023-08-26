const { Sequelize } = require('sequelize')

require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
})


try {
  sequelize.authenticate()
  console.log('Conectamos com o Sequelize!')
} catch (error) {
  console.error('Não foi possível conectar:', error)
}

/*sequelize.sync() 
  .then(() => {
    console.log('Tabelas sincronizadas');
  })
  .catch(err => {
    console.error('Erro ao sincronizar tabelas:', err);
  });*/

module.exports = sequelize