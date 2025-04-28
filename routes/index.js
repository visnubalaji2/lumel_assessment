const express = require('express');
const router = express.Router();
const {refreshData}=require('../utils/importData')
const { Op, fn, col, literal } = require('sequelize');
const { Order } = require('../models');
router.get('/',(req,res)=>{
    res.send("success")
    refreshData()
    
})

function getDateRange(req) {
  let { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    startDate='2020-01-01';
    endDate=Date.now()
  }
  return {
    dateOfSale: {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    },
  };
}

router.get('/api/revenue/total', async (req, res) => {
  try {
    const where = getDateRange(req);
    const totalRevenue = await Order.sum('totalCost', { where });

    res.json({ totalRevenue });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/api/revenue/product', async (req, res) => {
  try {
    const where = getDateRange(req);
    const revenueByProduct = await Order.findAll({
      attributes: [
        'productId',
        [fn('SUM', col('totalCost')), 'totalRevenue'],
      ],
      where,
      group: ['productId'],
    });

    res.json(revenueByProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/api/revenue/category', async (req, res) => {
  try {
    const where = getDateRange(req);
    const revenueByCategory = await Order.findAll({
      attributes: [
        'category',
        [fn('SUM', col('totalCost')), 'totalRevenue'],
      ],
      where,
      group: ['category'],
    });

    res.json(revenueByCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/api/revenue/region', async (req, res) => {
  try {
    const where = getDateRange(req);
    const revenueByRegion = await Order.findAll({
      attributes: [
        'regionName',
        [fn('SUM', col('totalCost')), 'totalRevenue'],
      ],
      where,
      group: ['regionName'],
    });

    res.json(revenueByRegion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/api/revenue/trends', async (req, res) => {
  try {
    const where = getDateRange(req);
    const revenueTrends = await Order.findAll({
      attributes: [
        [fn('DATE_TRUNC', req.query.type, col('dateOfSale')), req.query.type],
        [fn('SUM', col('totalCost')), 'totalRevenue'],
      ],
      where,
      group: [literal(req.query.type)],
      order: [[literal(req.query.type), 'ASC']],
    });

    res.json(revenueTrends);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});






module.exports=router