const TMDB_API_KEY = "bd9d2f67ef4b822e9119b69bbcae6810";
const LOGO_DEV_KEY = "pk_EXf8y6slSIOA9EeftjJTqA";
const config_trakt = {
	clientId: "1c6be210546e565dbe60f831ad8a9cb699e2416b8d7629d3f3217d08251f9ab1",
	username: "Julibe",
	apiBase: "https://api.trakt.tv",
	headers: {
		"Content-Type": "application/json",
		"trakt-api-version": "2",
		"trakt-api-key":
			"1c6be210546e565dbe60f831ad8a9cb699e2416b8d7629d3f3217d08251f9ab1",
		"User-Agent": "Watchfolio/1.0"
	}
};
const config_tmdb = {
	base_url: "https://api.themoviedb.org/3",
	image_base_url: "https://image.tmdb.org/t/p",
	language: "en-US",
	sizes: {
		poster: "/w500",
		thumb: "/original",
		profile: "/w185"
	}
};

async function testTraktConnection() {
	try {
		const response = await fetch(
			`${config_trakt.apiBase}/users/${config_trakt.username}?extended=full`,
			{
				headers: config_trakt.headers
			}
		);
		if (!response.ok) throw new Error(`Trakt returned ${response.status}`);
		return {
			success: true,
			message: "Trakt API is reachable"
		};
	} catch (error) {
		let message = `Trakt connection failed: ${error.message}`;
		if (error.message.includes("Failed to fetch")) {
			message = "Trakt connection failed";
		}
		return {
			success: false,
			message: message
		};
	}
}
async function testTMDBConnection() {
	try {
		const response = await fetch(
			`${config_tmdb.base_url}/configuration?api_key=${TMDB_API_KEY}`
		);
		if (!response.ok) throw new Error(`TMDB returned ${response.status}`);
		return {
			success: true,
			message: "TMDB API is reachable"
		};
	} catch (error) {
		return {
			success: false,
			message: `TMDB connection failed: ${error.message}`
		};
	}
}
async function testLogoDevConnection() {
	try {
		const response = await fetch(
			`https://img.logo.dev/imdb.com?token=${LOGO_DEV_KEY}`,
			{
				method: "HEAD"
			}
		);
		if (response.status === 404)
			return {
				success: true,
				message: "Logo.dev API is reachable"
			};
		if (!response.ok) throw new Error(`Logo.dev returned ${response.status}`);
		return {
			success: true,
			message: "Logo.dev API is reachable"
		};
	} catch (error) {
		return {
			success: false,
			message: `Logo.dev connection failed: ${error.message}`
		};
	}
}

async function fetchWithErrorHandling(url, options = {}, sourceName) {
	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(
				`${sourceName} returned ${response.status}: ${response.statusText}`
			);
		}
		return await response.json();
	} catch (error) {
		throw new Error(`Failed to fetch from ${sourceName}: ${error.message}`);
	}
}

const app = {
	data: {
		history: [],
		ratings: [],
		profile: null
	},
	filterState: {
		mode: "rolling",
		currentDate: new Date(),
		start: null,
		end: null
	},
	init: async function () {
		console.log("Watchfolio START");
		this.calculateDateRange();
		this.updateDateDisplay();
		document.getElementById("loader").innerHTML = `
                    <div style="max-width:500px; width:90%;">
                        <h2 style="margin-bottom:20px;">Checking connections...</h2>
                        <ul class="test-list">
                            <li id="test-trakt">
                                <span class="status-icon"><span class="spinner-small" style="width:20px;height:20px;margin:0;"></span></span>
                                Trakt API
                                <span class="message">testing...</span>
                            </li>
                            <li id="test-tmdb">
                                <span class="status-icon"><span class="spinner-small" style="width:20px;height:20px;margin:0;"></span></span>
                                TMDB API
                                <span class="message">testing...</span>
                            </li>
                            <li id="test-logodev">
                                <span class="status-icon"><span class="spinner-small" style="width:20px;height:20px;margin:0;"></span></span>
                                Logo.dev API
                                <span class="message">testing...</span>
                            </li>
                        </ul>
                    </div>
                `;
		const traktTest = await testTraktConnection();
		this.updateTestResult("trakt", traktTest);
		const tmdbTest = await testTMDBConnection();
		this.updateTestResult("tmdb", tmdbTest);
		const logoTest = await testLogoDevConnection();
		this.updateTestResult("logodev", logoTest);
		const allTests = [traktTest, tmdbTest, logoTest];
		const failedTests = allTests.filter((t) => !t.success);
		if (failedTests.length > 0) {
			let errorHtml = `
                        <div style="text-align:center; max-width:500px; padding:20px;">
                            <span class="material-icons-round" style="font-size:4rem; color:var(--accent);">error</span>
                            <h2>Connection Issues Detected</h2>
                            <ul class="test-list" style="margin:20px 0;">
                    `;
			allTests.forEach((test, index) => {
				const name = index === 0 ? "Trakt" : index === 1 ? "TMDB" : "Logo.dev";
				const icon = test.success ? "✅" : "❌";
				errorHtml += `<li class="${
					test.success ? "passing" : "failing"
				}"><span class="status-icon">${icon}</span> ${name} <span class="message">${
					test.message
				}</span></li>`;
			});
			errorHtml += `
                            </ul>
                        
                            <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; background:var(--accent); border:none; border-radius:30px; cursor:pointer;">Retry</button>
                        </div>
                    `;
			document.getElementById("loader").innerHTML = errorHtml;
			return;
		}
		document.getElementById("loader").innerHTML = `
                    <div class="spinner"></div>
                    <p>Loading your Watchfolio...</p>
                `;
		try {
			let profile, history, ratings;
			try {
				profile = await fetchWithErrorHandling(
					`${config_trakt.apiBase}/users/${config_trakt.username}?extended=full`,
					{
						headers: config_trakt.headers
					},
					"Trakt (profile)"
				);
			} catch (e) {
				throw new Error(`Trakt profile error: ${e.message}`);
			}
			try {
				history = await fetchWithErrorHandling(
					`${config_trakt.apiBase}/users/${config_trakt.username}/history?limit=100&extended=full`,
					{
						headers: config_trakt.headers
					},
					"Trakt (history)"
				);
			} catch (e) {
				throw new Error(`Trakt history error: ${e.message}`);
			}
			try {
				ratings = await fetchWithErrorHandling(
					`${config_trakt.apiBase}/users/${config_trakt.username}/ratings?limit=100&rating=8-10&extended=full`,
					{
						headers: config_trakt.headers
					},
					"Trakt (ratings)"
				);
			} catch (e) {
				throw new Error(`Trakt ratings error: ${e.message}`);
			}
			this.renderProfile(profile);
			const historyWithImages = await this.enrichWithImages(history);
			const ratingsWithImages = await this.enrichWithImages(ratings);
			this.data.history = historyWithImages;
			this.data.ratings = ratingsWithImages;
			this.applyFilter();
			document.getElementById("loader").classList.add("hidden");
			this.showToast(`Connected: ${profile.username}`);
			setTimeout(() => attachTiltEffect(), 500);
		} catch (err) {
			console.error("Init error:", err);
			document.getElementById("loader").innerHTML = `
                        <div style="text-align:center; max-width:500px; padding:20px;">
                            <span class="material-icons-round" style="font-size:4rem; color:var(--accent);">error</span>
                            <h2>Something went wrong</h2>
                            <p style="color:var(--text-secondary);">${err.message}</p>
                            <p style="margin-top:20px;">Possible causes:</p>
                            <ul style="text-align:left;">
                                <li>Running the app from <code>file://</code> – use a local server (e.g., Live Server in VS Code).</li>
                                <li>Ad blocker interfering – try disabling it.</li>
                                <li>Network issues – check your connection.</li>
                            </ul>
                            <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; background:var(--accent); border:none; border-radius:30px; cursor:pointer;">Retry</button>
                        </div>
                    `;
		}
	},
	updateTestResult: function (testId, result) {
		const li = document.getElementById(`test-${testId}`);
		if (!li) return;
		const iconSpan = li.querySelector(".status-icon");
		const messageSpan = li.querySelector(".message");
		if (result.success) {
			iconSpan.innerHTML = "✅";
			li.classList.add("passing");
		} else {
			iconSpan.innerHTML = "❌";
			li.classList.add("failing");
		}
		messageSpan.textContent = result.message;
	},
	setFilter: function (type) {
		if (type === "default") this.setMode("rolling");
		else if (type === "month") this.setMode("month");
		else this.setMode("all");
		document
			.querySelectorAll("nav a")
			.forEach((a) => a.classList.remove("active"));
		event.target.closest("a").classList.add("active");
	},
	setMode: function (mode) {
		this.filterState.mode = mode;
		this.filterState.currentDate = new Date();
		document
			.querySelectorAll(".mode-selector button")
			.forEach((b) => b.classList.remove("active"));
		document.getElementById(`mode-${mode}`).classList.add("active");
		this.calculateDateRange();
		this.updateDateDisplay();
		this.applyFilter();
	},
	moveTime: function (direction) {
		const d = this.filterState.currentDate;
		if (this.filterState.mode === "year")
			d.setFullYear(d.getFullYear() + direction);
		else if (this.filterState.mode === "month")
			d.setMonth(d.getMonth() + direction);
		else if (this.filterState.mode === "rolling")
			d.setFullYear(d.getFullYear() + direction);
		this.calculateDateRange();
		this.updateDateDisplay();
		this.applyFilter();
	},
	calculateDateRange: function () {
		const state = this.filterState;
		const d = new Date(state.currentDate);
		if (state.mode === "year") {
			state.start = new Date(d.getFullYear(), 0, 1);
			state.end = new Date(d.getFullYear(), 11, 31, 23, 59, 59);
		} else if (state.mode === "month") {
			state.start = new Date(d.getFullYear(), d.getMonth(), 1);
			state.end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
		} else if (state.mode === "rolling") {
			state.end = new Date(d);
			const start = new Date(d);
			start.setFullYear(d.getFullYear() - 1);
			state.start = start;
		} else {
			state.start = null;
			state.end = null;
		}
	},
	updateDateDisplay: function () {
		const main = document.getElementById("date-display-main");
		const sub = document.getElementById("date-display-sub");
		const d = this.filterState.currentDate;
		if (this.filterState.mode === "year") {
			main.textContent = d.getFullYear();
			sub.textContent = "Jan 1 - Dec 31";
		} else if (this.filterState.mode === "month") {
			main.textContent = d.toLocaleString("default", {
				month: "long",
				year: "numeric"
			});
			sub.textContent = "Monthly View";
		} else if (this.filterState.mode === "rolling") {
			main.textContent = `${this.filterState.start.getFullYear()} - ${this.filterState.end.getFullYear()}`;
			sub.textContent = "Past 365 Days";
		} else {
			main.textContent = "All Time";
			sub.textContent = "Complete History";
		}
	},
	applyFilter: function () {
		const { start, end } = this.filterState;
		const filterFn = (dateStr) =>
			!start || !end
				? true
				: new Date(dateStr) >= start && new Date(dateStr) <= end;
		const filteredHistory = this.data.history.filter((item) =>
			filterFn(item.watched_at)
		);
		const filteredRatings = this.data.ratings.filter((item) =>
			filterFn(item.rated_at)
		);
		const topMovies = filteredRatings.filter((i) => i._info.type === "movie");
		const topSeries = filteredRatings.filter(
			(i) => i._info.type === "show" || i._info.type === "episode"
		);
		this.renderHero(filteredHistory[0]);
		this.renderSidebar(filteredHistory.slice(1));
		this.renderSlider(topMovies, "movies-track", "rating");
		this.renderSlider(topSeries, "series-track", "rating");
		setTimeout(() => attachTiltEffect(), 100);
	},
	showDetails: async function (tmdbId, mediaType, title) {
		const modal = document.getElementById("detail-modal");
		const content = document.getElementById("modal-content");
		content.innerHTML = '<div class="spinner-small"></div>';
		modal.classList.add("active");
		if (!tmdbId) {
			content.innerHTML = `<p style="color: var(--text-secondary);">No TMDB ID available for this title.</p>`;
			return;
		}
		try {
			const type =
				mediaType === "show" || mediaType === "episode" ? "tv" : "movie";
			const [details, external, videos, watch, credits] = await Promise.all([
				fetch(
					`${config_tmdb.base_url}/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids,videos`
				).then((r) => r.json()),
				fetch(
					`${config_tmdb.base_url}/${type}/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
				)
					.then((r) => r.json())
					.catch(() => ({})),
				fetch(
					`${config_tmdb.base_url}/${type}/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
				)
					.then((r) => r.json())
					.catch(() => ({
						results: []
					})),
				fetch(
					`${config_tmdb.base_url}/${type}/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`
				)
					.then((r) => r.json())
					.catch(() => ({
						results: {}
					})),
				fetch(
					`${config_tmdb.base_url}/${type}/${tmdbId}/credits?api_key=${TMDB_API_KEY}`
				)
					.then((r) => r.json())
					.catch(() => ({
						cast: [],
						crew: []
					}))
			]);
			const englishTitle = details.title || details.name || "Unknown";
			const originalTitle = details.original_title || details.original_name || "";
			const imdbId = details.imdb_id || external.imdb_id;
			const tvdbId = external.tvdb_id;
			const traktUrl = `https://trakt.tv/search/tmdb/${tmdbId}?type=${type}`;
			const rtSearchUrl = `https://www.rottentomatoes.com/search?search=${encodeURIComponent(
				englishTitle
			)}`;
			const logoDev = (domain) =>
				`https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}`;
			let html = `
                        <div class="modal-header">
                            <div class="modal-poster">
                                ${
																																	details.poster_path
																																		? `<img src="${config_tmdb.image_base_url}/w300${details.poster_path}" alt="${englishTitle}">`
																																		: '<span class="material-icons-round" style="font-size:4rem; margin:40px;">movie</span>'
																																}
                            </div>
                            <div class="modal-title">
                                <div class="english-title">${englishTitle}</div>
                                ${
																																	originalTitle && originalTitle !== englishTitle
																																		? `<div class="original-title">${originalTitle}</div>`
																																		: ""
																																}
                                ${
																																	details.tagline
																																		? `<div class="tagline">${details.tagline}</div>`
																																		: ""
																																}
                                <div class="meta-details">
                                    <span><span class="material-icons-round">schedule</span> ${
																																					details.runtime ||
																																					details.episode_run_time?.[0] ||
																																					"—"
																																				} min</span>
                                    <span><span class="material-icons-round">star</span> TMDB ${
																																					details.vote_average
																																						? details.vote_average.toFixed(1)
																																						: "—"
																																				}</span>
                                    <span><span class="material-icons-round">calendar_today</span> ${
																																					(
																																						details.release_date ||
																																						details.first_air_date ||
																																						""
																																					).slice(0, 4) || "—"
																																				}</span>
                                </div>
                            </div>
                        </div>
                    `;
			const trailer = videos.results?.find(
				(v) => v.type === "Trailer" && v.site === "YouTube"
			);
			html += `<div class="action-bar">`;
			if (trailer) {
				html += `<a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank" class="trailer-btn"><span class="material-icons-round">smart_display</span> Trailer</a>`;
			}
			html += `<div class="external-links">`;
			if (imdbId)
				html += `<a href="https://www.imdb.com/title/${imdbId}" target="_blank"><img src="${logoDev(
					"imdb.com"
				)}" alt="IMDb" onerror="this.onerror=null; this.src='https://via.placeholder.com/20?text=IMDb';"> IMDb</a>`;
			if (tvdbId)
				html += `<a href="https://www.thetvdb.com/?id=${tvdbId}&tab=series" target="_blank"><img src="${logoDev(
					"thetvdb.com"
				)}" alt="TVDb" onerror="this.onerror=null; this.src='https://via.placeholder.com/20?text=TVDb';"> TVDb</a>`;
			html += `<a href="${traktUrl}" target="_blank"><img src="${logoDev(
				"trakt.tv"
			)}" alt="Trakt" onerror="this.onerror=null; this.src='https://via.placeholder.com/20?text=Trakt';"> Trakt</a>`;
			html += `<a href="${rtSearchUrl}" target="_blank"><img src="${logoDev(
				"rottentomatoes.com"
			)}" alt="Rotten Tomatoes" onerror="this.onerror=null; this.src='https://via.placeholder.com/20?text=RT';"> Rotten Tomatoes</a>`;
			html += `</div></div>`;
			html += `
                        <div class="tabs">
                            <button class="tab-btn active" onclick="app.switchTab(event, 'stream')">Stream</button>
                            <button class="tab-btn" onclick="app.switchTab(event, 'cast')">Cast</button>
                            <button class="tab-btn" onclick="app.switchTab(event, 'crew')">Crew</button>
                            <button class="tab-btn" onclick="app.switchTab(event, 'production')">Production</button>
                        </div>
                        <div id="tab-stream" class="tab-content active">`;
			const providers = watch.results?.CO?.flatrate || watch.results?.US?.flatrate;
			if (providers && providers.length) {
				html += `<div class="providers-grid">`;
				providers.forEach((p) => {
					const logo = config_tmdb.image_base_url + "/original" + p.logo_path;
					html += `<div class="provider"><img src="${logo}" alt="${p.provider_name}"><span>${p.provider_name}</span></div>`;
				});
				html += `</div>`;
			} else {
				html += `<p style="color:var(--text-secondary);">No streaming information available.</p>`;
			}
			html += `</div>`;
			html += `<div id="tab-cast" class="tab-content">`;
			if (credits.cast?.length) {
				html += `<div class="cast-grid">`;
				credits.cast.slice(0, 20).forEach((c) => {
					const profile = c.profile_path
						? config_tmdb.image_base_url + "/w185" + c.profile_path
						: "https://via.placeholder.com/80?text=No+Image";
					html += `<div class="cast-card"><img src="${profile}" alt="${c.name}"><strong>${c.name}</strong><span>${c.character}</span></div>`;
				});
				html += `</div>`;
			} else {
				html += `<p style="color:var(--text-secondary);">No cast information available.</p>`;
			}
			html += `</div>`;
			html += `<div id="tab-crew" class="tab-content">`;
			const keyJobs = [
				"Director",
				"Producer",
				"Executive Producer",
				"Writer",
				"Screenplay",
				"Creator"
			];
			const keyCrew = credits.crew?.filter((p) => keyJobs.includes(p.job)) || [];
			if (keyCrew.length) {
				html += `<div class="crew-grid">`;
				keyCrew.slice(0, 20).forEach((p) => {
					const profile = p.profile_path
						? config_tmdb.image_base_url + "/w185" + p.profile_path
						: "https://via.placeholder.com/80?text=No+Image";
					html += `<div class="crew-card"><img src="${profile}" alt="${p.name}"><strong>${p.name}</strong><span>${p.job}</span></div>`;
				});
				html += `</div>`;
			} else {
				html += `<p style="color:var(--text-secondary);">No crew information available.</p>`;
			}
			html += `</div>`;
			html += `<div id="tab-production" class="tab-content">`;
			if (details.production_companies && details.production_companies.length) {
				html += `<div class="companies-grid">`;
				details.production_companies.forEach((c) => {
					let logoSrc = "";
					if (c.logo_path)
						logoSrc = config_tmdb.image_base_url + "/w200" + c.logo_path;
					else {
						const domain = c.name.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
						logoSrc = `https://img.logo.dev/${domain}?token=${LOGO_DEV_KEY}`;
					}
					html += `<div class="company"><img src="${logoSrc}" alt="${c.name}" loading="lazy" onerror="this.onerror=null; this.src='https://via.placeholder.com/60?text=Logo';"> <span>${c.name}</span></div>`;
				});
				html += `</div>`;
			} else {
				html += `<p style="color:var(--text-secondary);">No production companies listed.</p>`;
			}
			html += `</div>`;
			content.innerHTML = html;
		} catch (e) {
			content.innerHTML = `<p style="color:var(--text-secondary)">Error loading details: ${e.message}</p>`;
			console.error(e);
		}
	},
	switchTab: function (event, tabId) {
		document
			.querySelectorAll(".tab-btn")
			.forEach((btn) => btn.classList.remove("active"));
		event.target.classList.add("active");
		document
			.querySelectorAll(".tab-content")
			.forEach((tab) => tab.classList.remove("active"));
		document.getElementById(`tab-${tabId}`).classList.add("active");
	},
	closeModal: function () {
		document.getElementById("detail-modal").classList.remove("active");
	},
	fetchTrakt: async function (endpoint) {
		const res = await fetch(`${config_trakt.apiBase}${endpoint}`, {
			headers: config_trakt.headers
		});
		if (!res.ok) throw new Error(`Trakt API Error ${res.status}`);
		return await res.json();
	},
	enrichWithImages: async function (items) {
		const uniqueItems = [];
		const map = new Map();
		for (const item of items) {
			const info = this.extractInfo(item);
			const enriched = {
				...item,
				_info: info,
				_images: {
					poster: null,
					backdrop: null
				}
			};
			uniqueItems.push(enriched);
			if (info.tmdbId && !map.has(info.tmdbId)) {
				map.set(info.tmdbId, this.fetchTmdbImage(info.type, info.tmdbId));
			}
		}
		await Promise.all(map.values());
		for (const item of uniqueItems) {
			if (item._info.tmdbId) {
				try {
					const tmdbData = await map.get(item._info.tmdbId);
					if (tmdbData) {
						if (tmdbData.poster_path)
							item._images.poster =
								config_tmdb.image_base_url +
								config_tmdb.sizes.poster +
								tmdbData.poster_path;
						if (tmdbData.backdrop_path)
							item._images.backdrop =
								config_tmdb.image_base_url +
								config_tmdb.sizes.thumb +
								tmdbData.backdrop_path;
					}
				} catch (e) {}
			}
		}
		return uniqueItems;
	},
	fetchTmdbImage: async function (type, tmdbId) {
		const endpointType = type === "show" || type === "episode" ? "tv" : "movie";
		const url = `${config_tmdb.base_url}/${endpointType}/${tmdbId}?api_key=${TMDB_API_KEY}`;
		const res = await fetch(url);
		if (!res.ok) return null;
		return await res.json();
	},
	renderProfile: function (data) {
		document.getElementById("user-name").textContent = data.name || data.username;
		const avatar =
			data.images?.avatar?.full ||
			"https://ui-avatars.com/api/?name=" + data.username;
		document.getElementById("user-avatar").src = avatar;
	},
	getOnClick: function (info) {
		return `onclick="app.showDetails(${info.tmdbId || null}, '${
			info.type
		}', '${info.title.replace(/'/g, "\\'")}')"`;
	},
	renderHero: function (item) {
		const container = document.getElementById("hero-section");
		if (!item) {
			container.innerHTML = `<div class="overlay"><h1>No Activity in this period</h1></div>`;
			return;
		}
		const info = item._info;
		const img = item._images.backdrop || item._images.poster;
		let bgStyle = img
			? `background-image: url('${img}');`
			: `background: linear-gradient(to bottom, #222, #111)`;
		const html = `
                    <div class="hero-bg" style="${bgStyle}"></div>
                    <div class="overlay" ${this.getOnClick(
																					info
																				)} style="cursor: pointer; pointer-events: auto;">
                        <div class="year">${info.year}</div>
                        <h1>${info.title}</h1>
                        <div class="meta"><span class="rating"><span class="material-icons-round">star</span> Trakt Activity</span><span class="badge">${info.type.toUpperCase()}</span><span>Last Watched: ${new Date(
			item.watched_at
		).toLocaleDateString()}</span></div>
                        <div class="play-btn"><span class="material-icons-round">play_arrow</span></div>
                    </div>
                `;
		container.innerHTML = html;
	},
	renderSidebar: function (items) {
		const container = document.getElementById("watchlist-container");
		container.innerHTML = "";
		if (!items || items.length === 0) {
			container.innerHTML =
				'<div style="padding:10px; color:var(--text-secondary)">No other activity.</div>';
			return;
		}
		items.forEach((item) => {
			const info = item._info;
			const img = item._images.backdrop || item._images.poster;
			let thumbHtml = img
				? `<img src="${img}" alt="${info.title}">`
				: `<div class="generated-poster">${info.title}</div>`;
			const html = `<div class="card-mini card" ${this.getOnClick(
				info
			)}><div class="thumb-wrapper">${thumbHtml}<div class="time-badge">${
				info.type === "episode" ? "EP" : "MOV"
			}</div></div><div class="info"><h3>${
				info.title
			}</h3><div class="meta-row"><span class="rating">${
				info.year
			}</span></div></div></div>`;
			container.innerHTML += html;
		});
	},
	renderSlider: function (items, elementId, source) {
		const container = document.getElementById(elementId);
		container.innerHTML = "";
		if (items.length === 0) {
			container.innerHTML =
				'<div style="color:var(--text-secondary); padding:20px">No items found.</div>';
			return;
		}
		items.forEach((item) => {
			const info = item._info;
			const img = item._images.poster;
			let ratingDisplay =
				source === "rating"
					? `<span class="rating-val"><span class="material-icons-round">star</span> ${item.rating}</span>`
					: `<span class="rating-val">${info.year}</span>`;
			let imgHtml = img
				? `<img src="${img}" alt="${info.title}">`
				: `<div class="title-art">${info.title}</div>`;
			const html = `<div class="poster-card card" ${this.getOnClick(
				info
			)}><div class="img-container">${imgHtml}</div><h4>${
				info.title
			}</h4><div class="meta">${ratingDisplay}<span>${info.type.toUpperCase()}</span></div></div>`;
			container.innerHTML += html;
		});
	},
	extractInfo: function (item) {
		if (item.movie)
			return {
				title: item.movie.title,
				year: item.movie.year,
				type: "movie",
				id: item.movie.ids.trakt,
				tmdbId: item.movie.ids.tmdb
			};
		else if (item.show) {
			let title = item.show.title;
			if (item.episode) title += `: ${item.episode.title}`;
			return {
				title: title,
				year: item.show.year,
				type: "episode",
				id: item.show.ids.trakt,
				tmdbId: item.show.ids.tmdb
			};
		} else if (item.type === "show")
			return {
				title: item.show.title,
				year: item.show.year,
				type: "show",
				id: item.show.ids.trakt,
				tmdbId: item.show.ids.tmdb
			};
		return {
			title: "Unknown",
			year: "????",
			type: "unknown",
			id: 0,
			tmdbId: null
		};
	},
	showToast: function (msg, duration = 3000) {
		const toast = document.getElementById("toast");
		document.getElementById("toast-message").textContent = msg;
		toast.classList.add("active");
		setTimeout(() => toast.classList.remove("active"), duration);
	}
};

function scrollContainer(id, direction) {
	const container = document.getElementById(id);
	const scrollAmount = 350;
	container.scrollBy({
		left: direction === "left" ? -scrollAmount : scrollAmount,
		behavior: "smooth"
	});
}

function toggleTheme() {
	document.body.classList.toggle("light-mode");
}

function attachTiltEffect() {
	const ambientBg = document.getElementById("ambient-bg");
	document.querySelectorAll(".card").forEach((card) => {
		card.addEventListener("mousemove", (e) => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
			const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
			card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
		});
		card.addEventListener("mouseleave", () => {
			card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
		});
		card.addEventListener("mouseenter", () => {
			const img = card.querySelector("img");
			if (img && img.src) ambientBg.style.backgroundImage = `url('${img.src}')`;
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const dot = document.querySelector(".cursor-dot");
	const outline = document.querySelector(".cursor-outline");
	window.addEventListener("mousemove", (e) => {
		dot.style.left = `${e.clientX}px`;
		dot.style.top = `${e.clientY}px`;
		outline.animate(
			{
				left: `${e.clientX}px`,
				top: `${e.clientY}px`
			},
			{
				duration: 500,
				fill: "forwards"
			}
		);
	});
	new MutationObserver(() => {
		document
			.querySelectorAll(
				"a, button, .card, .sidebar-icon, .close-btn, .poster-card, .card-mini"
			)
			.forEach((el) => {
				el.onmouseenter = () => document.body.classList.add("hovering");
				el.onmouseleave = () => document.body.classList.remove("hovering");
			});
	}).observe(document.body, {
		childList: true,
		subtree: true
	});
	app.init();
});

window.onscroll = () => {
	document
		.getElementById("navbar")
		.classList.toggle("scrolled", window.scrollY > 50);
	const btn = document.getElementById("scrollTopBtn");
	if (window.scrollY > 500) btn.classList.add("visible");
	else btn.classList.remove("visible");
};
