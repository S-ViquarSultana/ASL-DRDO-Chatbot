"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { useData } from "@/context/data-context";
import { API_BASE_URL } from "@/lib/constants";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  formattedTime?: string;
}

export default function Chatbot() {
  const { data, analysisType, setAnalysisType } = useData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your data analysis assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data && data.length > 0 && !messages.some((m) => m.content.includes("I see you've uploaded"))) {
      addBotMessage(
        "I see you've uploaded some data! Would you like to analyze it? You can try regression, peak detection, amplitude calculation, or distribution analysis."
      );
    }
  }, [data]);

  useEffect(() => {
    if (analysisType && !messages.some((m) => m.content.includes("Great! I've completed"))) {
      addBotMessage(
        `Great! I've completed the ${analysisType} analysis. You can view the results and visualizations in the Visualize tab.`
      );
    }
  }, [analysisType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      formattedTime: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToProcess = input;
    setInput("");

    // ✅ Use hardcoded chatbot logic
    await processUserMessage(messageToProcess);
  };
  const sendSequentialMessages = async (messages: string[], delay: number = 1200) => {
    if (messages.length === 0) return;
  
    // Pick a random message from the array
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomIndex];
  
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, delay));
  
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        content: randomMessage,
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  
    setIsTyping(false);
    scrollToBottom();
  };
  
  
  const processUserMessage = async (message: string) => {
    const lowerMessage = message.toLowerCase();
  
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      addBotMessage("Hello! How can I assist you with your data analysis today?");
    } else if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      addBotMessage("I can help you upload data, analyze it using regression or peak detection, calculate amplitude, and perform distribution analysis. You can also ask me to explain any concept!");
    } else if (lowerMessage.includes("upload") || lowerMessage.includes("csv") || lowerMessage.includes("file")) {
      addBotMessage("You can upload your CSV file in the 'Upload Data' tab. Make sure your file contains 2D data with numeric values and comma-separated columns.");
    } else if (lowerMessage.includes("regression")) {
       await sendSequentialMessages([
      "Regression is a statistical method used to model the relationship between a dependent variable and one or more independent variables. It helps us predict values and understand data trends.",
      "We support **Lasso Regression**, which is a regularized version of linear regression. It helps improve model generalization and automatically selects important features by shrinking irrelevant ones to zero.",
      "Lasso uses **L1 regularization**, which adds a penalty equal to the absolute value of the coefficients. This encourages sparsity in the model and reduces overfitting.",
      "To evaluate regression models like Lasso, we use key metrics",
      "**R² Score (Coefficient of Determination)**: It tells us how much of the variance in the dependent variable is explained by the model. A value closer to 1 means a better fit.",
      "**MSE (Mean Squared Error)**: The average of squared differences between predicted and actual values. Lower is better.",
      "**MAE (Mean Absolute Error)**: The average of absolute differences. More robust to outliers than MSE.",
      "**RMSE (Root Mean Squared Error)**: The square root of MSE. It maintains the unit of the target variable and is easier to interpret.",
      "Lasso regression is especially useful when you have a lot of features — it automatically removes the ones that don't contribute much, simplifying the model while maintaining accuracy.",
      "Would you like me to run Lasso regression on your uploaded dataset?"
    ]);
      if (data && data.length > 0) {
        try {
          addBotMessage("Running Lasso Regression...");
          const result = await analyzeData(data, "regression");
          addBotMessage(`Regression completed! You can view results and visualizations in the 'Visualize' tab.`);
          setAnalysisType("regression");
        } catch (error) {
          addBotMessage("Oops! Something went wrong during regression analysis.");
        }
      } else {
        addBotMessage("Please upload a dataset first to perform regression.");
      }
    } else if (lowerMessage.includes("what type of regression")) {
      addBotMessage("I recommend **Lasso Regression**. It's a form of linear regression that uses L1 regularization.");
      addBotMessage("Lasso automatically removes less useful features by shrinking their coefficients to zero, making your model more interpretable and less prone to overfitting.");
      addBotMessage("It’s especially powerful when you have high-dimensional data with many variables.");
    } else if (lowerMessage.includes("metrics") || lowerMessage.includes("evaluation")) {
      await sendSequentialMessages([
      "We use several metrics to evaluate regression models:",
      "🔹 **R² Score**: Measures how well the model explains the variance in the data. Closer to 1 is better.",
      "🔹 **MSE (Mean Squared Error)**: Shows average squared error. Lower is better.",
      "🔹 **MAE (Mean Absolute Error)**: Average absolute error. Less sensitive to outliers.",
      "🔹 **RMSE**: Square root of MSE. Easy to interpret since it’s in the same unit as the output.",
      "Lasso regression optimizes these metrics while keeping the model simple and generalizable."
    ]);
    } else if (lowerMessage.includes("performance") || lowerMessage.includes("how good")) {
      await sendSequentialMessages([
      "Performance of a regression model depends on how well it predicts unseen data.",
      "We look at R² to assess the model's explanatory power, and MSE/MAE to check the prediction error.",
      "Lasso generally performs well on high-dimensional datasets by ignoring irrelevant variables.",
      "If your model has a high R² and low MSE/MAE, it's considered a strong model.",
      "You can view performance plots in the Visualize tab."
      ]);
    } else if (lowerMessage.includes("peak") || lowerMessage.includes("detect")) {
      if (data && data.length > 0) {
        await sendSequentialMessages([
        "Peak detection identifies local maxima in your data. This is useful for signal analysis, heart rate patterns, and more.",
        "To use it, go to the Analyze tab and select 'Peak Detection'."
      ]);
        setAnalysisType("peaks");
      } else {
        addBotMessage("To perform peak detection, please upload a dataset first.");
      }
    } else if (lowerMessage.includes("amplitude")) {
      if (data && data.length > 0) {
        await sendSequentialMessages([
        "Amplitude calculation finds the difference between the maximum and minimum values in your dataset.",
        "This is useful for analyzing waveforms or signal strength."
        ]);
        setAnalysisType("amplitude");
      } else {
        addBotMessage("You’ll need to upload your data before performing amplitude analysis.");
      }
    } else if (lowerMessage.includes("distribution") || lowerMessage.includes("statistic")) {
      if (data && data.length > 0) {
        await sendSequentialMessages([
          "Distribution analysis reveals how your data is spread.",
        "We calculate stats like mean, median, standard deviation, skewness, and kurtosis.",
        "Go to the Analyze tab and select 'Distribution Analysis' to view detailed results."
      ]);
        setAnalysisType("distribution");
      } else {
        addBotMessage("Upload your dataset to begin distribution analysis.");
      }
    } else if (lowerMessage.includes("thank")) {
      addBotMessage("You're welcome! Feel free to ask anything related to data analysis or machine learning.");
    } else {
      // Fallback for unknown or broad questions
      await sendSequentialMessages([
      "I'm here to help with your data analysis.",
      "You can ask me about regression, peak detection, amplitude, distribution, or even the meaning of metrics like R² and MSE.",
      "Just upload a CSV file and I’ll guide you through the process."
    ]);
    }
  };

  const analyzeData = async (data: any[], analysisType: string) => {
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, type: analysisType }),
    });

    if (!response.ok) throw new Error("Server error");

    const result = await response.json();
    return result;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Data Analysis Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start gap-2 max-w-[80%]">
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{message.formattedTime}</p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="rounded-lg px-3 py-2 text-sm bg-muted">
                      <span className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce animation-delay-200">.</span>
                        <span className="animate-bounce animation-delay-400">.</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions
const getAnalysisOptions = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/analysis-options`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server error: ${errorText}`);
  }

  const data = await response.json();
  return data.options;
}

const analyzeData = async (data: any[], analysisType: string) => {
  // Replace with your backend URL and endpoint
  const response = await fetch("http://127.0.0.1:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data,
      type: analysisType
    }),
  });
  
  if (!response.ok) {
    throw new Error("Server error")
  }

  const result = await response.json()
  return result
}
