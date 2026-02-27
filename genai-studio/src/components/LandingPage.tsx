import { useState } from "react";
import { Film, Clapperboard, Sparkles, Loader2 } from "lucide-react";
import { login, register } from "@/lib/api";

interface LandingPageProps {
  onEnter: (token: string) => void;
}

const LandingPage = ({ onEnter }: LandingPageProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    if (!isLogin && !name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = isLogin
        ? await login(email, password)
        : await register(name, email, password);

      localStorage.setItem("cinema-token", res.token);
      onEnter(res.token);
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        height: "100vh",
        backgroundImage: "url('/images/studio-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Semi-transparent teal overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0, 120, 130, 0.35)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 animate-fade-in-up text-white w-full h-full">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Film className="w-10 h-10 text-white" />
          <Clapperboard className="w-8 h-8 text-white/90" />
        </div>

        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black mb-4 tracking-tight drop-shadow-md">
          <span>Coffee</span>
          <span className="mx-2 text-4xl sm:text-5xl lg:text-6xl font-light text-white/80">with</span>
          <span>Cinema</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/90 font-body mb-2 tracking-wide drop-shadow-sm">
          AI Storyboard & Script Generator
        </p>
        <p className="text-sm text-white/80 font-body mb-12 max-w-md mx-auto drop-shadow-sm">
          Transform your story ideas into professional screenplays, character profiles, and sound design — powered by AI.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm px-10 py-4 rounded-lg text-white font-semibold text-lg tracking-wide transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Enter the Cinema
        </button>
      </div>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md mx-4 cinema-glow">
            <div className="flex items-center gap-2 mb-6">
              <Film className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
            </div>

            <p className="text-muted-foreground text-sm mb-6">
              {isLogin ? "Sign in to access your cinematic projects." : "Sign up to start creating your stories."}
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20 mb-6">
                {error}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-body"
              />
            </div>

            <button
              onClick={handleAuth}
              disabled={!email.trim() || !password.trim() || (!isLogin && !name.trim()) || loading}
              className="w-full cinema-gradient px-6 py-3 rounded-lg text-primary-foreground font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin-slow" />}
              {isLogin ? "Sign In" : "Create Account"}
            </button>

            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
