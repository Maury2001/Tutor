"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))
Card.displayName = "Card"

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showAIGuide?: boolean
  mathSimulation?: boolean
  aiGuidanceText?: string
  onAIHelp?: () => void
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, showAIGuide, mathSimulation, aiGuidanceText, onAIHelp, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6 relative overflow-hidden",
        mathSimulation && "bg-gradient-to-br from-blue-50 to-purple-50",
        className,
      )}
      {...props}
    >
      {/* AI Guidance Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 pointer-events-none" />

      {/* AI Helper Button */}
      {showAIGuide && (
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={onAIHelp}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
            title="Get AI Help"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Math Simulation Indicator */}
      {mathSimulation && (
        <div className="absolute top-2 left-2 z-20">
          <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">🧮 Simulation</div>
        </div>
      )}

      {/* AI Guidance Text */}
      {aiGuidanceText && (
        <div className="absolute bottom-0 left-0 right-0 bg-blue-100 border-t border-blue-200 p-3 z-20">
          <div className="flex items-start space-x-2">
            <div className="bg-blue-500 rounded-full p-1 flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-blue-800 font-medium">{aiGuidanceText}</p>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col space-y-1.5">{props.children}</div>
    </div>
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
export type { CardHeaderProps }
