import React from 'react';

interface ScreenplayProps {
    storyline?: string;
}

const Screenplay: React.FC<ScreenplayProps> = ({ storyline }) => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-4 font-display text-slate-800">Screenplay</h2>
            {storyline ? (
                <div className="prose max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {storyline}
                </div>
            ) : (
                <p className="text-slate-500 italic">No screenplay data available yet.</p>
            )}
        </div>
    );
};

export default Screenplay;
