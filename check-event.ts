import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Manual model definition since we can't easily import the complex app one
const EventSchema = new mongoose.Schema({
  title: String,
  eventCode: String,
  isDeleted: Boolean,
});

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

async function checkEvent() {
  const MONGO_URI = 'mongodb://localhost:27017/easevote'; // Assuming default based on context
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const code = '0B0350';
    const event = await Event.findOne({ 
      eventCode: code.toUpperCase(),
      // isDeleted: false 
    });

    if (event) {
      console.log('Event found:', JSON.stringify(event, null, 2));
    } else {
      console.log('Event NOT found with code:', code);
      const allEvents = await Event.find({}).limit(10).select('title eventCode isDeleted');
      console.log('Sample events:', JSON.stringify(allEvents, null, 2));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkEvent();
