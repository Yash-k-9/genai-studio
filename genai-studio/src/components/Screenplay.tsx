import React from 'react';
import { Camera, Download, Film, MapPin, Clock, Clapperboard, MessageSquare } from 'lucide-react';

interface ScreenplayProps {
    screenplay?: string;
}

type BlockType =
    | 'scene_heading'
    | 'camera'
    | 'character'
    | 'parenthetical'
    | 'dialogue'
    | 'transition'
    | 'action';

interface ScreenplayBlock {
    type: BlockType;
    text: string;
}

const CAMERA_KEYWORDS = [
    'CLOSE UP', 'CLOSE-UP', 'CLOSEUP',
    'WIDE SHOT', 'WIDE-SHOT', 'WIDE ANGLE', 'WIDE ANGLE SHOT',
    'MEDIUM SHOT', 'MEDIUM CLOSE', 'MCU',
    'TRACKING SHOT', 'TRACK',
    'SLOW DOLLY', 'DOLLY IN', 'DOLLY OUT', 'DOLLY SHOT',
    'PAN LEFT', 'PAN RIGHT', 'PAN ACROSS', 'PAN TO', 'PAN',
    'TILT UP', 'TILT DOWN', 'TILT',
    'ZOOM IN', 'ZOOM OUT', 'ZOOM',
    'AERIAL SHOT', 'AERIAL VIEW',
    'OVER THE SHOULDER', 'OTS',
    'POINT OF VIEW', 'POV',
    'CRANE SHOT', 'HANDHELD',
    'ESTABLISHING SHOT',
    'INSERT',
    'EXTREME CLOSE UP', 'ECU', 'XCU',
    'TWO SHOT',
];

const TRANSITION_KEYWORDS = [
    'FADE OUT', 'FADE IN', 'FADE TO BLACK',
    'CUT TO', 'CUT TO BLACK',
    'DISSOLVE TO', 'SMASH CUT',
    'MATCH CUT', 'JUMP CUT',
    'IRIS IN', 'IRIS OUT',
    'WIPE TO',
];

function isSceneHeading(line: string): boolean {
    return /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)/i.test(line.trim());
}

function isTransition(line: string): boolean {
    const upper = line.trim().toUpperCase();
    return TRANSITION_KEYWORDS.some(k => upper === k || upper === k + '.' || upper === k + ':');
}

function isCameraDirection(line: string): boolean {
    const upper = line.trim().toUpperCase();
    return CAMERA_KEYWORDS.some(k => upper === k || upper.startsWith(k + ' ') || upper.startsWith(k + ':') || upper.startsWith(k + '.'));
}

function isCharacterName(line: string, nextLine?: string): boolean {
    const trimmed = line.trim();
    if (!trimmed) return false;
    // Character names are all-caps, no punctuation except hyphens/apostrophes/spaces, and usually short
    if (!/^[A-Z][A-Z\s\-'.()]+$/.test(trimmed)) return false;
    // Must be fairly short (not a full sentence in caps)
    if (trimmed.split(' ').length > 5) return false;
    // Next line should be dialogue or parenthetical
    if (nextLine !== undefined) {
        const nextTrimmed = nextLine.trim();
        if (!nextTrimmed) return false;
        if (nextTrimmed.startsWith('(') || nextTrimmed.length > 0) return true;
    }
    return true;
}

function isParenthetical(line: string): boolean {
    const trimmed = line.trim();
    return trimmed.startsWith('(') && trimmed.endsWith(')');
}

function parseScreenplay(text: string): ScreenplayBlock[] {
    const lines = text.split('\n');
    const blocks: ScreenplayBlock[] = [];
    let i = 0;
    let mode: 'action' | 'dialogue' = 'action';

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) {
            i++;
            mode = 'action';
            continue;
        }

        if (isSceneHeading(trimmed)) {
            blocks.push({ type: 'scene_heading', text: trimmed });
            mode = 'action';
            i++;
            continue;
        }

        if (isTransition(trimmed)) {
            blocks.push({ type: 'transition', text: trimmed });
            mode = 'action';
            i++;
            continue;
        }

        if (isCameraDirection(trimmed)) {
            blocks.push({ type: 'camera', text: trimmed });
            i++;
            continue;
        }

        if (isParenthetical(trimmed)) {
            blocks.push({ type: 'parenthetical', text: trimmed });
            mode = 'dialogue';
            i++;
            continue;
        }

        // Detect character name: look-ahead for next non-empty line
        const nextNonEmpty = lines.slice(i + 1).find(l => l.trim() !== '');
        if (mode === 'action' && isCharacterName(trimmed, nextNonEmpty)) {
            blocks.push({ type: 'character', text: trimmed });
            mode = 'dialogue';
            i++;
            continue;
        }

        if (mode === 'dialogue') {
            blocks.push({ type: 'dialogue', text: trimmed });
            i++;
            continue;
        }

        blocks.push({ type: 'action', text: trimmed });
        i++;
    }

    return blocks;
}

function parseSceneHeading(heading: string) {
    // Attempt to split "INT. GRAND CINEMA - PROJECTION BOOTH - NIGHT"
    const parts = heading.replace(/^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)\s*/i, '').split(' - ');
    const intExt = heading.match(/^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)/i)?.[0] ?? '';
    const location = parts.slice(0, -1).join(' - ') || parts[0] || heading;
    const time = parts.length > 1 ? parts[parts.length - 1] : null;
    return { intExt: intExt.replace('.', ''), location, time };
}

const SceneHeadingBlock: React.FC<{ text: string }> = ({ text }) => {
    const { intExt, location, time } = parseSceneHeading(text);
    return (
        <div className="flex items-center gap-3 bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-xl px-5 py-3 shadow-md mt-8 mb-2">
            <Film className="w-4 h-4 shrink-0 text-teal-200" />
            <span className="font-mono text-xs font-bold bg-teal-900/50 rounded px-2 py-0.5 mr-1 shrink-0">{intExt}</span>
            <div className="flex-1 flex items-center gap-2 flex-wrap">
                <span className="font-display font-bold tracking-widest uppercase text-sm">{location}</span>
                {time && (
                    <span className="flex items-center gap-1 text-teal-200 text-xs ml-auto shrink-0">
                        <Clock className="w-3 h-3" />
                        {time}
                    </span>
                )}
            </div>
        </div>
    );
};

const ActionBlock: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex gap-3 items-start bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-slate-600 text-sm italic leading-relaxed">
        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
        <span>{text}</span>
    </div>
);

const CameraBlock: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-center gap-2 my-1">
        <Camera className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-3 py-0.5 text-xs font-bold tracking-widest uppercase">
            {text}
        </span>
    </div>
);

const CharacterBlock: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-center mt-5 mb-0.5">
        <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span className="font-display font-bold tracking-widest uppercase text-slate-800 text-sm">{text}</span>
        </div>
    </div>
);

const ParentheticalBlock: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-center">
        <span className="text-slate-400 text-xs italic">{text}</span>
    </div>
);

const DialogueBlock: React.FC<{ text: string }> = ({ text }) => (
    <div className="mx-auto max-w-sm w-full">
        <div className="border-l-4 border-teal-400 pl-4 py-1 text-slate-700 text-sm leading-relaxed bg-teal-50/50 rounded-r-lg">
            {text}
        </div>
    </div>
);

const TransitionBlock: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex justify-end items-center gap-2 mt-4 mb-2">
        <Clapperboard className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase">{text}</span>
    </div>
);

const BlockRenderer: React.FC<{ block: ScreenplayBlock }> = ({ block }) => {
    switch (block.type) {
        case 'scene_heading': return <SceneHeadingBlock text={block.text} />;
        case 'action': return <ActionBlock text={block.text} />;
        case 'camera': return <CameraBlock text={block.text} />;
        case 'character': return <CharacterBlock text={block.text} />;
        case 'parenthetical': return <ParentheticalBlock text={block.text} />;
        case 'dialogue': return <DialogueBlock text={block.text} />;
        case 'transition': return <TransitionBlock text={block.text} />;
    }
};

const Screenplay: React.FC<ScreenplayProps> = ({ screenplay }) => {
    const blocks = React.useMemo(
        () => (screenplay ? parseScreenplay(screenplay) : []),
        [screenplay]
    );

    const downloadTxt = () => {
        if (!screenplay) return;
        const blob = new Blob([screenplay], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screenplay.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Compute summary counts
    const sceneCount = blocks.filter(b => b.type === 'scene_heading').length;
    const dialogueCount = blocks.filter(b => b.type === 'dialogue').length;
    const cameraCount = blocks.filter(b => b.type === 'camera').length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="font-display text-3xl font-bold text-slate-900">Screenplay</h3>
                    <p className="text-slate-500 text-sm">Formatted cinematic screenplay with structured sections.</p>
                </div>
                <button
                    onClick={downloadTxt}
                    disabled={!screenplay}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-slate-700 text-sm border border-slate-200 hover:border-teal-300 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Download className="w-3.5 h-3.5" />
                    Download TXT
                </button>
            </div>

            {/* Legend / stats bar */}
            {blocks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold rounded-full px-3 py-1">
                        <Film className="w-3 h-3" /> {sceneCount} Scene{sceneCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full px-3 py-1">
                        <Camera className="w-3 h-3" /> {cameraCount} Camera Direction{cameraCount !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full px-3 py-1">
                        <MessageSquare className="w-3 h-3" /> {dialogueCount} Dialogue Line{dialogueCount !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {/* Legend key */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 bg-white/70 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-600 inline-block" /> Scene heading</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block" /> Scenery / Action</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-200 inline-block" /> Camera angle</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-50 border-l-4 border-teal-400 inline-block" /> Dialogue</span>
            </div>

            {/* Main screenplay content */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 sm:p-10 max-h-[70vh] overflow-y-auto">
                {!screenplay ? (
                    <p className="text-slate-400 italic text-center py-10">No screenplay generated yet. Start a new project to see the structured output here.</p>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-2">
                        {blocks.map((block, idx) => (
                            <BlockRenderer key={idx} block={block} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Screenplay;
