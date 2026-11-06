// This file contains mock API functions that would normally connect to your Flask backend

import { toast } from "sonner"

const API_BASE_URL = "http://localhost:5000"

export async function uploadData(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await fetch(`${API_BASE_URL}/upload-data`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    toast.error("Failed to upload file: " + errorMessage)
    throw error
  }
}

export async function analyzeData(data: any[], analysisType: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        type: analysisType,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    toast.error("Failed to analyze data: " + errorMessage)
    throw error
  }
}

export async function getPlot(data: any[], analysisType: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/plot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        type: analysisType,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    toast.error("Failed to generate plot: " + errorMessage)
    throw error
  }
}

export async function getAnalysisOptions() {
  try {
    const response = await fetch(`${API_BASE_URL}/options`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.options
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    toast.error("Failed to fetch analysis options: " + errorMessage)
    throw error
  }
}

// Mock analysis functions

function performRegression(data: { x: number; y: number }[]) {
  // Simple linear regression
  const n = data.length

  // Calculate means
  const meanX = data.reduce((sum, point) => sum + point.x, 0) / n
  const meanY = data.reduce((sum, point) => sum + point.y, 0) / n

  // Calculate coefficients
  let numerator = 0
  let denominator = 0

  for (const point of data) {
    numerator += (point.x - meanX) * (point.y - meanY)
    denominator += (point.x - meanX) ** 2
  }

  const coefficients = numerator / denominator
  const intercept = meanY - coefficients * meanX

  // Calculate predictions
  const predictions = data.map((point) => coefficients * point.x + intercept)

  return {
    coefficients,
    intercept,
    predictions,
  }
}

function findPeaks(data: { x: number; y: number }[]) {
  // Simple peak detection
  const yValues = data.map((point) => point.y)
  const peaks: number[] = []

  // A point is a peak if it's greater than its neighbors
  for (let i = 1; i < yValues.length - 1; i++) {
    if (yValues[i] > yValues[i - 1] && yValues[i] > yValues[i + 1]) {
      peaks.push(i)
    }
  }

  return {
    peaks,
  }
}

function calculateAmplitude(data: { x: number; y: number }[]) {
  // Calculate amplitude (max - min)
  const yValues = data.map((point) => point.y)
  const max = Math.max(...yValues)
  const min = Math.min(...yValues)
  const amplitude = max - min

  return {
    amplitude,
    max,
    min,
  }
}

function analyzeDistribution(data: { x: number; y: number }[]) {
  // Calculate mean and standard deviation
  const yValues = data.map((point) => point.y)
  const n = yValues.length

  // Mean
  const mu = yValues.reduce((sum, y) => sum + y, 0) / n

  // Standard deviation
  const variance = yValues.reduce((sum, y) => sum + (y - mu) ** 2, 0) / n
  const std = Math.sqrt(variance)

  // Create a simple histogram
  const min = Math.min(...yValues)
  const max = Math.max(...yValues)
  const binCount = 10
  const binWidth = (max - min) / binCount

  const histogram = Array(binCount).fill(0)

  for (const y of yValues) {
    const binIndex = Math.min(Math.floor((y - min) / binWidth), binCount - 1)
    histogram[binIndex]++
  }

  return {
    mu,
    std,
    histogram,
  }
}
