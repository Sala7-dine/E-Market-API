import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jti: { type: String, required: true, unique: true }, // id du refresh token (uuid)
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
  replacedByToken: { type: String }, // jti of replacement
});

RefreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt;
});

RefreshTokenSchema.virtual('isActive').get(function () {
  return !this.revoked && !this.isExpired;
});

export default mongoose.model('RefreshToken', RefreshTokenSchema);
