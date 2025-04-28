const fs=require('fs')
const csv = require("csvtojson");
const { Order,  Customer } = require('../models');
const {sequelize}=require('../config/db_config')
const cron = require('node-cron');
const refreshData = async () => {
    try {
     
      const csvFilePath = process.env.CSV_FILEPATH;
      csv()
      .fromFile(csvFilePath)
      .then(async (data) => {
        console.log('Data refresh started at', new Date());
            for(var i=0;i<data.length;i++){
               await populateData(data[i])
            }
            console.log('Data refresh completed at', new Date());
      })
    
    } catch (err) {
      console.error('Error during data refresh:', err);
    }
  };
  

  const upsertEntity = async (Model, where, defaults) => {
    const [entity, created] = await Model.findOrCreate({
      where,
      defaults,
    });
    return entity;
  };

  const populateData = async (data) => {
    const transaction = await sequelize.transaction();
    try {
      
      const customer = await upsertEntity(Customer, { email: data['Customer Email'] }, {
        name: data['Customer Name'],
        address: data['Customer Address'],
        customerId:data['Customer ID']
      });
     
    
      console.log(`Product "${data['Product Name']}" processed.`, customer.customerId);
      const order = await upsertEntity(Order, { orderId: data['Order ID'] }, {
        customerId: customer.customerId,
        regionName:data['Region'],
        dateOfSale: new Date(data['Date of Sale']),
        productId:data['Product ID'],
        paymentMethod: data['Payment Method'],
        totalCost:calculateTotalCost(parseInt(data['Quantity Sold']),parseFloat(data['Unit Price']),parseFloat(data['Discount']),parseFloat(data['Shipping Cost'])),
        category:data['Category']
      });
      console.log(`Order "${data['Order ID']}" processed.`);
    

      function calculateTotalCost(quantitySold, unitPrice, discount, shippingCost) {
        const discountedPrice = unitPrice * (1 - discount);
        const totalCost = (quantitySold * discountedPrice) + shippingCost;
        return totalCost;
      }
      
      await transaction.commit();
      console.log(`Transaction completed for Order ID: ${data['Order ID']}`);
    } catch (err) {

      await transaction.rollback();
      console.error('An error occurred while inserting data:', err);
    }
  };
cron.schedule('* * * * *', () => {
    
  refreshData()
  });
module.exports={refreshData}