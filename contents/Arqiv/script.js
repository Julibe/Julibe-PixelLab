window.shareTwitter = function () {
	const text =
		"Check out this stunning split-screen slider concept! A perfect blend of typography and motion. 🎨✨";
	const url = "https://julibe/pen/visual-echoes";
	const hashtags =
		"webdesign,uiux,cssanimation,frontend,creativecoding,minimalism";
	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		text
	)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
	window.open(twitterUrl, "_blank");
};

document.addEventListener("DOMContentLoaded", () => {
	const navItems = document.querySelectorAll(".nav-item");
	const slides = document.querySelectorAll(".slide");
	let currentSlide = 0;
	const totalSlides = slides.length;
	let isAnimating = false;

	function gotoSlide(index) {
		if (index === currentSlide || isAnimating) return;
		isAnimating = true;
		navItems.forEach((item) => item.classList.remove("active"));
		navItems[index].classList.add("active");
		slides[currentSlide].classList.remove("active");
		slides[index].classList.add("active");
		currentSlide = index;
		setTimeout(() => {
			isAnimating = false;
		}, 1200);
	}

	navItems.forEach((item) => {
		item.addEventListener("click", function () {
			const index = parseInt(this.getAttribute("data-index"));
			gotoSlide(index);
		});
	});

	window.addEventListener("wheel", (e) => {
		if (isAnimating) return;
		if (document.querySelector(".info-overlay").classList.contains("open"))
			return;

		if (e.deltaY > 0) {
			let nextIndex = (currentSlide + 1) % totalSlides;
			gotoSlide(nextIndex);
		} else {
			let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
			gotoSlide(prevIndex);
		}
	});

	window.addEventListener("keydown", (e) => {
		if (isAnimating) return;
		if (document.querySelector(".info-overlay").classList.contains("open"))
			return;

		if (e.key === "ArrowDown" || e.key === "ArrowRight") {
			let nextIndex = (currentSlide + 1) % totalSlides;
			gotoSlide(nextIndex);
		} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
			let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
			gotoSlide(prevIndex);
		}
	});

	const menuBurger = document.querySelector(".menu-burger");
	const infoOverlay = document.querySelector("#infoOverlay");

	menuBurger.addEventListener("click", () => {
		menuBurger.classList.toggle("active");
		infoOverlay.classList.toggle("open");
	});
});
