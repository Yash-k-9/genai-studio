import { useState } from "react";
import { Sparkles, Film, Tv, GraduationCap, Pen, Loader2 } from "lucide-react";
import { useCases, exampleStories } from "@/lib/mockData";

interface StoryInputProps {
  onGenerate: (story: string, useCase: string, language: string) => void;
  isGenerating: boolean;
}

const useCaseIcons: Record<string, React.ElementType> = {
  filmmaker: Film,
  youtube: Tv,
  student: GraduationCap,
  custom: Pen,
};

const languages = [
  { value: "English", label: "English" },
  { value: "Telugu", label: "Telugu" },
  { value: "Hindi", label: "Hindi" }
];

const StoryInput = ({ onGenerate, isGenerating }: StoryInputProps) => {
  const [story, setStory] = useState("");
  const [useCase, setUseCase] = useState("");
  const [language, setLanguage] = useState("English");

  const loadExample = (key: string) => {
    const example = exampleStories[key];
    if (example) {
      setStory(example.story);
      setUseCase(example.useCase);
      setLanguage("English"); // reset default on example load
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display text-3xl font-bold text-[#334155] mb-2">Your Story</h3>
        <p className="text-slate-500">Describe your story idea in detail. The more context you provide, the richer the output.</p>
      </div>

      {/* Example stories */}
      <div>
        <p className="text-sm text-slate-400 mb-3">Quick start with an example:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(exampleStories).map(([key, ex]) => {
            const Icon = useCaseIcons[key] || Film;
            return (
              <button
                key={key}
                onClick={() => loadExample(key)}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-slate-600 text-sm border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
              >
                <Icon className="w-4 h-4 text-teal-500" />
                {ex.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Story textarea */}
      <div>
        <label className="block text-sm font-medium text-[#334155] mb-2">Story Description</label>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Once upon a time in a world where..."
          disabled={isGenerating}
          rows={10}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[#334155] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all resize-none font-body text-sm leading-relaxed disabled:opacity-50 shadow-sm"
        />
      </div>

      {/* Use case & Language select row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#334155] mb-2">Use Case</label>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            disabled={isGenerating}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[#334155] focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all font-body text-sm disabled:opacity-50 appearance-none shadow-sm"
          >
            <option value="">Select a use case...</option>
            {useCases.map((uc) => (
              <option key={uc.value} value={uc.value}>
                {uc.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#334155] mb-2">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isGenerating}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[#334155] focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all font-body text-sm disabled:opacity-50 appearance-none shadow-sm"
          >
            {languages.map((lng) => (
              <option key={lng.value} value={lng.value}>
                {lng.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={() => onGenerate(story, useCase, language)}
        disabled={isGenerating || !story.trim() || !useCase}
        className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:-translate-y-0.5 hover:shadow-md inline-flex items-center gap-2 w-full sm:w-auto justify-center"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin-slow" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate Content
          </>
        )}
      </button>
    </div>
  );
};

export default StoryInput;
