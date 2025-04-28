const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db_config');

const Order = sequelize.define('order', {
  orderId: { type: DataTypes.STRING, primaryKey: true },
  customerId: { type: DataTypes.STRING },   
  regionName: { type: DataTypes.STRING }, 
  productId: { type: DataTypes.STRING },   
  dateOfSale: { type: DataTypes.DATE },
  paymentMethod: { type: DataTypes.STRING },
  totalCost: { type: DataTypes.FLOAT },
  category:{type:DataTypes.STRING}
}, {
  freezeTableName: true,
});


module.exports = Order;
