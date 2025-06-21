import type React from "react"

interface CurriculumContextDisplayProps {
  context: string
}

const CurriculumContextDisplay: React.FC<CurriculumContextDisplayProps> = ({ context }) => {
  return (
    <div>
      <h3>Curriculum Context</h3>
      <p>{context}</p>
    </div>
  )
}

export { CurriculumContextDisplay }
