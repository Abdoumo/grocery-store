import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

const userModel =
  mongoose.models.user || mongoose.model("user", userSchema);

const createAdmin = async () => {
  try {
    // ✅ NO username / password
    await mongoose.connect("mongodb://127.0.0.1:27017/fooddelivery");
    console.log("MongoDB Connected (no auth)");

    const adminEmail = "admin@RaniJay.com";
    const adminPassword = "RaniJay12345687";
    const adminName = "Admin User";

    const exists = await userModel.findOne({ email: adminEmail });
    if (exists) {
      console.log("⚠️ Admin user already exists");
      await mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new userModel({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    const user = await adminUser.save();

    console.log("✅ Admin account created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`User ID: ${user._id}`);

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("❌ Error creating admin account:", error);
    process.exit(1);
  }
};

createAdmin();
