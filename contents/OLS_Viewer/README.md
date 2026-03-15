---
title: OLS Sustainability | Profile Viewer
slogan: Measuring Corporate Impact, One Step at a Time
slug: ols-viewer
extract: Transform static ESG data into a living, breathing 3D experience. A dashboard that merges particle physics with precise analytics for the modern enterprise.
description: Interactive dashboard visualizing sustainability data via WebGL particle morphing, Chart.js analytics, and Google Sheets integration.

## Pricing & Estimates
time_concept: 12
time_design: 18
time_coding: 45
time_testing: 10
time_polish: 12

price_rate: 45
price_currency: USD
price_hours_day: 8

## Code Structure
difficulty: high
technologies:
- Three.js
- WebGL Shaders
- Google Apps Script
- Chart.js
- HTML5/CSS3
- jsPDF
- html2canvas
- LocalStorage

category: application

## Metadata
tags:
- DataViz
- Sustainability
- Dashboard
- ThreeJS
- Corporate
- ESG
- Glassmorphism
emojis:
- 🌿
- 💠
- 📊
- 📉
- 🌍
- 🧪
- 🕶️
- 📜
- 💾
- ✨
keywords:
- Sustainability
- Dashboard
- Particles
- WebGL
- Visualization
- Analytics
- Reporting
- Corporate
- Environment
- Interface
hashtags:
- '#SustainabilityTech'
- '#DataArt'
- '#ThreeJS'
- '#ESGReporting'
- '#WebDevelopment'
- '#CreativeCoding'
- '#DashboardDesign'
- '#TechForGood'
- '#FrontendDev'
- '#InteractiveDesign'

## Call to Action
view_btn: View Dashboard
read_btn: Read Case Study

## Design
colors:
- '#0f3d3e'
- '#e6f4f1'
- '#10b981'

## System
favorite: false
created: 2026-02-02 17:05:00 -05:00
version: 1.0.0
iteration: 1
fmContentType: Content
date: 2026-02-02 17:05:00 -05:00
published: true
---

# OLS Sustainability | Profile Viewer
### Measuring Corporate Impact, One Step at a Time

Sustainability reporting is often synonymous with density—dense text, dense tables, and dense PDFs that collect digital dust. The **OLS Sustainability | Profile Viewer** reimagines this paradigm. It asks a simple question: What if we could *feel* the weight of the data? By turning abstract metrics into a fluid, interactive particle system, this project transforms the obligatory corporate report into an engaging narrative of progress and impact.

This tool was conceived to bridge the gap between hard data and stakeholder engagement. It fetches live Environmental, Social, and Governance (ESG) scores from a Google Sheet and renders them as a dynamic cloud of points that morph into meaningful icons and scores. It is not just about compliance; it is about clarity.

> "Data is just a click away, but information is still a luxury." — Unknown

### The Philosophy (Theory)
At its heart, this project is an exercise in **Data Physicalization** within a digital space. We are moving away from the "flatland" of standard web design into spatial interfaces. The use of particles represents the collective nature of corporate effort—thousands of small actions (particles) coming together to form a cohesive score (the shape).

This approach leans heavily on the capabilities of modern browsers to handle **WebGL**. We are utilizing the GPU not for gaming, but for business intelligence. This intersection creates a "scrollytelling" experience where the user drives the narrative, exploring data at their own pace rather than passively consuming a static document.

For more context on these concepts, check out:
*   [The Art of Data Visualization](https://www.pbs.org/offbook/episode/the-art-of-data-visualization/) by PBS Off Book.
*   [Three.js Documentation](https://threejs.org/) for the underlying 3D engine.
*   [Chart.js Samples](https://www.chartjs.org/docs/latest/samples/) for standard statistical rendering.
*   [Google Apps Script Guides](https://developers.google.com/apps-script) for the backend logic.
*   [The Beauty of Data Visualization](https://www.ted.com/talks/david_mccandless_the_beauty_of_data_visualization) by David McCandless.

### The Hurdles (Challenges)
*   **Asynchronous Data Morphing:** Ensuring the particle system waits for the Google Sheets API to return data before attempting to calculate target positions for the morphing animation.
*   **Canvas Capture:** Generating a clean PDF report from a scene that combines a hardware-accelerated WebGL canvas (which clears its buffer every frame) and standard HTML DOM elements.
*   **Theme Continuity:** The system requires instant color palette swapping based on the selected category (e.g., turning the whole UI "Green" for Environmental or "Blue" for Water Security) without reloading the page.
*   **Performance:** Rendering 9,000+ interactive particles with bloom effects while simultaneously managing heavy Chart.js instances on the same thread.

### The Fixes (Solutions)
*   **The Wait-Chain:** I implemented a robust `async/await` pattern in the `loadData` function. The 3D scene initialization is deferred until the data model is fully populated and verified.
*   **Buffer Preservation:** To solve the PDF blank canvas issue, the WebGL renderer is initialized with `preserveDrawingBuffer: true` momentarily during the export process.
*   **CSS Variable Proxy:** A central function `updateThemeColors` acts as a proxy, updating CSS Custom Properties (`--dynamic-theme_normal`) which are then read back by JavaScript to update the canvas uniforms and Chart.js datasets in real-time.
*   **Layer Management:** A simple but effective visibility toggle (`hidden_layer` class) pauses animations in the non-active view (3D vs. Charts) to save GPU resources.

### The Outcome (Impact)
The **OLS Profile Viewer** turns the auditing process into a visual journey. For the client, it means being able to present their sustainability goals in a boardroom with a tool that looks as futuristic as their ambitions.

Practically, the **PDF Export** functionality creates a tangible artifact from the digital experience. A user can filter down to specific "Social" metrics, visualize the gaps in the charts, and instantly download a branded report to share with investors or the public, streamlining the workflow from analysis to publication.

### The Boundaries (Scope)
This application focuses on **Visualization and Reporting**.
*   **Includes:** Secure login via Google Sheet lookup, 3D data visualization, multi-type statistical charting (Radar, Bar, Line, Polar), dynamic theming, and client-side PDF generation.
*   **Excludes:** Data entry or editing. The system treats the Google Sheet as an immutable source of truth to maintain data integrity. It is a read-only viewer designed for presentation and analysis.

## Technical Deep Dive (Technical Details)
The application is built as a Single Page Application (SPA) without a framework, relying on vanilla JavaScript to orchestrate libraries.

The "wow" factor comes from **Three.js**. A custom `ShaderMaterial` is used for the particles to create a wave-like distortion effect and a bloom post-processing pass adds a futuristic glow. The morphing logic works by sampling pixel data from a hidden 2D canvas where the target text/icon is drawn, converting valid pixels into 3D target coordinates.

Simultaneously, **Chart.js** handles the "serious" data analysis. When a user switches views, the app destroys the previous chart instance and rebuilds it with the current category's data, ensuring animations trigger freshly every time.

### Tech Stack (Technologies)
This project leverages a hybrid stack of creative coding tools and business logic APIs.

*   **Three.js**: The backbone of the immersive 3D view.
*   **Google Apps Script**: Serves as the "backendless" database API.
*   **Chart.js**: Provides the detailed analytical graphs.
*   **GLSL**: Custom shader code for particle movement and appearance.
*   **html2canvas / jsPDF**: The engine for generating the downloadable reports.

### Roadmap (Future Improvements)
*   **Motion Controls:** Implement gyroscope support for mobile devices so moving the phone rotates the particle cloud.
*   **Historical Data:** Add a timeline slider to morph the particles between current scores and previous years' data.
*   **Server-Side PDF:** Offload the PDF generation to a server function to support higher resolutions and multi-page reports.

### Known Issues (Known Bugs)
*   **Font Rendering:** On some high-DPI displays, the hidden canvas used for particle sampling may create slightly offset targets due to pixel density scaling.
*   **Bloom Intensity:** The bloom effect can be resource-intensive on mobile devices, potentially lowering frame rates.

## How to Use (Instructions)
1.  **Login:** Use the demo credentials (`demo@ols.com` / `123456`).
2.  **Navigate:** Select a category from the sidebar (e.g., General, Environmental).
3.  **Visuals:** Toggle the "3D" button in the top toolbar to see the particle morphing effect.
4.  **Analysis:** Toggle the "Analysis" button to view Radar and Bar charts.
5.  **Report:** Click "Descargar PDF" in the sidebar to save the current view.

## Conclusion
The **OLS Sustainability | Profile Viewer** demonstrates that corporate tools don't have to be sterile. By fusing art, math, and data, we can create interfaces that invite exploration and foster a deeper understanding of the metrics that matter. It is a step toward a future where sustainability data is not just reported, but experienced.

## Additional Credits
*   **[Three.js](https://threejs.org/)**: The engine making the web 3D.
*   **[Chart.js](https://www.chartjs.org/)**: For beautiful, responsive charts.
*   **[Google Fonts](https://fonts.google.com/)**: For the typography (Inter & Montserrat).
*   **[Material Icons](https://fonts.google.com/icons)**: For the UI iconography.
*   **[Google Apps Script](https://workspace.google.com/products/apps-script/)**: For the serverless data connection.

## TL;DR Version
The **OLS Profile Viewer** is a high-end web dashboard that turns corporate sustainability data into interactive art. It uses a **Google Sheets** backend to feed live scores into a **Three.js** particle system that morphs into icons and text. It features secure login, dynamic color theming based on ESG categories, and a dual-view system that switches between 3D visualizations and detailed **Chart.js** graphs. It includes a built-in **PDF generator** for creating instant reports.

## About Julibe
I’m Julibe. Follow me at [@julibe](https://julibe.com/ "Julibe - Crafting Digital Experiences!"). I’m always exploring new ways to create meaningful experiences. If you have an exciting idea, a challenge worth solving, or want to collaborate, don’t hesitate to reach out. Let’s connect. Together, we can shape ideas into something memorable and impactful.

*   [Web](https://julibe.com/ "Visit Julibe's Portfolio")
*   [GitHub](https://github.com/julibe "Check out Julibe's Code")
*   [WhatsApp](https://julibe.com/whatsapp "Chat with Julibe")
*   [X (Twitter)](https://twitter.com/julibe "Follow Julibe's Updates")
*   [Instagram](https://instagram.com/julibe "See Julibe's Design Work")
*   [Email](mailto:mail@julibe.com "Contact Julibe directly")

**Copyright © 2026 - [https://julibe.com](https://julibe.com/)**