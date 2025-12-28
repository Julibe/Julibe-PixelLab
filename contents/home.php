<?php

// Static Metadata Definition
$head_config = [
	'title'       => 'PixelLab Gallery | Play, explore & break cool web ideas',
	'name'        => 'PixelLab Gallery',
	'description' => 'Dive into awesome apps, games, and wild experiments. Explore features, tech, and creative ideas. Click, play, and get inspired.',
	'keywords'    => 'PixelLab, Julibe, web playground, creative coding, apps, games, experiments, UI, design, JavaScript, HTML, CSS',
	'lang'        => $lang,
	'language'        => $lang,
];

$page = [
	'title' => 'PixelLab',
	'label' => 'Julibe\'s PixelLab',
	'icon'  => 'fa-solid fa-home',
	'extra' => [
		'intro' =>[
			'title' => 'About',
			'label' => 'About PixelLab',
			'icon'  => 'fa-solid fa-info-circle',
			'description' => '
				Welcome to <strong>PixelLab</strong>, a place where I design and build things just because some ideas refuse to sit still.<br>
				Play, explore, and break the web with awesome concepts I randomly dream up.<br><br>

				Here you’ll find everything from <b>classic video game vibes with a twist</b>, to <b>useful web apps, tools</b>, and <b>weird experiments</b>.<br><br>

				Click around, mess things up, have fun, and get inspired.<br>
				And hey, don’t gat scared; if you’ve got a cool idea or just want to say hi,
				hit me up on my socials below!
			',
		],

		'about' => [
			'title' => 'Meet Julibe',
			'label' => 'About Julibe',
			'icon'  => 'fa-solid fa-user',
			'description' => '
				Hi, I’m <a href="https://julibe.com/">Julibe</a> 👻<br>
				A supercool designer with <b>18+ years of experience</b> in web, apps, UX/UI, VR, AR, and AI.<br>

				Sci-fi, TV, and anime lover, and a Pro at getting "game over" since the 90s 🕹️.<br><br>

				I just want to craft awesome digital experiences where creativity and technology collide.<br>
				Jump in!, explore freely, and remember: I’m always open to new ideas and collaborations.<br>

				<b>Let’s build something awesome together!</b>
			',
		],
	],

	'gallery' => [
		'title' => 'The Amazing PixelLab Gallery',
		'label' => 'PixelLab Gallery',
		'description' => '
			Don’t be intimidated by the vast collection;
			just click whatever catches your eye and see what happens.
		',
	],

	'socials' => [
		'web' => [
			'url'   => 'https://julibe.com/',
			'text'  => 'Portfolio',
			'title' => 'Enter Julibe’s awesome realm 👻',
			'label' => "Visit Julibe's Portfolio",
			'icon'  => 'fa-solid fa-globe',
			'color' => '#7139d2ff',
			'color_text' => '#ffffff',
			'color_high' => '#ee355e'
		],
		'github' => [
			'url'   => 'https://julibe.com/github',
			'text'  => 'GitHub',
			'title' => '“Copy… Argh! 🏴‍☠️” I mean, explore Julibe’s code',
			'label' => "Julibe's GitHub",
			'icon'  => 'fa-brands fa-github',
			'color' => '#625b68ff',
			'color_text' => '#ffffff',
			'color_high' => '#6b1ed0ff',
		],
		'whatsapp' => [
			'url'   => 'https://julibe.com/whatsapp',
			'text'  => 'WhatsApp',
			'title' => '💬 Message Julibe and say hi or just Boo!',
			'label' => 'Contact Julibe via WhatsApp',
			'icon'  => 'fa-brands fa-whatsapp',
			'color' => '#25d366',
			'color_text' => '#ffffff',
			'color_high' => '#30676a',

		],
		'twitter' => [
			'url'   => 'https://julibe.com/twitter',
			'text'  => 'X (Twitter)',
			'title' => 'Get some of Julibe\'s thoughts, pixels, and the occasional rant 🐦',
			'label' => 'Follow Julibe on Twitter',
			'icon'  => 'fa-brands fa-twitter',
			'color' => '#1da1f2',
			'color_text' => '#ffffff',
			'color_high' => '#1da1f2',

		],
		'instagram' => [
			'url'   => 'https://julibe.com/instagram',
			'text'  => 'Instagram',
			'title' => 'Peek behind the scenes of Julibe’s creative stuff 📸',
			'label' => 'Follow Julibe on Instagram',
			'icon'  => 'fa-brands fa-instagram',
			'color' => '#e1306c',
			'color_text' => '#ffffff',
			'color_high' => '#e1306c',

		],
		'email' => [
			'url'   => 'mailto:mail@julibe.com',
			'text'  => 'Email',
			'title' => 'Send a good old digital email to Julibe 📧',
			'label' => 'Send Email to Julibe',
			'icon'  => 'fa-solid fa-envelope',
			'color' => '#de4138',
			'color_text' => '#ffffff',
			'color_high' => '#edba1c',
		],
	],
];


$css_path = './assets/css/home.css';
$css_styles = is_file($css_path) ? file_get_contents($css_path) : '';

// Configuration and Defaults
$contents_dir = './contents/';
$data = [];

$data = getContent($contents_dir);

// Sort $data by 'created' in descending order
usort($data, function($a, $b) {
    $dateA = strtotime($a['created']);
    $dateB = strtotime($b['created']);

    if ($dateA == $dateB) {
        return 0;
    }
    return ($dateA > $dateB) ? -1 : 1;
});



// Presentation: Generate HTML Thumbnails
$thumbnails_output = '';
foreach ($data as $item => $value) {
	$thumbnails_output .= generateThumbnail($value, $item);
}

// Presentation: Generate Social Links
$social_links_output = '';
foreach ($page['socials'] as $social_link_data) {
	$social_links_output .= generateSidebarLink($social_link_data);
}


// Final Page Output
$html =  <<<HTML
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
	<aside class="sidebar">
		<header class="page-header" role="banner">
			<h1
				title="Good stuff awaits at {$page['label']}"
				aria-label="{$page['label']}"
			>

				<span
					class="icon fa {$page['icon']}"
					aria-hidden="true"
				></span>
				<span class="title">{$page['title']}</span>
			</h1>
		</header>
		<nav class="categories"></nav>

		<footer role="contentinfo">
			<nav aria-label="Social Media Navigation">
				<ul class="socials">
					$social_links_output
				</ul>
			</nav>
		</footer>
	</aside>

	<main role="main" class="main">
		<header class="header">
			<div class="topbar">
				<h2
					id="gallery-title"
					title="Let the experices beagin! {$page['gallery']['label']}"
					aria-label="{$page['gallery']['label']}"
				>

					{$page['gallery']['title']}
				</h2>
				<section
					class="search-filter-container"
					aria-labelledby="search-filter-title"
				>
					<label class="search-filter-bar">
						<h3
							id="search-filter-title"
							class="hidden"
						>
							Search and Filter Projects
						</h3>
						<span class="icon fa fa-search"></span>
						<input
							type="text"
							id="search-input"
							name="search-input"
							list="search-datalist"
							placeholder="Search projects..."
							aria-label="Search projects"
						>
						<datalist id="search-datalist">
							<option>All</option>
						</datalist>
					</label>
				</section>
			</div>
			<p
				class="gallery-intro"
			>
				{$page['gallery']['description']}
			</p>
		</header>
		<section
			class="feature-container"
			aria-labelledby="gallery-title"
		>
			<div
				class="gallery"
				aria-label="{$page['gallery']['label']}"
			>
			</div>
		</section>
		<section
			class="all-container"
			aria-labelledby="gallery-title"
		>
			<div
				class="gallery"
				aria-label="{$page['gallery']['label']}"
			>
				$thumbnails_output
			</div>
		</section>
	</main>

	<style>
		{$css_styles}
	</style>
HTML;

echo trim($html);
// Debug Output
//echo printH($data);

?>