"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Save, Download, Upload, Brain, Zap, Target, FileText, Code, Play, Pause } from "lucide-react"

interface TrainingParameters {
  // Model Architecture
  modelType: "transformer" | "lstm" | "gpt" | "bert" | "custom"
  modelSize: "small" | "medium" | "large" | "xl"
  hiddenSize: number
  numLayers: number
  numHeads: number
  vocabularySize: number
  maxSequenceLength: number

  // Training Configuration
  epochs: number
  batchSize: number
  learningRate: number
  warmupSteps: number
  weightDecay: number
  gradientClipping: number

  // Optimization
  optimizer: "adam" | "adamw" | "sgd" | "rmsprop"
  scheduler: "linear" | "cosine" | "polynomial" | "constant"
  beta1: number
  beta2: number
  epsilon: number

  // Regularization
  dropout: number
  attentionDropout: number
  layerNorm: boolean
  residualConnections: boolean

  // Advanced Settings
  mixedPrecision: boolean
  gradientAccumulation: number
  dataParallel: boolean
  checkpointFrequency: number
  evaluationSteps: number
  earlyStoppingPatience: number

  // CBC Specific
  curriculumAlignment: boolean
  gradeLevel: string[]
  subjects: string[]
  kenyanContext: boolean
  swahiliSupport: boolean

  // Custom Instructions
  systemPrompt: string
  trainingInstructions: string
  evaluationCriteria: string
  customObjectives: string[]
}

const defaultParameters: TrainingParameters = {
  modelType: "transformer",
  modelSize: "medium",
  hiddenSize: 768,
  numLayers: 12,
  numHeads: 12,
  vocabularySize: 50000,
  maxSequenceLength: 1024,
  epochs: 10,
  batchSize: 32,
  learningRate: 0.0001,
  warmupSteps: 1000,
  weightDecay: 0.01,
  gradientClipping: 1.0,
  optimizer: "adamw",
  scheduler: "linear",
  beta1: 0.9,
  beta2: 0.999,
  epsilon: 1e-8,
  dropout: 0.1,
  attentionDropout: 0.1,
  layerNorm: true,
  residualConnections: true,
  mixedPrecision: true,
  gradientAccumulation: 4,
  dataParallel: true,
  checkpointFrequency: 1000,
  evaluationSteps: 500,
  earlyStoppingPatience: 3,
  curriculumAlignment: true,
  gradeLevel: ["grade4", "grade5", "grade6"],
  subjects: ["mathematics", "english", "science"],
  kenyanContext: true,
  swahiliSupport: true,
  systemPrompt:
    "You are a CBC curriculum tutor for Kenyan students. Provide educational support aligned with KICD standards.",
  trainingInstructions: "",
  evaluationCriteria: "",
  customObjectives: [],
}

export function TrainingParameterEditor() {
  const [parameters, setParameters] = useState<TrainingParameters>(defaultParameters)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [presetName, setPresetName] = useState("")
  const [savedPresets, setSavedPresets] = useState<string[]>([])

  useEffect(() => {
    loadSavedPresets()
  }, [])

  const loadSavedPresets = () => {
    const presets = localStorage.getItem("training-presets")
    if (presets) {
      setSavedPresets(JSON.parse(presets))
    }
  }

  const updateParameter = (key: keyof TrainingParameters, value: any) => {
    setParameters((prev) => ({ ...prev, [key]: value }))
  }

  const savePreset = () => {
    if (!presetName.trim()) return

    const presets = { ...JSON.parse(localStorage.getItem("training-presets") || "{}") }
    presets[presetName] = parameters
    localStorage.setItem("training-presets", JSON.stringify(presets))
    setSavedPresets(Object.keys(presets))
    setPresetName("")
  }

  const loadPreset = (name: string) => {
    const presets = JSON.parse(localStorage.getItem("training-presets") || "{}")
    if (presets[name]) {
      setParameters(presets[name])
    }
  }

  const exportParameters = () => {
    const dataStr = JSON.stringify(parameters, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `training-parameters-${Date.now()}.json`
    link.click()
  }

  const importParameters = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        setParameters({ ...defaultParameters, ...imported })
      } catch (error) {
        console.error("Failed to import parameters:", error)
      }
    }
    reader.readAsText(file)
  }

  const startTraining = async () => {
    setIsTraining(true)
    setTrainingProgress(0)

    try {
      const response = await fetch("/api/ai/training/start-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parameters,
          name: `Custom Training ${Date.now()}`,
        }),
      })

      if (response.ok) {
        // Simulate training progress
        const interval = setInterval(() => {
          setTrainingProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              setIsTraining(false)
              return 100
            }
            return prev + Math.random() * 5
          })
        }, 1000)
      }
    } catch (error) {
      console.error("Training failed:", error)
      setIsTraining(false)
    }
  }

  const generateTrainingScript = () => {
    return `#!/usr/bin/env python3
"""
CBC Tutorbot Custom Training Script
Generated on: ${new Date().toISOString()}
"""

import torch
import torch.nn as nn
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from datasets import load_dataset
import wandb

# Training Configuration
CONFIG = {
    "model_type": "${parameters.modelType}",
    "model_size": "${parameters.modelSize}",
    "hidden_size": ${parameters.hiddenSize},
    "num_layers": ${parameters.numLayers},
    "num_heads": ${parameters.numHeads},
    "vocab_size": ${parameters.vocabularySize},
    "max_length": ${parameters.maxSequenceLength},
    
    "epochs": ${parameters.epochs},
    "batch_size": ${parameters.batchSize},
    "learning_rate": ${parameters.learningRate},
    "warmup_steps": ${parameters.warmupSteps},
    "weight_decay": ${parameters.weightDecay},
    "gradient_clipping": ${parameters.gradientClipping},
    
    "optimizer": "${parameters.optimizer}",
    "scheduler": "${parameters.scheduler}",
    "beta1": ${parameters.beta1},
    "beta2": ${parameters.beta2},
    "epsilon": ${parameters.epsilon},
    
    "dropout": ${parameters.dropout},
    "attention_dropout": ${parameters.attentionDropout},
    "layer_norm": ${parameters.layerNorm},
    "residual_connections": ${parameters.residualConnections},
    
    "mixed_precision": ${parameters.mixedPrecision},
    "gradient_accumulation": ${parameters.gradientAccumulation},
    "data_parallel": ${parameters.dataParallel},
    "checkpoint_frequency": ${parameters.checkpointFrequency},
    "evaluation_steps": ${parameters.evaluationSteps},
    "early_stopping_patience": ${parameters.earlyStoppingPatience},
    
    "curriculum_alignment": ${parameters.curriculumAlignment},
    "grade_levels": ${JSON.stringify(parameters.gradeLevel)},
    "subjects": ${JSON.stringify(parameters.subjects)},
    "kenyan_context": ${parameters.kenyanContext},
    "swahili_support": ${parameters.swahiliSupport},
}

# System Prompt
SYSTEM_PROMPT = """${parameters.systemPrompt}"""

# Training Instructions
TRAINING_INSTRUCTIONS = """${parameters.trainingInstructions}"""

# Evaluation Criteria
EVALUATION_CRITERIA = """${parameters.evaluationCriteria}"""

def main():
    # Initialize wandb
    wandb.init(
        project="cbc-tutorbot-custom",
        config=CONFIG,
        name=f"custom-training-{CONFIG['model_type']}-{CONFIG['model_size']}"
    )
    
    # Load tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
    model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
    
    # Add special tokens for CBC context
    special_tokens = {
        "additional_special_tokens": [
            "<|cbc|>", "<|grade|>", "<|subject|>", "<|kenyan|>", "<|swahili|>"
        ]
    }
    tokenizer.add_special_tokens(special_tokens)
    model.resize_token_embeddings(len(tokenizer))
    
    # Load and prepare dataset
    dataset = load_dataset("json", data_files="training_data.jsonl")
    
    def tokenize_function(examples):
        # Add CBC context tokens
        texts = []
        for text in examples["text"]:
            if CONFIG["curriculum_alignment"]:
                text = f"<|cbc|>{text}"
            if CONFIG["kenyan_context"]:
                text = f"<|kenyan|>{text}"
            texts.append(text)
        
        return tokenizer(
            texts,
            truncation=True,
            padding="max_length",
            max_length=CONFIG["max_length"]
        )
    
    tokenized_dataset = dataset.map(tokenize_function, batched=True)
    
    # Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False
    )
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir="./cbc-tutorbot-custom",
        num_train_epochs=CONFIG["epochs"],
        per_device_train_batch_size=CONFIG["batch_size"],
        gradient_accumulation_steps=CONFIG["gradient_accumulation"],
        learning_rate=CONFIG["learning_rate"],
        warmup_steps=CONFIG["warmup_steps"],
        weight_decay=CONFIG["weight_decay"],
        max_grad_norm=CONFIG["gradient_clipping"],
        
        logging_steps=100,
        save_steps=CONFIG["checkpoint_frequency"],
        eval_steps=CONFIG["evaluation_steps"],
        evaluation_strategy="steps",
        
        fp16=CONFIG["mixed_precision"],
        dataloader_num_workers=4,
        remove_unused_columns=False,
        
        report_to="wandb",
        run_name=f"cbc-custom-{CONFIG['model_type']}"
    )
    
    # Custom trainer with CBC-specific metrics
    class CBCTrainer(Trainer):
        def compute_loss(self, model, inputs, return_outputs=False):
            labels = inputs.get("labels")
            outputs = model(**inputs)
            
            # Standard language modeling loss
            loss = outputs.loss
            
            # Add CBC-specific regularization
            if CONFIG["curriculum_alignment"]:
                # Add curriculum alignment penalty
                curriculum_penalty = self.compute_curriculum_alignment_loss(outputs, labels)
                loss += 0.1 * curriculum_penalty
            
            return (loss, outputs) if return_outputs else loss
        
        def compute_curriculum_alignment_loss(self, outputs, labels):
            # Placeholder for curriculum alignment loss
            return torch.tensor(0.0, device=outputs.logits.device)
    
    # Initialize trainer
    trainer = CBCTrainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        eval_dataset=tokenized_dataset.get("validation"),
        data_collator=data_collator,
        tokenizer=tokenizer,
    )
    
    # Start training
    print("Starting CBC Tutorbot custom training...")
    print(f"Configuration: {CONFIG}")
    print(f"System Prompt: {SYSTEM_PROMPT}")
    
    trainer.train()
    
    # Save final model
    trainer.save_model("./cbc-tutorbot-final")
    tokenizer.save_pretrained("./cbc-tutorbot-final")
    
    print("Training completed successfully!")
    wandb.finish()

if __name__ == "__main__":
    main()
`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Model Training Parameters</h1>
          <p className="text-muted-foreground">Configure and customize training parameters for CBC Tutorbot models</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportParameters}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </span>
            </Button>
            <input type="file" accept=".json" onChange={importParameters} className="hidden" />
          </label>
          <Button onClick={startTraining} disabled={isTraining}>
            {isTraining ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Training...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Training
              </>
            )}
          </Button>
        </div>
      </div>

      {isTraining && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Training Progress</span>
                <span className="text-sm">{trainingProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${trainingProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="architecture" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="cbc">CBC Settings</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="presets">Presets</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Model Architecture
              </CardTitle>
              <CardDescription>Configure the neural network architecture and model size</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Model Type</Label>
                    <Select value={parameters.modelType} onValueChange={(value) => updateParameter("modelType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transformer">Transformer</SelectItem>
                        <SelectItem value="gpt">GPT</SelectItem>
                        <SelectItem value="bert">BERT</SelectItem>
                        <SelectItem value="lstm">LSTM</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Model Size</Label>
                    <Select value={parameters.modelSize} onValueChange={(value) => updateParameter("modelSize", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (125M params)</SelectItem>
                        <SelectItem value="medium">Medium (350M params)</SelectItem>
                        <SelectItem value="large">Large (774M params)</SelectItem>
                        <SelectItem value="xl">XL (1.5B params)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Hidden Size: {parameters.hiddenSize}</Label>
                    <Slider
                      value={[parameters.hiddenSize]}
                      onValueChange={([value]) => updateParameter("hiddenSize", value)}
                      min={256}
                      max={2048}
                      step={64}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Number of Layers: {parameters.numLayers}</Label>
                    <Slider
                      value={[parameters.numLayers]}
                      onValueChange={([value]) => updateParameter("numLayers", value)}
                      min={6}
                      max={24}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Attention Heads: {parameters.numHeads}</Label>
                    <Slider
                      value={[parameters.numHeads]}
                      onValueChange={([value]) => updateParameter("numHeads", value)}
                      min={8}
                      max={32}
                      step={4}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Vocabulary Size</Label>
                    <Input
                      type="number"
                      value={parameters.vocabularySize}
                      onChange={(e) => updateParameter("vocabularySize", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Max Sequence Length</Label>
                    <Input
                      type="number"
                      value={parameters.maxSequenceLength}
                      onChange={(e) => updateParameter("maxSequenceLength", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={parameters.layerNorm}
                      onCheckedChange={(checked) => updateParameter("layerNorm", checked)}
                    />
                    <Label>Layer Normalization</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={parameters.residualConnections}
                      onCheckedChange={(checked) => updateParameter("residualConnections", checked)}
                    />
                    <Label>Residual Connections</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Training Configuration
              </CardTitle>
              <CardDescription>Set training hyperparameters and optimization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Epochs: {parameters.epochs}</Label>
                    <Slider
                      value={[parameters.epochs]}
                      onValueChange={([value]) => updateParameter("epochs", value)}
                      min={1}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Batch Size: {parameters.batchSize}</Label>
                    <Slider
                      value={[parameters.batchSize]}
                      onValueChange={([value]) => updateParameter("batchSize", value)}
                      min={8}
                      max={128}
                      step={8}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Learning Rate: {parameters.learningRate}</Label>
                    <Slider
                      value={[parameters.learningRate * 10000]}
                      onValueChange={([value]) => updateParameter("learningRate", value / 10000)}
                      min={1}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Warmup Steps</Label>
                    <Input
                      type="number"
                      value={parameters.warmupSteps}
                      onChange={(e) => updateParameter("warmupSteps", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Weight Decay: {parameters.weightDecay}</Label>
                    <Slider
                      value={[parameters.weightDecay * 100]}
                      onValueChange={([value]) => updateParameter("weightDecay", value / 100)}
                      min={0}
                      max={10}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Gradient Clipping: {parameters.gradientClipping}</Label>
                    <Slider
                      value={[parameters.gradientClipping]}
                      onValueChange={([value]) => updateParameter("gradientClipping", value)}
                      min={0.1}
                      max={5.0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Dropout: {parameters.dropout}</Label>
                    <Slider
                      value={[parameters.dropout * 100]}
                      onValueChange={([value]) => updateParameter("dropout", value / 100)}
                      min={0}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Attention Dropout: {parameters.attentionDropout}</Label>
                    <Slider
                      value={[parameters.attentionDropout * 100]}
                      onValueChange={([value]) => updateParameter("attentionDropout", value / 100)}
                      min={0}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Optimization Settings
              </CardTitle>
              <CardDescription>Configure optimizer and advanced training techniques</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Optimizer</Label>
                    <Select value={parameters.optimizer} onValueChange={(value) => updateParameter("optimizer", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adam">Adam</SelectItem>
                        <SelectItem value="adamw">AdamW</SelectItem>
                        <SelectItem value="sgd">SGD</SelectItem>
                        <SelectItem value="rmsprop">RMSprop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Learning Rate Scheduler</Label>
                    <Select value={parameters.scheduler} onValueChange={(value) => updateParameter("scheduler", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="cosine">Cosine</SelectItem>
                        <SelectItem value="polynomial">Polynomial</SelectItem>
                        <SelectItem value="constant">Constant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Beta1: {parameters.beta1}</Label>
                    <Slider
                      value={[parameters.beta1 * 100]}
                      onValueChange={([value]) => updateParameter("beta1", value / 100)}
                      min={80}
                      max={99}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Beta2: {parameters.beta2}</Label>
                    <Slider
                      value={[parameters.beta2 * 1000]}
                      onValueChange={([value]) => updateParameter("beta2", value / 1000)}
                      min={990}
                      max={999}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Gradient Accumulation Steps: {parameters.gradientAccumulation}</Label>
                    <Slider
                      value={[parameters.gradientAccumulation]}
                      onValueChange={([value]) => updateParameter("gradientAccumulation", value)}
                      min={1}
                      max={16}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Checkpoint Frequency</Label>
                    <Input
                      type="number"
                      value={parameters.checkpointFrequency}
                      onChange={(e) => updateParameter("checkpointFrequency", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Evaluation Steps</Label>
                    <Input
                      type="number"
                      value={parameters.evaluationSteps}
                      onChange={(e) => updateParameter("evaluationSteps", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={parameters.mixedPrecision}
                        onCheckedChange={(checked) => updateParameter("mixedPrecision", checked)}
                      />
                      <Label>Mixed Precision Training</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={parameters.dataParallel}
                        onCheckedChange={(checked) => updateParameter("dataParallel", checked)}
                      />
                      <Label>Data Parallel Training</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cbc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🇰🇪 CBC Curriculum Settings</CardTitle>
              <CardDescription>Configure CBC-specific training parameters and curriculum alignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={parameters.curriculumAlignment}
                      onCheckedChange={(checked) => updateParameter("curriculumAlignment", checked)}
                    />
                    <Label>CBC Curriculum Alignment</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={parameters.kenyanContext}
                      onCheckedChange={(checked) => updateParameter("kenyanContext", checked)}
                    />
                    <Label>Kenyan Cultural Context</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={parameters.swahiliSupport}
                      onCheckedChange={(checked) => updateParameter("swahiliSupport", checked)}
                    />
                    <Label>Kiswahili Language Support</Label>
                  </div>

                  <div>
                    <Label>Grade Levels</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["grade1", "grade2", "grade3", "grade4", "grade5", "grade6", "grade7", "grade8"].map((grade) => (
                        <div key={grade} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={parameters.gradeLevel.includes(grade)}
                            onChange={(e) => {
                              const newGrades = e.target.checked
                                ? [...parameters.gradeLevel, grade]
                                : parameters.gradeLevel.filter((g) => g !== grade)
                              updateParameter("gradeLevel", newGrades)
                            }}
                          />
                          <Label className="text-sm capitalize">{grade.replace("grade", "Grade ")}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Subjects</Label>
                    <div className="space-y-2 mt-2">
                      {[
                        "mathematics",
                        "english",
                        "kiswahili",
                        "science",
                        "social studies",
                        "creative arts",
                        "physical education",
                      ].map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={parameters.subjects.includes(subject)}
                            onChange={(e) => {
                              const newSubjects = e.target.checked
                                ? [...parameters.subjects, subject]
                                : parameters.subjects.filter((s) => s !== subject)
                              updateParameter("subjects", newSubjects)
                            }}
                          />
                          <Label className="text-sm capitalize">{subject}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Custom Learning Objectives</Label>
                    <Textarea
                      placeholder="Enter custom learning objectives, one per line..."
                      value={parameters.customObjectives.join("\n")}
                      onChange={(e) => updateParameter("customObjectives", e.target.value.split("\n").filter(Boolean))}
                      rows={6}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Manual Training Instructions
              </CardTitle>
              <CardDescription>Write custom instructions and prompts for model training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>System Prompt</Label>
                  <Textarea
                    placeholder="Define the AI's role and behavior..."
                    value={parameters.systemPrompt}
                    onChange={(e) => updateParameter("systemPrompt", e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Training Instructions</Label>
                  <Textarea
                    placeholder="Provide detailed training instructions and guidelines..."
                    value={parameters.trainingInstructions}
                    onChange={(e) => updateParameter("trainingInstructions", e.target.value)}
                    rows={8}
                  />
                </div>

                <div>
                  <Label>Evaluation Criteria</Label>
                  <Textarea
                    placeholder="Define how the model should be evaluated..."
                    value={parameters.evaluationCriteria}
                    onChange={(e) => updateParameter("evaluationCriteria", e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <h4 className="font-medium mb-2">Generated Training Script Preview</h4>
                  <ScrollArea className="h-64">
                    <pre className="text-xs">
                      <code>{generateTrainingScript().substring(0, 1000)}...</code>
                    </pre>
                  </ScrollArea>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const script = generateTrainingScript()
                      const blob = new Blob([script], { type: "text/plain" })
                      const url = URL.createObjectURL(blob)
                      const link = document.createElement("a")
                      link.href = url
                      link.download = "training_script.py"
                      link.click()
                    }}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Download Full Script
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Parameter Presets
              </CardTitle>
              <CardDescription>Save and load training parameter configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Preset name..."
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                />
                <Button onClick={savePreset} disabled={!presetName.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preset
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Saved Presets</h4>
                {savedPresets.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No saved presets</p>
                ) : (
                  <div className="grid gap-2">
                    {savedPresets.map((preset) => (
                      <div key={preset} className="flex items-center justify-between p-2 border rounded">
                        <span className="font-medium">{preset}</span>
                        <Button size="sm" variant="outline" onClick={() => loadPreset(preset)}>
                          Load
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Quick Presets</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setParameters({
                        ...defaultParameters,
                        modelSize: "small",
                        epochs: 5,
                        batchSize: 16,
                        learningRate: 0.0005,
                      })
                    }
                  >
                    🚀 Quick Training
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setParameters({
                        ...defaultParameters,
                        modelSize: "large",
                        epochs: 20,
                        batchSize: 8,
                        learningRate: 0.00005,
                        mixedPrecision: true,
                      })
                    }
                  >
                    🎯 High Quality
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setParameters({
                        ...defaultParameters,
                        curriculumAlignment: true,
                        kenyanContext: true,
                        swahiliSupport: true,
                        gradeLevel: ["grade4", "grade5", "grade6", "grade7"],
                        subjects: ["mathematics", "english", "kiswahili", "science", "social studies"],
                      })
                    }
                  >
                    🇰🇪 CBC Optimized
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setParameters({
                        ...defaultParameters,
                        modelSize: "medium",
                        mixedPrecision: true,
                        dataParallel: true,
                        gradientAccumulation: 8,
                      })
                    }
                  >
                    ⚡ GPU Optimized
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
