import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import SignAgreement from "@/pages/SignAgreement";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

// Layer 1 — Quick Books (fast entry, keep existing)
import TheReset from "./pages/TheReset";
import HouseCalls from "./pages/HouseCalls";
import FastBagFill from "./pages/FastBagFill";

// Layer 2 — Four Pillars (deep service pages)
import HomeReset from "./pages/HomeReset";           // Pillar 01: Home Reset & Move Support
import LegacyPillar from "./pages/LegacyPillar";     // Pillar 02: Legacy Planning & Inventory Catalog
import HouseCallsPillar from "./pages/HouseCallsPillar"; // Pillar 03: House Calls
import CuratedResalePillar from "./pages/CuratedResalePillar"; // Pillar 04: Curated Resale & Consignment

// Legacy routes (kept for backward compatibility)
import CuratedResale from "./pages/CuratedResale";
import LegacyInventory from "./pages/LegacyInventory";

// Hidden SEO pages (not linked in Nav or Footer)
import EventOperations from "./pages/EventOperations";

// New service pages
import Closeout from "./pages/Closeout";

function Router() {
  return (
    <Switch>
      {/* Core */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/faq" component={FAQ} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />

      {/* Layer 1 — Quick Books */}
      <Route path="/the-reset" component={TheReset} />
      <Route path="/house-calls" component={HouseCalls} />
      <Route path="/fast-bag-fill" component={FastBagFill} />

      {/* Layer 2 — Four Pillars */}
      <Route path="/home-reset-move-support" component={HomeReset} />
      <Route path="/legacy-planning" component={LegacyPillar} />
      <Route path="/house-calls-pillar" component={HouseCallsPillar} />
      <Route path="/closeout" component={Closeout} />
      {/* Legacy — kept for backward compatibility */}
      <Route path="/curated-resale-consignment" component={CuratedResalePillar} />

      {/* Legacy routes */}
      <Route path="/curated-resale" component={CuratedResale} />
      <Route path="/legacy-inventory" component={LegacyInventory} />

      {/* Hidden SEO pages — not in Nav or Footer */}
      <Route path="/event-operations" component={EventOperations} />

      {/* E-Sign */}
      <Route path="/sign/:token" component={SignAgreement} />
      {/* Fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
