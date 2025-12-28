<?php
	/*
		Function Name: Render Head Tag
		Version: 1.1.2
		Author: Julibe - Crafting Amazing Digital Experiences
		Copyright: 2025 © https://julibe.com
		License: MIT
		Description: Renders a single HTML tag string. Handles attribute escaping (crucial for JSON data) and removes internal keys.

		Parameters:
			@param string $tag_name   The HTML tag name.
			@param array  $attributes Associative array of attributes.

		Usage:
			$tag = renderHeadTag('meta', ['name' => 'viewport', 'content' => 'width=device-width']);

		Returns:
			A string containing the rendered HTML tag.

		Dependencies:
			None (For performance, cleanOutput should be applied to the final block, not individual tags).

		Last Updated: 2025-12-12
	*/
	function renderHeadTag( string $tag_name, array $attributes ): string {
		$void_tags = [ 'meta', 'link', 'img', 'br', 'hr', 'input', 'base', 'area', 'embed', 'param', 'source', 'track' ];

		/* Extract Internals */
		$inner_html = $attributes['_html'] ?? null;
		unset( $attributes['_html'] );
		unset( $attributes['tag'] );

		$attr_parts     = [];
		$has_attributes = false;

		/* Build Attributes */
		foreach ( $attributes as $key => $val ) {
			// Skip null/false, but allow '0'
			if ( $val === null || $val === false || $val === '' ) {
				continue;
			}

			if ( $val === true ) {
				$attr_parts[] = $key;
			} else {
				// Critical: ENT_QUOTES ensures JSON strings in attributes (like Cloudflare) don't break HTML
				$attr_parts[] = $key . '="' . htmlspecialchars( (string) trim( $val ), ENT_QUOTES, 'UTF-8' ) . '"';
			}
			$has_attributes = true;
		}

		/* Validation */
		$is_essential_tag = in_array( strtolower( $tag_name ), [ 'title', 'base' ], true );

		if ( ! $is_essential_tag && empty( $inner_html ) && ! $has_attributes ) {
			return '';
		}

		$attr_str   = empty( $attr_parts ) ? '' : ' ' . implode( ' ', $attr_parts );
		$tag_name   = strtolower( trim( $tag_name ) );
		$inner_html = $inner_html ? trim( $inner_html ) : '';

		/* Formatting */
		if ( in_array( $tag_name, $void_tags, true ) ) {
			return "<{$tag_name}{$attr_str}>";
		} else {
			return "<{$tag_name}{$attr_str}>{$inner_html}</{$tag_name}>";
		}
	}

	/*
		Function Name: Build Head Configuration
		Version: 1.3.0
		Author: Julibe - Crafting Amazing Digital Experiences
		Copyright: 2025 © https://julibe.com
		License: MIT
		Description: Normalizes configuration. Includes updated defaults for GA4, GTM, Firebase, Cloudflare, and reCAPTCHA.

		Parameters:
			@param array $headers Raw configuration array.

		Usage:
			$config = buildHeadConfig($raw_input);

		Returns:
			Standardized configuration array.

		Last Updated: 2025-12-12
	*/
	function buildHeadConfig( array $headers ): array {
		$kw_input  = $headers['keywords'] ?? null;
		$kw_string = ( is_array( $kw_input ) ? implode( ', ', $kw_input ) : $kw_input );

		$author = $headers['author'] ?? 'Julibe';
		$slogan = 'Crafting Amazing Digital Experiences';
		$domain = $headers['domain'] ?? 'julibe.com';


		$title =( $headers['title'] ?? 'PixelLab') . ' | By ' . $author . ' ❤️';
		$name = $headers['name'] ?? $title;
		$desc_base  = $headers['description'] ?? null;
		$year       = $headers['year'] ?? date( 'Y' );


		/* Default Configuration */
		$config = [
			'title'      => $title ,
			'title_full'            =>  $title ?: 'Experience by ' . $author . ' ❤️',
			'name'      =>     $name ? $name  : 'Experience crafted by ' . $author . ' ❤️',
			'desc'            => $desc_base ? $desc_base . ' Developed with ❤️ By ' . $author : 'Developed with ❤️ By ' . $author . ' - ' . $slogan,
			'keywords'        => ( $kw_string ? $kw_string . ', ' . $author . ', Amazing, Designer' : ' ' . $author . ', Amazing, Designer, Creative, Digital, Experiences, Love' ),
			'author'          => $author,
			'domain'          => $domain,
			'color'           => $headers['color'] ?? '#0e002e',
			'type'            => $headers['type'] ?? 'website',
			'country'         => $headers['country'] ?? 'US',
			'language'        => $headers['language'] ?? 'en',
			'domain'             => $headers['url'] ?? 'https://' . $domain . '/',
			'url'     => $headers['current_url'] ?? ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'],

			'year'            => $year,
			'copyright'       => $headers['copyright'] ?? $year,
			'date'            => $headers['date'] ?? date( 'Y-m-d' ),
			'modified'        => $headers['modified_date'] ?? date( 'Y-m-d' ),
			'locale'          => $headers['locale'] ?? ( $headers['language'] ?? 'en' ) . '_' . ( $headers['country'] ?? 'US' ),
			'favicon'         => $headers['favicon'] ?? './favicon.webp',
			'manifest'        => $headers['manifest'] ?? './manifest.json',
			'sw_path'         => $headers['sw'] ?? null,
			'twitter_user'    => $headers['twitter_user'] ?? '@julibe',
			'og_enabled'      => $headers['og'] ?? true,
			'twitter_enabled' => $headers['twitter'] ?? true,
			'fb_app_id'       => $headers['facebook']['appId'] ?? null,
			'dnt'             => $headers['dnt'] ?? false,
			'icon'            => is_array( $headers['icon'] ?? './icon.webp' ) ? $headers['icon'] : [ 'src' => $headers['icon'] ?? './icon.webp' ],
			'image'             => is_array( $headers['image'] ?? $headers['img'] ?? './image.webp' ) ? ( $headers['image'] ?? $headers['img'] ) : [ 'src' => $headers['image'] ?? $headers['img'] ?? './image.webp' ],
			'video'           => $headers['video'] ?? [],
			'apple'           => $headers['apple'] ?? [],
			'android'         => $headers['android'] ?? [],
			'seo'             => $headers['seo'] ?? [],
			'geo'             => $headers['geo'] ?? [],
			'links'           => $headers['links'] ?? [],
			'feeds'           => [
				'rss'       => $headers['rss'] ?? null,
				'atom'      => $headers['atom'] ?? null,
				'json_feed' => $headers['json_feed'] ?? null,
				'opml'      => $headers['opml'] ?? null,
				'search'    => $headers['search'] ?? null,
			],
			'fonts'           => $headers['fonts'] ?? [],
			'libs'            => $headers['libs'] ?? [],
			'applinks'        => $headers['applinks'] ?? [],
			'article'         => $headers['article'] ?? [],
			'extra'           => $headers['extra'] ?? [],
			'dns_prefetch'    => (array) ( $headers['dns_prefetch'] ?? [] ),
			'preconnect'      => (array) ( $headers['preconnect'] ?? [] ),
			'csp'             => $headers['csp'] ?? "frame-ancestors 'none';",
			'frame_options'   => $headers['frame_options'] ?? 'SAMEORIGIN',

			// Default Services
			'contact'         => array_merge( [ 'email' => 'mail@julibe.com'  ], $headers['contact'] ?? [] ),
			'google'          => array_merge( [
				'analytics'   => 'G-416Q6HW7MT', // Updated GA4
				'tag_manager' => 'GTM-TFV56799', // GTM
				'adsense'     => null
			], $headers['google'] ?? [] ),
			'cloudflare'      => array_merge( [
				'token'       => '0948b735ca7842359091b2bd8fdefb54' // Beacon
			], $headers['cloudflare'] ?? [] ),
			'recaptcha'       => array_merge( [
				'site_key'    => '6Ld4TyMpAAAAACbAKsLgBs25Wy4TztEPRmZJANRt', // v3
				'score'       => 0.5
			], $headers['recaptcha'] ?? [] ),
			'firebase'        => array_merge( [
				'apiKey'            => 'AIzaSyDhRbFy9m-NXZVkozYJwKdDYJuwsL6W_bw',
				'authDomain'        => 'pushnotificationsio.firebaseapp.com',
				'databaseURL'       => 'https://pushnotificationsio.firebaseio.com',
				'projectId'         => 'pushnotificationsio',
				'storageBucket'     => 'pushnotificationsio.appspot.com',
				'messagingSenderId' => '788493704860',
				'appId'             => '1:788493704860:web:ba71fd692e7cc9651f5759',
				'measurementId'     => 'G-NXS0Z75BCH'
			], $headers['firebase'] ?? [] ),
		];

		return $config;
	}

	/*
		Function Name: Generate Complete Head Section
		Version: 1.5.0
		Author: Julibe - Crafting Amazing Digital Experiences
		Copyright: 2025 © https://julibe.com
		License: MIT
		Description: Generates a SEO-optimized HTML <head> section. Includes automatic handling for GTM, GA4, Firebase, and Cloudflare.

		Parameters:
			@param array $headers Head configuration array.

		Usage:
			echo generateHead($config);

		Returns:
			Formatted HTML string.

		Dependencies:
			Requires buildHeadConfig() and renderHeadTag().

		Last Updated: 2025-12-12
	*/
	function generateHead( array $headers ): string {
		$key_core         = '01. Standard';
		$key_seo_meta     = '02. SEO Meta';
		$key_verification = '03. Verification & Geo';
		$key_open_graph   = '04. OpenGraph';
		$key_twitter      = '05. Twitter';
		$key_apple        = '06. Apple/iOS';
		$key_microsoft    = '07. Microsoft';
		$key_dublin       = '08. Dublin';
		$key_PBCore       = '08. PBCore';
		$key_DataCite     = '08. DataCite ';
		$key_feeds        = '10. Feeds & Search';
		$key_fonts        = '20. Fonts';
		$key_styles       = '21. Styles';
		$key_libs         = '60. Libraries';
		$key_scripts      = '80. Analytics & Tracking';
		$key_extra        = '99. Other';

		$config = buildHeadConfig( $headers );
		$tags   = [];

		$filter_null = fn( $item ) => $item !== null;

		/* Core Standard */
		$tags[ $key_core ] = array_filter( [
			[ 'tag' => 'title', '_html' => $config['title_full'] ],
			[ 'tag' => 'meta', 'http-equiv' => 'content-type', 'content' => 'text/html; charset=UTF-8' ],
			[ 'tag' => 'meta', 'charset' => 'UTF-8' ],
			[ 'tag' => 'meta', 'http-equiv' => 'X-UA-Compatible', 'content' => 'IE=edge' ],
			[ 'tag' => 'meta', 'name' => 'viewport', 'content' => 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' ],
			[ 'tag' => 'base', 'href' => $config['url'] ],
			[ 'tag' => 'meta', 'property' => 'name', 'content' => $config['name'] ],
			[ 'tag' => 'meta', 'name' => 'name', 'content' => $config['name'] ],
			[ 'tag' => 'meta', 'name' => 'sitecode', 'content' => $headers['sitecode'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'generator', 'content' => $headers['generator'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'theme-color', 'content' => $config['color'] ],
			[ 'tag' => 'meta', 'name' => 'mobile-web-app-capable', 'content' => 'yes' ],
			[ 'tag' => 'meta', 'name' => 'application-name', 'content' => $config['name'] ],
			[ 'tag' => 'link', 'rel' => 'manifest', 'href' => $config['manifest'] ],
			[ 'tag' => 'link', 'rel' => 'shortcut icon', 'href' => $config['favicon'] ],
			[ 'tag' => 'link', 'rel' => 'icon', 'type' => 'image/png', 'href' => $config['icon']['src'] ?? null ],
			[ 'tag' => 'meta', 'http-equiv' => 'Content-Security-Policy', 'content' => $config['csp'] ],
			[ 'tag' => 'meta', 'http-equiv' => 'X-Content-Type-Options', 'content' => 'nosniff' ],
			[ 'tag' => 'meta', 'http-equiv' => 'X-Frame-Options', 'content' => $config['frame_options'] ],
			[ 'tag' => 'meta', 'http-equiv' => 'X-XSS-Protection', 'content' => '1; mode=block' ],
		], $filter_null );

		foreach ( $config['dns_prefetch'] as $dns ) {
			if ( $dns ) {
				$tags[ $key_core ][] = [ 'tag' => 'link', 'rel' => 'dns-prefetch', 'href' => $dns ];
			}
		}
		foreach ( $config['preconnect'] as $pre ) {
			if ( $pre ) {
				$tags[ $key_core ][] = [ 'tag' => 'link', 'rel' => 'preconnect', 'href' => $pre, 'crossorigin' => true ];
			}
		}

		/* SEO Meta */
		$tags[ $key_seo_meta ] = array_filter( [
			[ 'tag' => 'meta', 'name' => 'description', 'content' => $config['desc'] ],
			[ 'tag' => 'meta', 'name' => 'keywords', 'content' => $config['keywords'] ],
			[ 'tag' => 'meta', 'name' => 'author', 'content' => $config['author'] ],
			[ 'tag' => 'meta', 'name' => 'copyright', 'content' => $config['copyright'] ],
			[ 'tag' => 'meta', 'name' => 'date', 'content' => $config['date'] ],
			[ 'tag' => 'meta', 'name' => 'modified', 'content' => $config['modified_date'] ?? $config['date'] ],
			[ 'tag' => 'meta', 'name' => 'robots', 'content' => $config['seo']['robots'] ?? 'index, follow' ],
			[ 'tag' => 'meta', 'name' => 'googlebot', 'content' => $config['seo']['googlebot'] ?? 'index, follow' ],
			[ 'tag' => 'meta', 'name' => 'bingbot', 'content' => $config['seo']['bingbot'] ?? 'index, follow' ],
			[ 'tag' => 'meta', 'name' => 'referrer', 'content' => 'origin-when-cross-origin' ],
			[ 'tag' => 'meta', 'name' => 'rating', 'content' => 'general' ],
			[ 'tag' => 'meta', 'name' => 'revisit-after', 'content' => '7 days' ],
			[ 'tag' => 'link', 'rel' => 'canonical', 'href' => $config['url'] ],
			[ 'tag' => 'link', 'rel' => 'alternate', 'href' => $config['domain'], 'hreflang' => 'x-default' ],
			[ 'tag' => 'link', 'rel' => 'author', 'href' => $config['links']['author'] ?? null ],
			[ 'tag' => 'link', 'rel' => 'publisher', 'href' => $config['links']['publisher'] ?? null ],
			[ 'tag' => 'link', 'rel' => 'license', 'href' => $config['links']['license'] ?? null ],
			[ 'tag' => 'link', 'rel' => 'me', 'href' => $config['links']['me'] ?? null ],
			[ 'tag' => 'link', 'rel' => 'archives', 'href' => $config['links']['archives'] ?? null ],
			[ 'tag' => 'link', 'rel' => 'pingback', 'href' => $config['links']['pingback'] ?? null ],
			[ 'tag' => 'link', 'rel' => 'prev', 'href' => $config['links']['prev'] ?? null ],
			[ 'tag' => 'link', 'rel' => 'next', 'href' => $config['links']['next'] ?? null ],
			[ 'tag' => 'link', 'rel' => 'help', 'href' => $config['links']['help'] ?? null ],
		], $filter_null );

		/* Verification & Geo */
		$tags[ $key_verification ] = array_filter( [
			[ 'tag' => 'meta', 'name' => 'google-site-verification', 'content' => $config['seo']['google'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'p:domain_verify', 'content' => $config['seo']['pinterest'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'yandex-verification', 'content' => $config['seo']['yandex'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'facebook-domain-verification', 'content' => $config['seo']['facebook'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'ahrefs-site-verification', 'content' => $config['seo']['ahrefs'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'majestic-site-verification', 'content' => $config['seo']['majestic'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'norton-safeweb-site-verification', 'content' => $config['seo']['norton'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'geo.position', 'content' => ( ! empty( $config['geo']['latitude'] ) && ! empty( $config['geo']['longitude'] ) ? $config['geo']['latitude'] . ';' . $config['geo']['longitude'] : null ) ],
			[ 'tag' => 'meta', 'name' => 'geo.region', 'content' => $config['geo']['region'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'geo.placename', 'content' => $config['geo']['placename'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'ICBM', 'content' => ( ! empty( $config['geo']['latitude'] ) && ! empty( $config['geo']['longitude'] ) ? $config['geo']['latitude'] . ', ' . $config['geo']['longitude'] : null ) ],
			[ 'tag' => 'meta', 'name' => 'location.latitude', 'content' => $config['geo']['latitude'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'location.longitude', 'content' => $config['geo']['longitude'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'location.region', 'content' => $config['geo']['region'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'location.placename', 'content' => $config['geo']['placename'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'location.country', 'content' => $config['country'] ],
		], $filter_null );

		/* OpenGraph */
		if ( $config['og_enabled'] !== false ) {
			$tags[ $key_open_graph ] = array_filter( [
				[ 'tag' => 'meta', 'property' => 'og:site_name', 'content' => $config['name'] ?: $config['author'] ],
				[ 'tag' => 'meta', 'property' => 'og:title', 'content' => $config['title_full'] ],
				[ 'tag' => 'meta', 'property' => 'og:description', 'content' => $config['desc'] ],
				[ 'tag' => 'meta', 'property' => 'og:type', 'content' => ( $config['type'] === 'article' ? 'article' : 'website' ) ],
				[ 'tag' => 'meta', 'property' => 'og:locale', 'content' => $config['locale'] ],
				[ 'tag' => 'meta', 'property' => 'og:url', 'content' => $config['url'] ],
				( isset( $config['image']['src'] ) ? [ 'tag' => 'meta', 'property' => 'og:image', 'content' => $config['image']['src'] ] : null ),
				( isset( $config['image']['src'] ) ? [ 'tag' => 'meta', 'property' => 'og:image:secure_url', 'content' => $config['image']['src'] ] : null ),
				( isset( $config['image']['alt'] ) || isset( $config['image']['src'] ) ? [ 'tag' => 'meta', 'property' => 'og:image:alt', 'content' => $config['image']['alt'] ?? ( $config['image']['src'] ? $config['desc'] : null ) ] : null ),
				( isset( $config['image']['type'] ) ? [ 'tag' => 'meta', 'property' => 'og:image:type', 'content' => $config['image']['type'] ] : null ),
				( isset( $config['image']['width'] ) ? [ 'tag' => 'meta', 'property' => 'og:image:width', 'content' => $config['image']['width'] ] : null ),
				( isset( $config['image']['height'] ) ? [ 'tag' => 'meta', 'property' => 'og:image:height', 'content' => $config['image']['height'] ] : null ),
				( isset( $config['video']['src'] ) ? [ 'tag' => 'meta', 'property' => 'og:video', 'content' => $config['video']['src'] ] : null ),
				( isset( $config['video']['src'] ) ? [ 'tag' => 'meta', 'property' => 'og:video:secure_url', 'content' => $config['video']['src'] ] : null ),
				( isset( $config['video']['type'] ) ? [ 'tag' => 'meta', 'property' => 'og:video:type', 'content' => $config['video']['type'] ] : null ),
				( isset( $config['video']['width'] ) ? [ 'tag' => 'meta', 'property' => 'og:video:width', 'content' => $config['video']['width'] ] : null ),
				( isset( $config['video']['height'] ) ? [ 'tag' => 'meta', 'property' => 'og:video:height', 'content' => $config['video']['height'] ] : null ),
				( isset( $config['article']['published_time'] ) ? [ 'tag' => 'meta', 'property' => 'article:published_time', 'content' => $config['article']['published_time'] ] : null ),
				( isset( $config['article']['modified_time'] ) ? [ 'tag' => 'meta', 'property' => 'article:modified_time', 'content' => $config['article']['modified_time'] ] : null ),
				( isset( $config['article']['expiration_time'] ) ? [ 'tag' => 'meta', 'property' => 'article:expiration_time', 'content' => $config['article']['expiration_time'] ] : null ),
				( isset( $config['article']['author'] ) ? [ 'tag' => 'meta', 'property' => 'article:author', 'content' => $config['author'] ] : null ),
				( isset( $config['article']['section'] ) ? [ 'tag' => 'meta', 'property' => 'article:section', 'content' => $config['article']['section'] ] : null ),
				( isset( $config['article']['tag'] ) ? [ 'tag' => 'meta', 'property' => 'article:tag', 'content' => $config['article']['tag'] ] : null ),
				( isset( $config['contact']['email'] ) ? [ 'tag' => 'meta', 'property' => 'og:email', 'content' => $config['contact']['email'] ] : null ),
				( isset( $config['contact']['phone'] ) ? [ 'tag' => 'meta', 'property' => 'og:phone_number', 'content' => $config['contact']['phone'] ] : null ),
				( isset( $config['contact']['fax'] ) ? [ 'tag' => 'meta', 'property' => 'og:fax_number', 'content' => $config['contact']['fax'] ] : null ),
				( isset( $config['geo']['latitude'] ) ? [ 'tag' => 'meta', 'property' => 'og:latitude', 'content' => $config['geo']['latitude'] ] : null ),
				( isset( $config['geo']['longitude'] ) ? [ 'tag' => 'meta', 'property' => 'og:longitude', 'content' => $config['geo']['longitude'] ] : null ),
				( isset( $config['geo']['street_address'] ) ? [ 'tag' => 'meta', 'property' => 'og:street-address', 'content' => $config['geo']['street_address'] ] : null ),
				( isset( $config['geo']['locality'] ) ? [ 'tag' => 'meta', 'property' => 'og:locality', 'content' => $config['geo']['locality'] ] : null ),
				( isset( $config['geo']['region'] ) ? [ 'tag' => 'meta', 'property' => 'og:region', 'content' => $config['geo']['region'] ] : null ),
				( isset( $config['geo']['postal_code'] ) ? [ 'tag' => 'meta', 'property' => 'og:postal-code', 'content' => $config['geo']['postal_code'] ] : null ),
				[ 'tag' => 'meta', 'property' => 'og:country-name', 'content' => $config['country'] ],
				( isset( $config['fb_app_id'] ) ? [ 'tag' => 'meta', 'property' => 'fb:app_id', 'content' => $config['fb_app_id'] ] : null ),
				( isset( $headers['facebook']['admins'] ) ? [ 'tag' => 'meta', 'property' => 'fb:admins', 'content' => $headers['facebook']['admins'] ] : null ),
				( isset( $headers['facebook']['pages'] ) ? [ 'tag' => 'meta', 'property' => 'fb:pages', 'content' => $headers['facebook']['pages'] ] : null ),
				( isset( $config['applinks']['ios']['url'] ) ? [ 'tag' => 'meta', 'property' => 'al:ios:url', 'content' => $config['applinks']['ios']['url'] ] : null ),
				( isset( $config['applinks']['ios']['id'] ) ? [ 'tag' => 'meta', 'property' => 'al:ios:app_store_id', 'content' => $config['applinks']['ios']['id'] ] : null ),
				( isset( $config['applinks']['ios']['name'] ) ? [ 'tag' => 'meta', 'property' => 'al:ios:app_name', 'content' => $config['applinks']['ios']['name'] ] : null ),
				( isset( $config['applinks']['android']['url'] ) ? [ 'tag' => 'meta', 'property' => 'al:android:url', 'content' => $config['applinks']['android']['url'] ] : null ),
				( isset( $config['applinks']['android']['package'] ) ? [ 'tag' => 'meta', 'property' => 'al:android:package', 'content' => $config['applinks']['android']['package'] ] : null ),
				( isset( $config['applinks']['android']['name'] ) ? [ 'tag' => 'meta', 'property' => 'al:android:app_name', 'content' => $config['applinks']['android']['name'] ] : null ),
				[ 'tag' => 'meta', 'property' => 'al:web:url', 'content' => $config['applinks']['web']['url'] ?? $config['url'] ],
			], $filter_null );
		}

		/* Twitter */
		if ( $config['twitter_enabled'] !== false ) {
			$iphone  = $config['apple']['iphone'] ?? [];
			$android = $config['android'] ?? [];
			$tags[ $key_twitter ] = array_filter( [
				[ 'tag' => 'meta', 'name' => 'twitter:title', 'content' => $config['title_full'] ],
				[ 'tag' => 'meta', 'name' => 'twitter:description', 'content' => $config['desc'] ],
				[ 'tag' => 'meta', 'name' => 'twitter:site', 'content' => $config['twitter_user'] ],
				[ 'tag' => 'meta', 'name' => 'twitter:creator', 'content' => $config['twitter_user'] ],
				[ 'tag' => 'meta', 'name' => 'twitter:url', 'content' => $config['url'] ],
				[ 'tag' => 'meta', 'name' => 'twitter:domain', 'content' => $config['domain'] ],
				[ 'tag' => 'meta', 'name' => 'twitter:card', 'content' => ( ! empty( $config['video']['src'] ) ? 'player' : ( ! empty( $config['image']['src'] ) ? 'summary_large_image' : 'summary' ) ) ],
				( isset( $config['image']['src'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:image', 'content' => $config['image']['src'] ] : null ),
				( isset( $config['image']['src'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:image:src', 'content' => $config['image']['src'] ] : null ),
				( isset( $config['image']['alt'] ) || isset( $config['image']['src'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:image:alt', 'content' => $config['image']['alt'] ?? ( $config['image']['src'] ? $config['desc'] : null ) ] : null ),
				( isset( $config['image']['type'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:image:type', 'content' => $config['image']['type'] ] : null ),
				( isset( $config['image']['width'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:image:width', 'content' => $config['image']['width'] ] : null ),
				( isset( $config['image']['height'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:image:height', 'content' => $config['image']['height'] ] : null ),
				( isset( $config['video']['player'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:player', 'content' => $config['video']['player'] ] : null ),
				( isset( $config['video']['width'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:player:width', 'content' => $config['video']['width'] ] : null ),
				( isset( $config['video']['height'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:player:height', 'content' => $config['video']['height'] ] : null ),
				( isset( $config['video']['src'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:player:stream', 'content' => $config['video']['src'] ] : null ),
				( isset( $config['video']['type'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:player:stream:content_type', 'content' => $config['video']['type'] ] : null ),
				( ! empty( $iphone ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:name:iphone', 'content' => $config['name'] ?: $config['author'] ] : null ),
				( isset( $iphone['id'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:id:iphone', 'content' => $iphone['id'] ] : null ),
				( isset( $iphone['url'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:url:iphone', 'content' => $iphone['url'] ] : null ),
				( ! empty( $iphone ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:name:ipad', 'content' => $config['name'] ?: $config['author'] ] : null ),
				( isset( $iphone['id'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:id:ipad', 'content' => $iphone['id'] ] : null ),
				( isset( $iphone['url'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:url:ipad', 'content' => $iphone['url'] ] : null ),
				( ! empty( $android ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:name:googleplay', 'content' => $config['name'] ?: $config['author'] ] : null ),
				( isset( $android['id'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:id:googleplay', 'content' => $android['id'] ] : null ),
				( isset( $android['url'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:url:googleplay', 'content' => $android['url'] ] : null ),
				( ( ! empty( $iphone ) || ! empty( $android ) ) ? [ 'tag' => 'meta', 'name' => 'twitter:app:country', 'content' => $config['country'] ] : null ),
				( isset( $headers['twitter']['label1'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:label1', 'content' => $headers['twitter']['label1'] ] : null ),
				( isset( $headers['twitter']['data1'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:data1', 'content' => $headers['twitter']['data1'] ] : null ),
				( isset( $headers['twitter']['label2'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:label2', 'content' => $headers['twitter']['label2'] ] : null ),
				( isset( $headers['twitter']['data2'] ) ? [ 'tag' => 'meta', 'name' => 'twitter:data2', 'content' => $headers['twitter']['data2'] ] : null ),
				( $config['dnt'] ? [ 'tag' => 'meta', 'name' => 'twitter:dnt', 'content' => 'on' ] : null ),
			], $filter_null );
		}

		/* Apple/iOS */

		$tags[ $key_apple ] = array_filter( [
			[ 'tag' => 'meta', 'name' => 'apple-mobile-web-app-capable', 'content' => 'yes' ],
			[ 'tag' => 'meta', 'name' => 'apple-mobile-web-app-status-bar-style', 'content' => $config['apple']['bar'] ?? 'default' ],
			[ 'tag' => 'meta', 'name' => 'apple-mobile-web-app-title', 'content' => $config['name'] ?: $config['author'] ],
			( ! empty( $config['apple']['id'] ) ? [
				'tag'     => 'meta',
				'name'    => 'apple-itunes-app',
				'content' => "app-id={$config['apple']['id']}" .
							( ! empty( $config['apple']['affiliate'] ) ? ", affiliate-data={$config['apple']['affiliate']}" : "" ) .
							( ! empty( $config['apple']['appArgument'] ) ? ", app-argument={$config['apple']['appArgument']}" : "" )
			] : null ),
			[ 'tag' => 'link', 'rel' => 'apple-touch-icon', 'href' => $config['icon']['src'] ?? null ],
			( ! empty( $config['apple']['maskIcon'] ) ? [ 'tag' => 'link', 'rel' => 'mask-icon', 'href' => $config['apple']['maskIcon'] ?? null, 'color' => $config['color'] ] : null ),
			[ 'tag' => 'link', 'rel' => 'apple-touch-startup-image', 'href' => $config['apple']['image'] ?? ( $config['image']['src'] ?? null ) ],
			[ 'tag' => 'meta', 'name' => 'format-detection', 'content' => is_string( $config['apple']['format'] ?? '' ) ? ( $config['apple']['format'] ?? '' ) : "telephone=no, date=no, address=no, email=no" ],
		], $filter_null );

		if ( ! empty( $config['apple']['touchIcons'] ) && is_array( $config['apple']['touchIcons'] ) ) {
			foreach ( $config['apple']['touchIcons'] as $item ) {
				$tags[ $key_apple ][] = [ 'tag' => 'link', 'rel' => 'apple-touch-icon', 'sizes' => $item['size'] ?? null, 'href' => $item['src'] ?? null ];
			}
		}
		if ( ! empty( $config['apple']['images'] ) && is_array( $config['apple']['images'] ) ) {
			foreach ( $config['apple']['images'] as $img_item ) {
				$tags[ $key_apple ][] = [ 'tag' => 'link', 'rel' => 'apple-touch-startup-image', 'media' => $img_item['media'] ?? null, 'href' => $img_item['src'] ?? null ];
			}
		}
		/* Microsoft */
		$tags[ $key_microsoft ] = array_filter( [
			[ 'tag' => 'meta', 'name' => 'msvalidate.01', 'content' => $config['seo']['bing'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'msapplication-TileColor', 'content' => $config['color'] ],
			[ 'tag' => 'meta', 'name' => 'msapplication-TileImage', 'content' => $config['icon']['src'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'msapplication-config', 'content' => 'none' ],
			[ 'tag' => 'meta', 'name' => 'msapplication-navbutton-color', 'content' => $config['color'] ],
			[ 'tag' => 'meta', 'name' => 'msapplication-tooltip', 'content' => $config['desc'] ],
			[ 'tag' => 'meta', 'name' => 'msapplication-starturl', 'content' => $config['url'] ],
		], $filter_null );


		/* Dublin Core Metadata */
		$tags[ $key_dublin ] = array_merge( $tags[ $key_dublin ] ?? [], array_filter( [
			[ 'tag' => 'meta', 'name' => 'DC.title', 'content' => $config['title_full'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.creator', 'content' => $config['author'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.description', 'content' => $config['desc']?? null ],
			[ 'tag' => 'meta', 'name' => 'DC.subject', 'content' => $config['keywords'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.issued', 'content' => $config['date'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.date', 'content' => $config['date'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.modified', 'content' => $config['modified_date'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'DC.language', 'content' => $config['language'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.type', 'content' => $config['type'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.format', 'content' => 'text/html' ],
			[ 'tag' => 'meta', 'name' => 'DC.identifier', 'content' => $config['url'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.source', 'content' => $config['domain'] ?? null],
			[ 'tag' => 'meta', 'name' => 'DC.rights', 'content' => $config['copyright'] ?? null],
		] ) );

		/* Public Broadcasting Metadata Project */
		$tags[ $key_PBCore  ] = array_merge( $tags[ $key_PBCore ] ?? [], array_filter( [
			[ 'tag' => 'meta', 'name' => 'PBMP.title', 'content' => $config['title_full'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.creator', 'content' => $config['author'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.description', 'content' => $config['desc'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.subject', 'content' => $config['keywords'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.issued', 'content' => $config['date'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.modified', 'content' => $config['modified_date'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.language', 'content' => $config['language'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.format', 'content' => 'text/html' ],
			[ 'tag' => 'meta', 'name' => 'PBMP.identifier', 'content' => $config['url'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.source', 'content' => $config['domain'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.rights', 'content' => $config['copyright'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'PBMP.publisher', 'content' => $config['author'] ?? null ],
		] ) );


		/* DataCite Metadata Schema */
		$tags[ $key_DataCite] = array_merge( $tags[ $key_DataCite ] ?? [], array_filter( [
			[ 'tag' => 'meta', 'name' => 'datacite.creator', 'content' => $config['author'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'datacite.title', 'content' => $config['title_full'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'datacite.publisher', 'content' => $config['author'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'datacite.publicationYear', 'content' => $config['year'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'datacite.resourceType', 'content' => ( $config['type'] === 'article' ? 'Text/Article' : 'InteractiveResource' ) ],
			[ 'tag' => 'meta', 'name' => 'datacite.subject', 'content' => $config['keywords'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'datacite.description', 'content' => $config['desc'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'datacite.language', 'content' => $config['language'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'datacite.url', 'content' => $config['url'] ?? null ],
			[ 'tag' => 'meta', 'name' => 'datacite.dateIssued', 'content' => $config['date'] ?? null ],
		] ) );

		/* Feeds & Search */
		$tags[ $key_feeds ] = array_filter( [
			( ! empty( $config['feeds']['rss'] ) ? [ 'tag' => 'link', 'rel' => 'alternate', 'type' => 'application/rss+xml', 'title' => 'RSS Feed', 'href' => $config['feeds']['rss'] ] : null ),
			( ! empty( $config['feeds']['atom'] ) ? [ 'tag' => 'link', 'rel' => 'alternate', 'type' => 'application/atom+xml', 'title' => 'Atom Feed', 'href' => $config['feeds']['atom'] ] : null ),
			( ! empty( $config['feeds']['json_feed'] ) ? [ 'tag' => 'link', 'rel' => 'alternate', 'type' => 'application/json', 'title' => 'JSON Feed', 'href' => $config['feeds']['json_feed'] ] : null ),
			( ! empty( $config['feeds']['opml'] ) ? [ 'tag' => 'link', 'rel' => 'outline', 'type' => 'text/x-opml', 'title' => 'OPML Outline', 'href' => $config['feeds']['opml'] ] : null ),
			( ! empty( $config['feeds']['search'] ) ? [ 'tag' => 'link', 'rel' => 'search', 'type' => 'application/opensearchdescription+xml', 'title' => $config['name'] ?: $config['title_full'], 'href' => $config['feeds']['search'] ] : null ),
		], $filter_null );

		/* Fonts */
		$tags[ $key_fonts ] = array_filter( [
			( ! empty( $config['fonts']['google'] ) || ! empty( $config['fonts']['google_icons'] ) ? [ 'tag' => 'link', 'rel' => 'preconnect', 'href' => 'https://fonts.googleapis.com' ] : null ),
			( ! empty( $config['fonts']['google'] ) || ! empty( $config['fonts']['google_icons'] ) ? [ 'tag' => 'link', 'rel' => 'preconnect', 'href' => 'https://fonts.gstatic.com', 'crossorigin' => 'anonymous' ] : null ),
			( ! empty( $config['fonts']['google_icons'] ) ? [ 'tag' => 'link', 'rel' => 'stylesheet', 'href' => 'https://fonts.googleapis.com/icon?family=' . ( is_string( $config['fonts']['google_icons'] ) ? $config['fonts']['google_icons'] : 'Material+Icons' ) ] : null ),
		], $filter_null );

		if ( ! empty( $config['fonts']['google'] ) ) {
			$gf_array = is_string( $config['fonts']['google'] ) ? explode( ',', $config['fonts']['google'] ) : $config['fonts']['google'];
			foreach ( $gf_array as $font ) {
				if ( $font ) {
					$tags[ $key_fonts ][] = [ 'tag' => 'link', 'rel' => 'stylesheet', 'href' => "https://fonts.googleapis.com/css2?family=" . urlencode( trim( $font ) ) . "&display=swap" ];
				}
			}
		}

		/* Styles */
		$tags[ $key_styles ] = array_filter( [
			( ! empty( $config['fonts']['fontAwesome'] ) ? [ 'tag' => 'link', 'rel' => 'stylesheet', 'href' => 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css', 'integrity' => 'sha512-SnH5WK+bZxgPHs44uWIX+LLMD/cdS+02iuKEzKuq/kF7CA9d+7EHWfeLu4RKJ8dGqNnLhvz/z9O+4bU9k/I1A==', 'crossorigin' => 'anonymous' ] : null ),
		], $filter_null );

		/* Libraries */
		$tags[ $key_libs ] = array_filter( [
			( ! empty( $config['libs']['threejs'] ) ? [ 'tag' => 'script', 'src' => 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'defer' => true, 'referrerPolicy' => 'no-referrer', 'crossOrigin' => 'anonymous', 'integrity' => 'sha512-dLxUelApnYxpLt6k2iomG+5mySXGHxDtoV26s16ld6MFzQXwOossGTqukAosxxZk31kyEmoM6u48tJn+eJ2fag==' ] : null ),
			( ! empty( $config['libs']['gsap'] ) ? [ 'tag' => 'script', 'src' => 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', 'defer' => true, 'referrerPolicy' => 'no-referrer', 'crossOrigin' => 'anonymous', 'integrity' => 'sha512-7eHRwcbYkK4d9g/6tD/mhkf++eoTHwpNM9woBxtPUBWm67zeAfFC+HrdoE2GanKeocly/VxeLvIqwvCdk7qScg==' ] : null ),
			( ! empty( $config['libs']['jquery'] ) ? [ 'tag' => 'script', 'src' => 'https://code.jquery.com/jquery-3.7.1.min.js', 'integrity' => 'sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=', 'crossorigin' => 'anonymous' ] : null ),
		], $filter_null );

		/* Scripts & Analytics */
		$tags[ $key_scripts ] = array_filter( [
			/* GTM */
			( ! empty( $config['google']['tag_manager'] ) ? [ 'tag' => 'script', '_html' => "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','{$config['google']['tag_manager']}');" ] : null ),

			/* GA4 */
			( ! empty( $config['google']['analytics'] ) ? [ 'tag' => 'script', 'async' => true, 'src' => "https://www.googletagmanager.com/gtag/js?id={$config['google']['analytics']}" ] : null ),
			( ! empty( $config['google']['analytics'] ) ? [ 'tag' => 'script', '_html' => "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','{$config['google']['analytics']}');" ] : null ),

			/* Cloudflare */
			( ! empty( $config['cloudflare']['token'] ) ? [ 'tag' => 'script', 'defer' => true, 'src' => 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon' => json_encode( [ 'token' => $config['cloudflare']['token'] ] ) ] : null ),

			/* Firebase */
			( ! empty( $config['firebase']['apiKey'] ) ? [ 'tag' => 'script', '_html' => "const firebaseConfig=" . json_encode( $config['firebase'] ) . ";/* Initialize Firebase Here */" ] : null ),

			/* Schema.org */
			[
				'tag'   => 'script',
				'type'  => 'application/ld+json',
				'_html' => json_encode( array_filter( [
					"@context"    => "https://schema.org",
					"@type"       => ( $config['type'] === 'article' ? 'Article' : 'WebSite' ),
					"name"        => $config['title_full'],
					"url"         => $config['url'],
					"description" => $config['desc'],
					"author"      => [ "@type" => "Person", "name" => $config['author'] ],
					"image"       => $config['image']['src'] ?? null,
					"dateCreated" => $config['date'] ?? null,
					"dateModified" => $config['modified'] ?? null,
					"inLanguage" => $config['language'] ?? null,
				] ), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT )
			],



			/* Service Worker */
			( ! empty( $config['sw_path'] ) ? [ 'tag' => 'script', '_html' => "if('serviceWorker' in navigator){navigator.serviceWorker.register('{$config['sw_path']}');}" ] : null ),

			/* AdSense */
			( ! empty( $config['google']['adsense'] ) ? [ 'tag' => 'script', 'async' => true, 'src' => "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={$config['google']['adsense']}", 'crossorigin' => 'anonymous' ] : null ),
		], $filter_null );

		/* Extra */
		$tags[ $key_extra ] = $config['extra'] ?? [];

		ksort( $tags );
		$html_output = "\t<head>";
		$tabs        = "\t\t\t\t";

		foreach ( $tags as $section => $items ) {
			// Smart Filter: Discard tags with any empty values (except literal 0)
			$items = array_filter( $items, function( $tag_definition ) {
				foreach ( $tag_definition as $val ) {
					if ( empty( $val ) && $val !== '0' && $val !== 0 ) {
						return false;
					}
				}
				return true;
			});

			if ( empty( $items ) ) {
				continue;
			}

			ksort( $items );

			// Section Header
			$clean_section = function_exists( 'cleanOutput' )
				? cleanOutput( preg_replace( '/^\d{2}\.\s*/', '', $section ) )
				: trim( preg_replace( '/^\d{2}\.\s*/', '', $section ) );

			$html_output .= "\n" . $tabs . "<!-- " . $clean_section . " -->" . "\n" . $tabs;

			foreach ( $items as $item ) {
				if ( empty( $item['tag'] ) ) {
					continue;
				}
				$tag_html = renderHeadTag( $item['tag'], $item );

				if ( $tag_html ) {
					$html_output .= $tag_html . "\n" . $tabs;
				}
			}

			// Clean up trailing tab
			$html_output = rtrim( $html_output, $tabs );
			$html_output = rtrim( $html_output, "\n" );
			$html_output .= "\n";
		}

		$html_output .= "</head>";
		$html_output  = trim( $html_output );
		$html_output  = preg_replace( '/^\R+/m', '', $html_output );
		$html_output .= "\n";

		return trim( $html_output );
	}

	function headShortCode( array $args, $content = null ): string {
		return generateHead( $args );
	}

	if ( function_exists( 'add_shortcode' ) ) {
		add_shortcode( 'head', 'headShortCode' );
	}
?>