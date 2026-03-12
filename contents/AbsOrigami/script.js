let debug = true;
console.clear();

const app_config = {
	xp_per_level: 150,
	intro_delay: 2800,
	belts: [
		{
			name: "White",
			class: "status_white",
			min_lvl: 1
		},
		{
			name: "Yellow",
			class: "status_yellow",
			min_lvl: 2
		},
		{
			name: "Orange",
			class: "status_orange",
			min_lvl: 3
		},
		{
			name: "Green",
			class: "status_green",
			min_lvl: 4
		},
		{
			name: "Blue",
			class: "status_blue",
			min_lvl: 5
		},
		{
			name: "Purple",
			class: "status_purple",
			min_lvl: 6
		},
		{
			name: "Black",
			class: "status_black",
			min_lvl: 7
		}
	],
	level_titles: [
		"PAPER PILGRIM",
		"FOLD APPRENTICE",
		"CREASE MASTER",
		"ORIGAMI SAGE",
		"PAPER ARCHITECT",
		"ETERNAL FOLDER"
	],
	random_names: [
		"Sora",
		"Kaito",
		"Ren",
		"Hiro",
		"Yuki",
		"Akira",
		"Kenji",
		"Ryu",
		"Haru",
		"Takeo",
		"Sakura",
		"Hana",
		"Aoi",
		"Mei",
		"Yuna",
		"Rin",
		"Emi",
		"Nana",
		"Riku",
		"Kai"
	],
	random_suffixes: ["-Kun", "-Chan", "-San"]
};

let user_session = {
	xp: 0,
	level: 1,
	completed_ids: [1, 5],
	current_tab: "home",
	active_quest: null,
	active_step: 0,
	display_name: "User-San",
	session_seed: Date.now().toString(36)
};

let origami_db = [];

/* App Entry Point */
const initApp = () => {
	if (debug)
		console.log(
			"%c[System] ASBORIGAMI Universe launching...",
			"color: #D62828; font-weight: bold; font-size: 1.2rem;"
		);
	try {
		const base_name =
			app_config.random_names[
				Math.floor(Math.random() * app_config.random_names.length)
			];
		const suffix_val =
			app_config.random_suffixes[
				Math.floor(Math.random() * app_config.random_suffixes.length)
			];
		user_session.display_name = `${base_name}${suffix_val}`;

		if (debug)
			console.log(
				`%c[Session] Identity established: ${user_session.display_name}`,
				"color: #F7B733;"
			);

		generateDatabase();
		setupIntro();
		updateUserInterface();
		handleTabSwitch("home");
	} catch (error) {
		if (debug)
			console.error(
				"%c[Fatal] App launch failed:",
				"background: red; color: white; padding: 5px;",
				error
			);
		showToast("System Error", "Failed to prepare the bento.");
	}
};

/* Create Model Database */
const generateDatabase = () => {
	if (debug)
		console.log("%c[Data] Syncing origami database...", "color: #6D4C41;");
	try {
		const icons = [
			"fa-dove",
			"fa-paper-plane",
			"fa-frog",
			"fa-crow",
			"fa-fish",
			"fa-heart",
			"fa-star",
			"fa-dragon",
			"fa-cube",
			"fa-tree"
		];
		const titles = [
			"Classic Crane",
			"Speed Glider",
			"Leaping Frog",
			"Shadow Crow",
			"Koi Fish",
			"Heart of Gold",
			"Ninja Star",
			"Imperial Dragon",
			"Mystic Cube",
			"Ancient Pine"
		];

		for (let i = 1; i <= 40; i++) {
			let diff_val = i % 3 === 0 ? "Hard" : i % 3 === 1 ? "Easy" : "Medium";
			origami_db.push({
				id: i,
				title: titles[(i - 1) % 10] + (i > 10 ? ` Vol. ${Math.ceil(i / 10)}` : ""),
				difficulty: diff_val,
				icon: icons[(i - 1) % 10],
				steps: [
					"Prep a perfect square of ASBORIGAMI paper.",
					"Fold accurately along the diagonal.",
					"Crease firmly with precision.",
					"Unfold and collapse the base.",
					"Sculpt the finalized form."
				].slice(0, diff_val === "Easy" ? 3 : diff_val === "Medium" ? 4 : 5)
			});
		}
	} catch (error) {
		if (debug) console.error("[Data] DB Generation failed:", error);
	}
};

/* Brand Introduction */
const setupIntro = () => {
	if (debug) console.log("%c[UI] Executing intro sequence.", "color: #2196F3;");
	try {
		const overlay = document.getElementById("intro_screen");
		setTimeout(() => {
			overlay.classList.add("hidden");
			showToast(
				"Itadakimasu!",
				`Welcome to ASBORIGAMI, ${user_session.display_name}.`
			);
			gsap.from(".app_shell", {
				opacity: 0,
				scale: 0.95,
				y: 30,
				duration: 1.2,
				ease: "power3.out"
			});
		}, app_config.intro_delay);
	} catch (error) {
		if (debug) console.error("[UI] Intro sequence error:", error);
	}
};

/* Tab Navigation Logic */
const handleTabSwitch = (target_id) => {
	if (debug)
		console.log(
			`%c[Nav] Navigation trigger: ${target_id}`,
			"background: #1A1A1A; color: white; padding: 2px 5px;"
		);
	try {
		user_session.current_tab = target_id;
		document
			.querySelectorAll(".view_section")
			.forEach((v) => v.classList.remove("active"));
		document.querySelectorAll(".tab_trigger").forEach((btn) => {
			const btn_text = btn.innerText.toLowerCase();
			const is_match =
				btn_text.includes(target_id.split("_")[0]) ||
				(target_id === "home" && btn_text.includes("home"));
			btn.classList.toggle("active", is_match);
		});

		const target_view = document.getElementById(`view_${target_id}`);
		if (target_view) target_view.classList.add("active");

		if (target_id === "adventure") renderAdventureMap();
		if (target_id === "home") renderHomeFeatured();
		if (target_id === "profile") updateUserInterface();
	} catch (error) {
		if (debug) console.error("[Nav] Switch error:", error);
	}
};

/* Experience System */
const gainExperience = (amount, source) => {
	if (debug)
		console.log(`%c[Prog] +${amount} XP from: ${source}`, "color: #4CAF50;");
	try {
		user_session.xp += amount;
		const lvl_threshold = user_session.level * app_config.xp_per_level;
		if (user_session.xp >= lvl_threshold) {
			user_session.level++;
			confetti({
				particleCount: 150,
				spread: 80,
				origin: {
					y: 0.6
				}
			});
			showToast("LEVEL UP!", `You have reached Level ${user_session.level}`);
		}
		updateUserInterface();
	} catch (error) {
		if (debug) console.error("[Prog] XP Gain error:", error);
	}
};

/* Render Adventure Map */
const renderAdventureMap = () => {
	if (debug)
		console.log("%c[UI] Loading adventure grid nodes.", "color: #F7B733;");
	try {
		const grid_el = document.getElementById("adventure_map_grid");
		if (!grid_el) return;

		const diff_filter = document.getElementById("filter_difficulty").value;
		grid_el.innerHTML = "";

		const filtered_list =
			diff_filter === "all"
				? origami_db
				: origami_db.filter((q) => q.difficulty === diff_filter);

		filtered_list.forEach((item) => {
			const is_completed = user_session.completed_ids.includes(item.id);
			const tile_el = document.createElement("div");
			tile_el.className = `quest_tile ${is_completed ? "completed" : ""}`;
			tile_el.onclick = () => openQuestModal(item.id);
			tile_el.innerHTML = `<i class="fa-solid ${item.icon} tile_icon"></i><div class="tile_title">${item.title}</div>`;
			grid_el.appendChild(tile_el);
		});
	} catch (error) {
		if (debug) console.error("[UI] Adventure render error:", error);
	}
};

/* Render Featured Home Cells */
const renderHomeFeatured = () => {
	if (debug)
		console.log("%c[UI] Rendering Home view featured cells.", "color: #D62828;");
	try {
		const container_el = document.getElementById("home_featured");
		if (!container_el) return;

		container_el.innerHTML =
			'<div class="menu_label"><i class="fa-solid fa-fire"></i> CHEF RECOMMENDATIONS</div>';
		const feature_wrap = document.createElement("div");
		feature_wrap.className = "featured_wrap";

		origami_db.slice(0, 2).forEach((item) => {
			const tile_el = document.createElement("div");
			tile_el.className = "quest_tile";
			tile_el.onclick = () => openQuestModal(item.id);
			tile_el.innerHTML = `<i class="fa-solid ${item.icon} tile_icon"></i><div class="tile_title">${item.title}</div>`;
			feature_wrap.appendChild(tile_el);
		});

		container_el.appendChild(feature_wrap);

		const picks_el = document.getElementById("quick_picks");
		picks_el.innerHTML = "";
		origami_db.slice(2, 4).forEach((item) => {
			const pick_el = document.createElement("div");
			pick_el.className = "sushi_card";
			pick_el.onclick = () => openQuestModal(item.id);
			pick_el.innerHTML = `<div class="icon"><i class="fa-solid ${item.icon}"></i></div><div class="pick_name">${item.title}</div>`;
			picks_el.appendChild(pick_el);
		});
	} catch (error) {
		if (debug) console.error("[UI] Featured render error:", error);
	}
};

/* Quest System Interaction */
const openQuestModal = (q_id) => {
	if (debug)
		console.log(
			`%c[Quest] Initializing modal flow for ID: ${q_id}`,
			"color: #D62828;"
		);
	try {
		const q_obj = origami_db.find((q) => q.id === q_id);
		if (!q_obj) return;

		user_session.active_quest = q_obj;
		user_session.active_step = 0;

		document.getElementById("modal_title").innerText = q_obj.title;
		document.getElementById("modal_icon").className = `fa-solid ${q_obj.icon}`;

		updateModalStep();
		document.getElementById("quest_modal").classList.add("active");
	} catch (error) {
		if (debug) console.error("[Quest] Open modal error:", error);
	}
};

const updateModalStep = () => {
	if (debug) console.log("%c[Quest] Syncing modal step UI.", "color: #6D4C41;");
	try {
		const q = user_session.active_quest;
		const s = user_session.active_step;
		if (!q) return;

		document.getElementById("modal_step_count").innerText = `Step ${s + 1}/${
			q.steps.length
		}`;
		document.getElementById("modal_instruction").innerText = q.steps[s];

		const is_end = s === q.steps.length - 1;
		document.getElementById("modal_next_btn").style.display = is_end
			? "none"
			: "block";
		document.getElementById("modal_finish_btn").style.display = is_end
			? "block"
			: "none";
	} catch (error) {
		if (debug) console.error("[Quest] Step sync error:", error);
	}
};

const handleStepChange = (dir_val) => {
	try {
		if (!user_session.active_quest) return;
		const next_val = user_session.active_step + dir_val;
		if (next_val >= 0 && next_val < user_session.active_quest.steps.length) {
			user_session.active_step = next_val;
			updateModalStep();
		}
	} catch (error) {
		if (debug) console.error("[Quest] Step change error:", error);
	}
};

const handleQuestCompletion = () => {
	try {
		const q = user_session.active_quest;
		if (!q) return;

		if (!user_session.completed_ids.includes(q.id)) {
			user_session.completed_ids.push(q.id);
			gainExperience(q.steps.length * 20, q.title);
		}
		closeQuestModal();
		if (user_session.current_tab === "adventure") renderAdventureMap();
	} catch (error) {
		if (debug) console.error("[Quest] Completion error:", error);
	}
};

const closeQuestModal = () => {
	if (debug) console.log("%c[Quest] Modal session closed.", "color: #6D4C41;");
	try {
		document.getElementById("quest_modal").classList.remove("active");
		user_session.active_quest = null;
	} catch (error) {
		if (debug) console.error("[Quest] Close modal error:", error);
	}
};

/* UI Data Synchronization */
const updateUserInterface = () => {
	if (debug)
		console.log(
			"%c[UI] Performing full data synchronization.",
			"color: #2196F3;"
		);
	try {
		const belt_obj = [...app_config.belts]
			.reverse()
			.find((b) => user_session.level >= b.min_lvl);
		const belt_node = document.getElementById("ui_belt_node");

		app_config.belts.forEach((b) => belt_node.classList.remove(b.class));
		belt_node.classList.add(belt_obj.class);

		const avatar_url = `https://api.dicebear.com/9.x/dylan/svg/svg?seed=${user_session.display_name}`;
		document.getElementById("ui_header_avatar").src = avatar_url;
		document.getElementById("ui_header_name").innerText =
			user_session.display_name;
		document.getElementById("ui_belt_name").innerText = `${belt_obj.name} Belt`;

		document.getElementById(
			"ui_header_xp_val"
		).innerText = `${user_session.xp} XP`;
		const target_xp = user_session.level * app_config.xp_per_level;
		const prev_xp = (user_session.level - 1) * app_config.xp_per_level;
		const progress_pct =
			((user_session.xp - prev_xp) / (target_xp - prev_xp)) * 100;
		document.getElementById("ui_xp_bar").style.width = `${progress_pct}%`;

		const title_idx = Math.min(
			Math.floor((user_session.level - 1) / 5),
			app_config.level_titles.length - 1
		);
		const title_val = app_config.level_titles[title_idx];

		document.getElementById("ui_display_name").innerText =
			user_session.display_name;
		document.getElementById(
			"ui_lvl_title"
		).innerText = `LVL ${user_session.level}: ${title_val}`;
		document.getElementById("ui_profile_name").innerText = title_val;
		document.getElementById("ui_stat_xp").innerText = user_session.xp;
		document.getElementById("ui_stat_folds").innerText =
			user_session.completed_ids.length;

		document.getElementById("stat_completed").innerText =
			user_session.completed_ids.length;
		document.getElementById("stat_level").innerText = user_session.level;
		document.getElementById("ui_profile_avatar").src = avatar_url;

		let dots_html = "";
		for (let i = 1; i <= 5; i++) {
			const is_dot_active = i <= (user_session.level % 5 || 5);
			dots_html += `<div class="dot ${is_dot_active ? "active" : ""}">${i}</div>`;
		}
		document.getElementById("ui_lvl_dots").innerHTML = dots_html;

		const list_el = document.getElementById("ui_mastery_list");
		if (list_el) {
			list_el.innerHTML = "";
			user_session.completed_ids.forEach((id_val) => {
				const m_obj = origami_db.find((m) => m.id === id_val);
				if (m_obj) {
					const badge_el = document.createElement("div");
					badge_el.className = "quest_tile completed mastery_item";
					badge_el.innerHTML = `<i class="fa-solid ${m_obj.icon} tile_icon"></i><div class="tile_title">${m_obj.title}</div>`;
					list_el.appendChild(badge_el);
				}
			});
		}
	} catch (err) {
		if (debug) console.error("[UI] Sync Error encountered:", err);
	}
};

/* Utility: Toast Messenger */
const showToast = (t_title, t_msg) => {
	try {
		const hub_el = document.getElementById("ui_toast_hub");
		const item_el = document.createElement("div");
		item_el.className = "toast_item";
		item_el.innerHTML = `<h4>${t_title}</h4><p>${t_msg}</p>`;
		hub_el.appendChild(item_el);

		setTimeout(() => item_el.classList.add("visible"), 50);

		setTimeout(() => {
			item_el.classList.remove("visible");
			setTimeout(() => item_el.remove(), 600);
		}, 4500);
	} catch (error) {
		if (debug) console.error("[Toast] Error:", error);
	}
};

const handleFormSubmission = (evt) => {
	evt.preventDefault();
	if (debug) console.log("%c[Form] Validating submission.", "color: #D62828;");
	try {
		showToast("Unfolded!", "The ASBORIGAMI Team has received your message.");
		evt.target.reset();
	} catch (error) {
		if (debug) console.error("[Form] Error:", error);
	}
};

window.onload = initApp;
