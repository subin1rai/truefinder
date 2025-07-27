const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Existing fields
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    city: { type: String, required: true },
    agreeToTerms: { type: Boolean, required: true },
    isVerified: { type: Boolean, default: false },
    avatar: {
      type:String,
      default:"https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/557058:fe1e10e7-d931-49b4-816a-cc8517da2177/" 
    },
    preferences: [{ type: String }], // Keep this for backward compatibility
    
    // New profile fields
    height: { type: String },
    weight: { type: String },
    
    // Location
    country: { type: String },
    state: { type: String },
    
    // Education & Career
    education: { type: String },
    profession: { type: String },
    company: { type: String },
    income: { type: String },
    
    // Family & Religion
    religion: { type: String },
    caste: { type: String },
    motherTongue: { type: String },
    familyType: { type: String },
    familyStatus: { type: String },
    
    // Lifestyle
    diet: { type: String },
    smoking: { type: String },
    drinking: { type: String },
    
    // About
    bio: { type: String },
    interests: [{ type: String }],
    
    // Partner Preferences
    partnerPreferences: {
      ageMin: { type: Number, default: 22 },
      ageMax: { type: Number, default: 35 },
      height: { type: String },
      education: { type: String },
      profession: { type: String },
      income: { type: String },
      religion: { type: String },
    },
    
    // Photos
    photos: [{ type: String }], // Array of photo URLs
    
    // Profile completion status
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

