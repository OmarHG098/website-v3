import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { DebugBubble } from "@/components/DebugBubble";
import { SessionProvider } from "@/contexts/SessionContext";
import { EditModeWrapper } from "@/components/editing/EditModeWrapper";
import "./i18n";

const CareerProgramDetail = lazy(() => import("@/pages/CareerProgramDetail"));
const ComponentShowcase = lazy(() => import("@/pages/ComponentShowcase"));
const ExperimentEditor = lazy(() => import("@/pages/ExperimentEditor"));
const LandingDetail = lazy(() => import("@/pages/LandingDetail"));
const LocationDetail = lazy(() => import("@/pages/LocationDetail"));
const PreviewFrame = lazy(() => import("@/pages/PreviewFrame"));
const ComponentPreview = lazy(() => import("@/pages/ComponentPreview"));
const PrivateRedirects = lazy(() => import("@/pages/PrivateRedirects"));
const MediaGallery = lazy(() => import("@/pages/MediaGallery"));
const TemplatePage = lazy(() => import("@/pages/page"));

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
        <Route path="/en/career-programs/:slug" component={CareerProgramDetail} />
        <Route path="/es/programas-de-carrera/:slug" component={CareerProgramDetail} />
        <Route path="/landing/:slug" component={LandingDetail} />
                <Route path="/private/component-showcase" component={ComponentShowcase} />
        <Route path="/private/component-showcase/:componentType" component={ComponentShowcase} />
        <Route path="/en/location/:slug" component={LocationDetail} />
        <Route path="/es/ubicacion/:slug" component={LocationDetail} />
        <Route path="/preview-frame" component={PreviewFrame} />
        <Route path="/private/component-showcase/:componentType/preview" component={ComponentPreview} />
        <Route path="/private/redirects" component={PrivateRedirects} />
        <Route path="/private/media-gallery" component={MediaGallery} />
        <Route path="/private/:contentType/:contentSlug/experiment/:experimentSlug" component={ExperimentEditor} />
        {/* Template pages - dynamic YAML-based pages */}
        <Route path="/en/:slug" component={TemplatePage} />
        <Route path="/es/:slug" component={TemplatePage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider>
          <EditModeWrapper>
            <Toaster />
            <Router />
            <DebugBubble />
          </EditModeWrapper>
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default App;
