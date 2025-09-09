import { create } from 'zustand';

export interface StartupData {
  title: string;
  description: string;
}

export interface Company {
  name: string;
  features: string[];
  pricing: string[];
  marketing_strategies: string[];
  target_audience: string[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface AnalysisResult {
  status: string;
  results: [
    {
      companies: Company[];
    },
    {
      revenue_model: {
        freemium: string;
        subscription: string;
        partnerships: string;
      };
      cost_structure: {
        development: string;
        marketing: string;
        operational: string;
        cac: string;
      };
      funding_requirements: {
        seed_round: string;
        potential_sources: string;
      };
      key_metrics: {
        user_growth: string;
        retention_rate: string;
        cac_payback: string;
        customer_lifetime_value: string;
      };
    },
    {
      marketSize: string;
      trends: string[];
      targetAudience: string;
    },
    {
      merits: Array<{
        merit: string;
        description: string;
      }>;
      demerits: Array<{
        demerit: string;
        description: string;
        counter_measure: string;
      }>;
    },
    {
      feasibilityScores: {
        competitor_analysis: number;
        financial_projections: number;
        market_analysis: number;
        swot_analysis: number;
      };
      overallScore: number;
      explanation: {
        competitor_analysis: string;
        financial_projections: string;
        market_analysis: string;
        swot_analysis: string;
        overallScore: string;
      };
    }
  ];
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
  status: "Successful",
  results: [
    {
      companies: [
        {
          name: "Woebot",
          features: [
            "Cartoony chatbot interface",
            "Conversations based on cognitive behavioral therapy",
            "Personalized support"
          ],
          pricing: [
            "Freemium Model"
          ],
          marketing_strategies: [
            "Focus on accessibility and ease of use",
            "Partnerships with healthcare providers"
          ],
          target_audience: [
            "Individuals seeking mental health support"
          ],
          swot: {
            strengths: [
              "Early mover in the market",
              "Large user base"
            ],
            weaknesses: [
              "Limited effectiveness for severe mental health issues",
              "Challenges with FDA regulations for marketing authorization."
            ],
            opportunities: [
              "Integration of advanced language models and generative AI"
            ],
            threats: [
              "Competition from other chatbot-based mental health apps",
              "Evolving regulatory landscape"
            ]
          }
        },
        {
          name: "Wysa",
          features: [
            "AI-powered wellbeing coach",
            "Personalized self-help tools and guidance",
            "Anonymous and secure platform"
          ],
          pricing: [
            "Freemium model",
            "Premium features through Wysa Assure."
          ],
          marketing_strategies: [
            "Focus on anonymity and accessibility",
            "Partnerships with insurers and healthcare providers",
            "Targeted marketing campaigns for employers and young people"
          ],
          target_audience: [
            "Individuals, organizations, healthcare providers, and young people"
          ],
          swot: {
            strengths: [
              "Large user base",
              "Clinically validated tools",
              "Partnerships with established organizations"
            ],
            weaknesses: [
              "Limited effectiveness for severe mental health conditions",
              "Potential for user dependence on AI"
            ],
            opportunities: [
              "Expansion into new markets and demographics",
              "Integration with other health and wellness platforms"
            ],
            threats: [
              "Competition from other mental health apps and platforms",
              "Data privacy concerns"
            ]
          }
        }
      ]
    },
    {
      revenue_model: {
        freemium: "Free basic access with limited features. Premium features unlocked through in-app purchases.",
        subscription: "Monthly or annual subscription for full access to all features and personalized support.",
        partnerships: "Collaborations with businesses and organizations for employee wellness programs and specialized mental health services."
      },
      cost_structure: {
        development: "₹50,00,000 for initial app development, AI training, and platform setup.",
        marketing: "₹20,00,000 for advertising, social media campaigns, and content creation.",
        operational: "₹10,00,000 per year for server hosting, maintenance, customer support, and salaries.",
        cac: "₹500 per user acquired through online channels and partnerships."
      },
      funding_requirements: {
        seed_round: "₹1,00,00,000 to cover initial development, marketing, and operational costs for the first year.",
        potential_sources: "Angel investors, venture capital firms, crowdfunding platforms, and government grants."
      },
      key_metrics: {
        user_growth: "Target 100,000 users within the first year, growing to 1 million users within three years.",
        retention_rate: "Aim for a 70% user retention rate after the first month, increasing to 85% long-term.",
        cac_payback: "Achieve customer acquisition cost (CAC) payback within six months of user acquisition.",
        customer_lifetime_value: "Project an average customer lifetime value (CLTV) of ₹2,000."
      }
    },
    {
      marketSize: "USD 7.94 billion by 2034, with a CAGR of 16.1% from 2025 to 2034",
      trends: [
        "Shift from conventional care to personalized, patient-focused digital approaches.",
        "Increased funding and investment in AI-driven mental health innovations.",
        "Rising prevalence of mental health disorders like anxiety and depression.",
        "Growing awareness and acceptance of digital health technologies.",
        "Integration of AI, such as natural language processing and machine learning, to improve user engagement and personalization.",
        "Integration of wellness management tools.",
        "Focus on in-home care and telehealth integration."
      ],
      targetAudience: "Individuals aged 18-35 experiencing mild to moderate mental health challenges, seeking convenient and personalized support, particularly tech-savvy individuals comfortable with digital solutions."
    },
    {
      merits: [
        {
          merit: "Accessibility",
          description: "24/7 availability and ease of access through a digital platform."
        },
        {
          merit: "Affordability",
          description: "Potential for lower cost compared to traditional in-person therapy, making it accessible to a wider audience."
        },
        {
          merit: "Anonymity and Privacy",
          description: "Confidential platform for users to share their thoughts and feelings without fear of judgment."
        },
        {
          merit: "Personalization",
          description: "Tailored support and resources based on user data, preferences, and mental health needs. The \"knows everything about you\" aspect can enhance this personalization."
        },
        {
          merit: "Companionship",
          description: "Offers a sense of companionship and reduces feelings of loneliness and isolation, particularly for users who struggle with social interaction."
        }
      ],
      demerits: [
        {
          demerit: "Ethical Concerns",
          description: "Data privacy, potential for bias in algorithms, and limitations in handling severe mental health crises require careful consideration.",
          counter_measure: "Implement robust data encryption and privacy protocols. Conduct regular audits for algorithmic bias and ensure transparency in data usage. Establish clear guidelines and protocols for handling crisis situations, including referral options to mental health professionals."
        },
        {
          demerit: "Lack of Human Interaction",
          description: "Inability to fully replace human connection and the nuanced support of professional therapeutic relationships.",
          counter_measure: "Offer options for human interaction, such as integration with teletherapy platforms or support groups. Position the chatbot as a supplementary tool rather than a replacement for traditional therapy."
        },
        {
          demerit: "Dependence and Attachment",
          description: "Potential for users to develop unhealthy dependence and emotional attachment to the chatbot.",
          counter_measure: "Incorporate features that promote self-reliance and encourage users to seek support from other sources. Set usage limits and provide educational resources on healthy coping mechanisms."
        }
      ]
    },
    {
      feasibilityScores: {
        competitor_analysis: 0.8,
        financial_projections: 0.7,
        market_analysis: 0.9,
        swot_analysis: 0.75
      },
      overallScore: 0.79,
      explanation: {
        competitor_analysis: "High score due to detailed competitor information, including features, pricing, marketing, and SWOT. This allows for a thorough understanding of the competitive landscape.",
        financial_projections: "Moderate score. While cost structure, funding, and key metrics are provided, more detailed financial projections, including revenue forecasts and profitability analysis, would improve the score.",
        market_analysis: "High score due to clear market size and growth projections, along with identification of key trends. This demonstrates a strong understanding of the market opportunity.",
        swot_analysis: "Good score due to comprehensive analysis of merits and demerits, including proposed countermeasures. This shows a balanced perspective and proactive approach to risk mitigation.",
        overallScore: "The overall score is a weighted average of the individual scores, reflecting a generally positive feasibility outlook. Improvement in financial projections would significantly enhance the overall score."
      }
    }
  ]
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