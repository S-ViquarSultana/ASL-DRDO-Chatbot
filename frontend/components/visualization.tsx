"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useData } from "@/context/data-context"
import {
  BarChart,
  LineChart,
  ScatterChart,
  AreaChart,
  ChartContainer,
  ChartTooltip,
  ChartTitle,
  ChartLegend,
} from "@/components/ui/chart"
import { Download, RefreshCw, TrendingUp, Activity, BarChart2, PieChart } from "lucide-react"
import { getPlot } from "@/lib/api"

export default function Visualization() {
  const { data, analysisResults, analysisType } = useData()
  const [activeTab, setActiveTab] = useState("results")
  const [plotImage, setPlotImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (analysisResults && analysisType) {
      fetchPlot()
    }
  }, [analysisResults, analysisType])

  const fetchPlot = async () => {
    if (!data || !analysisType) return

    setLoading(true)
    try {
      const result = await getPlot(data, analysisType)
      if (result.success && result.plotData) {
        setPlotImage(result.plotData)
      }
    } catch (error) {
      console.error("Error fetching plot:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAnalysisIcon = () => {
    switch (analysisType) {
      case "regression":
        return <TrendingUp className="h-5 w-5" />
      case "peaks":
        return <Activity className="h-5 w-5" />
      case "amplitude":
        return <BarChart2 className="h-5 w-5" />
      case "distribution":
        return <PieChart className="h-5 w-5" />
      default:
        return null
    }
  }

  const getAnalysisTitle = () => {
    if (!analysisType) return "Analysis Results"
    return `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis Results`
  }

  const renderResultsContent = () => {
    if (!analysisResults) {
      return (
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">No Analysis Results</h3>
          <p className="text-muted-foreground">Please perform an analysis first</p>
        </div>
      )
    }

    switch (analysisType) {
      case "regression":
        return renderRegressionResults()
      case "peaks":
        return renderPeaksResults()
      case "amplitude":
        return renderAmplitudeResults()
      case "distribution":
        return renderDistributionResults()
      default:
        return (
          <div className="text-center p-8">
            <h3 className="text-lg font-medium mb-2">Unknown Analysis Type</h3>
            <p className="text-muted-foreground">The analysis type is not recognized</p>
          </div>
        )
    }
  }

  const renderRegressionResults = () => {
    const { coefficients, intercept, predictions } = analysisResults

    // Create data for chart
    const chartData = data.map((row, index) => ({
      x: row[0],
      actual: row[1],
      predicted: predictions[index],
    }))

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Coefficients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{coefficients.toFixed(4)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Intercept</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{intercept.toFixed(4)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Equation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                y = {coefficients.toFixed(2)}x + {intercept.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Regression Analysis</CardTitle>
            <CardDescription>Actual vs Predicted Values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer>
                <ChartTitle>Regression Analysis</ChartTitle>
                <ScatterChart
                  data={chartData}
                  series={[
                    {
                      type: "scatter",
                      label: "Actual Data",
                      data: chartData.map((d) => ({ x: d.x, y: d.actual })),
                      valueFormatter: (value) => `${value.toFixed(2)}`,
                    },
                    {
                      type: "line",
                      label: "Regression Line",
                      data: chartData.map((d) => ({ x: d.x, y: d.predicted })),
                      valueFormatter: (value) => `${value.toFixed(2)}`,
                      color: "red",
                    },
                  ]}
                  xAxisKey="x"
                  yAxisKey="y"
                />
                <ChartTooltip />
                <ChartLegend />
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderPeaksResults = () => {
    const { peaks } = analysisResults

    // Create data for chart
    const chartData = data.map((row, index) => ({
      x: index,
      y: Number.parseFloat(row[1]),
      isPeak: peaks.includes(index),
    }))

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Detection</CardTitle>
            <CardDescription>Found {peaks.length} peaks in the data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer>
                <ChartTitle>Peak Detection</ChartTitle>
                <LineChart
                  data={chartData}
                  series={[
                    {
                      type: "line",
                      label: "Data",
                      data: chartData.map((d) => ({ x: d.x, y: d.y })),
                      valueFormatter: (value) => `${value.toFixed(2)}`,
                    },
                    {
                      type: "scatter",
                      label: "Peaks",
                      data: chartData.filter((d) => d.isPeak).map((d) => ({ x: d.x, y: d.y })),
                      valueFormatter: (value) => `${value.toFixed(2)}`,
                      color: "red",
                    },
                  ]}
                  xAxisKey="x"
                  yAxisKey="y"
                />
                <ChartTooltip />
                <ChartLegend />
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Indices</CardTitle>
            <CardDescription>Indices where peaks were detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {peaks.map((peak, index) => (
                <div key={index} className="px-3 py-1 bg-primary/10 rounded-full text-sm">
                  Index: {peak}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderAmplitudeResults = () => {
    const { amplitude, max, min } = analysisResults

    // Create data for chart
    const chartData = data.map((row, index) => ({
      x: index,
      y: Number.parseFloat(row[1]),
    }))

    const maxIndex = chartData.findIndex((d) => d.y === max)
    const minIndex = chartData.findIndex((d) => d.y === min)

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Amplitude</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{amplitude.toFixed(4)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Maximum Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{max.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground">at index {maxIndex}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Minimum Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{min.toFixed(4)}</p>
              <p className="text-xs text-muted-foreground">at index {minIndex}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Amplitude Analysis</CardTitle>
            <CardDescription>Maximum and Minimum Values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer>
                <ChartTitle>Amplitude Analysis</ChartTitle>
                <AreaChart
                  data={chartData}
                  series={[
                    {
                      type: "area",
                      label: "Data",
                      data: chartData.map((d) => ({ x: d.x, y: d.y })),
                      valueFormatter: (value) => `${value.toFixed(2)}`,
                    },
                    {
                      type: "scatter",
                      label: "Max",
                      data: [{ x: maxIndex, y: max }],
                      valueFormatter: (value) => `${value.toFixed(2)}`,
                      color: "green",
                    },
                    {
                      type: "scatter",
                      label: "Min",
                      data: [{ x: minIndex, y: min }],
                      valueFormatter: (value) => `${value.toFixed(2)}`,
                      color: "red",
                    },
                  ]}
                  xAxisKey="x"
                  yAxisKey="y"
                />
                <ChartTooltip />
                <ChartLegend />
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderDistributionResults = () => {
    const { mu, std, histogram } = analysisResults

    // Create data for chart
    const chartData = histogram.map((count, index) => ({
      bin: index,
      count: count,
    }))

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Mean (μ)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{mu.toFixed(4)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Standard Deviation (σ)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{std.toFixed(4)}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Distribution Analysis</CardTitle>
            <CardDescription>Histogram of Data Distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer>
                <ChartTitle>Data Distribution</ChartTitle>
                <BarChart
                  data={chartData}
                  series={[
                    {
                      type: "bar",
                      label: "Frequency",
                      data: chartData.map((d) => ({ x: d.bin, y: d.count })),
                      valueFormatter: (value) => `${value}`,
                    },
                  ]}
                  xAxisKey="x"
                  yAxisKey="y"
                />
                <ChartTooltip />
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analysisResults || !analysisType) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium mb-2">No Analysis Results</h3>
        <p className="text-muted-foreground">Please perform an analysis first</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getAnalysisIcon()}
              {getAnalysisTitle()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchPlot} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="plot">Plot</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="pt-4">
              {renderResultsContent()}
            </TabsContent>
            <TabsContent value="plot" className="pt-4">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p>Loading plot...</p>
                  </div>
                </div>
              ) : plotImage ? (
                <div className="flex justify-center">
                  <img
                    src={plotImage || "/placeholder.svg"}
                    alt={`${analysisType} plot`}
                    className="max-w-full h-auto border rounded-md"
                  />
                </div>
              ) : (
                <div className="text-center p-8">
                  <h3 className="text-lg font-medium mb-2">No Plot Available</h3>
                  <p className="text-muted-foreground">Click refresh to generate a plot</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
