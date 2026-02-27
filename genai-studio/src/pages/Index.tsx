import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cinema-token");
    if (saved) setToken(saved);
  }, []);

  const handleEnter = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("cinema-token");
    setToken(null);
  };

  if (!token) {
    return <LandingPage onEnter={handleEnter} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
};

export default Index;
