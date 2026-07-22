<?php
/**
 * Fit Pal theme functions and hooks.
 *
 * @package Fit_Pal
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'FIT_PAL_VERSION', '1.0.0' );
define( 'FIT_PAL_DIR', get_template_directory() );
define( 'FIT_PAL_URI', get_template_directory_uri() );

/**
 * Sets up theme defaults and registers support for WordPress features.
 */
function fit_pal_setup() {
	load_theme_textdomain( 'fit-pal', FIT_PAL_DIR . '/languages' );

	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 80,
			'width'       => 240,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	// WooCommerce: declare explicit theme support for shop templates & hooks.
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'fit_pal_setup' );

/**
 * Enqueues global front-end styles and typefaces.
 */
function fit_pal_enqueue_assets() {
	wp_enqueue_style(
		'fit-pal-fonts',
		'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Outfit:wght@500;600;700;800&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'fit-pal-global',
		FIT_PAL_URI . '/assets/css/global.css',
		array( 'fit-pal-fonts' ),
		FIT_PAL_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'fit_pal_enqueue_assets' );

/**
 * Enqueues editor styles so the canvas matches the front end.
 */
function fit_pal_editor_assets() {
	add_editor_style( 'assets/css/global.css' );
}
add_action( 'after_setup_theme', 'fit_pal_editor_assets' );

/**
 * Registers a dedicated script handle for GoHighLevel embed widgets.
 *
 * External GHL form scripts should be attached to this handle (or replaced
 * via wp_enqueue_script with the vendor URL) so they stay isolated from theme UI.
 */
function fit_pal_enqueue_ghl_assets() {
	if ( ! is_singular() && ! is_front_page() ) {
		return;
	}

	wp_register_script(
		'fit-pal-ghl',
		FIT_PAL_URI . '/assets/js/ghl-embed.js',
		array(),
		FIT_PAL_VERSION,
		true
	);

	wp_enqueue_script( 'fit-pal-ghl' );
}
add_action( 'wp_enqueue_scripts', 'fit_pal_enqueue_ghl_assets' );

/**
 * Whether the current request is the Meal Planner dashboard template.
 *
 * Supports FSE custom template slug `page-meal-planner` (theme.json) and
 * the conventional /meal-planner/ page slug as a fallback.
 *
 * @return bool
 */
function fit_pal_is_meal_planner_page() {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}

	$template_slug = get_page_template_slug();

	if ( is_string( $template_slug ) && '' !== $template_slug ) {
		$normalized = str_replace( array( 'templates/', '.html' ), '', $template_slug );
		if ( 'page-meal-planner' === $normalized || 'page-meal-planner' === $template_slug ) {
			return true;
		}
	}

	if ( is_page_template( 'page-meal-planner' ) || is_page_template( 'templates/page-meal-planner.html' ) ) {
		return true;
	}

	return is_page( 'meal-planner' );
}

/**
 * Enqueues the Meal Planner engine on the page-meal-planner template only.
 */
function fit_pal_enqueue_meal_planner() {
	if ( ! fit_pal_is_meal_planner_page() ) {
		return;
	}

	$script_path = FIT_PAL_DIR . '/assets/js/meal-planner.js';

	if ( ! file_exists( $script_path ) ) {
		return;
	}

	wp_enqueue_script(
		'fit-pal-meal-planner',
		FIT_PAL_URI . '/assets/js/meal-planner.js',
		array(),
		FIT_PAL_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'fit_pal_enqueue_meal_planner' );
