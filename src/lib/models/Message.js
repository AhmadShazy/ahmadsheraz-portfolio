import mongoose from "mongoose";

// A contact-form submission. Stored alongside the Resend email so there's a
// durable record even if delivery ever fails, and so the admin inbox (Phase 3)
// has something to read.
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  receivedAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

// Newest first — the order the inbox reads them in
MessageSchema.index({ receivedAt: -1 });

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
