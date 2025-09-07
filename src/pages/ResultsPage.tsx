import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { useFeasibilityStore } from '@/store/feasibilityStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startupData, analysisResult } = useFeasibilityStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['verdict']));

  useEffect(() => {
    if (!startupData || !analysisResult) {
      navigate('/');
    }
  }, [startupData, analysisResult, navigate]);

  if (!startupData || !analysisResult) {
    return null;
  }

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

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
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
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
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Input
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-semibold">Feasibility Analysis</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResults}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                <div className="p-2 gradient-primary rounded-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{startupData.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {startupData.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Verdict Section - Always Expanded First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader 
              className="cursor-pointer hover:bg-card-hover transition-colors rounded-t-lg"
              onClick={() => toggleSection('verdict')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">Overall Verdict</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`text-lg px-3 py-1 ${getScoreColor(analysisResult.verdict.feasibilityScore)}`}>
                    {analysisResult.verdict.feasibilityScore}/100
                  </Badge>
                  {expandedSections.has('verdict') ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                </div>
              </div>
            </CardHeader>
            <AnimatePresence>
              {expandedSections.has('verdict') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ease-out ${
                                analysisResult.verdict.feasibilityScore >= 80 ? 'bg-success' :
                                analysisResult.verdict.feasibilityScore >= 60 ? 'bg-warning' : 'bg-destructive'
                              }`}
                              style={{ width: `${analysisResult.verdict.feasibilityScore}%` }}
                            />
                          </div>
                        </div>
                        <Badge 
                          variant="outline"
                          className={`${getRiskColor(analysisResult.verdict.riskLevel)} border`}
                        >
                          {analysisResult.verdict.riskLevel} Risk
                        </Badge>
                      </div>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-base leading-relaxed">{analysisResult.verdict.recommendation}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Next Steps
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.verdict.nextSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                                <span className="text-xs font-medium text-primary">{index + 1}</span>
                              </div>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">
                          <strong>Timeline:</strong> {analysisResult.verdict.timeline}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Analysis Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg h-fit">
              <CardHeader 
                className="cursor-pointer hover:bg-card-hover transition-colors rounded-t-lg"
                onClick={() => toggleSection('market')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-accent" />
                    <CardTitle>Market Analysis</CardTitle>
                  </div>
                  {expandedSections.has('market') ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                </div>
              </CardHeader>
              <AnimatePresence>
                {expandedSections.has('market') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <CardContent className="pt-0 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Market Size</h4>
                        <p className="text-sm text-muted-foreground">{analysisResult.marketAnalysis.marketSize}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Target Market</h4>
                        <p className="text-sm text-muted-foreground">{analysisResult.marketAnalysis.targetMarket}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Market Trends</h4>
                        <ul className="space-y-1">
                          {analysisResult.marketAnalysis.marketTrends.map((trend, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                              {trend}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div>
                          <h4 className="font-medium mb-2 text-success">Opportunities</h4>
                          <ul className="space-y-1">
                            {analysisResult.marketAnalysis.opportunities.map((opp, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{opp}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-warning">Risks</h4>
                          <ul className="space-y-1">
                            {analysisResult.marketAnalysis.risks.map((risk, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Competitors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-lg h-fit">
              <CardHeader 
                className="cursor-pointer hover:bg-card-hover transition-colors rounded-t-lg"
                onClick={() => toggleSection('competitors')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Competitive Landscape</CardTitle>
                  </div>
                  {expandedSections.has('competitors') ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                </div>
              </CardHeader>
              <AnimatePresence>
                {expandedSections.has('competitors') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <CardContent className="pt-0 space-y-4">
                      {analysisResult.competitors.directCompetitors.map((competitor, index) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <h4 className="font-medium">{competitor.name}</h4>
                          <p className="text-sm text-muted-foreground">{competitor.description}</p>
                          <div className="grid grid-cols-1 gap-2">
                            <div>
                              <span className="text-xs font-medium text-success">Strengths: </span>
                              <span className="text-xs text-muted-foreground">
                                {competitor.strengths.join(', ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-warning">Weaknesses: </span>
                              <span className="text-xs text-muted-foreground">
                                {competitor.weaknesses.join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div>
                        <h4 className="font-medium mb-2">Your Competitive Advantages</h4>
                        <ul className="space-y-1">
                          {analysisResult.competitors.competitiveAdvantage.map((advantage, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-success mt-1 flex-shrink-0" />
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* SWOT Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-lg h-fit">
              <CardHeader 
                className="cursor-pointer hover:bg-card-hover transition-colors rounded-t-lg"
                onClick={() => toggleSection('swot')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-accent" />
                    <CardTitle>SWOT Analysis</CardTitle>
                  </div>
                  {expandedSections.has('swot') ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                </div>
              </CardHeader>
              <AnimatePresence>
                {expandedSections.has('swot') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-success flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1 ml-6">
                            {analysisResult.swot.strengths.map((strength, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-warning flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Weaknesses
                          </h4>
                          <ul className="space-y-1 ml-6">
                            {analysisResult.swot.weaknesses.map((weakness, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{weakness}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-primary flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Opportunities
                          </h4>
                          <ul className="space-y-1 ml-6">
                            {analysisResult.swot.opportunities.map((opportunity, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{opportunity}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Threats
                          </h4>
                          <ul className="space-y-1 ml-6">
                            {analysisResult.swot.threats.map((threat, index) => (
                              <li key={index} className="text-sm text-muted-foreground">{threat}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Financial Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="shadow-lg h-fit">
              <CardHeader 
                className="cursor-pointer hover:bg-card-hover transition-colors rounded-t-lg"
                onClick={() => toggleSection('financials')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-success" />
                    <CardTitle>Financial Projections</CardTitle>
                  </div>
                  {expandedSections.has('financials') ? 
                    <ChevronDown className="h-5 w-5" /> : 
                    <ChevronRight className="h-5 w-5" />
                  }
                </div>
              </CardHeader>
              <AnimatePresence>
                {expandedSections.has('financials') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <CardContent className="pt-0 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h4 className="font-medium mb-1">Estimated Startup Cost</h4>
                          <p className="text-lg font-semibold text-primary">{analysisResult.financials.estimatedStartupCost}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">Revenue Model</h4>
                          <p className="text-sm text-muted-foreground">{analysisResult.financials.revenueModel}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1">Break-even Timeline</h4>
                          <p className="text-sm text-muted-foreground">{analysisResult.financials.breakEvenTime}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-1">Funding Requirements</h4>
                          <p className="text-sm text-muted-foreground">{analysisResult.financials.fundingRequirements}</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Key Financial Metrics</h4>
                        <div className="space-y-3">
                          {analysisResult.financials.keyMetrics.map((metric, index) => (
                            <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{metric.metric}</div>
                                <div className="text-xs text-muted-foreground mt-1">{metric.description}</div>
                              </div>
                              <div className="font-semibold text-primary">{metric.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;