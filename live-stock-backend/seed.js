import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Branch from './src/models/Branch.js';
import Batch from './src/models/Batch.js';
import Allocation from './src/models/Allocation.js';
import Slaughter from './src/models/slaughterModel.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional, but good for a fresh start)
    // await Branch.deleteMany({});
    // await Batch.deleteMany({});
    // await Allocation.deleteMany({});
    // await Slaughter.deleteMany({});

    console.log('Clearing existing data is skipped for safety. Adding new entries...');

    // 1. Create Branches
    const branches = await Branch.insertMany([
      { name: 'Karachi Central', location: 'Gulshan-e-Iqbal', capacity: 1000 },
      { name: 'Lahore North', location: 'DHA Phase 6', capacity: 800 },
      { name: 'Islamabad East', location: 'E-11', capacity: 600 },
    ]);
    console.log('Branches seeded.');

    // 2. Create Batches
    const batches = await Batch.insertMany([
      { 
        BatchNum: 'BT-001', 
        TotalAnimals: 500, 
        remainingAnimals: 150, 
        Category: 'cow', 
        costPrice: 85000, 
        supplier: 'Al-Madina Farms' 
      },
      { 
        BatchNum: 'BT-002', 
        TotalAnimals: 300, 
        remainingAnimals: 100, 
        Category: 'goat', 
        costPrice: 35000, 
        supplier: 'Rural Traders' 
      },
    ]);
    console.log('Batches seeded.');

    // 3. Create Allocations
    const allocations = await Allocation.insertMany([
      { 
        batchId: batches[0]._id, 
        branchId: branches[0]._id, 
        quantity: 100, 
        receivedAnimals: 100, 
        status: 'Received' 
      },
      { 
        batchId: batches[0]._id, 
        branchId: branches[1]._id, 
        quantity: 50, 
        receivedAnimals: 50, 
        status: 'Received' 
      },
      { 
        batchId: batches[1]._id, 
        branchId: branches[0]._id, 
        quantity: 80, 
        receivedAnimals: 80, 
        status: 'Received' 
      },
    ]);
    console.log('Allocations seeded.');

    // 4. Create Slaughter Records
    const slaughters = await Slaughter.insertMany([
      { branchId: branches[0]._id, date: new Date(), count: 45 },
      { branchId: branches[0]._id, date: new Date(Date.now() - 86400000), count: 32 },
      { branchId: branches[1]._id, date: new Date(), count: 28 },
      { branchId: branches[2]._id, date: new Date(), count: 15 },
    ]);
    console.log('Slaughter records seeded.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
