require('dotenv').config();

const seed = async () => {
  const { dbConnect, dbDisconnect } = require("../config");
  const { Seeder } = require("./Seeder");
  
  await dbConnect();
  const seeder = new Seeder();
  await seeder.seedAll();
  await dbDisconnect();
}

seed();
