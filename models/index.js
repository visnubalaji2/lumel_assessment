const {sequelize}=require('../config/db_config')

const Order = require('./order')

const Customer = require('./customer')




module.exports = {
  sequelize,
  Order,

  Customer

};
