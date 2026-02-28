import { useState, useEffect } from "react";
import { Film, BookOpen, Users, Music, Pen, LogOut, Plus, FolderOpen, Camera, ToggleLeft, ToggleRight, Loader2, Sparkles, FileText } from "lucide-react";
import StoryInput from "./StoryInput";
import StorylineView from "./StorylineView";
import CharactersView from "./CharactersView";
import SoundDesignView from "./SoundDesignView";
import Screenplay from "./Screenplay";
import { getMockMode, setMockMode, getProjects, getProjectData, generateProject, saveProject, ProjectData } from "@/lib/api";
import { toast } from "sonner";

type Section = "story" | "storyline" | "characters" | "sound" | "screenplay";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const sidebarItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "story", label: "Story Line", icon: Pen },
  { id: "storyline", label: "Storyline", icon: BookOpen },
  { id: "characters", label: "Characters", icon: Users },
  { id: "sound", label: "Sound Design", icon: Music },
  { id: "screenplay", label: "Screenplay", icon: FileText },
];

const Dashboard = ({ token, onLogout }: DashboardProps) => {
  const [activeSection, setActiveSection] = useState<Section>("story");
  const [content, setContent] = useState<ProjectData | null>(null);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasStartedProject, setHasStartedProject] = useState(false);
  const [mockMode, setMockModeState] = useState(getMockMode());

  useEffect(() => {
    fetchProjects();
  }, [mockMode]);

  const fetchProjects = async () => {
    try {
      const list = await getProjects(token);
      setProjectsList(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load projects.");
    }
  };

  const handleToggleMockMode = () => {
    const next = !mockMode;
    setMockModeState(next);
    setMockMode(next);
    toast.info(`Mock Mode is now ${next ? "ON" : "OFF"}`);
  };

  const handleSelectProject = async (id: string) => {
    if (isGenerating) return;
    setIsLoadingProject(true);
    try {
      const data = await getProjectData(id, token);
      console.log("handleSelectProject: fetched data", data);
      setContent(data);
      setHasStartedProject(true);
      setActiveSection("screenplay");
      setSidebarOpen(false);
    } catch (error) {
      console.error("handleSelectProject Error:", error);
      toast.error("Failed to load project details.");
    } finally {
      setIsLoadingProject(false);
    }
  };

  const handleGenerate = async (story: string, useCase: string, language: string) => {
    setIsGenerating(true);

    try {
      const generated = await generateProject(story, useCase, language, token);
      console.log("API Response (Generated Project):", generated);

      const newProjectData: ProjectData = {
        title: "New Story",
        storyline: generated.screenplay ?? generated.storyline,
        screenplay: generated.screenplay ?? generated.storyline,
        characters: generated.characters,
        sound_design: generated.sound_design,
      };

      const saved = await saveProject(newProjectData, token);
      newProjectData.id = saved.id;

      console.log("State set for new project:", newProjectData);
      setContent(newProjectData);
      setActiveSection("screenplay");
      toast.success("Content generated successfully!", {
        description: "Your storyline, characters, and sound design are ready.",
      });
      fetchProjects();
    } catch {
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewProject = () => {
    setHasStartedProject(true);
    setContent(null);
    setActiveSection("story");
    setSidebarOpen(false);
  };

  const canNavigate = (section: Section) => {
    if (section === "story") return true;
    if (section === "screenplay") {
      const allowed = mockMode || !!content;
      console.log(`Sidebar render check | Screenplay enabled: ${allowed} (mockMode=${mockMode}, hasContent=${!!content})`);
      return allowed;
    }
    return !!content;
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden animate-fade-in-up"
      style={{
        backgroundImage: "url('/images/studio-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Semi-transparent teal overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: "rgba(0, 120, 130, 0.35)" }}
      />
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-sm border border-slate-100 rounded-lg p-2 text-slate-800"
      >
        <Film className="w-5 h-5 text-teal-600" />
      </button>

      {/* Glassmorphism Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 
          bg-white/70 backdrop-blur-md shadow-[1px_0_10px_rgba(0,0,0,0.03)] border-r border-white/20
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-teal-500" />
            <span className="font-display text-lg font-bold text-[#334155]">Coffee w/ Cinema</span>
          </div>
        </div>

        {/* Mock Mode Toggle */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
          <span className="text-sm font-semibold text-slate-600">Mock Mode</span>
          <button onClick={handleToggleMockMode} className="text-teal-500 transition-all hover:scale-105">
            {mockMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
          </button>
        </div>

        {/* New Project button */}
        <div className="px-4 pt-4">
          <button
            onClick={handleNewProject}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3 px-2 font-semibold">Current View</p>
          {sidebarItems.map((item) => {
            const enabled = canNavigate(item.id);
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (enabled) {
                    console.log(`View switching to: ${item.id}`);
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }
                }}
                disabled={!enabled}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                  ? "bg-teal-50 text-teal-700 shadow-sm"
                  : enabled
                    ? "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    : "text-slate-300 cursor-not-allowed"
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-transform duration-200 ${enabled ? "group-hover:scale-110" : ""}`} />
                {item.label}
              </button>
            );
          })}

          {/* Project History section */}
          <div className="pt-6">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3 px-2 font-semibold">Recent Projects</p>
            <div className="space-y-1">
              {projectsList.length === 0 ? (
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 cursor-default">
                  <FolderOpen className="w-4 h-4" />
                  <span className="text-xs italic">No projects yet</span>
                </div>
              ) : (
                projectsList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProject(p.id)}
                    className={`w-full text-left truncate flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${content?.id === p.id
                      ? "bg-slate-100 text-slate-800 font-semibold shadow-sm border border-slate-200"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                      }`}
                  >
                    <FolderOpen className={`w-4 h-4 shrink-0 ${content?.id === p.id ? "text-teal-600" : ""}`} />
                    <span className="truncate">{p.title}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-500 hover:text-red-500 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-auto relative z-10 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/60 backdrop-blur-md border-b border-slate-200/50 px-6 py-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto pl-10 md:pl-0">
            <div>
              <h2 className="font-display text-xl font-bold text-[#334155]">
                Welcome to <span className="text-teal-600">Studio</span>
              </h2>
            </div>
            {isLoadingProject ? <Loader2 className="w-5 h-5 text-teal-500 animate-spin" /> : <Sparkles className="w-5 h-5 text-teal-500 hidden sm:block" />}
          </div>
        </header>

        {/* Content area */}
        <div className="p-6 max-w-5xl mx-auto w-full flex-1 flex flex-col">
          {!hasStartedProject && !content ? (
            /* Welcome state — before any project */
            <div className="flex flex-col items-center justify-center flex-1 animate-fade-in-up md:mt-20">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-12 text-center max-w-lg w-full border border-white/20">
                <div className="bg-teal-50 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-8 h-8 text-teal-500" />
                </div>
                <h3 className="font-display text-3xl font-bold text-[#334155] mb-3">Ready to Create?</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Start a new project to bring your story to life. Our AI will generate storylines,
                  characters, and sound design tailored to your vision.
                </p>
                <button
                  onClick={handleNewProject}
                  className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Start New Project
                </button>
              </div>
            </div>
          ) : (
            /* Active project content */
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-6 sm:p-8 border border-white/20 animate-fade-in-up" key={activeSection}>
              {activeSection === "story" && (
                <StoryInput onGenerate={handleGenerate} isGenerating={isGenerating} />
              )}
              {activeSection === "storyline" && content && (
                <StorylineView storyline={content.storyline} />
              )}
              {activeSection === "characters" && content && (
                <CharactersView characters={content.characters} />
              )}
              {activeSection === "sound" && content && (
                <SoundDesignView scenes={content.sound_design} />
              )}
              {activeSection === "screenplay" && (
                <Screenplay screenplay={content?.screenplay ?? content?.storyline} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal-500 border-r-teal-300 animate-spin-slow" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-cyan-500 border-l-cyan-300 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-8 h-8 text-teal-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-[#334155] font-display text-xl font-semibold mb-1">Generating your cinematic vision...</p>
              <p className="text-slate-500 text-sm">Crafting storyline, characters & sound design</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
