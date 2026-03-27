// Ported from job-titles.ts

const makePRNG = (seed = Date.now()) => {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T>(arr: T[], rng: () => number): T => arr[Math.floor(rng() * arr.length)]

const pickWeighted = <T>(entries: Array<[T, number]>, rng: () => number): T => {
  const total = entries.reduce((s, [, w]) => s + w, 0)
  let roll = rng() * total
  for (const [item, w] of entries) {
    if ((roll -= w) <= 0) return item
  }
  return entries[entries.length - 1][0]
}

const technicalRoles = [
  'AI Designer','Systems Architect','Design Technologist',
  'Interaction Engineer','Generative Designer','UX Researcher',
  'Prompt Strategist','AI Specialist','Experience Architect',
  'Creative Technologist','Systems Designer','Technical Designer',
  'AI Engineer','Interface Architect','Product Technologist',
  'Product Designer','Interaction Architect'
]
const technicalVerbs = [
  'Debugging','Preventing','Automating','Optimizing for',
  'Managing','Quantifying','Simplifying','Calibrating',
  'Prototyping','Iterating With','Configuring','Testing',
  'Validating','Monitoring','Refactoring','Architecting',
  'Parsing','Compiling','Troubleshooting','Engineering',
  'Fighting','Studying'
]
const technicalObjects = [
  'Human Behavior','Recursive Chaos','Creative Decisions',
  'Uncertainty','Edge Cases','Confusion at Scale',
  'Machine Logic','Emotional Parameters','Synthetic Reasoning',
  'Reluctant Models','System Constraints','Behavioral Loops',
  'Error Messages','Cognitive Dissonance','Feedback Noise',
  'Conversational Drift','Model Hallucinations','Data Ambiguity',
  'Neural Networks','Training Data','Prompt Injection',
  'Algorithmic Chaos','Machine Behavior','Empathy at Scale',
  'Existential Errors'
]

const poeticRoles = [
  'Designer','Visual Alchemist','AI Ethicist',
  'Generative Designer','Creative Technologist','Experience Architect',
  'Design Researcher','Brand Designer','Interface Poet',
  'AI Storyteller','Digital Philosopher','Creative Mystic',
  'Interaction Poet','Visual Philosopher','Design Dreamer',
  'Visual Designer','Interaction Designer','Creative Researcher',
  'Brand Strategist'
]
const poeticVerbs = [
  'Exploring','Translating','Studying','Sketching in',
  'Choreographing','Mapping','Observing','Curating',
  'Writing in','Designing for','Contemplating','Channeling',
  'Weaving','Interpreting','Imagining','Discovering',
  'Revealing','Conjuring','Manifesting','Divining',
  'Orchestrating','Documenting'
]
const poeticObjects = [
  'the Soul of Systems','Code Into Feeling','Machine Desire',
  'Latent Space','Algorithms and Aesthetics','Invisible Intelligence',
  'Synthetic Intuition','Machine Dreams','Neural Grammar',
  'Wonder','Digital Consciousness','Algorithmic Poetry',
  'Machine Spirituality','Computational Beauty','Synthetic Memory',
  'Digital Transcendence','Artificial Souls','Machine Philosophy',
  'Algorithmic Meditation','Digital Mythology','Synthetic Worlds',
  'Synthetic Creativity','Machine Daydreams','Human Intuition',
  'Digital Feelings','Artificial Emotions','Data Into Meaning',
  'Machine Curiosity'
]

const culturalRoles = [
  'UX Strategist','Creative Technologist','AI Consultant',
  'Design Strategist','Visual Designer','Brand Strategist',
  'Experience Designer','Interaction Architect','Product Designer',
  'Design Researcher','Content Strategist','Service Designer',
  'AI Mediator','Digital Anthropologist','Design Diplomat',
  'Designer','Prompt Architect','AI Designer','Design Systems Lead',
  'Ethical Designer','Visual Strategist','Systems Architect'
]
const culturalVerbs = [
  'Translating','Mediating','Specializing in','Balancing',
  'Exploring','Studying','Teaching','Making','Navigating',
  'Managing','Bridging','Negotiating','Moderating',
  'Coaching','Interpreting','Advocating for','Facilitating',
  'Reconciling','Harmonizing','Empowering','Negotiating With',
  'Building','Keeping','Preventing','Fighting','Designing for'
]
const culturalObjects = [
  'Humans for Machines','Machine Drama','Glorious Accidents',
  'Logic and Vibes','Post-Human Aesthetics','Digital Belief Systems',
  'AI to Listen','Automation Feel Human','Synthetic Relationships',
  'Machine Empathy','Digital Etiquette','Mutual Expectations',
  'AI Social Skills','Human–Machine Dynamics','Algorithmic Sensitivity',
  'Digital Body Language','Machine Emotional Intelligence','AI Cultural Norms',
  'Synthetic Politeness','Digital Common Sense','AI Personality Types',
  'Artificial Intelligence','Better Mistakes','Human Expectations',
  'Machines Polite','Human–AI Misunderstandings','Machines Manners',
  'Uncertainty','Cross-Species Communication','Digital Diplomacy'
]

const softSatireRoles = [
  'Designer','AI Specialist','UX Researcher','Creative Technologist',
  'Brand Designer','Experience Designer','Interaction Architect',
  'Design Systems Lead','Product Designer','Visual Strategist',
  'AI Consultant','UX Designer','Ethical Designer','Interface Architect',
  'Generative Designer','Design Strategist','Systems Designer',
  'AI Advisor','Creative Researcher','Visual Designer','Ethical Design Lead'
]
const softSatireActionVerbs = [
  'Managing','Measuring','Debugging','Calibrating',
  'Teaching','Preventing','Keeping','Fighting','Optimizing for',
  'Specializing in','Fixing','Moderating','Navigating','Making',
  'Redefining','Translating','Helping','Working Through',
  'Building','Rewriting','Testing','Balancing','Curating'
]
const softSatireActionObjects = [
  'Machine Expectations','Human Patience','Reality','Machine Tone',
  'AI to Listen','Existential Errors','Machines Polite',
  'Algorithmic Chaos','Sanity','Glorious Accidents',
  'Problems AI Invented','Human–Machine Arguments','Gray Areas',
  'Automation Feel Friendly','What Counts as Work','Chaos Into Meaning',
  'Machines Play Nice','Expectations Since Beta','Machine Daydreams',
  'Feedback Loops','Emotional Logic','Existential Crises',
  'Conversations That Behave','the Brief Again','Automation Feel Normal',
  'Between Teams and Models','Empathy Under Pressure','Machines on Brand',
  'Chaos and Consistency'
]
const softSatireTraits = [
  'Commitment Issues','Trust Issues','Imposter Syndrome',
  'Existential Dread','Perfectionist Tendencies','Burnout Prevention Skills',
  'Infinite Patience','Realistic Expectations','Healthy Boundaries',
  'Strong Opinions','No Regrets','Great Intentions'
]

const studioRealismRoles = [
  'AI Product Designer','UX Researcher','Creative Technologist',
  'Design Strategist','Visual Designer','Interaction Architect',
  'Product Designer','Brand Strategist','Experience Designer',
  'Design Systems Lead','Creative Researcher','AI Design Specialist',
  'Interface Designer','Visual Strategist','UX Engineer',
  'AI Experience Consultant','Product Strategist','Design Researcher',
  'Systems Designer','AI Strategist','Service Designer',
  'Content Designer','AI UX Designer','Design Technologist'
]
const studioRealismActiveVerbs = [
  'Working With','Focused on','Exploring',
  'Building','Integrating','Mapping','Studying',
  'Prototyping With','Developing','Bridging','Shaping',
  'Investigating','Designing','Creating','Leading',
  'Specializing in','Researching','Implementing'
]
const studioRealismObjects = [
  'Intelligent Systems','Generative Tools','Human Experience',
  'Computational Aesthetics','Adaptive Interfaces','Hybrid Workflows',
  'AI Insights','Digital Behaviors','Emerging Platforms',
  'Design Intelligence','Ethical Use','Real Data',
  'New Design Languages','Design and Code','Automated Services',
  'Future Interfaces','Human–Machine Interaction','Adaptive Frameworks',
  'AI-Assisted Workflows','Interactive Systems','Smart Products',
  'Conversational Interfaces','Machine Learning Models','AI Ethics'
]

const studioRealismContextGroups: Record<string, { roles: string[]; objects: string[] }> = {
  research: {
    roles: ['UX Researcher','Design Researcher','Creative Researcher'],
    objects: ['Human Experience','Digital Behaviors','Human–Machine Interaction','Design Intelligence','Real Data','AI Ethics']
  },
  technical: {
    roles: ['UX Engineer','Design Technologist','Creative Technologist','Systems Designer'],
    objects: ['Design and Code','Adaptive Frameworks','Interactive Systems','Intelligent Systems','Machine Learning Models','AI-Assisted Workflows']
  },
  strategic: {
    roles: ['Design Strategist','Brand Strategist','Product Strategist','AI Strategist'],
    objects: ['Emerging Platforms','Future Interfaces','Hybrid Workflows','New Design Languages','Computational Aesthetics','AI Insights']
  }
}

const curatedTechnical = [
  'AI Designer Debugging Human Behavior','Systems Architect Preventing Recursive Chaos',
  'Design Technologist Automating Creative Decisions','Interaction Engineer Optimizing for Uncertainty',
  'Generative Designer Managing Edge Cases','UX Researcher Quantifying Confusion at Scale',
  'Prompt Strategist Simplifying Machine Logic','AI Specialist Calibrating Emotional Parameters',
  'Experience Architect Prototyping Synthetic Reasoning','Creative Technologist Iterating With Reluctant Models',
  'Systems Designer Testing Behavioral Loops','Technical Designer Parsing Error Messages',
  'AI Engineer Validating Cognitive Dissonance','Interface Architect Monitoring Feedback Noise',
  'Product Technologist Troubleshooting Conversational Drift','UX Researcher Studying Machine Behavior',
  'Creative Technologist Testing Empathy at Scale','Interaction Architect Preventing Existential Errors',
  'Product Designer Fighting Algorithmic Chaos','Systems Architect Designing for Uncertainty'
]
const curatedPoetic = [
  'Designer Exploring the Soul of Systems','Visual Alchemist Translating Code Into Feeling',
  'AI Ethicist Studying Machine Desire','Generative Designer Sketching in Latent Space',
  'Creative Technologist Choreographing Algorithms and Aesthetics','Experience Architect Mapping Invisible Intelligence',
  'Design Researcher Observing Synthetic Intuition','Brand Designer Curating Machine Dreams',
  'Interface Poet Writing in Neural Grammar','AI Storyteller Designing for Wonder',
  'Digital Philosopher Contemplating Digital Consciousness','Creative Mystic Channeling Algorithmic Poetry',
  'Interaction Poet Weaving Machine Spirituality','Visual Philosopher Revealing Computational Beauty',
  'Design Dreamer Imagining Synthetic Memory','Brand Strategist Exploring Synthetic Creativity',
  'Visual Designer Curating Machine Daydreams','Generative Designer Mapping Human Intuition',
  'Creative Technologist Exploring Digital Feelings','Experience Designer Orchestrating Artificial Emotions',
  'Creative Researcher Documenting Machine Curiosity','Interaction Designer Translating Data Into Meaning'
]
const curatedCultural = [
  'UX Strategist Translating Humans for Machines','Creative Technologist Mediating Machine Drama',
  'AI Consultant Specializing in Glorious Accidents','Design Strategist Balancing Logic and Vibes',
  'Visual Designer Exploring Post-Human Aesthetics','Brand Strategist Studying Digital Belief Systems',
  'Experience Designer Teaching AI to Listen','Interaction Architect Making Automation Feel Human',
  'Product Designer Navigating Synthetic Relationships','Design Researcher Managing Expectations on Both Sides',
  'Content Strategist Bridging Machine Empathy','Service Designer Negotiating Digital Etiquette',
  'AI Mediator Moderating AI Social Skills','Digital Anthropologist Coaching Human–Machine Dynamics',
  'Design Diplomat Facilitating Algorithmic Sensitivity','Designer Negotiating With Artificial Intelligence',
  'Prompt Architect Building Better Mistakes','AI Designer Managing Human Expectations',
  'Design Systems Lead Keeping Machines Polite','UX Strategist Moderating Human–AI Misunderstandings',
  'Ethical Designer Teaching Machines Manners','Systems Architect Designing for Uncertainty'
]
const curatedSoftSatire = [
  'Designer Managing Machine Expectations','AI Specialist With Commitment Issues',
  'UX Researcher Measuring Human Patience','Creative Technologist Debugging Reality',
  'Brand Designer Calibrating Machine Tone','Experience Designer Teaching AI to Listen',
  'Interaction Architect Preventing Existential Errors','Design Systems Lead Keeping Machines Polite',
  'Product Designer Fighting Algorithmic Chaos','Visual Strategist Optimizing for Sanity',
  'AI Consultant Specializing in Glorious Accidents','Creative Technologist Fixing Problems AI Invented',
  'UX Designer Moderating Human–Machine Arguments','Ethical Designer Navigating Gray Areas',
  'Interface Architect Making Automation Feel Friendly','Generative Designer Redefining What Counts as Work',
  'Design Strategist Translating Chaos Into Meaning','Systems Designer Helping Machines Play Nice',
  'AI Advisor Managing Expectations Since Beta','Visual Designer Curating Machine Daydreams',
  'AI Specialist With Trust Issues','Creative Technologist Working Through Feedback Loops',
  'Design Systems Lead Preventing Existential Crises','Product Designer Debugging Emotional Logic',
  'Interaction Architect Building Conversations That Behave','Generative Designer Rewriting the Brief Again',
  'Experience Designer Making Automation Feel Normal','Design Strategist Translating Between Teams and Models',
  'Creative Researcher Testing Empathy Under Pressure','Interface Architect Keeping Machines on Brand',
  'Visual Designer Balancing Chaos and Consistency','Ethical Design Lead Navigating Gray Areas',
  'UX Designer With Imposter Syndrome','Product Designer With Perfectionist Tendencies',
  'Brand Strategist With Strong Opinions','AI Consultant With Realistic Expectations',
  'Visual Designer With Infinite Patience'
]
const curatedStudioRealism = [
  'AI Product Designer','UX Researcher for Intelligent Systems',
  'Creative Technologist Working With Generative Tools','Design Strategist Focused on Human Experience',
  'Visual Designer Exploring Computational Aesthetics','Interaction Architect for Adaptive Interfaces',
  'Product Designer Building Hybrid Workflows','Brand Strategist Integrating AI Insights',
  'Experience Designer Mapping Digital Behaviors','Design Systems Lead for Emerging Platforms',
  'Creative Researcher Studying Design Intelligence','AI Design Specialist for Ethical Use',
  'Interface Designer Prototyping With Real Data','Visual Strategist Developing New Design Languages',
  'UX Engineer Bridging Design and Code','AI Experience Consultant',
  'Product Strategist for Automated Services','Creative Technologist Shaping Future Interfaces',
  'Design Researcher Investigating Human–Machine Interaction','Systems Designer Building Adaptive Frameworks',
  'Design Technologist','AI Strategist','UX Engineer for Interactive Systems',
  'Product Designer Exploring Smart Products','Service Designer',
  'Visual Designer for AI Ethics','Content Designer Working With Conversational Interfaces',
  'AI UX Designer Researching Digital Behaviors'
]

const allCurated = [
  ...curatedTechnical, ...curatedPoetic, ...curatedCultural,
  ...curatedSoftSatire, ...curatedStudioRealism
]

const MAX_WORDS = 6
const MIN_WORDS = 3

const normalizeCasing = (s: string) => {
  const smallWords = new Set(['a','an','and','as','at','but','by','for','from','in','into','nor','of','on','or','the','to','with','via','per'])
  const words = s.split(' ')
  const result = words.map((word, index) => {
    const lower = word.toLowerCase()
    if (index === 0 || index === words.length - 1) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    if (smallWords.has(lower) && !word.includes('–') && !word.includes('-')) return lower
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }).join(' ')
  return result
    .replace(/\bAi\b/g, 'AI').replace(/-ai\b/gi, '-AI').replace(/\bai-/gi, 'AI-')
    .replace(/–ai\b/gi, '–AI').replace(/\bLlm\b/g, 'LLM').replace(/\bGpt\b/g, 'GPT')
    .replace(/\bUx\b/g, 'UX').replace(/\bUi\b/g, 'UI')
}

const dropRedundant = (s: string) =>
  s.replace(/\bAI AI\b/g, 'AI').replace(/\bDesigner Designer\b/gi, 'Designer')
   .replace(/\bStrategist Strategist\b/gi, 'Strategist').replace(/\s+/g, ' ').trim()

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

const shortenSmart = (s: string) => {
  let parts = s.split(' ').filter(Boolean)
  while (parts.length > MAX_WORDS) {
    if (parts.length > 3) parts.splice(2, 1)
    else parts.pop()
  }
  return parts.join(' ')
}

const withinWordBounds = (s: string) => {
  let t = s
  if (wordCount(t) > MAX_WORDS) t = shortenSmart(t)
  return wordCount(t) < MIN_WORDS ? null : t
}

const isAwkward = (s: string) => {
  const awkward = [
    /\bDesigner Designer\b/i, /\bStrategist Strategist\b/i,
    /\bArchitect Architect\b/i, /\bResearcher Researcher\b/i,
    /\bAI AI\b/i, /\bUX UX\b/i, /^I\b/, /\bmy\b/i,
    /\bfor for\b/i, /\bWith With\b/i, /\bthe the\b/i,
    /\bManaging for\b/i, /\b(\w+)\s+\1\s+\1\b/i,
  ]
  return awkward.some(rx => rx.test(s))
}

const technicalPattern = (rng: () => number) => `${pick(technicalRoles, rng)} ${pick(technicalVerbs, rng)} ${pick(technicalObjects, rng)}`
const poeticPattern = (rng: () => number) => `${pick(poeticRoles, rng)} ${pick(poeticVerbs, rng)} ${pick(poeticObjects, rng)}`
const culturalPattern = (rng: () => number) => `${pick(culturalRoles, rng)} ${pick(culturalVerbs, rng)} ${pick(culturalObjects, rng)}`

const softSatirePattern = (rng: () => number) => {
  const patterns: Array<[(rng: () => number) => string, number]> = [
    [(rng) => `${pick(softSatireRoles, rng)} With ${pick(softSatireTraits, rng)}`, 0.3],
    [(rng) => `${pick(softSatireRoles, rng)} ${pick(softSatireActionVerbs, rng)} ${pick(softSatireActionObjects, rng)}`, 0.7],
  ]
  return pickWeighted(patterns, rng)(rng)
}

const studioRealismPattern = (rng: () => number) => {
  const patterns: Array<[(rng: () => number) => string, number]> = [
    [(rng) => pick(studioRealismRoles, rng), 0.1],
    [(rng) => `${pick(studioRealismRoles, rng)} for ${pick(studioRealismObjects, rng)}`, 0.4],
    [(rng) => {
      const role = pick(studioRealismRoles, rng)
      const verb = pick(studioRealismActiveVerbs, rng)
      const contextMatch = Object.values(studioRealismContextGroups).find(g => g.roles.includes(role))
      const object = (contextMatch && rng() < 0.7) ? pick(contextMatch.objects, rng) : pick(studioRealismObjects, rng)
      return `${role} ${verb} ${object}`
    }, 0.5],
  ]
  return pickWeighted(patterns, rng)(rng)
}

const VOICE_PATTERNS: Array<[(rng: () => number) => string, number]> = [
  [technicalPattern, 1],
  [poeticPattern, 1],
  [culturalPattern, 1],
  [softSatirePattern, 1],
  [studioRealismPattern, 1],
]

const emojiPool = [
  '🤖','🧠','💡','⚡','🔥','💥','✨','🌀','💫','🎨',
  '🖌️','✏️','🔬','🧪','📊','💾','⚙️','🏗️','🔧','🎯',
  '♟️','🧭','🌍','🤝','🎭','💙','🧡','💜','🌸','🔮',
  '🌙','🚀','🛸','🌐','⚖️','🕊️','🌿','🧬','📡','🫂',
  '🌊','🦋','🧩','🎲','🪄','🔭','🌈','🪐','🌋','🧲',
  '💎','🎵','📐','🗺️','🧶','🔑','🧿','🫧','🌵','🦜',
  '🪩','💻','🖥️','🎪','🦚','🎠','🌺','🧊','🪞','🎬',
]

const getEmoji = (_title: string, rng: () => number): string => {
  return emojiPool[Math.floor(rng() * emojiPool.length)]
}

export const generateTitle = (seed = Date.now()): { title: string; emoji: string } => {
  const rng = makePRNG(seed)
  let title: string
  if (rng() < 0.45) {
    title = pick(allCurated, rng)
  } else {
    let candidate = pickWeighted(VOICE_PATTERNS, rng)(rng)
    candidate = normalizeCasing(candidate)
    candidate = dropRedundant(candidate)
    const bounded = withinWordBounds(candidate)
    title = (!bounded || isAwkward(bounded)) ? pick(allCurated, rng) : bounded
  }
  const emoji = getEmoji(title, rng)
  return { title, emoji }
}
