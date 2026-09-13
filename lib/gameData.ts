import { Achievement, BuildingId, Mission, ShopItem } from "./types";

export const BUILDINGS: {
  id: BuildingId;
  name: string;
  icon: string;
  unlockLevel: number;
  href: string;
  gridArea: string;
}[] = [
  { id: "park", name: "Park", icon: "🌳", unlockLevel: 2, href: "/town/park", gridArea: "park" },
  { id: "school", name: "School", icon: "🏫", unlockLevel: 3, href: "/town/school", gridArea: "school" },
  { id: "stadium", name: "Stadium", icon: "🏆", unlockLevel: 5, href: "/town/stadium", gridArea: "stadium" },
  { id: "craftStore", name: "Craft Store", icon: "🧶", unlockLevel: 3, href: "/town/craft-store", gridArea: "craft" },
  { id: "arcade", name: "Arcade", icon: "🎮", unlockLevel: 1, href: "/arcade", gridArea: "arcade" },
  { id: "police", name: "Police Station", icon: "🕵️", unlockLevel: 4, href: "/town/police", gridArea: "police" },
  { id: "shop", name: "Shop", icon: "🏪", unlockLevel: 1, href: "/shop", gridArea: "shop" },
  { id: "home", name: "Home", icon: "🏠", unlockLevel: 1, href: "/home", gridArea: "home" },
  { id: "library", name: "Library", icon: "📚", unlockLevel: 2, href: "/town/library", gridArea: "library" },
  { id: "cafe", name: "Cafe", icon: "🍰", unlockLevel: 4, href: "/town/cafe", gridArea: "cafe" },
];

export const XP_PER_LEVEL = (level: number) => 100 + (level - 1) * 40;

// Which mini-game a town activity uses to be completed.
// "timing" = oscillating bar, "tap" = mash, "catch" = tap targets,
// "flash" = memory sequence. Omit to default to "timing".
export type ChallengeKey = "timing" | "tap" | "catch" | "flash";

export interface TownActivity {
  id: string;
  label: string;
  icon: string;
  description: string;
  challenge?: ChallengeKey;
  costCoins?: number;
  costEnergy?: number;
  rewardCoins?: number;
  rewardXp?: number;
  rewardHappiness?: number;
  rewardEnergy?: number;
  resultText: string;
}

export interface TownLocationConfig {
  id: BuildingId;
  name: string;
  icon: string;
  tagline: string;
  activities: TownActivity[];
}

// Flavor + a few activities for each non-arcade/shop/home town location.
export const TOWN_LOCATIONS: Record<string, TownLocationConfig> = {
  park: {
    id: "park",
    name: "Park",
    icon: "🌳",
    tagline: "Green paths, a duck pond, and a breeze that always smells like fresh-cut grass.",
    activities: [
      {
        id: "walk",
        label: "Take a walk",
        icon: "🚶",
        description: "A lap around the pond, free and easy.",
        challenge: "tap",
        rewardCoins: 10,
        rewardHappiness: 15,
        resultText: "That walk felt great!",
      },
      {
        id: "picnic",
        label: "Have a picnic",
        icon: "🧺",
        description: "Spread out a blanket and relax for a while.",
        challenge: "timing",
        costCoins: 20,
        rewardHappiness: 25,
        rewardEnergy: 10,
        resultText: "Best picnic ever.",
      },
      {
        id: "frisbee",
        label: "Play frisbee",
        icon: "🥏",
        description: "Join a pickup game with some other townsfolk.",
        challenge: "catch",
        rewardXp: 10,
        rewardHappiness: 10,
        resultText: "Nice throw! That was fun.",
      },
    ],
  },
  school: {
    id: "school",
    name: "School",
    icon: "🏫",
    tagline: "Pop into a quick lesson and pick up some easy XP.",
    activities: [
      {
        id: "lesson",
        label: "Attend a lesson",
        icon: "📖",
        description: "A quick class on something new.",
        challenge: "flash",
        rewardXp: 25,
        resultText: "You learned something new!",
      },
      {
        id: "studygroup",
        label: "Join a study group",
        icon: "👥",
        description: "Focused studying with friends. Tiring, but worth it.",
        challenge: "timing",
        costEnergy: 10,
        rewardXp: 40,
        resultText: "That was intense, but you learned a lot.",
      },
      {
        id: "helpclassmate",
        label: "Help a classmate",
        icon: "🙋",
        description: "Explain a tricky problem to someone stuck on it.",
        challenge: "tap",
        rewardXp: 15,
        rewardHappiness: 10,
        resultText: "Teaching is its own kind of learning.",
      },
    ],
  },
  stadium: {
    id: "stadium",
    name: "Stadium",
    icon: "🏆",
    tagline: "The crowd is roaring — today's match is about to start.",
    activities: [
      {
        id: "cheer",
        label: "Cheer with the crowd",
        icon: "📣",
        description: "Free seats in the nosebleeds — still a great view.",
        challenge: "tap",
        rewardCoins: 20,
        rewardHappiness: 10,
        resultText: "What a game! Your cheering paid off.",
      },
      {
        id: "bigmatch",
        label: "Watch the big match",
        icon: "🎟️",
        description: "Splurge on a good seat for the main event.",
        challenge: "timing",
        costCoins: 15,
        rewardHappiness: 30,
        resultText: "Worth every coin — what an ending!",
      },
      {
        id: "pickup",
        label: "Join a pickup game",
        icon: "⚽",
        description: "Get out on the field yourself.",
        challenge: "catch",
        costEnergy: 10,
        rewardXp: 20,
        rewardHappiness: 15,
        resultText: "You're exhausted, but that felt amazing.",
      },
    ],
  },
  craftStore: {
    id: "craftStore",
    name: "Craft Store",
    icon: "🧶",
    tagline: "Shelves of yarn, beads, and paint. A full crafting workshop is coming soon.",
    activities: [
      {
        id: "quickcraft",
        label: "Make a quick craft",
        icon: "✂️",
        description: "Whip up a little trinket to sell.",
        challenge: "timing",
        rewardCoins: 15,
        rewardXp: 10,
        resultText: "You made a little trinket to sell!",
      },
      {
        id: "browse",
        label: "Browse the supplies",
        icon: "🧵",
        description: "Just looking, but it's inspiring.",
        challenge: "flash",
        rewardHappiness: 5,
        resultText: "So many ideas for later.",
      },
      {
        id: "sellcraft",
        label: "Sell a finished piece",
        icon: "💰",
        description: "Put in the effort, take home the coins.",
        challenge: "tap",
        costEnergy: 10,
        rewardCoins: 40,
        resultText: "Sold! Someone loved your work.",
      },
    ],
  },
  police: {
    id: "police",
    name: "Police Station",
    icon: "🕵️",
    tagline: "Quiet today — the officers are happy to help with lost & found.",
    activities: [
      {
        id: "lostfound",
        label: "Check lost & found",
        icon: "🎒",
        description: "See if anything good turned up.",
        challenge: "catch",
        rewardCoins: 25,
        resultText: "You found a stray coin pouch — finders keepers!",
      },
      {
        id: "report",
        label: "Report a lost item",
        icon: "📝",
        description: "Fill out some paperwork, feel productive.",
        challenge: "flash",
        rewardXp: 10,
        rewardHappiness: 5,
        resultText: "All logged. Someone will get it back.",
      },
      {
        id: "patrol",
        label: "Join the community patrol",
        icon: "🚨",
        description: "Walk the neighborhood keeping an eye out.",
        challenge: "tap",
        costEnergy: 15,
        rewardCoins: 35,
        rewardXp: 15,
        resultText: "The neighborhood thanks you.",
      },
    ],
  },
  library: {
    id: "library",
    name: "Library",
    icon: "📚",
    tagline: "Rows of quiet shelves, perfect for getting lost in a good book.",
    activities: [
      {
        id: "readbook",
        label: "Read a book",
        icon: "📕",
        description: "Curl up in a corner with something good.",
        challenge: "flash",
        rewardXp: 20,
        rewardHappiness: 5,
        resultText: "That story was worth the read.",
      },
      {
        id: "studyquiet",
        label: "Study quietly",
        icon: "🤫",
        description: "Heads-down focus time.",
        challenge: "timing",
        costEnergy: 10,
        rewardXp: 30,
        resultText: "You got a lot done.",
      },
      {
        id: "archives",
        label: "Browse the archives",
        icon: "🗂️",
        description: "Dig up something old and interesting.",
        challenge: "catch",
        rewardCoins: 10,
        rewardXp: 10,
        resultText: "Found something worth keeping.",
      },
    ],
  },
  cafe: {
    id: "cafe",
    name: "Cafe",
    icon: "🍰",
    tagline: "Warm pastries and the low hum of conversation. Smells like cinnamon.",
    activities: [
      {
        id: "snack",
        label: "Grab a snack",
        icon: "🍪",
        description: "A quick bite between errands.",
        challenge: "tap",
        costCoins: 10,
        rewardEnergy: 20,
        rewardHappiness: 5,
        resultText: "Yum! That hit the spot.",
      },
      {
        id: "treat",
        label: "Order a fancy treat",
        icon: "🍰",
        description: "Splurge on the good stuff.",
        challenge: "timing",
        costCoins: 20,
        rewardEnergy: 30,
        rewardHappiness: 15,
        resultText: "So worth it.",
      },
      {
        id: "chat",
        label: "Chat with a friend",
        icon: "💬",
        description: "Catch up over the counter, free of charge.",
        challenge: "flash",
        rewardHappiness: 15,
        resultText: "Good conversation is its own reward.",
      },
    ],
  },
};

export const SHOP_ITEMS: ShopItem[] = [
  // Clothing
  { id: "cl-hoodie", name: "Cloud Hoodie", category: "clothing", price: 80, rarity: "common", icon: "👕", description: "Soft and cozy, perfect for town strolls." },
  { id: "cl-cap", name: "Backwards Cap", category: "clothing", price: 40, rarity: "common", icon: "🧢", description: "Instant style upgrade." },
  { id: "cl-shades", name: "Star Shades", category: "clothing", price: 120, rarity: "uncommon", icon: "🕶️", description: "See the town in style." },
  { id: "cl-cape", name: "Hero Cape", category: "clothing", price: 300, rarity: "rare", icon: "🦸", description: "Flows dramatically in the wind." },
  { id: "cl-sneakers", name: "Comet Sneakers", category: "clothing", price: 90, rarity: "common", icon: "👟", description: "Light, bouncy, and fast." },
  { id: "cl-scarf", name: "Rainbow Scarf", category: "clothing", price: 55, rarity: "common", icon: "🧣", description: "Cozy and colorful." },
  { id: "cl-crown", name: "Party Crown", category: "clothing", price: 250, rarity: "rare", icon: "👑", description: "Because you deserve it." },
  { id: "cl-wings", name: "Fairy Wings", category: "clothing", price: 400, rarity: "epic", icon: "🧚", description: "Shimmer with every step." },

  // Furniture (placeable)
  { id: "fu-bed", name: "Cloud Bed", category: "furniture", price: 150, rarity: "common", icon: "🛏️", description: "For resting up your energy.", placeable: true },
  { id: "fu-chair", name: "Bean Chair", category: "furniture", price: 60, rarity: "common", icon: "🪑", description: "Squishy and comfortable.", placeable: true },
  { id: "fu-desk", name: "Study Desk", category: "furniture", price: 100, rarity: "common", icon: "🖥️", description: "Great for homework and games.", placeable: true },
  { id: "fu-plant", name: "Potted Plant", category: "furniture", price: 35, rarity: "common", icon: "🌱", description: "A little greenery goes a long way.", placeable: true },
  { id: "fu-console", name: "Game Console", category: "furniture", price: 220, rarity: "uncommon", icon: "🎮", description: "Play at home too.", placeable: true },
  { id: "fu-poster", name: "Retro Poster", category: "furniture", price: 45, rarity: "common", icon: "🖼️", description: "Adds personality to any wall.", placeable: true },
  { id: "fu-plushie", name: "Star Plushie", category: "furniture", price: 55, rarity: "uncommon", icon: "🧸", description: "Squeeze for good luck.", placeable: true },
  { id: "fu-bookshelf", name: "Bookshelf", category: "furniture", price: 130, rarity: "common", icon: "📚", description: "For all your library finds.", placeable: true },
  { id: "fu-fishtank", name: "Fish Tank", category: "furniture", price: 180, rarity: "uncommon", icon: "🐠", description: "Calming to watch after a long day.", placeable: true },
  { id: "fu-guitar", name: "Guitar", category: "furniture", price: 160, rarity: "uncommon", icon: "🎸", description: "Learn a chord or two.", placeable: true },
  { id: "fu-telescope", name: "Telescope", category: "furniture", price: 260, rarity: "rare", icon: "🔭", description: "Stargazing from your room.", placeable: true },

  // Decorations
  { id: "de-rug", name: "Rainbow Rug", category: "decorations", price: 90, rarity: "uncommon", icon: "🎨", description: "Ties the whole room together.", placeable: true },
  { id: "de-lamp", name: "Star Lamp", category: "decorations", price: 70, rarity: "common", icon: "💡", description: "Warm, glowy light.", placeable: true },
  { id: "de-clock", name: "Sunburst Clock", category: "decorations", price: 65, rarity: "common", icon: "🕰️", description: "Never lose track of playtime.", placeable: true },
  { id: "de-mirror", name: "Round Mirror", category: "decorations", price: 85, rarity: "uncommon", icon: "🪞", description: "Check your outfit before heading out.", placeable: true },
  { id: "de-garland", name: "Fairy Lights", category: "decorations", price: 100, rarity: "uncommon", icon: "✨", description: "Twinkly and dreamy.", placeable: true },

  // Gaming
  { id: "ga-controller", name: "Gold Controller", category: "gaming", price: 200, rarity: "rare", icon: "🎮", description: "For serious arcade champs." },
  { id: "ga-headset", name: "Pro Headset", category: "gaming", price: 130, rarity: "uncommon", icon: "🎧", description: "Hear every arcade beep." },
  { id: "ga-keyboard", name: "Clicky Keyboard", category: "gaming", price: 110, rarity: "uncommon", icon: "⌨️", description: "Satisfying with every tap." },
  { id: "ga-trophycase", name: "Trophy Case", category: "gaming", price: 240, rarity: "rare", icon: "🏅", description: "Show off your arcade wins.", placeable: true },

  // Pets (ownable now, full pet system later)
  { id: "pe-dog", name: "Puppy", category: "pets", price: 500, rarity: "epic", icon: "🐶", description: "A loyal companion. Full pet care coming soon!" },
  { id: "pe-cat", name: "Kitten", category: "pets", price: 500, rarity: "epic", icon: "🐱", description: "Independent and cuddly. Full pet care coming soon!" },
  { id: "pe-rabbit", name: "Bunny", category: "pets", price: 450, rarity: "epic", icon: "🐰", description: "Hops around happily. Full pet care coming soon!" },
  { id: "pe-bird", name: "Songbird", category: "pets", price: 400, rarity: "rare", icon: "🦜", description: "Sings you a little tune. Full pet care coming soon!" },
];

export const MISSIONS: Mission[] = [
  {
    id: "m-play3",
    title: "Play 3 games",
    description: "Head to the Arcade and play any mini-game 3 times.",
    target: 3,
    rewardCoins: 100,
    rewardXp: 50,
    type: "playGames",
  },
  {
    id: "m-earn500",
    title: "Earn 500 coins",
    description: "Earn coins from games and events.",
    target: 500,
    rewardCoins: 150,
    rewardXp: 75,
    type: "earnCoins",
  },
  {
    id: "m-firstfurniture",
    title: "Buy your first furniture item",
    description: "Visit the Shop and buy something for your house.",
    target: 1,
    rewardCoins: 50,
    rewardXp: 25,
    type: "buyFurniture",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "a-firstgame",
    title: "First Game",
    description: "Play your first game.",
    check: (s) => s.gamesPlayed >= 1,
  },
  {
    id: "a-bigspender",
    title: "Big Spender",
    description: "Spend 1,000 coins.",
    check: (s) => s.coinsSpent >= 1000,
  },
  {
    id: "a-level5",
    title: "Level 5",
    description: "Reach level 5.",
    check: (s) => s.level >= 5,
  },
  {
    id: "a-collector",
    title: "Collector",
    description: "Own 10 items.",
    check: (s) => s.itemsOwned >= 10,
  },
  {
    id: "a-gamer",
    title: "Gamer",
    description: "Play 25 games.",
    check: (s) => s.gamesPlayed >= 25,
  },
];

export const RANDOM_EVENTS: { text: string; coins?: number; xp?: number; icon: string }[] = [
  { text: "You found some coins on the ground!", coins: 50, icon: "🍀" },
  { text: "You spotted a mystery box and peeked inside!", coins: 20, xp: 10, icon: "🎁" },
  { text: "A lost puppy followed you for a while!", xp: 15, icon: "🐶" },
  { text: "You helped a neighbor carry groceries!", coins: 15, xp: 5, icon: "🛒" },
];

export interface ArcadeGameConfig {
  id: string;
  name: string;
  icon: string;
  href: string;
  live: boolean;
}

export const ARCADE_GAMES: ArcadeGameConfig[] = [
  { id: "reaction", name: "Reaction Time", icon: "⚡", href: "/arcade/reaction", live: true },
  { id: "memory", name: "Memory Match", icon: "🧠", href: "/arcade/memory", live: true },
  { id: "math", name: "Quick Math", icon: "➕", href: "/arcade/math", live: true },
  { id: "trivia", name: "Trivia", icon: "❓", href: "/arcade/trivia", live: true },
  { id: "typing", name: "Speed Typing", icon: "⌨️", href: "/arcade/typing", live: true },
  { id: "wordle", name: "Word Guess", icon: "🔤", href: "#", live: false },
  { id: "sudoku", name: "Sudoku", icon: "🔢", href: "#", live: false },
  { id: "snake", name: "Snake", icon: "🐍", href: "#", live: false },
];

export const MEMORY_ICONS = ["🍎", "🎈", "🐸", "🌟", "🍩", "🎧", "🚀", "🐙"];

export const TYPING_WORDS = [
  "apple", "rocket", "puzzle", "dragon", "planet", "guitar", "wizard", "ninja",
  "castle", "cookie", "jungle", "robot", "banana", "comet", "pirate", "sunset",
  "galaxy", "pencil", "turtle", "thunder", "diamond", "monster", "rainbow", "island",
];

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  { id: "t1", question: "How many coins does buying nothing cost?", options: ["0", "10", "100", "It depends"], correctIndex: 0 },
  { id: "t2", question: "What shape has 3 sides?", options: ["Square", "Triangle", "Circle", "Hexagon"], correctIndex: 1 },
  { id: "t3", question: "Which of these is a fruit?", options: ["Carrot", "Potato", "Apple", "Broccoli"], correctIndex: 2 },
  { id: "t4", question: "What color do you get mixing blue and yellow?", options: ["Purple", "Orange", "Green", "Pink"], correctIndex: 2 },
  { id: "t5", question: "How many days are in a week?", options: ["5", "6", "7", "8"], correctIndex: 2 },
  { id: "t6", question: "Which planet do we live on?", options: ["Mars", "Earth", "Venus", "Jupiter"], correctIndex: 1 },
  { id: "t7", question: "What do bees make?", options: ["Milk", "Honey", "Silk", "Butter"], correctIndex: 1 },
  { id: "t8", question: "Which animal says 'moo'?", options: ["Dog", "Cat", "Cow", "Duck"], correctIndex: 2 },
  { id: "t9", question: "How many legs does a spider have?", options: ["6", "8", "10", "4"], correctIndex: 1 },
  { id: "t10", question: "What's the opposite of hot?", options: ["Warm", "Cold", "Bright", "Fast"], correctIndex: 1 },
];