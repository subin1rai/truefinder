import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Upload, User, MapPin, Briefcase, Users, Camera, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/baseUrl"


export default function ProfileSetupPage() {
  const router = useNavigate();
  const [currentStep, setCurrentStep] = useState(1)
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
    partnerHeight: "",
    partnerEducation: "",
    partnerProfession: "",
    partnerIncome: "",
    partnerReligion: "",

    // Photos
    photos: [],
  })

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const availableInterests = [
    "Reading",
    "Travel",
    "Cooking",
    "Music",
    "Movies",
    "Sports",
    "Photography",
    "Dancing",
    "Yoga",
    "Fitness",
    "Art",
    "Technology",
    "Fashion",
    "Food",
    "Nature",
    "Adventure",
    "Volunteering",
    "Gaming",
    "Writing",
    "Meditation",
  ]
useEffect(() => {
  const id = localStorage.getItem("user");

  const findUser = async () => {
    try {
      const { data } = await axiosInstance.get(`/user/${id}`);

      // Fill only the matching fields
      setProfileData((prev) => ({
        ...prev,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "", // Format as YYYY-MM-DD
        gender: data.gender || "",
        city: data.city || "",
        // If you had height, weight, etc., include those too if present
        interests: data.interests || [],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (id) {
    findUser();
  }
}, []);


  const handleInterestToggle = (interest) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
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
    const userId = localStorage.getItem("user");
    
    if (!userId) {
      console.error("No user ID found");
      return;
    }

    // Create form data for profile update
    const profileUpdateData = {
      // Basic Info
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      dateOfBirth: profileData.dateOfBirth,
      gender: profileData.gender,
      height: profileData.height,
      weight: profileData.weight,

      // Location
      country: profileData.country,
      state: profileData.state,
      city: profileData.city,

      // Education & Career
      education: profileData.education,
      profession: profileData.profession,
      company: profileData.company,
      income: profileData.income,

      // Family & Religion
      religion: profileData.religion,
      caste: profileData.caste,
      motherTongue: profileData.motherTongue,
      familyType: profileData.familyType,
      familyStatus: profileData.familyStatus,

      // Lifestyle
      diet: profileData.diet,
      smoking: profileData.smoking,
      drinking: profileData.drinking,

      // About
      bio: profileData.bio,
      interests: profileData.interests,

      // Partner Preferences
      partnerPreferences: {
        ageMin: profileData.partnerAgeMin,
        ageMax: profileData.partnerAgeMax,
        height: profileData.partnerHeight,
        education: profileData.partnerEducation,
        profession: profileData.partnerProfession,
        income: profileData.partnerIncome,
        religion: profileData.partnerReligion,
      },

      // Photos (array of photo URLs - you'll need to handle file upload separately)
      photos: profileData.photos,
      
      // Mark profile as completed
      profileCompleted: true
    };

    console.log("Updating profile with data:", profileUpdateData);

    // Make API call to update profile
    const response = await axiosInstance.put(`/user/profile/${userId}`, profileUpdateData);

    if (response.data) {
      console.log("Profile updated successfully:", response.data);
      
      // Show success message (you can use toast notification library)
      alert("Profile updated successfully!");
      
      // Navigate to dashboard
      router("/dashboard");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    
    // Handle different error scenarios
    if (error.response) {
      // API returned an error response
      const errorMessage = error.response.data?.message || "Failed to update profile";
      alert(`Error: ${errorMessage}`);
    } else if (error.request) {
      // Network error
      alert("Network error. Please check your connection and try again.");
    } else {
      // Other error
      alert("An unexpected error occurred. Please try again.");
    }
  }
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
                    <SelectItem value="usa">United States</SelectItem>
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
                  {[...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors"
                    >
                      {profileData.photos[index] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={profileData.photos[index] || "/placeholder.svg"}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => {
                              const newPhotos = [...profileData.photos]
                              newPhotos.splice(index, 1)
                              setProfileData({ ...profileData, photos: newPhotos })
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Upload Photo</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                        setProfileData({ ...profileData, partnerAgeMin: Number.parseInt(e.target.value) })
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
                        setProfileData({ ...profileData, partnerAgeMax: Number.parseInt(e.target.value) })
                      }
                    />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
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
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button onClick={handleSubmit} className="bg-pink-500 hover:bg-pink-600">
                Complete Profile
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-pink-500 hover:bg-pink-600">
                Next
              </Button>
            )}
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
