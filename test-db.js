const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/Do_an_tot_nghiep';

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('CONNECTED TO DB');
    const db = mongoose.connection.db;
    const collection = db.collection('state');
    const doc = await collection.findOne({ command_id: 'test1111' });
    console.log('DOCUMENT test1111:');
    console.log(JSON.stringify(doc, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

run();
