import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Lightbulb, TrendingUp } from "lucide-react";
import { useFeasibilityStore, analyzeStartup } from "@/store/feasibilityStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const InputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { setStartupData, setAnalysisResult, isLoading, setIsLoading } =
    useFeasibilityStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both the title and description fields.",
        variant: "destructive",
      });
      return;
    }

    const startupData = {
      title: title.trim(),
      description: description.trim(),
    };
    setStartupData(startupData);
    setIsLoading(true);

    try {
      const result = await analyzeStartup(startupData);
      setAnalysisResult(result);
      navigate("/results");
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description:
          "Something went wrong during the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 gradient-primary rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-hero rounded-full opacity-3 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* <div className="p-3 gradient-primary rounded-2xl shadow-glow">
              <TrendingUp className="h-8 w-8 text-white" />
            </div> */}
            <h1 className="text-gradient">VentureLens</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Enter your startup idea and get an AI-powered feasibility analysis
            in minutes
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-xl border-0 gradient-card">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lightbulb className="h-6 w-6 text-primary" />
                Tell us about your startup idea
              </CardTitle>
              <CardDescription className="text-base">
                Provide a clear title and detailed description of your startup
                concept. Include your target market, key features, and business
                model.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Startup Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., AI-Powered Task Management for Remote Teams"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 text-base border-2 focus:border-primary transition-colors"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Detailed Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your startup idea in detail. Include your target audience, key features, revenue model, and what problem you're solving. Be as specific as possible to get better analysis results."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32 text-base border-2 focus:border-primary transition-colors resize-none"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    {description.length}/500 characters (minimum 100
                    recommended)
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !title.trim() || !description.trim()}
                  className="w-full h-14 text-lg font-semibold gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      {/* <Loader2 className="mr-2 h-5 w-5 animate-spin" /> */}
                      {/* Analyzing your idea... */}
                      <div className="loader"></div>
                    </>
                  ) : (
                    "Analyze My Startup Idea"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
        >
          <div className="p-4">
            <div className="text-primary text-2xl font-bold">
              Market Analysis
            </div>
            <div className="text-sm text-muted-foreground">
              Comprehensive market research and sizing
            </div>
          </div>
          <div className="p-4">
            <div className="text-accent text-2xl font-bold">
              Competitor Insights
            </div>
            <div className="text-sm text-muted-foreground">
              Direct and indirect competitor analysis
            </div>
          </div>
          <div className="p-4">
            <div className="text-primary text-2xl font-bold">
              Financial Projections
            </div>
            <div className="text-sm text-muted-foreground">
              Revenue models and funding requirements
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InputPage;
