import { User } from "lucide-react";
import { Character } from "@/lib/mockData";

interface CharactersViewProps {
  characters: Character[];
}

const CharactersView = ({ characters }: CharactersViewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-3xl font-bold text-slate-900">Character Profiles</h3>
        <p className="text-slate-500 text-sm">Detailed breakdowns of each character in your story.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {characters.map((char, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:border-teal-300 transition-all duration-300 group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-50 rounded-full p-2">
                <User className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h4 className="font-display text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-all">
                  {char.name}
                </h4>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Column */}
              <div className="md:w-1/3 shrink-0">
                <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <img
                    src={`http://localhost:8000/images/generate?prompt=${encodeURIComponent(
                      `${char.name} faceless cinematic character concept art clothing focused detailed movie still`
                    )}`}
                    alt={`${char.name} appearance`}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback dummy image if generation fails or takes too long
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${char.name}&background=random&size=400&font-size=0.1`;
                    }}
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="md:w-2/3 space-y-3">
                {[
                  { label: "Description", value: char.description },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">{field.label}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharactersView;
