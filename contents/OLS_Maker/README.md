---
title: OLS Sustainability | Profile Maker
slogan: Measuring Corporate Impact, One Step at a Time
slug: ols-maker
extract: A polished, glassmorphism-styled SPA for assessing corporate sustainability profiles. Features real-time sync, dynamic dashboards, and a seamless user experience.
description: A comprehensive web application for evaluating and visualizing corporate sustainability metrics with a modern interface.

## Pricing & Estimates
time_concept: 12
time_design: 16
time_coding: 40
time_testing: 8
time_polish: 8

price_rate: 31
price_currency: USD
price_hours_day: 8

## Code Structure
difficulty: medium
technologies:
- JavaScript
- HTML5
- CSS
- SVG
- LocalStorage
- Fetch API
- Google Apps Script

category: application

## Metadata
tags:
- Sustainability
- Dashboard
- Corporate
- Glassmorphism
- UX
- Questionnaire
- Visualization
emojis:
- 🌿
- 📊
- 🌍
- ♻️
- 🏢
- 🚀
- 📉
- ✅
- 🔋
- 💡
- 📝
- 🍃
keywords:
- sustainability
- profile
- corporate
- assessment
- dashboard
- green
- ecology
- management
- questionnaire
- evaluation
hashtags:
- '#Sustainability'
- '#GreenTech'
- '#CorporateResponsibility'
- '#WebDev'
- '#DashboardDesign'
- '#Glassmorphism'
- '#VanillaJS'
- '#EcoFriendly'
- '#UXDesign'
- '#OpenSource'

## Call to Action
view_btn: Start Assessment
read_btn: View Case Study

## Design
colors:
- '#e6f4f1'
- '#0f3d3e'
- '#41a376'

## System
favorite: false
created: 2026-02-02 16:49:00 -05:00
version: 1.0.0
iteration: 1
fmContentType: Content
date: 2026-02-02 16:49:00 -05:00
published: true
---

# OLS Sustainability Profile
### Measuring Corporate Impact, One Step at a Time

Welcome to the future of corporate self-assessment. The **OLS Sustainability Profile** is not just a form; it's a digital ecosystem designed to make the daunting task of environmental evaluation feel seamless, engaging, and remarkably human. In a world drowning in spreadsheets, this project brings a breath of fresh air—literally and figuratively.

## Project Overview (Project Overview)
This application transforms the rigorous process of sustainability auditing into a streamlined, interactive journey. Instead of confronting users with endless static tables, the system guides them through a category-based wizard, visualizing progress in real-time with smooth animations and instant feedback. It bridges the gap between complex data collection and intuitive user experience, proving that enterprise tools don't have to be boring.

At its core, the project is a Single Page Application (SPA) that functions as a corporate sustainability profiler. Users authenticate to access a personalized dashboard where they can track their completion status across various environmental verticals. The system utilizes a serverless architecture, communicating directly with a Google Apps Script backend to fetch questions and sync answers, ensuring that every click is recorded and analyzed without the overhead of heavy server infrastructure.

The inspiration for this project came from witnessing the friction companies face when trying to adopt greener practices. The friction wasn't usually in the *will* to change, but in the *mechanism* of measuring it. I wanted to build a tool that felt less like an audit and more like a progress tracker for a better future—a digital mirror reflecting a company's ecological footprint with clarity and elegance.

> "The greatest threat to our planet is the belief that someone else will save it." — **Robert Swan**

### Theory
The concept of sustainability reporting has evolved significantly from voluntary CSR (Corporate Social Responsibility) initiatives to rigorous **[ESG (Environmental, Social, and Governance)](https://www.investopedia.com/terms/e/environmental-social-and-governance-esg-criteria.asp)** criteria used by investors globally. Historically, these assessments were manual, paper-based, and prone to error. The shift towards **[Digital Transformation in Sustainability](https://www.weforum.org/agenda/2021/01/digital-transformation-sustainability/)** allows for real-time data tracking and greater transparency.

This project draws upon the principles of **[Gamification in Business](https://www.interaction-design.org/literature/topics/gamification)**. By breaking down a massive task (auditing an entire company) into small, manageable "quests" (categories) and providing immediate visual rewards (progress rings, completion badges), we leverage the **[Zeigarnik Effect](https://psychology.fandom.com/wiki/Zeigarnik_effect)**—the psychological tendency to remember uncompleted tasks—to drive user engagement and completion rates.

Technologically, the application embraces the **[JAMstack philosophy](https://jamstack.org/)**, separating the frontend presentation from the backend logic. The use of glassmorphism follows modern **[UI Design Trends](https://dribbble.com/tags/glassmorphism)**, creating a sense of hierarchy and depth that mimics the transparency we hope to see in corporate environmental reporting.

### Challenges
*   **State Management without Frameworks:** Handling user sessions, quiz progress, and data synchronization using only Vanilla JavaScript required a robust, custom-built state management system.
*   **Asynchronous Data Sync:** Ensuring that answers are saved reliably to the Google Sheets backend without blocking the user interface or creating race conditions.
*   **Complex UI Animations:** Implementing smooth transitions between views (Login, Dashboard, Quiz) and animating SVG charts dynamically required precise CSS and JS coordination.
*   **Responsive Layout:** Designing a complex dashboard with sidebars and grids that breaks down gracefully for smaller screens while maintaining the "Glass" aesthetic.

### Solutions
*   **Centralized Repo Pattern:** Implemented a global `questions_repo` and `local_answers` object to act as the single source of truth, synchronizing with `LocalStorage` for persistence and the API for permanent storage.
*   **Optimistic UI Updates:** The interface updates immediately upon user interaction (selecting an answer), while the API call happens in the background. Visual feedback (loading spinners on buttons) informs the user only if syncing is in progress.
*   **CSS Variables & Animations:** Extensive use of CSS variables for theming (`--mint_primary`, `--green_accent`) and `@keyframes` for entry animations (`slideUp`, `fadeIn`) ensures smooth visual flow and easy maintenance.
*   **Flexbox & Grid Architecture:** The layout utilizes CSS Grid for the category dashboard and Flexbox for the sidebar and navigation, ensuring a fluid adaptation to different viewport sizes.

### Impact
The **OLS Sustainability Profile** empowers organizations to take ownership of their environmental data. By simplifying the input process, it increases the likelihood of accurate reporting and completion. For administrators, it provides a standardized intake method that feeds directly into a structured database (Google Sheets), eliminating manual data entry errors.

Ultimately, this tool reduces the cognitive load associated with compliance. It turns a bureaucratic necessity into a manageable, visual, and even enjoyable process, fostering a culture where sustainability metrics are monitored as closely and effortlessly as financial KPIs.

### Scope
The project encompasses a full user authentication flow, a dynamic dashboard visualizing aggregate and categorical progress, and a step-by-step interactive questionnaire. It includes robust error handling (toast notifications), loading states, and a persistent session management system via LocalStorage.

It intentionally avoids heavy backend infrastructure, relying instead on a lightweight connection to Google Apps Script. The scope is focused on *data collection and visualization* for the end-user. It does not currently include an admin panel for editing questions (which is done via the Sheet) or complex data analytics/reporting generation on the client side.

## Technical Details (Technical Details)
The codebase is a testament to the power of modern Vanilla JavaScript. It eschews heavy frameworks in favor of a lean, performant architecture. The application initializes by checking for a valid session token in `LocalStorage`. If found, it hydrates the state by fetching configuration data, questions, and previous answers from the custom API endpoint.

The rendering engine is DOM-manipulation based. Functions like `renderQuizStep` and `gotoDashboard` dynamically build HTML strings and inject them into the DOM, attaching event listeners for interaction. This approach ensures maximum control over the render cycle and performance.

### Technologies
This project leverages the power of **Vanilla JavaScript (ES6+)** to deliver a fast, dependency-free experience.
*   **Google Apps Script (API)**: Acts as a serverless backend, bridging the frontend with a Google Sheet database.
*   **CSS3 Custom Properties**: Used for consistent theming and easy maintenance of the color palette.
*   **SVG (Scalable Vector Graphics)**: Powering the dynamic progress rings and icons for crisp visualization at any resolution.
*   **LocalStorage**: Provides client-side persistence, allowing users to resume their assessment even if they lose internet connection temporarily.

### Future Improvements
*   **Offline Mode**: Implement a Service Worker to cache the application and allow for full offline functionality, syncing data when connectivity returns.
*   **Dark Mode**: Utilize the existing CSS variables to create a system-aware dark theme.
*   **Data Visualization**: Add more complex charts (bar/line graphs) to show historical progress or comparison against industry benchmarks.
*   **Multi-language Support**: Abstract text strings into a localization file to support global corporate offices.

### Known Bugs (Known Bugs, optional)
*   **API Latency**: Occasional delays in fetching data from Google Apps Script can cause the loader to persist longer than expected on slow connections.
*   **Animation Jank**: On very low-end devices, the backdrop-filter blur combined with large SVG animations might cause minor frame drops.

## Instructions (How to Use)
1.  **Login**: Enter your corporate email and password provided by the administrator.
2.  **Dashboard**: Review your overall progress on the main circular chart and breakdown by category cards.
3.  **Assessment**: Click "Continuar" or select a specific category to enter the questionnaire mode.
4.  **Answering**: Select the option that best fits your company's status. The system auto-saves your progress.
5.  **Completion**: Once all sections are 100%, the profile is marked as complete.

## Conclusion
The **OLS Sustainability Profile** demonstrates that essential corporate tools don't have to be clunky or austere. By applying modern design principles and a user-centric approach to a technical utility, we elevate the experience of sustainability reporting. This project is a small but significant tool in the larger mission of corporate accountability and environmental stewardship.

## Additional Credits
*   **[Google Fonts](https://fonts.google.com/specimen/Montserrat)**: For the 'Montserrat' and 'Inter' typefaces.
*   **[Material Icons](https://fonts.google.com/icons)**: For the comprehensive icon set used throughout the UI.
*   **[Google Apps Script](https://developers.google.com/apps-script)**: For the serverless backend infrastructure.

## TL;DR Version
This project is a modern, glassmorphism-styled web application designed to help companies assess their sustainability practices. It features a beautiful dashboard with real-time progress tracking, categorized assessments, and a seamless questionnaire interface.

Built with pure JavaScript and CSS, it connects to a Google Sheet backend, making it a lightweight yet powerful tool for data collection. It turns the boring task of filling out forms into an engaging, visual experience.

## About Julibe
I’m Julibe. Follow me at [@julibe](https://julibe.com/ "Julibe - Crafting Digital Experiences!"). I’m always exploring new ways to create meaningful experiences. If you have an exciting idea, a challenge worth solving, or want to collaborate, don’t hesitate to reach out. Let’s connect. Together, we can shape ideas into something memorable and impactful.

- [Web](https://julibe.com/ "Visit Julibe's Portfolio")
- [GitHub](https://julibe.ibe/github "Check out Julibe's Code")
- [WhatsApp](https://julibe.com/whatsapp "Chat with Julibe")
- [X (Twitter)](https://julibe.com/twitter "Follow Julibe's Thoughts")
- [Instagram](https://julibe.com/instagram "See Julibe's Creative Side")
- [Email](mailto:mail@julibe.com "Contact Julibe directly")

**Copyright © 2026 - [https://julibe.com](https://julibe.com/)**