import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  Users, 
  Target, 
  Shield, 
  DollarSign, 
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  BarChart3,
  Star,
  Zap,
  PieChart
} from 'lucide-react';
import { useFeasibilityStore } from '@/store/feasibilityStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startupData, analysisResult } = useFeasibilityStore();

  useEffect(() => {
    if (!startupData || !analysisResult) {
      navigate('/');
    }
  }, [startupData, analysisResult, navigate]);

  if (!startupData || !analysisResult) {
    return null;
  }

  const downloadResults = () => {
    const data = {
      startup: startupData,
      analysis: analysisResult,
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${startupData.title.replace(/\s+/g, '_')}_feasibility_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Results Downloaded",
      description: "Your feasibility analysis has been saved as a JSON file.",
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-success bg-success/10 border-success/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'High': return 'text-destructive bg-destructive/10 border-destructive/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success bg-success/10';
    if (score >= 60) return 'text-warning bg-warning/10';
    return 'text-destructive bg-destructive/10';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Input
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <div className="p-2 gradient-primary rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold">Feasibility Analysis</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResults}
                className="flex items-center gap-2 hover:bg-primary/10"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Startup Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="border-0 gradient-card shadow-lg">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="p-3 gradient-primary rounded-2xl shadow-glow">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3 text-gradient">{startupData.title}</CardTitle>
                  <CardDescription className="text-lg leading-relaxed">
                    {startupData.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Overall Verdict - Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-xl border gradient-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Overall Verdict</CardTitle>
              </div>
              
              <div className="flex items-center justify-center gap-6 mb-6">
                <Badge className={`text-2xl px-6 py-3 font-bold ${getScoreColor(analysisResult.verdict.feasibilityScore)}`}>
                  {analysisResult.verdict.feasibilityScore}/100
                </Badge>
                <Badge 
                  variant="outline"
                  className={`text-lg px-4 py-2 ${getRiskColor(analysisResult.verdict.riskLevel)} border-2`}
                >
                  {analysisResult.verdict.riskLevel} Risk
                </Badge>
              </div>

              <div className="max-w-2xl mx-auto mb-6">
                <div className="h-4 bg-muted/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-2000 ease-out ${
                      analysisResult.verdict.feasibilityScore >= 80 ? 'bg-success' :
                      analysisResult.verdict.feasibilityScore >= 60 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${analysisResult.verdict.feasibilityScore}%` }}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <p className="text-lg leading-relaxed text-center font-medium">{analysisResult.verdict.recommendation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <Info className="h-5 w-5 text-primary" />
                    Next Steps
                  </h4>
                  <ul className="space-y-3">
                    {analysisResult.verdict.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </div>
                        <span className="text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-accent" />
                    Timeline
                  </h4>
                  <p className="text-lg font-medium text-primary">{analysisResult.verdict.timeline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Market Analysis */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg h-full border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Market Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-accent/5 p-4 rounded-lg border border-accent/10">
                  <h4 className="font-semibold mb-3 text-accent flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Market Size
                  </h4>
                  <p className="text-sm leading-relaxed">{analysisResult.marketAnalysis.marketSize}</p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                  <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Target Market
                  </h4>
                  <p className="text-sm leading-relaxed">{analysisResult.marketAnalysis.targetMarket}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Market Trends
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.marketAnalysis.marketTrends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{trend}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                    <h4 className="font-semibold mb-3 text-success flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.marketAnalysis.opportunities.map((opp, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
                          <Zap className="w-3 h-3 text-success mt-1 flex-shrink-0" />
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                    <h4 className="font-semibold mb-3 text-warning flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risks
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.marketAnalysis.risks.map((risk, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-warning mt-1 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Competitors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-lg h-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Competitive Landscape</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {analysisResult.competitors.directCompetitors.map((competitor, index) => (
                    <div key={index} className="border-2 border-muted/30 rounded-xl p-5 hover:border-primary/30 transition-colors bg-gradient-to-r from-primary/5 to-accent/5">
                      <h4 className="font-bold text-lg mb-3 text-primary">{competitor.name}</h4>
                      <p className="text-sm mb-4 leading-relaxed text-muted-foreground">{competitor.description}</p>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-success/10 p-3 rounded-lg border border-success/20">
                          <span className="text-sm font-semibold text-success flex items-center gap-2 mb-2">
                            <CheckCircle className="h-3 w-3" />
                            Strengths
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {competitor.strengths.map((strength, i) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-success/20 text-success">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="bg-warning/10 p-3 rounded-lg border border-warning/20">
                          <span className="text-sm font-semibold text-warning flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-3 w-3" />
                            Weaknesses
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {competitor.weaknesses.map((weakness, i) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-warning/20 text-warning">
                                {weakness}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
                  <h4 className="font-semibold mb-4 text-primary flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5" />
                    Your Competitive Advantages
                  </h4>
                  <ul className="space-y-3">
                    {analysisResult.competitors.competitiveAdvantage.map((advantage, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed font-medium">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row - SWOT and Financial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SWOT Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-lg h-full border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">SWOT Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                    <h4 className="font-semibold mb-3 text-success flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.swot.strengths.map((strength, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                    <h4 className="font-semibold mb-3 text-warning flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Weaknesses
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.swot.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.swot.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                    <h4 className="font-semibold mb-3 text-destructive flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Threats
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.swot.threats.map((threat, index) => (
                        <li key={index} className="text-sm leading-relaxed flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-destructive mt-2 flex-shrink-0" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financial Projections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="shadow-lg h-full border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Financial Projections</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
                  <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Revenue Model
                  </h4>
                  <p className="text-sm leading-relaxed">{analysisResult.financials.revenueModel}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-success/10 p-4 rounded-lg border border-success/20 text-center">
                    <h4 className="font-semibold mb-2 text-success">Startup Costs</h4>
                    <p className="text-2xl font-bold text-success">{analysisResult.financials.estimatedStartupCost}</p>
                  </div>
                  
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 text-center">
                    <h4 className="font-semibold mb-2 text-accent">Break-even</h4>
                    <p className="text-2xl font-bold text-accent">{analysisResult.financials.breakEvenTime}</p>
                  </div>
                </div>

                <div className="bg-muted/20 p-5 rounded-xl border border-muted/30">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Key Metrics
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.financials.keyMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <span className="font-medium">{metric.metric}</span>
                          <p className="text-xs text-muted-foreground">{metric.description}</p>
                        </div>
                        <span className="text-lg font-bold text-primary">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <h4 className="font-semibold mb-3 text-warning flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Funding Requirements
                  </h4>
                  <p className="text-sm leading-relaxed">{analysisResult.financials.fundingRequirements}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;