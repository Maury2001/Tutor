import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { studentId } = await request.json()

    // Mock comprehensive report data (in real app, fetch from database)
    const reportData = {
      reportId: "PIR-2024-001",
      generatedDate: "2024-01-18",
      reportingPeriod: {
        startDate: "2024-01-01",
        endDate: "2024-01-18",
      },
      student: {
        id: "student-001",
        name: "John Kamau",
        grade: "Grade 9",
        pathway: "STEM Pathway (Primary Choice)",
      },
      parent: {
        id: "parent-001",
        name: "Mrs. Mary Kamau",
        relationship: "Mother",
        email: "mary.kamau@email.com",
        phone: "+254-722-123-456",
        involvementLevel: "High",
      },
      consultationSummary: {
        totalScheduled: 3,
        parentAttended: 3,
        parentMissed: 0,
        attendanceRate: 100,
      },
      preparationMaterials: {
        totalSent: 5,
        totalRead: 3,
        readingRate: 60,
        feedbackProvided: 2,
      },
      communication: {
        totalMessages: 12,
        responseRate: 100,
        averageResponseTime: "2.5 hours",
        preferredMethod: "WhatsApp",
      },
      engagement: {
        overallScore: 92,
        preparationScore: 88,
        participationScore: 95,
        followUpScore: 90,
      },
      outcomes: {
        pathwayDecisionMade: true,
        parentSatisfaction: 95,
        studentBenefit: 90,
        familyAlignment: 98,
      },
      recommendations: [
        "Continue high level of engagement in upcoming university visits",
        "Complete pending financial planning worksheet before next consultation",
        "Consider attending additional industry professional meetings",
        "Explore scholarship application preparation sessions",
        "Maintain regular communication with assigned counselor",
      ],
      nextSteps: [
        "Schedule follow-up meeting with mathematics teacher (Due: Jan 25)",
        "Complete university campus visit arrangements (Due: Jan 28)",
        "Review and submit financial planning worksheet (Due: Jan 22)",
        "Attend Safaricom professional meeting (Scheduled: Jan 25)",
        "Begin scholarship research and application preparation",
      ],
    }

    const consultationDetails = [
      {
        id: "consult-001",
        date: "2024-01-15",
        consultant: "Ms. Sarah Wanjiku (Career Counselor)",
        type: "Initial Career Counseling",
        parentAttended: true,
        preparationCompleted: true,
        objectives: [
          "Discuss CBC pathway options",
          "Understand family priorities and concerns",
          "Establish communication preferences",
          "Set consultation schedule",
        ],
        outcomes: [
          "STEM pathway identified as primary choice",
          "Strong family consensus achieved",
          "Communication preferences established",
          "Comprehensive consultation plan created",
        ],
        parentFeedback: "Very informative session. Helped us understand the options clearly.",
        rating: 5,
      },
      {
        id: "consult-002",
        date: "2024-01-20",
        consultant: "Mr. David Mwangi (Mathematics Teacher)",
        type: "Academic Consultation",
        parentAttended: true,
        preparationCompleted: true,
        objectives: [
          "Review John's mathematics performance",
          "Discuss Grade 10 preparation strategies",
          "Understand home support requirements",
          "Plan advanced mathematics pathway",
        ],
        outcomes: [
          "Identified specific areas for improvement",
          "Received comprehensive study plan",
          "Established home tutoring schedule",
          "Planned advanced mathematics track",
        ],
        parentFeedback: "Excellent guidance on supporting John's mathematics studies at home.",
        rating: 5,
      },
      {
        id: "consult-003",
        date: "2024-01-25",
        consultant: "Eng. Sarah Njeri (Software Engineer)",
        type: "Industry Professional Meeting",
        parentAttended: true,
        preparationCompleted: true,
        objectives: [
          "Understand software engineering career prospects",
          "Learn about industry requirements",
          "Explore mentorship opportunities",
          "Discuss work-life balance",
        ],
        outcomes: [
          "Gained clear understanding of career path",
          "Established mentorship connection",
          "Received industry insights and trends",
          "Understood professional development requirements",
        ],
        parentFeedback: "Very inspiring meeting. Sarah provided excellent career insights.",
        rating: 5,
      },
    ]

    // Generate HTML content for PDF
    const htmlContent = generatePDFHTML(reportData, consultationDetails)

    // In a real application, you would use a PDF generation library like Puppeteer or jsPDF
    // For this example, we'll simulate the PDF generation process

    // Simulate PDF generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a mock PDF response
    const pdfBuffer = Buffer.from(`PDF Content for Parent Involvement Report
Report ID: ${reportData.reportId}
Student: ${reportData.student.name}
Parent: ${reportData.parent.name}
Generated: ${reportData.generatedDate}

This would be the actual PDF content generated from the HTML template.
In a real implementation, this would use a proper PDF generation library.`)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Parent_Involvement_Report_${reportData.student.name.replace(" ", "_")}_${reportData.reportId}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF report" }, { status: 500 })
  }
}

function generatePDFHTML(reportData: any, consultationDetails: any[]) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parent Involvement Report - ${reportData.student.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 20px;
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .info-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .info-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #e9ecef;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .label {
            font-weight: 600;
            color: #6c757d;
        }
        
        .value {
            font-weight: 500;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .metric-card {
            text-align: center;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        
        .metric-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .progress-bar {
            background: #e9ecef;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
        }
        
        .consultation-item {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .consultation-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        
        .consultation-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }
        
        .consultation-meta {
            font-size: 14px;
            color: #6c757d;
        }
        
        .badges {
            display: flex;
            gap: 8px;
        }
        
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        
        .badge-info {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .objectives-outcomes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .list-section h4 {
            font-size: 14px;
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .list-section ul {
            list-style: none;
            padding: 0;
        }
        
        .list-section li {
            padding: 5px 0;
            padding-left: 20px;
            position: relative;
            font-size: 13px;
            line-height: 1.4;
        }
        
        .list-section li:before {
            content: "•";
            color: #667eea;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .feedback-box {
            background: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px;
            margin-top: 15px;
            border-radius: 0 4px 4px 0;
        }
        
        .feedback-box h4 {
            color: #1976d2;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .feedback-text {
            font-style: italic;
            color: #1565c0;
            font-size: 13px;
        }
        
        .recommendations-list {
            list-style: none;
            padding: 0;
        }
        
        .recommendations-list li {
            background: #e8f4fd;
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #2196f3;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .next-steps-list {
            list-style: none;
            padding: 0;
        }
        
        .next-steps-list li {
            background: #e8f5e8;
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #4caf50;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            margin-top: 40px;
            border-top: 1px solid #e9ecef;
        }
        
        .footer p {
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 5px;
        }
        
        @media print {
            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
            }
            
            .section {
                page-break-inside: avoid;
            }
            
            .consultation-item {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Parent Involvement Summary Report</h1>
        <div class="subtitle">
            Report ID: ${reportData.reportId} | Generated: ${new Date(reportData.generatedDate).toLocaleDateString()} | 
            Period: ${new Date(reportData.reportingPeriod.startDate).toLocaleDateString()} - ${new Date(reportData.reportingPeriod.endDate).toLocaleDateString()}
        </div>
    </div>

    <div class="container">
        <!-- Student & Parent Information -->
        <div class="section">
            <h2 class="section-title">Student & Parent Information</h2>
            <div class="info-grid">
                <div class="info-card">
                    <h3>Student Information</h3>
                    <div class="info-row">
                        <span class="label">Name:</span>
                        <span class="value">${reportData.student.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Grade:</span>
                        <span class="value">${reportData.student.grade}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Pathway:</span>
                        <span class="value">${reportData.student.pathway}</span>
                    </div>
                </div>
                <div class="info-card">
                    <h3>Parent Information</h3>
                    <div class="info-row">
                        <span class="label">Name:</span>
                        <span class="value">${reportData.parent.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Relationship:</span>
                        <span class="value">${reportData.parent.relationship}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Involvement Level:</span>
                        <span class="value">${reportData.parent.involvementLevel}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Contact:</span>
                        <span class="value">${reportData.parent.email}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Key Metrics -->
        <div class="section">
            <h2 class="section-title">Key Performance Metrics</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${reportData.consultationSummary.attendanceRate}%</div>
                    <div class="metric-label">Consultation Attendance</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${reportData.consultationSummary.attendanceRate}%"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${reportData.preparationMaterials.readingRate}%</div>
                    <div class="metric-label">Material Reading Rate</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${reportData.preparationMaterials.readingRate}%"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${reportData.communication.responseRate}%</div>
                    <div class="metric-label">Communication Response</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${reportData.communication.responseRate}%"></div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${reportData.engagement.overallScore}</div>
                    <div class="metric-label">Overall Engagement Score</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${reportData.engagement.overallScore}%"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Consultation Details -->
        <div class="section">
            <h2 class="section-title">Consultation Participation Analysis</h2>
            <div class="info-grid" style="margin-bottom: 20px;">
                <div class="info-card">
                    <div class="info-row">
                        <span class="label">Total Scheduled:</span>
                        <span class="value">${reportData.consultationSummary.totalScheduled}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Parent Attended:</span>
                        <span class="value">${reportData.consultationSummary.parentAttended}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Missed Sessions:</span>
                        <span class="value">${reportData.consultationSummary.parentMissed}</span>
                    </div>
                </div>
                <div class="info-card">
                    <div class="info-row">
                        <span class="label">Total Messages:</span>
                        <span class="value">${reportData.communication.totalMessages}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Response Rate:</span>
                        <span class="value">${reportData.communication.responseRate}%</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Avg Response Time:</span>
                        <span class="value">${reportData.communication.averageResponseTime}</span>
                    </div>
                </div>
            </div>

            ${consultationDetails
              .map(
                (consultation) => `
                <div class="consultation-item">
                    <div class="consultation-header">
                        <div>
                            <div class="consultation-title">${consultation.consultant}</div>
                            <div class="consultation-meta">
                                ${consultation.type} | ${new Date(consultation.date).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="badges">
                            <span class="badge badge-success">Attended</span>
                            <span class="badge badge-info">Prepared</span>
                            <span class="badge badge-success">★ ${consultation.rating}/5</span>
                        </div>
                    </div>
                    
                    <div class="objectives-outcomes">
                        <div class="list-section">
                            <h4>Objectives:</h4>
                            <ul>
                                ${consultation.objectives.map((obj) => `<li>${obj}</li>`).join("")}
                            </ul>
                        </div>
                        <div class="list-section">
                            <h4>Outcomes:</h4>
                            <ul>
                                ${consultation.outcomes.map((outcome) => `<li>${outcome}</li>`).join("")}
                            </ul>
                        </div>
                    </div>
                    
                    ${
                      consultation.parentFeedback
                        ? `
                        <div class="feedback-box">
                            <h4>Parent Feedback:</h4>
                            <div class="feedback-text">"${consultation.parentFeedback}"</div>
                        </div>
                    `
                        : ""
                    }
                </div>
            `,
              )
              .join("")}
        </div>

        <!-- Engagement Analysis -->
        <div class="section">
            <h2 class="section-title">Engagement Analysis</h2>
            <div class="info-grid">
                <div class="info-card">
                    <h3>Engagement Scores</h3>
                    <div class="info-row">
                        <span class="label">Preparation Score:</span>
                        <span class="value">${reportData.engagement.preparationScore}/100</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Participation Score:</span>
                        <span class="value">${reportData.engagement.participationScore}/100</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Follow-up Score:</span>
                        <span class="value">${reportData.engagement.followUpScore}/100</span>
                    </div>
                    <div class="info-row">
                        <span class="label"><strong>Overall Score:</strong></span>
                        <span class="value"><strong>${reportData.engagement.overallScore}/100</strong></span>
                    </div>
                </div>
                <div class="info-card">
                    <h3>Outcome Indicators</h3>
                    <div class="info-row">
                        <span class="label">Pathway Decision:</span>
                        <span class="value">${reportData.outcomes.pathwayDecisionMade ? "✓ Completed" : "⏳ Pending"}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Parent Satisfaction:</span>
                        <span class="value">${reportData.outcomes.parentSatisfaction}%</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Student Benefit:</span>
                        <span class="value">${reportData.outcomes.studentBenefit}%</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Family Alignment:</span>
                        <span class="value">${reportData.outcomes.familyAlignment}%</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recommendations -->
        <div class="section">
            <h2 class="section-title">Recommendations for Continued Success</h2>
            <ul class="recommendations-list">
                ${reportData.recommendations.map((rec) => `<li>${rec}</li>`).join("")}
            </ul>
        </div>

        <!-- Next Steps -->
        <div class="section">
            <h2 class="section-title">Next Steps & Action Items</h2>
            <ul class="next-steps-list">
                ${reportData.nextSteps.map((step) => `<li>${step}</li>`).join("")}
            </ul>
        </div>
    </div>

    <div class="footer">
        <p>This report was generated on ${new Date(reportData.generatedDate).toLocaleDateString()} for the period ${new Date(reportData.reportingPeriod.startDate).toLocaleDateString()} to ${new Date(reportData.reportingPeriod.endDate).toLocaleDateString()}.</p>
        <p>For questions about this report, please contact the Career Counseling Department at counseling@school.ac.ke</p>
        <p><strong>Confidential Document - For Educational Use Only</strong></p>
    </div>
</body>
</html>
  `
}
