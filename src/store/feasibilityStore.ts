import { create } from 'zustand';

export interface StartupData {
  title: string;
  description: string;
}

export interface AnalysisResult {
  marketAnalysis: {
    marketSize: string;
    targetMarket: string;
    marketTrends: string[];
    opportunities: string[];
    risks: string[];
  };
  competitors: {
    directCompetitors: Array<{
      name: string;
      description: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    indirectCompetitors: string[];
    competitiveAdvantage: string[];
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  financials: {
    estimatedStartupCost: string;
    revenueModel: string;
    breakEvenTime: string;
    fundingRequirements: string;
    keyMetrics: Array<{
      metric: string;
      value: string;
      description: string;
    }>;
  };
  verdict: {
    feasibilityScore: number;
    recommendation: string;
    nextSteps: string[];
    timeline: string;
    riskLevel: 'Low' | 'Medium' | 'High';
  };
}

interface FeasibilityState {
  startupData: StartupData | null;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
  setStartupData: (data: StartupData) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

// Mock analysis data for development
const mockAnalysisResult: AnalysisResult = {
  marketAnalysis: {
    marketSize: "$12.5B by 2025",
    targetMarket: "Small to medium-sized businesses looking for automated solutions",
    marketTrends: [
      "Increasing demand for automation",
      "Remote work driving digital transformation", 
      "Focus on operational efficiency"
    ],
    opportunities: [
      "Underserved SMB market segment",
      "Integration with existing business tools",
      "Potential for viral growth"
    ],
    risks: [
      "High competition from established players",
      "Customer acquisition costs",
      "Technology adoption barriers"
    ]
  },
  competitors: {
    directCompetitors: [
      {
        name: "CompetitorA",
        description: "Established player with enterprise focus",
        strengths: ["Strong brand recognition", "Large customer base", "Extensive features"],
        weaknesses: ["High pricing", "Complex setup", "Poor SMB support"]
      },
      {
        name: "CompetitorB", 
        description: "Emerging startup with similar vision",
        strengths: ["Modern UI/UX", "Competitive pricing", "Good customer support"],
        weaknesses: ["Limited features", "Small team", "Unproven scalability"]
      }
    ],
    indirectCompetitors: [
      "Manual processes",
      "Generic automation tools",
      "Custom in-house solutions"
    ],
    competitiveAdvantage: [
      "Industry-specific features",
      "Superior user experience",
      "Competitive pricing model",
      "Faster implementation"
    ]
  },
  swot: {
    strengths: [
      "Strong technical team",
      "Clear value proposition",
      "Cost-effective solution",
      "Scalable architecture"
    ],
    weaknesses: [
      "Limited initial funding",
      "No established brand",
      "Small team size",
      "Limited marketing experience"
    ],
    opportunities: [
      "Growing market demand",
      "Partnership opportunities",
      "International expansion",
      "Product line extensions"
    ],
    threats: [
      "Economic downturn",
      "Regulatory changes",
      "New competitive entrants",
      "Technology disruption"
    ]
  },
  financials: {
    estimatedStartupCost: "$250,000 - $500,000",
    revenueModel: "SaaS subscription with tiered pricing",
    breakEvenTime: "18-24 months",
    fundingRequirements: "$750,000 Series A",
    keyMetrics: [
      {
        metric: "Customer Acquisition Cost (CAC)",
        value: "$85",
        description: "Cost to acquire one paying customer"
      },
      {
        metric: "Lifetime Value (LTV)",
        value: "$1,250",
        description: "Expected revenue per customer over their lifetime"
      },
      {
        metric: "LTV/CAC Ratio",
        value: "14.7:1",
        description: "Strong unit economics indicating viable business model"
      },
      {
        metric: "Monthly Churn Rate",
        value: "3.5%",
        description: "Expected monthly customer churn rate"
      }
    ]
  },
  verdict: {
    feasibilityScore: 78,
    recommendation: "Proceed with caution - Strong concept with good market opportunity, but execution risks exist",
    nextSteps: [
      "Conduct detailed market research and customer interviews",
      "Build MVP with core features",
      "Validate product-market fit with pilot customers",
      "Secure initial funding round",
      "Hire key team members"
    ],
    timeline: "6-12 months to MVP, 18-24 months to market leadership",
    riskLevel: "Medium"
  }
};

export const useFeasibilityStore = create<FeasibilityState>((set) => ({
  startupData: null,
  analysisResult: null,
  isLoading: false,
  
  setStartupData: (data) => set({ startupData: data }),
  
  setAnalysisResult: (result) => set({ analysisResult: result }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  reset: () => set({ 
    startupData: null, 
    analysisResult: null, 
    isLoading: false 
  })
}));

// Helper function to simulate API call
export const analyzeStartup = async (data: StartupData): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would call your backend API
  // For now, return mock data with some customization based on input
  return {
    ...mockAnalysisResult,
    // You could customize the mock data based on the input here
  };
};