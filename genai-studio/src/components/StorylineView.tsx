import { Download } from "lucide-react";

interface StorylineViewProps {
  storyline: string;
}

const StorylineView = ({ storyline }: StorylineViewProps) => {
  const downloadTxt = () => {
    const blob = new Blob([storyline], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "storyline.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-display text-3xl font-bold text-slate-900">Storyline</h3>
          <p className="text-slate-500 text-sm">Your generated project storyline.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadTxt}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-700 text-sm border border-slate-200 hover:border-teal-300 hover:bg-slate-50 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            TXT
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sm:p-10 max-h-[70vh] overflow-y-auto">
        <div className="max-w-2xl mx-auto font-body text-slate-700 leading-relaxed space-y-4">
          {storyline.split("\n\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorylineView;
