const system_config = {
	api_endpoint:
		"https://script.google.com/macros/s/AKfycbxYwkSkU9TTaded7KjqoF6HcdZF3rHQzO2Rj8bXnMWQ82TUXawHtBH7Tl1-p6e45gPZ/exec",
	palette: [
		"green_palette",
		"cyan",
		"orange",
		"red",
		"blue",
		"purple",
		"pink",
		"yellow"
	],
	default_icon: "auto_awesome"
};

let current_user_obj = null,
	questions_repo = [],
	options_repo = [],
	local_answers = {},
	quiz_cursor = 0;

function showToast(msg, type = "error") {
	const container = document.getElementById("toast_container");
	const toast = document.createElement("div");
	toast.className = `toast ${type}`;
	toast.innerHTML = `<span class="material-icons-round">${
		type === "success" ? "check_circle" : "error_outline"
	}</span><span>${msg}</span>`;
	container.appendChild(toast);
	setTimeout(() => toast.classList.add("show"), 10);
	setTimeout(() => {
		toast.classList.remove("show");
		setTimeout(() => toast.remove(), 500);
	}, 4000);
}

function toggleLoader(show) {
	document.getElementById("loading_overlay").classList.toggle("active", show);
}

async function fetchFromApi(sheet, col = null, val = null) {
	let url = `${system_config.api_endpoint}?sheet=${sheet}&all_data=true`;
	if (col && val) url += `&column=${col}&value=${encodeURIComponent(val)}`;
	try {
		const res = await fetch(url);
		const json = await res.json();
		return json.status === "success" ? json.data : [];
	} catch (e) {
		return [];
	}
}

async function postToApi(payload) {
	try {
		await fetch(system_config.api_endpoint, {
			method: "POST",
			mode: "no-cors",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		return { status: "success" };
	} catch (e) {
		return { status: "error" };
	}
}

function switchView(id) {
	document
		.querySelectorAll(".view_container")
		.forEach((e) => e.classList.remove("active"));
	document.getElementById(id + "_view").classList.add("active");
}

const resolveCategoryColor = (cat) => {
	const categories = [...new Set(questions_repo.map((q) => q.category))];
	const idx = categories.indexOf(cat);
	return system_config.palette[idx % system_config.palette.length];
};

const resolveCategoryIcon = (cat) => {
	const question = questions_repo.find((q) => q.category === cat);
	return question && question.icon ? question.icon : system_config.default_icon;
};

async function checkSession() {
	const u = localStorage.getItem("ols_user");
	if (u) {
		current_user_obj = JSON.parse(u);
		toggleLoader(true);
		await initData();
		toggleLoader(false);
		gotoDashboard();
	} else {
		switchView("login");
	}
}

async function initData() {
	questions_repo = await fetchFromApi("Questions");
	options_repo = await fetchFromApi("Options");
	const ans = await fetchFromApi("Answers", "user", current_user_obj.id);
	local_answers = {};
	if (ans) ans.forEach((i) => (local_answers[i.question] = i.answer));
}

async function doLogin() {
	const email = document.getElementById("login_email").value.trim();
	const pass = document.getElementById("login_pass").value;
	if (!email || !pass) return showToast("Completa los campos");
	toggleLoader(true);
	const users = await fetchFromApi("Users", "email", email);
	const user = users.find((u) => u.email === email && atob(u.password) === pass);
	if (user) {
		current_user_obj = user;
		localStorage.setItem("ols_user", JSON.stringify(user));
		await initData();
		gotoDashboard();
	} else {
		showToast("Credenciales inválidas");
	}
	toggleLoader(false);
}

function gotoDashboard() {
	switchView("app_shell");
	document.getElementById("m_dash").classList.add("active");
	document.getElementById("m_quiz").classList.remove("active");
	const total = questions_repo.length;
	const done = Object.keys(local_answers).length;
	const pct = total ? Math.round((done / total) * 100) : 0;
	const circle = document.getElementById("sb_circle");
	const circ = 2 * Math.PI * 64;
	circle.style.strokeDasharray = circ;
	circle.style.strokeDashoffset = circ - (pct / 100) * circ;
	document.getElementById("sb_pct_label").innerText = `${pct}%`;
	document.getElementById("u_name_label").innerText = current_user_obj.name;
	document.getElementById("u_id_label").innerText = `ID: ${current_user_obj.id}`;

	const avatar = document.getElementById("u_photo");
	const user_photo = current_user_obj.Photo || current_user_obj.photo;
	if (user_photo) {
		avatar.style.backgroundImage = `url('${user_photo}')`;
		avatar.innerText = "";
	} else {
		avatar.innerText = current_user_obj.name.charAt(0);
		avatar.style.backgroundImage = "none";
	}

	const grid = document.getElementById("ws_content");
	grid.innerHTML = `
                <div class="header_bar">
                    <div><h2>Dashboard</h2><p style="color:var(--text_muted); margin-top:0.5rem">Bienvenido a tu evaluación de sostenibilidad</p></div>
                    <button class="btn_main" onclick="resumeQuiz()"><span class="material-icons-round">play_arrow</span> Continuar</button>
                </div>
                <div class="cat_grid" id="dash_grid"></div>
            `;
	const cats = [...new Set(questions_repo.map((q) => q.category))];
	const d_grid = document.getElementById("dash_grid");
	cats.forEach((cat, i) => {
		const qs = questions_repo.filter((q) => q.category === cat);
		const q_done = qs.filter((q) => local_answers[q.id]).length;
		const c_pct = Math.round((q_done / qs.length) * 100);
		const color_key = resolveCategoryColor(cat);
		const color_var = `var(--${color_key}_normal)`;
		const bg_var = `var(--${color_key}_light)`;
		const icon = resolveCategoryIcon(cat);
		const card = document.createElement("div");
		card.className = "cat_item";
		card.onclick = () => showCategory(cat);
		card.style.animation = `slideUp 0.6s forwards ${i * 0.1}s`;
		card.style.opacity = 0;
		card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:2rem">
                        <div class="cat_icon_box" style="background:${bg_var}; color:${color_var}"><span class="material-icons-round">${icon}</span></div>
                        <span style="font-weight:800; font-size:1.8rem; color:${color_var}">${c_pct}%</span>
                    </div>
                    <h3 style="font-size:1.4rem; margin-bottom:1rem">${cat}</h3>
                    <div style="height:8px; background:var(--mint_primary); border-radius:4px; overflow:hidden"><div style="width:${c_pct}%; height:100%; background:${color_var}"></div></div>
                    <p style="font-size:0.9rem; color:var(--text_muted); margin-top:0.8rem; font-weight:500">${q_done} / ${qs.length} completadas</p>
                `;
		d_grid.appendChild(card);
	});
}

function showCategory(cat) {
	const qs = questions_repo.filter((q) => q.category === cat);
	const grid = document.getElementById("ws_content");
	grid.innerHTML = `
                <div class="header_bar"><div style="display:flex; gap:1.5rem; align-items:center"><button class="back_nav_btn" onclick="gotoDashboard()"><span class="material-icons-round">arrow_back</span></button><div><h2 style="margin-bottom:0.2rem">${cat}</h2><p style="color:var(--text_muted); font-size:0.9rem">${qs.length} preguntas en esta sección</p></div></div></div>
                <div style="display:flex; flex-direction:column; gap:1.2rem; padding-bottom:3rem" id="q_list"></div>
            `;
	const list = document.getElementById("q_list");
	qs.forEach((q, i) => {
		const done = !!local_answers[q.id];
		const item = document.createElement("div");
		item.className = "cat_item";
		item.style.padding = "1.8rem";
		item.style.animation = `slideUp 0.6s forwards ${i * 0.05}s`;
		item.style.opacity = 0;
		item.onclick = () => {
			quiz_cursor = questions_repo.findIndex((x) => x.id === q.id);
			launchQuiz();
		};
		const color_key = resolveCategoryColor(cat);
		const color_var = `var(--${color_key}_normal)`;
		item.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center">
                        <div><h4 style="font-size:1.1rem; margin-bottom:0.4rem">${
																									q.question
																								}</h4><p style="font-size:0.9rem; color:var(--text_muted)">${
			q.description
		}</p></div>
                        <div style="display:flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; border-radius:20px; font-weight:600; font-size:0.85rem; ${
																									done
																										? `background:var(--mint_primary); color:${color_var}`
																										: "background:#f1f5f9; color:var(--text_muted)"
																								}">
                            <span class="material-icons-round" style="font-size:18px">${
																													done ? "check_circle" : "radio_button_unchecked"
																												}</span>${done ? "Completada" : "Pendiente"}
                        </div>
                    </div>
                `;
		list.appendChild(item);
	});
}

function resumeQuiz() {
	const idx = questions_repo.findIndex((q) => !local_answers[q.id]);
	quiz_cursor = idx === -1 ? 0 : idx;
	launchQuiz();
}

function launchQuiz() {
	switchView("questionnaire");
	renderQuizStep();
}

function renderQuizStep() {
	const q = questions_repo[quiz_cursor];
	const total = questions_repo.length;
	const color_key = resolveCategoryColor(q.category);
	const bg_light = `var(--${color_key}_light)`;
	const accent = `var(--${color_key}_normal)`;

	const sidebar = document.getElementById("quiz_sidebar_el");
	sidebar.style.background = bg_light;

	const step_container = document.getElementById("q_step_container");
	step_container.classList.remove("quiz_step_content");
	void step_container.offsetWidth;
	step_container.classList.add("quiz_step_content");

	document.getElementById("q_category_label").innerText = q.category;
	document.getElementById("q_category_label").style.color = accent;
	document.getElementById("q_main_label").innerText = q.question;
	document.getElementById("q_description_label").innerText = q.description;
	document.getElementById("q_step_label").innerText = `Pregunta ${
		quiz_cursor + 1
	} de ${total}`;
	const pct = Math.round(((quiz_cursor + 1) / total) * 100);
	document.getElementById("q_pct_label").innerText = `${pct}%`;

	const icon = document.getElementById("q_icon");
	icon.innerText = q.icon || system_config.default_icon;
	icon.style.color = accent;

	document.getElementById("quiz_progress_fill").style.background = accent;
	document.getElementById("quiz_progress_fill").style.width = `${pct}%`;

	const box = document.getElementById("q_options_box");
	box.innerHTML = "";
	const opts = options_repo.filter((o) => o.question === q.id);
	opts.forEach((o, i) => {
		const sel = local_answers[q.id] === o.id;
		const el = document.createElement("div");
		el.className = `option_card ${sel ? "selected" : ""}`;
		if (sel) {
			el.style.borderColor = accent;
			el.style.boxShadow = `0 15px 40px ${bg_light}`;
		}
		el.onclick = () => {
			local_answers[q.id] = o.id;
			renderQuizStep();
		};
		el.innerHTML = `<div style="display:flex; gap:1.2rem; align-items:center"><div class="option_circle" style="background:${
			sel ? accent : "var(--mint_primary)"
		}; color:${sel ? "white" : "var(--text_muted)"};">${String.fromCharCode(
			65 + i
		)}</div><span style="font-size:1.05rem; font-weight:500;">${
			o.answer
		}</span></div>`;
		box.appendChild(el);
	});

	const back = document.getElementById("quiz_back_btn");
	const next = document.getElementById("quiz_next_btn");
	back.disabled = quiz_cursor === 0;
	back.onclick = () => {
		quiz_cursor--;
		renderQuizStep();
	};

	next.style.background = accent;
	next.disabled = !local_answers[q.id];
	next.innerHTML =
		quiz_cursor === total - 1
			? 'Finalizar <span class="material-icons-round">check_circle</span>'
			: 'Siguiente <span class="material-icons-round">arrow_forward</span>';

	next.onclick = async () => {
		next.classList.add("loading");
		next.innerHTML = `Enviando... <span class="material-icons-round">sync</span>`;

		const saved = await syncStepData();
		next.classList.remove("loading");

		if (saved) {
			if (quiz_cursor < total - 1) {
				quiz_cursor++;
				renderQuizStep();
			} else {
				showToast("¡Perfil completado!", "success");
				setTimeout(gotoDashboard, 1000);
			}
		} else {
			showToast("Error al guardar");
			renderQuizStep();
		}
	};
}

async function syncStepData() {
	const q = questions_repo[quiz_cursor];
	const aid = local_answers[q.id];
	if (!aid) return false;
	localStorage.setItem(
		`ols_ans_${current_user_obj.id}`,
		JSON.stringify(local_answers)
	);
	const now = new Date();
	const d = String(now.getDate()).padStart(2, "0");
	const m = String(now.getMonth() + 1).padStart(2, "0");
	const y = String(now.getFullYear());
	const h = String(now.getHours()).padStart(2, "0");
	const i = String(now.getMinutes()).padStart(2, "0");
	const s = String(now.getSeconds()).padStart(2, "0");
	const r = Math.floor(Math.random() * 90 + 10);
	const custom_id = `a_${d}${m}${y}${h}${i}${s}${r}`;
	const res = await postToApi({
		id: custom_id,
		user: current_user_obj.id,
		question: q.id,
		answer: aid
	});
	return res && res.status === "success";
}

function userLogout() {
	localStorage.removeItem("ols_user");
	location.reload();
}

document.getElementById("login_btn").onclick = doLogin;
window.onload = checkSession;
