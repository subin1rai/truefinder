const upload = require("../middleware/uploadMiddleWare.js");
const Conversation = require("../models/Conversation.js");
const User = require("../models/user.js");
const fs = require('fs');
// GET all users

exports.getAllUsers = async (req, res) => {
  try {
    const { currentUserId } = req.body;    
    // Find all conversations where the current user is a member
    const conversations = await Conversation.find({
      members: currentUserId
    }).populate({
      path: 'members',
      select: 'firstName lastName email avatar isVerified online lastSeen createdAt'
    });
    
    if (conversations.length === 0) {
      return res.status(404).json({ message: "No conversations found" });
    }

    // Extract all users from conversations and exclude current user
    const allUsers = [];
    conversations.forEach(conversation => {
      conversation.members.forEach(member => {
        // Only add if it's not the current user and not already in the array
        if (member._id.toString() !== currentUserId && 
            !allUsers.find(user => user._id.toString() === member._id.toString())) {
          allUsers.push(member);
        }
      });
    });

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "No other users found in conversations" });
    }

    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    console.log("hi");
    const id = req.params.id;
    console.log(id);
    const user = await User.findById(id);
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getallUser = async (req, res) => {
  try {
    const user = await User.find();
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// exports.updateProfile = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const updateData = req.body;

//     console.log(userId,updateData);
//     // Validate user ID
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // Check if user exists
//     const existingUser = await User.findById(userId);
//     if (!existingUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Remove sensitive fields that shouldn't be updated through this endpoint
//     const { password, email, agreeToTerms, isVerified, ...safeUpdateData } =
//       updateData;

//     // Update user profile
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         ...safeUpdateData,
//         updatedAt: new Date(),
//       },
//       {
//         new: true, // Return updated document
//         runValidators: true, // Run schema validations
//       }
//     ).select("-password"); // Exclude password from response

//     if (!updatedUser) {
//       return res.status(400).json({ message: "Failed to update profile" });
//     }

//     res.status(200).json({
//       message: "Profile updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Error updating profile:", error);

//     // Handle validation errors
//     if (error.name === "ValidationError") {
//       return res.status(400).json({
//         message: "Validation error",
//         errors: Object.values(error.errors).map((err) => err.message),
//       });
//     }

//     // Handle cast errors (invalid ObjectId)
//     if (error.name === "CastError") {
//       return res.status(400).json({ message: "Invalid user ID format" });
//     }

//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };


exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle file uploads with multer
    const uploadMiddleware = upload.array('photos', 6);

    uploadMiddleware(req, res, async (uploadError) => {
      if (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(400).json({ 
          message: uploadError.message || 'File upload failed' 
        });
      }

      try {
        const updateData = req.body;
        console.log('UserId:', userId);
        console.log('Files uploaded:', req.files?.length || 0);

        // Remove sensitive fields
        const { password, email, agreeToTerms, isVerified, ...safeUpdateData } = updateData;

        // Handle photo URLs
        let photoUrls = [];

        // Add new uploaded photos
        if (req.files && req.files.length > 0) {
          photoUrls = req.files.map(file => `/images/profiles/${file.filename}`);
        }

        // Handle existing photos
        if (safeUpdateData.existingPhotos) {
          try {
            const existingPhotos = typeof safeUpdateData.existingPhotos === 'string' 
              ? JSON.parse(safeUpdateData.existingPhotos) 
              : safeUpdateData.existingPhotos;
            
            if (Array.isArray(existingPhotos)) {
              photoUrls = [...existingPhotos, ...photoUrls];
            }
          } catch (parseError) {
            console.error('Error parsing existing photos:', parseError);
          }
        }

        // Limit to 6 photos max
        if (photoUrls.length > 6) {
          photoUrls = photoUrls.slice(0, 6);
        }

        safeUpdateData.photos = photoUrls;

        // Parse JSON fields
        if (safeUpdateData.interests && typeof safeUpdateData.interests === 'string') {
          safeUpdateData.interests = JSON.parse(safeUpdateData.interests);
        }

        if (safeUpdateData.partnerPreferences && typeof safeUpdateData.partnerPreferences === 'string') {
          safeUpdateData.partnerPreferences = JSON.parse(safeUpdateData.partnerPreferences);
        }

        // Parse numeric fields
        if (safeUpdateData.partnerAgeMin) {
          safeUpdateData.partnerAgeMin = parseInt(safeUpdateData.partnerAgeMin, 10);
        }
        if (safeUpdateData.partnerAgeMax) {
          safeUpdateData.partnerAgeMax = parseInt(safeUpdateData.partnerAgeMax, 10);
        }

        // Clean up temporary fields
        delete safeUpdateData.existingPhotos;

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            ...safeUpdateData,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

        if (!updatedUser) {
          // Clean up uploaded files if update fails
          if (req.files) {
            req.files.forEach(file => {
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }
            });
          }
          return res.status(400).json({ message: "Failed to update profile" });
        }

        res.status(200).json({
          message: "Profile updated successfully",
          user: updatedUser,
          uploadedPhotos: photoUrls.length
        });

      } catch (error) {
        console.error("Error updating profile:", error);

        // Clean up uploaded files on error
        if (req.files) {
          req.files.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }

        if (error.name === "ValidationError") {
          return res.status(400).json({
            message: "Validation error",
            errors: Object.values(error.errors).map((err) => err.message),
          });
        }

        if (error.name === "CastError") {
          return res.status(400).json({ message: "Invalid user ID format" });
        }

        res.status(500).json({
          message: "Internal server error",
          error: error.message,
        });
      }
    });

  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};