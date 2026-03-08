const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const EmailLog = require('../models/EmailLog');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const backup = async () => {
  await connectDB();

  const backupDir = path.join(__dirname, '../backups', new Date().toISOString().replace(/:/g, '-'));
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const models = [
    { name: 'User', model: User },
    { name: 'Product', model: Product },
    { name: 'Order', model: Order },
    { name: 'Invoice', model: Invoice },
    { name: 'EmailLog', model: EmailLog },
  ];

  for (const { name, model } of models) {
    try {
      const docs = await model.find({});
      fs.writeFileSync(
        path.join(backupDir, `${name}.json`),
        JSON.stringify(docs, null, 2)
      );
      console.log(`Backed up ${name}: ${docs.length} documents`);
    } catch (err) {
      console.error(`Failed to backup ${name}:`, err);
    }
  }

  console.log(`Backup completed to ${backupDir}`);
  process.exit();
};

backup();
