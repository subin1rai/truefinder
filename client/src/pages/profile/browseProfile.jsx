import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Heart, MapPin, Briefcase, GraduationCap, Star, Filter, Search, X, MessageCircle, Settings } from "lucide-react"
import {Link} from "react-router-dom";
export default function BrowsePage() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    ageRange: [22, 35],
    city: "",
    profession: "",
    education: "",
    religion: "",
    income: "",
    height: "",
  })

  const [profiles] = useState([
    {
      id: "1",
      name: "Priya Sharma",
      age: 26,
      city: "Mumbai",
      state: "Maharashtra",
      profession: "Software Engineer",
      education: "B.Tech Computer Science",
      religion: "Hindu",
      caste: "Brahmin",
      height: "5'4\"",
      photos: ["/placeholder.svg?height=400&width=300"],
      bio: "Looking for a life partner who shares similar values and interests. I enjoy reading, traveling, and spending time with family.",
      interests: ["Reading", "Travel", "Cooking", "Music", "Photography"],
      verified: true,
      lastActive: "2 hours ago",
      matchPercentage: 92,
      income: "8-12 LPA",
      familyType: "Nuclear",
      maritalStatus: "Never Married",
    },
    {
      id: "2",
      name: "Anjali Patel",
      age: 24,
      city: "Delhi",
      state: "Delhi",
      profession: "Doctor",
      education: "MBBS",
      religion: "Hindu",
      caste: "Patel",
      height: "5'2\"",
      photos: ["/placeholder.svg?height=400&width=300"],
      bio: "Family-oriented person looking for someone who values relationships and has a good sense of humor.",
      interests: ["Yoga", "Movies", "Dancing", "Volunteering", "Cooking"],
      verified: true,
      lastActive: "1 day ago",
      matchPercentage: 88,
      income: "6-10 LPA",
      familyType: "Joint",
      maritalStatus: "Never Married",
    },
    {
      id: "3",
      name: "Meera Singh",
      age: 27,
      city: "Bangalore",
      state: "Karnataka",
      profession: "Marketing Manager",
      education: "MBA Marketing",
      religion: "Sikh",
      caste: "Singh",
      height: "5'6\"",
      photos: ["/placeholder.svg?height=400&width=300"],
      bio: "Adventurous spirit seeking a partner for life's journey. Love exploring new places and trying new cuisines.",
      interests: ["Hiking", "Photography", "Food", "Art", "Travel"],
      verified: true,
      lastActive: "3 hours ago",
      matchPercentage: 85,
      income: "10-15 LPA",
      familyType: "Nuclear",
      maritalStatus: "Never Married",
    },
    {
      id: "4",
      name: "Kavya Reddy",
      age: 25,
      city: "Hyderabad",
      state: "Telangana",
      profession: "Teacher",
      education: "M.Ed",
      religion: "Hindu",
      caste: "Reddy",
      height: "5'3\"",
      photos: ["/placeholder.svg?height=400&width=300"],
      bio: "Passionate about education and making a difference. Looking for someone who appreciates simple joys in life.",
      interests: ["Teaching", "Reading", "Gardening", "Classical Music"],
      verified: true,
      lastActive: "5 hours ago",
      matchPercentage: 82,
      income: "4-6 LPA",
      familyType: "Joint",
      maritalStatus: "Never Married",
    },
    {
      id: "5",
      name: "Riya Gupta",
      age: 28,
      city: "Pune",
      state: "Maharashtra",
      profession: "Chartered Accountant",
      education: "CA",
      religion: "Hindu",
      caste: "Gupta",
      height: "5'5\"",
      photos: ["/placeholder.svg?height=400&width=300"],
      bio: "Detail-oriented professional who believes in work-life balance. Family is very important to me.",
      interests: ["Finance", "Travel", "Fitness", "Movies", "Shopping"],
      verified: true,
      lastActive: "1 day ago",
      matchPercentage: 79,
      income: "12-18 LPA",
      familyType: "Nuclear",
      maritalStatus: "Never Married",
    },
    {
      id: "6",
      name: "Sneha Jain",
      age: 23,
      city: "Jaipur",
      state: "Rajasthan",
      profession: "Graphic Designer",
      education: "B.Des",
      religion: "Jain",
      caste: "Jain",
      height: "5'1\"",
      photos: ["/placeholder.svg?height=400&width=300"],
      bio: "Creative soul with a passion for art and design. Looking for someone who appreciates creativity and culture.",
      interests: ["Art", "Design", "Photography", "Culture", "Fashion"],
      verified: false,
      lastActive: "2 days ago",
      matchPercentage: 76,
      income: "3-5 LPA",
      familyType: "Joint",
      maritalStatus: "Never Married",
    },
  ])

  const handleLike = (profileId) => {
    console.log("Liked profile:", profileId)
  }

  const handlePass = (profileId) => {
    console.log("Passed on profile:", profileId)
  }

  const handleMessage = (profileId) => {
    console.log("Message profile:", profileId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">BestMate</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-pink-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/browse" className="text-pink-500 font-medium">
              Browse
            </Link>
            <Link href="/matches" className="text-gray-600 hover:text-pink-500 transition-colors">
              Matches
            </Link>
            <Link href="/messages" className="text-gray-600 hover:text-pink-500 transition-colors">
              Messages
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="sticky top-24">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="lg:hidden">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
                    </Label>
                    <Slider
                      value={filters.ageRange}
                      onValueChange={(value) => setFilters({ ...filters, ageRange: value })}
                      max={50}
                      min={18}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium mb-2 block">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    />
                  </div>

                  {/* Religion */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Religion</Label>
                    <Select
                      value={filters.religion}
                      onValueChange={(value) => setFilters({ ...filters, religion: value })}
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

                  {/* Education */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Education</Label>
                    <Select
                      value={filters.education}
                      onValueChange={(value) => setFilters({ ...filters, education: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="postgraduate">Post Graduate</SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Profession */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Profession</Label>
                    <Select
                      value={filters.profession}
                      onValueChange={(value) => setFilters({ ...filters, profession: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select profession" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Income */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Annual Income</Label>
                    <Select value={filters.income} onValueChange={(value) => setFilters({ ...filters, income: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-3">0-3 LPA</SelectItem>
                        <SelectItem value="3-5">3-5 LPA</SelectItem>
                        <SelectItem value="5-8">5-8 LPA</SelectItem>
                        <SelectItem value="8-12">8-12 LPA</SelectItem>
                        <SelectItem value="12-18">12-18 LPA</SelectItem>
                        <SelectItem value="18+">18+ LPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-pink-500 hover:bg-pink-600">Apply Filters</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name, profession, city..." className="pl-10" />
              </div>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Browse Profiles</h1>
              <p className="text-gray-600">{profiles.length} profiles found</p>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={profile.photos[0] || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Badge className="bg-green-500 text-white">{profile.matchPercentage}% Match</Badge>
                      {profile.verified && (
                        <Badge className="bg-blue-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                        <h3 className="text-xl font-semibold">{profile.name}</h3>
                        <p className="text-sm opacity-90">
                          {profile.age} years • {profile.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {profile.profession}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {profile.education}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {profile.city}, {profile.state}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                      <div>Height: {profile.height}</div>
                      <div>Income: {profile.income}</div>
                      <div>Religion: {profile.religion}</div>
                      <div>Family: {profile.familyType}</div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{profile.bio}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {profile.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {profile.interests.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profile.interests.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-gray-500">Active {profile.lastActive}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handlePass(profile.id)} className="flex-1">
                        <X className="h-4 w-4 mr-1" />
                        Pass
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleMessage(profile.id)} className="flex-1">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        className="bg-pink-500 hover:bg-pink-600 flex-1"
                        onClick={() => handleLike(profile.id)}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Profiles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
