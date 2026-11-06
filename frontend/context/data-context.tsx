"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DataContextType {
  data: any[] | null
  setData: (data: any[] | null) => void
  analysisResults: any | null
  setAnalysisResults: (results: any | null) => void
  analysisType: string | null
  setAnalysisType: (type: string | null) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any[] | null>(null)
  const [analysisResults, setAnalysisResults] = useState<any | null>(null)
  const [analysisType, setAnalysisType] = useState<string | null>(null)

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        analysisResults,
        setAnalysisResults,
        analysisType,
        setAnalysisType,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
