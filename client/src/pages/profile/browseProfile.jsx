import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Filter,
  Search,
  X,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../api/baseUrl";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import ProfileCard from "../../components/ProfileCard";

export default function BrowsePage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [22, 35],
    city: "",
    profession: "",
    education: "",
    religion: "",
    income: "",
  });

  const [allProfiles, setAllProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/getallUser");
      setAllProfiles(response.data);
      setFilteredProfiles(response.data); // Initial view = all users
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleLike = (profileId) => {
    console.log("Liked profile:", profileId);
  };

  const handleMessage = async (profileId) => {
    try {
      console.log("object", profileId);
      await axiosInstance.post("/message/getMessages", {
        senderId: user._id,
        receiverId: profileId,
      });
      navigate("/chat");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const applyFilters = () => {
    const filtered = allProfiles.filter((profile) => {
      const age =
        new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear();

      return (
        age >= filters.ageRange[0] &&
        age <= filters.ageRange[1] &&
        (filters.city === "" ||
          profile.city.toLowerCase().includes(filters.city.toLowerCase())) &&
        (filters.profession === "" ||
          profile.profession === filters.profession) &&
        (filters.education === "" || profile.education === filters.education) &&
        (filters.religion === "" || profile.religion === filters.religion) &&
        (filters.income === "" || profile.income === filters.income)
      );
    });

    setFilteredProfiles(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card className="sticky top-24">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Age Range */}
                  <div>
                    <Label className="mb-2 block">
                      Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}{" "}
                      years
                    </Label>
                    <Slider
                      value={filters.ageRange}
                      onValueChange={(value) =>
                        setFilters({ ...filters, ageRange: value })
                      }
                      max={60}
                      min={18}
                      step={1}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <Label>City</Label>
                    <Input
                      placeholder="Enter city"
                      value={filters.city}
                      onChange={(e) =>
                        setFilters({ ...filters, city: e.target.value })
                      }
                    />
                  </div>

                  {/* Religion */}
                  <div>
                    <Label>Religion</Label>
                    <Select
                      value={filters.religion}
                      onValueChange={(value) =>
                        setFilters({ ...filters, religion: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindu">Hindu</SelectItem>
                        <SelectItem value="muslim">Muslim</SelectItem>
                        <SelectItem value="christian">Christian</SelectItem>
                        <SelectItem value="buddhist">Buddhist</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Education */}
                  <div>
                    <Label>Education</Label>
                    <Select
                      value={filters.education}
                      onValueChange={(value) =>
                        setFilters({ ...filters, education: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="postgraduate">
                          Post Graduate
                        </SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Profession */}
                  <div>
                    <Label>Profession</Label>
                    <Select
                      value={filters.profession}
                      onValueChange={(value) =>
                        setFilters({ ...filters, profession: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select profession" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Income */}
                  <div>
                    <Label>Income</Label>
                    <Select
                      value={filters.income}
                      onValueChange={(value) =>
                        setFilters({ ...filters, income: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select income" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-3">0-3 LPA</SelectItem>
                        <SelectItem value="3-5">3-5 LPA</SelectItem>
                        <SelectItem value="5-8">5-8 LPA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full bg-pink-500 hover:bg-pink-600"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-10" />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="flex justify-between mb-4">
              <h1 className="text-2xl font-bold">Browse Profiles</h1>
              <p className="text-gray-600">
                {filteredProfiles.length} profiles found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile._id}
                  profile={profile}
                  onLike={handleLike}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
