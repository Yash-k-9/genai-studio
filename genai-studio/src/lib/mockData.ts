export const useCases = [
  { value: "filmmaker", label: "Independent Filmmaker" },
  { value: "youtube", label: "YouTube Content Creator" },
  { value: "student", label: "Film School Student" },
  { value: "custom", label: "Custom" },
];

export const exampleStories: Record<string, { title: string; story: string; useCase: string }> = {
  filmmaker: {
    title: "The Last Projection",
    useCase: "filmmaker",
    story: `In a dying town, the last cinema projectionist discovers that the films he plays can alter reality. When a mysterious reel appears with footage of the town's future destruction, he must decide whether to project it and warn everyone — or destroy it and let fate unfold. As he investigates, he uncovers that his predecessor vanished after projecting a similar reel decades ago. The line between the screen and reality blurs as shadows from the film begin appearing in the real world.`,
  },
  youtube: {
    title: "Glitch House",
    useCase: "youtube",
    story: `A group of content creators move into a haunted mansion to film a 30-day reality series for YouTube. Each episode, strange glitches appear in their footage — shadows moving independently, voices in static, and rooms that rearrange overnight. As their subscriber count skyrockets, they realize the house feeds on attention. The more views they get, the stronger the entity becomes. They must choose: go viral or survive.`,
  },
  student: {
    title: "Frame by Frame",
    useCase: "student",
    story: `A film student struggling with her thesis project discovers an old Super 8 camera at a flea market. Every scene she films with it reveals hidden truths about the people in frame — a professor's secret past, a friend's hidden pain, her own suppressed memories. As she pieces together her documentary, she realizes the camera belonged to a legendary filmmaker who disappeared, and the footage holds the key to understanding why.`,
  },
};

export interface Character {
  name: string;
  description: string;
}

export interface SoundScene {
  scene: string;
  audio: string;
}

export interface GeneratedContent {
  storyline: string;
  screenplay?: string;
  characters: Character[];
  sound_design: SoundScene[];
}

export const mockGeneratedContent: GeneratedContent = {
  storyline: `INT. GRAND CINEMA - PROJECTION BOOTH - NIGHT

Dust motes dance in the harsh beam of light cutting through the absolute darkness. The booth is a cramped relic, overflowing with towering metal film reels. The rhythmic, mechanical CLACK-CLACK-CLACK of a vintage 35mm projector fills the room.

ARTHUR VALE (50s, worn and quiet) threads a fragile strip of celluloid. He peers through the thick glass viewing port, watching the movie play.

On the silver screen: A sprawling, neon-lit futuristic metropolis. Heavy rain slices through towering holographic advertisements.

Arthur’s tired gaze drifts from the screen to the actual city visible through the booth’s high window—an exact match of the scene.

He rubs his weary eyes.

ARTHUR
(mumbling)
Just another trick of the light...

He turns toward the splicing table. Hidden beneath it sits a tarnished, silver film canister that seems to pulse faintly. Its faded label reads: "TOWN_DESTRUCTION_REEL_01".

Arthur kneels and lifts the canister. It is unnaturally cold.

INT. LIBRARIAN'S OFFICE - DAY

Stacks of pristine data crystals and archaic paper books lean precariously against the walls. MARTHA CHEN (40s, sharp-eyed, inquisitive) scans a flickering microfiche monitor. 

Arthur stands in the doorway, clutching the silver canister to his chest.

ARTHUR
Martha. I found something. Another reel.

Martha freezes. She slowly pulls off her reading glasses.

MARTHA
Is it like the one Edwin found? Before he vanished?

ARTHUR
I don't know. But I loaded it... and the shadows in the booth... they're not staying on the screen anymore.

Martha stands up, approaching him cautiously.

MARTHA
Arthur, if you project that reel, whatever it shows will become reality. You know the rules.

ARTHUR
What if it's a warning? What if I have to show it?

INT. GRAND CINEMA - PROJECTION BOOTH - NIGHT

Arthur stands alone. The silver canister is open. He holds the reel, his hands trembling slightly. 

He sets the mysterious reel onto the projector’s feed platter and carefully laces the film.

ARTHUR
Let’s see what fate looks like.

He hits the power switch. The projector ROARS to life.

Through the viewing port: The on-screen city trembles. Massive explosions tear through the skyscraper holograms.

Arthur gasps, stepping back.

Suddenly, the projection booth shudders violently. Red ambient light from the outside flashes into the room. A deafening BOOM echoes from the actual streets below.

Arthur looks out the high window. A plume of real smoke rises from a distant tower—exactly where the film just showed it burning.

ARTHUR
(horrified)
God...

The door to the projection booth CREAKS open. 

Standing in the doorway is a shadowy silhouette—a figure composed entirely of flickering, monochromatic film grain. THE SHADOW.

THE SHADOW
(voice distorted, echoing)
You shouldn't have played that, Arthur.

Arthur backs up against the spinning projector, grabbing a heavy metal splicing tool defensively.

ARTHUR
What are you? Where is Edwin?

THE SHADOW
The future. And just like Edwin... you’re going to help me project it.

The Shadow glides forward. The projector's light flickers wildly as the celluloid begins to melt. 

FADE OUT.`,
  screenplay: `INT. GRAND CINEMA - PROJECTION BOOTH - NIGHT

SOUND of a vintage 35mm projector
Dust motes dance in the harsh beam of light cutting through the absolute darkness. The booth is a cramped relic, overflowing with towering metal film reels. The rhythmic, mechanical CLACK-CLACK-CLACK of a vintage 35mm projector fills the room.

ARTHUR VALE (50s, worn and quiet) threads a fragile strip of celluloid. He peers through the thick glass viewing port, watching the movie play.

On the silver screen: A sprawling, neon-lit futuristic metropolis. Heavy rain slices through towering holographic advertisements.

Arthur’s tired gaze drifts from the screen to the actual city visible through the booth’s high window—an exact match of the scene.

He rubs his weary eyes.

ARTHUR
(mumbling)
Just another trick of the light...

He turns toward the splicing table. Hidden beneath it sits a tarnished, silver film canister that seems to pulse faintly. Its faded label reads: "TOWN_DESTRUCTION_REEL_01".

Arthur kneels and lifts the canister. It is unnaturally cold.

INT. LIBRARIAN'S OFFICE - DAY

SOUND of flickering microfiche monitor
Stacks of pristine data crystals and archaic paper books lean precariously against the walls. MARTHA CHEN (40s, sharp-eyed, inquisitive) scans a flickering microfiche monitor. 

Arthur stands in the doorway, clutching the silver canister to his chest.

ARTHUR
Martha. I found something. Another reel.

Martha freezes. She slowly pulls off her reading glasses.

MARTHA
Is it like the one Edwin found? Before he vanished?

ARTHUR
I don't know. But I loaded it... and the shadows in the booth... they're not staying on the screen anymore.

Martha stands up, approaching him cautiously.

MARTHA
Arthur, if you project that reel, whatever it shows will become reality. You know the rules.

ARTHUR
What if it's a warning? What if I have to show it?

INT. GRAND CINEMA - PROJECTION BOOTH - NIGHT

Arthur stands alone. The silver canister is open. He holds the reel, his hands trembling slightly. 

He sets the mysterious reel onto the projector’s feed platter and carefully laces the film.

ARTHUR
Let’s see what fate looks like.

He hits the power switch. The projector ROARS to life.

Through the viewing port: The on-screen city trembles. Massive explosions tear through the skyscraper holograms.

Arthur gasps, stepping back.

Suddenly, the projection booth shudders violently. Red ambient light from the outside flashes into the room. A deafening BOOM echoes from the actual streets below.

Arthur looks out the high window. A plume of real smoke rises from a distant tower—exactly where the film just showed it burning.

ARTHUR
(horrified)
God...

The door to the projection booth CREAKS open. 

Standing in the doorway is a shadowy silhouette—a figure composed entirely of flickering, monochromatic film grain. THE SHADOW.

THE SHADOW
(voice distorted, echoing)
You shouldn't have played that, Arthur.

Arthur backs up against the spinning projector, grabbing a heavy metal splicing tool defensively.

ARTHUR
What are you? Where is Edwin?

THE SHADOW
The future. And just like Edwin... you’re going to help me project it.

The Shadow glides forward. The projector's light flickers wildly as the celluloid begins to melt. 

FADE OUT.`,
  characters: [
    {
      name: "Arthur Vale",
      description: "Third-generation projectionist who inherited the town's only cinema from his grandfather Edwin. A quiet man who communicates better through film than words. Widowed five years ago, he is driven by a deep sense of duty to the stories entrusted to him."
    },
    {
      name: "Martha Chen",
      description: "Town librarian and Arthur's closest friend. A researcher at heart with a fascination for local history. She seeks the truth about the town's hidden history and the disappearance of Edwin Vale."
    },
    {
      name: "The Shadow",
      description: "An entity that exists within the mysterious reel. It appears as a dark silhouette that moves independently of the projected images. It is a projection of all the stories the cinema has absorbed over 70 years."
    }
  ],
  sound_design: [
    {
      scene: "Opening Credits",
      audio: "Low, sustained cello drone in C minor. Projector mechanical hum (warm, nostalgic). Dust particles creating subtle high-frequency shimmer."
    },
    {
      scene: "The Discovery",
      audio: "Silence before the discovery. Metallic scraping of the canister. A faint whisper — processed with heavy reverb and pitch-shifted down slightly."
    },
    {
      scene: "The Mysterious Reel",
      audio: "Dissonant string cluster builds gradually. Projector sounds become distorted. A heartbeat-like pulse at 60 BPM. Sub-bass rumble below 40Hz."
    }
  ],
};
