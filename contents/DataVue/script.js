let debug = true;
console.clear();

const config_settings = {
  w: 350,
  h: 200,
  pad: 20
};

function showToast(message_text, notification_type = "info") {
  try {
    if (debug)
      console.log(
        `%c[Toast] ${notification_type.toUpperCase()}: ${message_text}`,
        "color: yellowgreen; background: black; padding: 2px 5px;"
      );

    let toast_container = document.getElementById("toast_container");
    if (!toast_container) {
      toast_container = document.createElement("div");
      toast_container.id = "toast_container";
      toast_container.style.cssText =
        "position: fixed; bottom: 20px; left: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;";
      document.body.appendChild(toast_container);
    }

    const toast_element = document.createElement("div");
    toast_element.textContent = message_text;

    let background_color = "blue";
    if (notification_type === "error") {
      background_color = "red";
    } else if (notification_type === "warning") {
      background_color = "orange";
    } else if (notification_type === "success") {
      background_color = "green";
    }

    toast_element.style.cssText = `background: ${background_color}; color: white; padding: 10px 20px; border-radius: 8px; font-family: sans-serif; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: opacity 0.3s ease; opacity: 1;`;
    toast_container.appendChild(toast_element);

    setTimeout(() => {
      toast_element.style.opacity = "0";
      setTimeout(() => {
        toast_element.remove();
      }, 300);
    }, 3000);
  } catch (error_object) {
    if (debug)
      console.error(
        `%c[showToast Error] Failed to show toast. Input message: ${message_text}, type: ${notification_type}. Expected behavior: Display a UI toast notification. Error details:`,
        "color: white; background: red;",
        error_object
      );
  }
}

function createSvgElement(tag_name, attributes_object) {
  try {
    if (debug)
      console.log(
        `%c[createSvgElement] Creating element: ${tag_name}`,
        "color: blue;"
      );
    const svg_element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      tag_name
    );

    for (let attribute_key in attributes_object) {
      svg_element.setAttribute(attribute_key, attributes_object[attribute_key]);
    }

    return svg_element;
  } catch (error_object) {
    if (debug)
      console.error(
        `%c[createSvgElement Error] Failed to create SVG element. Input tag: ${tag_name}, attributes: ${JSON.stringify(
          attributes_object
        )}. Expected behavior: Return a valid SVG DOM element. Error details:`,
        "color: white; background: red;",
        error_object
      );
    showToast("Failed to create graphic element.", "error");
    return null;
  }
}

function getRandomValue(minimum_value, maximum_value) {
  try {
    if (debug)
      console.log(
        `%c[getRandomValue] Generating random value between ${minimum_value} and ${maximum_value}`,
        "color: purple;"
      );
    return Math.random() * (maximum_value - minimum_value) + minimum_value;
  } catch (error_object) {
    if (debug)
      console.error(
        `%c[getRandomValue Error] Input min: ${minimum_value}, max: ${maximum_value}. Expected behavior: Return a random number. Error details:`,
        "color: white; background: red;",
        error_object
      );
    return 0;
  }
}

function getSmoothPath(points_array, should_close_path = false) {
  try {
    if (debug)
      console.log(
        `%c[getSmoothPath] Generating path for ${points_array.length} points. Close path: ${should_close_path}`,
        "color: green;"
      );

    const inner_width = config_settings.w - config_settings.pad * 2;
    const inner_height = config_settings.h - config_settings.pad * 2;

    const xy_coordinates = points_array.map((value_item, index_value) => {
      return {
        x:
          config_settings.pad +
          (index_value / (points_array.length - 1)) * inner_width,
        y:
          config_settings.h -
          config_settings.pad -
          (value_item / 100) * inner_height
      };
    });

    let path_data_string = `M ${xy_coordinates[0].x},${xy_coordinates[0].y}`;

    for (
      let loop_index = 0;
      loop_index < xy_coordinates.length - 1;
      loop_index++
    ) {
      const point_0 =
        xy_coordinates[loop_index - 1] || xy_coordinates[loop_index];
      const point_1 = xy_coordinates[loop_index];
      const point_2 = xy_coordinates[loop_index + 1];
      const point_3 = xy_coordinates[loop_index + 2] || point_2;

      const tension_value = 0.2;

      const control_point_1_x =
        point_1.x + (point_2.x - point_0.x) * tension_value;
      const control_point_1_y =
        point_1.y + (point_2.y - point_0.y) * tension_value;
      const control_point_2_x =
        point_2.x - (point_3.x - point_1.x) * tension_value;
      const control_point_2_y =
        point_2.y - (point_3.y - point_1.y) * tension_value;

      path_data_string += ` C ${control_point_1_x},${control_point_1_y} ${control_point_2_x},${control_point_2_y} ${point_2.x},${point_2.y}`;
    }

    if (should_close_path) {
      path_data_string += ` L ${config_settings.w - config_settings.pad},${
        config_settings.h - config_settings.pad
      } L ${config_settings.pad},${config_settings.h - config_settings.pad} Z`;
    }

    return path_data_string;
  } catch (error_object) {
    if (debug)
      console.error(
        `%c[getSmoothPath Error] Failed to generate path. Input points length: ${points_array.length}. Expected behavior: Return an SVG path string. Error details:`,
        "color: white; background: red;",
        error_object
      );
    showToast("Error generating chart paths.", "error");
    return "";
  }
}

function drawArea(chart_identifier) {
  if (debug)
    console.log(
      `%c[drawArea] Initializing Area Chart for ID: ${chart_identifier}`,
      "color: gold;"
    );
  try {
    const svg_element = document.getElementById(chart_identifier);

    if (!svg_element) {
      if (debug)
        console.warn(
          `%c[drawArea Warning] SVG element with ID ${chart_identifier} not found. State change: aborting draw.`,
          "color: black; background: orange;"
        );
      return;
    }

    svg_element.innerHTML = "";
    if (debug)
      console.log(
        "%c[drawArea] Cleared previous SVG contents.",
        "color: gray;"
      );

    for (let loop_index = 0; loop_index <= 4; loop_index++) {
      let y_position =
        config_settings.pad +
        (loop_index / 4) * (config_settings.h - config_settings.pad * 2);
      const grid_line = createSvgElement("line", {
        x1: config_settings.pad,
        x2: config_settings.w - config_settings.pad,
        y1: y_position,
        y2: y_position,
        class: "grid-line"
      });
      svg_element.append(grid_line);
    }
    if (debug) console.log("%c[drawArea] Grid lines drawn.", "color: gray;");

    const points_data_array = Array.from({ length: 7 }, () =>
      getRandomValue(20, 80)
    );

    const area_path_element = createSvgElement("path", {
      class: "area-fill",
      d: getSmoothPath(points_data_array, true),
      opacity: 0
    });

    const line_path_element = createSvgElement("path", {
      class: "line-stroke",
      d: getSmoothPath(points_data_array, false)
    });

    svg_element.append(area_path_element, line_path_element);

    const path_total_length = line_path_element.getTotalLength();
    if (debug)
      console.log(
        `%c[drawArea] Animating Area Chart. Line length: ${path_total_length}`,
        "color: cyan;"
      );

    gsap.fromTo(
      line_path_element,
      {
        strokeDasharray: path_total_length,
        strokeDashoffset: path_total_length
      },
      { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }
    );

    gsap.to(area_path_element, { opacity: 1, duration: 1, delay: 0.3 });

    points_data_array.forEach((point_value, point_index) => {
      const dot_position_x =
        config_settings.pad +
        (point_index / (points_data_array.length - 1)) *
          (config_settings.w - config_settings.pad * 2);
      const dot_position_y =
        config_settings.h -
        config_settings.pad -
        (point_value / 100) * (config_settings.h - config_settings.pad * 2);

      const dot_svg_element = createSvgElement("circle", {
        cx: dot_position_x,
        cy: dot_position_y,
        r: 4,
        fill: "white",
        stroke: "green",
        "stroke-width": 2,
        opacity: 0
      });

      svg_element.append(dot_svg_element);
      gsap.to(dot_svg_element, {
        opacity: 1,
        delay: 0.5 + point_index * 0.05,
        duration: 0.3
      });
    });

    if (debug)
      console.log(
        "%c[drawArea] Area Chart rendering complete.",
        "color: green;"
      );
  } catch (error_object) {
    if (debug)
      console.error(
        `%c[drawArea Error] Failed to draw Area chart. Input ID: ${chart_identifier}. Expected behavior: Render area chart inside SVG. Error details:`,
        "color: white; background: red;",
        error_object
      );
    showToast("Failed to render Area Chart.", "error");
  }
}

function drawBar(chart_identifier) {
  if (debug)
    console.log(
      `%c[drawBar] Initializing Bar Chart for ID: ${chart_identifier}`,
      "color: gold;"
    );
  try {
    const svg_element = document.getElementById(chart_identifier);

    if (!svg_element) {
      if (debug)
        console.warn(
          `%c[drawBar Warning] SVG element with ID ${chart_identifier} not found. State change: aborting draw.`,
          "color: black; background: orange;"
        );
      return;
    }

    svg_element.innerHTML = "";

    const total_bar_count = 6;
    const individual_bar_width =
      (config_settings.w - config_settings.pad * 2) / total_bar_count;

    if (debug)
      console.log(
        `%c[drawBar] Generating ${total_bar_count} bars with width ${individual_bar_width}.`,
        "color: gray;"
      );

    Array.from({ length: total_bar_count }).forEach(
      (empty_value, loop_index) => {
        const primary_bar_height =
          (getRandomValue(15, 85) / 100) *
          (config_settings.h - config_settings.pad * 2);

        const primary_bar_element = createSvgElement("rect", {
          class: "bar",
          x:
            config_settings.pad +
            loop_index * individual_bar_width +
            individual_bar_width * 0.2,
          y: config_settings.h - config_settings.pad,
          width: individual_bar_width * 0.3,
          height: 0
        });

        const secondary_bar_height =
          primary_bar_height * getRandomValue(0.5, 0.9);

        const secondary_bar_element = createSvgElement("rect", {
          class: "bar",
          fill: "yellowgreen",
          x:
            config_settings.pad +
            loop_index * individual_bar_width +
            individual_bar_width * 0.55,
          y: config_settings.h - config_settings.pad,
          width: individual_bar_width * 0.3,
          height: 0
        });

        svg_element.append(primary_bar_element, secondary_bar_element);

        gsap.to(primary_bar_element, {
          attr: {
            y: config_settings.h - config_settings.pad - primary_bar_height,
            height: primary_bar_height
          },
          duration: 0.8,
          delay: loop_index * 0.06,
          ease: "back.out(1.0)"
        });

        gsap.to(secondary_bar_element, {
          attr: {
            y: config_settings.h - config_settings.pad - secondary_bar_height,
            height: secondary_bar_height
          },
          duration: 0.8,
          delay: loop_index * 0.06 + 0.1,
          ease: "back.out(1.0)"
        });
      }
    );

    if (debug)
      console.log("%c[drawBar] Bar Chart rendering complete.", "color: green;");
  } catch (error_object) {
    if (debug)
      console.error(
        `%c[drawBar Error] Failed to draw Bar chart. Input ID: ${chart_identifier}. Expected behavior: Render bar chart inside SVG. Error details:`,
        "color: white; background: red;",
        error_object
      );
    showToast("Failed to render Bar Chart.", "error");
  }
}

function drawGauge() {
  if (debug)
    console.log("%c[drawGauge] Initializing Gauge Chart", "color: gold;");
  try {
    const path_element = document.getElementById("gaugePath");
    const text_element = document.getElementById("gaugeText");

    if (!path_element || !text_element) {
      if (debug)
        console.warn(
          "%c[drawGauge Warning] Gauge DOM elements (gaugePath or gaugeText) not found. State change: aborting draw.",
          "color: black; background: orange;"
        );
      return;
    }

    const path_total_length = path_element.getTotalLength();
    const target_random_value = Math.round(getRandomValue(30, 95));

    if (debug)
      console.log(
        `%c[drawGauge] Target gauge value: ${target_random_value}%. Animating path length: ${path_total_length}`,
        "color: cyan;"
      );

    path_element.style.strokeDasharray = path_total_length;

    gsap.fromTo(
      path_element,
      { strokeDashoffset: path_total_length },
      {
        strokeDashoffset: path_total_length * (1 - target_random_value / 100),
        duration: 1.5,
        ease: "power2.out"
      }
    );

    let animation_proxy_object = { v: 0 };

    gsap.to(animation_proxy_object, {
      v: target_random_value,
      duration: 1.5,
      onUpdate: () => {
        text_element.textContent = Math.round(animation_proxy_object.v) + "K";
      }
    });

    if (debug)
      console.log(
        "%c[drawGauge] Gauge Chart rendering complete.",
        "color: green;"
      );
  } catch (error_object) {
    if (debug)
      console.error(
        "%c[drawGauge Error] Failed to draw Gauge chart. Expected behavior: Render and animate gauge value. Error details:",
        "color: white; background: red;",
        error_object
      );
    showToast("Failed to render Gauge Chart.", "error");
  }
}

function drawLine(chart_identifier) {
  if (debug)
    console.log(
      `%c[drawLine] Initializing Line Chart for ID: ${chart_identifier}`,
      "color: gold;"
    );
  try {
    const svg_element = document.getElementById(chart_identifier);

    if (!svg_element) {
      if (debug)
        console.warn(
          `%c[drawLine Warning] SVG element with ID ${chart_identifier} not found. State change: aborting draw.`,
          "color: black; background: orange;"
        );
      return;
    }

    svg_element.innerHTML = "";
    const middle_y_position = config_settings.h / 2;

    const center_grid_line = createSvgElement("line", {
      x1: config_settings.pad,
      x2: config_settings.w - config_settings.pad,
      y1: middle_y_position,
      y2: middle_y_position,
      class: "grid-line"
    });

    svg_element.append(center_grid_line);

    const points_data_array = Array.from({ length: 8 }, () =>
      getRandomValue(15, 85)
    );

    const line_path_element = createSvgElement("path", {
      class: "line-stroke",
      stroke: "darkgreen",
      d: getSmoothPath(points_data_array, false)
    });

    svg_element.append(line_path_element);

    const path_total_length = line_path_element.getTotalLength();
    if (debug)
      console.log(
        `%c[drawLine] Animating Line Chart. Line length: ${path_total_length}`,
        "color: cyan;"
      );

    gsap.fromTo(
      line_path_element,
      {
        strokeDasharray: path_total_length,
        strokeDashoffset: path_total_length
      },
      { strokeDashoffset: 0, duration: 1.8, ease: "power2.out" }
    );

    if (debug)
      console.log(
        "%c[drawLine] Line Chart rendering complete.",
        "color: green;"
      );
  } catch (error_object) {
    if (debug)
      console.error(
        `%c[drawLine Error] Failed to draw Line chart. Input ID: ${chart_identifier}. Expected behavior: Render line chart inside SVG. Error details:`,
        "color: white; background: red;",
        error_object
      );
    showToast("Failed to render Line Chart.", "error");
  }
}

function updateAll() {
  if (debug)
    console.log(
      "%c[updateAll] Triggering dashboard update cycle.",
      "color: purple; font-weight: bold;"
    );
  try {
    const refresh_button_element = document.querySelector(".fab-refresh i");

    if (refresh_button_element) {
      refresh_button_element.classList.add("fa-spin");
      if (debug)
        console.log(
          "%c[updateAll] Added spinning animation to refresh button.",
          "color: gray;"
        );

      setTimeout(() => {
        refresh_button_element.classList.remove("fa-spin");
        if (debug)
          console.log(
            "%c[updateAll] Removed spinning animation from refresh button.",
            "color: gray;"
          );
      }, 1000);
    } else {
      if (debug)
        console.warn(
          "%c[updateAll Warning] Refresh button not found in DOM. Animation skipped.",
          "color: black; background: orange;"
        );
    }

    drawArea("chartArea");
    drawBar("chartBar");
    drawGauge();
    drawLine("chartLine");

    showToast("Dashboard metrics updated successfully.", "success");
  } catch (error_object) {
    if (debug)
      console.error(
        "%c[updateAll Error] Dashboard update cycle failed. Expected behavior: All charts should refresh and animate. Error details:",
        "color: white; background: red;",
        error_object
      );
    showToast("Critical error: Dashboard update failed.", "error");
  }
}

window.shareTwitter = function () {
  if (debug)
    console.log(
      "%c[shareTwitter] Initializing Twitter share intent.",
      "color: blue;"
    );
  try {
    const tweet_text_content = `🚀 Just watched data come alive! \nCheck out this silky smooth Dashboard. No heavy libraries, just raw SVG + GSAP magic. 🪄`;
    const target_website_url = "https://julibe.com/pen/datavue";
    const tweet_hashtags_string = "webdev,css,javascript,gsap,dataviz";

    const twitter_intent_url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweet_text_content
    )}&url=${encodeURIComponent(
      target_website_url
    )}&hashtags=${encodeURIComponent(tweet_hashtags_string)}`;

    if (debug)
      console.log(
        `%c[shareTwitter] Opening URL: ${twitter_intent_url}`,
        "color: gray;"
      );
    window.open(twitter_intent_url, "_blank");
  } catch (error_object) {
    if (debug)
      console.error(
        "%c[shareTwitter Error] Failed to execute share intent. Expected behavior: Open a new window with Twitter sharing link. Error details:",
        "color: white; background: red;",
        error_object
      );
    showToast("Failed to open share link.", "error");
  }
};

try {
  if (debug)
    console.log(
      "%c[Init] Bootstrapping application.",
      "color: green; font-weight: bold; font-size: 14px;"
    );
  updateAll();
  setInterval(updateAll, 6000);
} catch (error_object) {
  if (debug)
    console.error(
      "%c[Init Error] Application bootstrap failed. Expected behavior: Initial render and setup interval. Error details:",
      "color: white; background: red;",
      error_object
    );
}
