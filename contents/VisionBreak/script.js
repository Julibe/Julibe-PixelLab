
		let debug = true;
		console.clear();

		const config_toast_duration = 4000;
		const config_svg_icon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>`;
		
		const config_default_story_html = `<h1 title="A short story titled 'The Whisper of Invisible Lines'">The Whisper of Invisible Lines</h1>
<article class="story-content" role="article" aria-label="Short story: The Whisper of Invisible Lines" title="Story content about Elara discovering invisible lines in her world">
  <p title="Elara contemplates the unseen lines in life">
    Elara lived in a world woven from visible threads, or so she thought.<br>
    Every path, every boundary, every distinct thought seemed to have its own clear demarcation.<br>
    Yet, there were whispers, faint echoes of something more, something unseen.
  </p>
  <p title="Grandmother shares her wisdom about invisible lines">
    Her grandmother, a woman of ancient wisdom and twinkling eyes,<br>
    often spoke of the "invisible lines."<br>
    <span aria-label="Grandmother's advice" title="Advice from grandmother">"They are everywhere, child," she'd say, "guiding the wind,<br>
    shaping the rivers,<br>
    and even directing the flow of our very dreams."</span>
  </p>
  <p title="Elara searches for hidden patterns">
    Elara would spend hours in the old library,<br>
    tracing the lines in forgotten maps,<br>
    hoping to find a hidden key.<br>
    She searched for patterns in the stars at night,<br>
    and in the intricate veins of autumn leaves.
  </p>
  <p title="Elara senses a subtle shift by the willow">
    One day, while meditating by the ancient willow,<br>
    she felt a subtle shift.<br>
    A tremor, not in the earth, but in the air itself.<br>
    It was as if the silence had deepened,<br>
    revealing a new layer of reality.
  </p>
</article>`;

		const config_log_style = {
			normal: 'color: #2ecc71; font-weight: bold; background: #e8f8f5; padding: 2px 6px; border-radius: 4px;',
			warn: 'color: #f39c12; font-weight: bold; background: #fef5e7; padding: 2px 6px; border-radius: 4px;',
			error: 'color: #e74c3c; font-weight: bold; background: #fdedec; padding: 2px 6px; border-radius: 4px;',
			info: 'color: #3498db; font-weight: bold; background: #ebf5fb; padding: 2px 6px; border-radius: 4px;'
		};

		let state_is_marker_visible = true;
		let state_active_markers_array = [];
		let state_total_line_breaks = 0;

		let dom_html_input_area = null;
		let dom_live_preview_container = null;
		let dom_toggle_markers_btn = null;
		let dom_toast_container = null;
		let dom_break_counter_badge = null;
		let dom_copy_snippet_btn = null;
		let dom_core_snippet_code = null;

		// Initialization logic
		function initializeApplication() {
			try {
				if (debug) console.log('%c[initializeApplication] Starting application setup...', config_log_style.info);
				
				dom_html_input_area = document.getElementById('html_input_area');
				dom_live_preview_container = document.getElementById('live_preview_container');
				dom_toggle_markers_btn = document.getElementById('toggle_markers_btn');
				dom_toast_container = document.getElementById('toast_container');
				dom_break_counter_badge = document.getElementById('break_counter_badge');
				dom_copy_snippet_btn = document.getElementById('copy_snippet_btn');
				dom_core_snippet_code = document.getElementById('core_snippet_code');

				if (!dom_html_input_area || !dom_live_preview_container || !dom_toggle_markers_btn || !dom_toast_container || !dom_copy_snippet_btn || !dom_core_snippet_code) {
					throw new Error("Critical DOM elements are missing from the document.");
				}

				dom_html_input_area.value = config_default_story_html;
				
				attachEventListeners();
				processHtmlContentAndRender();
				
				displayToastNotification("Application loaded successfully", "success");
				if (debug) console.log('%c[initializeApplication] Application setup completed.', config_log_style.normal);

			} catch (application_error) {
				if (debug) console.error('%c[initializeApplication] Critical failure during initialization:', config_log_style.error, application_error);
				displayToastNotification("Critical application error during load.", "error");
			}
		}

		// Event handlers attachment
		function attachEventListeners() {
			try {
				if (debug) console.log('%c[attachEventListeners] Attaching input and click listeners.', config_log_style.info);

				dom_html_input_area.addEventListener('input', function(event) {
					if (debug) console.log('%c[attachEventListeners] User triggered input event. Processing new content.', config_log_style.normal);
					processHtmlContentAndRender();
				});

				dom_toggle_markers_btn.addEventListener('click', function(event) {
					if (debug) console.log('%c[attachEventListeners] User clicked toggle visibility button.', config_log_style.info);
					toggleMarkerVisibility();
				});

				dom_copy_snippet_btn.addEventListener('click', function(event) {
					if (debug) console.log('%c[attachEventListeners] User clicked copy snippet button.', config_log_style.info);
					copySnippetToClipboard();
				});

			} catch (event_listener_error) {
				if (debug) console.error('%c[attachEventListeners] Failed to attach event listeners:', config_log_style.error, event_listener_error);
			}
		}

		// Real-time rendering processor
		function processHtmlContentAndRender() {
			try {
				if (debug) console.log('%c[processHtmlContentAndRender] Extracting value from input area...', config_log_style.info);
				
				let raw_html_string = dom_html_input_area.value;
				
				state_active_markers_array = [];
				state_total_line_breaks = 0;
				
				dom_live_preview_container.innerHTML = raw_html_string;
				
				let discovered_br_elements = dom_live_preview_container.querySelectorAll('br');
				
				if (debug) console.log(`%c[processHtmlContentAndRender] Found ${discovered_br_elements.length} <br> elements in the newly injected content.`, config_log_style.normal);

				discovered_br_elements.forEach(function(br_element_node, index_number) {
					let visual_marker_span = document.createElement('span');
					visual_marker_span.className = 'break-marker';
					if (!state_is_marker_visible) {
						visual_marker_span.classList.add('hidden');
					}
					visual_marker_span.innerHTML = config_svg_icon;
					visual_marker_span.setAttribute('title', `Line Break Marker #${index_number + 1}`);
					
					br_element_node.parentNode.insertBefore(visual_marker_span, br_element_node);
					
					state_active_markers_array.push(visual_marker_span);
					state_total_line_breaks++;
				});

				updateCounterBadge();

			} catch (processing_error) {
				if (debug) console.error('%c[processHtmlContentAndRender] Error rendering preview content:', config_log_style.error, processing_error);
				displayToastNotification("Failed to render preview. Check HTML syntax.", "error");
			}
		}

		// State visibility toggle
		function toggleMarkerVisibility() {
			try {
				state_is_marker_visible = !state_is_marker_visible;
				
				if (debug) console.log(`%c[toggleMarkerVisibility] Switching visibility state to: ${state_is_marker_visible}`, config_log_style.info);

				state_active_markers_array.forEach(function(marker_span) {
					if (state_is_marker_visible) {
						marker_span.classList.remove('hidden');
					} else {
						marker_span.classList.add('hidden');
					}
				});

				if (state_is_marker_visible) {
					dom_toggle_markers_btn.textContent = 'Hide Markers';
					dom_toggle_markers_btn.classList.remove('inactive');
					displayToastNotification("Markers are now visible", "info");
				} else {
					dom_toggle_markers_btn.textContent = 'Show Markers';
					dom_toggle_markers_btn.classList.add('inactive');
					displayToastNotification("Markers are now hidden", "warn");
				}

			} catch (toggle_error) {
				if (debug) console.error('%c[toggleMarkerVisibility] Error toggling marker states:', config_log_style.error, toggle_error);
				displayToastNotification("Error toggling markers", "error");
			}
		}

		// Badge counter update
		function updateCounterBadge() {
			try {
				if (debug) console.log(`%c[updateCounterBadge] Updating badge text to reflect ${state_total_line_breaks} breaks.`, config_log_style.info);
				dom_break_counter_badge.textContent = `${state_total_line_breaks} Break${state_total_line_breaks !== 1 ? 's' : ''} Found`;
			} catch (badge_error) {
				if (debug) console.error('%c[updateCounterBadge] Error updating badge:', config_log_style.error, badge_error);
			}
		}

		// Clipboard logic for code snippet
		function copySnippetToClipboard() {
			try {
				if (debug) console.log('%c[copySnippetToClipboard] Attempting to copy code to clipboard.', config_log_style.info);
				
				let code_string = dom_core_snippet_code.textContent;
				
				document.execCommand('copy');
				
				let temp_textarea = document.createElement('textarea');
				temp_textarea.value = code_string;
				document.body.appendChild(temp_textarea);
				temp_textarea.select();
				document.execCommand('copy');
				document.body.removeChild(temp_textarea);

				dom_copy_snippet_btn.textContent = 'Copied!';
				dom_copy_snippet_btn.style.background = '#2ecc71';
				
				setTimeout(function() {
					dom_copy_snippet_btn.textContent = 'Copy Code';
					dom_copy_snippet_btn.style.background = 'rgba(255,255,255,0.1)';
				}, 2000);

				displayToastNotification("Code copied to clipboard!", "success");

			} catch (copy_error) {
				if (debug) console.error('%c[copySnippetToClipboard] Failed to copy code:', config_log_style.error, copy_error);
				displayToastNotification("Failed to copy code. Please select manually.", "error");
			}
		}

		// Toast notification generator
		function displayToastNotification(message_string, notification_type) {
			try {
				if (debug) console.log(`%c[displayToastNotification] Displaying toast: "${message_string}" [Type: ${notification_type}]`, config_log_style.info);

				let toast_element = document.createElement('div');
				toast_element.className = `toast-message toast-${notification_type}`;
				toast_element.textContent = message_string;

				dom_toast_container.appendChild(toast_element);

				void toast_element.offsetWidth;
				
				toast_element.classList.add('show');

				setTimeout(function() {
					toast_element.classList.remove('show');
					setTimeout(function() {
						if (toast_element.parentNode === dom_toast_container) {
							dom_toast_container.removeChild(toast_element);
						}
					}, 500);
				}, config_toast_duration);

			} catch (toast_error) {
				if (debug) console.error('%c[displayToastNotification] Failed to display toast message:', config_log_style.error, toast_error);
			}
		}

		document.addEventListener('DOMContentLoaded', initializeApplication);
