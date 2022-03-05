const { Sequelize } = require('sequelize')


const sequelize = new Sequelize('JSRT', 'postgres', 'showmeall', {
  host:'localhost',
  dialect: 'postgres'
})

try {

  sequelize.authenticate()
  console.log('Connected to postgres!')

}catch(err){
  console.log('Cannot connect:', error)

}


module.exports = sequelize