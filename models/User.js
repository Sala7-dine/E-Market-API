import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "le nom et prenom est obligatoire"],
    },
    email: {
      type: String,
      required: [true, "l'email et obligatoire est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "le password et obligatoire"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "seller"],
      default: "user",
    },
    profileImage: {
      type: String,
      default: null,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

UserSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
