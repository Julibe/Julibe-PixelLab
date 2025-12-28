<?php

	// Configuration and Defaults
	$project_slug = $_GET['slug'] ?? '';
	$base_dir = './contents/';
	$default_app_name = 'PixelLab';
	$default_description = 'A playful code playground where cool concepts, neat ideas, and bold web experiments come to life.';

	// Dynamic Paths
	$project_dir = $base_dir . $project_slug . '/';

	// File Paths
	$readme_file = $project_dir . 'README.md';
	$html_file = $project_dir . 'index.html';
	$css_file = $project_dir . 'style.css';
	$js_file = $project_dir . 'script.js';

	// State Variables
	$project_data = [];
	$head_config = [];
	$technologies_string = '';
	$html_content = '';
	$css_block = '';
	$js_block = '';

	// Data Collection
	if (is_file($readme_file)) {
		// Parse front matter
		$parsed_content = frontmatterArray($readme_file);
		$parsed_content['dir'] = $project_dir;
		$parsed_content['url'] = basename($project_dir);

		// Store project data
		$project_data = $parsed_content;
	}


	if (!empty($project_data)) {

		$images = mediaAssets($project_data);


		// Base fallback
		$meta_fallback = $project_data['title'] ?? $project_slug;

		// Technologies
		if (!empty($project_data['technologies'])) {
			$technologies_string = is_array($project_data['technologies'])
				? implode(', ', $project_data['technologies'])
				: (string) $project_data['technologies'];
		} else {
			$technologies_string = $meta_fallback;
		}

		// Keywords
		if (!empty($project_data['keywords'])) {
			$keywords_string = is_array($project_data['keywords'])
				? implode(', ', $project_data['keywords'])
				: (string) $project_data['keywords'];
		} else {
			$keywords_string = $meta_fallback;
		}

		// Hashtags
		if (!empty($project_data['hashtags'])) {
			$hashtags_string = is_array($project_data['hashtags'])
				? implode(', ', $project_data['hashtags'])
				: (string) $project_data['hashtags'];
		} else {
			$hashtags_string = $meta_fallback;
		}

		// Clean hashtag symbols
		$hashtags_string = str_replace('#', '', $hashtags_string);


		// Split camelCase / PascalCase
		$hashtags_string = preg_replace('/(?<=[a-z0-9])(?=[A-Z])/', ' ', $hashtags_string);

		// Convert spaces to commas
		// Build keyword list
		$raw_keywords = $keywords_string
			. ', ' . $hashtags_string
			. ', ' . $technologies_string
			. ', PixelLab, Julibe, Apps';

		// Normalize keyword separators
		$raw_keywords = preg_replace('/\s+/', ' ', $raw_keywords);

		// Clean keywords
		$raw_keywords = str_replace(['.', '_','-', '/','#'], ' ', $raw_keywords);

		$project_keywords = array_map('trim', explode(',', $raw_keywords));
		$project_keywords = preg_replace('/\s+/', ' ', $project_keywords);
		$project_keywords = array_filter($project_keywords);
		$project_keywords = array_map('strtolower', $project_keywords);
		$project_keywords = array_unique($project_keywords);
		asort($project_keywords);

		// Final string
		$project_keywords = implode(', ', $project_keywords);

		$created_ts  = !empty($project_data['created']) ? strtotime($project_data['created']) : time();
		$modified_ts = !empty($project_data['date'])    ? strtotime($project_data['date'])    : $created_ts;

		$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
		$host   = $_SERVER['HTTP_HOST'];
		$uri    = $_SERVER['REQUEST_URI'];

		$current_url = $scheme . '://' . $host . $uri;

		$base_url = str_replace('view','media', $current_url);
		$base_url = str_replace('.html','/', $base_url);


		// Head Configuration Defaults
		$project_title = $project_data['title'] ?? $project_slug;
		$head_config = [
			'title'       => $project_title  ??  $default_app_name,
			'name'        => $project_title,
			'description' => $project_data['description'] ?? $default_description,
			'extract'     => ($project_data['extract'] ?? $default_description) . ' Click around and explore.',
			'keywords'    => $project_keywords,
			'lang'        => $lang,
			'color' => !empty($project_data['colors']) && is_array($project_data['colors'])
				? current(array_filter($project_data['colors'], function ($color) {
					return is_string($color) && preg_match('/^#?[0-9a-fA-F]{3,6}$/', trim($color));
				}))
				: null,

			'language'        => $lang,
			'year' => date('Y', $created_ts),
			'date' => date('Y-m-d', $created_ts),
			'modified_year' => date('Y', $modified_ts),
			'modified_date' => date('Y-m-d', $modified_ts),
			'article' => [
				'published_time'  => date('Y-m-d\TH:i:sP', $created_ts),
				'modified_time'   => date('Y-m-d\TH:i:sP', $modified_ts),
				'expiration_time' => date('Y-m-d\T', strtotime('+12 months')).'00:00:00-05:00',
			],

			'favicon' => $base_url . (
				$images['favicon']
				?? $images['icon']
				?? null
			),

			'icon' => $base_url. (
				$images['icon']
				?? $images['favicon']
				?? null
			),

			'image' => $base_url. (
				$images['cover']
				?? $images['poster']
				?? $images['image']
				?? $images['screenshot_000']
				?? $images['icon']
				?? null
			),

			'video' => isset($images['video'])
				?$base_url . $images['video']
				: null,
		];


	}

	// Asset Inclusion Logic

	// Load CSS inline block
	if (is_file($css_file)) {
		$css_content = file_get_contents($css_file);
		$css_block = "\n\n<!--[ {$project_title} by Julibe CSS ]-->\n\n<style>\n" . $css_content . "\n</style>";
		echo $css_block;
	}

	// Load HTML content
	if (is_file($html_file)){
		$html_content = file_get_contents($html_file);

		// Output time tags in HTML comments
		echo "\n<time temprop=\"datePublished\" datetime=\"" . $head_config['article']['published_time'] . "\" title=\"Published\"></time>";
		echo "\n<time temprop=\"dateModified\" datetime=\"" . $head_config['article']['modified_time'] . "\" title=\"Last Modified\"></time>";

		echo "\n\n<!--[ {$project_title} by Julibe HTML ]-->\n\n".($html_content);
	}

	// Load JS inline block
	if (is_file($js_file)) {
		$js_content = file_get_contents($js_file);
		$module_type = '';
		$tech = strtolower($technologies_string);

		$three_variants = ['three.js', 'threejs', '3js'];
		foreach ($three_variants as $variant) {
			if (strpos($tech, $variant) !== false) {
				$module_type = ' type="module"';
				break;
			}
		}

		$js_block = "\n\n<!--[ {$project_title} by Julibe JavaScipt ]-->\n\n<script{$module_type}>\n" . $js_content . "\n console.clear();\n</script>";
		echo $js_block;
	}




	//printH($project_data, 'Project Data');

?>