import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Leaderboard from "./pages/leaderboard";
import AddReview from "./pages/add-review";
import AiModel from "./pages/ai-model";
import News from "./pages/news";
import Rewards from "./pages/rewards";
import Profile from "./pages/profile";
import AuthPage from "./pages/auth-page";
import Compare from "./pages/compare";
import Models from "./pages/models";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/leaderboard" component={Leaderboard} />
      <ProtectedRoute path="/add-review" component={AddReview} />
      <Route path="/model/:id" component={AiModel} />
      <Route path="/news" component={News} />
      <Route path="/rewards" component={Rewards} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/compare" component={Compare} />
      <Route path="/models" component={Models} />
      <Route path="/leaderboard" component={Compare} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
