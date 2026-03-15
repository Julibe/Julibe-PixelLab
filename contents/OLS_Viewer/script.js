import * as THREE from "https://esm.sh/three";
    import {
      OrbitControls
    } from "https://esm.sh/three/addons/controls/OrbitControls.js";
    import {
      EffectComposer
    } from "https://esm.sh/three/addons/postprocessing/EffectComposer.js";
    import {
      RenderPass
    } from "https://esm.sh/three/addons/postprocessing/RenderPass.js";
    import {
      UnrealBloomPass
    } from "https://esm.sh/three/addons/postprocessing/UnrealBloomPass.js";
    import {
      AfterimagePass
    } from "https://esm.sh/three/addons/postprocessing/AfterimagePass.js";
    import {
      OutputPass
    } from "https://esm.sh/three/addons/postprocessing/OutputPass.js";
    const debug = true;
    console.clear();
    const SCRIPT_ID = "AKfycbxYwkSkU9TTaded7KjqoF6HcdZF3rHQzO2Rj8bXnMWQ82TUXawHtBH7Tl1-p6e45gPZ";
    const BASE_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;
    const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    let state = {
      user: null,
      merged_data: [],
      categories: [],
      active_category: -1,
      view_mode: "3d",
      charts: [],
      current_chart_type: "radar"
    };
    let scene, camera, renderer, composer, controls, particles, clock;
    let particle_count = 9000;
    let current_positions, target_positions;
    let is_morphing = false;
    let morph_start_time = 0;
    let current_bg_color = new THREE.Color();
    let target_bg_color = new THREE.Color();
    let resize_observer;
    const els = {
      login: document.getElementById("login_view"),
      app: document.getElementById("app_shell"),
      loader: document.getElementById("loader"),
      email: document.getElementById("email_in"),
      pass: document.getElementById("pass_in"),
      sidebarContent: document.getElementById("sidebar_content"),
      sidebarTitle: document.getElementById("sidebar_title"),
      btnBack: document.getElementById("btn_back"),
      main: document.getElementById("main_area"),
      vizTitle: document.getElementById("viz_title"),
      layer3D: document.getElementById("layer_3d"),
      layerCharts: document.getElementById("layer_charts"),
      btnView3D: document.getElementById("btn_view_3d"),
      btnViewDetail: document.getElementById("btn_view_detail"),
      subToolbar: document.getElementById("sub_toolbar"),
      chartTitle: document.getElementById("chart_title")
    };
    window.addEventListener("DOMContentLoaded", () => {
      if (debug) console.log("%c[Init] Booting application...", "color: cyan; font-weight: bold;");
      checkSession();
    });
    async function checkSession() {
      if (debug) console.log("%c[Session] Checking localStorage...", "color: orange;");
      try {
        const saved = localStorage.getItem("ols_user");
        if (!saved) return;
        const user_obj = JSON.parse(saved);
        if (user_obj && user_obj.email) {
          state.user = user_obj;
          setLoader(true);
          document.getElementById("u_name").innerText = state.user.name;
          document.getElementById("u_role").innerText = `ID: ${state.user.id}`;
          await loadData();
          renderSidebarCategories();
          switchView("app");
        }
      } catch (e) {
        if (debug) console.error("[Session] Restore failed:", e);
        localStorage.removeItem("ols_user");
      } finally {
        setLoader(false);
      }
    }
    window.attemptLogin = async () => {
      const email = els.email.value.trim();
      const pass = els.pass.value;
      if (!email || !pass) return showToast("Ingresa tus credenciales", "error");
      if (debug) console.log(`%c[Auth] Attempting login for ${email}...`, "color: orange; font-weight: bold;");
      setLoader(true);
      try {
        const url = `${BASE_URL}?sheet=Users&column=email&value=${encodeURIComponent(email)}`;
        const users = await fetchGeneric(url, "User Verification");
        const user = users.find((u) => {
          const u_email = u.email || u.Email;
          const u_pass = u.password || u.Password;
          return u_email === email && atob(u_pass) === pass;
        });
        if (user) {
          if (debug) console.log("%c[Auth] Login successful.", "color: green;");
          state.user = {
            name: user.name || user.Name,
            id: user.id || user.ID || user.Id,
            photo: user.photo || user.Photo,
            email: user.email || user.Email
          };
          localStorage.setItem("ols_user", JSON.stringify(state.user));
          await loadData();
          renderSidebarCategories();
          switchView("app");
        } else {
          showToast("Credenciales incorrectas", "error");
        }
      } catch (e) {
        if (debug) console.error("[Auth] Login error:", e);
        showToast("Error de conexión", "error");
      } finally {
        setLoader(false);
      }
    };

    function updateThemeColors(color_name) {
      if (debug) console.log(`%c[Theme] Mapping dynamic vars for palette: ${color_name}`, "color: purple;");
      const root = document.documentElement;
      const target = color_name ? color_name.toLowerCase().trim() : "green";
      const palette_keys = ["green", "cyan", "orange", "red", "blue", "purple", "pink", "yellow", "black"];
      const active = palette_keys.find((k) => target.includes(k)) || "green";
      root.style.setProperty("--dynamic-theme_light", `var(--${active}_light)`);
      root.style.setProperty("--dynamic-theme_normal", `var(--${active}_normal)`);
      root.style.setProperty("--dynamic-theme_dark", `var(--${active}_dark)`);
      root.style.setProperty("--dynamic-bg", `var(--${active}_dark)`);
      if (debug) console.log(`%c[Theme] Vars updated to palette: ${active}`, "color: purple;");
    }
    async function loadData() {
      if (debug) console.log("%c[Data] Fetching user records...", "color: blue; font-weight: bold;");
      const url = `${BASE_URL}?sheet=AnwsersDetail&column=user&value=${encodeURIComponent(state.user.name)}`;
      const raw_data = await fetchGeneric(url, "Main Data Fetch");
      if (debug) {
        console.log("%c[Data] Raw Data Result Table:", "color: #bada55; font-weight: bold;");
        console.table(raw_data);
      }
      state.merged_data = raw_data;
      const unique_cats = [...new Set(state.merged_data.map((x) => x.category || x.Category))];
      state.categories = unique_cats.map((c, i) => {
        if (!c) return null;
        const cat_rows = state.merged_data.filter((x) => (x.category || x.Category) === c);
        const total_score = cat_rows.reduce((sum, row) => sum + (Number(row.score || row.Score) || 0), 0);
        const first_row = cat_rows[0];
        const raw_color = (first_row.color || first_row.Color || "green").toLowerCase().replace("_palette", "");
        const raw_icon = first_row.icon || first_row.Icon || "analytics";
        const questions = cat_rows.map((r) => ({
          ...r,
          icon: r.icon || r.Icon || raw_icon,
          color: (r.color || r.Color || raw_color).toLowerCase().replace("_palette", ""),
          question: r.question || r.Question,
          answer: r.answer || r.Answer,
          score: Number(r.score || r.Score) || 0
        }));
        return {
          name: c,
          score: total_score,
          icon: raw_icon,
          color: raw_color,
          questions
        };
      }).filter(Boolean);
      if (debug) console.log("%c[Data] Processed Categories List:", "color: blue;", state.categories);
      document.getElementById("u_name").innerText = state.user.name;
      document.getElementById("u_role").innerText = `ID: ${state.user.id}`;
      const avatar_el = document.getElementById("u_av");
      if (state.user.photo) {
        avatar_el.style.backgroundImage = `url('${state.user.photo}')`;
        avatar_el.innerText = "";
      } else {
        avatar_el.innerText = state.user.name.charAt(0);
      }
    }

    function renderSidebarCategories() {
      if (debug) console.log("%c[UI] Rendering Category List with Border Colors", "color: #3b82f6");
      els.btnBack.classList.add("hidden");
      els.sidebarTitle.innerText = "CATEGORÍAS";
      updateThemeColors("green");
      let html = `                <div class="nav_item ${																	state.active_category === -1 ? "active" : ""																}" onclick="selectGlobal()" style="border-color: var(--green_light)">                    <span class="material-icons-round big_icon" style="color: var(--green_normal)">public</span>                    <div style="flex: 1">                        <span style="display: block;">General</span>                    </div>                    <div class="indicator" style="background: var(--green_accent);"></div>                </div>            `;
      html += state.categories.map((cat, idx) => `                <div class="nav_item ${																	state.active_category === idx ? "active" : ""																}" onclick="selectCategory(${idx})" style="border-color: var(--${				cat.color			}_light)">                    <span class="material-icons-round big_icon" style="color: var(--${																					cat.color																				}_normal)">${cat.icon}</span>                    <div style="flex: 1">                        <span style="display: block;">${cat.name}</span>                        <span style="font-size: 0.75rem; color: var(--text_muted); font-weight: 500;">${																									cat.score																								} pts</span>                    </div>                    <div class="indicator" style="background: var(--${																					cat.color																				}_normal);"></div>                </div>            `).join("");
      els.sidebarContent.innerHTML = html;
    }

    function renderSidebarDetails(cat_index) {
      if (debug) console.log(`%c[UI] Rendering Details List for: ${cat_index}`, "color: #3b82f6");
      const cat = state.categories[cat_index];
      els.btnBack.classList.remove("hidden");
      els.sidebarTitle.innerText = cat.name.toUpperCase();
      let html = `                <div class="nav_item active" onclick="selectCategoryOverview(${cat_index})" style="margin-bottom: 1.5rem; border-color: var(--${cat.color}_light); background: white; border-radius: 16px; padding: 1.25rem;">                    <span class="material-icons-round big_icon" style="color: var(--${cat.color}_normal)">${cat.icon}</span>                    <div style="flex: 1">                        <span style="font-size: 0.75rem; font-weight: 800; color: var(--text_muted); letter-spacing: 1px;">RESUMEN TOTAL</span>                        <span style="display: block; font-size: 1.1rem; font-weight: 800; color: var(--text_dark);">${cat.name}</span>                    </div>                    <span style="font-weight: 800; color: var(--dynamic-theme_normal)">${cat.score} pts</span>                </div>            `;
      html += cat.questions.map((q, i) => {
        const item_color = q.color || cat.color;
        let badge_class = q.score >= 5 ? "high" : q.score >= 3 ? "med" : "low";
        if (q.score <= 5) {
          badge_class = q.score >= 4 ? "high" : q.score >= 2 ? "med" : "low";
        }
        return `                <div class="qa_card" onclick="selectQuestion(${cat_index}, ${i})" style="border-color: var(--${item_color}_light); animation-delay: ${				i * 0.05			}s">                    <div class="qa_top">                        <span class="material-icons-round big_icon" style="color: var(--${item_color}_normal)">${				q.icon || cat.icon			}</span>                        <h5><strong>Q${i + 1}:</strong> ${q.question}</h5>                    </div>                    <div class="ans_block">${q.answer}</div>                    <div class="score_badge ${badge_class}">                        <span class="material-icons-round" style="font-size:14px">star</span> ${																									q.score																								} pts                    </div>                </div>            `;
      }).join("");
      els.sidebarContent.innerHTML = html || "<p style='color:#999; padding: 1rem;'>No hay detalles disponibles.</p>";
    }
    window.toggleView = (mode) => {
      if (debug) console.log(`%c[UI] Switching Primary View to: ${mode}`, "color: purple;");
      state.view_mode = mode;
      if (mode === "3d") {
        els.main.classList.remove("analysis-active");
        els.layer3D.classList.remove("hidden_layer");
        els.layerCharts.classList.add("hidden_layer");
        els.btnView3D.classList.add("active");
        els.btnViewDetail.classList.remove("active");
        els.subToolbar.classList.remove("visible");
      } else {
        els.main.classList.add("analysis-active");
        els.layer3D.classList.add("hidden_layer");
        els.layerCharts.classList.remove("hidden_layer");
        els.btnView3D.classList.remove("active");
        els.btnViewDetail.classList.add("active");
        els.subToolbar.classList.add("visible");
        renderCharts();
      }
    };
    window.setChartType = (type, btn) => {
      if (debug) console.log(`%c[UI] Set Chart Type: ${type}`, "color: purple;");
      state.current_chart_type = type;
      if (btn) {
        document.querySelectorAll("#sub_toolbar .pill_sm").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      }
      renderCharts();
    };

    function renderCharts() {
      if (debug) console.log("%c[Charts] Redrawing Instance", "color: #10b981");
      const ctx_el = document.getElementById("main_chart");
      if (!ctx_el) return;
      if (state.charts.length > 0) {
        state.charts.forEach((c) => c.destroy());
        state.charts = [];
      }
      const animation_config = {
        duration: 1200,
        easing: "easeOutElastic",
        delay: (context) => context.dataIndex * 50
      };
      const common_opts = {
        maintainAspectRatio: false,
        responsive: true,
        animation: animation_config,
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      };
      let labels = [],
        data_values = [],
        colors = [],
        label_str = "";
      if (state.active_category === -1) {
        labels = state.categories.map((c) => c.name);
        data_values = state.categories.map((c) => c.score);
        colors = state.categories.map((c) => getCssVar(`--${c.color}_normal`));
        label_str = "Puntaje por Área";
      } else {
        const cat = state.categories[state.active_category];
        labels = cat.questions.map((_, i) => `Q${i + 1}`);
        data_values = cat.questions.map((q) => q.score);
        colors = getCssVar("--dynamic-theme_normal");
        label_str = "Puntaje por Pregunta";
      }
      let chart_config;
      if (state.current_chart_type === "radar") {
        els.chartTitle.innerText = "Mapa de Competencias";
        chart_config = {
          type: "radar",
          data: {
            labels,
            datasets: [{
              label: label_str,
              data: data_values,
              borderColor: Array.isArray(colors) ? colors[0] : colors,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderWidth: 3,
              pointBackgroundColor: Array.isArray(colors) ? colors : colors,
              pointRadius: 4
            }]
          },
          options: common_opts
        };
      } else if (state.current_chart_type === "bar") {
        els.chartTitle.innerText = "Ranking de Desempeño";
        chart_config = {
          type: "bar",
          data: {
            labels,
            datasets: [{
              label: label_str,
              data: data_values,
              backgroundColor: colors,
              borderRadius: 8
            }]
          },
          options: { ...common_opts,
            indexAxis: "y"
          }
        };
      } else if (state.current_chart_type === "line") {
        els.chartTitle.innerText = "Tendencia de Datos";
        chart_config = {
          type: "line",
          data: {
            labels,
            datasets: [{
              label: label_str,
              data: data_values,
              borderColor: Array.isArray(colors) ? colors[0] : colors,
              tension: 0.4,
              fill: true,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderWidth: 4
            }]
          },
          options: { ...common_opts,
            scales: {
              y: {
                min: 0
              }
            }
          }
        };
      } else {
        els.chartTitle.innerText = "Distribución de Impacto";
        chart_config = {
          type: "polarArea",
          data: {
            labels,
            datasets: [{
              data: data_values,
              backgroundColor: colors
            }]
          },
          options: common_opts
        };
      }
      requestAnimationFrame(() => {
        state.charts.push(new Chart(ctx_el, chart_config));
      });
    }
    window.selectGlobal = () => {
      if (debug) console.log("%c[Input] Return to Global", "color: #10b981");
      state.active_category = -1;
      updateThemeColors("green");
      renderSidebarCategories();
      updateViz(-1);
      if (state.view_mode === "detail") renderCharts();
    };
    window.selectCategory = (idx) => {
      if (debug) console.log(`%c[Input] Open Category: ${idx}`, "color: #3b82f6");
      state.active_category = idx;
      updateViz(idx);
      renderSidebarDetails(idx);
      if (state.view_mode === "detail") renderCharts();
    };
    window.selectCategoryOverview = (idx) => {
      if (debug) console.log(`%c[Input] Retrigger Category Overview: ${idx}`, "color: orange;");
      const cat = state.categories[idx];
      updateThemeColors(cat.color);
      els.vizTitle.innerText = cat.name;
      els.main.style.backgroundColor = getCssVar("--dynamic-theme_dark");
      if (scene) {
        target_bg_color.set(getCssVar("--dynamic-theme_dark"));
        generateCompositeParticles(cat.icon, cat.score.toString());
      }
      if (state.view_mode === "detail") renderCharts();
    };
    window.selectQuestion = (c_idx, q_idx) => {
      const cat = state.categories[c_idx];
      const q = cat.questions[q_idx];
      if (debug) console.log(`%c[Input] Selected Question: ${q.question}`, "color: #3b82f6");
      updateThemeColors(q.color || cat.color);
      els.vizTitle.innerHTML = "<h4>" + q.question + "</h4><p>" + q.answer + "</p>";
      els.main.style.backgroundColor = getCssVar("--dynamic-theme_dark");
      if (scene) {
        target_bg_color.set(getCssVar("--dynamic-theme_dark"));
        generateCompositeParticles(q.icon || cat.icon, q.score.toString());
      }
    };
    window.showCategories = () => selectGlobal();

    function updateViz(idx) {
      if (debug) console.log(`%c[3D] Updating viz frame: ${idx}`, "color: #3b82f6");
      let data, bg_hex, icon_char;
      if (idx === -1) {
        const global_score = state.categories.reduce((acc, c) => acc + c.score, 0);
        data = {
          name: "General",
          score: global_score
        };
        updateThemeColors("green");
        bg_hex = getCssVar("--dynamic-theme_dark");
        icon_char = "public";
      } else {
        const cat = state.categories[idx];
        data = cat;
        updateThemeColors(cat.color);
        bg_hex = getCssVar("--dynamic-theme_dark");
        icon_char = cat.icon;
      }
      els.vizTitle.innerText = data.name;
      els.main.style.backgroundColor = bg_hex;
      if (scene) {
        target_bg_color.set(bg_hex);
        generateCompositeParticles(icon_char, data.score.toString());
      }
    }

    function initThree() {
      if (debug) console.log("%c[3D] Booting Scene", "color: cyan;");
      const container = document.getElementById("canvas-container");
      if (!container.clientWidth || !container.clientHeight) {
        requestAnimationFrame(initThree);
        return;
      }
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      clock = new THREE.Clock();
      scene = new THREE.Scene();
      const init_bg = getCssVar("--green_dark");
      current_bg_color.set(init_bg);
      target_bg_color.set(init_bg);
      scene.background = current_bg_color;
      scene.fog = new THREE.FogExp2(init_bg, 0.001);
      camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 3000);
      camera.position.set(0, 0, 1000);
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      resize_observer = new ResizeObserver(() => {
        const new_w = container.offsetWidth;
        const new_h = container.offsetHeight;
        if (new_w && new_h && camera && renderer) {
          camera.aspect = new_w / new_h;
          camera.updateProjectionMatrix();
          renderer.setSize(new_w, new_h);
          if (composer) composer.setSize(new_w, new_h);
        }
      });
      resize_observer.observe(container);
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.minDistance = 500;
      controls.maxDistance = 1400;
      controls.minPolarAngle = Math.PI / 2.8;
      controls.maxPolarAngle = Math.PI / 1.7;
      controls.minAzimuthAngle = -Math.PI / 3.5;
      controls.maxAzimuthAngle = Math.PI / 3.5;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.0;
      controls.enablePan = false;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(particle_count * 3);
      const cols = new Float32Array(particle_count * 3);
      current_positions = new Float32Array(particle_count * 3);
      target_positions = new Float32Array(particle_count * 3);
      for (let i = 0; i < particle_count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1500;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 1500;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 1500;
        current_positions[i * 3] = pos[i * 3];
        current_positions[i * 3 + 1] = pos[i * 3 + 1];
        current_positions[i * 3 + 2] = pos[i * 3 + 2];
        cols[i * 3] = 1;
        cols[i * 3 + 1] = 1;
        cols[i * 3 + 2] = 1;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time: {
            value: 0
          }
        },
        vertexShader: `                    attribute vec3 color; varying vec3 vColor; uniform float time;                    void main() {                        vColor = color;                        vec3 p = position;                        float wave = (length(p) < 800.0) ? sin(time * 0.8 + p.x * 0.005) * 5.0 : 0.0;                        vec4 mv = modelViewMatrix * vec4(p + vec3(0, wave, 0), 1.0);                        gl_PointSize = (3000.0 / -mv.z);                         gl_Position = projectionMatrix * mv;                    }                `,
        fragmentShader: `                    varying vec3 vColor;                    void main() {                        if(length(vColor) < 0.1) discard;                         float d = distance(gl_PointCoord, vec2(0.5));                        if(d > 0.5) discard;                        gl_FragColor = vec4(vColor, 1.0 - smoothstep(0.2, 0.5, d));                     }                `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      particles = new THREE.Points(geo, mat);
      scene.add(particles);
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.4, 0.2, 0.1));
      composer.addPass(new OutputPass());
      updateViz(-1);
      animate();
    }

    function generateCompositeParticles(icon_char, score_text) {
      if (debug) console.log(`%c[3D] Morphing into: ${icon_char} ${score_text}`, "color: #3b82f6");
      const w = 512;
      const h = 256;
      const cnv = document.createElement("canvas");
      cnv.width = w;
      cnv.height = h;
      const ctx = cnv.getContext("2d");
      ctx.font = '160px "Material Icons Round"';
      const icon_w = ctx.measureText(icon_char).width;
      ctx.font = 'bold 160px "Montserrat"';
      const score_w = ctx.measureText(score_text).width;
      const gap = 60;
      const total_w = icon_w + gap + score_w;
      const start_x = (w - total_w) / 2;
      ctx.font = '160px "Material Icons Round"';
      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(icon_char, start_x, h / 2);
      ctx.font = 'bold 160px "Montserrat"';
      ctx.fillText(score_text, start_x + icon_w + gap, h / 2);
      const img_data = ctx.getImageData(0, 0, w, h).data;
      const valid_pixels = [];
      for (let y = 0; y < h; y += 2) {
        for (let x = 0; x < w; x += 2) {
          if (img_data[(y * w + x) * 4 + 3] > 100) {
            valid_pixels.push({
              x: (x - w / 2) * 2.5,
              y: -(y - h / 2) * 2.5
            });
          }
        }
      }
      const colors = particles.geometry.attributes.color.array;
      for (let i = 0; i < particle_count; i++) {
        if (i < valid_pixels.length) {
          const p = valid_pixels[i];
          target_positions[i * 3] = p.x;
          target_positions[i * 3 + 1] = p.y;
          target_positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 1;
          colors[i * 3 + 2] = 1;
        } else {
          const radius = 900 + Math.random() * 500;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          target_positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          target_positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          target_positions[i * 3 + 2] = radius * Math.cos(phi);
          colors[i * 3] = 0.3;
          colors[i * 3 + 1] = 0.3;
          colors[i * 3 + 2] = 0.3;
        }
      }
      particles.geometry.attributes.color.needsUpdate = true;
      startMorph();
    }

    function startMorph() {
      is_morphing = true;
      morph_start_time = clock.getElapsedTime();
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i++) current_positions[i] = pos[i];
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!clock || !controls) return;
      const t = clock.getElapsedTime();
      controls.update();
      particles.material.uniforms.time.value = t;
      particles.rotation.y = Math.sin(t * 0.2) * 0.1;
      current_bg_color.lerp(target_bg_color, 0.08);
      scene.background = current_bg_color;
      scene.fog.color = current_bg_color;
      if (is_morphing) {
        const elapsed = t - morph_start_time;
        let alpha = elapsed / 2.0;
        if (alpha > 1) {
          alpha = 1;
          is_morphing = false;
        }
        const ease = 1 - Math.pow(1 - alpha, 3);
        const pos = particles.geometry.attributes.position.array;
        for (let i = 0; i < particle_count * 3; i++) {
          pos[i] = current_positions[i] + (target_positions[i] - current_positions[i]) * ease;
        }
        particles.geometry.attributes.position.needsUpdate = true;
      }
      composer.render();
    }
    window.exportPDF = async () => {
      if (debug) console.log("%c[Action] Starting PDF Export", "color: orange");
      setLoader(true);
      const total_score = state.categories.reduce((acc, c) => acc + c.score, 0);
      document.getElementById("pdf_date").innerText = new Date().toLocaleDateString();
      document.getElementById("pdf_client").innerText = `Cliente: ${state.user.name}`;
      document.getElementById("pdf_total").innerText = total_score;
      document.getElementById("pdf_body").innerHTML = state.categories.map((c) => `                <div class="pdf_row">                    <span style="font-weight:bold; color:var(--dynamic-theme_normal)">${c.name}</span>                    <span>${c.score} pts</span>                </div>            `).join("");
      const pdf_charts = document.getElementById("pdf_charts_container");
      pdf_charts.innerHTML = "";
      if (state.charts.length > 0) {
        state.charts.forEach((chart) => {
          const img = document.createElement("img");
          // He corregido la llamada a toDataURL aquí:
          img.src = chart.canvas.toDataURL();
          img.className = "pdf_chart_img";
          pdf_charts.appendChild(img);
        });
      }
      const el = document.getElementById("pdf_stage");
      el.style.left = "0";
      el.style.zIndex = "9999";
      try {
        const canvas = await html2canvas(el, {
          scale: 2
        });
        const img_data = canvas.toDataURL("image/png");
        const {
          jsPDF
        } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");
        const pdf_w = pdf.internal.pageSize.getWidth();
        const pdf_h = (canvas.height * pdf_w) / canvas.width;
        pdf.addImage(img_data, "PNG", 0, 0, pdf_w, pdf_h);
        pdf.save(`OLS_Report_${state.user.id}.pdf`);
        showToast("PDF Descargado", "success");
      } catch (e) {
        showToast("Error al exportar PDF", "error");
      } finally {
        el.style.left = "-9999px";
        setLoader(false);
      }
    };
    window.logout = () => {
      if (debug) console.log("%c[Auth] Logout", "color: orange");
      localStorage.removeItem("ols_user");
      state.user = null;
      state.merged_data = [];
      state.categories = [];
      els.email.value = "";
      els.pass.value = "";
      switchView("login");
    };
    window.switchView = (id) => {
      if (debug) console.log(`%c[UI] Navigation to ${id}`, "color: #3b82f6");
      document.querySelectorAll(".view_container").forEach((v) => v.classList.remove("active"));
      if (id === "app") {
        document.getElementById("app_shell").classList.add("active");
        if (!scene) setTimeout(initThree, 100);
      } else {
        document.getElementById("login_view").classList.add("active");
      }
    };

    function setLoader(state) {
      els.loader.classList.toggle("active", state);
    }
    async function fetchGeneric(url, label) {
      try {
        if (debug) console.log(`%c[API] Requesting ${label}`, "color: #3b82f6");
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text);
        return json.status === "success" ? json.data : [];
      } catch (error) {
        console.error(`%c[API] Error: ${label}`, "color: #ef4444", error);
        return [];
      }
    }

    function showToast(message, type) {
      const t = document.createElement("div");
      t.className = `toast ${type} active`;
      t.innerHTML = `<span class="material-icons-round">${		type === "success" ? "check_circle" : "error"	}</span> ${message}`;
      document.getElementById("toast_container").appendChild(t);
      setTimeout(() => {
        t.classList.remove("active");
        setTimeout(() => t.remove(), 500);
      }, 3000);
    }