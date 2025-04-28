const {DataTypes}=require('sequelize')
const {sequelize}=require('../config/db_config')
    const Customer = sequelize.define('customer', {
      customerId: { type: DataTypes.STRING},
      name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
    
    },{
        freezeTableName: true,   

      });
  

    module.exports=Customer