require('dotenv').config();
const express=require('express')
const routes=require('./routes/index')
const app=express()
const { sequelize } = require('./models/index'); 
const port=3000 || process.env.port

app.use('/', routes)


sequelize.sync({ force: false,freezeTableName: true  })   // force: false -> won't drop tables
  .then(() => {
    console.log('✅ Database synced successfully!');
    app.listen(3000, () => {
      console.log('🚀 Server running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error('❌ Failed to sync database:', err);
  });