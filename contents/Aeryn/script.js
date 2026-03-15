window.shareTwitter = function () {
	const text = `Creating amazing designs with Aeryn Studio! The UI adapts to my colors! 🎨✨`;
	const url = "https://julibe.com/pen/aeryn";
	const hashtags = "aerynstudio,webdesign,creative,html5";
	const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		text
	)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
	window.open(twitterUrl, "_blank");
};

const app = {
	state: {
		width: 800,
		height: 600,
		zoom: 1.0,
		tool: "brush",
		shapeType: "rect",
		colors: {
			primary: "#7c3aed",
			secondary: "#ffffff"
		},
		activeTarget: "primary",
		brush: {
			size: 20,
			opacity: 1.0
		},
		layers: [],
		activeId: null,
		counter: 0,
		isDrawing: false,
		startPos: {
			x: 0,
			y: 0
		},
		layerStartPos: {
			x: 0,
			y: 0
		},
		dragSrc: null
	},
	dom: {
		stage: document.getElementById("canvas-stage"),
		viewport: document.getElementById("viewport"),
		preview: null
	},

	init() {
		const pc = document.createElement("canvas");
		pc.style.zIndex = 9999;
		pc.style.pointerEvents = "none";
		pc.classList.add("layer-canvas");
		app.dom.stage.appendChild(pc);
		app.dom.preview = pc;

		app.dom.stage.addEventListener("mousedown", app.events.down);
		window.addEventListener("mousemove", app.events.move);
		window.addEventListener("mouseup", app.events.up);
		app.dom.viewport.addEventListener("scroll", app.ui.drawRulers);

		app.dom.viewport.addEventListener("wheel", (e) => {
			if (e.ctrlKey) {
				e.preventDefault();
				e.deltaY < 0 ? app.ui.zoomIn() : app.ui.zoomOut();
			}
		});

		document.getElementById("hiddenColorInput").addEventListener("input", (e) => {
			app.state.colors[app.state.activeTarget] = e.target.value;
			app.ui.updateColors();
		});

		app.io.createNewDoc(800, 600);
		app.tools.set("brush");
		app.ui.setTheme(app.state.colors.primary);
	},

	tools: {
		set(t) {
			app.state.tool = t;
			document
				.querySelectorAll(".tool-btn")
				.forEach((b) => b.classList.remove("active"));
			if (t === "shape")
				document.getElementById("btn-shape").classList.add("active");
			else document.getElementById(`btn-${t}`).classList.add("active");

			app.dom.stage.style.cursor = t === "move" ? "move" : "crosshair";
		},
		setShape(s) {
			app.state.shapeType = s;
			this.set("shape");
			const icons = {
				rect: "crop_square",
				circle: "circle",
				triangle: "change_history",
				star: "star"
			};
			document.getElementById("current-shape-icon").innerText = icons[s];
		},
		updateBrush(val, type) {
			if (type === "size") {
				app.state.brush.size = parseInt(val);
				document.getElementById("lbl-size").innerText = val;
			} else {
				app.state.brush.opacity = val / 100;
				document.getElementById("lbl-opacity").innerText = val;
			}
		}
	},

	colors: {
		pick(target) {
			app.state.activeTarget = target;
			const inp = document.getElementById("hiddenColorInput");
			inp.value = app.state.colors[target];
			inp.click();
		},
		swap() {
			const tmp = app.state.colors.primary;
			app.state.colors.primary = app.state.colors.secondary;
			app.state.colors.secondary = tmp;
			app.ui.updateColors();
		}
	},

	layers: {
		add(name, fillWhite) {
			app.state.counter++;
			const id = app.state.counter;
			const cvs = document.createElement("canvas");
			cvs.width = app.state.width;
			cvs.height = app.state.height;
			cvs.classList.add("layer-canvas");
			cvs.style.zIndex = id;
			cvs.id = `layer-${id}`;

			const ctx = cvs.getContext("2d");
			if (fillWhite) {
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, app.state.width, app.state.height);
			}

			app.dom.stage.insertBefore(cvs, app.dom.preview);

			const lObj = {
				id,
				name: name || `Layer ${id}`,
				canvas: cvs,
				ctx,
				visible: true,
				opacity: 100,
				blend: "source-over",
				x: 0,
				y: 0,
				rotation: 0
			};

			app.state.layers.push(lObj);
			this.setActive(id);
			app.ui.updateThumbnail(lObj);
		},
		delete() {
			if (app.state.layers.length <= 1) return;
			const idx = app.state.layers.findIndex((l) => l.id === app.state.activeId);
			if (idx > -1) {
				app.state.layers[idx].canvas.remove();
				app.state.layers.splice(idx, 1);
				this.setActive(app.state.layers[Math.max(0, idx - 1)].id);
			}
		},
		setActive(id) {
			app.state.activeId = id;
			const l = app.state.layers.find((x) => x.id === id);
			if (l) {
				document.getElementById("layerOpacity").value = l.opacity;
				document.getElementById("blendMode").value = l.blend;
				document.getElementById("layerRotation").value = l.rotation;
				document.getElementById("lbl-rot").innerText = l.rotation + "°";
			}
			app.ui.renderLayers();
		},
		updateProp(k, v) {
			const l = app.state.layers.find((x) => x.id === app.state.activeId);
			if (!l) return;
			if (k === "opacity") {
				l.opacity = v;
				l.canvas.style.opacity = v / 100;
			}
			if (k === "blend") {
				l.blend = v;
				l.canvas.style.mixBlendMode = v;
			}
		},
		rotate(val) {
			const l = app.state.layers.find((x) => x.id === app.state.activeId);
			if (!l) return;
			l.rotation = parseInt(val);
			document.getElementById("lbl-rot").innerText = l.rotation + "°";
			l.canvas.style.transform = `translate(${l.x}px, ${l.y}px) rotate(${l.rotation}deg)`;
		},
		align(type) {
			const l = app.state.layers.find((x) => x.id === app.state.activeId);
			if (!l) return;
			if (type === "left" || type === "right" || type === "center-x") l.x = 0;
			if (type === "top" || type === "bottom" || type === "center-y") l.y = 0;
			l.canvas.style.transform = `translate(${l.x}px, ${l.y}px) rotate(${l.rotation}deg)`;
		}
	},

	events: {
		getPos(e) {
			const rect = app.dom.stage.getBoundingClientRect();
			return {
				x: (e.clientX - rect.left) / app.state.zoom,
				y: (e.clientY - rect.top) / app.state.zoom
			};
		},
		getLocalCoords(x, y, layer) {
			let lx = x - layer.x;
			let ly = y - layer.y;

			const cx = app.state.width / 2;
			const cy = app.state.height / 2;
			const rad = -layer.rotation * (Math.PI / 180);

			let dx = lx - cx;
			let dy = ly - cy;

			let rx = dx * Math.cos(rad) - dy * Math.sin(rad);
			let ry = dx * Math.sin(rad) + dy * Math.cos(rad);

			return {
				x: rx + cx,
				y: ry + cy
			};
		},
		down(e) {
			const pos = app.events.getPos(e);
			app.state.isDrawing = true;
			app.state.startPos = pos;

			const l = app.state.layers.find((x) => x.id === app.state.activeId);
			if (!l || !l.visible) return;

			if (app.state.tool === "move") {
				app.state.layerStartPos = {
					x: l.x,
					y: l.y
				};
				return;
			}

			const ctx = l.ctx;
			const loc = app.events.getLocalCoords(pos.x, pos.y, l);

			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.lineWidth = app.state.brush.size;

			if (app.state.tool === "brush") {
				ctx.strokeStyle = app.state.colors.primary;
				ctx.globalAlpha = app.state.brush.opacity;
				ctx.globalCompositeOperation = "source-over";
				ctx.beginPath();
				ctx.moveTo(loc.x, loc.y);
				ctx.lineTo(loc.x, loc.y);
				ctx.stroke();
			} else if (app.state.tool === "eraser") {
				ctx.globalCompositeOperation = "destination-out";
				ctx.globalAlpha = app.state.brush.opacity;
				ctx.beginPath();
				ctx.moveTo(loc.x, loc.y);
				ctx.stroke();
			}
		},
		move(e) {
			if (!app.state.isDrawing) return;
			const pos = app.events.getPos(e);
			const l = app.state.layers.find((x) => x.id === app.state.activeId);
			if (!l) return;

			if (app.state.tool === "move") {
				const dx = pos.x - app.state.startPos.x;
				const dy = pos.y - app.state.startPos.y;
				l.x = app.state.layerStartPos.x + dx;
				l.y = app.state.layerStartPos.y + dy;
				l.canvas.style.transform = `translate(${l.x}px, ${l.y}px) rotate(${l.rotation}deg)`;
				return;
			}

			const loc = app.events.getLocalCoords(pos.x, pos.y, l);

			if (app.state.tool === "shape") {
				const ctx = app.dom.preview.getContext("2d");
				ctx.clearRect(0, 0, app.state.width, app.state.height);
				ctx.fillStyle = app.state.colors.primary;
				ctx.globalAlpha = app.state.brush.opacity;

				app.events.drawShape(
					ctx,
					app.state.startPos.x,
					app.state.startPos.y,
					pos.x,
					pos.y,
					app.state.shapeType
				);
			} else {
				l.ctx.lineTo(loc.x, loc.y);
				l.ctx.stroke();
			}
		},
		up(e) {
			if (!app.state.isDrawing) return;
			app.state.isDrawing = false;

			const l = app.state.layers.find((x) => x.id === app.state.activeId);

			if (app.state.tool === "shape") {
				const pos = app.events.getPos(e);
				const pc = app.dom.preview.getContext("2d");
				pc.clearRect(0, 0, app.state.width, app.state.height);

				l.ctx.fillStyle = app.state.colors.primary;
				l.ctx.globalAlpha = app.state.brush.opacity;
				l.ctx.globalCompositeOperation = "source-over";

				const locStart = app.events.getLocalCoords(
					app.state.startPos.x,
					app.state.startPos.y,
					l
				);
				const locEnd = app.events.getLocalCoords(pos.x, pos.y, l);

				app.events.drawShape(
					l.ctx,
					locStart.x,
					locStart.y,
					locEnd.x,
					locEnd.y,
					app.state.shapeType
				);
			}

			if (app.state.tool !== "move") {
				app.ui.updateThumbnail(l);
			}
		},
		drawShape(ctx, x1, y1, x2, y2, type) {
			const w = x2 - x1,
				h = y2 - y1;
			ctx.beginPath();
			if (type === "rect") ctx.fillRect(x1, y1, w, h);
			else {
				if (type === "circle") {
					const r = Math.sqrt(w * w + h * h);
					ctx.arc(x1, y1, r, 0, Math.PI * 2);
				} else if (type === "triangle") {
					ctx.moveTo(x1, y1);
					ctx.lineTo(x1 - w, y1 + h);
					ctx.lineTo(x1 + w, y1 + h);
					ctx.closePath();
				} else if (type === "star") {
					const ro = Math.sqrt(w * w + h * h),
						ri = ro * 0.4;
					for (let i = 0; i < 10; i++) {
						const a = (i * Math.PI) / 5 - Math.PI / 2;
						const r = i % 2 === 0 ? ro : ri;
						const px = x1 + r * Math.cos(a),
							py = y1 + r * Math.sin(a);
						i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
					}
					ctx.closePath();
				}
				ctx.fill();
			}
		}
	},

	ui: {
		updateColors() {
			document.getElementById("primaryColor").style.backgroundColor =
				app.state.colors.primary;
			document.getElementById("secondaryColor").style.backgroundColor =
				app.state.colors.secondary;
			app.ui.setTheme(app.state.colors.primary);
		},
		setTheme(hex) {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			const rgb = `${r}, ${g}, ${b}`;

			const root = document.documentElement;
			root.style.setProperty("--accent", hex);
			root.style.setProperty("--accent-rgb", rgb);
		},
		updateThumbnail(layer) {
			const small = document.createElement("canvas");
			small.width = 64;
			small.height = 64 * (app.state.height / app.state.width);
			const sCtx = small.getContext("2d");
			sCtx.drawImage(layer.canvas, 0, 0, small.width, small.height);
			const url = small.toDataURL();
			const thumbEl = document.querySelector(
				`.layer-item[data-id="${layer.id}"] .layer-thumb`
			);
			if (thumbEl) thumbEl.style.backgroundImage = `url(${url})`;
		},
		renderLayers() {
			const list = document.getElementById("layerList");
			list.innerHTML = "";
			app.state.layers.forEach((l, i) => (l.canvas.style.zIndex = i));

			[...app.state.layers].reverse().forEach((l) => {
				const li = document.createElement("li");
				li.className = `layer-item ${l.id === app.state.activeId ? "active" : ""}`;
				li.dataset.id = l.id;
				li.innerHTML = `
                        <span class="material-symbols-rounded vis-toggle ${
																									l.visible ? "on" : ""
																								}" onclick="event.stopPropagation(); app.layers.toggleVis(${
					l.id
				})">
                            ${l.visible ? "visibility" : "visibility_off"}
                        </span>
                        <div class="layer-thumb"></div>
                        <div class="layer-name">${l.name}</div>
                    `;
				li.onclick = () => app.layers.setActive(l.id);
				list.appendChild(li);
				app.ui.updateThumbnail(l);
			});
		},
		zoomIn() {
			if (app.state.zoom < 3.0) {
				app.state.zoom += 0.1;
				app.ui.applyZoom();
			}
		},
		zoomOut() {
			if (app.state.zoom > 0.2) {
				app.state.zoom -= 0.1;
				app.ui.applyZoom();
			}
		},
		applyZoom() {
			const z = app.state.zoom;
			app.dom.stage.style.transform = `scale(${z})`;
			document.getElementById("zoom-val").innerText = Math.round(z * 100) + "%";
			app.ui.drawRulers();
		},
		drawRulers() {
			const cT = document.getElementById("ruler-top");
			const scrollX = app.dom.viewport.scrollLeft;
			cT.width = app.dom.viewport.clientWidth;
			cT.height = 25;
			const ctxT = cT.getContext("2d");
			ctxT.fillStyle = "#0f0f11";
			ctxT.fillRect(0, 0, cT.width, cT.height);
			ctxT.strokeStyle = "#555";
			ctxT.fillStyle = "#888";
			ctxT.font = "10px sans-serif";

			const startX = Math.floor(scrollX / app.state.zoom / 50) * 50;
			for (let i = startX; i < startX + cT.width / app.state.zoom + 50; i += 50) {
				const screenX = i * app.state.zoom - scrollX + 50;
				if (screenX < 0) continue;
				ctxT.beginPath();
				ctxT.moveTo(screenX, 15);
				ctxT.lineTo(screenX, 25);
				ctxT.stroke();
				ctxT.fillText(i, screenX + 2, 12);
			}

			const cL = document.getElementById("ruler-left");
			const scrollY = app.dom.viewport.scrollTop;
			cL.width = 25;
			cL.height = app.dom.viewport.clientHeight;
			const ctxL = cL.getContext("2d");
			ctxL.fillStyle = "#0f0f11";
			ctxL.fillRect(0, 0, cL.width, cL.height);
			ctxL.strokeStyle = "#555";
			ctxL.fillStyle = "#888";
			ctxL.font = "10px sans-serif";

			const startY = Math.floor(scrollY / app.state.zoom / 50) * 50;
			for (let i = startY; i < startY + cL.height / app.state.zoom + 50; i += 50) {
				const screenY = i * app.state.zoom - scrollY + 50;
				if (screenY < 0) continue;
				ctxL.beginPath();
				ctxL.moveTo(15, screenY);
				ctxL.lineTo(25, screenY);
				ctxL.stroke();
				ctxL.save();
				ctxL.translate(12, screenY + 2);
				ctxL.rotate(-Math.PI / 2);
				ctxL.fillText(i, 0, 0);
				ctxL.restore();
			}
		},
		openModal(id) {
			document.getElementById(id).style.display = "flex";
		},
		closeModal(id) {
			document.getElementById(id).style.display = "none";
		}
	},

	io: {
		createNewDoc(w, h) {
			if (!w) {
				w = parseInt(document.getElementById("newW").value);
				h = parseInt(document.getElementById("newH").value);
				app.ui.closeModal("newDocModal");
			}
			app.state.width = w;
			app.state.height = h;
			app.dom.stage.style.width = w + "px";
			app.dom.stage.style.height = h + "px";
			app.dom.preview.width = w;
			app.dom.preview.height = h;

			app.state.layers.forEach((l) => l.canvas.remove());
			app.state.layers = [];
			app.layers.add("Background", true);
			app.ui.drawRulers();
			app.ui.updateColors();
		},
		handleFile(input) {
			if (input.files[0]) {
				const r = new FileReader();
				r.onload = (e) => {
					const img = new Image();
					img.onload = () => {
						app.layers.add("Image");
						const l = app.state.layers.find((x) => x.id === app.state.activeId);
						l.ctx.drawImage(
							img,
							0,
							0,
							Math.min(img.width, app.state.width),
							Math.min(img.height, app.state.height)
						);
						app.ui.updateThumbnail(l);
					};
					img.src = e.target.result;
				};
				r.readAsDataURL(input.files[0]);
			}
		},
		exportImage() {
			const c = document.createElement("canvas");
			c.width = app.state.width;
			c.height = app.state.height;
			const ctx = c.getContext("2d");
			const cx = c.width / 2;
			const cy = c.height / 2;

			app.state.layers.forEach((l) => {
				if (!l.visible) return;
				ctx.save();
				ctx.globalAlpha = l.opacity / 100;
				ctx.globalCompositeOperation = l.blend;

				ctx.translate(cx + l.x, cy + l.y);
				ctx.rotate((l.rotation * Math.PI) / 180);
				ctx.translate(-cx, -cy);

				ctx.drawImage(l.canvas, 0, 0);
				ctx.restore();
			});
			const link = document.createElement("a");
			link.download = "masterpiece.png";
			link.href = c.toDataURL();
			link.click();
		}
	}
};

app.init();
