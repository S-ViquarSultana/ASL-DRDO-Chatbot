"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/context/data-context"
import { analyzeData } from "@/lib/api"
import { TrendingUp, Activity, BarChart2, PieChart, Loader2 } from "lucide-react"
import { getFakeAnalysis } from "@/lib/utils/fakeanalysis" // adjust path

interface AnalysisOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

interface AnalysisOptionsProps {
  onAnalysisComplete: () => void
}

export default function AnalysisOptions({ onAnalysisComplete }: AnalysisOptionsProps) {
  const { toast } = useToast()
  const { data, setAnalysisResults, setAnalysisType } = useData()
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // New local state for rendering fake/hardcoded results in frontend
  const [localResults, setLocalResults] = useState<any | null>(null);

  const analysisOptions: AnalysisOption[] = [
    {
      id: "lasso_regression",
      name: "Lasso Regression Analysis",
      description: "Fit a line to your data and predict values",
      icon: <TrendingUp className="h-6 w-6" />,
    },
    {
      id: "peaks",
      name: "Peak Detection",
      description: "Find peaks and valleys in your data",
      icon: <Activity className="h-6 w-6" />,
    },
    {
      id: "amplitude",
      name: "Amplitude Calculation",
      description: "Calculate the difference between max and min values",
      icon: <BarChart2 className="h-6 w-6" />,
    },
    {
      id: "distribution",
      name: "Distribution Analysis",
      description: "Analyze the statistical distribution of your data",
      icon: <PieChart className="h-6 w-6" />,
    },
  ]

  const handleAnalysis = async (optionId: string) => {
    if (!data || data.length === 0) {
      toast({
        title: "No Data Available",
        description: "Please upload data before performing analysis",
        variant: "destructive",
      });
      return;
    }
  
    setLoading(true);
    setSelectedOption(optionId);

    try {
      // Uncomment this if you want to call real backend
      // const result = await analyzeData(data, optionId);

      // Using fake data for frontend display
      const finalResult = getFakeAnalysis(optionId, data.length);

      if (finalResult.results) {
        setAnalysisResults(finalResult);
        setLocalResults(finalResult); // set local results for display here
        setAnalysisType(optionId);
      
        toast({
          title: "✅ Analysis Completed",
          description: `${optionId.replaceAll("_", " ")} completed`,
        });

        //setTimeout(() => {
        //onAnalysisComplete();
        //}, 1000);
      } else {
        throw new Error("Invalid response from server");
      }

      // If you want to handle actual backend response, add below
      // if (result.analysis_result) {
      //   setAnalysisResults(result);
      //   setAnalysisType(optionId);
      //   toast({
      //     title: "Analysis Complete",
      //     description: `${optionId.charAt(0).toUpperCase() + optionId.slice(1)} analysis completed successfully`,
      //   });
      //   setTimeout(() => {
      //     onAnalysisComplete();
      //   }, 1000);
      // } else {
      //   throw new Error("Invalid response from server");
      // }

    } catch (err: any) {
      toast({
        title: "Analysis Failed",
        description: err.message || "Error performing analysis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!localResults || !selectedOption) return null;

    const results = localResults.results;

    switch (selectedOption) {
      case "lasso_regression":
        return (
          <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2">Lasso Regression Results</h3>
            <p><strong>Coefficients:</strong> {JSON.stringify(results.coefficients)}</p>
            <p><strong>Intercept:</strong> {results.intercept}</p>
            <p><strong>MSE:</strong> {results.mse}</p>
            <p><strong>R2 Score:</strong> {results.r2_score}</p>
          </div>
        );
      case "peaks":
        return (
          <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2">Peak Detection Results</h3>
            <p><strong>Detected Peaks at indices:</strong> {results.peaks.join(", ")}</p>
          </div>
        );
      case "amplitude":
        return (
          <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2">Amplitude Calculation</h3>
            <p><strong>Amplitude (max - min):</strong> {results.amplitude}</p>
          </div>
        );
      case "distribution":
        return (
          <div className="mt-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-2">Distribution Analysis</h3>
            <p><strong>Mean (μ):</strong> {results.mu}</p>
            <p><strong>Standard Deviation (σ):</strong> {results.std}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">No Data Available</h3>
        <p className="text-muted-foreground">Please upload data first to perform analysis</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisOptions.map((option) => (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedOption === option.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => !loading && handleAnalysis(option.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  {option.icon}
                  {option.name}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant={selectedOption === option.id ? "default" : "outline"}
                  className="w-full"
                  disabled={loading}
                >
                  {loading && selectedOption === option.id ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    "Select"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {selectedOption && !loading && (
          <div className="mt-4 text-center">
            <Button onClick={onAnalysisComplete}>Next</Button>
          </div>
        )}
      </div>

      {/* Render analysis results below buttons */}
      {renderResults()}
    </>
  )
}
