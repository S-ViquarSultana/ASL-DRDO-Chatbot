"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataUpload from "@/components/data-upload"
import AnalysisOptions from "@/components/analysis-options"
import Visualization from "@/components/visualization"
import Chatbot from "@/components/chatbot"
import ThemeToggle from "@/components/theme-toggle"
import { DataProvider } from "@/context/data-context"

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <DataProvider>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <header className="container mx-auto flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Data Analysis Dashboard</h1>
          <ThemeToggle />
        </header>

        <main className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload">Upload Data</TabsTrigger>
                  <TabsTrigger value="analyze">Analyze</TabsTrigger>
                  <TabsTrigger value="visualize">Visualize</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="p-4 border rounded-md mt-2">
                  <DataUpload onUploadComplete={() => setActiveTab("analyze")} />
                </TabsContent>
                <TabsContent value="analyze" className="p-4 border rounded-md mt-2">
                  <AnalysisOptions onAnalysisComplete={() => setActiveTab("visualize")} />
                </TabsContent>
                <TabsContent value="visualize" className="p-4 border rounded-md mt-2">
                  <Visualization />
                </TabsContent>
              </Tabs>
            </div>
            <div className="lg:col-span-1">
              <Chatbot />
            </div>
          </div>
        </main>
      </div>
    </DataProvider>
  )
}
