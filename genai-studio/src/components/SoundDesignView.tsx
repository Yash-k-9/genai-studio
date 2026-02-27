import { Music, Volume2, Radio, SlidersHorizontal } from "lucide-react";
import { SoundScene } from "@/lib/mockData";

interface SoundDesignViewProps {
  scenes: SoundScene[];
}

const SoundDesignView = ({ scenes }: SoundDesignViewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-3xl font-bold text-slate-900">Sound Design</h3>
        <p className="text-slate-500 text-sm">Scene-by-scene audio breakdown with music, effects, and mixing notes.</p>
      </div>

      <div className="space-y-6">
        {scenes.map((scene, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:border-teal-300 transition-all duration-300"
          >
            <div className="bg-teal-500 px-6 py-3">
              <h4 className="text-white font-semibold text-sm tracking-wide">{scene.scene}</h4>
            </div>

            <div className="p-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Music, label: "Audio Profile", value: scene.audio },
              ].map((item) => (
                <div key={item.label} className={"sm:col-span-2"}>
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-4 h-4 text-teal-500" />
                    <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">{item.label}</p>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundDesignView;
