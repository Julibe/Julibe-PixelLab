let debug = true;
console.clear();

const api_key = "YmQ5ZDJmNjdlZjRiODIyZTkxMTliNjliYmNhZTY4MTA=",
	getApiKey = () => atob(api_key),
	app_config = {
		base_url: "https://api.themoviedb.org/3",
		image_base_url: "https://image.tmdb.org/t/p",
		language: "en-US",
		sizes: { poster: "/w500", thumb: "/original" }
	};

let update_interval,
	typing_timeout,
	all_movies = [],
	recent_movies = [],
	unreleased_movies = [],
	next_week_content = [],
	this_month_content = [],
	all_tv = [],
	all_anime = [],
	genre_map = {};

const region_filters = "&without_original_language=hi|te|ta|ml|kn|bn|pa|mr|gu|ur|as|or|si",
	quality_filters = "&vote_count.gte=300&vote_average.gte=8",
	date_filter = "&primary_release_date.gte=2020-01-01",
	tv_date_filter = "&first_air_date.gte=2020-01-01";

/* shuffleArray */
function shuffleArray(array_to_shuffle) {
	if (debug) console.log("%c[FLOW] Randomizing array order", "color: #00d4ff");
	for (let i = array_to_shuffle.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array_to_shuffle[i], array_to_shuffle[j]] = [array_to_shuffle[j], array_to_shuffle[i]];
	}
	if (debug) console.log("%c[OUTPUT] Array shuffled", "color: #2ecc71", array_to_shuffle);
	return array_to_shuffle;
}

/* typeWriter */
function typeWriter(target_element, input_text, typing_speed = 50) {
	if (debug) console.log(`%c[FLOW] Initializing typewriter for: ${input_text}`, "color: #00d4ff");
	if (typing_timeout) {
		if (debug) console.log("%c[STATE] Clearing existing typing timeout", "color: #f39c12");
		clearTimeout(typing_timeout);
	}
	target_element.innerHTML = "";
	target_element.classList.add("typing-cursor");
	let char_index = 0;
	!(function processType() {
		if (char_index < input_text.length) {
			target_element.innerHTML += input_text.charAt(char_index);
			char_index++;
			typing_timeout = setTimeout(processType, typing_speed);
		} else {
			if (debug) console.log("%c[STATE] Typewriter animation complete", "color: #2ecc71");
			setTimeout(() => target_element.classList.remove("typing-cursor"), 1000);
		}
	})();
}

/* scrollToTop */
function scrollToTop() {
	if (debug) console.log("%c[FLOW] Scrolling to top of page", "color: #00d4ff");
	window.scrollTo({ top: 0, behavior: "smooth" });
}

/* getDateStr */
function getDateStr(days_offset) {
	if (debug) console.log(`%c[FLOW] Calculating date with offset: ${days_offset}`, "color: #00d4ff");
	const target_date = new Date();
	target_date.setDate(target_date.getDate() + days_offset);
	const date_string = target_date.toISOString().split("T")[0];
	if (debug) console.log(`%c[OUTPUT] Calculated date: ${date_string}`, "color: #2ecc71");
	return date_string;
}

/* fetchGenreMap */
async function fetchGenreMap() {
	if (debug) console.log("%c[FLOW] Fetching movie genre mappings", "color: #00d4ff");
	const fetch_url = `${app_config.base_url}/genre/movie/list?api_key=${getApiKey()}&language=${app_config.language}`;
	try {
		const response = await fetch(fetch_url);
		const data = await response.json();
		data.genres.forEach((genre_item) => (genre_map[genre_item.id] = genre_item.name));
		if (debug) console.log("%c[STATE] Genre map updated", "color: #2ecc71", genre_map);
	} catch (error) {
		if (debug) console.error("%c[ERROR] Failed to fetch genre map", "color: #e74c3c", { url: fetch_url, error: error.message });
		showToast("Error", "Could not load genre list.");
	}
}

/* isIndianContent */
function isIndianContent(content_item) {
	if (debug) console.log("%c[FLOW] Checking content origin", "color: #00d4ff", content_item.title || content_item.name);
	const searchable_text = ((content_item.title || content_item.name || "") + " " + (content_item.overview || "")).toLowerCase();
	const indian_keywords = ["bollywood", "tollywood", "kollywood", "sandalwood", "mollywood", "tamil", "telugu", "hindi", "kannada", "malayalam", "bengali", "marathi", "punjabi", "mumbai", "delhi", "chennai", "hyderabad", "bangalore", "kolkata", "kerala", "veeran", "maadu", "pidi", "varisu", "thunivu", "vikram", "ponniyin", "salaar", "kalki", "pushpa", "kantara", "kgf", "k.g.f", "rrr", "r.r.r", "bramayugam", "manjummel", "premalu", "avesham", "aadujeevitham", "jailer", "leo", "beast", "don", "doctor", "master", "bigil", "mersal", "sarkar", "theri", "kaththi", "thuppakki", "devara", "kanguva", "kapoor", "khan"];
	const indian_langs = ["hi", "te", "ta", "ml", "kn", "bn", "pa", "mr", "gu", "ur", "as", "or"];
	const is_match = indian_keywords.some((keyword) => searchable_text.includes(keyword)) || indian_langs.includes(content_item.original_language);
	if (debug && is_match) console.log(`%c[STATE] Filtered out Indian content: ${content_item.title || content_item.name}`, "color: #f39c12");
	return is_match;
}

/* fetchContent */
async function fetchContent(fetch_url, content_type = "movie") {
	if (debug) console.log(`%c[FLOW] Requesting ${content_type} from: ${fetch_url}`, "color: #00d4ff");
	try {
		const response = await fetch(fetch_url);
		const data = await response.json();
		const processed_results = (data.results || [])
			.filter((item) => !!item.poster_path && !isIndianContent(item))
			.map((item) => ({
				id: item.id,
				type: content_type,
				title: content_type === "movie" ? item.title : item.name,
				description: item.overview,
				genre: item.genre_ids
					? item.genre_ids
							.map((id) => genre_map[id] || "Unknown")
							.slice(0, 2)
							.join(", ")
					: "Unknown",
				year: (content_type === "movie" ? item.release_date : item.first_air_date)?.split("-")[0] || "N/A",
				poster: `${app_config.image_base_url}${app_config.sizes.poster}${item.poster_path}`,
				image: item.backdrop_path ? `${app_config.image_base_url}${app_config.sizes.thumb}${item.backdrop_path}` : "https://placehold.co/1920x1080?text=No+Image",
				rating: item.vote_average,
				mp4: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
			}));
		if (debug) console.log(`%c[OUTPUT] Fetched ${processed_results.length} valid ${content_type} items`, "color: #2ecc71");
		return processed_results;
	} catch (error) {
		if (debug) console.error(`%c[ERROR] fetchContent failed`, "color: #e74c3c", { type: content_type, url: fetch_url, error: error.message });
		return [];
	}
}

/* fetchTrailerKey */
async function fetchTrailerKey(item_id, content_type = "movie") {
	if (debug) console.log(`%c[FLOW] Searching trailer for ID: ${item_id}`, "color: #00d4ff");
	const fetch_url = `${app_config.base_url}/${content_type}/${item_id}/videos?api_key=${getApiKey()}&language=${app_config.language}`;
	try {
		const response = await fetch(fetch_url);
		const data = await response.json();
		const yt_videos = (data.results || []).filter((v) => v.site === "YouTube");
		let trailer = yt_videos.find((v) => v.type === "Trailer");
		if (!trailer) trailer = yt_videos.find((v) => v.type === "Teaser");
		if (debug) console.log(trailer ? `%c[OUTPUT] Trailer key found: ${trailer.key}` : "%c[STATE] No YouTube trailer found", trailer ? "color: #2ecc71" : "color: #f39c12");
		return trailer ? trailer.key : null;
	} catch (error) {
		if (debug) console.error("%c[ERROR] fetchTrailerKey failed", "color: #e74c3c", { id: item_id, error: error.message });
		return null;
	}
}

/* getMovies */
async function getMovies(page_limit = 10) {
	if (debug) console.log(`%c[FLOW] Loading trending movies (Pages: ${page_limit})`, "color: #00d4ff");
	const base_discover = `${app_config.base_url}/discover/movie?api_key=${getApiKey()}&language=${app_config.language}&sort_by=popularity.desc${date_filter}${quality_filters}${region_filters}`;
	let fetch_promises = [];
	for (let i = 1; i <= page_limit; i++) fetch_promises.push(fetchContent(`${base_discover}&page=${i}`, "movie"));
	const results = (await Promise.all(fetch_promises)).flat();
	return results;
}

/* getRecentMovies */
async function getRecentMovies() {
	if (debug) console.log("%c[FLOW] Loading recent releases", "color: #00d4ff");
	const today_date = new Date().toISOString().split("T")[0];
	const fetch_url = `${app_config.base_url}/discover/movie?api_key=${getApiKey()}&language=${app_config.language}&sort_by=primary_release_date.desc&primary_release_date.lte=${today_date}${date_filter}${quality_filters}${region_filters}`;
	let fetch_promises = [];
	for (let i = 1; i <= 3; i++) fetch_promises.push(fetchContent(`${fetch_url}&page=${i}`, "movie"));
	return (await Promise.all(fetch_promises)).flat();
}

/* getUnreleasedMovies */
async function getUnreleasedMovies() {
	if (debug) console.log("%c[FLOW] Loading upcoming unreleased movies", "color: #00d4ff");
	const start_date = getDateStr(1);
	const fetch_url = `${app_config.base_url}/discover/movie?api_key=${getApiKey()}&language=${app_config.language}&sort_by=popularity.desc&primary_release_date.gte=${start_date}${region_filters}`;
	let fetch_promises = [];
	for (let i = 1; i <= 3; i++) fetch_promises.push(fetchContent(`${fetch_url}&page=${i}`, "movie"));
	return (await Promise.all(fetch_promises)).flat();
}

/* getNextWeekContent */
async function getNextWeekContent() {
	if (debug) console.log("%c[FLOW] Loading content for next week", "color: #00d4ff");
	const start_date = getDateStr(1),
		end_date = getDateStr(8);
	const movie_url = `${app_config.base_url}/discover/movie?api_key=${getApiKey()}&language=${app_config.language}&sort_by=popularity.desc&primary_release_date.gte=${start_date}&primary_release_date.lte=${end_date}${region_filters}`,
		tv_url = `${app_config.base_url}/discover/tv?api_key=${getApiKey()}&language=${app_config.language}&sort_by=popularity.desc&first_air_date.gte=${start_date}&first_air_date.lte=${end_date}${region_filters}`;
	const [movies, tv] = await Promise.all([fetchContent(movie_url, "movie"), fetchContent(tv_url, "tv")]);
	return [...movies, ...tv];
}

/* getThisMonthContent */
async function getThisMonthContent() {
	if (debug) console.log("%c[FLOW] Loading content for this month", "color: #00d4ff");
	const start_date = getDateStr(1),
		end_date = getDateStr(30);
	const movie_url = `${app_config.base_url}/discover/movie?api_key=${getApiKey()}&language=${app_config.language}&sort_by=popularity.desc&primary_release_date.gte=${start_date}&primary_release_date.lte=${end_date}${region_filters}`,
		tv_url = `${app_config.base_url}/discover/tv?api_key=${getApiKey()}&language=${app_config.language}&sort_by=popularity.desc&first_air_date.gte=${start_date}&first_air_date.lte=${end_date}${region_filters}`;
	const [movies, tv] = await Promise.all([fetchContent(movie_url, "movie"), fetchContent(tv_url, "tv")]);
	return [...movies, ...tv];
}

/* getTV */
async function getTV(page_limit = 5) {
	if (debug) console.log("%c[FLOW] Loading trending TV shows", "color: #00d4ff");
	const base_url = `${app_config.base_url}/discover/tv?api_key=${getApiKey()}&language=${app_config.language}&sort_by=popularity.desc${tv_date_filter}${quality_filters}${region_filters}`;
	let fetch_promises = [];
	for (let i = 1; i <= page_limit; i++) fetch_promises.push(fetchContent(`${base_url}&page=${i}`, "tv"));
	return (await Promise.all(fetch_promises)).flat();
}

/* getAnime */
async function getAnime(page_limit = 3) {
	if (debug) console.log("%c[FLOW] Loading trending anime", "color: #00d4ff");
	const base_url = `${app_config.base_url}/discover/tv?api_key=${getApiKey()}&language=${app_config.language}&with_genres=16&with_original_language=ja&sort_by=popularity.desc${tv_date_filter}${quality_filters}`;
	let fetch_promises = [];
	for (let i = 1; i <= page_limit; i++) fetch_promises.push(fetchContent(`${base_url}&page=${i}`, "tv"));
	return (await Promise.all(fetch_promises)).flat();
}

/* loadGenre */
async function loadGenre(genre_id, genre_name) {
	if (debug) console.log(`%c[FLOW] Filtering by genre: ${genre_name} (ID: ${genre_id})`, "color: #00d4ff");
	document.getElementById("trendingTitle").textContent = genre_name;
	document.getElementById("moviesRow").innerHTML = `<div style="color:white; padding: 20px;">Loading category...`+`</`+`div>`;
	["tvSection", "animeSection", "recentSection", "unreleasedSection", "nextWeekSection", "thisMonthSection"].forEach((section_id) => {
		const section_element = document.getElementById(section_id);
		if (section_element) section_element.style.display = "none";
	});
	document.querySelectorAll(".sidebar-icon").forEach((icon) => icon.classList.remove("active"));
	const fetch_url = `${app_config.base_url}/discover/movie?api_key=${getApiKey()}&language=${app_config.language}&sort_by=popularity.desc&with_genres=${genre_id}${date_filter}${quality_filters}${region_filters}`;
	let fetch_promises = [];
	for (let i = 1; i <= 3; i++) fetch_promises.push(fetchContent(`${fetch_url}&page=${i}`, "movie"));
	const results = shuffleArray((await Promise.all(fetch_promises)).flat());
	if (results.length > 0) {
		document.getElementById("moviesRow").innerHTML = results.map((item) => createCard(item)).join("");
		all_movies = results;
		attachTiltEffect();
		if (debug) console.log(`%c[STATE] Genre ${genre_name} loaded with ${results.length} items`, "color: #2ecc71");
	} else {
		document.getElementById("moviesRow").innerHTML = `<div style="color:white; padding: 20px;">No highly rated movies found in this category.`+`</`+`div>`;
		if (debug) console.warn(`%c[STATE] No results for genre: ${genre_name}`, "color: #f39c12");
	}
}

/* injectAnimeSection */
function injectAnimeSection() {
	if (debug) console.log("%c[FLOW] Injecting Anime section into DOM", "color: #00d4ff");
	const tv_section = document.getElementById("tvSection");
	if (tv_section && !document.getElementById("animeSection")) {
		const section_html = `
            <div class="row-section" id="animeSection">
                <div class="row-header">
                    <h2 class="row-title">TOP TRENDING ANIME <span class="see-all">View All`+`</`+`span>`+`</`+`h2>
                    <div class="nav-controls">
                        <button class="nav-btn" onclick="scrollRow('animeRow', 'left')"><i class="fas fa-chevron-left">`+`</`+`i>`+`</`+`button>
                        <button class="nav-btn" onclick="scrollRow('animeRow', 'right')"><i class="fas fa-chevron-right">`+`</`+`i>`+`</`+`button>
                    `+`</`+`div>
                `+`</`+`div>
                <div class="movie-row" id="animeRow">`+`</`+`div>
            `+`</`+`div>`;
		tv_section.insertAdjacentHTML("afterend", section_html);
		if (debug) console.log("%c[STATE] Anime section successfully injected", "color: #2ecc71");
	}
}

/* resetHome */
function resetHome() {
	if (debug) console.log("%c[FLOW] Resetting UI to Home view", "color: #00d4ff");
	document.getElementById("trendingTitle").textContent = "TOP 10 TRENDING MOVIES";
	["tvSection", "animeSection", "recentSection", "unreleasedSection", "nextWeekSection", "thisMonthSection"].forEach((section_id) => {
		const section_element = document.getElementById(section_id);
		if (section_element) section_element.style.display = "block";
	});
	document.querySelectorAll(".sidebar-icon").forEach((icon) => icon.classList.remove("active"));
	const home_icon = document.querySelector(`.sidebar-icon[data-tooltip="Home"]`);
	if (home_icon) home_icon.classList.add("active");
	const top_ten = all_movies.slice(0, 10);
	document.getElementById("moviesRow").innerHTML = top_ten.map((item, idx) => createCard(item, idx + 1)).join("") + all_movies.slice(10).map((item) => createCard(item)).join("");
	document.getElementById("recentRow").innerHTML = recent_movies.map((item) => createCard(item)).join("");
	document.getElementById("unreleasedRow").innerHTML = unreleased_movies.map((item) => createCard(item)).join("");
	document.getElementById("nextWeekRow").innerHTML = next_week_content.map((item) => createCard(item)).join("");
	document.getElementById("thisMonthRow").innerHTML = this_month_content.map((item) => createCard(item)).join("");
	document.getElementById("tvRow").innerHTML = all_tv.map((item) => createCard(item)).join("");
	const anime_row = document.getElementById("animeRow");
	if (anime_row) anime_row.innerHTML = all_anime.map((item) => createCard(item)).join("");
	attachTiltEffect();
	if (debug) console.log("%c[STATE] Home UI reset complete", "color: #2ecc71");
}

/* initHero */
function initHero(content_item) {
	if (!content_item) {
		if (debug) console.warn("%c[STATE] initHero called without item", "color: #f39c12");
		return;
	}
	if (debug) console.log(`%c[FLOW] Updating Hero: ${content_item.title}`, "color: #00d4ff");
	const hero_section = document.getElementById("heroSection"),
		hero_bg = hero_section.querySelector(".hero-bg");
	document.getElementById("globalAmbient").style.backgroundImage = `url("${content_item.image}")`;
	hero_bg.style.opacity = 0;
	setTimeout(() => {
		hero_bg.style.backgroundImage = `url("${content_item.image}")`;
		hero_bg.style.opacity = 1;
		hero_section.querySelector(".hero-content").innerHTML = `
            <span class="tag-pill">#1 Trending`+`</`+`span>
            <h2 class="typing-cursor">`+`</`+`h2>
            <p class="description">${content_item.description}`+`</`+`p>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="openDetails('${content_item.id}')"><i class="fas fa-info-circle">`+`</`+`i> More Info`+`</`+`button>
                <button class="btn btn-secondary"><i class="fas fa-plus">`+`</`+`i> My List`+`</`+`button>
            `+`</`+`div>`;
		typeWriter(hero_section.querySelector("h2"), content_item.title);
	}, 300);
}

/* createCard */
function createCard(content_item, rank_number = null) {
	const rank_html = rank_number ? `<div class="rank-number">${rank_number}`+`</`+`div>` : "";
	return `
        <div class="card ${rank_number ? "ranked" : ""}" onclick="openDetails('${content_item.id}')">
            <div class="card-content">
                ${rank_html}
                <div class="new-badge">${content_item.rating.toFixed(1)}`+`</`+`div>
                <img src="${content_item.poster}" class="card-img" alt="${content_item.title}" loading="lazy">
                <div class="card-overlay">`+`</`+`div>
                <div class="card-info">
                    <h3>${content_item.title}`+`</`+`h3>
                    <div class="meta-tags"><span>${content_item.year}`+`</`+`span> • <span>${content_item.genre}`+`</`+`span>`+`</`+`div>
                `+`</`+`div>
            `+`</`+`div>
        `+`</`+`div>`;
}

/* initApp */
async function initApp() {
	if (debug) console.log("%c[FLOW] Starting Application Initialization", "color: #00d4ff");
	try {
		await fetchGenreMap();
		injectAnimeSection();
		const [movies, tv, anime, recent, unreleased, next_week, this_month] = await Promise.all([getMovies(10), getTV(5), getAnime(3), getRecentMovies(), getUnreleasedMovies(), getNextWeekContent(), getThisMonthContent()]);
		all_movies = shuffleArray(movies);
		all_tv = shuffleArray(tv);
		all_anime = shuffleArray(anime);
		recent_movies = shuffleArray(recent);
		unreleased_movies = shuffleArray(unreleased);
		next_week_content = shuffleArray(next_week);
		this_month_content = shuffleArray(this_month);
		if (all_movies.length > 0) {
			let random_index = Math.floor(Math.random() * all_movies.length);
			initHero(all_movies[random_index]);
			setInterval(() => {
				random_index = (random_index + 1) % all_movies.length;
				initHero(all_movies[random_index]);
			}, 15000);
			resetHome();
		}
		const loader = document.getElementById("preloader");
		loader.style.opacity = "0";
		loader.style.visibility = "hidden";
		if (debug) console.log("%c[STATE] App initialization successful", "color: #2ecc71");
	} catch (error) {
		if (debug) console.error("%c[ERROR] App initialization failed", "color: #e74c3c", error);
		showToast("Critical Error", "Application failed to initialize.");
	}
}

/* openDetails */
function openDetails(item_id) {
	if (debug) console.log(`%c[FLOW] Opening detail view for ID: ${item_id}`, "color: #00d4ff");
	let item = all_movies.find((m) => m.id == item_id) || all_tv.find((m) => m.id == item_id) || all_anime.find((m) => m.id == item_id) || recent_movies.find((m) => m.id == item_id) || unreleased_movies.find((m) => m.id == item_id) || next_week_content.find((m) => m.id == item_id) || this_month_content.find((m) => m.id == item_id);
	if (!item) {
		if (debug) console.warn(`%c[STATE] Content item ${item_id} not found in state`, "color: #f39c12");
		return;
	}
	document.getElementById("detailImg").src = item.poster;
	document.getElementById("detailTitle").textContent = item.title;
	document.getElementById("detailYear").textContent = item.year;
	document.getElementById("detailGenre").textContent = item.genre;
	document.getElementById("detailDesc").textContent = item.description;
	document.getElementById("detailRating").textContent = (10 * item.rating).toFixed(0) + "% Match";
	document.getElementById("detailPlayBtn").onclick = () => {
		closeDetails();
		setTimeout(() => playVideo(item.id, item.type, item.title, item.mp4), 300);
	};
	const modal = document.getElementById("detailsModal");
	modal.classList.add("active");
	modal.querySelector(".details-container").classList.add("active");
}

/* closeDetails */
function closeDetails() {
	if (debug) console.log("%c[FLOW] Closing detail view", "color: #00d4ff");
	const modal = document.getElementById("detailsModal");
	modal.querySelector(".details-container").classList.remove("active");
	setTimeout(() => modal.classList.remove("active"), 300);
}

/* playVideo */
async function playVideo(item_id, content_type, content_title, mp4_url) {
	if (debug) console.log(`%c[FLOW] Preparing player for: ${content_title}`, "color: #00d4ff");
	const player_modal = document.getElementById("videoModal"),
		yt_frame = document.getElementById("youtubeFrame"),
		main_video = document.getElementById("mainVideo"),
		controls = document.getElementById("videoControls");
	document.getElementById("playerTitle").textContent = "NOW PLAYING: " + content_title;
	showToast("Loading", "Searching for trailer...");
	player_modal.classList.add("active");
	try {
		const trailer_key = await fetchTrailerKey(item_id, content_type);
		if (trailer_key) {
			if (debug) console.log(`%c[STATE] Launching YouTube trailer: ${trailer_key}`, "color: #2ecc71");
			showToast("Success", "Trailer found. Playing from YouTube.");
			main_video.style.display = "none";
			controls.classList.add("hidden");
			yt_frame.classList.add("active");
			yt_frame.setAttribute("allow", "autoplay; encrypted-media; gyroscope; picture-in-picture");
			yt_frame.src = `https://www.youtube.com/embed/${trailer_key}?autoplay=1&mute=0&rel=0&showinfo=0&modestbranding=1`;
		} else {
			if (debug) console.log("%c[STATE] No trailer found, falling back to local source", "color: #f39c12");
			showToast("Notice", "No trailer found. Playing demo reel.");
			yt_frame.classList.remove("active");
			yt_frame.src = "";
			main_video.style.display = "block";
			controls.classList.remove("hidden");
			main_video.src = mp4_url;
			main_video
				.play()
				.then(() => updatePlayIcon(true))
				.catch((err) => {
					if (debug) console.error("%c[ERROR] Video playback failed", "color: #e74c3c", err);
					updatePlayIcon(false);
				});
			update_interval = setInterval(updateProgressDisplay, 500);
		}
	} catch (error) {
		if (debug) console.error("%c[ERROR] playVideo logic failed", "color: #e74c3c", error);
	}
}

/* closePlayer */
function closePlayer() {
	if (debug) console.log("%c[FLOW] Closing video player", "color: #00d4ff");
	const main_video = document.getElementById("mainVideo"),
		yt_frame = document.getElementById("youtubeFrame");
	main_video.pause();
	main_video.src = "";
	yt_frame.src = "";
	yt_frame.classList.remove("active");
	document.getElementById("videoModal").classList.remove("active");
	updatePlayIcon(false);
	clearInterval(update_interval);
}

/* scrollRow */
function scrollRow(row_id, scroll_direction) {
	if (debug) console.log(`%c[FLOW] Scrolling ${row_id} to the ${scroll_direction}`, "color: #00d4ff");
	const target_row = document.getElementById(row_id),
		scroll_amount = 0.7 * target_row.clientWidth;
	target_row.scrollBy({ left: scroll_direction === "left" ? -scroll_amount : scroll_amount, behavior: "smooth" });
}

/* showToast */
function showToast(toast_title, toast_message) {
	if (debug) console.log(`%c[STATE] Showing Toast: ${toast_title} - ${toast_message}`, "color: #f39c12");
	const toast_container = document.getElementById("toastContainer"),
		toast_element = document.createElement("div");
	toast_element.className = "toast";
	toast_element.innerHTML = `
        <div class="toast-icon"><i class="fas fa-info-circle">`+`</`+`i>`+`</`+`div>
        <div class="toast-content">
            <div class="toast-title">${toast_title}`+`</`+`div>
            <div class="toast-message">${toast_message}`+`</`+`div>
        `+`</`+`div>`;
	toast_container.appendChild(toast_element);
	setTimeout(() => {
		toast_element.classList.add("hiding");
		toast_element.addEventListener("animationend", () => toast_element.remove());
	}, 5000);
}

/* openInfoModal */
function openInfoModal(content_id) {
	if (debug) console.log(`%c[FLOW] Opening info modal for: ${content_id}`, "color: #00d4ff");
	const hidden_content = document.getElementById(`content_${content_id}`),
		info_body = document.getElementById("infoBody"),
		info_modal = document.getElementById("infoModal"),
		container = info_modal.querySelector(".details-container");
	if (hidden_content) {
		info_body.style.opacity = 0;
		info_body.style.transform = "translateY(10px)";
		setTimeout(() => {
			info_body.innerHTML = hidden_content.innerHTML;
			info_body.style.transition = "opacity 0.3s ease, transform 0.3s ease";
			info_body.style.opacity = 1;
			info_body.style.transform = "translateY(0)";
		}, 100);
		info_modal.classList.add("active");
		container.classList.add("active");
	} else {
		if (debug) console.error(`%c[ERROR] Info content for ${content_id} not found in DOM`, "color: #e74c3c");
	}
}

/* closeInfoModal */
function closeInfoModal() {
	if (debug) console.log("%c[FLOW] Closing info modal", "color: #00d4ff");
	const info_modal = document.getElementById("infoModal");
	info_modal.querySelector(".details-container").classList.remove("active");
	setTimeout(() => info_modal.classList.remove("active"), 300);
}

/* scrollToSection */
function scrollToSection(section_id) {
	if (debug) console.log(`%c[FLOW] Scrolling to section: ${section_id}`, "color: #00d4ff");
	if (document.getElementById("tvSection").style.display === "none") {
		if (debug) console.log("%c[STATE] UI is in genre view, resetting Home before scroll", "color: #f39c12");
		resetHome();
		setTimeout(() => {
			const section = document.getElementById(section_id);
			if (section) section.scrollIntoView({ behavior: "smooth" });
		}, 100);
	} else {
		const section = document.getElementById(section_id);
		if (section) section.scrollIntoView({ behavior: "smooth" });
	}
}

/* shareTwitter */
function shareTwitter() {
	if (debug) console.log("%c[FLOW] Initializing Twitter sharing", "color: #00d4ff");
	const share_user = "Julibe",
		share_quotes = ["EXT. DIGITAL THEATER - NIGHT. Movieverse premieres. The screen glows. 🎬", "INT. SCREENING ROOM. Every click a scene. Every scroll a story. 🍿", "POV: You’re inside a living cinematic universe. ✨", 'THE DIRECTOR (O.S.): "Cut! This experience deserves a standing ovation." 📽️', "FADE IN: Lights dim, motion rises, magic unfolds. 🌌", "SLOW ZOOM: Each poster a portal, every interaction a scene."],
		random_quote = share_quotes[Math.floor(Math.random() * share_quotes.length)];
	let tags = ["cinema", "blockbuster", "movieverse", "premiere", "film", "hollywood", "movienight", "screening", "cinematic", "storytelling", "epic", "trailer", "director", "lightscameraaction", "filmlover"].sort(() => 0.5 - Math.random()).slice(0, 4).map((t) => t.replace(/\s+/g, ""));
	const metadata_len = 6 + share_user.length;
	for (; tags.length > 0; ) {
		const total_len = tags.reduce((sum, t) => sum + t.length + 2, 0);
		if (random_quote.length + 23 + metadata_len + total_len <= 280) break;
		tags.pop();
	}
	const tag_string = tags.join(","),
		share_url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(random_quote)}&url=${encodeURIComponent("https://codepen.io/Julibe/full/raLjMLZ/")}&hashtags=${encodeURIComponent(tag_string)}&via=${encodeURIComponent(share_user)}`;
	if (debug) console.log(`%c[OUTPUT] Twitter Share URL: ${share_url}`, "color: #2ecc71");
	window.open(share_url, "_blank");
}

/* togglePlay */
function togglePlay() {
	if (debug) console.log("%c[FLOW] Toggling video playback", "color: #00d4ff");
	const player = document.getElementById("mainVideo");
	if (player.style.display !== "none") {
		if (player.paused) {
			player.play();
			updatePlayIcon(true);
		} else {
			player.pause();
			updatePlayIcon(false);
		}
	}
}

/* updatePlayIcon */
function updatePlayIcon(is_playing) {
	if (debug) console.log(`%c[STATE] Playback icon updated: ${is_playing ? "Pause" : "Play"}`, "color: #f39c12");
	document.getElementById("playIcon").className = is_playing ? "fas fa-pause" : "fas fa-play";
	document.getElementById("centerPlayBtn").classList.toggle("visible", !is_playing);
}

/* updateProgressDisplay */
function updateProgressDisplay() {
	const player = document.getElementById("mainVideo");
	if (player.duration) {
		const percent = (player.currentTime / player.duration) * 100;
		document.getElementById("progressBar").style.width = `${percent}%`;
		const cur_min = Math.floor(player.currentTime / 60),
			cur_sec = Math.floor(player.currentTime % 60),
			dur_min = Math.floor(player.duration / 60),
			dur_sec = Math.floor(player.duration % 60);
		document.getElementById("timeDisplay").textContent = `${cur_min}:${cur_sec.toString().padStart(2, "0")} / ${dur_min}:${dur_sec.toString().padStart(2, "0")}`;
	}
}

/* seek */
function seek(click_event) {
	if (debug) console.log("%c[FLOW] Seeking video position", "color: #00d4ff");
	const player = document.getElementById("mainVideo");
	if (player.style.display === "none") return;
	const rect = click_event.currentTarget.getBoundingClientRect(),
		ratio = (click_event.clientX - rect.left) / rect.width;
	if (player.duration) {
		player.currentTime = ratio * player.duration;
		updateProgressDisplay();
		if (debug) console.log(`%c[STATE] Player seeked to ${Math.floor(player.currentTime)}s`, "color: #f39c12");
	}
}

/* toggleMute */
function toggleMute() {
	if (debug) console.log("%c[FLOW] Toggling audio mute", "color: #00d4ff");
	const player = document.getElementById("mainVideo");
	player.muted = !player.muted;
	document.getElementById("muteIcon").className = player.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

/* toggleFullscreen */
function toggleFullscreen() {
	if (debug) console.log("%c[FLOW] Toggling fullscreen mode", "color: #00d4ff");
	const container = document.getElementById("videoContainer");
	try {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			container.requestFullscreen();
		}
	} catch (error) {
		if (debug) console.error("%c[ERROR] Fullscreen toggle failed", "color: #e74c3c", error);
	}
}

/* attachTiltEffect */
function attachTiltEffect() {
	if (debug) console.log("%c[FLOW] Attaching 3D tilt interaction to cards", "color: #00d4ff");
	document.querySelectorAll(".card").forEach((card_el) => {
		card_el.addEventListener("mousemove", (move_event) => {
			const rect = card_el.getBoundingClientRect(),
				x_offset = move_event.clientX - rect.left,
				rot_x = ((move_event.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -15,
				rot_y = ((x_offset - rect.width / 2) / (rect.width / 2)) * 15;
			card_el.style.transform = `perspective(1000px) rotateX(${rot_x}deg) rotateY(${rot_y}deg) scale(1.05)`;
		});
		card_el.addEventListener("mouseleave", () => {
			card_el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
		});
	});
}

/* DOMContentLoaded */
document.addEventListener("DOMContentLoaded", () => {
	if (debug) console.log("%c[STATE] DOM ready, initializing event listeners", "color: #f39c12");
	const dot = document.querySelector(".cursor-dot"),
		outline = document.querySelector(".cursor-outline");
	window.addEventListener("mousemove", (e) => {
		dot.style.left = `${e.clientX}px`;
		dot.style.top = `${e.clientY}px`;
		outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
	});
	new MutationObserver(() => {
		document.querySelectorAll("a, button, .card, .sidebar-icon, .close-btn").forEach((el) => {
			el.onmouseenter = () => document.body.classList.add("hovering");
			el.onmouseleave = () => document.body.classList.remove("hovering");
		});
	}).observe(document.body, { childList: true, subtree: true });
});

/* window.onload */
window.onload = () => {
	if (debug) console.log("%c[FLOW] Window resources loaded, launching init sequence", "color: #00d4ff");
	initApp();
	window.onscroll = () => {
		document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
		const scroll_btn = document.getElementById("scrollTopBtn");
		window.scrollY > 500 ? scroll_btn.classList.add("visible") : scroll_btn.classList.remove("visible");
	};
};