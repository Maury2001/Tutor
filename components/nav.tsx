'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Nav() {
    const router = useRouter()
  return (
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
           
                <div className="flex items-center space-x-2">
                  
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-black sm:text-sm"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
               
                  <Link href="/auth/signup">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-base p-4 sm:text-sm"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </nav>
  )
}
