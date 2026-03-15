const C = { w: 350, h: 200, pad: 20 };

// Utility to create SVG elements
const create = (t, a) => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", t);
  for (let k in a) el.setAttribute(k, a[k]);
  return el;
};

const rand = (min, max) => Math.random() * (max - min) + min;

// Generate smooth Bezier curves
function getSmoothPath(pts, close = false) {
  const iw = C.w - C.pad * 2;
  const ih = C.h - C.pad * 2;
  const xy = pts.map((val, i) => ({
    x: C.pad + (i / (pts.length - 1)) * iw,
    y: C.h - C.pad - (val / 100) * ih
  }));
  let d = `M ${xy[0].x},${xy[0].y}`;
  for (let i = 0; i < xy.length - 1; i++) {
    const p0 = xy[i - 1] || xy[i],
      p1 = xy[i],
      p2 = xy[i + 1],
      p3 = xy[i + 2] || p2;
    const t = 0.2;
    const cp1x = p1.x + (p2.x - p0.x) * t,
      cp1y = p1.y + (p2.y - p0.y) * t;
    const cp2x = p2.x - (p3.x - p1.x) * t,
      cp2y = p2.y - (p3.y - p1.y) * t;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return close
    ? d + ` L ${C.w - C.pad},${C.h - C.pad} L ${C.pad},${C.h - C.pad} Z`
    : d;
}

// 1. Draw Area Chart
function drawArea(id) {
  const svg = document.getElementById(id);
  svg.innerHTML = "";
  for (let i = 0; i <= 4; i++) {
    let y = C.pad + (i / 4) * (C.h - C.pad * 2);
    svg.append(
      create("line", {
        x1: C.pad,
        x2: C.w - C.pad,
        y1: y,
        y2: y,
        class: "grid-line"
      })
    );
  }
  const pts = Array.from({ length: 7 }, () => rand(20, 80));
  const area = create("path", {
    class: "area-fill",
    d: getSmoothPath(pts, true),
    opacity: 0
  });
  const line = create("path", { class: "line-stroke", d: getSmoothPath(pts) });
  svg.append(area, line);
  const len = line.getTotalLength();
  gsap.fromTo(
    line,
    { strokeDasharray: len, strokeDashoffset: len },
    { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }
  );
  gsap.to(area, { opacity: 1, duration: 1, delay: 0.3 });
  pts.forEach((_, i) => {
    const x = C.pad + (i / (pts.length - 1)) * (C.w - C.pad * 2);
    const y = C.h - C.pad - (_ / 100) * (C.h - C.pad * 2);
    const dot = create("circle", {
      cx: x,
      cy: y,
      r: 4,
      fill: "#fff",
      stroke: "#15803d",
      "stroke-width": 2,
      opacity: 0
    });
    svg.append(dot);
    gsap.to(dot, { opacity: 1, delay: 0.5 + i * 0.05, duration: 0.3 });
  });
}

// 2. Draw Bar Chart
function drawBar(id) {
  const svg = document.getElementById(id);
  svg.innerHTML = "";
  const n = 6,
    w = (C.w - C.pad * 2) / n;
  Array.from({ length: n }).forEach((_, i) => {
    const h = (rand(15, 85) / 100) * (C.h - C.pad * 2);
    const bar = create("rect", {
      class: "bar",
      x: C.pad + i * w + w * 0.2,
      y: C.h - C.pad,
      width: w * 0.3,
      height: 0
    });
    const h2 = h * rand(0.5, 0.9);
    const bar2 = create("rect", {
      class: "bar",
      fill: "#a3e635",
      x: C.pad + i * w + w * 0.55,
      y: C.h - C.pad,
      width: w * 0.3,
      height: 0
    });
    svg.append(bar, bar2);
    gsap.to(bar, {
      attr: { y: C.h - C.pad - h, height: h },
      duration: 0.8,
      delay: i * 0.06,
      ease: "back.out(1.0)"
    });
    gsap.to(bar2, {
      attr: { y: C.h - C.pad - h2, height: h2 },
      duration: 0.8,
      delay: i * 0.06 + 0.1,
      ease: "back.out(1.0)"
    });
  });
}

// 3. Draw Gauge
function drawGauge() {
  const path = document.getElementById("gaugePath"),
    txt = document.getElementById("gaugeText");
  const len = path.getTotalLength(),
    val = Math.round(rand(30, 95));
  path.style.strokeDasharray = len;
  gsap.fromTo(
    path,
    { strokeDashoffset: len },
    {
      strokeDashoffset: len * (1 - val / 100),
      duration: 1.5,
      ease: "power2.out"
    }
  );
  let p = { v: 0 };
  gsap.to(p, {
    v: val,
    duration: 1.5,
    onUpdate: () => (txt.textContent = Math.round(p.v) + "K")
  });
}

// 4. Draw Line Chart
function drawLine(id) {
  const svg = document.getElementById(id);
  svg.innerHTML = "";
  const mid = C.h / 2;
  svg.append(
    create("line", {
      x1: C.pad,
      x2: C.w - C.pad,
      y1: mid,
      y2: mid,
      class: "grid-line"
    })
  );
  const pts = Array.from({ length: 8 }, () => rand(15, 85));
  const path = create("path", {
    class: "line-stroke",
    stroke: "#052e16",
    d: getSmoothPath(pts)
  });
  svg.append(path);
  const len = path.getTotalLength();
  gsap.fromTo(
    path,
    { strokeDasharray: len, strokeDashoffset: len },
    { strokeDashoffset: 0, duration: 1.8, ease: "power2.out" }
  );
}

// Update Controller
function updateAll() {
  const btn = document.querySelector(".fab-refresh i");
  btn.classList.add("fa-spin");
  setTimeout(() => btn.classList.remove("fa-spin"), 1000);
  drawArea("chartArea");
  drawBar("chartBar");
  drawGauge();
  drawLine("chartLine");
}

// Engaging Social Share
window.shareTwitter = function () {
  const text = `🚀 Just watched data come alive! 
Check out this silky smooth Dashboard. No heavy libraries, just raw SVG + GSAP magic. 🪄`;
  const url = "https://julibe.com/pen/datavue";
  const hashtags = "webdev,css,javascript,gsap,dataviz";
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags)}`;
  window.open(twitterUrl, "_blank");
};

// Init
updateAll();
setInterval(updateAll, 6000);
