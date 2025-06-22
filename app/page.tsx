"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sparkles,
  Brain,
  BookOpen,
  Users,
  Target,
  Shield,
  CheckCircle,
  Play,
  Globe,
  BarChart3,
  LogOut,
  Microscope,
  Gift,
  Crown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { link } from "fs";
import Cir from "../app/comprehensive-cbc-platform/page";
 // ✅ Valid


// Define subscription packages directly in this file
const SUBSCRIPTION_PACKAGES = [
  // {
  //   id: "free",
  //   name: "Free Starter",
  //   tier: "free" as const,
  //   price: 0,
  //   currency: "USD",
  //   billing: "monthly" as const,
  //   features: {
  //     tokens: '',
  //     virtualLabAccess: false,
  //     virtualLabExperiments: 0,
  //     aiTutorAccess: true,
  //     assessmentGenerator: false,
  //     progressAnalytics: false,
  //     parentReports: false,
  //     prioritySupport: false,
  //     customBranding: false,
  //     apiAccess: false,
  //   },
  //   limits: {
  //     maxStudents: 50,
  //     maxTeachers: 5,
  //     maxSchools: 1,
  //   },
  // },
  {
    id: "school",
    name: "Personal",
    tier: "school" as const,
    price: 99,
    currency: "KSH",
    billing: "monthly" as const,
    popular: true,
    features: {
      tokens: " ",
      virtualLabAccess: true,
      virtualLabExperiments: 20,
      aiTutorAccess: true,
      assessmentGenerator: true,
      progressAnalytics: true,
      parentReports: true,
      prioritySupport: true,
      customBranding: false,
      apiAccess: false,
      cbcPathwayGuidance:true,
    },
    limits: {
      maxStudents: 500,
      maxTeachers: 50,
      maxSchools: 1,
    },
  },
  {
    id: "enterprise",
    name: "School",
    tier: "enterprise" as const,
    price: '',
    currency: "KSH",
    billing: "monthly" as const,
    features: {
      tokens: ' ',
      virtualLabAccess: true,
      virtualLabExperiments: -1, // Unlimited
      aiTutorAccess: true,
      assessmentGenerator: true,
      progressAnalytics: true,
      parentReports: true,
      prioritySupport: true,
      customBranding: true,
      apiAccess: true,
      cbcPathwayGuidance:true,
    },
    limits: {
      maxStudents: -1, // Unlimited
      maxTeachers: -1, // Unlimited
      maxSchools: 10,
    },
  },
];

// Custom hook to safely use auth
function useAuthSafe() {
  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Simulate auth check - replace with actual auth logic
    const timer = setTimeout(() => {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const logout = async () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return { ...authState, logout };
}

export default function HomePage() {
  const [userCount, setUserCount] = useState(2847);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { user, isAuthenticated, loading, logout } = useAuthSafe();
  const [contactModal, setContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    message: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1000);
    const interval = setInterval(() => {
      setUserCount((prev) => prev + Math.floor(Math.random() * 2));
    }, 8000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const features = [
    {
      icon: Sparkles,
      link: "/tutor/cbc",
      title: "AI-Powered Tutoring",
      description:
        "Get personalized help from our advanced AI tutor trained specifically on the CBC curriculum",
      gradient: "from-purple-500 to-pink-500",
      benefits: [
        "24/7 availability",
        "Instant explanations",
        "Adaptive learning",
      ],
    },
    {
      icon: BookOpen,
      link: "/curriculum",
      title: "Complete CBC Coverage",
      description:
        "Access comprehensive content for all CBC subjects from Grade 1 to Form 4",
      gradient: "from-blue-500 to-cyan-500",
      benefits: ["All subjects covered", "KICD aligned", "Regular updates"],
    },
    {
      icon: Microscope,
      link: "/virtual-lab",
      title: "AI Virtual Laboratory",
      description:
        "Conduct interactive science experiments with AI guidance and real-time feedback",
      gradient: "from-green-500 to-emerald-500",
      benefits: ["Interactive experiments", "AI guidance", "Safe environment"],
    },
    {
      icon: Target,
      link: "/tutor/adaptive",
      title: "Adaptive Assessments",
      description:
        "Take smart quizzes that adapt to your learning level and identify knowledge gaps",
      gradient: "from-orange-500 to-red-500",
      benefits: [
        "Personalized difficulty",
        "Instant feedback",
        "Progress tracking",
      ],
    },
    {
      icon: BarChart3,
      link: "/analytics",
      title: "Learning Analytics",
      description:
        "Track your progress with detailed analytics and performance insights",
      gradient: "from-indigo-500 to-purple-500",
      benefits: ["Detailed reports", "Performance trends", "Goal setting"],
    },
    {
      icon: Users,
      link: "/teacher",
      title: "Teacher Tools",
      description:
        "Comprehensive tools for educators to manage classes and monitor student progress",
      gradient: "from-teal-500 to-blue-500",
      benefits: ["Class management", "Student insights", "Curriculum planning"],
    },
  ];
  


  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Contact form submitted:", contactForm);
    setContactModal(false);
    setContactForm({
      name: "",
      email: "",
      organization: "",
      phone: "",
      message: "",
    });

    // Show success toast instead of alert
    toast({
      title: "Message Sent Successfully!",
      description: "Our sales team will contact you within 24 hours.",
      duration: 5000,
    });
  };

  // Rest of the component remains the same...
  if (loading || isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TutorBot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation - Mobile Responsive */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-8 w-8 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TutorBot
              </span>
            </div> */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img
              
                  src="/tutorbot-logo.png"
                  alt="TutorBot AI Logo"
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "block";
                  }}
                />
                <div className="hidden">
                  <div className="h-14 w-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TutorBot AI
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src={user.avatar || ""} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">
                    Welcome, {user.name}
                  </span>
                  <Link href="/dashboard">
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs sm:text-sm"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/signin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-black sm:text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button
                      size="md"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-base p-4 sm:text-sm"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile Responsive */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-white to-purple-50/30 to-pink-100/50"></div>
        <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-20 animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 sm:mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-3 py-2 sm:px-4 text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              AI-Powered Learning Platform
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-6xl font-bold mb-4 p-4 sm:mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transform Learning with
            </span>
            <br />
            <span className="text-gray-900">AI Intelligence</span>
          </h1>

          <p className="!text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Master the CBC curriculum with Kenya's most advanced AI tutoring
            platform. Complete with virtual laboratories, personalized learning,
            and comprehensive teacher tools.
          </p>
          {/* Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12 px-4 py-4">
            <Link href="personal-assessment">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Take a Personal Assessment
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Mobile Responsive */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm sm:text-sm text-gray-600 px-4">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-4" />
              KICD Approved Content
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-4" />
              {userCount.toLocaleString()}+ Active Learners
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mr-4" />
              Trusted by Schools
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mr-4" />
              Available Nationwide
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile Responsive */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="!text-5xl p-4 sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Powerful Features for Modern Learning
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Experience the future of education with our comprehensive suite of
              AI-powered tools
            </p>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 p-4">
            {features.map((feature, index) => (
              <Link href={feature.link} key={feature.title}>
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-xs sm:text-sm text-gray-600"
                        >
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full flex justify-center p-4">
        
        <div className="mt-10 w-full max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-center text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                PP1-Grade 12
              </div>
              <div className="text-sm text-muted-foreground">
                Full CBC Coverage
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">8-4-4</div>
              <div className="text-sm text-muted-foreground">Full Coverage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">American/British Curriculum</div>
              <div className="text-sm text-muted-foreground">Full Coverage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">7+</div>
              <div className="text-sm text-muted-foreground">
                Learning Areas
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">AI-Powered</div>
              <div className="text-sm text-muted-foreground">
                Adaptive Learning
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">Real-time</div>
              <div className="text-sm text-muted-foreground">Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Packages Section - Mobile Responsive */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Flexible pricing options designed for schools of all sizes
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {SUBSCRIPTION_PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative border-2 w-[300px] sm:w-[350px] md:w-[400px]
                  ${
                  pkg.popular
                    ? "border-indigo-500 shadow-lg scale-105"
                    : "border-gray-200"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-indigo-500 text-white px-3 py-1 sm:px-4 text-xs sm:text-sm">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6 sm:pb-8">
                  <div className="mb-4">
                    {pkg.tier === "free" && (
                      <Gift className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-500" />
                    )}
                    {pkg.tier === "school" && (
                      <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-indigo-500" />
                    )}
                    {pkg.tier === "enterprise" && (
                      <Crown className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-purple-500" />
                    )}
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold">
                    {pkg.name}
                  </CardTitle>
                  {/* <div className="mt-4">
                    <span className="text-3xl sm:text-4xl font-bold">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-600 text-sm sm:text-base">
                      /{pkg.billing}
                    </span>
                  </div> */}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {/* <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                      <span className="text-sm sm:text-base">
                        {pkg.features.tokens.toLocaleString()} AI tokens
                      </span>
                    </div> */}
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                      <span className="text-sm sm:text-base">
                        {pkg.limits.maxStudents === -1
                          ? "Unlimited"
                          : pkg.limits.maxStudents}{" "}
                        students
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                      <span className="text-sm sm:text-base">
                        {pkg.limits.maxTeachers === -1
                          ? "Unlimited"
                          : pkg.limits.maxTeachers}{" "}
                        teachers
                      </span>
                    </div>
                    {pkg.features.virtualLabAccess && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                        <span className="text-sm sm:text-base">
                          Virtual Laboratory Access
                        </span>
                      </div>
                    )}
                    {pkg.features.assessmentGenerator && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                        <span className="text-sm sm:text-base">
                          Assessment Generator
                        </span>
                      </div>
                    )}
                    {pkg.features.progressAnalytics && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                        <span className="text-sm sm:text-base">
                          Progress Analytics
                        </span>
                      </div>
                    )}
                    {pkg.features.prioritySupport && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                        <span className="text-sm sm:text-base">
                          Priority Support
                        </span>
                      </div>
                    )}
                     {pkg.features.parentReports && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                        <span className="text-sm sm:text-base">
                          Parent Reports
                        </span>
                      </div>
                    )}
                     {pkg.features.cbcPathwayGuidance && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-3" />
                        <span className="text-sm sm:text-base">
                          CBC Pathway Guides
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="pt-6">
                    {pkg.tier === "free" ? (
                      <Link href="/auth/signup">
                        <Button className="w-full" variant="outline">
                          Get Started Free
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        onClick={() => setContactModal(true)}
                      >
                        Contact Us for Free Demo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Mobile Responsive */}
      <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 sm:py-16 p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              {/* <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">
                  CBC TutorBot
                </span>
              </div> */}
              <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <img
                  src="/tutorbot-logo.png"
                  alt="TutorBot AI Logo"
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling.style.display = "block";
                  }}
                />
                <div className="hidden">
                  <div className="h-14 w-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center border border-white">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-white">
                TutorBot AI
              </span>
            </div>
              <p className="text-gray-400 mb-6 max-w-md text-sm sm:text-base">
                Transforming education in Kenya through AI-powered learning.
                Making quality CBC education accessible to every student and
                teacher nationwide.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <Badge className="bg-purple-600 text-xs sm:text-sm p-3">
                  KICD Approved
                </Badge>
                <Badge className="bg-green-600 text-xs sm:text-sm p-3">
                  School Trusted
                </Badge>
                <Badge className="bg-blue-600 text-xs sm:text-sm p-3">
                  AI Powered
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                Platform
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Virtual Laboratory
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    AI Tutor
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learning-path"
                    className="hover:text-white transition-colors"
                  >
                    Learning Paths
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                Support
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setContactModal(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm sm:text-base text-center md:text-left md:mb-0">
              © 2024 CBC TutorBot. All rights reserved. Made with ❤️ for Kenyan
              education.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm sm:text-base">
                Powered by
              </span>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                AI Technology
              </Badge>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Sales Modal - Mobile Responsive */}
      <Dialog open={contactModal} onOpenChange={setContactModal}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Contact Our Team
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Get in touch with our team to discuss your needs and get a custom
              quote.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="Input Full Name"
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  placeholder="example@gmail.com"
                  className="text-sm"
                />
              </div>
            </div>
            {/* <div>
              <Label htmlFor="organization" className="text-sm">
                School/Organization *
              </Label>
              <Input
                id="organization"
                required
                value={contactForm.organization}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    organization: e.target.value,
                  })
                }
                placeholder="ABC High School"
                className="text-sm"
              />
            </div> */}
            <div>
              <Label htmlFor="phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
                placeholder="+254 7xx xxx xxx"
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-sm">
                Message
              </Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                placeholder="Tell us about your needs..."
                rows={4}
                className="text-sm"
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setContactModal(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 w-full sm:w-auto"
              >
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
