let debug = true;
let debug_math = false;
console.clear();

const app_config = {
	toast_duration_ms: 1500,
	default_palette_name: "Legendary Prismatico Loot",
	max_history_items: 30
};

let undo_stack = [];
let redo_stack = [];

const rpg_nouns = [
	"Dragon",
	"Blood",
	"Ruby",
	"Crimson",
	"Ember",
	"Flame",
	"Brick",
	"Heart",
	"Scarlet",
	"Garnet",
	"Rust",
	"Pumpkin",
	"Tiger",
	"Sunset",
	"Amber",
	"Clay",
	"Copper",
	"Bronze",
	"Marmalade",
	"Gold",
	"Citrine",
	"Honey",
	"Sand",
	"Sun",
	"Maize",
	"Lemon",
	"Canary",
	"Butter",
	"Lime",
	"Acid",
	"Slime",
	"Venom",
	"Emerald",
	"Sage",
	"Forest",
	"Moss",
	"Fern",
	"Jade",
	"Basilisk",
	"Teal",
	"Ice",
	"Diamond",
	"Sky",
	"Frost",
	"Crystal",
	"Azure",
	"Ocean",
	"Sapphire",
	"Cobalt",
	"Storm",
	"Glacier",
	"Indigo",
	"Night",
	"Void",
	"Arcane",
	"Amethyst",
	"Mystic",
	"Grape",
	"Lavender",
	"Warlock",
	"Phantom",
	"Orchid",
	"Rose",
	"Bubblegum",
	"Coral",
	"Lotus",
	"Petal",
	"Fuchsia",
	"Magma",
	"Phoenix",
	"Blossom"
];
const adj_dark = [
	"Abyssal",
	"Stygian",
	"Shadow",
	"Doom",
	"Midnight",
	"Obsidian",
	"Deep",
	"Dark"
];
const adj_dim = ["Dim", "Dusk", "Gloomy", "Murky", "Twilight", "Shady"];
const adj_light = [
	"Radiant",
	"Luminous",
	"Holy",
	"Bright",
	"Shining",
	"Gleaming"
];
const adj_pale = [
	"Celestial",
	"Divine",
	"Ethereal",
	"Ghostly",
	"Pure",
	"White",
	"Pale"
];
const adj_gray = [
	"Ashen",
	"Dusty",
	"Grey",
	"Faded",
	"Bleak",
	"Old",
	"Ancient",
	"Iron"
];
const adj_dull = ["Muted", "Washed", "Soft", "Pastel", "Weak"];
const adj_vivid = [
	"Vivid",
	"Neon",
	"Electric",
	"Hyper",
	"Prime",
	"Laser",
	"Power"
];
const adj_royal = [
	"Royal",
	"Grand",
	"True",
	"Noble",
	"Wild",
	"Raw",
	"Regal",
	"Imperial",
    "Legendary",
    "Mythic"
];

function generateRPGName(h, s, l) {
	const noun_idx = Math.floor(((h % 360) / 360) * rpg_nouns.length);
	const noun = rpg_nouns[noun_idx];

	let adj_pool = adj_royal;
	if (l < 10) adj_pool = adj_dark;
	else if (l < 30) adj_pool = adj_dim;
	else if (l > 90) adj_pool = adj_pale;
	else if (l > 75) adj_pool = adj_light;
	else if (s < 10) adj_pool = adj_gray;
	else if (s < 30) adj_pool = adj_dull;
	else if (s > 90) adj_pool = adj_vivid;

	const adj = adj_pool[Math.floor(Math.random() * adj_pool.length)];
	const final_name = `${adj} ${noun}`;
	if (debug && debug_math)
		console.log(
			"%c[Data] Generated RPG name:",
			"color: #f59e0b",
			final_name,
			"for HSL:",
			h,
			s,
			l
		);
	return final_name;
}

const init_h = Math.floor(Math.random() * 360);
const init_s = Math.floor(Math.random() * 100);
const init_l = Math.floor(Math.random() * 60) + 20;

const State = {
	h: init_h,
	s: init_s,
	l: init_l,
	a: 1,
	palette: [],
	generation_history: [],
	paletteName: generateRPGName(init_h, init_s, init_l),
	format: "hex",
	mix: {
		start: { h: 0, s: 0, l: 100, a: 1 },
		end: { h: 0, s: 0, l: 0, a: 1 }
	}
};

function snapshotState(action_name) {
	if (debug)
		console.log(
			"%c[State] Snapshotting state for action:",
			"color: #a855f7",
			action_name
		);
	const snap = {
		h: State.h,
		s: State.s,
		l: State.l,
		a: State.a,
		palette: JSON.parse(JSON.stringify(State.palette)),
		paletteName: State.paletteName
	};
	undo_stack.push(snap);
	if (undo_stack.length > app_config.max_history_items) {
		undo_stack.shift();
	}
	redo_stack = [];
}

function undoAction() {
	if (undo_stack.length === 0) {
		showToast("The timeline cannot be reversed further.");
		return;
	}
	if (debug) console.log("%c[Action] Executing Undo", "color: #a855f7");
	const current_snap = {
		h: State.h,
		s: State.s,
		l: State.l,
		a: State.a,
		palette: JSON.parse(JSON.stringify(State.palette)),
		paletteName: State.paletteName
	};
	redo_stack.push(current_snap);

	const prev = undo_stack.pop();
	State.h = prev.h;
	State.s = prev.s;
	State.l = prev.l;
	State.a = prev.a;
	State.palette = prev.palette;
	State.paletteName = prev.paletteName;

	const title_el = document.getElementById("paletteTitle");
	if (title_el) title_el.innerText = State.paletteName;
	const feat_el = document.getElementById("feattitle");
	if (feat_el)
		feat_el.innerText = `Your Legendary Palette: ${State.paletteName}`;

	renderPalette();
	updateUI("undo");
	saveState();
	showToast("Timeline Rewound");
}

function redoAction() {
	if (redo_stack.length === 0) {
		showToast("No future visions available.");
		return;
	}
	if (debug) console.log("%c[Action] Executing Redo", "color: #a855f7");
	const current_snap = {
		h: State.h,
		s: State.s,
		l: State.l,
		a: State.a,
		palette: JSON.parse(JSON.stringify(State.palette)),
		paletteName: State.paletteName
	};
	undo_stack.push(current_snap);

	const next = redo_stack.pop();
	State.h = next.h;
	State.s = next.s;
	State.l = next.l;
	State.a = next.a;
	State.palette = next.palette;
	State.paletteName = next.paletteName;

	const title_el = document.getElementById("paletteTitle");
	if (title_el) title_el.innerText = State.paletteName;
	const feat_el = document.getElementById("feattitle");
	if (feat_el)
		feat_el.innerText = `Your Legendary Palette: ${State.paletteName}`;

	renderPalette();
	updateUI("redo");
	saveState();
	showToast("Future Sight Restored");
}

function resetApp() {
	if (debug)
		console.log("%c[Action] Executing Reset Everything", "color: #ef4444");
	snapshotState("Reset Palette");
	State.palette = [];
	State.h = Math.floor(Math.random() * 360);
	State.s = Math.floor(Math.random() * 100);
	State.l = Math.floor(Math.random() * 60) + 20;
	State.a = 1;
	State.paletteName = generateRPGName(State.h, State.s, State.l);

	const title_el = document.getElementById("paletteTitle");
	if (title_el) title_el.innerText = State.paletteName;
	const feat_el = document.getElementById("feattitle");
	if (feat_el)
		feat_el.innerText = `Your Legendary Palette: ${State.paletteName}`;

	updateUI("reset");
	renderPalette();
	saveState();
	trackGeneration();
	showToast("Inventory Banished");
}

function trackGeneration() {
	if (debug)
		console.log("%c[History] Tracking color generation", "color: #10b981");
	const current_hex = rgbToHex(...hslToRgb(State.h, State.s, State.l), State.a);

	if (State.generation_history.length > 0) {
		const last = State.generation_history[State.generation_history.length - 1];
		const last_hex = rgbToHex(...hslToRgb(last.h, last.s, last.l), last.a);
		if (current_hex === last_hex) {
			if (debug)
				console.log(
					"%c[History] Skipped saving duplicate generation",
					"color: #10b981"
				);
			return;
		}
	}

	const item = {
		h: State.h,
		s: State.s,
		l: State.l,
		a: State.a,
		fmt: State.format,
		name: generateRPGName(State.h, State.s, State.l)
	};
	State.generation_history.push(item);
	if (State.generation_history.length > app_config.max_history_items) {
		State.generation_history.shift();
	}
	saveState();
	if (
		document.getElementById("view-history") &&
		document.getElementById("view-history").classList.contains("active")
	) {
		renderHistory();
	}
}

function loadState() {
	try {
		const saved = localStorage.getItem("prismaticoState");
		if (saved) {
			const parsed = JSON.parse(saved);
			State.palette = parsed.palette || [];
			if (parsed.paletteName) {
				State.paletteName = parsed.paletteName;
			}
			if (parsed.generation_history) {
				State.generation_history = parsed.generation_history;
			}
			if (debug)
				console.log(
					"%c[State] Loaded local storage. Palette:",
					"color: #3b82f6",
					State.paletteName,
					"Count:",
					State.palette.length,
					"History items:",
					State.generation_history.length
				);
		} else {
			if (debug)
				console.log(
					"%c[State] No saved local storage found, starting fresh with generated name:",
					"color: #3b82f6",
					State.paletteName
				);
		}

		document.getElementById("paletteTitle").innerText = State.paletteName;
		document.getElementById(
			"feattitle"
		).innerText = `Your Legendary Palette: ${State.paletteName}`;
		renderPalette();
		renderHistory();
	} catch (err) {
		if (debug)
			console.error(
				"%c[State] Failed to load local storage",
				"color: #ef4444",
				err
			);
	}
}

function saveState() {
	if (debug)
		console.log(
			"%c[State] Saving to local storage. Palette:",
			"color: #3b82f6",
			State.paletteName,
			"Count:",
			State.palette.length
		);
	try {
		localStorage.setItem(
			"prismaticoState",
			JSON.stringify({
				palette: State.palette,
				paletteName: State.paletteName,
				generation_history: State.generation_history
			})
		);
	} catch (err) {
		if (debug)
			console.error(
				"%c[State] Failed to save local storage",
				"color: #ef4444",
				err
			);
	}
}

function updatePaletteName(el) {
	snapshotState("Update Palette Name");
	const new_name =
		el.innerText.trim() || generateRPGName(State.h, State.s, State.l);
	if (debug)
		console.log(
			"%c[State] Updating palette name from",
			"color: #10b981",
			State.paletteName,
			"to",
			new_name
		);
	State.paletteName = new_name;

	document.getElementById(
		"feattitle"
	).innerText = `Your Legendary Palette: ${new_name}`;

	saveState();
}

function randomizePaletteName() {
	snapshotState("Randomize Palette Name");
	const new_name = generateRPGName(State.h, State.s, State.l);
	if (debug)
		console.log(
			"%c[Action] Randomizing palette name to:",
			"color: #3b82f6",
			new_name
		);
	State.paletteName = new_name;
	const title_el = document.getElementById("paletteTitle");
	if (title_el) title_el.innerText = new_name;
	const feat_el = document.getElementById("feattitle");
	if (feat_el)
		feat_el.innerText = `Your Legendary Palette: ${new_name}`;
	saveState();
	showToast("The Oracle Speaks");
}

async function parseAse(buffer) {
	if (debug)
		console.log(
			"%c[Parser] Parsing ASE binary. Buffer length:",
			"color: #a855f7",
			buffer.byteLength
		);
	const view = new DataView(buffer);
	let offset = 12;
	const count = view.getUint32(8);
	const found = [];
	for (let i = 0; i < count; i++) {
		const type = view.getUint16(offset);
		const block_len = view.getUint32(offset + 2);
		offset += 6;
		if (type === 1) {
			const name_len = view.getUint16(offset);
			let name = "";
			for (let n = 0; n < name_len - 1; n++)
				name += String.fromCharCode(view.getUint16(offset + 2 + n * 2));
			const color_off = offset + 2 + name_len * 2;
			const model = String.fromCharCode(
				view.getUint8(color_off),
				view.getUint8(color_off + 1),
				view.getUint8(color_off + 2)
			).trim();
			if (model === "RGB") {
				found.push({
					name,
					r: view.getFloat32(color_off + 4),
					g: view.getFloat32(color_off + 8),
					b: view.getFloat32(color_off + 12)
				});
			}
		}
		offset += block_len;
	}
	if (debug)
		console.log(
			"%c[Parser] ASE Parsing complete. Colors extracted:",
			"color: #a855f7",
			found.length
		);
	return found;
}

async function parseAco(buffer) {
	if (debug)
		console.log(
			"%c[Parser] Parsing ACO binary. Buffer length:",
			"color: #a855f7",
			buffer.byteLength
		);
	const view = new DataView(buffer);
	let offset = 0;
	const count1 = view.getUint16(2);
	offset = 4 + count1 * 10;
	if (offset >= buffer.byteLength) return [];
	const count2 = view.getUint16(offset + 2);
	offset += 4;
	const found = [];
	for (let i = 0; i < count2; i++) {
		view.getUint16(offset);
		const r = view.getUint16(offset + 2) / 65535;
		const g = view.getUint16(offset + 4) / 65535;
		const b = view.getUint16(offset + 6) / 65535;
		offset += 10;
		const name_len = view.getUint32(offset);
		let name = "";
		for (let n = 0; n < name_len - 1; n++)
			name += String.fromCharCode(view.getUint16(offset + 4 + n * 2));
		offset += 4 + name_len * 2;
		found.push({ name, r, g, b });
	}
	if (debug)
		console.log(
			"%c[Parser] ACO Parsing complete. Colors extracted:",
			"color: #a855f7",
			found.length
		);
	return found;
}

function downloadPalette(type) {
	if (debug)
		console.log(
			`%c[Export] Exporting palette '${
				State.paletteName
			}' as ${type.toUpperCase()}`,
			"color: #10b981",
			"Total colors:",
			State.palette.length
		);
	if (State.palette.length === 0) {
		showToast("Your Bag of Holding is empty!");
		return;
	}

	let content = "";
	const safeFilename = State.paletteName.toLowerCase().replace(/\s+/g, "-");
	let filename = safeFilename;
	let mime = "text/plain";
	const formats = ["hex", "rgb", "rgba", "hsl", "hsla"];
	const date = new Date().toLocaleString();
	const headerInfo = `Prismatico Palette: ${State.paletteName}\nGenerated: ${date}\nLink: https://codepen.io/Julibe/full/ByjNKXg`;

	try {
		if (type === "json") {
			const data = {
				_meta: { title: State.paletteName, generated: date, tool: "Prismatico" },
				palette: State.palette.map((p) => ({
					name: p.name,
					formats: {
						hex: getFormattedColor(p.h, p.s, p.l, p.a, "hex"),
						rgb: getFormattedColor(p.h, p.s, p.l, p.a, "rgb"),
						rgba: getFormattedColor(p.h, p.s, p.l, p.a, "rgba"),
						hsl: getFormattedColor(p.h, p.s, p.l, p.a, "hsl"),
						hsla: getFormattedColor(p.h, p.s, p.l, p.a, "hsla")
					}
				}))
			};
			content = JSON.stringify(data, null, 2);
			filename += ".json";
			mime = "application/json";
		} else if (type === "css") {
			content = `/**\n * ${headerInfo.replace(/\n/g, "\n * ")}\n */\n\n:root {\n`;
			State.palette.forEach((p) => {
				const safeName = p.name.toLowerCase().replace(/\s+/g, "-");
				content += `\t/* --- ${p.name} --- */\n`;
				formats.forEach((fmt) => {
					const val = getFormattedColor(p.h, p.s, p.l, p.a, fmt);
					content += `\t--${safeName}-${fmt}: ${val};\n`;
				});
				content += "\n";
			});
			content += `}\n\n/**\n * Utility Classes\n */\n`;
			State.palette.forEach((p) => {
				const safeName = p.name.toLowerCase().replace(/\s+/g, "-");
				content += `\n/* ${p.name} */\n`;
				formats.forEach((fmt) => {
					const val = getFormattedColor(p.h, p.s, p.l, p.a, fmt);
					content += `.${safeName}-${fmt} { color: ${val}; }\n`;
					content += `.text-${safeName}-${fmt} { color: ${val}; }\n`;
					content += `.bg-${safeName}-${fmt} { background-color: ${val}; }\n`;
					content += `.border-${safeName}-${fmt} { border-color: ${val}; }\n`;
				});
			});
			filename += ".css";
			mime = "text/css";
		} else if (type === "xml") {
			content = `<?xml version="1.0" encoding="UTF-8"?>\n<!--\n  ${headerInfo.replace(
				/\n/g,
				"\n  "
			)}\n-->\n<palette name="${State.paletteName}">\n`;
			State.palette.forEach((p) => {
				const safeName = p.name.toLowerCase().replace(/\s+/g, "_");
				content += `\t<!-- Color: ${p.name} -->\n`;
				content += `\t<color name="${safeName}">\n`;
				formats.forEach((fmt) => {
					const val = getFormattedColor(p.h, p.s, p.l, p.a, fmt);
					content += `\t\t<${fmt}>${val}</${fmt}>\n`;
				});
				content += `\t</color>\n`;
			});
			content += "</palette>";
			filename += ".xml";
			mime = "text/xml";
		} else if (type === "csv") {
			content = "Name,Hex,R,G,B\n";
			State.palette.forEach((p) => {
				const rgb = hslToRgb(p.h, p.s, p.l);
				const hex = rgbToHex(rgb[0], rgb[1], rgb[2], p.a).toUpperCase();
				content += `"${p.name}",${hex},${rgb[0]},${rgb[1]},${rgb[2]}\n`;
			});
			filename += ".csv";
			mime = "text/csv";
		} else if (type === "ase") {
			const total_blocks = State.palette.length;
			let size = 12;
			State.palette.forEach(
				(c) => (size += 6 + 2 + (c.name.length + 1) * 2 + 4 + 12 + 2)
			);
			const buffer = new ArrayBuffer(size);
			const view = new DataView(buffer);
			view.setUint8(0, 65);
			view.setUint8(1, 83);
			view.setUint8(2, 69);
			view.setUint8(3, 70);
			view.setUint16(4, 1);
			view.setUint16(6, 0);
			view.setUint32(8, total_blocks);
			let offset = 12;
			State.palette.forEach((c) => {
				const rgb = hslToRgb(c.h, c.s, c.l);
				view.setUint16(offset, 1);
				const n_len = c.name.length + 1;
				const b_len = 2 + n_len * 2 + 4 + 12 + 2;
				view.setUint32(offset + 2, b_len);
				offset += 6;
				view.setUint16(offset, n_len);
				offset += 2;
				for (let i = 0; i < c.name.length; i++) {
					view.setUint16(offset, c.name.charCodeAt(i));
					offset += 2;
				}
				view.setUint16(offset, 0);
				offset += 2;
				view.setUint8(offset, 82);
				view.setUint8(offset + 1, 71);
				view.setUint8(offset + 2, 66);
				view.setUint8(offset + 3, 32);
				offset += 4;
				view.setFloat32(offset, rgb[0] / 255);
				view.setFloat32(offset + 4, rgb[1] / 255);
				view.setFloat32(offset + 8, rgb[2] / 255);
				offset += 12;
				view.setUint16(offset, 1);
				offset += 2;
			});
			const blob = new Blob([buffer], { type: "application/octet-stream" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename + ".ase";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			showToast(`Scribed ASE Scroll`);
			if (debug)
				console.log(
					"%c[Export] Finished generating ASE download link.",
					"color: #10b981",
					"Size:",
					size,
					"bytes"
				);
			return;
		} else if (type === "aco") {
			let size = 4 + State.palette.length * 10 + 4;
			State.palette.forEach((c) => (size += 10 + 4 + (c.name.length + 1) * 2));
			const buffer = new ArrayBuffer(size);
			const view = new DataView(buffer);
			view.setUint16(0, 1);
			view.setUint16(2, State.palette.length);
			let off = 4;
			State.palette.forEach((c) => {
				const rgb = hslToRgb(c.h, c.s, c.l);
				view.setUint16(off, 0);
				view.setUint16(off + 2, (rgb[0] / 255) * 65535);
				view.setUint16(off + 4, (rgb[1] / 255) * 65535);
				view.setUint16(off + 6, (rgb[2] / 255) * 65535);
				off += 10;
			});
			view.setUint16(off, 2);
			view.setUint16(off + 2, State.palette.length);
			off += 4;
			State.palette.forEach((c) => {
				const rgb = hslToRgb(c.h, c.s, c.l);
				view.setUint16(off, 0);
				view.setUint16(off + 2, (rgb[0] / 255) * 65535);
				view.setUint16(off + 4, (rgb[1] / 255) * 65535);
				view.setUint16(off + 6, (rgb[2] / 255) * 65535);
				off += 10;
				view.setUint32(off, c.name.length + 1);
				off += 4;
				for (let i = 0; i < c.name.length; i++) {
					view.setUint16(off, c.name.charCodeAt(i));
					off += 2;
				}
				view.setUint16(off, 0);
				off += 2;
			});
			const blob = new Blob([buffer], { type: "application/octet-stream" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename + ".aco";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			showToast(`Scribed ACO Scroll`);
			if (debug)
				console.log(
					"%c[Export] Finished generating ACO download link.",
					"color: #10b981",
					"Size:",
					size,
					"bytes"
				);
			return;
		}

		const blob = new Blob([content], { type: mime });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		showToast(`Scribed ${type.toUpperCase()} Scroll`);
		if (debug)
			console.log(
				"%c[Export] Finished exporting text-based file.",
				"color: #10b981",
				"Filename:",
				filename,
				"Mime:",
				mime
			);
	} catch (err) {
		if (debug) console.error("%c[Export] Export failed", "color: #ef4444", err);
		showToast("Export Failed");
	}
}

async function importPalette(input) {
	const file = input.files[0];
	if (!file) {
		if (debug) console.warn("%c[Import] No file selected", "color: #f59e0b");
		return;
	}
	const file_name = file.name.toLowerCase();
	if (debug)
		console.log(
			"%c[Import] Reading file input:",
			"color: #f59e0b",
			file.name,
			"Size:",
			file.size,
			"bytes"
		);

	try {
		if (file_name.endsWith(".ase") || file_name.endsWith(".aco")) {
			snapshotState("Import Binary Palette");
			if (debug)
				console.log("%c[Import] Passing to binary parser", "color: #a855f7");
			const buffer = await file.arrayBuffer();
			let parsed_colors = [];
			if (file_name.endsWith(".ase")) {
				parsed_colors = await parseAse(buffer);
			} else {
				parsed_colors = await parseAco(buffer);
			}

			parsed_colors.forEach((c) => {
				const hsl = rgbToHsl(
					Math.round(c.r * 255),
					Math.round(c.g * 255),
					Math.round(c.b * 255)
				);
				State.palette.push({
					h: hsl[0],
					s: hsl[1],
					l: hsl[2],
					a: 1,
					fmt: "hex",
					name: c.name || generateRPGName(hsl[0], hsl[1], hsl[2])
				});
			});
			saveState();
			renderPalette();
			showToast("Ancient Scroll Deciphered");
			if (debug)
				console.log(
					"%c[Import] Binary import successful. Colors added:",
					"color: #10b981",
					parsed_colors.length
				);
			input.value = "";
			return;
		}
	} catch (err) {
		if (debug)
			console.error("%c[Import] Binary parsing error", "color: #ef4444", err);
		showToast("Deciphering Failed");
		input.value = "";
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		snapshotState("Import Text Palette");
		if (debug) console.log("%c[Import] Passing to text parser", "color: #a855f7");
		try {
			const text_data = e.target.result;

			if (file_name.endsWith(".csv")) {
				const lines = text_data.split("\n");
				let imported_count = 0;
				lines.forEach((line) => {
					const parts = line.split(",");
					if (parts.length >= 2) {
						const hex = parts[1].trim();
						if (hex.startsWith("#")) {
							const rgba = parseAnyColor(hex);
							if (rgba) {
								const [h, s, l] = rgbToHsl(rgba[0], rgba[1], rgba[2]);
								State.palette.push({
									h,
									s,
									l,
									a: rgba[3],
									fmt: "hex",
									name: parts[0].replace(/"/g, "") || generateRPGName(h, s, l)
								});
								imported_count++;
							}
						}
					}
				});
				saveState();
				renderPalette();
				showToast("Merchant Ledger Imported");
				if (debug)
					console.log(
						"%c[Import] CSV import successful. Colors added:",
						"color: #10b981",
						imported_count
					);
			} else {
				const data = JSON.parse(text_data);
				if (data.palette && Array.isArray(data.palette)) {
					State.palette = data.palette.map((p) => {
						const hex = p.formats?.hex || p.hex || "#000000";
						const rgba = parseAnyColor(hex);
						const [h, s, l] = rgbToHsl(rgba[0], rgba[1], rgba[2]);
						return {
							h,
							s,
							l,
							a: rgba[3],
							fmt: "hex",
							name: p.name || generateRPGName(h, s, l)
						};
					});
					if (data._meta?.title) {
						State.paletteName = data._meta.title;
						document.getElementById("paletteTitle").innerText = State.paletteName;
						document.getElementById(
							"feattitle"
						).innerText = `Your Legendary Palette: ${State.paletteName}`;
					}
					saveState();
					renderPalette();
					showToast("Quest Log Updated");
					if (debug)
						console.log(
							"%c[Import] JSON import successful. Colors set:",
							"color: #10b981",
							data.palette.length,
							"Palette name:",
							data._meta?.title
						);
				} else {
					if (debug)
						console.warn("%c[Import] Invalid JSON structure", "color: #ef4444");
					showToast("Cursed Scroll");
				}
			}
		} catch (err) {
			if (debug)
				console.error(
					"%c[Import] Failed to parse file text",
					"color: #ef4444",
					err
				);
			showToast("Deciphering Failed");
		}
		input.value = "";
	};
	reader.readAsText(file);
}

function addToPalette() {
	const hex = rgbToHex(...hslToRgb(State.h, State.s, State.l), State.a);
	if (debug)
		console.log(
			"%c[Action] Evaluating to add color to palette:",
			"color: #10b981",
			"HEX:",
			hex
		);

	if (
		State.palette.some((p) => rgbToHex(...hslToRgb(p.h, p.s, p.l), p.a) === hex)
	) {
		if (debug)
			console.warn(
				"%c[Action] Color addition blocked: Duplicate detected",
				"color: #f59e0b",
				hex
			);
		const btn = document.getElementById("btnAdd");
		btn.classList.add("error");
		setTimeout(() => btn.classList.remove("error"), 400);
		showToast("Loot already owned!");
		return;
	}
	snapshotState("Add Color To Palette");
	const name = generateRPGName(State.h, State.s, State.l);
	State.palette.push({
		h: State.h,
		s: State.s,
		l: State.l,
		a: State.a,
		fmt: State.format,
		name: name
	});
	saveState();
	renderPalette();
	if (!document.getElementById("view-palette").classList.contains("active"))
		document.querySelectorAll(".tab-btn")[0].click();
	showToast("Looted: " + name);
	if (debug)
		console.log(
			"%c[Action] Color successfully added to palette:",
			"color: #10b981",
			name,
			hex,
			"Total colors:",
			State.palette.length
		);
}

function renderPalette() {
	if (debug)
		console.log(
			"%c[Render] Rendering palette view. Items:",
			"color: #10b981",
			State.palette.length
		);
	const g = document.getElementById("paletteGrid");
	g.innerHTML = "";
	document.getElementById("emptyMsg").style.display = State.palette.length
		? "none"
		: "block";
	State.palette.forEach((p, i) => {
		makeCard(p, g, i * 0.05, true);
	});
}

function renderHistory() {
	if (debug)
		console.log(
			"%c[Render] Rendering history view. Items:",
			"color: #10b981",
			State.generation_history.length
		);
	const g = document.getElementById("historyGrid");
	g.innerHTML = "";
	document.getElementById("emptyHistoryMsg").style.display = State
		.generation_history.length
		? "none"
		: "block";

	[...State.generation_history].reverse().forEach((p, i) => {
		makeCard(p, g, i * 0.05, false);
	});
}

function makeCard(c, container, delay = 0, isPalette = false) {
	const rgb = hslToRgb(c.h, c.s, c.l);
	const txt = getFormattedColor(c.h, c.s, c.l, c.a, c.fmt);
	const css = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${c.a})`;
	const name = c.name || generateRPGName(c.h, c.s, c.l);

	if (debug && debug_math)
		console.log(
			"%c[Render] Generating Card DOM node for",
			"color: #10b981",
			name,
			txt
		);

	const d = document.createElement("div");

	const actionBtn = isPalette
		? `<button class="card-btn btn-del" title="Discard ${name}" aria-label="Delete ${name} from inventory"><span class="material-symbols-rounded icon-sm" aria-hidden="true">delete</span></button>`
		: `<button class="card-btn btn-add" title="Loot ${name}" aria-label="Add ${name} to inventory"><span class="material-symbols-rounded icon-sm" aria-hidden="true">add</span></button>`;

	const nameHtml = isPalette
		? `<div class="name-row">
             <div class="color-name" contenteditable="true" spellcheck="false" title="Click to rename this artifact" aria-label="Artifact Name, editable">${name}</div>
             <button class="btn-icon-random card-rand" title="Divine new name" aria-label="Generate random name"><span class="material-symbols-rounded icon-sm" aria-hidden="true">casino</span></button>
           </div>`
		: `<div class="color-name" aria-label="Artifact Name">${name}</div>`;

	d.className = "card";
	d.style.animationDelay = delay + "s";
	d.tabIndex = 0;
	d.setAttribute("role", "group");
	d.setAttribute("aria-label", `Artifact card for ${name}`);

	d.innerHTML = `
        <button class="card-btn btn-copy" title="Scribe code: ${txt}" aria-label="Copy color code"><span class="material-symbols-rounded icon-sm" aria-hidden="true">content_copy</span></button>
        ${actionBtn}
        <button class="swatch-wrapper" aria-hidden="true" aria-label="${
									c.fmt
								}" title="Inspect ${txt}"><div class="swatch-color" style="background:${css}"></div></button>
        ${nameHtml}
        <span class="meta-label" aria-label="Rune Type: ${
									c.fmt
								}">${c.fmt.toUpperCase()}</span>
        <div class="meta-code" aria-label="Rune Value: ${txt}">${txt}</div>
    `;

	const nameEl = d.querySelector(".color-name");
	if (isPalette && nameEl) {
		nameEl.onblur = () => {
			snapshotState("Rename Color");
			if (debug)
				console.log(
					"%c[Action] Renamed color inside card from",
					"color: #3b82f6",
					c.name,
					"to",
					nameEl.innerText
				);
			c.name = nameEl.innerText;
			saveState();
		};
		nameEl.onclick = (e) => e.stopPropagation();
		nameEl.onkeydown = (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				nameEl.blur();
			}
		};
	}

	d.onclick = (e) => {
		if (e.target.isContentEditable) return;

		if (e.target.closest(".card-rand")) {
			snapshotState("Randomize Card Name");
			const new_name = generateRPGName(c.h, c.s, c.l);
			if (debug)
				console.log(
					"%c[Action] Card Randomize Clicked. New name:",
					"color: #10b981",
					new_name
				);
			c.name = new_name;
			saveState();
			renderPalette();
			showToast("The Oracle Speaks");
			return;
		}

		if (e.target.closest(".btn-del")) {
			snapshotState("Delete Color");
			const index = State.palette.indexOf(c);
			if (debug)
				console.log(
					"%c[Action] Card Delete Clicked. Removing from palette:",
					"color: #ef4444",
					c.name,
					"Index:",
					index
				);
			if (index > -1) {
				State.palette.splice(index, 1);
				saveState();
				renderPalette();
				showToast("Item Discarded");
			}
			return;
		}

		if (e.target.closest(".btn-add")) {
			const hex = rgbToHex(...hslToRgb(c.h, c.s, c.l), c.a);
			if (debug)
				console.log(
					"%c[Action] Card Add Clicked. Adding to palette:",
					"color: #10b981",
					name,
					hex
				);
			if (
				State.palette.some((p) => rgbToHex(...hslToRgb(p.h, p.s, p.l), p.a) === hex)
			) {
				showToast("You already possess this artifact!");
				return;
			}
			snapshotState("Add Color To Palette");
			State.palette.push({ ...c, name: name });
			saveState();
			renderPalette();
			showToast("Artifact Attuned!");
			return;
		}

		if (e.target.closest(".btn-copy")) {
			if (debug)
				console.log("%c[Action] Card Copy Clicked. Text:", "color: #3b82f6", txt);
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(txt).then(
					() => showToast(`Rune Scribed: ${txt}`),
					() => execCopy(txt)
				);
			} else {
				execCopy(txt);
			}
			return;
		}

		if (debug)
			console.log(
				"%c[Action] Card Clicked. Setting global state to",
				"color: #3b82f6",
				c
			);
		State.h = c.h;
		State.s = c.s;
		State.l = c.l;
		State.a = c.a;
		State.format = c.fmt;
		if (els.fmt) els.fmt.value = c.fmt;
		if (e.target.closest(".swatch-color")) {
			renderInputs();
			updateUI();
			trackGeneration();
		}

		if (window.innerWidth < 800) {
			showToast("Artifact loaded to table");
		}
	};

	container.appendChild(d);
	return d;
}

function toggleDownloadMenu(e) {
	e.stopPropagation();
	const menu = document.getElementById("dlMenu");
	const is_showing = !menu.classList.contains("show");
	if (debug)
		console.log(
			"%c[UI] Toggling download menu. Showing:",
			"color: #3b82f6",
			is_showing
		);
	menu.classList.toggle("show");
}

window.addEventListener("click", () => {
	const menu = document.getElementById("dlMenu");
	if (menu && menu.classList.contains("show")) {
		if (debug)
			console.log(
				"%c[UI] Auto-closing download menu from window click",
				"color: #3b82f6"
			);
		menu.classList.remove("show");
	}
});

window.shareTwitter = function () {
	const currentVal = getFormattedColor(
		State.h,
		State.s,
		State.l,
		State.a,
		State.format
	);
	const currentName = generateRPGName(State.h, State.s, State.l);

	let text = "";

	if (State.palette.length > 0) {
		const list = State.palette
			.map((c) => {
				const val = getFormattedColor(c.h, c.s, c.l, c.a, c.fmt);
				return `⚔️ ${c.name}: ${val}`;
			})
			.join("\n");

		text = `🛡️ I have gathered "${State.paletteName}" in Prismatico!\n\n${list}\n\nStart your quest:`;
	} else {
		text = `⚔️ I discovered the artifact "${currentName}" (${currentVal}) in Prismatico!\n\nStart your quest:`;
	}

	if (debug)
		console.log(
			"%c[Action] Opening Twitter share. Content:",
			"color: #3b82f6",
			text
		);

	const url = "https://codepen.io/Julibe/full/ByjNKXg";
	const hashtags = "webdesign,ui,colorquest";

	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		text
	)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;

	window.open(twitterUrl, "_blank");
};

const hslToRgb = (h, s, l) => {
	if (debug && debug_math)
		console.log(
			"%c[Math] hslToRgb input:",
			"color: #a855f7",
			"H:",
			h,
			"S:",
			s,
			"L:",
			l
		);
	s /= 100;
	l /= 100;
	const k = (n) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n) =>
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	const res = [
		Math.round(255 * f(0)),
		Math.round(255 * f(8)),
		Math.round(255 * f(4))
	];
	if (debug && debug_math)
		console.log("%c[Math] hslToRgb result:", "color: #a855f7", res);
	return res;
};

const rgbToHsl = (r, g, b) => {
	if (debug && debug_math)
		console.log(
			"%c[Math] rgbToHsl input:",
			"color: #a855f7",
			"R:",
			r,
			"G:",
			g,
			"B:",
			b
		);
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h,
		s,
		l = (max + min) / 2;
	if (max === min) h = s = 0;
	else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	const res = [h * 360, s * 100, l * 100];
	if (debug && debug_math)
		console.log("%c[Math] rgbToHsl result:", "color: #a855f7", res);
	return res;
};

const rgbToHsv = (r, g, b) => {
	if (debug && debug_math)
		console.log(
			"%c[Math] rgbToHsv input:",
			"color: #a855f7",
			"R:",
			r,
			"G:",
			g,
			"B:",
			b
		);
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h,
		s,
		v = max;
	const d = max - min;
	s = max === 0 ? 0 : d / max;
	if (max === min) h = 0;
	else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	const res = [h * 360, s * 100, v * 100];
	if (debug && debug_math)
		console.log("%c[Math] rgbToHsv result:", "color: #a855f7", res);
	return res;
};

const rgbToHex = (r, g, b, a = 1) => {
	if (debug && debug_math)
		console.log(
			"%c[Math] rgbToHex input:",
			"color: #a855f7",
			"R:",
			r,
			"G:",
			g,
			"B:",
			b,
			"A:",
			a
		);
	const rgb = [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
	if (a >= 1) {
		if (debug && debug_math)
			console.log("%c[Math] rgbToHex result:", "color: #a855f7", "#" + rgb);
		return "#" + rgb;
	}
	const alpha = Math.round(a * 255)
		.toString(16)
		.padStart(2, "0");
	const res = "#" + rgb + alpha;
	if (debug && debug_math)
		console.log("%c[Math] rgbToHex result:", "color: #a855f7", res);
	return res;
};

const hexToRgba = (hex) => {
	if (debug && debug_math)
		console.log("%c[Math] hexToRgba input:", "color: #a855f7", hex);
	hex = hex.replace("#", "");
	if (hex.length === 3)
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	if (hex.length === 6) {
		const r = parseInt(hex.substring(0, 2), 16),
			g = parseInt(hex.substring(2, 4), 16),
			b = parseInt(hex.substring(4, 6), 16);
		if (debug && debug_math)
			console.log("%c[Math] hexToRgba result:", "color: #a855f7", [r, g, b, 1]);
		return [r, g, b, 1];
	}
	if (hex.length === 8) {
		const r = parseInt(hex.substring(0, 2), 16),
			g = parseInt(hex.substring(2, 4), 16),
			b = parseInt(hex.substring(4, 6), 16);
		const a = parseInt(hex.substring(6, 8), 16) / 255;
		if (debug && debug_math)
			console.log("%c[Math] hexToRgba result:", "color: #a855f7", [r, g, b, a]);
		return [r, g, b, a];
	}
	if (debug && debug_math)
		console.warn("%c[Math] hexToRgba failed to parse:", "color: #ef4444", hex);
	return null;
};

const getLum = (r, g, b) => {
	if (debug && debug_math)
		console.log(
			"%c[Math] getLum input:",
			"color: #a855f7",
			"R:",
			r,
			"G:",
			g,
			"B:",
			b
		);
	const a = [r, g, b].map((v) => {
		v /= 255;
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
	});
	const res = a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
	if (debug && debug_math)
		console.log("%c[Math] getLum result:", "color: #a855f7", res);
	return res;
};

const getContrast = (rgb1, rgb2) => {
	if (debug && debug_math)
		console.log(
			"%c[Math] getContrast input:",
			"color: #a855f7",
			rgb1,
			"vs",
			rgb2
		);
	const l1 = getLum(...rgb1) + 0.05;
	const l2 = getLum(...rgb2) + 0.05;
	const res = Math.max(l1, l2) / Math.min(l1, l2);
	if (debug && debug_math)
		console.log("%c[Math] getContrast result:", "color: #a855f7", res);
	return res;
};

function getFormattedColor(h, s, l, a, fmt) {
	if (debug && debug_math)
		console.log(
			"%c[Format] getFormattedColor:",
			"color: #a855f7",
			"H:",
			h,
			"S:",
			s,
			"L:",
			l,
			"A:",
			a,
			"Format:",
			fmt
		);
	const rgb = hslToRgb(h, s, l);
	if (fmt === "hex") return rgbToHex(rgb[0], rgb[1], rgb[2], a).toUpperCase();
	if (fmt === "rgb") return `rgb(${rgb.join(", ")})`;
	if (fmt === "rgba")
		return `rgba(${rgb.join(", ")}, ${parseFloat(a.toFixed(2))})`;
	if (fmt === "hsl")
		return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
	if (fmt === "hsla")
		return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(
			l
		)}%, ${parseFloat(a.toFixed(2))})`;
	if (fmt === "hsv") {
		const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
		return `hsv(${Math.round(hsv[0])}, ${Math.round(hsv[1])}%, ${Math.round(
			hsv[2]
		)}%)`;
	}
	return rgbToHex(rgb[0], rgb[1], rgb[2], a);
}

function parseAnyColor(str) {
	if (debug)
		console.log(
			"%c[Parser] Parsing any color string input:",
			"color: #a855f7",
			str
		);
	str = str.trim().toLowerCase();
	if (str.startsWith("#") || /^[0-9a-f]{6}([0-9a-f]{2})?$/.test(str)) {
		if (!str.startsWith("#")) str = "#" + str;
		const res = hexToRgba(str);
		if (debug)
			console.log("%c[Parser] Hex detected. Result:", "color: #a855f7", res);
		return res;
	}
	if (str.startsWith("rgb")) {
		const m = str.match(/[\d.]+/g);
		if (m && m.length >= 3) {
			const res = [
				parseInt(m[0]),
				parseInt(m[1]),
				parseInt(m[2]),
				m[3] ? parseFloat(m[3]) : 1
			];
			if (debug)
				console.log("%c[Parser] RGB detected. Result:", "color: #a855f7", res);
			return res;
		}
	}
	const ctx = document.getElementById("canvasParams").getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillStyle = str;
	if (ctx.fillStyle !== "#000000" || str === "black") {
		const res = hexToRgba(ctx.fillStyle);
		if (debug)
			console.log(
				"%c[Parser] HTML named color mapped via Canvas context. Context fillStyle:",
				"color: #a855f7",
				ctx.fillStyle,
				"Result:",
				res
			);
		return res;
	}
	if (debug)
		console.warn(
			"%c[Parser] Could not parse color input:",
			"color: #ef4444",
			str
		);
	return null;
}

const els = {
	hero: document.getElementById("heroCard"),
	code: document.getElementById("heroCode"),
	sl: document.getElementById("slBox"),
	layer: document.getElementById("pickerLayer"),
	cursor: document.getElementById("pickerCursor"),
	hue: document.getElementById("hueSlider"),
	alpha: document.getElementById("alphaSlider"),
	inputs: document.getElementById("inputWrapper"),
	rpg: document.getElementById("rpgName"),
	fmt: document.getElementById("formatSelect")
};

function updateUI(source) {
	if (debug && source !== "box")
		console.log(
			"%c[UI] Executing updateUI. Trigger source:",
			"color: #3b82f6",
			source,
			"Global State:",
			"H:",
			State.h,
			"S:",
			State.s,
			"L:",
			State.l,
			"A:",
			State.a
		);
	const rgb = hslToRgb(State.h, State.s, State.l);
	const cssColor = `hsla(${State.h}, ${State.s}%, ${State.l}%, ${State.a})`;
	const cssOpaque = `hsl(${State.h}, ${State.s}%, ${State.l}%)`;
	const cssFull = `hsl(${State.h}, 100%, 50%)`;

	const reducedSaturation = State.s * 0.75;

	const accentHsl = `hsl(${State.h}, ${reducedSaturation}%, ${Math.max(
		50,
		Math.min(90, State.l)
	)}%)`;
	const glowColor = `hsla(${State.h}, ${reducedSaturation}%, 50%, 0.6)`;

	document.documentElement.style.setProperty("--c-accent", accentHsl);
	document.documentElement.style.setProperty("--c-accent-glow", glowColor);

	els.hero.style.backgroundColor = cssColor;
	const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
	els.hero.style.color = lum / 255 > 0.5 && State.a > 0.4 ? "black" : "white";
	els.code.innerText = getFormattedColor(
		State.h,
		State.s,
		State.l,
		State.a,
		State.format
	);
	els.layer.style.backgroundColor = cssFull;
	if (source !== "box") {
		const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
		els.cursor.style.left = `${hsv[1]}%`;
		els.cursor.style.top = `${100 - hsv[2]}%`;
	}
	if (source !== "sliders") {
		els.hue.value = State.h;
		els.alpha.value = State.a * 100;
	}
	els.alpha.style.background = `linear-gradient(to right, transparent, ${cssOpaque}), var(--checkerboard)`;
	els.alpha.style.backgroundSize = "100% 100%, 10px 10px";
	if (source !== "input") updateInputValues(rgb);
	renderTabs(rgb, cssColor);
}

function renderInputs() {
	if (debug)
		console.log(
			"%c[Render] Rendering dynamic inputs for format:",
			"color: #10b981",
			els.fmt.value
		);
	State.format = els.fmt.value;
	let h = "";
	const commonInput = (id, label) =>
		`<div class="input-col"><label class="label-tiny">${label}</label><input type="number" class="val-input" id="${id}" onchange="inpChange('${State.format}')"></div>`;
	if (State.format === "hex") {
		h = `<div class="input-col"><label class="label-tiny">HEX</label><input type="text" class="val-input" id="inpHex" onchange="inpChange('hex')"></div>`;
	} else if (State.format.includes("rgb")) {
		h = `<div class="input-row">${commonInput("inpR", "R")}${commonInput(
			"inpG",
			"G"
		)}${commonInput("inpB", "B")}
                      ${
																							State.format === "rgba"
																								? `<div class="input-col"><label class="label-tiny">A</label><input type="number" step="0.01" max="1" class="val-input" id="inpA" onchange="inpChange('rgba')"></div>`
																								: ""
																						}</div>`;
	} else if (State.format.includes("hsl")) {
		h = `<div class="input-row">${commonInput("inpH", "H")}${commonInput(
			"inpS",
			"S%"
		)}${commonInput("inpL", "L%")}
                      ${
																							State.format === "hsla"
																								? `<div class="input-col"><label class="label-tiny">A</label><input type="number" step="0.01" max="1" class="val-input" id="inpA" onchange="inpChange('hsla')"></div>`
																								: ""
																						}</div>`;
	} else if (State.format === "hsv") {
		h = `<div class="input-row"><div class="input-col"><label class="label-tiny">H</label><input disabled class="val-input" id="inpHsvH"></div><div class="input-col"><label class="label-tiny">S%</label><input disabled class="val-input" id="inpHsvS"></div><div class="input-col"><label class="label-tiny">V%</label><input disabled class="val-input" id="inpHsvV"></div></div>`;
	}
	els.inputs.innerHTML = h;
	updateUI("render");
}

function updateInputValues(rgb) {
	if (debug && debug_math)
		console.log(
			"%c[UI] Synchronizing DOM inputs with active RGB array:",
			"color: #3b82f6",
			rgb,
			"Format:",
			State.format
		);
	if (State.format === "hex") {
		document.getElementById("inpHex").value = rgbToHex(
			rgb[0],
			rgb[1],
			rgb[2],
			State.a
		).toUpperCase();
	} else if (State.format.includes("rgb")) {
		document.getElementById("inpR").value = rgb[0];
		document.getElementById("inpG").value = rgb[1];
		document.getElementById("inpB").value = rgb[2];
		if (State.format === "rgba")
			document.getElementById("inpA").value = parseFloat(State.a.toFixed(2));
	} else if (State.format.includes("hsl")) {
		document.getElementById("inpH").value = Math.round(State.h);
		document.getElementById("inpS").value = Math.round(State.s);
		document.getElementById("inpL").value = Math.round(State.l);
		if (State.format === "hsla")
			document.getElementById("inpA").value = parseFloat(State.a.toFixed(2));
	} else if (State.format === "hsv") {
		const hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
		document.getElementById("inpHsvH").value = Math.round(hsv[0]);
		document.getElementById("inpHsvS").value = Math.round(hsv[1]);
		document.getElementById("inpHsvV").value = Math.round(hsv[2]);
	}
}

function inpChange(mode) {
	if (debug)
		console.log(
			`%c[Action] Manual value input received in format mode:`,
			"color: #3b82f6",
			mode
		);
	if (mode === "hex") {
		const rgba = hexToRgba(document.getElementById("inpHex").value);
		if (rgba) {
			const h = rgbToHsl(rgba[0], rgba[1], rgba[2]);
			State.h = h[0];
			State.s = h[1];
			State.l = h[2];
			State.a = rgba[3];
			if (debug)
				console.log(
					"%c[Action] Updated state from HEX input:",
					"color: #3b82f6",
					"H:",
					h[0],
					"S:",
					h[1],
					"L:",
					h[2]
				);
		}
	} else if (mode.includes("rgb")) {
		const r = parseInt(document.getElementById("inpR").value),
			g = parseInt(document.getElementById("inpG").value),
			b = parseInt(document.getElementById("inpB").value);
		const h = rgbToHsl(r, g, b);
		State.h = h[0];
		State.s = h[1];
		State.l = h[2];
		if (mode === "rgba")
			State.a = parseFloat(document.getElementById("inpA").value);
		if (debug)
			console.log(
				"%c[Action] Updated state from RGB input:",
				"color: #3b82f6",
				"H:",
				h[0],
				"S:",
				h[1],
				"L:",
				h[2],
				"A:",
				State.a
			);
	} else if (mode.includes("hsl")) {
		State.h = parseInt(document.getElementById("inpH").value);
		State.s = parseInt(document.getElementById("inpS").value);
		State.l = parseInt(document.getElementById("inpL").value);
		if (mode === "hsla")
			State.a = parseFloat(document.getElementById("inpA").value);
		if (debug)
			console.log(
				"%c[Action] Updated state from HSL input:",
				"color: #3b82f6",
				"H:",
				State.h,
				"S:",
				State.s,
				"L:",
				State.l,
				"A:",
				State.a
			);
	}
	updateUI("input");
	trackGeneration();
}

function handleMagicInput() {
	const v = document.getElementById("magicInput").value;
	if (debug)
		console.log("%c[Action] Magic Input execution string:", "color: #3b82f6", v);
	const rgba = parseAnyColor(v);
	if (rgba) {
		const h = rgbToHsl(rgba[0], rgba[1], rgba[2]);
		State.h = h[0];
		State.s = h[1];
		State.l = h[2];
		State.a = rgba[3];
		if (debug)
			console.log(
				"%c[Action] Magic Input successfully set state to:",
				"color: #3b82f6",
				"H:",
				h[0],
				"S:",
				h[1],
				"L:",
				h[2]
			);
		updateUI("input");
		trackGeneration();
	} else {
		if (debug)
			console.warn(
				"%c[Action] Magic Input yielded no valid color mapping for:",
				"color: #f59e0b",
				v
			);
	}
}

function switchTab(id) {
	if (debug)
		console.log(`%c[Navigation] Executing tab switch to:`, "color: #3b82f6", id);
	document
		.querySelectorAll(".tab-btn")
		.forEach((b) => b.classList.remove("active"));
	event.target.classList.add("active");
	document
		.querySelectorAll(".view-section")
		.forEach((c) => c.classList.remove("active"));
	document.getElementById("view-" + id).classList.add("active");
	const rgb = hslToRgb(State.h, State.s, State.l);
	const css = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${State.a})`;
	renderTabs(rgb, css);
}

function renderTabs(rgb, css) {
	const active = document.querySelector(".view-section.active").id;
	if (debug && debug_math)
		console.log(
			"%c[Render] Delegating sub-render based on active tab ID:",
			"color: #10b981",
			active
		);
	if (active === "view-palette") renderPalette();
	if (active === "view-harmony") renderHarmony();
	if (active === "view-scale") renderScale();
	if (active === "view-legibility") renderLegibility(rgb, css);
	if (active === "view-history") renderHistory();
}

function renderLegibility(rgb, css) {
	const conW = getContrast(rgb, [255, 255, 255]);
	const conB = getContrast(rgb, [0, 0, 0]);

	if (debug)
		console.log(
			"%c[Render] Refreshing Legibility matrix. Live metrics:",
			"color: #10b981",
			"Contrast vs White:",
			conW.toFixed(2),
			"Contrast vs Black:",
			conB.toFixed(2)
		);

	document.getElementById("scoreWhite").innerText = conW.toFixed(2);
	updateBadge("badgeWhite", conW);
	document.getElementById("sampleWhite").style.backgroundColor = css;
	document.getElementById("sampleWhite").style.color = "white";

	document.getElementById("scoreBlack").innerText = conB.toFixed(2);
	updateBadge("badgeBlack", conB);
	document.getElementById("sampleBlack").style.backgroundColor = css;
	document.getElementById("sampleBlack").style.color = "black";

	updateBadge("badgeOnWhite", conW);
	document.getElementById("sampleOnWhite").style.color = css;
	updateBadge("badgeOnBlack", conB);
	document.getElementById("sampleOnBlack").style.color = css;
}

function updateBadge(id, score) {
	const el = document.getElementById(id);
	let rating = "";
	if (score >= 7) {
		el.innerText = "Crit Success";
		el.className = "badge pass";
		rating = "Perfect";
	} else if (score >= 4.5) {
		el.innerText = "Success";
		el.className = "badge pass";
		rating = "Good";
	} else {
		el.innerText = "Crit Fail";
		el.className = "badge fail";
		rating = "Poor";
	}
	if (debug && debug_math)
		console.log(
			"%c[UI] Computed accessibility badge DOM sync for",
			"color: #3b82f6",
			id,
			"Assigned Rating:",
			rating
		);
}

function renderHarmony() {
	if (debug)
		console.log(
			"%c[Render] Generating Harmony permutations for base state:",
			"color: #10b981",
			"H:",
			State.h
		);
	const g = document.getElementById("harmonyGrid");
	g.innerHTML = "";
	[0, 180, 30, -30, 120, 240].forEach((d, i) =>
		makeCard(
			{
				h: (State.h + d + 360) % 360,
				s: State.s,
				l: State.l,
				a: 1,
				fmt: State.format
			},
			g,
			i * 0.05
		)
	);
}

function renderScale() {
	if (debug)
		console.log(
			"%c[Render] Synthesizing lightness step scales",
			"color: #10b981"
		);
	const g = document.getElementById("scaleGrid");
	g.innerHTML = "";
	for (let i = 1; i < 10; i++) {
		let l = i < 5 ? 98 - i * 10 : 100 - i * 10;
		makeCard(
			{
				h: State.h,
				s: State.s,
				l: Math.max(5, Math.min(95, l)),
				a: 1,
				fmt: State.format
			},
			g,
			i * 0.05
		);
	}
}

function setMix(p) {
	if (debug)
		console.log(
			`%c[Mixer] Binding memory pointer to mix slot:`,
			"color: #a855f7",
			p,
			"Captured Data:",
			State.h,
			State.s,
			State.l
		);
	State.mix[p] = {
		h: State.h,
		s: State.s,
		l: State.l,
		a: State.a
	};
	const rgb = hslToRgb(State.h, State.s, State.l);
	const el = document.getElementById(
		p === "start" ? "mixStartFill" : "mixEndFill"
	);
	el.style.backgroundColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${State.a})`;
	const slot = document.getElementById(p === "start" ? "slotStart" : "slotEnd");
	slot.classList.remove("updated");
	void slot.offsetWidth;
	slot.classList.add("updated");
}

function generateMix() {
	if (debug)
		console.log(
			"%c[Mixer] Interpolating steps between start/end matrices:",
			"color: #a855f7",
			"Start:",
			State.mix.start,
			"End:",
			State.mix.end
		);
	const g = document.getElementById("mixGrid");
	g.innerHTML = "";
	for (let i = 0; i <= 6; i++) {
		let t = i / 6;
		let h = State.mix.start.h + (State.mix.end.h - State.mix.start.h) * t;
		let s = State.mix.start.s + (State.mix.end.s - State.mix.start.s) * t;
		let l = State.mix.start.l + (State.mix.end.l - State.mix.start.l) * t;
		let a = State.mix.start.a + (State.mix.end.a - State.mix.start.a) * t;
		makeCard(
			{
				h,
				s,
				l,
				a,
				fmt: State.format
			},
			g,
			i * 0.05
		);
	}
}

let drag = false;
els.sl.addEventListener("mousedown", (e) => {
	drag = true;
	mv(e);
});
els.sl.addEventListener(
	"touchstart",
	(e) => {
		drag = true;
		mv(e.touches[0]);
		e.preventDefault();
	},
	{
		passive: false
	}
);
window.addEventListener("mousemove", (e) => {
	if (drag) mv(e);
});
window.addEventListener(
	"touchmove",
	(e) => {
		if (drag) mv(e.touches[0]);
	},
	{
		passive: false
	}
);
window.addEventListener("mouseup", () => {
	if (drag) {
		drag = false;
		trackGeneration();
	} else {
		drag = false;
	}
});
window.addEventListener("touchend", () => {
	if (drag) {
		drag = false;
		trackGeneration();
	} else {
		drag = false;
	}
});

function mv(e) {
	const r = els.sl.getBoundingClientRect();
	let x = Math.max(0, Math.min(e.clientX - r.left, r.width));
	let y = Math.max(0, Math.min(e.clientY - r.top, r.height));

	els.cursor.style.left = (x / r.width) * 100 + "%";
	els.cursor.style.top = (y / r.height) * 100 + "%";

	const sHsv = x / r.width;
	const vHsv = 1 - y / r.height;

	const l = vHsv * (1 - sHsv / 2);
	let s = 0;
	if (l > 0 && l < 1) {
		s = (vHsv - l) / Math.min(l, 1 - l);
	}

	State.s = s * 100;
	State.l = l * 100;

	if (debug && debug_math)
		console.log(
			"%c[Interaction] 2D XY Coordinate translation output:",
			"color: #3b82f6",
			"S% =",
			State.s,
			"L% =",
			State.l
		);

	updateUI("box");
}
els.hue.addEventListener("input", (e) => {
	State.h = parseInt(e.target.value);
	if (debug && debug_math)
		console.log(
			"%c[Interaction] 1D Hue slider rotation detected:",
			"color: #3b82f6",
			State.h
		);
	updateUI("sliders");
});
els.hue.addEventListener("change", () => {
	trackGeneration();
});
els.alpha.addEventListener("input", (e) => {
	State.a = parseInt(e.target.value) / 100;
	if (debug && debug_math)
		console.log(
			"%c[Interaction] Alpha threshold manipulation detected:",
			"color: #3b82f6",
			State.a
		);
	updateUI("sliders");
});
els.alpha.addEventListener("change", () => {
	trackGeneration();
});
function copyHero() {
	const txt = getFormattedColor(
		State.h,
		State.s,
		State.l,
		State.a,
		State.format
	);
	if (debug)
		console.log(
			"%c[Action] Requesting native clipboard insertion for payload string:",
			"color: #3b82f6",
			txt
		);
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(txt).then(
			() => showToast(`Rune Scribed: ${txt}`),
			() => execCopy(txt)
		);
	} else {
		execCopy(txt);
	}
}

function execCopy(txt) {
	if (debug)
		console.warn(
			"%c[Action] Primary API disabled, dropping back to document.execCommand('copy')",
			"color: #f59e0b",
			txt
		);
	const t = document.createElement("textarea");
	t.value = txt;
	document.body.appendChild(t);
	t.select();
	document.execCommand("copy");
	document.body.removeChild(t);
	showToast(`Rune Scribed: ${txt}`);
}

function showToast(m) {
	if (debug)
		console.log(
			"%c[UI] Toast notification pushed to screen:",
			"color: #3b82f6",
			m
		);
	const t = document.getElementById("toast");
	t.innerText = m;
	t.classList.add("show");
	setTimeout(() => t.classList.remove("show"), app_config.toast_duration_ms);
}

loadState();
renderInputs();
updateUI();