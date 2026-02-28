import {
  User, BadgeInfo, Calendar, Star, Brain,
  Target, Zap, Shield, TrendingUp, Heart, Download
} from "lucide-react";

// Full character shape from the live backend
interface Character {
  name: string;
  description?: string;
  age?: number;
  role_in_story?: string;
  personality_traits?: string;
  motivation?: string;
  internal_conflict?: string;
  external_conflict?: string;
  character_arc?: string;
  relationships?: string;
}

interface CharactersViewProps {
  characters: Character[];
}

interface PropertyDef {
  key: keyof Character;
  label: string;
  icon: React.ElementType;
  color: string;    // Tailwind bg colour for the icon bubble
  textColor: string; // Tailwind label colour
}

const PROPERTIES: PropertyDef[] = [
  { key: "description", label: "Appearance", icon: BadgeInfo, color: "bg-teal-50", textColor: "text-teal-700" },
  { key: "role_in_story", label: "Role in Story", icon: Star, color: "bg-violet-50", textColor: "text-violet-700" },
  { key: "personality_traits", label: "Personality Traits", icon: Brain, color: "bg-sky-50", textColor: "text-sky-700" },
  { key: "motivation", label: "Motivation", icon: Target, color: "bg-amber-50", textColor: "text-amber-700" },
  { key: "internal_conflict", label: "Internal Conflict", icon: Zap, color: "bg-rose-50", textColor: "text-rose-700" },
  { key: "external_conflict", label: "External Conflict", icon: Shield, color: "bg-orange-50", textColor: "text-orange-700" },
  { key: "character_arc", label: "Character Arc", icon: TrendingUp, color: "bg-emerald-50", textColor: "text-emerald-700" },
  { key: "relationships", label: "Relationships", icon: Heart, color: "bg-pink-50", textColor: "text-pink-700" },
];

const CharactersView = ({ characters }: CharactersViewProps) => {
  const downloadTxt = () => {
    const text = characters.map((c) => {
      const lines = [
        `CHARACTER: ${c.name}`,
        c.age !== undefined ? `Age: ${c.age}` : null,
        ...PROPERTIES.map((p) => {
          const val = c[p.key];
          return val ? `${p.label}: ${val}` : null;
        }),
      ].filter(Boolean);
      return lines.join("\n");
    }).join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "characters.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-bold text-slate-900">Character Profiles</h3>
          <p className="text-slate-500 text-sm">
            Detailed breakdown of every character in your story.
          </p>
        </div>
        <button
          onClick={downloadTxt}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-700 text-sm border border-slate-200 hover:border-teal-300 hover:bg-slate-50 shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          TXT
        </button>
      </div>

      {characters.length === 0 && (
        <div className="text-center text-slate-400 italic py-16">No characters generated yet.</div>
      )}

      {/* Character cards */}
      <div className="space-y-8">
        {characters.map((char, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300"
          >
            {/* Card header */}
            <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-teal-700 to-teal-500 text-white">
              <div className="bg-white/20 rounded-full p-3 shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-xl font-bold tracking-wide uppercase truncate">
                  {char.name}
                </h4>
                {char.role_in_story && (
                  <p className="text-teal-100 text-sm truncate">{char.role_in_story}</p>
                )}
              </div>
              {char.age !== undefined && (
                <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-teal-100" />
                  <span className="text-white text-sm font-semibold">{char.age} yrs</span>
                </div>
              )}
            </div>

            {/* Image + properties */}
            <div className="flex flex-col md:flex-row gap-0">
              {/* Character image */}
              <div className="md:w-52 shrink-0 border-b md:border-b-0 md:border-r border-slate-100">
                <div className="relative w-full aspect-[3/4] bg-slate-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={`http://localhost:8000/images/generate?prompt=${encodeURIComponent(
                      `${char.name} faceless cinematic character concept art clothing focused detailed movie still`
                    )}`}
                    alt={`${char.name} appearance`}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=0d9488&color=fff&size=400&font-size=0.35`;
                    }}
                  />
                </div>
              </div>

              {/* All properties grid */}
              <div className="flex-1 p-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {PROPERTIES.map((prop) => {
                    const value = char[prop.key];
                    if (!value) return null;
                    const Icon = prop.icon;
                    return (
                      <div
                        key={prop.key}
                        className={`rounded-xl p-4 ${prop.color} border border-white`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 ${prop.textColor} shrink-0`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${prop.textColor}`}>
                            {prop.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharactersView;
