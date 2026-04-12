import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const dataPath = path.join(__dirname, '../data/new-products.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const productsData = JSON.parse(rawData);

    const formattedProducts = productsData.map(item => ({
      name: item.title,
      image: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150',
      brand: 'Generic', 
      category: item.category ? item.category.name : 'Uncategorized',
      description: item.description || item.title,
      price: item.price,
      countInStock: 10, 
      rating: 0,
      numReviews: 0,
      user: '000000000000000000000000', // Dummy ObjectId for seeding
    }));

    await Product.insertMany(formattedProducts);
    console.log(`${formattedProducts.length} products inserted successfully!`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
