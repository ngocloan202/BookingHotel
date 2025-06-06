const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Import models
require('../models/room_equipment');
const RoomEquipment = mongoose.model('RoomEquipmentModel');

const uri = 'mongodb+srv://oanhdth225720:%23oanh%23%2A%2A%2A@cluster0.ct8fl.mongodb.net/hotel';

async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Read and import room-equipment relationships
    const roomEquipmentData = JSON.parse(
      await fs.readFile(path.join(__dirname, '../DuLieuMau/room_equipment.json'), 'utf8')
    );
    await RoomEquipment.deleteMany({}); // Clear existing data
    await RoomEquipment.insertMany(roomEquipmentData);
    console.log('Room-Equipment relationships imported successfully');

    console.log('All data imported successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

importData(); 