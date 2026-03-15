const track = document.getElementById("track");
let isMuted = false;

const muteBtn = document.getElementById("muteBtn");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

muteBtn.addEventListener("click", () => {
	if (audioCtx.state === "suspended") {
		audioCtx.resume();
	}
	isMuted = !isMuted;
	muteBtn.innerText = isMuted ? "Sound: Off" : "Sound: On";
	if (!isMuted) playUI("open");
});

const slides = document.querySelectorAll(".slide");

slides.forEach((slide) => {
	slide.addEventListener("mouseenter", () => {
		const centerPos =
			slide.offsetLeft + slide.offsetWidth / 2 - window.innerWidth / 2;
		track.scrollTo({
			left: centerPos,
			behavior: "smooth"
		});
	});
});

track.addEventListener(
	"wheel",
	(e) => {
		if (e.deltaY !== 0) {
			e.preventDefault();
			track.scrollLeft += e.deltaY * 1.5;
		}
	},
	{ passive: false }
);

window.shareTwitter = function () {
	const text =
		"Just stepped into The Private Collector's gallery. 🗝️\n\nA digital sanctuary where time stands still. Absolute visual perfection.";
	const url = "https://codepen.io/Julibe/full/Gallery";
	const hashtags = "DigitalArt,Minimalism,WebDesign,Inspiration";
	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		text
	)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
	window.open(twitterUrl, "_blank");
};

function playSwish() {
	if (isMuted) return;
	if (audioCtx.state === "suspended") audioCtx.resume();

	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();
	const filter = audioCtx.createBiquadFilter();

	const bufferSize = audioCtx.sampleRate * 2;
	const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

	const noise = audioCtx.createBufferSource();
	noise.buffer = buffer;
	filter.type = "lowpass";
	filter.frequency.value = 150;

	noise.connect(filter);
	filter.connect(gain);
	gain.connect(audioCtx.destination);

	const now = audioCtx.currentTime;
	gain.gain.setValueAtTime(0, now);
	gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
	filter.frequency.linearRampToValueAtTime(400, now + 0.3);

	noise.start(now);
	noise.stop(now + 0.6);
}

function playUI(type) {
	if (isMuted) return;
	if (audioCtx.state === "suspended") audioCtx.resume();
	const now = audioCtx.currentTime;
	const osc = audioCtx.createOscillator();
	const gain = audioCtx.createGain();
	osc.connect(gain);
	gain.connect(audioCtx.destination);

	if (type === "open") {
		osc.type = "sine";
		osc.frequency.setValueAtTime(120, now);
		osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
		gain.gain.setValueAtTime(0.5, now);
		gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
		osc.start(now);
		osc.stop(now + 0.6);
	} else if (type === "close") {
		osc.type = "triangle";
		osc.frequency.setValueAtTime(300, now);
		osc.frequency.linearRampToValueAtTime(50, now + 0.1);
		gain.gain.setValueAtTime(0.3, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
		osc.start(now);
		osc.stop(now + 0.2);
	}
}

const cursor = document.getElementById("cursor");
let mouseX = 0,
	mouseY = 0,
	cursorX = 0,
	cursorY = 0;

document.addEventListener("mousemove", (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;
});

function animateCursor() {
	cursorX += (mouseX - cursorX) * 0.15;
	cursorY += (mouseY - cursorY) * 0.15;
	cursor.style.left = `${cursorX}px`;
	cursor.style.top = `${cursorY}px`;
	requestAnimationFrame(animateCursor);
}
animateCursor();

const artSlides = document.querySelectorAll(".art-slide");
const modal = document.getElementById("modal");
const mImg = document.getElementById("modalImg");
const mTitle = document.getElementById("modalTitle");
const mMeta = document.getElementById("modalMeta");
const mDesc = document.getElementById("modalDesc");
const closeBtn = document.getElementById("closeBtn");
const interactiveElements = document.querySelectorAll(
	"a, button, .slide.text-slide"
);

artSlides.forEach((slide) => {
	slide.addEventListener("mouseenter", () => {
		playSwish();
		cursor.classList.add("expand");
		cursor.classList.add("on-dark");
	});

	slide.addEventListener("mouseleave", () => {
		cursor.classList.remove("expand");
		cursor.classList.remove("on-dark");
	});

	slide.addEventListener("click", () => {
		playUI("open");
		mImg.src = slide.dataset.img;
		mTitle.innerHTML = slide.dataset.title;
		mMeta.innerText = slide.dataset.meta;
		mDesc.innerText = slide.dataset.desc;
		modal.classList.add("active");
		cursor.classList.add("on-dark");
	});
});

interactiveElements.forEach((el) => {
	el.addEventListener("mouseenter", () => cursor.classList.add("expand"));
	el.addEventListener("mouseleave", () => cursor.classList.remove("expand"));
});

closeBtn.addEventListener("click", () => {
	playUI("close");
	modal.classList.remove("active");
	cursor.classList.remove("on-dark");
});

closeBtn.addEventListener("mouseenter", () => cursor.classList.add("expand"));
closeBtn.addEventListener("mouseleave", () =>
	cursor.classList.remove("expand")
);
