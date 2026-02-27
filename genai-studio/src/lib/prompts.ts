export const SCREENPLAY_PROMPT = `You are a professional screenwriter and film director.

Based on the following story idea, generate a cinematic screenplay.

STORY IDEA:
{script_input}

Write it in professional screenplay format with:

- Scene headings (INT./EXT. LOCATION – TIME)
- Visual action descriptions in present tense
- Natural camera direction suggestions where appropriate
- Character names in ALL CAPS
- Realistic dialogue under character names
- Smooth scene transitions

Do not force specific phrases like "FADE IN".
Let the cinematic elements emerge naturally.

Make it visually rich, emotionally grounded, and production-ready.

The screenplay should feel like it could be directly used for filming.
Do not summarize the story.
Write it as a movie script.
`;

export const getScreenplayPrompt = (scriptInput: string) => {
    return SCREENPLAY_PROMPT.replace("{script_input}", scriptInput);
};
