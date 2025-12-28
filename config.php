<?php

	// --- General Settings ---
	$config = [
		'project'  => 'Julibe Apps - PixelLab',
		'timezone' => 'America/Bogota',
		'langs'    => [ 'en'],

		// Directories
		'paths' => [
			'root' => './',
			'php'  => './php/'
		],

		// HTTP Headers
		'headers'  => [
			'Server'                      => 'Julibe.com',
			'X-Powered-By'                => 'Julibe.com',
			'Access-Control-Allow-Origin' => '*'
		],

		// Valid Formats
		'formats' => [
			'html' => 'text/html',
			'htm'  => 'text/html',
			'pdf'  => 'application/pdf',
			'json' => 'application/json',
			'xml'  => 'application/xml',
			'rss'  => 'application/rss+xml',
			'csv'  => 'text/csv',
			'txt'  => 'text/plain',
			'js'   => 'application/javascript',
			'css'  => 'text/css'
		],

		// PHP Runtime Configuration
		'runtime'  => [
			'max_execution_time'  => 160,
			'upload_max_filesize' => '256M',
			'memory_limit'        => '1024M'
		],

		// URLs
		'urls'     => [
			'local'    => 'http://localhost/julibe/Applications/',
			'external' => 'https://apps.julibe.com/'
		]
	];

	// --- Environment Detection ---
	$is_local = ($_SERVER['SERVER_NAME'] === 'localhost');

	// Base URL
	$url = $is_local ? $config['urls']['local'] : $config['urls']['external'];
	$_SESSION['url'] = $url;

	// --- Database Configuration ---
	if (isset($_GET['server']) && in_array($_GET['server'], ['local', 'external'])) {
		$_SESSION['server'] = $_GET['server'];
	} elseif (!isset($_SESSION['server'])) {
		$_SESSION['server'] = $is_local ? 'local' : 'external';
	}

	$db_creds = [
		'local' => [
			'host'     => 'localhost',
			'database' => 'julibe_apps',
			'username' => 'root',
			'password' => ''
		],
		'external' => [
			'host'     => '208.109.30.225',
			'database' => 'julibe_apps',
			'username' => 'negociadorapp',
			'password' => '#laXlaXlaX02'
		]
	];

	$database = $db_creds[$_SESSION['server']];
	$db = "`{$database['database']}`";

	// --- Parameter Cleanup ---
	$ignored_params = ['user', 'type', 'section', 'session', 'file'];
	$gets = array_diff_key($_GET, array_flip($ignored_params));

?>