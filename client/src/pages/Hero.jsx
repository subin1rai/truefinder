import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Shield, MessageCircle, Star, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  const [stats] = useState({
    totalUsers: 50000,
    successStories: 2500,
    activeUsers: 15000,
  })

  const features = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Smart Matching",
      description: "AI-powered algorithm finds your perfect match based on compatibility",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Verified Profiles",
      description: "All profiles are manually verified for authenticity and safety",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      title: "Secure Messaging",
      description: "Private and secure communication with potential matches",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Large Community",
      description: "Join thousands of verified members looking for meaningful relationships",
    },
  ]

  const testimonials = [
    {
      name: "Priya & Rahul",
      story: "Found each other through BestMate and got married last year!",
      rating: 5,
    },
    {
      name: "Anjali & Vikram",
      story: "The AI matching was spot on. We're perfect for each other!",
      rating: 5,
    },
    {
      name: "Meera & Arjun",
      story: "Safe, secure, and effective. Highly recommend BestMate!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">BestMate</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6 ">
            <a href="/browse" className="text-gray-600 hover:text-pink-500 transition-colors">Browse Profiles</a>
            <a href="/about" className="text-gray-600 hover:text-pink-500 transition-colors">About</a>
            <a href="/contact" className="text-gray-600 hover:text-pink-500 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center space-x-3">
            <a href="/auth">
              <Button variant="outline">Login</Button>
            </a>
            <a href="/auth">
              <Button className="bg-pink-500 hover:bg-pink-600">Join Now</Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section (TRUE FULL SCREEN) */}
      <section className="h-screen flex items-center justify-center px-4 text-center relative">
        <div className="container">
          <Badge className="mb-4 bg-pink-100 text-pink-700 hover:bg-pink-100">
            #1 Trusted Matrimonial Platform
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Find Your Perfect <span className="text-pink-500 block">Life Partner</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of verified members and let our AI-powered matching system help you find your soulmate.
            Safe, secure, and successful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/auth">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-lg px-8 py-3 w-full sm:w-auto">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="/browse">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent w-full sm:w-auto">
                Browse Profiles
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-pink-500">{stats.totalUsers.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm md:text-base">Registered Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-500">{stats.successStories.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm md:text-base">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-500">{stats.activeUsers.toLocaleString()}+</div>
              <div className="text-gray-600 text-sm md:text-base">Active This Month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose BestMate?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine traditional values with modern technology to help you find lasting love
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find your perfect match</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600">Sign up and create your detailed profile with photos and preferences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matches</h3>
              <p className="text-gray-600">Our AI algorithm suggests compatible profiles based on your preferences</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Chat</h3>
              <p className="text-gray-600">Start conversations with matches and build meaningful connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real couples who found love through BestMate</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.story}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Soulmate?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of happy couples who found love through BestMate</p>
          <a href="/auth">
            <Button size="lg" className="bg-white text-pink-500 hover:bg-gray-100 text-lg px-8 py-3">
              Get Started Today
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold">BestMate</span>
              </div>
              <p className="text-gray-400">
                The most trusted matrimonial platform helping people find their perfect life partner.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/browse" className="hover:text-white transition-colors">
                    Browse Profiles
                  </a>
                </li>
                <li>
                  <a href="/success-stories" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/safety" className="hover:text-white transition-colors">
                    Safety Tips
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>Email: support@bestmate.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Love Street, Heart City, HC 12345</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BestMate. All rights reserved. Made with ❤️ for finding love.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}