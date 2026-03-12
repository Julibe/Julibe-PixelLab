function getLabel(classList) {
	if (classList.contains("classified")) return "LEVEL 5 // CLASSIFIED";
	if (classList.contains("anomaly")) return "ANOMALY DETECTED";
	if (classList.contains("alien")) return ">> SIGNAL INTERCEPT <<";
	if (classList.contains("kioto")) return "COMMERCIAL SECTOR";
	if (classList.contains("paris")) return "FUTURE FORECAST";
	return "STANDARD LOG";
}

function dateChange(item) {
	document
		.querySelectorAll(".timeline li")
		.forEach((el) => el.classList.remove("selected"));
	item.classList.add("selected");

	item.scrollIntoView({
		behavior: "smooth",
		inline: "center",
		block: "nearest"
	});

	const rawYear = item.querySelector("h3")?.textContent;
	const contentHTML = item.querySelector("div")?.innerHTML;

	const card = document.querySelector("#current_date");
	const yearTarget = card.querySelector("h2");
	const bodyEl = card.querySelector("#content-body");
	const titleEl = card.querySelector(".content h3");
	const catEl = card.querySelector(".content h4");

	card.classList.remove(
		"ambient",
		"classified",
		"anomaly",
		"alien",
		"kioto",
		"paris"
	);
	item.classList.forEach((cls) => {
		if (cls !== "selected") card.classList.add(cls);
	});

	const labelText = getLabel(item.classList);

	// Logic to handle "INFO" text in the year counter
	let cleanYear = 0;
	if (rawYear === "INFO") {
		yearTarget.style.fontSize = "5rem"; // Adjust font size for text
		cleanYear = "INFO"; // Pass string to prevent counting
	} else {
		yearTarget.style.fontSize = ""; // Reset
		cleanYear = parseInt(rawYear.replace(/[^\d]/g, ""), 10);
	}

	// Animation Logic
	if (cleanYear === "INFO") {
		yearTarget.textContent = "INFO";
	} else {
		let currentVal = parseInt(yearTarget.textContent, 10) || 1947;
		// Prevent NaN if switching from INFO
		if (isNaN(currentVal)) currentVal = 2024;

		let proxy = { val: currentVal };

		gsap.to(proxy, {
			val: cleanYear,
			duration: 0.6,
			ease: "power4.out",
			onUpdate: function () {
				yearTarget.textContent = Math.round(proxy.val);
			}
		});
	}

	const tl = gsap.timeline();

	tl
		.to([catEl, titleEl, bodyEl], {
			y: 15,
			opacity: 0,
			duration: 0.1,
			stagger: 0.05,
			onComplete: () => {
				catEl.textContent = labelText;

				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = contentHTML;
				const extractedTitle = tempDiv.querySelector("b")?.textContent || "EVENT";

				titleEl.textContent = extractedTitle.toUpperCase();
				bodyEl.innerHTML = contentHTML;
			}
		})
		.to([catEl, titleEl, bodyEl], {
			y: 0,
			opacity: 1,
			duration: 0.3,
			stagger: 0.1,
			ease: "power2.out"
		});
}

window.addEventListener("load", () => {
	const items = document.querySelectorAll(".timeline li");
	items.forEach((item) => {
		item.addEventListener("click", () => dateChange(item));
	});
	if (items.length > 0) dateChange(items[0]);
});
