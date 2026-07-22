require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const adminUser = {
  name: "Admin",
  email: "admin@cinema.com",
  password: "admin123",
  role: "admin",
};

const seedAdmin = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI belum diatur di backend/.env.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  // Cek apakah admin sudah ada
  const existingAdmin = await User.findOne({ email: adminUser.email });
  if (existingAdmin) {
    console.log(`Admin sudah ada: ${existingAdmin.email} (skip)`);
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminUser.password, salt);

  await User.create({
    name: adminUser.name,
    email: adminUser.email,
    password: hashedPassword,
    role: adminUser.role,
  });

  console.log("Seed admin berhasil!");
  console.log(`  Email    : ${adminUser.email}`);
  console.log(`  Password : ${adminUser.password}`);
  console.log(`  Role     : ${adminUser.role}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Seed admin gagal:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
