import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Upload, User, MapPin, Briefcase, Users, Camera, X, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/baseUrl"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

export default function ProfileSetupPage() {
  const router = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileData, setProfileData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",

    // Location
    country: "",
    state: "",
    city: "",

    // Education & Career
    education: "",
    profession: "",
    company: "",
    income: "",

    // Family & Religion
    religion: "",
    caste: "",
    motherTongue: "",
    familyType: "",
    familyStatus: "",

    // Lifestyle
    diet: "",
    smoking: "",
    drinking: "",

    // About
    bio: "",
    interests: [],

    // Partner Preferences
    partnerAgeMin: 22,
    partnerAgeMax: 35,
    partnerHeight: "any",
    partnerEducation: "any",
    partnerProfession: "",
    partnerIncome: "any",
    partnerReligion: "any",

    // Photos - store File objects and existing URLs
    photos: [], // Will contain mix of File objects (new) and URL strings (existing)
    existingPhotos: [], // Track existing photo URLs separately
  })

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const availableInterests = [
    "Reading", "Travel", "Cooking", "Music", "Movies", "Sports",
    "Photography", "Dancing", "Yoga", "Fitness", "Art", "Technology",
    "Fashion", "Food", "Nature", "Adventure", "Volunteering",
    "Gaming", "Writing", "Meditation",
  ]

  useEffect(() => {
    // Add null/undefined check for user
    if (!user || !user._id) {
      console.warn("User not found, redirecting to login...");
      router("/auth");
      return;
    }

    const id = user._id;
    console.log("id", id)
    
    const findUser = async () => {
      try {
        const { data } = await axiosInstance.get(`/user/${id}`);
        console.log("clef", data)
        
        // Fill only the matching fields with null/undefined checks
        setProfileData((prev) => ({
          ...prev,
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          dateOfBirth: data?.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
          gender: data?.gender || "",
          height: data?.height || "",
          weight: data?.weight || "",
          country: data?.country || "",
          state: data?.state || "",
          city: data?.city || "",
          education: data?.education || "",
          profession: data?.profession || "",
          company: data?.company || "",
          income: data?.income || "",
          religion: data?.religion || "",
          caste: data?.caste || "",
          motherTongue: data?.motherTongue || "",
          familyType: data?.familyType || "",
          familyStatus: data?.familyStatus || "",
          diet: data?.diet || "",
          smoking: data?.smoking || "",
          drinking: data?.drinking || "",
          bio: data?.bio || "",
          interests: Array.isArray(data?.interests) ? data.interests : [],
          partnerAgeMin: data?.partnerPreferences?.ageMin || 22,
          partnerAgeMax: data?.partnerPreferences?.ageMax || 35,
          partnerHeight: data?.partnerPreferences?.height || "any",
          partnerEducation: data?.partnerPreferences?.education || "any",
          partnerProfession: data?.partnerPreferences?.profession || "",
          partnerIncome: data?.partnerPreferences?.income || "any",
          partnerReligion: data?.partnerPreferences?.religion || "any",
          // Handle existing photos with null check
          existingPhotos: Array.isArray(data?.photos) ? data.photos : [],
          photos: [], // Reset photos array for new uploads
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
        // Don't redirect here, let user continue with empty form
      }
    };

    findUser();
  }, [user, router]);

  // Handle file selection (not upload yet)
  const handlePhotoSelect = (file, index) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, JPG, WebP)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    // Update photos array
    const newPhotos = [...profileData.photos];
    
    // If there's an existing photo at this index, replace it
    if (newPhotos[index]) {
      // Revoke old preview URL if it exists
      if (newPhotos[index].preview) {
        URL.revokeObjectURL(newPhotos[index].preview);
      }
    }

    newPhotos[index] = {
      file: file,
      preview: previewUrl,
      isNew: true
    };
    
    setProfileData(prev => ({
      ...prev,
      photos: newPhotos
    }));
  };

  // Handle photo removal
  const handlePhotoRemove = (index) => {
    const newPhotos = [...profileData.photos];
    
    // Revoke preview URL if it exists
    if (newPhotos[index] && newPhotos[index].preview) {
      URL.revokeObjectURL(newPhotos[index].preview);
    }
    
    // Remove from array
    newPhotos.splice(index, 1);
    
    setProfileData(prev => ({
      ...prev,
      photos: newPhotos
    }));
  };

  // Handle existing photo removal
  const handleExistingPhotoRemove = (index) => {
    const newExistingPhotos = [...profileData.existingPhotos];
    newExistingPhotos.splice(index, 1);
    
    setProfileData(prev => ({
      ...prev,
      existingPhotos: newExistingPhotos
    }));
  };

  const handleInterestToggle = (interest) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : prev.interests.length < 10 
          ? [...prev.interests, interest]
          : prev.interests // Don't add if already at limit
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Add null check for user
      if (!user || !user._id) {
        toast.error("User not found. Please login again.");
        router("/auth");
        return;
      }

      const userId = user._id;

      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add basic profile data with fallback values
      formData.append('firstName', profileData.firstName || '');
      formData.append('lastName', profileData.lastName || '');
      formData.append('dateOfBirth', profileData.dateOfBirth || '');
      formData.append('gender', profileData.gender || '');
      formData.append('height', profileData.height || '');
      formData.append('weight', profileData.weight || '');
      formData.append('country', profileData.country || '');
      formData.append('state', profileData.state || '');
      formData.append('city', profileData.city || '');
      formData.append('education', profileData.education || '');
      formData.append('profession', profileData.profession || '');
      formData.append('company', profileData.company || '');
      formData.append('income', profileData.income || '');
      formData.append('religion', profileData.religion || '');
      formData.append('caste', profileData.caste || '');
      formData.append('motherTongue', profileData.motherTongue || '');
      formData.append('familyType', profileData.familyType || '');
      formData.append('familyStatus', profileData.familyStatus || '');
      formData.append('diet', profileData.diet || '');
      formData.append('smoking', profileData.smoking || '');
      formData.append('drinking', profileData.drinking || '');
      formData.append('bio', profileData.bio || '');

      // Add interests as JSON string
      formData.append('interests', JSON.stringify(profileData.interests || []));

      // Add partner preferences as JSON string
      const partnerPreferences = {
        ageMin: profileData.partnerAgeMin || 22,
        ageMax: profileData.partnerAgeMax || 35,
        height: profileData.partnerHeight || "any",
        education: profileData.partnerEducation || "any",
        profession: profileData.partnerProfession || "",
        income: profileData.partnerIncome || "any",
        religion: profileData.partnerReligion || "any",
      };
      formData.append('partnerPreferences', JSON.stringify(partnerPreferences));

      // Add existing photos as JSON string
      formData.append('existingPhotos', JSON.stringify(profileData.existingPhotos || []));

      // Add new photo files
      if (Array.isArray(profileData.photos)) {
        profileData.photos.forEach((photo, index) => {
          if (photo && photo.file) {
            formData.append('photos', photo.file);
          }
        });
      }

      // Mark profile as completed
      formData.append('profileCompleted', 'true');

      console.log("Updating profile with FormData");

      // Make API call to update profile
      const response = await axiosInstance.put(`/user/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        console.log("Profile updated successfully:", response.data);
        toast.success("Profile Updated Successfully!");
        
        // Clean up preview URLs
        if (Array.isArray(profileData.photos)) {
          profileData.photos.forEach(photo => {
            if (photo && photo.preview) {
              URL.revokeObjectURL(photo.preview);
            }
          });
        }
        
        router("/dashboard");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || "Failed to update profile";
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get total photo count (existing + new)
  const getTotalPhotoCount = () => {
    const existingCount = Array.isArray(profileData.existingPhotos) ? profileData.existingPhotos.length : 0;
    const newCount = Array.isArray(profileData.photos) ? profileData.photos.filter(p => p && p.file).length : 0;
    return existingCount + newCount;
  };

  // Get photo for display at specific index
  const getPhotoAtIndex = (index) => {
    const existingPhotos = Array.isArray(profileData.existingPhotos) ? profileData.existingPhotos : [];
    const totalExisting = existingPhotos.length;
    
    if (index < totalExisting) {
      // Show existing photo
      return {
        url: existingPhotos[index],
        isExisting: true,
        existingIndex: index
      };
    } else {
      // Show new photo
      const newPhotoIndex = index - totalExisting;
      const photos = Array.isArray(profileData.photos) ? profileData.photos : [];
      const newPhoto = photos[newPhotoIndex];
      if (newPhoto && newPhoto.file) {
        return {
          url: newPhoto.preview,
          isExisting: false,
          newIndex: newPhotoIndex
        };
      }
    }
    return null;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Basic Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={profileData.gender}
                  onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Select
                  value={profileData.height}
                  onValueChange={(value) => setProfileData({ ...profileData, height: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select height" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"4'10\""}>{"4'10\""}</SelectItem>
                    <SelectItem value={"4'11\""}>{"4'11\""}</SelectItem>
                    <SelectItem value={"5'0\""}>{"5'0\""}</SelectItem>
                    <SelectItem value={"5'1\""}>{"5'1\""}</SelectItem>
                    <SelectItem value={"5'2\""}>{"5'2\""}</SelectItem>
                    <SelectItem value={"5'3\""}>{"5'3\""}</SelectItem>
                    <SelectItem value={"5'4\""}>{"5'4\""}</SelectItem>
                    <SelectItem value={"5'5\""}>{"5'5\""}</SelectItem>
                    <SelectItem value={"5'6\""}>{"5'6\""}</SelectItem>
                    <SelectItem value={"5'7\""}>{"5'7\""}</SelectItem>
                    <SelectItem value={"5'8\""}>{"5'8\""}</SelectItem>
                    <SelectItem value={"5'9\""}>{"5'9\""}</SelectItem>
                    <SelectItem value={"5'10\""}>{"5'10\""}</SelectItem>
                    <SelectItem value={"5'11\""}>{"5'11\""}</SelectItem>
                    <SelectItem value={"6'0\""}>{"6'0\""}</SelectItem>
                    <SelectItem value={"6'1\""}>{"6'1\""}</SelectItem>
                    <SelectItem value={"6'2\""}>{"6'2\""}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight in kg"
                  value={profileData.weight}
                  onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Location</h2>
              <p className="text-gray-600">Where are you located?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={profileData.country}
                  onValueChange={(value) => setProfileData({ ...profileData, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">Nepal</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="Enter your state"
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Education & Career</h2>
              <p className="text-gray-600">Tell us about your professional background</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="education">Highest Education</Label>
                <Select
                  value={profileData.education}
                  onValueChange={(value) => setProfileData({ ...profileData, education: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="professional">Professional Degree</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  placeholder="e.g., Software Engineer, Doctor, Teacher"
                  value={profileData.profession}
                  onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  placeholder="Where do you work?"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="income">Annual Income</Label>
                <Select
                  value={profileData.income}
                  onValueChange={(value) => setProfileData({ ...profileData, income: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-3">0-3 LPA</SelectItem>
                    <SelectItem value="3-5">3-5 LPA</SelectItem>
                    <SelectItem value="5-8">5-8 LPA</SelectItem>
                    <SelectItem value="8-12">8-12 LPA</SelectItem>
                    <SelectItem value="12-18">12-18 LPA</SelectItem>
                    <SelectItem value="18-25">18-25 LPA</SelectItem>
                    <SelectItem value="25+">25+ LPA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Family & Religion</h2>
              <p className="text-gray-600">Share your family and religious background</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="religion">Religion</Label>
                <Select
                  value={profileData.religion}
                  onValueChange={(value) => setProfileData({ ...profileData, religion: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="christian">Christian</SelectItem>
                    <SelectItem value="sikh">Sikh</SelectItem>
                    <SelectItem value="jain">Jain</SelectItem>
                    <SelectItem value="buddhist">Buddhist</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="caste">Caste/Community</Label>
                <Input
                  id="caste"
                  placeholder="Enter your caste/community"
                  value={profileData.caste}
                  onChange={(e) => setProfileData({ ...profileData, caste: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="motherTongue">Mother Tongue</Label>
                <Input
                  id="motherTongue"
                  placeholder="e.g., Hindi, English, Tamil"
                  value={profileData.motherTongue}
                  onChange={(e) => setProfileData({ ...profileData, motherTongue: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="familyType">Family Type</Label>
                <Select
                  value={profileData.familyType}
                  onValueChange={(value) => setProfileData({ ...profileData, familyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select family type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuclear">Nuclear Family</SelectItem>
                    <SelectItem value="joint">Joint Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="familyStatus">Family Status</Label>
                <Select
                  value={profileData.familyStatus}
                  onValueChange={(value) => setProfileData({ ...profileData, familyStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select family status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="middle-class">Middle Class</SelectItem>
                    <SelectItem value="upper-middle-class">Upper Middle Class</SelectItem>
                    <SelectItem value="rich">Rich</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">About You</h2>
              <p className="text-gray-600">Tell us more about yourself and your interests</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Write a brief description about yourself, your values, and what you're looking for in a partner..."
                  className="min-h-[120px]"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              </div>

              <div>
                <Label>Interests & Hobbies</Label>
                <p className="text-sm text-gray-600 mb-3">Select your interests (choose up to 10)</p>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={profileData.interests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        profileData.interests.includes(interest) ? "bg-pink-500 hover:bg-pink-600" : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                      {profileData.interests.includes(interest) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Selected: {profileData.interests.length}/10</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="diet">Diet</Label>
                  <Select
                    value={profileData.diet}
                    onValueChange={(value) => setProfileData({ ...profileData, diet: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="smoking">Smoking</Label>
                  <Select
                    value={profileData.smoking}
                    onValueChange={(value) => setProfileData({ ...profileData, smoking: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Smoking habits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="occasionally">Occasionally</SelectItem>
                      <SelectItem value="regularly">Regularly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="drinking">Drinking</Label>
                  <Select
                    value={profileData.drinking}
                    onValueChange={(value) => setProfileData({ ...profileData, drinking: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Drinking habits" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="socially">Socially</SelectItem>
                      <SelectItem value="regularly">Regularly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Camera className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Photos & Partner Preferences</h2>
              <p className="text-gray-600">Add photos and set your partner preferences</p>
            </div>

            <div className="space-y-6">
              {/* Photo Upload */}
              <div>
                <Label>Profile Photos</Label>
                <p className="text-sm text-gray-600 mb-3">Upload at least 3 photos (max 6)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, index) => {
                    const photo = getPhotoAtIndex(index);
                    
                    return (
                      <div
                        key={index}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors relative"
                      >
                        {photo ? (
                          <div className="relative w-full h-full">
                            <img
                              src={photo.url}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 h-6 w-6 p-0"
                              onClick={() => {
                                if (photo.isExisting) {
                                  handleExistingPhotoRemove(photo.existingIndex);
                                } else {
                                  handlePhotoRemove(photo.newIndex);
                                }
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const newPhotoIndex = profileData.photos.length;
                                  handlePhotoSelect(file, newPhotoIndex);
                                }
                              }}
                            />
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Upload Photo</p>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Uploaded: {getTotalPhotoCount()}/6 • 
                  Supported formats: JPEG, PNG, JPG, WebP • Max size: 5MB
                </p>
              </div>

              {/* Partner Preferences */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Partner Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partnerAgeMin">Age Range (Min)</Label>
                    <Input
                      id="partnerAgeMin"
                      type="number"
                      min="18"
                      max="60"
                      value={profileData.partnerAgeMin}
                      onChange={(e) =>
                        setProfileData({ ...profileData, partnerAgeMin: Number.parseInt(e.target.value) || 22 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerAgeMax">Age Range (Max)</Label>
                    <Input
                      id="partnerAgeMax"
                      type="number"
                      min="18"
                      max="60"
                      value={profileData.partnerAgeMax}
                      onChange={(e) =>
                        setProfileData({ ...profileData, partnerAgeMax: Number.parseInt(e.target.value) || 35 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerHeight">Preferred Height</Label>
                    <Select
                      value={profileData.partnerHeight}
                      onValueChange={(value) => setProfileData({ ...profileData, partnerHeight: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any height" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value={"5'0\""}>{"5'0\" and above"}</SelectItem>
                        <SelectItem value={"5'3\""}>{"5'3\" and above"}</SelectItem>
                        <SelectItem value={"5'6\""}>{"5'6\" and above"}</SelectItem>
                        <SelectItem value={"5'9\""}>{"5'9\" and above"}</SelectItem>
                        <SelectItem value={"6'0\""}>{"6'0\" and above"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="partnerEducation">Preferred Education</Label>
                    <Select
                      value={profileData.partnerEducation}
                      onValueChange={(value) => setProfileData({ ...profileData, partnerEducation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="bachelors">Bachelor's or higher</SelectItem>
                        <SelectItem value="masters">Master's or higher</SelectItem>
                        <SelectItem value="professional">Professional degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="partnerProfession">Preferred Profession</Label>
                    <Input
                      id="partnerProfession"
                      placeholder="Any profession"
                      value={profileData.partnerProfession}
                      onChange={(e) => setProfileData({ ...profileData, partnerProfession: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerIncome">Preferred Income</Label>
                    <Select
                      value={profileData.partnerIncome}
                      onValueChange={(value) => setProfileData({ ...profileData, partnerIncome: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any income" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="3-5">3-5 LPA or higher</SelectItem>
                        <SelectItem value="5-8">5-8 LPA or higher</SelectItem>
                        <SelectItem value="8-12">8-12 LPA or higher</SelectItem>
                        <SelectItem value="12-18">12-18 LPA or higher</SelectItem>
                        <SelectItem value="18-25">18-25 LPA or higher</SelectItem>
                        <SelectItem value="25+">25+ LPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="partnerReligion">Preferred Religion</Label>
                    <Select
                      value={profileData.partnerReligion}
                      onValueChange={(value) => setProfileData({ ...profileData, partnerReligion: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any religion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="same">Same as mine</SelectItem>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="muslim">Muslim</SelectItem>
                        <SelectItem value="christian">Christian</SelectItem>
                        <SelectItem value="sikh">Sikh</SelectItem>
                        <SelectItem value="jain">Jain</SelectItem>
                        <SelectItem value="buddhist">Buddhist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Cleanup effect for preview URLs
  useEffect(() => {
    return () => {
      // Clean up preview URLs when component unmounts
      if (Array.isArray(profileData.photos)) {
        profileData.photos.forEach(photo => {
          if (photo && photo.preview) {
            URL.revokeObjectURL(photo.preview);
          }
        });
      }
    };
  }, [profileData.photos]);

  // Don't render if user is not available
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pink-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">BestMate</span>
          </Link>
          <div className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Setup Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Main Card */}
          <Card>
            <CardContent className="p-8">{renderStep()}</CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 1 || isSubmitting}
            >
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button 
                onClick={handleSubmit} 
                className="bg-pink-500 hover:bg-pink-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                className="bg-pink-500 hover:bg-pink-600"
                disabled={isSubmitting}
              >
                Next
              </Button>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              onClick={() => router("/dashboard")}
              disabled={isSubmitting}
            >
              Skip for now  
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}