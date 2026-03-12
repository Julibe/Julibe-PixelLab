(function () {
	"use strict";
	var BASE_URL =
		"https://res.cloudinary.com/dwrzfx0qg/image/upload/v1770687202/";
	var FILTERS = [
		"Glass",
		"Mirror-Distort",
		"Magnify",
		"Waves",
		"Vertical",
		"Horizontal",
		"Ripple"
	];
	var state = {
		cache: {},
		menuOpen: false
	};
	var mobileToggle, mobileMenu, fxToggle, bubbleMenu, textureRow;
	var refractSlider,
		refractVal,
		chromaSlider,
		chromaVal,
		blurSlider,
		blurVal,
		opacitySlider,
		opacityVal;
	var mapSource, redDisp, greenDisp, blueDisp, blurEffect;

	function get_texture_base64(filename) {
		if (state.cache[filename]) return Promise.resolve(state.cache[filename]);
		var url = BASE_URL + filename + ".webp";
		return new Promise(function (resolve, reject) {
			var img = new Image();
			img.crossOrigin = "Anonymous";
			img.src = url;
			img.onload = function () {
				var canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				var ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0);
				try {
					var data_uri = canvas.toDataURL("image/webp");
					state.cache[filename] = data_uri;
					resolve(data_uri);
				} catch (e) {
					reject(e);
				}
			};
			img.onerror = function () {
				reject(new Error("Failed to load " + filename));
			};
		});
	}
	var emojiMap = {
		Glass: "\u2728",
		"Mirror-Distort": "\u{1FA9E}",
		Magnify: "\u{1F50D}",
		Waves: "\u{1F30A}",
		Vertical: "\u{1F4CF}",
		Horizontal: "\u{1F4D0}",
		Ripple: "\u{1F4A7}"
	};

	function selectTexture(name, bubble) {
		document.querySelectorAll(".texture-bubble").forEach(function (b) {
			b.classList.remove("active");
		});
		bubble.classList.add("active");
		get_texture_base64(name)
			.then(function (base64) {
				if (mapSource) mapSource.setAttribute("href", base64);
			})
			.catch(function (err) {
				console.error("Texture load failed:", err);
			});
	}

	function populateTextures() {
		FILTERS.forEach(function (name) {
			var bubble = document.createElement("div");
			bubble.className = "texture-bubble";
			bubble.textContent = emojiMap[name] || "\u{1F52E}";
			bubble.setAttribute("role", "button");
			bubble.setAttribute("tabindex", "0");
			bubble.addEventListener("click", function () {
				selectTexture(name, bubble);
			});
			bubble.addEventListener("keydown", function (e) {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					selectTexture(name, bubble);
				}
			});
			if (textureRow) textureRow.appendChild(bubble);
		});
		if (textureRow && textureRow.firstChild) {
			textureRow.firstChild.classList.add("active");
			get_texture_base64(FILTERS[0]).then(function (base64) {
				if (mapSource) mapSource.setAttribute("href", base64);
			});
		}
	}

	function updateFilters() {
		var ref = parseFloat(refractSlider.value);
		var chroma = parseFloat(chromaSlider.value);
		var blur = parseFloat(blurSlider.value);
		var opacity = parseFloat(opacitySlider.value);
		if (redDisp) redDisp.setAttribute("scale", ref + chroma * 0.005);
		if (greenDisp) greenDisp.setAttribute("scale", ref);
		if (blueDisp) blueDisp.setAttribute("scale", ref - chroma * 0.005);
		if (blurEffect) blurEffect.setAttribute("stdDeviation", blur);
		document.documentElement.style.setProperty("--glass-opacity", opacity);
		if (refractVal) refractVal.textContent = ref.toFixed(2);
		if (chromaVal) chromaVal.textContent = chroma;
		if (blurVal) blurVal.textContent = blur.toFixed(5);
		if (opacityVal) opacityVal.textContent = opacity.toFixed(2);
	}

	function toggleMenu() {
		state.menuOpen = !state.menuOpen;
		if (bubbleMenu) bubbleMenu.classList.toggle("open", state.menuOpen);
		if (fxToggle) fxToggle.setAttribute("aria-expanded", state.menuOpen);
	}

	function handleDocumentClick(e) {
		if (state.menuOpen && fxToggle && bubbleMenu) {
			if (!bubbleMenu.contains(e.target) && !fxToggle.contains(e.target)) {
				state.menuOpen = false;
				bubbleMenu.classList.remove("open");
				fxToggle.setAttribute("aria-expanded", "false");
			}
		}
	}

	function toggleMobileMenu() {
		if (mobileMenu) mobileMenu.classList.toggle("open");
	}

	function initScrollReveal() {
		var reveals = document.querySelectorAll(".reveal");
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) entry.target.classList.add("active");
				});
			},
			{
				threshold: 0.1,
				rootMargin: "0px 0px -50px 0px"
			}
		);
		reveals.forEach(function (el) {
			observer.observe(el);
		});
	}

	function initCounters() {
		var statNumbers = document.querySelectorAll(".stat-number");
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting && !entry.target.dataset.animated) {
						entry.target.dataset.animated = "true";
						var target = parseInt(entry.target.dataset.count, 10);
						if (!isNaN(target)) animateCounter(entry.target, target);
					}
				});
			},
			{
				threshold: 0.5
			}
		);
		statNumbers.forEach(function (stat) {
			observer.observe(stat);
		});
	}

	function animateCounter(element, target) {
		var duration = 2000;
		var startTime = null;

		function update(currentTime) {
			if (!startTime) startTime = currentTime;
			var progress = Math.min((currentTime - startTime) / duration, 1);
			var easeOutQuart = 1 - Math.pow(1 - progress, 4);
			element.textContent = Math.floor(target * easeOutQuart).toLocaleString();
			if (progress < 1) requestAnimationFrame(update);
			else element.textContent = target.toLocaleString();
		}
		requestAnimationFrame(update);
	}

	function initSmoothScroll() {
		document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
			anchor.addEventListener("click", function (e) {
				var href = this.getAttribute("href");
				if (href && href !== "#") {
					var target = document.querySelector(href);
					if (target) {
						e.preventDefault();
						target.scrollIntoView({
							behavior: "smooth",
							block: "start"
						});
						if (mobileMenu) mobileMenu.classList.remove("open");
					}
				}
			});
		});
	}

	function initForm() {
		var form = document.getElementById("contactForm");
		if (form)
			form.addEventListener("submit", function (e) {
				e.preventDefault();
				var button = form.querySelector('button[type="submit"]');
				if (button) {
					var originalText = button.textContent;
					button.textContent = "Sending...";
					button.disabled = true;
					setTimeout(function () {
						button.textContent = "Quote Sent!";
						setTimeout(function () {
							button.textContent = originalText;
							button.disabled = false;
							form.reset();
						}, 2000);
					}, 1500);
				}
			});
	}

	function init() {
		mobileToggle = document.getElementById("mobileToggle");
		mobileMenu = document.getElementById("mobileMenu");
		fxToggle = document.getElementById("fxToggle");
		bubbleMenu = document.getElementById("bubbleMenu");
		textureRow = document.getElementById("textureRow");
		refractSlider = document.getElementById("refractSlider");
		refractVal = document.getElementById("refractVal");
		chromaSlider = document.getElementById("chromaSlider");
		chromaVal = document.getElementById("chromaVal");
		blurSlider = document.getElementById("blurSlider");
		blurVal = document.getElementById("blurVal");
		opacitySlider = document.getElementById("opacitySlider");
		opacityVal = document.getElementById("opacityVal");
		mapSource = document.getElementById("map_source");
		redDisp = document.getElementById("redDisp");
		greenDisp = document.getElementById("greenDisp");
		blueDisp = document.getElementById("blueDisp");
		blurEffect = document.getElementById("blurEffect");
		if (mobileToggle) mobileToggle.addEventListener("click", toggleMobileMenu);
		if (fxToggle)
			fxToggle.addEventListener("click", function (e) {
				e.stopPropagation();
				toggleMenu();
			});
		document.addEventListener("click", handleDocumentClick);
		if (refractSlider) refractSlider.addEventListener("input", updateFilters);
		if (chromaSlider) chromaSlider.addEventListener("input", updateFilters);
		if (blurSlider) blurSlider.addEventListener("input", updateFilters);
		if (opacitySlider) opacitySlider.addEventListener("input", updateFilters);
		populateTextures();
		updateFilters();
		initScrollReveal();
		initCounters();
		initSmoothScroll();
		initForm();
	}
	if (document.readyState === "loading")
		document.addEventListener("DOMContentLoaded", init);
	else init();
})();
