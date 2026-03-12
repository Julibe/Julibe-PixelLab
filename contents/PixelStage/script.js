// ============================================
// DEBUG MODE - SET TO true TO SEE ALL LOGS
// ============================================
const DEBUG = true;

// ============================================
// LOGGING HELPER
// ============================================
const log = {
	_log: (type, fn, msg, color) => {
		if (!DEBUG && type !== "error") return;
		const now = new Date();
		const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(
			now.getMinutes()
		).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
		console.log(
			`%c[${timestamp}] [${type}] ${fn}:`,
			`color: ${color}; font-weight: bold;`,
			msg
		);
	},
	info: (fn, msg) => log._log("INFO", fn, msg, "#6366f1"),
	success: (fn, msg) => log._log("SUCCESS", fn, msg, "#10b981"),
	warn: (fn, msg) => log._log("WARN", fn, msg, "#f59e0b"),
	error: (fn, msg) => log._log("ERROR", fn, msg, "#ef4444"),
	state: (fn, key, value) =>
		log._log("STATE", fn, `${key} = ${JSON.stringify(value)}`, "#8b5cf6"),
	group: (fn) => {
		if (DEBUG) console.group(fn);
	},
	groupEnd: () => {
		if (DEBUG) console.groupEnd();
	}
};

log.group("PixelStage Initialization");
log.info("INIT", "Starting PixelStage application...");
log.info("INIT", `Debug mode: ${DEBUG}`);

// ============================================
// TOAST NOTIFICATIONS
// ============================================
const toast = {
	container: document.getElementById("toastContainer"),
	show(type, title, message, duration = 4000) {
		log.info("TOAST", `Showing ${type}: ${title} - ${message}`);
		const icons = {
			success: "fa-check",
			error: "fa-times",
			warning: "fa-exclamation",
			info: "fa-info"
		};
		const toastEl = document.createElement("div");
		toastEl.className = `toast toast-${type}`;
		toastEl.innerHTML = `<div class="toast-icon"><i class="fas ${icons[type]}"></i></div><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div><button class="toast-close"><i class="fas fa-times"></i></button>`;
		toastEl
			.querySelector(".toast-close")
			.addEventListener("click", () => this.remove(toastEl));
		this.container.appendChild(toastEl);
		setTimeout(() => this.remove(toastEl), duration);
	},
	remove(toastEl) {
		toastEl.classList.add("removing");
		setTimeout(() => toastEl.remove(), 300);
	},
	success(title, message) {
		this.show("success", title, message);
	},
	error(title, message) {
		this.show("error", title, message);
	},
	warning(title, message) {
		this.show("warning", title, message);
	},
	info(title, message) {
		this.show("info", title, message);
	}
};

// ============================================
// STATE MANAGEMENT
// ============================================
const defaultState = {
	source: {
		type: "url",
		url: "",
		image: null,
		screenshotUrl: null,
		method: "iframe"
	},
	background: {
		width: 1200,
		height: 675,
		aspectRatio: "16:9",
		type: "color",
		color: "#6366f1",
		gradient: { start: "#6366f1", end: "#8b5cf6", angle: 135 },
		image: null
	},
	canvas: {
		scalePercent: 66,
		aspectRatio: "16:9",
		device: "none",
		cornerRadius: 12,
		cornerShape: "squircle",
		padding: 60,
		scale: 100,
		offsetX: 0,
		offsetY: 0,
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		perspective: 1000,
		currentIframeUrl: null
	},
	title: {
		logo: null,
		text: "",
		size: 28,
		color: "#ffffff",
		position: "top-center",
		offsetX: 0,
		offsetY: 0,
		visible: false,
		font: "Inter",
		align: "center"
	},
	subtitle: {
		text: "",
		size: 14,
		color: "#ffffff",
		offsetX: 0,
		offsetY: 0,
		visible: false,
		font: "Inter",
		align: "center"
	},
	logo: { visible: false },
	shadow: {
		enabled: true,
		blur: 30,
		spread: 0,
		x: 0,
		y: 20,
		color: "#000000",
		opacity: 50
	},
	filter: { name: "none", intensity: 100 },
	zoom: 100
};

let state = JSON.parse(JSON.stringify(defaultState));
let savedPresets = [];
let favoritePresets = []; // Stores preset IDs that are favorited

// Hidden file input for loading presets
let presetFileInput = null;

function loadState() {
	log.group("loadState");
	const saved = localStorage.getItem("pixelStage_state");
	if (saved) {
		try {
			const parsed = JSON.parse(saved);
			state = { ...JSON.parse(JSON.stringify(defaultState)), ...parsed };
			log.success("loadState", "State loaded from localStorage");
			log.state("loadState", "state", state);
		} catch (e) {
			log.error("loadState", e);
		}
	} else {
		log.info("loadState", "No saved state found, using defaults");
	}
	log.groupEnd();
}

function saveState() {
	log.info("saveState", "Saving state to localStorage");
	localStorage.setItem("pixelStage_state", JSON.stringify(state));
}

// ============================================
// PRESETS DATA
// ============================================
const builtInPresets = [
	// Random
	{
		id: "random",
		name: "🎲 Random",
		desc: "Shuffle all values!",
		bgType: "random",
		bg: "#random"
	},

	// Social Media Platforms
	{
		id: "ig-feed",
		name: "Instagram Feed",
		desc: "1080×1350 (4:5)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)",
		bgWidth: 1080,
		bgHeight: 1350,
		scalePercent: 75,
		aspectRatio: "4:5",
		cornerRadius: 16,
		padding: 50
	},
	{
		id: "ig-story",
		name: "Instagram Story/Reel",
		desc: "1080×1920 (9:16)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)",
		bgWidth: 1080,
		bgHeight: 1920,
		scalePercent: 70,
		aspectRatio: "9:16",
		cornerRadius: 0,
		padding: 40
	},
	{
		id: "fb-feed",
		name: "Facebook Feed",
		desc: "1200×630 (1.91:1)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #1877F2, #145CB3)",
		bgWidth: 1200,
		bgHeight: 630,
		scalePercent: 70,
		aspectRatio: "16:9",
		cornerRadius: 12,
		padding: 60
	},
	{
		id: "fb-story",
		name: "Facebook Story/Reel",
		desc: "1080×1920 (9:16)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #1877F2, #145CB3)",
		bgWidth: 1080,
		bgHeight: 1920,
		scalePercent: 70,
		aspectRatio: "9:16",
		cornerRadius: 0,
		padding: 40
	},
	{
		id: "tiktok",
		name: "TikTok",
		desc: "1080×1920 (9:16)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #ff0033, #FE2C55, #e74b6a)",
		bgWidth: 1080,
		bgHeight: 1920,
		scalePercent: 70,
		aspectRatio: "9:16",
		cornerRadius: 0,
		padding: 40
	},
	{
		id: "yt-video",
		name: "YouTube Video",
		desc: "1920×1080 (16:9)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #FF0000, #C4302B)",
		bgWidth: 1920,
		bgHeight: 1080,
		scalePercent: 75,
		aspectRatio: "16:9",
		cornerRadius: 0,
		padding: 80
	},
	{
		id: "yt-short",
		name: "YouTube Short",
		desc: "1080×1920 (9:16)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #FF0000, #C4302B)",
		bgWidth: 1080,
		bgHeight: 1920,
		scalePercent: 70,
		aspectRatio: "9:16",
		cornerRadius: 0,
		padding: 40
	},
	{
		id: "li-square",
		name: "LinkedIn Square",
		desc: "1200×1200 (1:1)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #0A66C2, #004182)",
		bgWidth: 1200,
		bgHeight: 1200,
		scalePercent: 75,
		aspectRatio: "1:1",
		cornerRadius: 12,
		padding: 60
	},
	{
		id: "li-video",
		name: "LinkedIn Video",
		desc: "1080×1920 (9:16)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #0A66C2, #004182)",
		bgWidth: 1080,
		bgHeight: 1920,
		scalePercent: 70,
		aspectRatio: "9:16",
		cornerRadius: 0,
		padding: 40
	},
	{
		id: "x-feed",
		name: "X (Twitter) Feed",
		desc: "1600×900 (16:9)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #000000, #14171A)",
		bgWidth: 1600,
		bgHeight: 900,
		scalePercent: 70,
		aspectRatio: "16:9",
		cornerRadius: 16,
		padding: 70
	},
	{
		id: "x-video",
		name: "X (Twitter) Vertical",
		desc: "1080×1920 (9:16)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #000000, #14171A)",
		bgWidth: 1080,
		bgHeight: 1920,
		scalePercent: 70,
		aspectRatio: "9:16",
		cornerRadius: 0,
		padding: 40
	},
	{
		id: "reddit",
		name: "Reddit Post",
		desc: "1080×1350 (4:5)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #fd6128, #FF4500, #CC3700)",
		bgWidth: 1080,
		bgHeight: 1350,
		scalePercent: 75,
		aspectRatio: "4:5",
		cornerRadius: 16,
		padding: 50
	},
	{
		id: "dribbble",
		name: "Dribbble Shot",
		desc: "1600×1200 (4:3)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #EA4C89, #C32361)",
		bgWidth: 1600,
		bgHeight: 1200,
		scalePercent: 75,
		aspectRatio: "4:3",
		cornerRadius: 12,
		padding: 80
	},
	{
		id: "pinterest",
		name: "Pinterest Pin",
		desc: "1000×1500 (2:3)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #E60023, #8b0111)",
		bgWidth: 1000,
		bgHeight: 1500,
		scalePercent: 70,
		aspectRatio: "2:3",
		cornerRadius: 20,
		padding: 50
	},
	{
		id: "pinterest-story",
		name: "Pinterest Idea",
		desc: "1080×1920 (9:16)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #E60023, #8b0111)",
		bgWidth: 1080,
		bgHeight: 1920,
		scalePercent: 70,
		aspectRatio: "9:16",
		cornerRadius: 0,
		padding: 40
	},
	{
		id: "behance",
		name: "Behance Cover",
		desc: "808×632 (4:3)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #1769FF, #0B4CBA)",
		bgWidth: 808,
		bgHeight: 632,
		scalePercent: 85,
		aspectRatio: "4:3",
		cornerRadius: 8,
		padding: 40
	},
	{
		id: "lemon8",
		name: "Lemon8 Post",
		desc: "1080×1350 (4:5)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #FAFA54, #FFDF00)",
		bgWidth: 1080,
		bgHeight: 1350,
		scalePercent: 75,
		aspectRatio: "4:5",
		cornerRadius: 16,
		padding: 50
	},
	{
		id: "snapchat",
		name: "Snapchat Story",
		desc: "1080×1920 (9:16)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #FFFC00, #E6E300)",
		bgWidth: 1080,
		bgHeight: 1920,
		scalePercent: 70,
		aspectRatio: "9:16",
		cornerRadius: 0,
		padding: 40
	},
	{
		id: "threads",
		name: "Threads Post",
		desc: "1080×1350 (4:5)",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #000000, #202327)",
		bgWidth: 1080,
		bgHeight: 1350,
		scalePercent: 75,
		aspectRatio: "4:5",
		cornerRadius: 16,
		padding: 50
	},

	// Classic Presets
	{
		id: "default",
		name: "Default",
		desc: "Clean and simple",
		bgType: "color",
		bg: "#6366f1",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9",
		cornerRadius: 12,
		padding: 60,
		device: "none"
	},
	{
		id: "minimal",
		name: "Minimal",
		desc: "Clean white",
		bgType: "color",
		bg: "#f5f5f5",
		textColor: "#1a1a1a",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "dark",
		name: "Dark Mode",
		desc: "Elegant dark",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #1a1a2e, #16213e)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "galaxy",
		name: "Galaxy",
		desc: "Space vibes",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #0f0c29, #302b63)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "midnight",
		name: "Midnight",
		desc: "Deep blue",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #0f0c29, #302b63)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "lavender",
		name: "Lavender",
		desc: "Soft purple",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "neon",
		name: "Neon Glow",
		desc: "Cyberpunk",
		bgType: "color",
		bg: "#0a0a0a",
		shadowColor: "#6366f1",
		shadowBlur: 60,
		shadowOpacity: 80,
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},

	// New Color Presets
	{
		id: "abyss",
		name: "Abyss Blue",
		desc: "Deep ocean",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #181C18, #313131)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "solar",
		name: "Solar Flare",
		desc: "Hot yellow",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #FCFC00, #fb5c00, #fb0000)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "arctic-mint",
		name: "Arctic Mint",
		desc: "Cool gray",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #979797, #BEBEBE)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "ether",
		name: "Ether Purple",
		desc: "Mystical",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #A2A2A2, #C3C3C3)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "dune",
		name: "Dune Sand",
		desc: "Desert vibes",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #E6E6E6, #D5D5D5)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9",
		textColor: "#333333"
	},
	{
		id: "moss",
		name: "Moss Shadow",
		desc: "Forest floor",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #222201, #434304)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "oxygen",
		name: "Oxygen Cyan",
		desc: "Fresh air",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #86867D, #ADAD7F)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "obsidian",
		name: "Obsidian Ash",
		desc: "Volcanic",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #212104, #424208)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "electric",
		name: "Electric Amber",
		desc: "Bright energy",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #FFFF00, #FEFE60)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9",
		textColor: "#1a1a1a"
	},
	{
		id: "glacier",
		name: "Glacier Ice",
		desc: "Frozen blue",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #07FFFF, #05FFFF)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9",
		textColor: "#1a1a1a"
	},
	{
		id: "velvet",
		name: "Velvet Orchid",
		desc: "Rich red",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #F81F1F, #C01818)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	},
	{
		id: "steel",
		name: "Steel Chrome",
		desc: "Metallic",
		bgType: "gradient",
		bg: "linear-gradient(135deg, #5e5e5e, #5252AA)",
		bgWidth: 1200,
		bgHeight: 675,
		scalePercent: 66,
		aspectRatio: "16:9"
	}
];
const gradientPresets = [
	// Social Media Gradients
	{ start: "#833AB4", end: "#FD1D1D" }, // Instagram
	{ start: "#1877F2", end: "#145CB3" }, // Facebook
	{ start: "#ff0033", end: "#e74b6a" }, // TikTok
	{ start: "#FF0000", end: "#C4302B" }, // YouTube
	{ start: "#0A66C2", end: "#004182" }, // LinkedIn
	{ start: "#000000", end: "#14171A" }, // X (Twitter)
	{ start: "#fd6128", end: "#CC3700" }, // Reddit
	{ start: "#EA4C89", end: "#C32361" }, // Dribbble
	{ start: "#E60023", end: "#8b0111" }, // Pinterest
	{ start: "#1769FF", end: "#0B4CBA" }, // Behance
	{ start: "#FAFA54", end: "#FFDF00" }, // Lemon8
	{ start: "#FFFC00", end: "#E6E300" }, // Snapchat
	{ start: "#000000", end: "#202327" }, // Threads
	// Classic Gradients
	{ start: "#6366f1", end: "#8b5cf6" },
	{ start: "#f093fb", end: "#f5576c" },
	{ start: "#4facfe", end: "#00f2fe" },
	{ start: "#43e97b", end: "#38f9d7" },
	{ start: "#fa709a", end: "#fee140" },
	{ start: "#a18cd1", end: "#fbc2eb" },
	{ start: "#0f0c29", end: "#302b63" },
	{ start: "#3F1677", end: "#2d0761" },
	// New Color Gradients
	{ start: "#181C18", end: "#313131" }, // Abyss Blue
	{ start: "#FCFC00", end: "#FB0000" }, // Solar Flare
	{ start: "#979797", end: "#BEBEBE" }, // Arctic Mint
	{ start: "#FFFF00", end: "#FEFE60" }, // Electric Amber
	{ start: "#07FFFF", end: "#05FFFF" }, // Glacier Ice
	{ start: "#F81F1F", end: "#C01818" }, // Velvet Orchid
	{ start: "#848410", end: "#5252AA" }, // Steel Chrome
	{ start: "#E6E6E6", end: "#D5D5D5" } // Dune Sand
];

// Random helper functions
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomChoice(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
function randomColor() {
	return (
		"#" +
		Math.floor(Math.random() * 16777215)
			.toString(16)
			.padStart(6, "0")
	);
}

function generateRandomPreset() {
	const aspectRatios = ["16:9", "1:1", "4:3", "3:4", "9:16", "21:9"];
	const cornerShapes = [
		"squircle",
		"round",
		"chamfer",
		"notch",
		"bevel",
		"superellipse",
		"scoop"
	];
	const filterNames = Object.keys(filters);

	const bgType = Math.random() > 0.5 ? "color" : "gradient";
	let bg;
	if (bgType === "color") {
		bg = randomColor();
	} else {
		const angle = randomInt(0, 360);
		bg = `linear-gradient(${angle}deg, ${randomColor()}, ${randomColor()})`;
	}

	return {
		id: "random_" + Date.now(),
		name: "🎲 Random",
		desc: "Randomized!",
		bgType: bgType,
		bg: bg,
		bgWidth: randomChoice([1080, 1200, 1440, 1600, 1920]),
		bgHeight: randomChoice([675, 720, 900, 1080, 1200]),
		scalePercent: randomInt(50, 85),
		aspectRatio: randomChoice(aspectRatios),
		cornerRadius: randomInt(0, 40),
		cornerShape: randomChoice(cornerShapes),
		padding: randomInt(20, 100),
		device: "none",
		shadowBlur: randomInt(10, 60),
		shadowOpacity: randomInt(30, 80),
		filterName: randomChoice(filterNames)
	};
}

const filters = {
	none: "None",
	grayscale: "B&W",
	sepia: "Sepia",
	vintage: "Vintage",
	warm: "Warm",
	cool: "Cool",
	drama: "Drama",
	bright: "Bright",
	contrast: "Contrast",
	saturate: "Vivid",
	desaturate: "Muted",
	hue1: "Hue90",
	hue2: "Hue270",
	blur: "Blur",
	fade: "Fade",
	retro: "Retro",
	noir: "Noir",
	sunset: "Sunset",
	ocean: "Ocean",
	neon: "Neon",
	pastel: "Pastel",
	muted: "Soft",
	cinematic: "Cinema",
	lofi: "LoFi",
	golden: "Golden",
	frost: "Frost",
	ember: "Ember",
	mint: "Mint",
	dusk: "Dusk",
	dawn: "Dawn"
};
const filterStyles = {
	none: "none",
	grayscale: "grayscale(100%)",
	sepia: "sepia(100%)",
	vintage: "sepia(50%) contrast(90%) brightness(90%)",
	warm: "sepia(30%) saturate(140%) brightness(105%)",
	cool: "saturate(80%) hue-rotate(180deg) brightness(105%)",
	drama: "contrast(150%) saturate(120%)",
	bright: "brightness(120%) contrast(110%)",
	contrast: "contrast(150%)",
	saturate: "saturate(200%)",
	desaturate: "saturate(50%)",
	hue1: "hue-rotate(90deg)",
	hue2: "hue-rotate(270deg)",
	blur: "blur(2px)",
	fade: "contrast(80%) brightness(110%) saturate(80%)",
	retro: "sepia(40%) contrast(85%) brightness(95%) saturate(120%)",
	noir: "grayscale(100%) contrast(130%) brightness(90%)",
	sunset: "sepia(20%) saturate(140%) hue-rotate(-10deg) brightness(105%)",
	ocean: "saturate(110%) hue-rotate(150deg) brightness(100%)",
	neon: "saturate(200%) contrast(120%) brightness(110%)",
	pastel: "saturate(70%) brightness(115%) contrast(90%)",
	muted: "saturate(60%) brightness(105%)",
	cinematic: "contrast(110%) saturate(130%) brightness(95%) sepia(10%)",
	lofi: "saturate(80%) contrast(120%) brightness(90%)",
	golden: "sepia(30%) saturate(150%) brightness(105%)",
	frost: "brightness(110%) saturate(90%) contrast(95%)",
	ember: "sepia(40%) saturate(130%) brightness(95%)",
	mint: "saturate(90%) hue-rotate(80deg) brightness(105%)",
	dusk: "saturate(110%) hue-rotate(-20deg) brightness(95%)",
	dawn: "sepia(15%) saturate(120%) brightness(105%)"
};

const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================
// INITIALIZATION
// ============================================
function init() {
	log.group("init");
	log.info("init", "Starting initialization...");

	loadState();
	savedPresets = JSON.parse(
		localStorage.getItem("pixelStage_savedPresets") || "[]"
	);
	favoritePresets = JSON.parse(
		localStorage.getItem("pixelStage_favoritePresets") || "[]"
	);
	log.info("init", `Loaded ${savedPresets.length} saved presets`);
	log.info("init", `Loaded ${favoritePresets.length} favorite presets`);

	// Create hidden file input for loading presets
	presetFileInput = document.createElement("input");
	presetFileInput.type = "file";
	presetFileInput.accept = ".json";
	presetFileInput.style.display = "none";
	document.body.appendChild(presetFileInput);
	presetFileInput.addEventListener("change", handlePresetFileLoad);

	initMainTabs();
	initSubTabs();
	initAspectButtons();
	initDeviceButtons();
	initPositionButtons();
	initInputs();
	initUpload();
	initZoom();
	initFullscreen();
	initExport();
	initShare();
	initModals();
	renderBuiltInPresets();
	renderSavedPresets();
	renderGradientPresets();
	renderFilters();
	updateUI();
	updateCanvas();

	log.success("init", "Initialization complete!");
	log.groupEnd();
}

// ============================================
// TAB FUNCTIONALITY
// ============================================
const tabOrder = [
	"presets",
	"content",
	"background",
	"canvas",
	"title",
	"shadow",
	"filters",
	"export"
];

function switchToTab(tabId) {
	log.info("switchToTab", `Switching to: ${tabId}`);
	$$(".main-tab").forEach((t) => t.classList.remove("active"));
	const targetTab = document.querySelector(`.main-tab[data-tab="${tabId}"]`);
	if (targetTab) {
		targetTab.classList.add("active");
		targetTab.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "nearest"
		});
	}
	$$(".tab-panel").forEach((p) => p.classList.remove("active"));
	const panel = $(`panel-${tabId}`);
	if (panel) panel.classList.add("active");
	updateArrowStates();
}

function getCurrentTabIndex() {
	const activeTab = document.querySelector(".main-tab.active");
	if (!activeTab) return 0;
	return tabOrder.indexOf(activeTab.dataset.tab);
}

function updateArrowStates() {
	const idx = getCurrentTabIndex();
	const leftArrow = $("tabArrowLeft");
	const rightArrow = $("tabArrowRight");
	if (leftArrow) leftArrow.disabled = idx <= 0;
	if (rightArrow) rightArrow.disabled = idx >= tabOrder.length - 1;
}

function initMainTabs() {
	log.info("initMainTabs", "Setting up main tabs");

	// Tab click handlers
	$$(".main-tab").forEach((tab) => {
		tab.addEventListener("click", () => {
			log.info("mainTab click", `Tab: ${tab.dataset.tab}`);
			switchToTab(tab.dataset.tab);
		});
	});

	// Arrow navigation
	const leftArrow = $("tabArrowLeft");
	const rightArrow = $("tabArrowRight");

	if (leftArrow) {
		leftArrow.addEventListener("click", () => {
			const idx = getCurrentTabIndex();
			if (idx > 0) {
				switchToTab(tabOrder[idx - 1]);
			}
		});
	}

	if (rightArrow) {
		rightArrow.addEventListener("click", () => {
			const idx = getCurrentTabIndex();
			if (idx < tabOrder.length - 1) {
				switchToTab(tabOrder[idx + 1]);
			}
		});
	}

	// Keyboard navigation
	document.addEventListener("keydown", (e) => {
		if (
			e.target.tagName === "INPUT" ||
			e.target.tagName === "TEXTAREA" ||
			e.target.tagName === "SELECT"
		)
			return;

		if (e.key === "ArrowLeft") {
			const idx = getCurrentTabIndex();
			if (idx > 0) {
				e.preventDefault();
				switchToTab(tabOrder[idx - 1]);
			}
		} else if (e.key === "ArrowRight") {
			const idx = getCurrentTabIndex();
			if (idx < tabOrder.length - 1) {
				e.preventDefault();
				switchToTab(tabOrder[idx + 1]);
			}
		}
	});

	updateArrowStates();
}

function initSubTabs() {
	log.info("initSubTabs", "Setting up sub tabs");
	$$(".tabs").forEach((tabContainer) => {
		const tabs = tabContainer.querySelectorAll(".tab");
		tabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				const parent = tab.closest(".tab-panel");
				if (!parent) return;
				log.info("subTab click", `Subtab: ${tab.dataset.subtab}`);
				parent
					.querySelectorAll(".tab")
					.forEach((t) => t.classList.remove("active"));
				tab.classList.add("active");
				parent
					.querySelectorAll(".sub-tab-panel")
					.forEach((p) => p.classList.remove("active"));
				const panel = parent.querySelector(`#subtab-${tab.dataset.subtab}`);
				if (panel) panel.classList.add("active");

				// Handle background type switching
				if (tab.dataset.subtab === "bg-color") {
					state.background.type = "color";
					log.state("subTab", "background.type", "color");
					updateCanvas();
					saveState();
				} else if (tab.dataset.subtab === "bg-gradient") {
					state.background.type = "gradient";
					log.state("subTab", "background.type", "gradient");
					updateCanvas();
					saveState();
				} else if (tab.dataset.subtab === "bg-image") {
					state.background.type = "image";
					log.state("subTab", "background.type", "image");
					updateCanvas();
					saveState();
				}
			});
		});
	});
}

// ============================================
// ASPECT RATIO BUTTONS
// ============================================
function initAspectButtons() {
	log.info("initAspectButtons", "Setting up aspect ratio buttons");
	$$(".aspect-btns").forEach((container) => {
		const target = container.dataset.target;
		container.querySelectorAll(".aspect-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				const ratio = btn.dataset.ratio || btn.dataset.align;

				// Handle text alignment buttons
				if (btn.dataset.align) {
					log.info("alignBtn click", `Align: ${btn.dataset.align}`);
					container
						.querySelectorAll(".aspect-btn")
						.forEach((b) => b.classList.remove("active"));
					btn.classList.add("active");

					// Determine if this is title or subtitle align
					if (container.closest("#subtitleAlignBtns")) {
						state.subtitle.align = btn.dataset.align;
					} else {
						state.title.align = btn.dataset.align;
					}
					updateCanvas();
					saveState();
					return;
				}

				log.info("aspectBtn click", `Ratio: ${ratio}, Target: ${target}`);
				container
					.querySelectorAll(".aspect-btn")
					.forEach((b) => b.classList.remove("active"));
				btn.classList.add("active");
				const [w, h] = ratio.split(":").map(Number);

				if (target === "background") {
					state.background.aspectRatio = ratio;
					state.background.height = Math.round(state.background.width * (h / w));
					$("bgHeight").value = state.background.height;
					log.state("aspectBtn", "background.height", state.background.height);
				} else if (target === "canvas") {
					state.canvas.aspectRatio = ratio;
					log.state("aspectBtn", "canvas.aspectRatio", state.canvas.aspectRatio);
				}
				updateCanvas();
				saveState();
			});
		});
	});
}

// ============================================
// DEVICE BUTTONS
// ============================================
function initDeviceButtons() {
	log.info("initDeviceButtons", "Setting up device buttons");
	$$(".device-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			log.info("deviceBtn click", `Device: ${btn.dataset.frame}`);
			$$(".device-btn").forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
			state.canvas.device = btn.dataset.frame;
			log.state("deviceBtn", "device", state.canvas.device);
			updateCanvas();
			saveState();
		});
	});
}

// ============================================
// POSITION BUTTONS
// ============================================
function initPositionButtons() {
	log.info("initPositionButtons", "Setting up position buttons");
	$$(".position-grid").forEach((grid) => {
		const target = grid.dataset.target;
		grid.querySelectorAll(".position-btn").forEach((btn) => {
			btn.addEventListener("click", () => {
				log.info(
					"positionBtn click",
					`Position: ${btn.dataset.position}, Target: ${target}`
				);
				grid
					.querySelectorAll(".position-btn")
					.forEach((b) => b.classList.remove("active"));
				btn.classList.add("active");
				if (target === "title") {
					state.title.position = btn.dataset.position;
					log.state("positionBtn", "title.position", state.title.position);
				}
				updateCanvas();
				saveState();
			});
		});
	});
}

// ============================================
// INPUT HANDLERS
// ============================================
function initInputs() {
	log.group("initInputs");
	log.info("initInputs", "Setting up input handlers");

	// Background
	$("bgWidth").addEventListener("input", (e) => {
		state.background.width = parseInt(e.target.value) || 1200;
		log.state("bgWidth input", "background.width", state.background.width);
		updateHeightFromAspect("background");
		updateCanvas();
		saveState();
	});

	$("bgHeight").addEventListener("input", (e) => {
		state.background.height = parseInt(e.target.value) || 675;
		log.state("bgHeight input", "background.height", state.background.height);
		updateCanvas();
		saveState();
	});

	$("bgColor").addEventListener("input", (e) => {
		state.background.color = e.target.value;
		$("bgColorText").value = e.target.value;
		log.state("bgColor input", "background.color", state.background.color);
		updateCanvas();
		saveState();
	});

	$("bgColorText").addEventListener("input", (e) => {
		if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
			state.background.color = e.target.value;
			$("bgColor").value = e.target.value;
			log.state("bgColorText input", "background.color", state.background.color);
			updateCanvas();
			saveState();
		}
	});

	$("gradientStart").addEventListener("input", (e) => {
		state.background.gradient.start = e.target.value;
		log.state("gradientStart input", "gradient.start", e.target.value);
		updateCanvas();
		saveState();
	});

	$("gradientEnd").addEventListener("input", (e) => {
		state.background.gradient.end = e.target.value;
		log.state("gradientEnd input", "gradient.end", e.target.value);
		updateCanvas();
		saveState();
	});

	$("gradientAngle").addEventListener("input", (e) => {
		state.background.gradient.angle = parseInt(e.target.value);
		$("gradientAngleValue").textContent = e.target.value + "°";
		log.state(
			"gradientAngle input",
			"gradient.angle",
			state.background.gradient.angle
		);
		updateCanvas();
		saveState();
	});

	// Canvas - SCALE BASED SIZING with sync'd input
	const setupRangeInput = (sliderId, inputId, statePath, unit = "") => {
		const slider = $(sliderId);
		const input = $(inputId);
		const defaultVal = slider.dataset.default;

		if (!slider || !input) return;

		// Slider change
		slider.addEventListener("input", (e) => {
			const val = parseInt(e.target.value);
			input.value = val;

			// Update state
			const keys = statePath.split(".");
			let obj = state;
			for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
			obj[keys[keys.length - 1]] = val;

			log.state(sliderId + " input", statePath, val);
			updateCanvas();
			saveState();
		});

		// Number input change
		input.addEventListener("input", (e) => {
			const val = parseInt(e.target.value) || 0;
			slider.value = val;

			// Update state
			const keys = statePath.split(".");
			let obj = state;
			for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
			obj[keys[keys.length - 1]] = val;

			log.state(inputId + " input", statePath, val);
			updateCanvas();
			saveState();
		});
	};

	setupRangeInput(
		"canvasScalePercent",
		"canvasScalePercentInput",
		"canvas.scalePercent"
	);
	setupRangeInput("offsetX", "offsetXInput", "canvas.offsetX");
	setupRangeInput("offsetY", "offsetYInput", "canvas.offsetY");
	setupRangeInput("scale", "scaleInput", "canvas.scale");
	setupRangeInput("rotateX", "rotateXInput", "canvas.rotateX");
	setupRangeInput("rotateY", "rotateYInput", "canvas.rotateY");
	setupRangeInput("rotateZ", "rotateZInput", "canvas.rotateZ");
	setupRangeInput("perspective", "perspectiveInput", "canvas.perspective");
	setupRangeInput("cornerRadius", "cornerRadiusInput", "canvas.cornerRadius");
	setupRangeInput("canvasPadding", "canvasPaddingInput", "canvas.padding");

	// Reset buttons
	$$(".reset-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const resetTarget = btn.dataset.reset;
			const slider = $(resetTarget);
			const input = $(resetTarget + "Input");
			const defaultVal = slider?.dataset?.default;

			if (defaultVal !== undefined) {
				if (slider) slider.value = defaultVal;
				if (input) input.value = defaultVal;

				// Map reset target to state path
				const stateMap = {
					canvasScalePercent: "canvas.scalePercent",
					offsetX: "canvas.offsetX",
					offsetY: "canvas.offsetY",
					scale: "canvas.scale",
					rotateX: "canvas.rotateX",
					rotateY: "canvas.rotateY",
					rotateZ: "canvas.rotateZ",
					perspective: "canvas.perspective",
					cornerRadius: "canvas.cornerRadius",
					canvasPadding: "canvas.padding"
				};

				const statePath = stateMap[resetTarget];
				if (statePath) {
					const keys = statePath.split(".");
					let obj = state;
					for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
					obj[keys[keys.length - 1]] = parseInt(defaultVal);
					log.state("reset " + resetTarget, statePath, defaultVal);
				}

				updateCanvas();
				saveState();
			}
		});
	});

	// Corner Shape Buttons
	$("cornerShapeBtns")
		.querySelectorAll(".aspect-btn")
		.forEach((btn) => {
			btn.addEventListener("click", () => {
				$("cornerShapeBtns")
					.querySelectorAll(".aspect-btn")
					.forEach((b) => b.classList.remove("active"));
				btn.classList.add("active");
				state.canvas.cornerShape = btn.dataset.shape;
				log.state("cornerShape click", "cornerShape", state.canvas.cornerShape);
				updateCanvas();
				saveState();
			});
		});

	// Title
	$("titleText").addEventListener("input", (e) => {
		state.title.text = e.target.value;
		log.state("titleText input", "title.text", state.title.text);
		updateCanvas();
		saveState();
	});

	$("titleFont").addEventListener("change", (e) => {
		state.title.font = e.target.value;
		log.state("titleFont change", "title.font", state.title.font);
		loadGoogleFont(e.target.value);
		updateCanvas();
		saveState();
	});

	$("titleSizeNum").addEventListener("input", (e) => {
		state.title.size = parseInt(e.target.value) || 28;
		log.state("titleSizeNum input", "title.size", state.title.size);
		updateCanvas();
		saveState();
	});

	$("titleColor").addEventListener("input", (e) => {
		state.title.color = e.target.value;
		log.state("titleColor input", "title.color", state.title.color);
		updateCanvas();
		saveState();
	});

	$("titleOffsetX").addEventListener("input", (e) => {
		state.title.offsetX = parseInt(e.target.value);
		$("titleOffsetXValue").textContent = e.target.value + "px";
		log.state("titleOffsetX input", "title.offsetX", state.title.offsetX);
		updateCanvas();
		saveState();
	});

	$("titleOffsetY").addEventListener("input", (e) => {
		state.title.offsetY = parseInt(e.target.value);
		$("titleOffsetYValue").textContent = e.target.value + "px";
		log.state("titleOffsetY input", "title.offsetY", state.title.offsetY);
		updateCanvas();
		saveState();
	});

	// Subtitle
	$("subtitleText").addEventListener("input", (e) => {
		state.subtitle.text = e.target.value;
		log.state("subtitleText input", "subtitle.text", state.subtitle.text);
		updateCanvas();
		saveState();
	});

	$("subtitleFont").addEventListener("change", (e) => {
		state.subtitle.font = e.target.value;
		log.state("subtitleFont change", "subtitle.font", state.subtitle.font);
		loadGoogleFont(e.target.value);
		updateCanvas();
		saveState();
	});

	$("subtitleSizeNum").addEventListener("input", (e) => {
		state.subtitle.size = parseInt(e.target.value) || 14;
		log.state("subtitleSizeNum input", "subtitle.size", state.subtitle.size);
		updateCanvas();
		saveState();
	});

	$("subtitleColor").addEventListener("input", (e) => {
		state.subtitle.color = e.target.value;
		log.state("subtitleColor input", "subtitle.color", state.subtitle.color);
		updateCanvas();
		saveState();
	});

	$("subtitleOffsetX").addEventListener("input", (e) => {
		state.subtitle.offsetX = parseInt(e.target.value);
		$("subtitleOffsetXValue").textContent = e.target.value + "px";
		log.state(
			"subtitleOffsetX input",
			"subtitle.offsetX",
			state.subtitle.offsetX
		);
		updateCanvas();
		saveState();
	});

	$("subtitleOffsetY").addEventListener("input", (e) => {
		state.subtitle.offsetY = parseInt(e.target.value);
		$("subtitleOffsetYValue").textContent = e.target.value + "px";
		log.state(
			"subtitleOffsetY input",
			"subtitle.offsetY",
			state.subtitle.offsetY
		);
		updateCanvas();
		saveState();
	});

	// Visibility Toggles
	$("logoVisible").addEventListener("click", () => {
		$("logoVisible").classList.toggle("active");
		state.logo.visible = $("logoVisible").classList.contains("active");
		log.state("logoVisible click", "logo.visible", state.logo.visible);
		updateCanvas();
		saveState();
	});

	$("titleVisible").addEventListener("click", () => {
		$("titleVisible").classList.toggle("active");
		state.title.visible = $("titleVisible").classList.contains("active");
		log.state("titleVisible click", "title.visible", state.title.visible);
		updateCanvas();
		saveState();
	});

	$("subtitleVisible").addEventListener("click", () => {
		$("subtitleVisible").classList.toggle("active");
		state.subtitle.visible = $("subtitleVisible").classList.contains("active");
		log.state(
			"subtitleVisible click",
			"subtitle.visible",
			state.subtitle.visible
		);
		updateCanvas();
		saveState();
	});

	// Shadow
	$("shadowToggle").addEventListener("click", () => {
		$("shadowToggle").classList.toggle("active");
		state.shadow.enabled = $("shadowToggle").classList.contains("active");
		log.state("shadowToggle click", "shadow.enabled", state.shadow.enabled);
		updateCanvas();
		saveState();
	});

	$("shadowBlur").addEventListener("input", (e) => {
		state.shadow.blur = parseInt(e.target.value);
		$("shadowBlurValue").textContent = e.target.value + "px";
		log.state("shadowBlur input", "shadow.blur", state.shadow.blur);
		updateCanvas();
		saveState();
	});

	$("shadowSpread").addEventListener("input", (e) => {
		state.shadow.spread = parseInt(e.target.value);
		$("shadowSpreadValue").textContent = e.target.value + "px";
		log.state("shadowSpread input", "shadow.spread", state.shadow.spread);
		updateCanvas();
		saveState();
	});

	$("shadowX").addEventListener("input", (e) => {
		state.shadow.x = parseInt(e.target.value);
		$("shadowXValue").textContent = e.target.value + "px";
		log.state("shadowX input", "shadow.x", state.shadow.x);
		updateCanvas();
		saveState();
	});

	$("shadowY").addEventListener("input", (e) => {
		state.shadow.y = parseInt(e.target.value);
		$("shadowYValue").textContent = e.target.value + "px";
		log.state("shadowY input", "shadow.y", state.shadow.y);
		updateCanvas();
		saveState();
	});

	$("shadowColor").addEventListener("input", (e) => {
		state.shadow.color = e.target.value;
		$("shadowColorText").value = e.target.value;
		log.state("shadowColor input", "shadow.color", state.shadow.color);
		updateCanvas();
		saveState();
	});

	$("shadowOpacity").addEventListener("input", (e) => {
		state.shadow.opacity = parseInt(e.target.value);
		$("shadowOpacityValue").textContent = e.target.value + "%";
		log.state("shadowOpacity input", "shadow.opacity", state.shadow.opacity);
		updateCanvas();
		saveState();
	});

	// Filter
	$("filterIntensity").addEventListener("input", (e) => {
		state.filter.intensity = parseInt(e.target.value);
		$("filterIntensityValue").textContent = e.target.value + "%";
		log.state(
			"filterIntensity input",
			"filter.intensity",
			state.filter.intensity
		);
		updateCanvas();
		saveState();
	});

	// Preview method
	$("previewMethod").addEventListener("change", (e) => {
		state.source.method = e.target.value;
		log.state("previewMethod change", "source.method", state.source.method);

		// Show/hide API key input based on method
		const apiKeyGroup = $("apiKeyGroup");
		if (apiKeyGroup) {
			const needsKey = ["screenshotapi", "apiflash"].includes(e.target.value);
			apiKeyGroup.style.display = needsKey ? "block" : "none";
			log.info(
				"previewMethod",
				`API key input: ${needsKey ? "visible" : "hidden"}`
			);
		}

		saveState();
	});

	$("websiteUrl").addEventListener("change", (e) => {
		state.source.url = e.target.value;
		log.state("websiteUrl change", "source.url", state.source.url);
		saveState();
	});

	$("loadUrlBtn").addEventListener("click", () => {
		const url = $("websiteUrl").value;
		if (url) {
			log.info("loadUrlBtn click", `Loading URL: ${url}`);
			state.source.url = url;
			loadWebsite(url);
		}
	});

	log.success("initInputs", "All input handlers set up");
	log.groupEnd();
}

function updateHeightFromAspect(target) {
	log.info("updateHeightFromAspect", `Target: ${target}`);
	if (target === "background") {
		const [w, h] = state.background.aspectRatio.split(":").map(Number);
		state.background.height = Math.round(state.background.width * (h / w));
		$("bgHeight").value = state.background.height;
		log.state(
			"updateHeightFromAspect",
			"background.height",
			state.background.height
		);
	}
}

// ============================================
// UPLOAD HANDLERS
// ============================================
function initUpload() {
	log.info("initUpload", "Setting up upload handlers");

	$("uploadArea").addEventListener("click", () => {
		log.info("uploadArea click", "Opening file dialog");
		$("imageInput").click();
	});
	$("uploadArea").addEventListener("dragover", (e) => {
		e.preventDefault();
		$("uploadArea").classList.add("dragover");
	});
	$("uploadArea").addEventListener("dragleave", () =>
		$("uploadArea").classList.remove("dragover")
	);
	$("uploadArea").addEventListener("drop", (e) => {
		e.preventDefault();
		$("uploadArea").classList.remove("dragover");
		if (e.dataTransfer.files[0]?.type.startsWith("image/")) {
			log.info("uploadArea drop", `File: ${e.dataTransfer.files[0].name}`);
			handleImageUpload(e.dataTransfer.files[0]);
		}
	});
	$("imageInput").addEventListener("change", (e) => {
		if (e.target.files[0]) {
			log.info("imageInput change", `File: ${e.target.files[0].name}`);
			handleImageUpload(e.target.files[0]);
		}
	});

	$("bgImageUpload").addEventListener("click", () => $("bgImageInput").click());
	$("bgImageInput").addEventListener("change", (e) => {
		if (e.target.files[0]) {
			log.info("bgImageInput change", `File: ${e.target.files[0].name}`);
			const reader = new FileReader();
			reader.onload = (ev) => {
				state.background.image = ev.target.result;
				state.background.type = "image";
				log.state("bgImageInput", "background.image", "loaded");
				updateCanvas();
				saveState();
				toast.success("Background Uploaded", "Image applied");
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	});

	$("uploadLogoBtn").addEventListener("click", () => $("logoInput").click());
	$("logoInput").addEventListener("change", (e) => {
		if (e.target.files[0]) {
			log.info("logoInput change", `File: ${e.target.files[0].name}`);
			const reader = new FileReader();
			reader.onload = (ev) => {
				state.title.logo = ev.target.result;
				log.state("logoInput", "title.logo", "loaded");
				updateCanvas();
				saveState();
				toast.success("Logo Uploaded", "Logo added");
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	});
	$("removeLogoBtn").addEventListener("click", () => {
		log.info("removeLogoBtn click", "Removing logo");
		state.title.logo = null;
		updateCanvas();
		saveState();
		toast.info("Logo Removed", "");
	});
}

function handleImageUpload(file) {
	log.info("handleImageUpload", `Processing file: ${file.name}`);
	const reader = new FileReader();
	reader.onload = (e) => {
		state.source.image = e.target.result;
		state.source.type = "image";
		const screenshotImage = $("screenshotImage");
		if (screenshotImage) {
			screenshotImage.src = e.target.result;
			screenshotImage.style.display = "block";
		}
		const iframe = $("screenshotIframe");
		if (iframe) iframe.style.display = "none";
		const placeholder = $("placeholderContent");
		if (placeholder) placeholder.style.display = "none";
		toast.success("Image Uploaded", file.name);
		updateCanvas();
		saveState();
	};
	reader.readAsDataURL(file);
}

async function loadWebsite(url) {
	log.group("loadWebsite");
	log.info("loadWebsite", `=== STARTING LOAD ===`);
	log.info("loadWebsite", `URL: ${url}`);
	log.info("loadWebsite", `Method: ${state.source.method}`);

	if (!url) {
		log.error("loadWebsite", "No URL provided!");
		toast.error("Error", "Please enter a URL");
		log.groupEnd();
		return;
	}

	showLoading("Loading preview...");
	state.source.url = url;
	state.source.type = "url";

	// Calculate canvas dimensions
	const [aw, ah] = (state.canvas.aspectRatio || "16:9").split(":").map(Number);
	const maxW = state.background.width * (state.canvas.scalePercent / 100);
	const canvasW = Math.round(maxW);
	const canvasH = Math.round(maxW * (ah / aw));
	log.info("loadWebsite", `Canvas dimensions: ${canvasW}x${canvasH}`);

	// Always try to get metadata from Microlink (free, no key needed)
	try {
		log.info("loadWebsite", "--- Fetching metadata ---");
		const metaUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
		log.info("loadWebsite", `Metadata URL: ${metaUrl}`);

		const response = await fetch(metaUrl);
		log.info("loadWebsite", `Metadata response: ${response.status}`);

		if (response.ok) {
			const data = await response.json();
			log.info(
				"loadWebsite",
				`Metadata received: ${JSON.stringify(data.data || {}).substring(0, 300)}`
			);

			if (data.data?.title) {
				state.title.text = data.data.title;
				$("titleText").value = data.data.title;
				log.success("loadWebsite", `Title: ${data.data.title}`);
			}
			if (data.data?.description) {
				state.subtitle.text = data.data.description;
				$("subtitleText").value = data.data.description;
				log.success(
					"loadWebsite",
					`Description: ${data.data.description.substring(0, 50)}...`
				);
			}
		}
	} catch (e) {
		log.warn("loadWebsite", `Metadata fetch failed: ${e.message}`);
	}

	// Handle different preview methods
	const method = state.source.method;
	log.info("loadWebsite", `--- Using method: ${method} ---`);

	if (method === "iframe") {
		// Live iframe - no screenshot API needed
		log.info("loadWebsite", "Creating live iframe preview");
		state.source.image = null; // Clear any previous screenshot
		state.source.screenshotUrl = null;
		updateCanvas();
		hideLoading();
		toast.success("Iframe Loaded", "Live preview active");
		saveState();
		log.groupEnd();
		return;
	}

	// All screenshot methods
	let screenshotUrl = null;
	const apiKey = $("apiKeyInput")?.value || "";

	try {
		switch (method) {
			case "microlink":
				log.info("loadWebsite", "Building Microlink URL...");
				// Microlink free tier - uses embed parameter
				screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(
					url
				)}&screenshot=true&meta=false&embed=screenshot.url&viewport=${canvasW}x${canvasH}`;
				log.info("loadWebsite", `Microlink URL: ${screenshotUrl}`);
				break;

			case "screenshotapi":
				log.info("loadWebsite", "Building ScreenshotAPI URL...");
				// ScreenshotAPI.net - has free tier
				if (apiKey) {
					screenshotUrl = `https://api.screenshotapi.net/screenshot?token=${apiKey}&url=${encodeURIComponent(
						url
					)}&width=${canvasW}&height=${canvasH}&output=image&file_type=png`;
				} else {
					// Free tier without key (limited)
					screenshotUrl = `https://api.screenshotapi.net/screenshot?url=${encodeURIComponent(
						url
					)}&width=${canvasW}&height=${canvasH}`;
				}
				log.info("loadWebsite", `ScreenshotAPI URL: ${screenshotUrl}`);
				break;

			case "apiflash":
				log.info("loadWebsite", "Building ApiFlash URL...");
				// ApiFlash - requires key but has free tier
				if (apiKey) {
					screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=${apiKey}&url=${encodeURIComponent(
						url
					)}&width=${canvasW}&height=${canvasH}&format=png`;
				} else {
					log.warn("loadWebsite", "ApiFlash requires API key - using fallback");
					toast.warning(
						"API Key Needed",
						"ApiFlash requires a free API key from apiflash.com"
					);
					screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(
						url
					)}&screenshot=true&meta=false&embed=screenshot.url&viewport=${canvasW}x${canvasH}`;
				}
				log.info("loadWebsite", `ApiFlash URL: ${screenshotUrl}`);
				break;

			case "thumio":
				log.info("loadWebsite", "Building Thum.io URL...");
				// Thum.io - free with watermark
				screenshotUrl = `https://image.thum.io/get/width/${canvasW}/crop/${canvasH}/${encodeURIComponent(
					url
				)}`;
				log.info("loadWebsite", `Thum.io URL: ${screenshotUrl}`);
				break;

			default:
				log.warn(
					"loadWebsite",
					`Unknown method: ${method}, falling back to microlink`
				);
				screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(
					url
				)}&screenshot=true&meta=false&embed=screenshot.url&viewport=${canvasW}x${canvasH}`;
		}

		log.info("loadWebsite", `--- Loading screenshot image ---`);
		log.info("loadWebsite", `Final screenshot URL: ${screenshotUrl}`);

		// Load the image
		const img = new Image();
		img.crossOrigin = "anonymous";

		const imageLoaded = new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new Error("Image load timeout (15s)"));
			}, 15000);

			img.onload = () => {
				clearTimeout(timeout);
				log.success(
					"loadWebsite",
					`Image loaded successfully: ${img.width}x${img.height}`
				);
				resolve(true);
			};

			img.onerror = (e) => {
				clearTimeout(timeout);
				log.error("loadWebsite", `Image load error: ${e.type}`);
				reject(new Error(`Failed to load image from ${method}`));
			};

			img.src = screenshotUrl;
		});

		await imageLoaded;

		// Store the screenshot URL for canvas rendering
		state.source.image = null; // Clear uploaded image
		state.source.screenshotUrl = screenshotUrl;
		state.source.screenshotWidth = img.width;
		state.source.screenshotHeight = img.height;

		log.success("loadWebsite", `Screenshot stored: ${img.width}x${img.height}`);

		updateCanvas();
		hideLoading();
		toast.success("Screenshot Loaded", `${method} - ${img.width}x${img.height}`);
		saveState();
	} catch (error) {
		log.error("loadWebsite", `=== ERROR ===`);
		log.error("loadWebsite", `Error: ${error.message}`);
		log.error("loadWebsite", `Method: ${method}`);
		log.error("loadWebsite", `URL attempted: ${screenshotUrl}`);

		hideLoading();
		toast.error("Load Failed", `${method}: ${error.message}`);

		// Show tip in console
		log.info(
			"loadWebsite",
			"TIP: Try a different preview method or check your API key"
		);
	}

	log.groupEnd();
}

// Google Font Loader
function loadGoogleFont(fontName) {
	log.info("loadGoogleFont", `Loading font: ${fontName}`);
	const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(
		/ /g,
		"+"
	)}:wght@400;600;700&display=swap`;

	// Check if already loaded
	if (document.querySelector(`link[href="${fontUrl}"]`)) {
		log.info("loadGoogleFont", `Font already loaded: ${fontName}`);
		return;
	}

	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = fontUrl;
	link.onload = () => log.success("loadGoogleFont", `Font loaded: ${fontName}`);
	link.onerror = (e) =>
		log.error("loadGoogleFont", `Failed to load font: ${fontName}`, e);
	document.head.appendChild(link);
}

// ============================================
// ZOOM CONTROLS
// ============================================
function initZoom() {
	log.info("initZoom", "Setting up zoom controls");
	$("zoomIn").addEventListener("click", () => {
		state.zoom = Math.min(200, state.zoom + 10);
		log.info("zoomIn", `Zoom: ${state.zoom}%`);
		updateZoom();
	});
	$("zoomOut").addEventListener("click", () => {
		state.zoom = Math.max(25, state.zoom - 10);
		log.info("zoomOut", `Zoom: ${state.zoom}%`);
		updateZoom();
	});
	$("zoomReset").addEventListener("click", () => {
		state.zoom = 100;
		log.info("zoomReset", "Zoom reset to 100%");
		updateZoom();
	});
}

// ============================================
// FULLSCREEN MODE
// ============================================
function initFullscreen() {
	log.info("initFullscreen", "Setting up fullscreen controls");

	let isFullscreen = false;

	const toggleFullscreen = () => {
		isFullscreen = !isFullscreen;

		if (isFullscreen) {
			document.body.classList.add("fullscreen-active");
			$("canvasWrapper").classList.add("fullscreen-mode");
			$("fullscreenCloseBtn").classList.add("visible");
			log.info("fullscreen", "Entered fullscreen mode");
		} else {
			document.body.classList.remove("fullscreen-active");
			$("canvasWrapper").classList.remove("fullscreen-mode");
			$("fullscreenCloseBtn").classList.remove("visible");
			log.info("fullscreen", "Exited fullscreen mode");
		}
	};

	$("fullscreenBtn").addEventListener("click", toggleFullscreen);
	$("fullscreenCloseBtn").addEventListener("click", toggleFullscreen);

	// ESC key to exit fullscreen
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && isFullscreen) {
			toggleFullscreen();
		}
	});
}

function updateZoom() {
	log.info("updateZoom", `Setting zoom to ${state.zoom}%`);
	$("zoomLevel").textContent = state.zoom + "%";
	const stage = $("mockupStage");
	if (stage) stage.style.transform = `scale(${state.zoom / 100})`;
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================
function initExport() {
	log.info("initExport", "Setting up export handlers");
	$("copyBtn").addEventListener("click", () => {
		log.info("copyBtn click", "Copying to clipboard");
		exportImage("copy");
	});
	$("downloadPngBtn").addEventListener("click", () => {
		log.info("downloadPngBtn click", "Downloading PNG");
		exportImage("png");
	});
	$("downloadJpgBtn").addEventListener("click", () => {
		log.info("downloadJpgBtn click", "Downloading JPG");
		exportImage("jpeg");
	});
	$("downloadWebpBtn").addEventListener("click", () => {
		log.info("downloadWebpBtn click", "Downloading WebP");
		exportImage("webp");
	});
	$("quickExportBtn").addEventListener("click", () => {
		log.info("quickExportBtn click", "Quick export");
		exportImage("png");
	});
}

async function exportImage(format) {
	log.group("exportImage");
	log.info("exportImage", `Format: ${format}`);
	showLoading("Generating image...");

	try {
		const scale = parseInt($("exportSize").value);
		const element = $("backgroundLayer");

		log.info("exportImage", `Element: ${element ? "found" : "not found"}`);
		log.info("exportImage", `Scale: ${scale}x`);
		log.info(
			"exportImage",
			`Background size: ${state.background.width}x${state.background.height}`
		);

		// Check if we have iframe content - need special handling
		const hasIframe =
			state.source.method === "iframe" && state.source.url && !state.source.image;

		if (hasIframe) {
			log.info(
				"exportImage",
				"Iframe content detected - capturing with Microlink API"
			);

			// Calculate canvas dimensions from aspect ratio and scale
			const [aw, ah] = (state.canvas.aspectRatio || "16:9").split(":").map(Number);
			const maxW = state.background.width * (state.canvas.scalePercent / 100);
			const canvasW = Math.round(maxW);
			const canvasH = Math.round(maxW * (ah / aw));

			// Create export canvas
			const exportCanvas = document.createElement("canvas");
			exportCanvas.width = state.background.width * scale;
			exportCanvas.height = state.background.height * scale;
			const ctx = exportCanvas.getContext("2d");

			// Draw background
			ctx.scale(scale, scale);

			if (state.background.type === "color") {
				ctx.fillStyle = state.background.color;
				ctx.fillRect(0, 0, state.background.width, state.background.height);
			} else if (state.background.type === "gradient") {
				const angle = (state.background.gradient.angle * Math.PI) / 180;
				const x1 =
					state.background.width / 2 -
					(Math.cos(angle) * state.background.width) / 2;
				const y1 =
					state.background.height / 2 -
					(Math.sin(angle) * state.background.height) / 2;
				const x2 =
					state.background.width / 2 +
					(Math.cos(angle) * state.background.width) / 2;
				const y2 =
					state.background.height / 2 +
					(Math.sin(angle) * state.background.height) / 2;
				const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
				gradient.addColorStop(0, state.background.gradient.start);
				gradient.addColorStop(1, state.background.gradient.end);
				ctx.fillStyle = gradient;
				ctx.fillRect(0, 0, state.background.width, state.background.height);
			}

			// Fetch screenshot from Microlink
			try {
				const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(
					state.source.url
				)}&screenshot=true&meta=false&embed=screenshot.url&viewport=${canvasW}x${canvasH}`;

				const img = new Image();
				img.crossOrigin = "anonymous";

				await new Promise((resolve, reject) => {
					img.onload = resolve;
					img.onerror = () => reject(new Error("Failed to load screenshot"));
					img.src = microlinkUrl;
				});

				// Calculate position with padding and offsets
				const padding = state.canvas.padding;
				const x = (state.background.width - canvasW) / 2 + state.canvas.offsetX;
				const y = (state.background.height - canvasH) / 2 + state.canvas.offsetY;

				// Apply shadow if enabled
				if (state.shadow.enabled) {
					ctx.shadowColor = hexToRgba(state.shadow.color, state.shadow.opacity);
					ctx.shadowBlur = state.shadow.blur;
					ctx.shadowOffsetX = state.shadow.x;
					ctx.shadowOffsetY = state.shadow.y;
				}

				// Draw rounded rect for screenshot
				const radius = state.canvas.cornerRadius;
				ctx.save();
				ctx.beginPath();
				roundRect(ctx, x, y, canvasW, canvasH, radius);
				ctx.clip();
				ctx.drawImage(img, x, y, canvasW, canvasH);
				ctx.restore();
			} catch (e) {
				log.warn("exportImage", "Microlink failed, using placeholder");
				// Draw placeholder
				const padding = state.canvas.padding;
				const x = (state.background.width - canvasW) / 2 + state.canvas.offsetX;
				const y = (state.background.height - canvasH) / 2 + state.canvas.offsetY;

				ctx.fillStyle = "#667eea";
				ctx.fillRect(x, y, canvasW, canvasH);
				ctx.fillStyle = "white";
				ctx.font = "24px sans-serif";
				ctx.textAlign = "center";
				ctx.fillText(
					"Screenshot Preview",
					state.background.width / 2,
					state.background.height / 2
				);
			}

			// Draw title if exists and visible
			if (state.title.text && state.title.visible) {
				ctx.fillStyle = state.title.color;
				ctx.font = `bold ${state.title.size}px sans-serif`;
				ctx.textAlign = "center";
				const titleY = state.title.position.includes("top")
					? 40
					: state.background.height - 40;
				ctx.fillText(
					state.title.text,
					state.background.width / 2 + state.title.offsetX,
					titleY + state.title.offsetY
				);
			}

			// Draw subtitle if exists and visible
			if (state.subtitle.text && state.subtitle.visible) {
				ctx.fillStyle = state.subtitle.color;
				ctx.font = `${state.subtitle.size}px sans-serif`;
				ctx.textAlign = "center";
				const subY = state.title.position.includes("top")
					? 65
					: state.background.height - 65;
				ctx.fillText(
					state.subtitle.text,
					state.background.width / 2 + state.subtitle.offsetX,
					subY + state.subtitle.offsetY
				);
			}

			downloadCanvas(exportCanvas, format, scale);
		} else {
			// Use html2canvas for non-iframe content
			if (typeof html2canvas === "undefined") {
				log.error("exportImage", "html2canvas not loaded!");
				throw new Error("html2canvas library not loaded");
			}

			// Force background color for export
			const originalBg = element.style.backgroundColor;
			if (!element.style.backgroundColor) {
				element.style.backgroundColor =
					state.background.type === "color"
						? state.background.color
						: state.background.gradient.start;
			}

			const canvas = await html2canvas(element, {
				scale: scale,
				backgroundColor:
					state.background.type === "color"
						? state.background.color
						: state.background.gradient.start,
				useCORS: true,
				allowTaint: true,
				logging: DEBUG,
				width: state.background.width,
				height: state.background.height,
				x: 0,
				y: 0,
				scrollX: 0,
				scrollY: 0
			});

			// Restore original background
			element.style.backgroundColor = originalBg;

			log.success(
				"exportImage",
				`Canvas created: ${canvas.width}x${canvas.height}`
			);
			downloadCanvas(canvas, format, scale);
		}

		hideLoading();
	} catch (error) {
		log.error("exportImage", error.message);
		console.error(error);
		hideLoading();
		toast.error("Export Failed", error.message);
	}

	log.groupEnd();
}

function roundRect(ctx, x, y, width, height, radius) {
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
}

function downloadCanvas(canvas, format, scale) {
	if (format === "copy") {
		canvas.toBlob(async (blob) => {
			try {
				await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
				log.success("downloadCanvas", "Copied to clipboard");
				toast.success("Copied!", "Image copied to clipboard");
			} catch (e) {
				log.error("downloadCanvas", "Clipboard copy failed: " + e.message);
				toast.error("Copy Failed", "Could not copy to clipboard");
			}
		});
	} else {
		const mimeTypes = {
			png: "image/png",
			jpeg: "image/jpeg",
			webp: "image/webp"
		};
		const dataUrl = canvas.toDataURL(mimeTypes[format], 0.95);

		log.info("downloadCanvas", `Data URL length: ${dataUrl.length}`);

		const link = document.createElement("a");
		const filename = `pixelstage-${state.background.width * scale}x${
			state.background.height * scale
		}-${Date.now()}.${format}`;
		link.download = filename;
		link.href = dataUrl;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		log.success("downloadCanvas", `Downloaded: ${filename}`);
		toast.success("Downloaded!", `Image saved as ${format.toUpperCase()}`);

		savedPresets.push({
			name: `Export ${new Date().toLocaleDateString()}`,
			state: JSON.parse(JSON.stringify(state)),
			timestamp: Date.now()
		});
		localStorage.setItem("pixelStage_savedPresets", JSON.stringify(savedPresets));
		renderSavedPresets();
	}
}

// ============================================
// SHARE FUNCTIONALITY
// ============================================
function initShare() {
	log.info("initShare", "Setting up share buttons");

	const shareHandlers = {
		twitter: () => {
			const text = "Check out my mockup created with PixelStage!";
			window.open(
				`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
				"_blank"
			);
		},
		facebook: () =>
			window.open(
				`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					window.location.href
				)}`,
				"_blank"
			),
		linkedin: () =>
			window.open(
				`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
					window.location.href
				)}`,
				"_blank"
			),
		email: () => {
			const subject = "My PixelStage Mockup";
			const body = "Check out my mockup created with PixelStage!";
			window.location.href = `mailto:?subject=${encodeURIComponent(
				subject
			)}&body=${encodeURIComponent(body)}`;
		}
	};

	// Export panel share buttons
	$("shareTwitter")?.addEventListener("click", () => {
		log.info("shareTwitter", "Sharing to Twitter");
		shareHandlers.twitter();
	});
	$("shareFacebook")?.addEventListener("click", () => {
		log.info("shareFacebook", "Sharing to Facebook");
		shareHandlers.facebook();
	});
	$("shareLinkedin")?.addEventListener("click", () => {
		log.info("shareLinkedin", "Sharing to LinkedIn");
		shareHandlers.linkedin();
	});
	$("shareEmail")?.addEventListener("click", () => {
		log.info("shareEmail", "Sharing via Email");
		shareHandlers.email();
	});

	// Footer share buttons
	$("shareTwitterFtr")?.addEventListener("click", () => {
		log.info("shareTwitterFtr", "Sharing to Twitter");
		shareHandlers.twitter();
	});
	$("shareFacebookFtr")?.addEventListener("click", () => {
		log.info("shareFacebookFtr", "Sharing to Facebook");
		shareHandlers.facebook();
	});
	$("shareLinkedinFtr")?.addEventListener("click", () => {
		log.info("shareLinkedinFtr", "Sharing to LinkedIn");
		shareHandlers.linkedin();
	});
	$("shareEmailFtr")?.addEventListener("click", () => {
		log.info("shareEmailFtr", "Sharing via Email");
		shareHandlers.email();
	});
}

// ============================================
// MODALS
// ============================================
function initModals() {
	log.info("initModals", "Setting up modals");

	$("savePresetBtn").addEventListener("click", () => {
		log.info("savePresetBtn click", "Opening save preset modal");
		$("savePresetModal").classList.add("active");
	});

	$("loadPresetFileBtn").addEventListener("click", () => {
		log.info("loadPresetFileBtn click", "Opening file picker");
		loadPresetFromFile();
	});

	$("closeModalBtn").addEventListener("click", () => {
		log.info("closeModalBtn click", "Closing modal");
		$("savePresetModal").classList.remove("active");
	});

	$("cancelPresetBtn").addEventListener("click", () => {
		log.info("cancelPresetBtn click", "Cancelling save preset");
		$("savePresetModal").classList.remove("active");
	});

	$("confirmSavePresetBtn").addEventListener("click", () => {
		const name = $("presetName").value || `Custom ${savedPresets.length + 1}`;
		log.info("confirmSavePresetBtn click", `Saving preset: ${name}`);
		savedPresets.push({
			name,
			state: JSON.parse(JSON.stringify(state)),
			timestamp: Date.now()
		});
		localStorage.setItem("pixelStage_savedPresets", JSON.stringify(savedPresets));
		renderSavedPresets();
		$("savePresetModal").classList.remove("active");
		$("presetName").value = "";
		toast.success("Preset Saved", `"${name}" added`);
	});

	$("resetBtn").addEventListener("click", () => {
		log.info("resetBtn click", "Resetting state");
		if (confirm("Reset all settings?")) {
			state = JSON.parse(JSON.stringify(defaultState));
			updateUI();
			updateCanvas();
			saveState();
			toast.info("Reset Complete", "Settings restored");
		}
	});
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderBuiltInPresets() {
	log.info("renderBuiltInPresets", `Rendering ${builtInPresets.length} presets`);
	const container = $("builtInPresets");
	container.innerHTML = "";
	builtInPresets.forEach((preset) => {
		const isFavorited = favoritePresets.includes(preset.id);
		const card = document.createElement("div");
		card.className = "preset-card" + (isFavorited ? " favorited" : "");
		card.innerHTML = `
                    <div class="preset-preview" style="background: ${
																					preset.bg
																				}"></div>
                    <div class="preset-info">
                        <div class="preset-name">${preset.name}</div>
                        <div class="preset-desc">${preset.desc}</div>
                    </div>
                    <div class="preset-actions">
                        <button class="preset-action-btn${
																									isFavorited ? " favorited" : ""
																								}" data-action="favorite" data-id="${
			preset.id
		}" title="${isFavorited ? "Remove from Favorites" : "Add to Favorites"}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="preset-action-btn" data-action="download" data-id="${
																									preset.id
																								}" title="Download as JSON">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>`;
		card.addEventListener("click", (e) => {
			if (!e.target.closest(".preset-action-btn")) {
				applyPreset(preset);
			}
		});
		// Add action button listeners
		card
			.querySelector('[data-action="favorite"]')
			.addEventListener("click", (e) => {
				e.stopPropagation();
				toggleFavorite(preset.id);
			});
		card
			.querySelector('[data-action="download"]')
			.addEventListener("click", (e) => {
				e.stopPropagation();
				downloadPreset(preset);
			});
		container.appendChild(card);
	});
}

function renderSavedPresets() {
	log.info(
		"renderSavedPresets",
		`Rendering ${savedPresets.length} saved presets`
	);
	const container = $("savedPresets");
	if (savedPresets.length === 0) {
		container.innerHTML =
			'<div style="grid-column: span 2; text-align: center; color: var(--text-muted); padding: 20px;"><i class="fas fa-bookmark" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>No saved presets yet.<br><small style="opacity: 0.7;">Save your current settings as a preset or load from JSON.</small></div>';
		return;
	}
	container.innerHTML = "";
	savedPresets.forEach((preset, index) => {
		const isFavorited = favoritePresets.includes(preset.id || `saved_${index}`);
		const card = document.createElement("div");
		card.className = "preset-card" + (isFavorited ? " favorited" : "");
		const bgColor = preset.state?.background?.color || "#6366f1";
		const presetId = preset.id || `saved_${index}`;
		card.innerHTML = `
                    <div class="preset-preview" style="background: ${bgColor}"></div>
                    <div class="preset-info">
                        <div class="preset-name">${preset.name}</div>
                        <div class="preset-desc">Saved preset</div>
                    </div>
                    <div class="preset-actions">
                        <button class="preset-action-btn${
																									isFavorited ? " favorited" : ""
																								}" data-action="favorite" data-index="${index}" title="${
			isFavorited ? "Remove from Favorites" : "Add to Favorites"
		}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="preset-action-btn" data-action="download" data-index="${index}" title="Download as JSON">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="preset-action-btn delete-btn" data-action="delete" data-index="${index}" title="Delete Preset">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`;
		card.addEventListener("click", (e) => {
			if (!e.target.closest(".preset-action-btn")) {
				applySavedPreset(preset);
			}
		});
		// Add action button listeners
		card
			.querySelector('[data-action="favorite"]')
			.addEventListener("click", (e) => {
				e.stopPropagation();
				toggleFavorite(presetId);
			});
		card
			.querySelector('[data-action="download"]')
			.addEventListener("click", (e) => {
				e.stopPropagation();
				downloadPreset(preset, preset.name);
			});
		card
			.querySelector('[data-action="delete"]')
			.addEventListener("click", (e) => {
				e.stopPropagation();
				deleteSavedPreset(index);
			});
		container.appendChild(card);
	});
}

function applyPreset(preset) {
	log.group("applyPreset");
	log.info("applyPreset", `Applying: ${preset.name}`);

	// Handle random preset - generate new random values each time
	if (preset.id === "random" || preset.bgType === "random") {
		log.info("applyPreset", "Generating random preset...");
		preset = generateRandomPreset();
		log.info("applyPreset", `Random preset generated: ${JSON.stringify(preset)}`);
	}

	// Background
	if (preset.bgWidth !== undefined) state.background.width = preset.bgWidth;
	if (preset.bgHeight !== undefined) state.background.height = preset.bgHeight;
	if (preset.bgType !== undefined) state.background.type = preset.bgType;
	if (preset.bgAspectRatio !== undefined)
		state.background.aspectRatio = preset.bgAspectRatio;

	// Parse gradient from bg string
	if (preset.bg) {
		if (preset.bg.startsWith("linear-gradient")) {
			const match = preset.bg.match(
				/linear-gradient\((\d+)deg,\s*([^,]+),\s*([^)]+)\)/
			);
			if (match) {
				state.background.gradient.angle = parseInt(match[1]);
				state.background.gradient.start = match[2].trim();
				state.background.gradient.end = match[3].trim();
				state.background.type = "gradient";
			}
		} else {
			state.background.color = preset.bg;
			if (!preset.bgType) state.background.type = "color";
		}
	}

	// Canvas
	if (preset.scalePercent !== undefined)
		state.canvas.scalePercent = preset.scalePercent;
	if (preset.aspectRatio !== undefined)
		state.canvas.aspectRatio = preset.aspectRatio;
	if (preset.cornerRadius !== undefined)
		state.canvas.cornerRadius = preset.cornerRadius;
	if (preset.cornerShape !== undefined)
		state.canvas.cornerShape = preset.cornerShape;
	if (preset.padding !== undefined) state.canvas.padding = preset.padding;
	if (preset.device !== undefined) state.canvas.device = preset.device;
	if (preset.offsetX !== undefined) state.canvas.offsetX = preset.offsetX;
	if (preset.offsetY !== undefined) state.canvas.offsetY = preset.offsetY;
	if (preset.scale !== undefined) state.canvas.scale = preset.scale;
	if (preset.rotateX !== undefined) state.canvas.rotateX = preset.rotateX;
	if (preset.rotateY !== undefined) state.canvas.rotateY = preset.rotateY;
	if (preset.rotateZ !== undefined) state.canvas.rotateZ = preset.rotateZ;
	if (preset.perspective !== undefined)
		state.canvas.perspective = preset.perspective;

	// Title/Subtitle
	if (preset.textColor !== undefined) {
		state.title.color = preset.textColor;
		state.subtitle.color = preset.textColor;
	}
	if (preset.titleSize !== undefined) state.title.size = preset.titleSize;
	if (preset.subtitleSize !== undefined)
		state.subtitle.size = preset.subtitleSize;

	// Shadow
	if (preset.shadowEnabled !== undefined)
		state.shadow.enabled = preset.shadowEnabled;
	if (preset.shadowColor !== undefined) state.shadow.color = preset.shadowColor;
	if (preset.shadowBlur !== undefined) state.shadow.blur = preset.shadowBlur;
	if (preset.shadowSpread !== undefined)
		state.shadow.spread = preset.shadowSpread;
	if (preset.shadowX !== undefined) state.shadow.x = preset.shadowX;
	if (preset.shadowY !== undefined) state.shadow.y = preset.shadowY;
	if (preset.shadowOpacity !== undefined)
		state.shadow.opacity = preset.shadowOpacity;

	// Filter
	if (preset.filterName !== undefined) state.filter.name = preset.filterName;
	if (preset.filterIntensity !== undefined)
		state.filter.intensity = preset.filterIntensity;

	updateUI();
	updateCanvas();
	saveState();
	toast.success("Preset Applied", `"${preset.name}"`);
	log.groupEnd();
}

function applySavedPreset(preset) {
	log.info("applySavedPreset", `Applying: ${preset.name}`);
	if (preset.state) {
		// Deep merge the saved state with default state
		state = JSON.parse(JSON.stringify(defaultState));

		// Merge each section properly
		if (preset.state.background) {
			Object.assign(state.background, preset.state.background);
		}
		if (preset.state.canvas) {
			Object.assign(state.canvas, preset.state.canvas);
		}
		if (preset.state.title) {
			Object.assign(state.title, preset.state.title);
		}
		if (preset.state.subtitle) {
			Object.assign(state.subtitle, preset.state.subtitle);
		}
		if (preset.state.logo) {
			Object.assign(state.logo, preset.state.logo);
		}
		if (preset.state.shadow) {
			Object.assign(state.shadow, preset.state.shadow);
		}
		if (preset.state.filter) {
			Object.assign(state.filter, preset.state.filter);
		}
		if (preset.state.source) {
			Object.assign(state.source, preset.state.source);
		}
		if (preset.state.zoom !== undefined) {
			state.zoom = preset.state.zoom;
		}

		updateUI();
		updateCanvas();
		saveState();
		toast.success("Preset Loaded", preset.name);
	}
}

// ============================================
// PRESET MANAGEMENT FUNCTIONS
// ============================================
function toggleFavorite(presetId) {
	log.info("toggleFavorite", `Toggling favorite for: ${presetId}`);
	const index = favoritePresets.indexOf(presetId);
	if (index > -1) {
		favoritePresets.splice(index, 1);
		toast.info("Removed from Favorites", "Preset unfavorited");
	} else {
		favoritePresets.push(presetId);
		toast.success("Added to Favorites", "Preset favorited");
	}
	localStorage.setItem(
		"pixelStage_favoritePresets",
		JSON.stringify(favoritePresets)
	);
	renderBuiltInPresets();
	renderSavedPresets();
}

function downloadPreset(preset, customName = null) {
	const name = customName || preset.name || "preset";
	const filename = `pixelstage-${name
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")}.json`;

	// Create a clean preset object for export
	const exportPreset = {
		name: name,
		exportedAt: new Date().toISOString(),
		version: "1.0",
		preset: preset
	};

	// If it's a built-in preset, store the full preset data
	if (preset.id && builtInPresets.find((p) => p.id === preset.id)) {
		exportPreset.type = "built-in";
	} else if (preset.state) {
		exportPreset.type = "saved";
	}

	const json = JSON.stringify(exportPreset, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	toast.success("Preset Downloaded", `${filename}`);
	log.info("downloadPreset", `Downloaded: ${filename}`);
}

function deleteSavedPreset(index) {
	log.info("deleteSavedPreset", `Deleting preset at index: ${index}`);
	const presetName = savedPresets[index]?.name || "Unknown";

	if (confirm(`Are you sure you want to delete "${presetName}"?`)) {
		savedPresets.splice(index, 1);
		localStorage.setItem("pixelStage_savedPresets", JSON.stringify(savedPresets));
		renderSavedPresets();
		toast.success("Preset Deleted", `"${presetName}" has been removed`);
	}
}

function handlePresetFileLoad(event) {
	const file = event.target.files[0];
	if (!file) return;

	log.info("handlePresetFileLoad", `Loading file: ${file.name}`);

	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			const data = JSON.parse(e.target.result);

			// Validate the preset structure
			if (!data.preset && !data.state && !data.id) {
				throw new Error("Invalid preset file format");
			}

			// Create a saved preset from the loaded data
			const loadedPreset = {
				id: "loaded_" + Date.now(),
				name: data.name || file.name.replace(".json", ""),
				state: data.state || data.preset?.state || null,
				timestamp: Date.now(),
				imported: true
			};

			// If it's a built-in preset reference, copy its data
			if (data.preset && data.preset.id && !data.preset.state) {
				const builtIn = builtInPresets.find((p) => p.id === data.preset.id);
				if (builtIn) {
					// Convert built-in preset to state format
					loadedPreset.state = {
						background: {
							width: builtIn.bgWidth || 1200,
							height: builtIn.bgHeight || 675,
							aspectRatio: builtIn.aspectRatio || "16:9",
							type: builtIn.bgType || "color",
							color: builtIn.bg?.startsWith("#") ? builtIn.bg : "#6366f1",
							gradient: { start: "#6366f1", end: "#8b5cf6", angle: 135 }
						},
						canvas: {
							scalePercent: builtIn.scalePercent || 66,
							aspectRatio: builtIn.aspectRatio || "16:9",
							device: builtIn.device || "none",
							cornerRadius: builtIn.cornerRadius || 12,
							padding: builtIn.padding || 60
						}
					};
				}
			}

			savedPresets.push(loadedPreset);
			localStorage.setItem(
				"pixelStage_savedPresets",
				JSON.stringify(savedPresets)
			);
			renderSavedPresets();
			toast.success("Preset Imported", `"${loadedPreset.name}" has been added`);
		} catch (err) {
			log.error("handlePresetFileLoad", err);
			toast.error("Import Failed", "Invalid preset file format");
		}
	};
	reader.readAsText(file);

	// Reset the input so the same file can be loaded again
	event.target.value = "";
}

function loadPresetFromFile() {
	presetFileInput.click();
}

function renderGradientPresets() {
	log.info(
		"renderGradientPresets",
		`Rendering ${gradientPresets.length} gradients`
	);
	const container = $("gradientPresets");
	container.innerHTML = "";
	gradientPresets.forEach((gradient) => {
		const item = document.createElement("div");
		item.className = "gradient-item";
		item.style.background = `linear-gradient(135deg, ${gradient.start}, ${gradient.end})`;
		item.addEventListener("click", () => {
			state.background.gradient.start = gradient.start;
			state.background.gradient.end = gradient.end;
			$("gradientStart").value = gradient.start;
			$("gradientEnd").value = gradient.end;
			log.state("gradientPreset click", "gradient", gradient);
			updateCanvas();
			saveState();
		});
		container.appendChild(item);
	});
}

function renderFilters() {
	log.info("renderFilters", `Rendering ${Object.keys(filters).length} filters`);
	const container = $("filterGrid");
	container.innerHTML = "";
	Object.entries(filters).forEach(([key, name]) => {
		const item = document.createElement("div");
		item.className = "filter-item" + (key === state.filter.name ? " active" : "");
		item.textContent = name;
		item.addEventListener("click", () => {
			container
				.querySelectorAll(".filter-item")
				.forEach((f) => f.classList.remove("active"));
			item.classList.add("active");
			state.filter.name = key;
			log.state("filter click", "filter.name", key);
			updateCanvas();
			saveState();
		});
		container.appendChild(item);
	});
}

// ============================================
// UI UPDATE
// ============================================
function updateUI() {
	log.group("updateUI");
	log.info("updateUI", "Updating UI elements");

	$("bgWidth").value = state.background.width;
	$("bgHeight").value = state.background.height;

	// Set active aspect ratio buttons
	$$('.aspect-btns[data-target="background"] .aspect-btn').forEach((btn) => {
		btn.classList.toggle(
			"active",
			btn.dataset.ratio === state.background.aspectRatio
		);
	});
	$$('.aspect-btns[data-target="canvas"] .aspect-btn').forEach((btn) => {
		btn.classList.toggle(
			"active",
			btn.dataset.ratio === state.canvas.aspectRatio
		);
	});

	$("bgColor").value = state.background.color;
	$("bgColorText").value = state.background.color;
	$("gradientStart").value = state.background.gradient.start;
	$("gradientEnd").value = state.background.gradient.end;
	$("gradientAngle").value = state.background.gradient.angle;
	$("gradientAngleValue").textContent = state.background.gradient.angle + "°";

	// Set active background type tab
	const bgPanel = $("panel-background");
	if (bgPanel) {
		bgPanel.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
		bgPanel
			.querySelectorAll(".sub-tab-panel")
			.forEach((p) => p.classList.remove("active"));
		const activeTab = bgPanel.querySelector(
			`.tab[data-subtab="bg-${state.background.type}"]`
		);
		const activePanel = bgPanel.querySelector(
			`#subtab-bg-${state.background.type}`
		);
		if (activeTab) activeTab.classList.add("active");
		if (activePanel) activePanel.classList.add("active");
	}

	// Canvas - update both sliders and number inputs
	$("canvasScalePercent").value = state.canvas.scalePercent;
	$("canvasScalePercentInput").value = state.canvas.scalePercent;
	$("offsetX").value = state.canvas.offsetX;
	$("offsetXInput").value = state.canvas.offsetX;
	$("offsetY").value = state.canvas.offsetY;
	$("offsetYInput").value = state.canvas.offsetY;
	$("scale").value = state.canvas.scale;
	$("scaleInput").value = state.canvas.scale;
	$("rotateX").value = state.canvas.rotateX;
	$("rotateXInput").value = state.canvas.rotateX;
	$("rotateY").value = state.canvas.rotateY;
	$("rotateYInput").value = state.canvas.rotateY;
	$("rotateZ").value = state.canvas.rotateZ;
	$("rotateZInput").value = state.canvas.rotateZ;
	$("perspective").value = state.canvas.perspective;
	$("perspectiveInput").value = state.canvas.perspective;
	$("cornerRadius").value = state.canvas.cornerRadius;
	$("cornerRadiusInput").value = state.canvas.cornerRadius;
	$("canvasPadding").value = state.canvas.padding;
	$("canvasPaddingInput").value = state.canvas.padding;

	$$(".device-btn").forEach((btn) =>
		btn.classList.toggle("active", btn.dataset.frame === state.canvas.device)
	);

	// Corner Shape buttons
	$("cornerShapeBtns")
		.querySelectorAll(".aspect-btn")
		.forEach((btn) => {
			btn.classList.toggle(
				"active",
				btn.dataset.shape === state.canvas.cornerShape
			);
		});

	// Title
	$("titleText").value = state.title.text;
	$("titleFont").value = state.title.font || "Inter";
	$("titleSizeNum").value = state.title.size;
	$("titleColor").value = state.title.color;
	$("titleOffsetX").value = state.title.offsetX;
	$("titleOffsetXValue").textContent = state.title.offsetX + "px";
	$("titleOffsetY").value = state.title.offsetY;
	$("titleOffsetYValue").textContent = state.title.offsetY + "px";

	$("subtitleText").value = state.subtitle.text;
	$("subtitleFont").value = state.subtitle.font || "Inter";
	$("subtitleSizeNum").value = state.subtitle.size;
	$("subtitleColor").value = state.subtitle.color;
	$("subtitleOffsetX").value = state.subtitle.offsetX;
	$("subtitleOffsetXValue").textContent = state.subtitle.offsetX + "px";
	$("subtitleOffsetY").value = state.subtitle.offsetY;
	$("subtitleOffsetYValue").textContent = state.subtitle.offsetY + "px";

	// Visibility toggles
	$("logoVisible").classList.toggle("active", state.logo.visible);
	$("titleVisible").classList.toggle("active", state.title.visible);
	$("subtitleVisible").classList.toggle("active", state.subtitle.visible);

	// Position buttons
	$$('.position-grid[data-target="title"] .position-btn').forEach((btn) => {
		btn.classList.toggle("active", btn.dataset.position === state.title.position);
	});

	// Text align buttons
	$$(".aspect-btns").forEach((container) => {
		const alignBtns = container.querySelectorAll(".aspect-btn[data-align]");
		if (alignBtns.length > 0) {
			// Check if this is in subtitle section
			const isSubtitle = container
				.closest("#panel-title")
				?.querySelector("#subtitleText");
			const align = isSubtitle ? state.subtitle.align : state.title.align;
			alignBtns.forEach((btn) =>
				btn.classList.toggle("active", btn.dataset.align === align)
			);
		}
	});

	$("shadowToggle").classList.toggle("active", state.shadow.enabled);
	$("shadowBlur").value = state.shadow.blur;
	$("shadowBlurValue").textContent = state.shadow.blur + "px";
	$("shadowSpread").value = state.shadow.spread;
	$("shadowSpreadValue").textContent = state.shadow.spread + "px";
	$("shadowX").value = state.shadow.x;
	$("shadowXValue").textContent = state.shadow.x + "px";
	$("shadowY").value = state.shadow.y;
	$("shadowYValue").textContent = state.shadow.y + "px";
	$("shadowColor").value = state.shadow.color;
	$("shadowColorText").value = state.shadow.color;
	$("shadowOpacity").value = state.shadow.opacity;
	$("shadowOpacityValue").textContent = state.shadow.opacity + "%";

	$("filterIntensity").value = state.filter.intensity;
	$("filterIntensityValue").textContent = state.filter.intensity + "%";
	$("websiteUrl").value = state.source.url;
	$("previewMethod").value = state.source.method;
	updateZoom();

	log.success("updateUI", "UI updated");
	log.groupEnd();
}

// ============================================
// CANVAS UPDATE
// ============================================
function updateCanvas() {
	log.group("updateCanvas");

	const bgLayer = $("backgroundLayer");
	const bgContent = $("bgContent");
	const canvasLayer = $("canvasLayer");
	const canvasInner = $("canvasInner");

	if (!bgLayer || !bgContent || !canvasLayer || !canvasInner) {
		log.error("updateCanvas", "Missing DOM elements!");
		log.groupEnd();
		return;
	}

	// Calculate canvas size based on scale percentage and aspect ratio
	const [aw, ah] = (state.canvas.aspectRatio || "16:9").split(":").map(Number);
	const maxW = state.background.width * (state.canvas.scalePercent / 100);
	const maxH = state.background.height * (state.canvas.scalePercent / 100);

	let canvasW, canvasH;
	if (aw > ah) {
		canvasW = Math.round(maxW);
		canvasH = Math.round(maxW * (ah / aw));
	} else {
		canvasH = Math.round(maxH);
		canvasW = Math.round(maxH * (aw / ah));
	}

	log.info(
		"updateCanvas",
		`Canvas size: ${canvasW}x${canvasH} (scale: ${state.canvas.scalePercent}%, aspect: ${state.canvas.aspectRatio})`
	);

	bgLayer.style.width = state.background.width + "px";
	bgLayer.style.height = state.background.height + "px";
	bgLayer.style.backgroundColor =
		state.background.type === "color"
			? state.background.color
			: state.background.gradient.start;

	switch (state.background.type) {
		case "color":
			bgContent.style.background = state.background.color;
			break;
		case "gradient":
			bgContent.style.background = `linear-gradient(${state.background.gradient.angle}deg, ${state.background.gradient.start}, ${state.background.gradient.end})`;
			break;
		case "image":
			if (state.background.image)
				bgContent.style.background = `url(${state.background.image}) center/cover`;
			break;
	}

	canvasLayer.style.perspective = state.canvas.perspective + "px";

	const scale = state.canvas.scale / 100;
	canvasInner.style.transform = `
                translate(${state.canvas.offsetX}px, ${state.canvas.offsetY}px)
                rotateX(${state.canvas.rotateX}deg) 
                rotateY(${state.canvas.rotateY}deg) 
                rotateZ(${state.canvas.rotateZ}deg) 
                scale(${scale})
            `;
	canvasInner.style.transformStyle = "preserve-3d";
	canvasInner.style.padding = state.canvas.padding + "px";

	updateDeviceFrame(canvasW, canvasH);

	// Title visibility and positioning - respect visibility flags
	const titleTop = $("titleLayerTop");
	const titleBottom = $("titleLayerBottom");
	const titlePos = state.title.position;

	// Check if anything should be visible
	const showTitleLayer =
		state.title.visible || state.subtitle.visible || state.logo.visible;
	const hasTitleContent = state.title.text && state.title.visible;
	const hasSubtitleContent = state.subtitle.text && state.subtitle.visible;
	const hasLogo = state.title.logo && state.logo.visible;

	if (showTitleLayer && (hasTitleContent || hasSubtitleContent || hasLogo)) {
		if (titlePos.includes("top")) {
			if (titleTop) {
				titleTop.style.display = "block";
				titleTop.style.order = "0";
			}
			if (titleBottom) titleBottom.style.display = "none";
			if (titleTop) {
				titleTop.style.textAlign = titlePos.includes("left")
					? "left"
					: titlePos.includes("right")
					? "right"
					: "center";
				titleTop.style.transform = `translate(${state.title.offsetX}px, ${state.title.offsetY}px)`;
			}
		} else {
			if (titleTop) titleTop.style.display = "none";
			if (titleBottom) {
				titleBottom.style.display = "block";
				titleBottom.style.order = "2";
			}
			if (titleBottom) {
				titleBottom.style.textAlign = titlePos.includes("left")
					? "left"
					: titlePos.includes("right")
					? "right"
					: "center";
				titleBottom.style.transform = `translate(${state.title.offsetX}px, ${state.title.offsetY}px)`;
			}
		}
	} else {
		if (titleTop) titleTop.style.display = "none";
		if (titleBottom) titleBottom.style.display = "none";
	}

	// Update title content
	const mockupTitle = $("mockupTitle");
	const mockupTitleBottom = $("mockupTitleBottom");
	if (mockupTitle) {
		mockupTitle.textContent = state.title.text;
		mockupTitle.style.fontFamily = `'${state.title.font || "Inter"}', sans-serif`;
		mockupTitle.style.fontSize = state.title.size + "px";
		mockupTitle.style.color = state.title.color;
		mockupTitle.style.textAlign = state.title.align || "center";
		mockupTitle.style.display = state.title.visible ? "block" : "none";
	}
	if (mockupTitleBottom) {
		mockupTitleBottom.textContent = state.title.text;
		mockupTitleBottom.style.fontFamily = `'${
			state.title.font || "Inter"
		}', sans-serif`;
		mockupTitleBottom.style.fontSize = state.title.size + "px";
		mockupTitleBottom.style.color = state.title.color;
		mockupTitleBottom.style.textAlign = state.title.align || "center";
		mockupTitleBottom.style.display = state.title.visible ? "block" : "none";
	}

	// Update subtitle content
	const mockupSubtitle = $("mockupSubtitle");
	const mockupSubtitleBottom = $("mockupSubtitleBottom");
	if (mockupSubtitle) {
		mockupSubtitle.textContent = state.subtitle.text;
		mockupSubtitle.style.fontFamily = `'${
			state.subtitle.font || "Inter"
		}', sans-serif`;
		mockupSubtitle.style.fontSize = state.subtitle.size + "px";
		mockupSubtitle.style.color = state.subtitle.color;
		mockupSubtitle.style.textAlign = state.subtitle.align || "center";
		mockupSubtitle.style.transform = `translate(${state.subtitle.offsetX}px, ${state.subtitle.offsetY}px)`;
		mockupSubtitle.style.display = state.subtitle.visible ? "block" : "none";
	}
	if (mockupSubtitleBottom) {
		mockupSubtitleBottom.textContent = state.subtitle.text;
		mockupSubtitleBottom.style.fontFamily = `'${
			state.subtitle.font || "Inter"
		}', sans-serif`;
		mockupSubtitleBottom.style.fontSize = state.subtitle.size + "px";
		mockupSubtitleBottom.style.color = state.subtitle.color;
		mockupSubtitleBottom.style.textAlign = state.subtitle.align || "center";
		mockupSubtitleBottom.style.transform = `translate(${state.subtitle.offsetX}px, ${state.subtitle.offsetY}px)`;
		mockupSubtitleBottom.style.display = state.subtitle.visible
			? "block"
			: "none";
	}

	// Logo - respect visibility flag
	const logoContainer = $("logoContainer");
	const logoContainerBottom = $("logoContainerBottom");
	if (state.title.logo && state.logo.visible) {
		const logoImage = $("logoImage");
		const logoImageBottom = $("logoImageBottom");
		if (logoImage) logoImage.src = state.title.logo;
		if (logoImageBottom) logoImageBottom.src = state.title.logo;
		if (logoContainer) logoContainer.style.display = "block";
		if (logoContainerBottom) logoContainerBottom.style.display = "block";
	} else {
		if (logoContainer) logoContainer.style.display = "none";
		if (logoContainerBottom) logoContainerBottom.style.display = "none";
	}

	// Filter
	const deviceFrame = $("deviceFrame");
	if (deviceFrame) {
		deviceFrame.style.filter =
			state.filter.name !== "none" ? filterStyles[state.filter.name] : "none";

		// Shadow
		if (state.shadow.enabled) {
			const shadowColor = hexToRgba(state.shadow.color, state.shadow.opacity);
			deviceFrame.style.boxShadow = `${state.shadow.x}px ${state.shadow.y}px ${state.shadow.blur}px ${state.shadow.spread}px ${shadowColor}`;
		} else {
			deviceFrame.style.boxShadow = "none";
		}
	}

	// Iframe size
	const iframe = $("screenshotIframe");
	if (iframe && state.source.method === "iframe") {
		iframe.style.width = canvasW + "px";
		iframe.style.height = canvasH + "px";
	}

	log.success("updateCanvas", "Canvas updated");
	log.groupEnd();
}

// Apply corner radius and shape to an element
function applyCornerRadius(el, radius, shape) {
	const r = radius;
	switch (shape) {
		case "squircle":
			// Squircle uses smoother corners (slightly larger effective radius)
			el.style.cornerShape = "squircle";
			el.style.borderRadius = r + "px";
			break;
		case "round":
			el.style.cornerShape = "round";
			el.style.borderRadius = r + "px";
			break;
		case "scoop":
			// Scooped corners (inverted)
			el.style.cornerShape = "scoop";
			el.style.borderRadius = r + "px";
			break;
		case "chamfer":
			// Chamfer uses clip-path for cut corners
			el.style.cornerShape = "superellipse(-0.5)";
			el.style.borderRadius = r + "px";
			break;
		case "bevel":
			// Bevel uses larger cut corners
			el.style.cornerShape = "bevel";
			el.style.borderRadius = r + "px";
			break;
		case "superellipse":
			// Superellipse uses a smoother curve than squircle
			el.style.cornerShape = "superellipse(-2)";
			el.style.borderRadius = r + "px";
			break;
		case "notch":
			// Notch creates a U-shaped cutout at the top
			el.style.cornerShape = "notch";
			el.style.borderRadius = r + "px";
			break;
		default:
			el.style.borderRadius = r + "px";
	}
}

function updateDeviceFrame(canvasW, canvasH) {
	const frame = $("deviceFrame");
	if (!frame) return;

	log.info("updateDeviceFrame", `Size: ${canvasW}x${canvasH}`);

	const hasDeviceFrame = state.canvas.device !== "none";
	const cornerRadius = hasDeviceFrame ? "0" : state.canvas.cornerRadius + "px";
	const cornerShape = state.canvas.cornerShape || "squircle";

	// Determine source type
	const isIframeMode =
		state.source.method === "iframe" &&
		state.source.url &&
		!state.source.image &&
		!state.source.screenshotUrl;
	const hasUploadedImage = state.source.image;
	const hasScreenshot = state.source.screenshotUrl;

	const currentDevice = frame.dataset.device || "";
	const currentSourceType = frame.dataset.sourceType || "";
	const currentUrl = frame.dataset.url || "";
	const currentScreenshot = frame.dataset.screenshotUrl || "";

	// Determine source type string
	let sourceType = "placeholder";
	if (hasUploadedImage) sourceType = "image";
	else if (isIframeMode) sourceType = "iframe";
	else if (hasScreenshot) sourceType = "screenshot";

	const needsFullRebuild =
		currentDevice !== state.canvas.device ||
		currentSourceType !== sourceType ||
		(isIframeMode && currentUrl !== state.source.url) ||
		(hasScreenshot && currentScreenshot !== state.source.screenshotUrl);

	// If no rebuild needed, just update CSS - NO RELOAD
	if (!needsFullRebuild) {
		log.info("updateDeviceFrame", "CSS-only update - NO reload");

		// Update frame class
		frame.className = `device-frame frame-${state.canvas.device} ${cornerShape}`;

		// Apply corner radius to frame when no device frame
		if (!hasDeviceFrame) {
			applyCornerRadius(frame, state.canvas.cornerRadius, cornerShape);
		}

		// Update content element sizes via CSS only
		const contentEls = frame.querySelectorAll(
			".window-content, .screen, .browser-content, .iframe-container, img, #placeholderContent"
		);
		contentEls.forEach((el) => {
			el.style.width = canvasW + "px";
			el.style.height = canvasH + "px";
		});

		// Update iframe size directly - no src change
		const iframe = frame.querySelector("iframe");
		if (iframe) {
			iframe.style.width = canvasW + "px";
			iframe.style.height = canvasH + "px";
			iframe.style.minWidth = canvasW + "px";
		}

		return; // STOP HERE - no HTML rebuild
	}

	// Full rebuild needed
	log.info("updateDeviceFrame", `Full rebuild needed - source: ${sourceType}`);

	frame.className = `device-frame frame-${state.canvas.device} ${cornerShape}`;
	frame.dataset.device = state.canvas.device;
	frame.dataset.sourceType = sourceType;
	frame.dataset.url = state.source.url || "";
	frame.dataset.screenshotUrl = state.source.screenshotUrl || "";

	// Apply corner radius to frame when no device frame
	if (!hasDeviceFrame) {
		applyCornerRadius(frame, state.canvas.cornerRadius, cornerShape);
	}
	// Build content based on source type
	let content = "";

	if (hasUploadedImage) {
		// Uploaded image
		content = `<img src="${state.source.image}" style="width: ${canvasW}px; height: ${canvasH}px; object-fit: cover; display: block; ">`;
		log.info("updateDeviceFrame", "Using uploaded image");
	} else if (hasScreenshot) {
		// Screenshot from API
		content = `<img src="${state.source.screenshotUrl}" style="width: ${canvasW}px; height: ${canvasH}px; object-fit: cover; display: block; ">`;
		log.info(
			"updateDeviceFrame",
			`Using screenshot: ${state.source.screenshotUrl.substring(0, 60)}...`
		);
	} else if (isIframeMode) {
		// Live iframe
		content = `<div class="iframe-container" style="width: ${canvasW}px; height: ${canvasH}px; background: #000; "></div>`;
		log.info("updateDeviceFrame", "Using iframe container");
	} else {
		// Placeholder
		content = `<div id="placeholderContent" style="width: ${canvasW}px; height: ${canvasH}px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; "><div style="text-align: center;"><i class="fas fa-globe" style="font-size: 48px; margin-bottom: 16px; opacity: 0.8;"></i><p>Enter a URL or upload an image</p></div></div>`;
		log.info("updateDeviceFrame", "Using placeholder");
	}

	// Build frame HTML
	let frameHTML = "";
	switch (state.canvas.device) {
		case "macos":
			frameHTML = `<div class="window-controls"><span></span><span></span><span></span></div><div class="window-content" style="border-radius: 4px 4px 0 0; overflow: hidden;">${content}</div>`;
			break;
		case "windows":
			frameHTML = `<div class="window-titlebar"><span class="window-title">Website</span><div class="window-controls"><i class="fas fa-minus"></i><i class="fas fa-square"></i><i class="fas fa-times"></i></div></div><div class="window-content" style="overflow: hidden;">${content}</div>`;
			break;
		case "iphone":
			frameHTML = `<div class="notch"></div><div class="screen" style="overflow: hidden;">${content}</div>`;
			break;
		case "android":
			frameHTML = `<div class="camera-punch"></div><div class="screen" style="overflow: hidden;">${content}</div>`;
			break;
		case "tablet":
			frameHTML = `<div class="screen" style="overflow: hidden;">${content}</div>`;
			break;
		case "browser":
			const browserTitle =
				state.title.text || state.source.url || "https://example.com";
			frameHTML = `<div class="browser-bar"><div class="browser-controls"><span></span><span></span><span></span></div><div class="url-bar"><i class="fas fa-lock"></i> ${browserTitle}</div></div><div class="browser-content" style="overflow: hidden;">${content}</div>`;
			break;
		default:
			frameHTML = content;
	}

	frame.innerHTML = frameHTML;

	// Apply corner radius and shape to the frame itself when no device
	if (!hasDeviceFrame) {
		applyCornerRadius(frame, state.canvas.cornerRadius, cornerShape);
	}

	// Only inject iframe if iframe mode
	if (isIframeMode) {
		const iframeContainer = frame.querySelector(
			".iframe-container, .screen, .window-content, .browser-content"
		);
		if (iframeContainer) {
			iframeContainer.innerHTML = "";
			const iframe = document.createElement("iframe");
			iframe.src = state.source.url;
			iframe.style.width = "100%";
			iframe.style.height = canvasH + "px";
			iframe.style.border = "none";
			iframe.style.display = "block";
			iframe.style.minWidth = canvasW + "px";
			iframeContainer.style.overflow = "hidden";
			iframeContainer.appendChild(iframe);
		}
	}

	log.info("updateDeviceFrame", "Frame rebuilt successfully");
}

function hexToRgba(hex, opacity) {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const result = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
	log.info("hexToRgba", `${hex} -> ${result}`);
	return result;
}

function showLoading(text = "Loading...") {
	log.info("showLoading", text);
	$("loadingText").textContent = text;
	$("loadingOverlay").classList.add("active");
}
function hideLoading() {
	log.info("hideLoading", "Hiding loading overlay");
	$("loadingOverlay").classList.remove("active");
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", init);

log.groupEnd();
