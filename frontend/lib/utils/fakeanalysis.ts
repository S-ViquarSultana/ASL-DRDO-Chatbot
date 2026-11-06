// fakeAnalysis.ts

export function getFakeAnalysis(optionId: string, rowCount: number = 100) {
    switch (optionId) {
      case "lasso_regression":
        return {
          results: {
            coefficients: [0.23, -0.12, 0.08],
            intercept: 12.7,
            predictions: Array(rowCount).fill(60 + Math.random() * 10),
            r2_score: 0.82,
            mse: 4.15,
            report: "Lasso regression applied with R² = 0.82 and MSE = 4.15. The model identified 3 major predictors.",
          },
          plot_base64: "", // optional dummy image
        };
  
      case "linear_regression":
        return {
          results: {
            coefficients: [1.5],
            intercept: 5,
            predictions: Array(rowCount).fill(50 + Math.random() * 20),
            r2_score: 0.75,
            mse: 6.0,
            report: "Linear regression gave an R² = 0.75 with moderate fit. Some variance remains unexplained.",
          },
          plot_base64: "",
        };
  
      case "correlation":
        return {
          results: {
            top_correlations: [
              { feature: "study_hours_per_day", correlation: 0.88 },
              { feature: "attendance_percentage", correlation: 0.71 },
            ],
            report: "Top correlated features with exam score: Study hours (0.88), Attendance (0.71).",
          },
          plot_base64: "",
        };
  
      case "distribution":
        return {
          results: {
            report: "Data appears normally distributed with some slight skew in 'sleep_hours' and 'social_media_hours'.",
          },
          plot_base64: "",
        };
  
      default:
        return {
          results: {
            report: `Analysis completed for ${optionId}. No detailed report available.`,
          },
          plot_base64: "",
        };
    }
  }
  