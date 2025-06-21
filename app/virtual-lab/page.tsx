import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Play, Sparkles } from "lucide-react"

export default function VirtualLabPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Virtual Lab</h1>

      {/* AI Experiment Designer as a featured tool */}
      <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            AI Experiment Designer
          </CardTitle>
          <CardDescription className="text-blue-600">
            Create custom experiments step-by-step with AI assistance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 mb-4">
            Design and simulate your own virtual lab experiments using our AI-powered tool. Perfect for exploring
            scientific concepts and CBC curriculum alignment.
          </p>
          <Link href="/virtual-lab/demo-creation">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Play className="h-4 w-4 mr-2" />
              Try Demo Creation
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* NEW: Diffusion Experiments - Grade 8 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="group-hover:text-green-600 transition-colors text-green-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Diffusion Experiments
            </CardTitle>
            <CardDescription className="text-green-700">Grade 8 CBC - Particle Theory of Matter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 mb-4">
              Explore molecular movement through perfume, tea, and ink diffusion experiments with temperature control.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Grade 8</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Interactive</span>
            </div>
            <Link href="/virtual-lab/diffusion-experiments">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Study Diffusion
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Mirror Optics - Grade 9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader>
            <CardTitle className="group-hover:text-purple-600 transition-colors text-purple-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Mirror Optics Lab
            </CardTitle>
            <CardDescription className="text-purple-700">
              Grade 9 CBC - Curved Mirrors & Image Formation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700 mb-4">
              Interactive ray diagrams for concave and convex mirrors with real-time image property calculations.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Grade 9</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Ray Tracing</span>
            </div>
            <Link href="/virtual-lab/mirror-optics">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Play className="h-4 w-4 mr-2" />
                Explore Mirrors
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Chemical Reactions Lab - Grade 7-9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="group-hover:text-purple-600 transition-colors text-purple-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Chemical Reactions Lab
            </CardTitle>
            <CardDescription className="text-purple-700">Grade 7-9 CBC - Types of Chemical Reactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700 mb-4">
              Explore acid-base, precipitation, combustion, and decomposition reactions with interactive simulations.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Grade 7-9</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Safety Focus</span>
            </div>
            <Link href="/virtual-lab/chemical-reactions">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Play className="h-4 w-4 mr-2" />
                Start Chemistry Lab
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Atomic Bonding Lab - Grade 8-9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardHeader>
            <CardTitle className="group-hover:text-indigo-600 transition-colors text-indigo-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Atomic Bonding Lab
            </CardTitle>
            <CardDescription className="text-indigo-700">Grade 8-9 CBC - Chemical Bonding & Molecules</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-indigo-700 mb-4">
              Build molecules and explore ionic, covalent, and metallic bonds with interactive atom models.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Grade 8-9</span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Interactive</span>
            </div>
            <Link href="/virtual-lab/atomic-bonding">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Play className="h-4 w-4 mr-2" />
                Build Molecules
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Acids & Bases Lab - Grade 7-9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
          <CardHeader>
            <CardTitle className="group-hover:text-green-600 transition-colors text-green-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Acids & Bases Lab
            </CardTitle>
            <CardDescription className="text-green-700">Grade 7-9 CBC - pH Testing & Indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 mb-4">
              Test household substances with pH indicators and explore the acid-base scale with real-time results.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Grade 7-9</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">pH Testing</span>
            </div>
            <Link href="/virtual-lab/acids-bases">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Test pH Levels
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Existing Microscopy Lab */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Plant Microscopy</CardTitle>
            <CardDescription>Explore plant cells under a virtual microscope</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Observe and identify different plant cell structures using our interactive virtual microscope.
            </p>
            <Link href="/virtual-lab/microscopy">
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Microscopy Lab
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Osmosis Experiments - Grade 9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors text-blue-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Osmosis Investigation
            </CardTitle>
            <CardDescription className="text-blue-700">Grade 9 CBC - Cell Transport Mechanisms</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700 mb-4">
              Investigate osmosis using potato cells, egg membranes, and plant tissues with AI-guided analysis.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Grade 9</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">AI Assisted</span>
            </div>
            <Link href="/virtual-lab/osmosis">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Play className="h-4 w-4 mr-2" />
                Start Osmosis Lab
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Photosynthesis Lab - Grade 9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="group-hover:text-green-600 transition-colors text-green-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Photosynthesis Investigation
            </CardTitle>
            <CardDescription className="text-green-700">Grade 9 CBC - Plant Nutrition & Energy</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 mb-4">
              Explore photosynthesis factors: light intensity, CO₂ concentration, and temperature with AI guidance.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Grade 9</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">AI Tutor</span>
            </div>
            <Link href="/virtual-lab/photosynthesis">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Investigate Photosynthesis
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Respiration Lab - Grade 9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="group-hover:text-orange-600 transition-colors text-orange-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Cellular Respiration Lab
            </CardTitle>
            <CardDescription className="text-orange-700">Grade 9 CBC - Energy Release in Cells</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-700 mb-4">
              Study aerobic and anaerobic respiration using germinating seeds and yeast with AI analysis.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Grade 9</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">AI Analytics</span>
            </div>
            <Link href="/virtual-lab/respiration">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Play className="h-4 w-4 mr-2" />
                Study Respiration
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Enzyme Activity Lab - Grade 9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader>
            <CardTitle className="group-hover:text-purple-600 transition-colors text-purple-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Enzyme Activity Investigation
            </CardTitle>
            <CardDescription className="text-purple-700">Grade 9 CBC - Biological Catalysts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700 mb-4">
              Investigate enzyme activity using catalase and amylase with temperature and pH variables.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Grade 9</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">AI Guided</span>
            </div>
            <Link href="/virtual-lab/enzymes">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Play className="h-4 w-4 mr-2" />
                Test Enzyme Activity
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: pH and Indicators Lab - Grade 9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
          <CardHeader>
            <CardTitle className="group-hover:text-pink-600 transition-colors text-pink-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              pH & Indicators Lab
            </CardTitle>
            <CardDescription className="text-pink-700">Grade 9 CBC - Acids, Bases & Indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-pink-700 mb-4">
              Test household substances using natural and synthetic indicators with AI-powered analysis.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Grade 9</span>
              <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded">AI Assistant</span>
            </div>
            <Link href="/virtual-lab/ph-indicators">
              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                <Play className="h-4 w-4 mr-2" />
                Test pH Levels
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Existing Atomic Structure Builder */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Atomic Structure</CardTitle>
            <CardDescription>Build and explore different atomic models</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Learn about protons, neutrons, and electrons by building interactive atomic models.
            </p>
            <Link href="/virtual-lab/atomic-structure">
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Build Atoms
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Existing Ecosystem Simulation */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Ecosystem Simulation</CardTitle>
            <CardDescription>Simulate an ecosystem and observe interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Study food chains, populations, and environmental factors in Kenyan ecosystems.
            </p>
            <Link href="/virtual-lab/ecosystem">
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Start Simulation
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Existing Solar System Explorer */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Solar System Explorer</CardTitle>
            <CardDescription>Explore planets and celestial bodies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Journey through our solar system and learn about planets, moons, and space phenomena.
            </p>
            <Link href="/virtual-lab/solar-system">
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Explore Space
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Existing Carbon Atom Builder */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Carbon Atom Builder</CardTitle>
            <CardDescription>Build carbon atoms and understand bonding</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Construct carbon atoms and explore how they form bonds in organic compounds.
            </p>
            <Link href="/virtual-lab/atomic-structure/carbon-builder">
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Build Carbon
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Existing Sodium Atom Builder */}
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="group-hover:text-blue-600 transition-colors">Sodium Atom Builder</CardTitle>
            <CardDescription>Build sodium atoms and study ionic bonding</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Construct sodium atoms and learn about ionic bonding and electron transfer.
            </p>
            <Link href="/virtual-lab/atomic-structure/sodium-builder">
              <Button className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Build Sodium
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Existing Water Purification Experiment */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="group-hover:text-green-600 transition-colors text-green-800">
              Water Purification Methods
            </CardTitle>
            <CardDescription className="text-green-700">Explore different methods of purifying water</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700 mb-4">
              Learn about filtration, distillation, and other purification techniques relevant to Kenya.
            </p>
            <Link href="/virtual-lab/water-purification-experiment">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Start Water Lab
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Existing AI Designer Tool */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="group-hover:text-purple-600 transition-colors text-purple-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Designer Tool
            </CardTitle>
            <CardDescription className="text-purple-700">Create custom experiments with AI assistance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-700 mb-4">
              Use our AI-powered tool to design and create your own virtual lab experiments.
            </p>
            <Link href="/virtual-lab/ai-designer">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Design Experiment
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* NEW: Animal Nutrition & Digestion Lab - Grade 9 CBC */}
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="group-hover:text-amber-600 transition-colors text-amber-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Animal Nutrition & Digestion
            </CardTitle>
            <CardDescription className="text-amber-700">Grade 9 CBC - Nutrition & Digestive Systems</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 mb-4">
              Explore modes of nutrition, dentition patterns, tooth types, and human digestion with interactive models
              and AI guidance.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Grade 9</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">AI Guided</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Interactive</span>
            </div>
            <Link href="/virtual-lab/animal-nutrition-digestion">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                <Play className="h-4 w-4 mr-2" />
                Explore Nutrition & Digestion
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
