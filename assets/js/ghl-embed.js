/**
 * Fit Pal — GoHighLevel embed placeholder.
 *
 * Replace the vendor script URL below (or inject via a child theme / plugin)
 * when wiring a live GHL form. Keep GHL logic isolated to this handle.
 *
 * @package Fit_Pal
 */
(function () {
	'use strict';

	/**
	 * Mount point selector used by the ghl-lead-capture template part.
	 * Drop your GHL embed markup/script into elements matching this class.
	 */
	var slots = document.querySelectorAll('[data-fit-pal-ghl-slot]');

	if (!slots.length) {
		return;
	}

	// Intentionally empty: attach GHL widget initialization here when ready.
})();
