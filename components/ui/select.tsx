"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

// Update the GRADE_LEVELS constant to include all grades
export const GRADE_LEVELS = [
  { value: "pp1", label: "PP1" },
  { value: "pp2", label: "PP2" },
  { value: "grade1", label: "Grade 1" },
  { value: "grade2", label: "Grade 2" },
  { value: "grade3", label: "Grade 3" },
  { value: "grade4", label: "Grade 4" },
  { value: "grade5", label: "Grade 5" },
  { value: "grade6", label: "Grade 6" },
  { value: "grade7", label: "Grade 7" },
  { value: "grade8", label: "Grade 8" },
  { value: "grade9", label: "Grade 9" },
  { value: "grade10", label: "Grade 10" },
  { value: "grade11", label: "Grade 11" },
  { value: "grade12", label: "Grade 12" },
] as const

export const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "school", label: "School" },
  { value: "parent", label: "Parent" },
] as const

export const CHEMICAL_SUBSTANCES = [
  { value: "water", label: "Water (H₂O)" },
  { value: "sodium_solution", label: "Sodium Solution (NaOH)" },
  { value: "hydrochloric_acid", label: "Hydrochloric Acid (HCl)" },
  { value: "lemon_juice", label: "Lemon Juice" },
  { value: "baking_soda", label: "Baking Soda (NaHCO₃)" },
  { value: "vinegar", label: "Vinegar (CH₃COOH)" },
  { value: "soap_solution", label: "Soap Solution" },
  { value: "milk", label: "Milk" },
  { value: "coffee", label: "Coffee" },
] as const

export const LITMUS_INDICATORS = [
  { value: "blue_litmus", label: "Blue Litmus Paper" },
  { value: "red_litmus", label: "Red Litmus Paper" },
  { value: "universal_indicator", label: "Universal Indicator" },
  { value: "phenolphthalein", label: "Phenolphthalein" },
  { value: "methyl_orange", label: "Methyl Orange" },
] as const

export const PH_INDICATORS = [
  { value: "litmus", label: "Litmus Paper" },
  { value: "universal", label: "Universal Indicator" },
  { value: "phenolphthalein", label: "Phenolphthalein" },
  { value: "methyl_orange", label: "Methyl Orange" },
  { value: "red_cabbage", label: "Red Cabbage Extract" },
] as const

export const CBC_PERFORMANCE_LEVELS = [
  { value: "exceeds_expectations", label: "Exceeds Expectations (4)" },
  { value: "meets_expectations", label: "Meets Expectations (3)" },
  { value: "approaches_expectations", label: "Approaches Expectations (2)" },
  { value: "below_expectations", label: "Below Expectations (1)" },
] as const

export const CBC_COMPETENCY_AREAS = [
  { value: "communication_collaboration", label: "Communication and Collaboration" },
  { value: "critical_thinking", label: "Critical Thinking and Problem Solving" },
  { value: "creativity_imagination", label: "Creativity and Imagination" },
  { value: "citizenship", label: "Citizenship" },
  { value: "digital_literacy", label: "Digital Literacy" },
  { value: "learning_to_learn", label: "Learning to Learn" },
  { value: "self_efficacy", label: "Self Efficacy" },
] as const

export const CBC_ASSESSMENT_CRITERIA = [
  { value: "knowledge_understanding", label: "Knowledge and Understanding" },
  { value: "thinking_inquiry", label: "Thinking and Inquiry" },
  { value: "communication", label: "Communication" },
  { value: "application", label: "Application" },
] as const

export const CBC_LEARNING_OUTCOMES = [
  { value: "conceptual_understanding", label: "Conceptual Understanding" },
  { value: "procedural_fluency", label: "Procedural Fluency" },
  { value: "strategic_competence", label: "Strategic Competence" },
  { value: "adaptive_reasoning", label: "Adaptive Reasoning" },
  { value: "productive_disposition", label: "Productive Disposition" },
] as const

export const CBC_ASSESSMENT_METHODS = [
  { value: "formative_assessment", label: "Formative Assessment" },
  { value: "summative_assessment", label: "Summative Assessment" },
  { value: "peer_assessment", label: "Peer Assessment" },
  { value: "self_assessment", label: "Self Assessment" },
  { value: "portfolio_assessment", label: "Portfolio Assessment" },
  { value: "project_based_assessment", label: "Project-Based Assessment" },
] as const

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 min-w-[120px]",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-[300px] overflow-y-auto",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
