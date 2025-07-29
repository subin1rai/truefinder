import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, MapPin, Star, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const IMAGE_BASE_URL = "http://localhost:5000";

export default function ProfileCard({ profile, onLike, onMessage }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const age = new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear();

  useEffect(() => {
    if (profile.photos?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % profile.photos.length);
      }, 2000); // 2 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [profile.photos]);

  const imageUrl = profile.photos?.length
    ? `${IMAGE_BASE_URL}${profile.photos[currentImageIndex]}`
    : "/placeholder.svg";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-2 mt-2">
  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${
      profile.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {profile.isVerified ? "Verified ✅" : "Not Verified ❌"}
  </span>
</div>

      <div className="relative">
        <img
          src={imageUrl}
          alt={fullName}
          className="w-full h-80 object-cover transition duration-500 ease-in-out"
        />
        <div className="absolute top-4 right-4">
          {profile.isVerified && (
            <Badge className="bg-blue-500 text-white">
              <Star className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 rounded-lg p-3 text-white">
            <h3 className="text-xl font-semibold">{fullName}</h3>
            <p className="text-sm opacity-90">
              {age} years • {profile.city}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3 mb-3 text-gray-600 text-sm">
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            {profile.profession}
          </div>
          <div className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            {profile.education}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {profile.city}, {profile.state}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {profile.bio || "No bio available."}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
          <div>Income: {profile.income}</div>
          <div>Religion: {profile.religion}</div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onMessage(profile._id)}>
            <MessageCircle className="h-4 w-4 mr-1" />
            Chat
          </Button>
          <Button size="sm" className="bg-pink-500 hover:bg-pink-600 flex-1" onClick={() => onLike(profile._id)}>
            <Heart className="h-4 w-4 mr-1" />
            Like
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
