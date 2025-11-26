import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import "./i18n";

const CareerPrograms = lazy(() => import("@/pages/CareerPrograms"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const LearningPathSelection = lazy(() => import("@/pages/LearningPathSelection"));
const CareerPaths = lazy(() => import("@/pages/CareerPaths"));
const SkillBoosters = lazy(() => import("@/pages/SkillBoosters"));
const ToolMastery = lazy(() => import("@/pages/ToolMastery"));
const FullStackBootcamp = lazy(() => import("@/pages/FullStackBootcamp"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/learning-paths" component={LearningPathSelection} />
        <Route path="/career-paths" component={CareerPaths} />
        <Route path="/skill-boosters" component={SkillBoosters} />
        <Route path="/tool-mastery" component={ToolMastery} />
        <Route path="/career-programs" component={CareerPrograms} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/us/career-programs/full-stack" component={FullStackBootcamp} />
        <Route path="/es/programas-de-carrera/full-stack" component={FullStackBootcamp} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
