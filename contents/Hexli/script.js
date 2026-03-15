class Color {
	constructor(r, g, b) {
		this.set(r, g, b);
	}

	toString() {
		return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(
			this.b
		)})`;
	}

	set(r, g, b) {
		this.r = this.clamp(r);
		this.g = this.clamp(g);
		this.b = this.clamp(b);
	}

	hueRotate(angle = 0) {
		angle = (angle / 180) * Math.PI;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);

		this.multiply([
			0.213 + cos * 0.787 - sin * 0.213,
			0.715 - cos * 0.715 - sin * 0.715,
			0.072 - cos * 0.072 + sin * 0.928,
			0.213 - cos * 0.213 + sin * 0.143,
			0.715 + cos * 0.285 + sin * 0.14,
			0.072 - cos * 0.072 - sin * 0.283,
			0.213 - cos * 0.213 - sin * 0.787,
			0.715 - cos * 0.715 + sin * 0.715,
			0.072 + cos * 0.928 + sin * 0.072
		]);
	}

	grayscale(value = 1) {
		this.multiply([
			0.2126 + 0.7874 * (1 - value),
			0.7152 - 0.7152 * (1 - value),
			0.0722 - 0.0722 * (1 - value),
			0.2126 - 0.2126 * (1 - value),
			0.7152 + 0.2848 * (1 - value),
			0.0722 - 0.0722 * (1 - value),
			0.2126 - 0.2126 * (1 - value),
			0.7152 - 0.7152 * (1 - value),
			0.0722 + 0.9278 * (1 - value)
		]);
	}

	sepia(value = 1) {
		this.multiply([
			0.393 + 0.607 * (1 - value),
			0.769 - 0.769 * (1 - value),
			0.189 - 0.189 * (1 - value),
			0.349 - 0.349 * (1 - value),
			0.686 + 0.314 * (1 - value),
			0.168 - 0.168 * (1 - value),
			0.272 - 0.272 * (1 - value),
			0.534 - 0.534 * (1 - value),
			0.131 + 0.869 * (1 - value)
		]);
	}

	saturate(value = 1) {
		this.multiply([
			0.213 + 0.787 * value,
			0.715 - 0.715 * value,
			0.072 - 0.072 * value,
			0.213 - 0.213 * value,
			0.715 + 0.285 * value,
			0.072 - 0.072 * value,
			0.213 - 0.213 * value,
			0.715 - 0.715 * value,
			0.072 + 0.928 * value
		]);
	}

	multiply(matrix) {
		const newR = this.clamp(
			this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]
		);
		const newG = this.clamp(
			this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]
		);
		const newB = this.clamp(
			this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]
		);
		this.r = newR;
		this.g = newG;
		this.b = newB;
	}

	brightness(value = 1) {
		this.linear(value);
	}
	contrast(value = 1) {
		this.linear(value, -(0.5 * value) + 0.5);
	}

	linear(slope = 1, intercept = 0) {
		this.r = this.clamp(this.r * slope + intercept * 255);
		this.g = this.clamp(this.g * slope + intercept * 255);
		this.b = this.clamp(this.b * slope + intercept * 255);
	}

	invert(value = 1) {
		this.r = this.clamp((value + (this.r / 255) * (1 - 2 * value)) * 255);
		this.g = this.clamp((value + (this.g / 255) * (1 - 2 * value)) * 255);
		this.b = this.clamp((value + (this.b / 255) * (1 - 2 * value)) * 255);
	}

	hsl() {
		const r = this.r / 255;
		const g = this.g / 255;
		const b = this.b / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h,
			s,
			l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
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

		return {
			h: h * 100,
			s: s * 100,
			l: l * 100
		};
	}

	clamp(value) {
		if (value > 255) {
			value = 255;
		} else if (value < 0) {
			value = 0;
		}
		return value;
	}
}

class Solver {
	constructor(target) {
		this.target = target;
		this.targetHSL = target.hsl();
		this.reusedColor = new Color(0, 0, 0);
	}

	solve() {
		const result = this.solveNarrow(this.solveWide());
		return {
			values: result.values,
			loss: result.loss,
			filter: this.css(result.values)
		};
	}

	solveWide() {
		const A = 5;
		const c = 15;
		const a = [60, 180, 18000, 600, 1.2, 1.2];

		let best = { loss: Infinity };
		for (let i = 0; best.loss > 25 && i < 3; i++) {
			const initial = [50, 20, 3750, 50, 100, 100];
			const result = this.spsa(A, a, c, initial, 1000);
			if (result.loss < best.loss) {
				best = result;
			}
		}
		return best;
	}

	solveNarrow(wide) {
		const A = wide.loss;
		const c = 2;
		const A1 = A + 1;
		const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
		return this.spsa(A, a, c, wide.values, 500);
	}

	spsa(A, a, c, values, iters) {
		const alpha = 1;
		const gamma = 0.16666666666666666;

		let best = null;
		let bestLoss = Infinity;
		const deltas = new Array(6);
		const highArgs = new Array(6);
		const lowArgs = new Array(6);

		for (let k = 0; k < iters; k++) {
			const ck = c / Math.pow(k + 1, gamma);
			for (let i = 0; i < 6; i++) {
				deltas[i] = Math.random() > 0.5 ? 1 : -1;
				highArgs[i] = values[i] + ck * deltas[i];
				lowArgs[i] = values[i] - ck * deltas[i];
			}

			const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
			for (let i = 0; i < 6; i++) {
				const g = (lossDiff / (2 * ck)) * deltas[i];
				const ak = a[i] / Math.pow(A + k + 1, alpha);
				values[i] = fix(values[i] - ak * g, i);
			}

			const loss = this.loss(values);
			if (loss < bestLoss) {
				best = values.slice(0);
				bestLoss = loss;
			}
		}
		return { values: best, loss: bestLoss };

		function fix(value, idx) {
			let max = 100;
			if (idx === 2) {
				max = 7500;
			} else if (idx === 4 || idx === 5) {
				max = 200;
			}

			if (idx === 3) {
				if (value > max) {
					value %= max;
				} else if (value < 0) {
					value = max + (value % max);
				}
			} else if (value < 0) {
				value = 0;
			} else if (value > max) {
				value = max;
			}
			return value;
		}
	}

	loss(filters) {
		const color = this.reusedColor;
		color.set(0, 0, 0);

		color.invert(filters[0] / 100);
		color.sepia(filters[1] / 100);
		color.saturate(filters[2] / 100);
		color.hueRotate(filters[3] * 3.6);
		color.brightness(filters[4] / 100);
		color.contrast(filters[5] / 100);

		const colorHSL = color.hsl();
		return (
			Math.abs(color.r - this.target.r) +
			Math.abs(color.g - this.target.g) +
			Math.abs(color.b - this.target.b) +
			Math.abs(colorHSL.h - this.targetHSL.h) +
			Math.abs(colorHSL.s - this.targetHSL.s) +
			Math.abs(colorHSL.l - this.targetHSL.l)
		);
	}

	css(filters) {
		function fmt(idx, multiplier = 1) {
			return Math.round(filters[idx] * multiplier);
		}
		return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(
			2
		)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(
			5
		)}%);`;
	}
}

function hexToRgb(hex) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, r, g, b) => {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result) {
		return [
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16)
		];
	} else {
		return null;
	}
}

const hexInput = document.getElementById("hex-input");
const colorPicker = document.getElementById("color-picker");
const colorSwatch = document.getElementById("color-swatch");
const hexDisplay = document.getElementById("hex");
const targetPixel = document.getElementById("target-pixel");
const filterPixel = document.getElementById("filter-pixel");
const filterCode = document.getElementById("filter");
const lossDisplay = document.getElementById("loss");
const rerunButton = document.getElementById("rerun");
const suggestionOutput = document.getElementById("suggestion-output");
const navLinks = document.querySelectorAll("#tabs-nav a");
const tabPanes = document.querySelectorAll("#tabs > div");

function getSuggestions(hex) {
	const hexVal = parseInt(hex.slice(1), 16);
	const s1 =
		"#" +
		((hexVal + 0x333333) & 0xffffff).toString(16).padStart(6, "0").toUpperCase();
	const s2 =
		"#" +
		((hexVal - 0x333333 + 0xffffff) & 0xffffff)
			.toString(16)
			.padStart(6, "0")
			.toUpperCase();
	const s3 =
		"#" + (hexVal ^ 0xffffff).toString(16).padStart(6, "0").toUpperCase();
	return [s1, s2, s3, "#FF5733", "#33FF57"];
}

function renderSuggestions(suggestions) {
	suggestionOutput.innerHTML = "";
	if (suggestions.length === 0) {
		suggestionOutput.textContent =
			"No suggestions yet - pick a color to get started!";
		return;
	}

	suggestions.forEach((hex) => {
		const item = document.createElement("div");
		item.className = "swatch-item";
		item.style.backgroundColor = hex;
		item.title = hex;
		item.addEventListener("click", () => updateColor(hex));
		suggestionOutput.appendChild(item);
	});
}

function updateColor(hex) {
	hex = hex.toUpperCase().trim().startsWith("#") ? hex : "#" + hex;

	const rgb = hexToRgb(hex);

	if (!rgb) {
		hexDisplay.textContent = "INVALID";
		filterCode.textContent =
			"filter: Error calculating filter. Invalid HEX code.";
		lossDisplay.innerHTML = "Closeness: N/A - Invalid input.";
		return;
	}

	const [r, g, b] = rgb;
	const color = new Color(r, g, b);

	document.documentElement.style.setProperty("--color-primary", hex);

	hexInput.value = hex;
	colorPicker.value = hex;
	hexDisplay.textContent = hex;
	colorSwatch.style.backgroundColor = hex;
	targetPixel.style.backgroundColor = color.toString();

	const solver = new Solver(color);
	const result = solver.solve();

	const filterCss = result.filter;
	filterCode.textContent = filterCss;

	filterPixel.style.filter = filterCss.replace("filter: ", "").replace(";", "");

	let lossMsg, lossColor;
	if (result.loss < 1) {
		lossMsg = "perfect match!";
		lossColor = hex;
	} else if (result.loss < 5) {
		lossMsg = "excellent approximation!";
		lossColor = "#FFD700";
	} else if (result.loss < 15) {
		lossMsg = "good match.";
		lossColor = "#FFA07A";
	} else {
		lossMsg = "The color is significantly off.";
		lossColor = "#FF6347";
	}

	lossDisplay.innerHTML = `Closeness: <strong style="color: ${lossColor};">${result.loss.toFixed(
		1
	)}</strong> – ${lossMsg}`;

	renderSuggestions(getSuggestions(hex));
}

function showTab(targetId) {
	tabPanes.forEach((pane) => {
		pane.style.display = pane.id === targetId.substring(1) ? "block" : "none";
	});

	navLinks.forEach((link) => {
		link.classList.remove("active");
		if (link.getAttribute("href") === targetId) {
			link.classList.add("active");
		}
	});
}

window.onload = () => {
	const animatedBg = document.getElementById("animated-background");
	const randomSeed = Math.floor(Math.random() * 1000);
	animatedBg.style.backgroundImage = `url('https://picsum.photos/seed/${randomSeed}/1600/900?grayscale&blur=3')`;

	updateColor(hexInput.value);
	showTab("#results");
};

navLinks.forEach((link) => {
	link.addEventListener("click", (e) => {
		e.preventDefault();
		const targetId = e.target.getAttribute("href");
		showTab(targetId);
	});
});

hexInput.addEventListener("change", (e) => updateColor(e.target.value));
hexInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") {
		e.preventDefault();
		updateColor(e.target.value);
	}
});

colorSwatch.addEventListener("click", () => {
	colorPicker.click();
});

colorPicker.addEventListener("input", (e) => {
	updateColor(e.target.value);
});

rerunButton.addEventListener("click", () => {
	updateColor(hexInput.value);
});

window.shareTwitter = function () {
	const hex = hexInput.value || "#427CFF";
	const filterCss = filterCode.textContent || "";
	const text = `I just used @Julibe's tool to get the CSS filter for color ${hex}! It's a lifesaver for designers and developers. Here is the code: ${filterCss.substring(
		0,
		60
	)}... #CSSFilters #FrontEndDev`;
	const url = "https://codepen.io/Julibe/full/YPyypzM";
	const hashtags = "CSSFilters,FrontEnd,WebDev,DesignTool,CodeTip";
	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		text
	)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
	window.open(twitterUrl, "_blank");
};
