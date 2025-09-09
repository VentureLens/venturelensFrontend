import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Building2,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useFeasibilityStore } from "@/store/feasibilityStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ResultsPage = () => {
  const { analysisResult, startupData, reset } = useFeasibilityStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!analysisResult || !startupData) {
      navigate("/");
    }
  }, [analysisResult, startupData, navigate]);

  if (!analysisResult || !startupData) {
    return null;
  }

  const handleBack = () => {
    reset();
    navigate("/");
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(analysisResult, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName =
      startupData.title + "_feasibility_analysis.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Extract data from the new structure
  const companiesData = analysisResult.results[0];
  const financialsData = analysisResult.results[1];
  const marketData = analysisResult.results[2];
  const swotData = analysisResult.results[3];
  const verdictData = analysisResult.results[4];

  const getFeasibilityColor = (score: number) => {
    if (score >= 0.8) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 0.6) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };
  const getScorePercentage = (score: number) => Math.round(score * 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              VentureLens
            </h1>
            <p className="text-muted-foreground">
              Analysis for:{" "}
              <span className="font-medium text-foreground">
                {startupData.title}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            {/* <ThemeToggle /> */}
            <Button onClick={handleDownload} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                Overall Feasibility Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`text-4xl font-bold ${getFeasibilityColor(
                    verdictData.overallScore
                  )}`}
                >
                  {getScorePercentage(verdictData.overallScore)}%
                </div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {verdictData.overallScore >= 0.8
                    ? "High Feasibility"
                    : verdictData.overallScore >= 0.6
                    ? "Moderate Feasibility"
                    : "Low Feasibility"}
                </Badge>
              </div>
              {/* <p className="text-muted-foreground mb-4">
                {verdictData.explanation.overallScore}
              </p> */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(verdictData.scores).map(([key, score]) => (
                  <div key={key} className="text-center">
                    <div
                      className={`text-2xl font-bold ${getFeasibilityColor(
                        score
                      )}`}
                    >
                      {getScorePercentage(score)}%
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Market Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="w-5 h-5 text-primary" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2 text-primary">
                  Market Size
                </h4>
                <p className="text-muted-foreground">{marketData.marketSize}</p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">
                  Target Audience
                </h4>
                <p className="text-muted-foreground">
                  {marketData.targetAudience}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">
                  Market Trends
                </h4>
                <div className="grid gap-3">
                  {marketData.trends.map((trend, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm">{trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Competitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="w-5 h-5 text-primary" />
                Competitor Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {companiesData.companies.map((competitor, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg text-primary">
                        {competitor.name}
                      </h4>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium mb-2 text-emerald-600 dark:text-emerald-400">
                          Features
                        </h5>
                        <ul className="space-y-1">
                          {competitor.features.map((feature, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <div className="w-1 h-1 rounded-full bg-current mt-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2 text-amber-600 dark:text-amber-400">
                          Pricing
                        </h5>
                        <ul className="space-y-1">
                          {competitor.pricing.map((price, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <div className="w-1 h-1 rounded-full bg-current mt-2 flex-shrink-0" />
                              {price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2 text-emerald-600 dark:text-emerald-400">
                          Strengths
                        </h5>
                        <ul className="space-y-1">
                          {competitor.swot.strengths.map((strength, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <div className="w-1 h-1 rounded-full bg-current mt-2 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2 text-red-600 dark:text-red-400">
                          Weaknesses
                        </h5>
                        <ul className="space-y-1">
                          {competitor.swot.weaknesses.map((weakness, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <div className="w-1 h-1 rounded-full bg-current mt-2 flex-shrink-0" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <DollarSign className="w-5 h-5 text-primary" />
                Financial Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">
                  Revenue Model
                </h4>
                <div className="grid gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h5 className="font-medium mb-1">Freemium</h5>
                    <p className="text-sm text-muted-foreground">
                      {financialsData.revenue_model.freemium}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h5 className="font-medium mb-1">Subscription</h5>
                    <p className="text-sm text-muted-foreground">
                      {financialsData.revenue_model.subscription}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h5 className="font-medium mb-1">Partnerships</h5>
                    <p className="text-sm text-muted-foreground">
                      {financialsData.revenue_model.partnerships}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">
                  Cost Structure
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(financialsData.cost_structure).map(
                    ([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-muted/50">
                        <h5 className="font-medium mb-1 capitalize">
                          {key.replace(/_/g, " ")}
                        </h5>
                        <p className="text-sm text-muted-foreground">{value}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">
                  Funding Requirements
                </h4>
                <div className="grid gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h5 className="font-medium mb-1">Seed Round</h5>
                    <p className="text-sm text-muted-foreground">
                      {financialsData.funding_requirements.seed_round}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <h5 className="font-medium mb-1">Potential Sources</h5>
                    <p className="text-sm text-muted-foreground">
                      {financialsData.funding_requirements.potential_sources}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-3 text-primary">
                  Key Metrics
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(financialsData.key_metrics).map(
                    ([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-muted/50">
                        <h5 className="font-medium mb-1 capitalize">
                          {key.replace(/_/g, " ")}
                        </h5>
                        <p className="text-sm text-muted-foreground">{value}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SWOT Analysis (Merits & Demerits) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="w-5 h-5 text-primary" />
                Strengths & Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-4 text-emerald-600 dark:text-emerald-400">
                    Merits
                  </h4>
                  <div className="space-y-4">
                    {swotData.merits.map((merit, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800"
                      >
                        <h5 className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                          {merit.merit}
                        </h5>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          {merit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-4 text-red-600 dark:text-red-400">
                    Challenges
                  </h4>
                  <div className="space-y-4">
                    {swotData.demerits.map((demerit, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                      >
                        <h5 className="font-medium text-red-700 dark:text-red-300 mb-2">
                          {demerit.demerit}
                        </h5>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                          {demerit.description}
                        </p>
                        <div className="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                          <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                            Counter-measure: {demerit.counter_measure}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Projections */}
      </div>
    </div>
  );
};

export default ResultsPage;
