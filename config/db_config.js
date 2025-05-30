const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, 
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD, {
          host: process.env.DB_HOST,
          dialect: process.env.DB_DIALECT    , pool: {
            max: 5,      
            min: 0,       
            acquire: 30000, 
            idle: 10000    
          },
          dialectOptions: {
            connectTimeout: 60000,  
          }            
});

module.exports={sequelize}