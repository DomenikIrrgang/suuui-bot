// The SuuUI Discord server, as data. setup.mjs makes the server match this file; run it again after a change.
// Colours come from the SuuUI design system's tokens (gilt, arcane, amber, ward, class-*).

const links = {
  site: "https://suuui.dev",
  github: "https://github.com/DomenikIrrgang/suuui",
  issues: "https://github.com/DomenikIrrgang/suuui/issues",
  releases: "https://github.com/DomenikIrrgang/suuui/releases",
  api: "https://github.com/DomenikIrrgang/suuui/blob/main/Docs/API.md",
  examplePlugin: "https://github.com/DomenikIrrgang/suuui/tree/main/Examples/SuuUI_HelloPlugin",
  curseforge: "https://www.curseforge.com/wow/addons/suuui",
  wago: "https://addons.wago.io/addons/suuui",
  wowlua: "https://wowlua.dev",
};

export const guild = {
  name: "SuuUI",
  description: "Home of SuuUI, the full interface replacement for World of Warcraft Forever. Quiet until it matters.",
  icon: "assets/icon.png",
  botNickname: "SuuUI",
  botAvatar: "assets/avatar-ready.png", // the mark with arcane's "ready" glow (render-images.mjs)
  botBanner: "assets/banner.png", // the crest and the tagline
  verificationLevel: 4, // highest: a verified phone number
  explicitContentFilter: 2, // scan everyone's media
  defaultNotifications: 1, // mentions only
  rulesChannel: "rules",
  updatesChannel: "mod-updates",
  systemChannel: "mod-log",
  embedColor: 0xc9a75a, // gilt
};

// Top to bottom, as they appear in the member list. Names are coloured by the highest coloured role, so class roles
// sit above Tester and Plugin Author: like SuuUI's unit frames, a member's name shows their class colour.
export const roles = [
  { key: "dev", name: "Developer", color: 0xe6cc8a, hoist: true, perms: ["ADMINISTRATOR"] },
  {
    key: "mod", name: "Moderator", color: 0xc9a75a, hoist: true, mentionable: true,
    perms: ["KICK_MEMBERS", "BAN_MEMBERS", "MODERATE_MEMBERS", "MANAGE_MESSAGES", "MANAGE_THREADS", "MANAGE_NICKNAMES",
      "VIEW_AUDIT_LOG", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "MANAGE_EVENTS", "CREATE_EVENTS", "MENTION_EVERYONE"],
  },
  { key: "contributor", name: "Contributor", color: 0x3fd0ff, hoist: true },
  { key: "warrior", name: "Warrior", color: 0xc79c6e },
  { key: "paladin", name: "Paladin", color: 0xf58cba },
  { key: "hunter", name: "Hunter", color: 0xabd473 },
  { key: "rogue", name: "Rogue", color: 0xfff569 },
  { key: "priest", name: "Priest", color: 0xffffff },
  { key: "shaman", name: "Shaman", color: 0x0070de },
  { key: "mage", name: "Mage", color: 0x69ccf0 },
  { key: "warlock", name: "Warlock", color: 0x9482c9 },
  { key: "druid", name: "Druid", color: 0xff7d0a },
  { key: "tester", name: "Tester", color: 0xffb23f, hoist: true },
  { key: "plugin", name: "Plugin Author", color: 0xf4e7c1 },
  { key: "bots", name: "Bots", color: 0xa39b8b, hoist: true },
  { key: "tank", name: "Tank" },
  { key: "healer", name: "Healer" },
  { key: "dps", name: "DPS" },
  { key: "pingRelease", name: "Release pings" },
  { key: "pingEvent", name: "Event pings" },
  { key: "pingApi", name: "API change pings" },
];

// What every member can do. Everything else comes from roles and channel overwrites.
export const everyonePerms = [
  "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "CREATE_PUBLIC_THREADS", "READ_MESSAGE_HISTORY",
  "ADD_REACTIONS", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "CHANGE_NICKNAME", "USE_APPLICATION_COMMANDS",
  "CONNECT", "SPEAK", "STREAM", "USE_VAD", "REQUEST_TO_SPEAK", "SEND_VOICE_MESSAGES", "SEND_POLLS", "CREATE_INSTANT_INVITE",
];

// Overwrite presets. "everyone" is @everyone; other keys are role keys above.
const readOnly = {
  everyone: { deny: ["SEND_MESSAGES", "CREATE_PUBLIC_THREADS", "CREATE_PRIVATE_THREADS", "SEND_MESSAGES_IN_THREADS"] },
  mod: { allow: ["SEND_MESSAGES"] },
};
const testersOnly = { everyone: { deny: ["VIEW_CHANNEL"] }, tester: { allow: ["VIEW_CHANNEL"] }, mod: { allow: ["VIEW_CHANNEL"] } };
const staffOnly = { everyone: { deny: ["VIEW_CHANNEL"] }, mod: { allow: ["VIEW_CHANNEL"] } };

const areaTags = ["Unit & group frames", "Nameplates", "Action bars", "Cooldown Manager", "Auras", "Chat", "Bags",
  "Windows", "Map & minimap", "Group Finder"];

// type: text | announcement | forum | voice | stage. Categories keep their overwrites; channels add their own on top.
export const categories = [
  {
    name: "📢 ◆ INFORMATION ◆ 📢", overwrites: readOnly,
    channels: [
      { name: "welcome", type: "text", topic: "What SuuUI is, where to get it, and how this server works." },
      { name: "rules", type: "text", topic: "Read these before you post." },
      { name: "announcements", type: "announcement", topic: "News about SuuUI and this server." },
      // suuui's CI posts each release through this webhook and pings @Release pings (.github/scripts/discord-release.mjs).
      { name: "releases", type: "announcement", topic: "Every SuuUI release, posted as it ships.", webhook: { name: "SuuUI Releases" } },
      { name: "faq", type: "text", topic: "Answers to the questions we hear most." },
    ],
  },
  {
    name: "💬 ◆ COMMUNITY ◆ 💬",
    channels: [
      { name: "general", type: "text", topic: "Talk about SuuUI. Questions go to <#help>, bugs to <#bug-reports>." },
      {
        name: "ui-showcase", type: "forum", layout: "gallery", reaction: ":suuui:",
        topic: "Show your SuuUI setup. One post per setup, with a screenshot. Say what you play and what you changed.",
        tags: ["Solo", "Dungeon", "Raid", "PvP", "Tank", "Healer", "DPS"],
      },
      {
        name: "profiles", type: "forum", requireTag: true,
        topic: "Share SuuUI profiles and Cooldown Manager setups. Paste the export string in a code block, say what it is for, and add a screenshot.",
        tags: ["Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Shaman", "Mage", "Warlock", "Druid", "Tank", "Healer", "DPS", "Full profile", "Cooldown Manager"],
      },
      {
        name: "suggestions", type: "forum", requireTag: true, reaction: "👍",
        topic: "One idea per post. Start with the problem you have, then your idea. Search first: if it exists, add your 👍 and your case there.",
        tags: [...areaTags, "Other"], modTags: ["Under review", "Planned", "In a test build", "Shipped", "Not planned"],
      },
      // The one channel not about SuuUI, so off-topic talk has a place outside #general and #help.
      { name: "off-topic", type: "text", topic: "Anything else. Keep the rules in mind." },
    ],
  },
  {
    name: "🆘 ◆ SUPPORT ◆ 🆘",
    channels: [
      {
        name: "help", type: "forum", requireTag: true,
        topic: "One question per post, with a tag. Tell us what you tried and paste `/suu version`. A screenshot helps with anything visual. When it's solved, add the Solved tag.",
        tags: ["Installation", "Settings & profiles", ...areaTags, "Other", "Solved"], // Solved: whoever asked sets it
      },
      {
        name: "bug-reports", type: "forum", requireTag: true,
        topic: "One bug per post. Please include:\n1. What happened, and what you expected\n2. How to make it happen again\n3. Where: open world, dungeon, raid; in combat or not\n4. `/suu version`\n5. `/suu errors`, if it lists anything\n6. Your other addons\n\nConfirmed bugs get a GitHub issue and a link back here.",
        tags: [...areaTags, "Lua error", "Combat / taint", "Other"], modTags: ["Confirmed", "Fixed in a build", "Can't reproduce", "Duplicate"],
      },
      { name: "known-issues", type: "text", overwrites: readOnly, topic: "Confirmed bugs that many players hit, and their workarounds." },
    ],
  },
  {
    name: "🛠️ ◆ TESTING ◆ 🛠️", overwrites: testersOnly,
    channels: [
      { name: "test-builds", type: "text", overwrites: readOnly, topic: "New test builds, what changed, and what to check." },
      // Kept apart from #bug-reports and #suggestions, which are about released versions.
      {
        name: "test-reports", type: "forum", requireTag: true, reaction: "👍",
        topic: "Bugs and feedback for test builds, one per post. Released versions go in <#bug-reports> and <#suggestions>.\n\n" +
          "Start the title with the build, e.g. \"[0.4.0-beta.6] Raid frames lose range fading\". Please include:\n" +
          "1. What happened, and what you expected (for feedback: what you'd change, and why)\n" +
          "2. How to make it happen again\n3. Where: open world, dungeon, raid; in combat or not\n" +
          "4. `/suu version`, and `/suu errors` if it lists anything\n\n" +
          "Seeing the same thing? Add a 👍 and anything new you found. When a build ships, reports that still apply move to <#bug-reports>.",
        tags: ["Bug", "Feedback", "Regression", "Lua error", "Combat / taint"],
        modTags: ["Confirmed", "Fixed in next build", "Can't reproduce", "Working as intended", "Duplicate"],
      },
      { name: "test-chat", was: "test-feedback", type: "text", topic: "Talk about the current test build. Bugs and feedback get their own post in <#test-reports>." },
    ],
  },
  {
    name: "💻 ◆ DEVELOPMENT ◆ 💻", was: "◆ Development",
    channels: [
      { name: "plugins-and-api", type: "text", topic: `Writing plugins for SuuUI. API: ${links.api}` },
      { name: "wowlua", type: "text", topic: `SuuUI is built with wowlua: ${links.wowlua}` },
      { name: "contributing", type: "text", topic: `Working on SuuUI itself: ${links.github}` },
      { name: "github-feed", type: "text", overwrites: readOnly, topic: "Commits, pull requests and issues from GitHub.", webhook: { name: "GitHub", github: ["push", "pull_request", "issues"] } },
    ],
  },
  {
    name: "🔊 ◆ VOICE ◆ 🔊", was: "◆ Voice",
    channels: [
      { name: "Lounge", type: "voice" },
      { name: "Setup help", was: "Dungeon", type: "voice" }, // screen-share and get help setting SuuUI up
      { name: "Test session", was: "Raid", type: "voice", overwrites: testersOnly }, // trying a test build together
      { name: "Dev stream", type: "stage", topic: "Live development and Q&A." },
      // Test session and this one are hidden on their own, unlike the category: never "Sync now" them.
      { name: "Very secret channel", was: "Staff", type: "voice", overwrites: staffOnly },
    ],
  },
  {
    name: "🤫 ◆ VERY SECRET AREA ◆ 🤫", was: "⛔ ◆ STAFF ◆ ⛔", overwrites: staffOnly,
    channels: [
      { name: "mod-chat", type: "text", topic: "Moderators and developers." },
      { name: "mod-log", type: "text", topic: "AutoMod alerts, joins and Discord safety alerts." },
      { name: "mod-updates", type: "text", topic: "Updates from Discord for community servers." },
    ],
  },
];

// The server rules: the #rules post and Discord's rules screening, which members accept before they can post.
// Each is [headline, sentence]; screening shows them as plain text, at most 300 characters each.
export const rules = [
  ["Be kind.", "Critique the UI, never the person. No insults, harassment or drama."],
  ["Use the right channel.", "Questions go in #help, bugs in #bug-reports, ideas in #suggestions. One topic per post, and search first."],
  ["English in public channels,", "so everyone can follow and help."],
  ["No spam, ads or unsolicited DMs.", "No invites to other servers and no self-promotion without asking a moderator."],
  ["Addons, not cheats.", "No bots, exploits, automation, gold or account selling, or account sharing. Follow Blizzard's Terms of Service."],
  ["Nothing NSFW, hateful or discriminatory.", "This includes names, avatars and links."],
  ["Don't ping developers or moderators for support.", "Post in #help and someone will get to you."],
  ["Moderators have the final word.", "Breaking the rules gets a warning, then a timeout, then a ban. Serious cases skip straight to a ban."],
];

export const screening = {
  description: "SuuUI's home for help, bug reports and ideas. Please read and accept the rules.",
};

// Messages the bot keeps in a channel. Each entry is one message of one or more embeds; on a re-run they are edited.
export const messages = {
  welcome: [[
    {
      title: "Welcome to SuuUI",
      description:
        "SuuUI replaces the default interface of **World of Warcraft Forever** with one consistent UI. " +
        "One design system, every frame rebuilt from scratch, and nothing on screen that doesn't earn its place.\n\n:suuui: *Quiet until it matters.*",
      fields: [
        { name: "Get SuuUI", value: `[CurseForge](${links.curseforge}) · [Wago](${links.wago}) · [GitHub Releases](${links.releases})\nThen type \`/suu\` in game to open the settings.` },
        { name: "Find your way", value: "<#help> questions\n<#bug-reports> something broke\n<#suggestions> ideas\n<#ui-showcase> show your setup\n<#releases> every new version" },
        { name: "Pick your roles", value: "Open **Channels & Roles** at the top of the channel list to pick your class, your role, and the pings you want. Pick **Tester** to try builds before they ship." },
        { name: "Links", value: `[suuui.dev](${links.site}) · [GitHub](${links.github}) · [Plugin API](${links.api})` },
      ],
    },
  ]],
  rules: [[
    {
      title: "Rules",
      description: [
        ...rules.map(([head, text], i) => `**${i + 1}. ${head}** ${text.replace(/#([a-z-]+)/g, "<#$1>")}`),
        "",
        "Something needs attention now? Use Discord's report, or ping @Moderator.",
        "Discord's [Terms of Service](https://discord.com/terms) and [Community Guidelines](https://discord.com/guidelines) apply here too.",
      ].join("\n\n"),
    },
  ]],
  faq: [[
    {
      title: "FAQ",
      fields: [
        { name: "Which game does SuuUI work with?", value: "The WoW Forever client, interface 16001. It doesn't support retail or Classic Era." },
        { name: "How do I install it?", value: `Install from [CurseForge](${links.curseforge}) or [Wago](${links.wago}), or unpack the zip from [GitHub Releases](${links.releases}) into \`<World of Warcraft>/_classic_beta_/Interface/AddOns\`. Then start the game or type \`/reload\`.` },
        { name: "Where are the settings?", value: "`/suu` opens them. `/suu edit` moves frames on a snap grid, `/suu keybind` binds keys by hovering a button. `/suu help` lists every command." },
        { name: "I want Blizzard's frame back for one part.", value: "Every feature is a module. `/suu modules` lists them, `/suu disable <id>` turns one off, and Blizzard's frame comes back." },
        { name: "Something broke.", value: "Run `/suu errors` and `/suu version`, then post in <#bug-reports> with both." },
        { name: "Why doesn't something show a number in combat?", value: "In combat the game hides many values from addons. SuuUI hands them to the game to draw but never reads them, and hides what it can't know rather than guess." },
        { name: "Is it stable?", value: "SuuUI is in beta. Settings and frames can change between versions; <#releases> says what changed." },
        { name: "Can I write a plugin?", value: `Yes. Plugins use the same public API as the built-in modules. Start with the [API docs](${links.api}) and the [example plugin](${links.examplePlugin}), and ask in <#plugins-and-api>.` },
      ],
    },
  ]],
  "known-issues": [[
    { title: "Known issues", description: "Nothing listed yet. Confirmed bugs that many players hit go here, with a workaround if there is one." },
  ]],
  "test-builds": [[
    {
      title: "Testing SuuUI",
      description:
        "Test builds are posted here before they ship. Each post says what changed and what to check.\n\n" +
        "1. Install the build and `/reload`.\n2. Check what the post asks you to check, in the content it names.\n" +
        "3. Found a bug, or have feedback? Open a post in <#test-reports> with the build in its title. Talk it over in <#test-chat>.\n\n" +
        "Reports stay here until the build ships; whatever still applies then moves to <#bug-reports>.\n\n" +
        "Builds can break things. Keep a profile export so you can go back.",
    },
  ]],
};

// Discord AutoMod. Alerts go to #mod-log; Developer and Moderator are exempt.
export const automod = {
  alertChannel: "mod-log",
  exempt: ["dev", "mod"],
  rules: [
    { name: "Slurs and sexual content", trigger: "keyword_preset", presets: [2, 3] },
    { name: "Spam", trigger: "spam" },
    // Discord made this one with Community; saved once in Server Settings, the API can edit it.
    { name: "Block Mention Spam", trigger: "mention_spam", mentionLimit: 8, raidProtection: true },
    {
      name: "Invites and scams", trigger: "keyword", timeoutSeconds: 60,
      regex: ["discord(?:\\.gg|app\\.com/invite|\\.com/invite)/\\S+"],
      keywords: ["*free nitro*", "*nitro for free*", "*steam gift*", "*steamcommunity.com/gift*"],
    },
  ],
};

// Discord's onboarding: the default channels new members see, and the questions that hand out roles.
export const onboarding = {
  defaultChannels: ["welcome", "rules", "announcements", "releases", "faq", "general", "ui-showcase", "help",
    "bug-reports", "suggestions", "off-topic"],
  prompts: [
    {
      title: "Which classes do you play?", multi: true, required: true, // everyone gets a class-coloured name
      options: [["Warrior", "warrior"], ["Paladin", "paladin"], ["Hunter", "hunter"], ["Rogue", "rogue"], ["Priest", "priest"],
        ["Shaman", "shaman"], ["Mage", "mage"], ["Warlock", "warlock"], ["Druid", "druid"]],
    },
    { title: "What do you play as?", multi: true, options: [["Tank", "tank", "🛡️"], ["Healer", "healer", "💚"], ["DPS", "dps", "⚔️"]] },
    {
      title: "What should we ping you for?", multi: true,
      options: [
        ["New releases", "pingRelease", "📦", "A ping in #releases when a version ships"],
        ["Test builds", "tester", "🧪", "Become a Tester: see test builds early and tell us what you find"],
        ["Events and streams", "pingEvent", "📅", "Dev streams, Q&As and community events"],
        ["Plugin API changes", "pingApi", "🔧", "Changes that affect plugins"],
      ],
    },
    { title: "Do you write addons?", options: [["I write addons or plugins", "plugin", "🧩", "Get the Plugin Author role"]] },
  ],
};

export const welcomeScreen = {
  description: "The home of SuuUI, the full interface replacement for WoW Forever.",
  channels: [
    ["welcome", "Start here: what SuuUI is and how to get it", "👋"],
    ["help", "Ask a question", "❓"],
    ["bug-reports", "Report a bug", "🐞"],
    ["ui-showcase", "Show your setup", "✨"],
    ["releases", "Every new version", "📦"],
  ],
};

// Custom emoji, used as :name: in messages. Discord can't swap an emoji's picture: delete it to upload a new one.
export const emojis = [
  { name: "suuui", image: "assets/emoji-suuui.png" },
];

export const github = { repo: "DomenikIrrgang/suuui" };
export const invite = { channel: "welcome" };
