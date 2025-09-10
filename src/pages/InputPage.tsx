import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Atom } from "react-loading-indicators";
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
import { Lightbulb } from "lucide-react";
import { useFeasibilityStore, analyzeStartup } from "@/store/feasibilityStore";
import { useToast } from "@/hooks/use-toast";

const InputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { setStartupData, setAnalysisResult, isLoading, setIsLoading } =
    useFeasibilityStore();

  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const getStoredToken = () => localStorage.getItem("access_token");

  const isTokenExpired = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const fetchToken = async () => {
    const res = await fetch("https://venturelens.onrender.com/auth/token", {
      method: "POST",
    });
    const result = await res.json();
    localStorage.setItem("access_token", result.access_token);
    return result.access_token;
  };

  const getValidToken = async () => {
    let token = getStoredToken();
    if (!token || isTokenExpired(token)) {
      token = await fetchToken();
    }
    return token;
  };

  // Fetch token on page load (before API calls)
  useEffect(() => {
    getValidToken();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("https://venturelens.onrender.com/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: enteredPassword }),
    });
    const result = await res.json();
    if (result.status) {
      setShowPasswordDialog(false);
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  };

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
      const token = await getValidToken();

      const result = await analyzeStartup(startupData, token);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* 🔒 Password Overlay */}
      {showPasswordDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/50">
          <div className="bg-card p-6 rounded-xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Enter Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                className="h-12 text-base"
              />
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <Button type="submit" className="w-full h-12 text-lg">
                Unlock
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-md bg-black/40">
          <div className="flex flex-col items-center gap-4">
            <Atom color="#f6f1e1" size="large" />
            <p className="text-lg font-medium text-white">
              Analyzing your idea...
            </p>
          </div>
        </div>
      )}

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-2xl relative z-10 ${
          showPasswordDialog ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-gradient">VentureLens</h1>
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
                  <Label htmlFor="title">Startup Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., AI-Powered Task Management for Remote Teams"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your startup idea..."
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground">
                    {description.length}/500 characters (minimum 100
                    recommended)
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !title.trim() || !description.trim()}
                  className="w-full h-14 text-lg font-semibold gradient-primary"
                >
                  Analyze My Startup Idea
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InputPage;
