/**
 * Fit Pal — Meal Planner Engine
 *
 * Tabs: Meal board → Grocery → Cook
 * Diversified viand catalog · optional macros drawers ·
 * save board · batch cook remaining days · log done cooking.
 *
 * @package Fit_Pal
 */
(function (window, document) {
	'use strict';

	const STORAGE_KEY = 'fitPal.mealPlanner.v4';
	const GROCERY_SPAN_OPTIONS = [1, 2, 3, 4];
	const BATCH_WINDOW_OPTIONS = [2, 3, 5, 7];
	const MACRO_KEYS = ['calories', 'protein', 'carbs', 'fats'];
	const TABS = ['board', 'grocery', 'cook'];
	const MAX_BOARD_HISTORY = 5;

	const DEFAULT_TARGETS = {
		calories: 2200,
		protein: 180,
		carbs: 220,
		fats: 65,
	};

	const DEFAULT_INGREDIENTS = {
		'chicken-breast': {
			id: 'chicken-breast',
			name: 'Chicken Breast (skinless)',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
		},
		tokwa: {
			id: 'tokwa',
			name: 'Tokwa (firm tofu)',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 144, protein: 17, carbs: 3, fats: 9 },
		},
		'tuna-canned': {
			id: 'tuna-canned',
			name: 'Canned Tuna in Water',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 116, protein: 26, carbs: 0, fats: 1 },
		},
		tilapia: {
			id: 'tilapia',
			name: 'Tilapia Fillet',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 128, protein: 26, carbs: 0, fats: 2.7 },
		},
		'pork-tenderloin': {
			id: 'pork-tenderloin',
			name: 'Pork Tenderloin (lean)',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 143, protein: 26, carbs: 0, fats: 3.5 },
		},
		'beef-sirloin': {
			id: 'beef-sirloin',
			name: 'Beef Sirloin (lean)',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 158, protein: 27, carbs: 0, fats: 5 },
		},
		bangus: {
			id: 'bangus',
			name: 'Bangus Fillet (boneless)',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 148, protein: 20, carbs: 0, fats: 7 },
		},
		shrimp: {
			id: 'shrimp',
			name: 'Shrimp (peeled)',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 99, protein: 24, carbs: 0.2, fats: 0.3 },
		},
		'egg-whites': {
			id: 'egg-whites',
			name: 'Egg Whites',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 52, protein: 11, carbs: 0.7, fats: 0.2 },
		},
		'ground-turkey': {
			id: 'ground-turkey',
			name: 'Ground Turkey (lean)',
			category: 'lean-proteins',
			unit: 'g',
			macrosPer100g: { calories: 150, protein: 20, carbs: 0, fats: 8 },
		},
		eggs: {
			id: 'eggs',
			name: 'Eggs (whole)',
			category: 'lean-proteins',
			unit: 'pcs',
			gramsPerUnit: 50,
			macrosPer100g: { calories: 143, protein: 13, carbs: 1.1, fats: 9.5 },
		},
		rice: {
			id: 'rice',
			name: 'Rice (uncooked)',
			category: 'complex-carbs',
			unit: 'g',
			macrosPer100g: { calories: 365, protein: 7, carbs: 80, fats: 0.6 },
		},
		kamote: {
			id: 'kamote',
			name: 'Kamote (sweet potato)',
			category: 'complex-carbs',
			unit: 'g',
			macrosPer100g: { calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
		},
		sibuyas: {
			id: 'sibuyas',
			name: 'Sibuyas (onion)',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1 },
		},
		bawang: {
			id: 'bawang',
			name: 'Bawang (garlic)',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 149, protein: 6.4, carbs: 33, fats: 0.5 },
		},
		kangkong: {
			id: 'kangkong',
			name: 'Kangkong',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 19, protein: 2.6, carbs: 3.1, fats: 0.2 },
		},
		sitaw: {
			id: 'sitaw',
			name: 'Sitaw (string beans)',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 31, protein: 1.8, carbs: 7, fats: 0.1 },
		},
		repa: {
			id: 'repa',
			name: 'Repolyo / cabbage',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 25, protein: 1.3, carbs: 5.8, fats: 0.1 },
		},
		toyo: {
			id: 'toyo',
			name: 'Toyo (soy sauce)',
			category: 'veggies-staples',
			unit: 'ml',
			macrosPer100g: { calories: 53, protein: 8, carbs: 5, fats: 0.1 },
		},
		suka: {
			id: 'suka',
			name: 'Suka (vinegar)',
			category: 'veggies-staples',
			unit: 'ml',
			macrosPer100g: { calories: 18, protein: 0, carbs: 0.7, fats: 0 },
		},
		gata: {
			id: 'gata',
			name: 'Gata (lite coconut milk)',
			category: 'veggies-staples',
			unit: 'ml',
			macrosPer100g: { calories: 120, protein: 1.2, carbs: 3, fats: 12 },
		},
		siling_labuyo: {
			id: 'siling_labuyo',
			name: 'Siling labuyo',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 40, protein: 1.9, carbs: 8.8, fats: 0.4 },
		},
		luya: {
			id: 'luya',
			name: 'Luya (ginger)',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 80, protein: 1.8, carbs: 18, fats: 0.8 },
		},
		kalabasa: {
			id: 'kalabasa',
			name: 'Kalabasa',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 26, protein: 1, carbs: 6.5, fats: 0.1 },
		},
		tomato: {
			id: 'tomato',
			name: 'Kamatis',
			category: 'veggies-staples',
			unit: 'g',
			macrosPer100g: { calories: 18, protein: 0.9, carbs: 3.9, fats: 0.2 },
		},
	};

	const CATEGORY_META = {
		'lean-proteins': { label: 'Lean Proteins', order: 1 },
		'complex-carbs': { label: 'Complex Carbs', order: 2 },
		'veggies-staples': { label: 'Veggies & Staples', order: 3 },
	};

	/**
	 * Diversified viand library — title is the dish name, not the protein.
	 * Multiple dishes can share the same protein source.
	 */
	const VIANDS = {
		'tokwa-scramble': {
			id: 'tokwa-scramble',
			name: 'Tokwa Scramble',
			proteinId: 'tokwa',
			proteinGrams: 200,
			sides: [
				{ id: 'eggs', amount: 2 },
				{ id: 'rice', amount: 80 },
				{ id: 'sibuyas', amount: 40 },
			],
			timeMin: 20,
			steps: [
				'Dice tokwa and pat dry. Beat eggs with a pinch of salt.',
				'Sauté sibuyas until soft, then brown the tokwa.',
				'Pour in eggs and scramble gently. Serve over rice.',
			],
			batchTip: 'Pre-dice tokwa and onions; scramble fresh when possible.',
		},
		'tokwa-adobo': {
			id: 'tokwa-adobo',
			name: 'Tokwa Adobo',
			proteinId: 'tokwa',
			proteinGrams: 220,
			sides: [
				{ id: 'rice', amount: 90 },
				{ id: 'sibuyas', amount: 50 },
				{ id: 'bawang', amount: 15 },
				{ id: 'toyo', amount: 25 },
				{ id: 'suka', amount: 20 },
			],
			timeMin: 30,
			steps: [
				'Pan-fry tokwa cubes until golden; set aside.',
				'Simmer toyo, suka, bawang, and sibuyas.',
				'Return tokwa to the sauce and simmer 8–10 minutes. Serve with rice.',
			],
			batchTip: 'Fry a big batch of tokwa once; sauce and store in portions.',
		},
		'tokwa-sisig': {
			id: 'tokwa-sisig',
			name: 'Tokwa Sisig',
			proteinId: 'tokwa',
			proteinGrams: 200,
			sides: [
				{ id: 'sibuyas', amount: 60 },
				{ id: 'siling_labuyo', amount: 5 },
				{ id: 'suka', amount: 15 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 25,
			steps: [
				'Crisp-fry diced tokwa. Chop sibuyas and chili.',
				'Toss tokwa with onion, chili, and suka on a hot pan.',
				'Serve sizzling-style over rice.',
			],
			batchTip: 'Keep fried tokwa separate; finish with onion and suka per meal.',
		},
		'chicken-adobo': {
			id: 'chicken-adobo',
			name: 'Chicken Breast Adobo',
			proteinId: 'chicken-breast',
			proteinGrams: 180,
			sides: [
				{ id: 'rice', amount: 90 },
				{ id: 'sibuyas', amount: 50 },
				{ id: 'bawang', amount: 15 },
				{ id: 'toyo', amount: 20 },
				{ id: 'suka', amount: 20 },
				{ id: 'repa', amount: 80 },
			],
			timeMin: 40,
			steps: [
				'Cut chicken into even pieces. Smash bawang; slice sibuyas.',
				'Simmer toyo, suka, bawang, and sibuyas. Add chicken; cover 20–25 min.',
				'Stir in shredded repolyo for the last 5 minutes. Serve with rice.',
			],
			batchTip: 'Cook full adobo once, cool fast, fridge in day portions.',
		},
		'chicken-tinola': {
			id: 'chicken-tinola',
			name: 'Chicken Tinola',
			proteinId: 'chicken-breast',
			proteinGrams: 180,
			sides: [
				{ id: 'luya', amount: 20 },
				{ id: 'sibuyas', amount: 40 },
				{ id: 'bawang', amount: 10 },
				{ id: 'kalabasa', amount: 120 },
				{ id: 'kangkong', amount: 80 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 35,
			steps: [
				'Sauté bawang, sibuyas, and luya. Add chicken and sear briefly.',
				'Add water and kalabasa; simmer until chicken is cooked.',
				'Add kangkong at the end. Serve with rice.',
			],
			batchTip: 'Batch the broth and chicken; add greens when reheating.',
		},
		'chicken-inasal': {
			id: 'chicken-inasal',
			name: 'Chicken Inasal-Style',
			proteinId: 'chicken-breast',
			proteinGrams: 180,
			sides: [
				{ id: 'luya', amount: 15 },
				{ id: 'bawang', amount: 10 },
				{ id: 'suka', amount: 25 },
				{ id: 'sibuyas', amount: 30 },
				{ id: 'rice', amount: 90 },
			],
			timeMin: 35,
			steps: [
				'Marinate chicken in suka, luya, and bawang for at least 20 minutes.',
				'Grill or pan-sear until cooked through.',
				'Serve with rice and sliced sibuyas.',
			],
			batchTip: 'Marinate a full tray; cook only what you need for the window.',
		},
		'tuna-bicol': {
			id: 'tuna-bicol',
			name: 'Spicy Tuna Bicol Express',
			proteinId: 'tuna-canned',
			proteinGrams: 150,
			sides: [
				{ id: 'kamote', amount: 150 },
				{ id: 'sitaw', amount: 80 },
				{ id: 'kangkong', amount: 60 },
				{ id: 'gata', amount: 40 },
				{ id: 'siling_labuyo', amount: 5 },
				{ id: 'bawang', amount: 10 },
			],
			timeMin: 25,
			steps: [
				'Sauté bawang and siling labuyo. Add drained tuna briefly.',
				'Pour in lite gata; simmer 5 minutes.',
				'Add sitaw then kangkong. Serve over kamote.',
			],
			batchTip: 'Prep kamote ahead; finish gata sauce the day you eat.',
		},
		'tuna-omelette': {
			id: 'tuna-omelette',
			name: 'Tuna Omelette',
			proteinId: 'tuna-canned',
			proteinGrams: 120,
			sides: [
				{ id: 'eggs', amount: 2 },
				{ id: 'sibuyas', amount: 40 },
				{ id: 'tomato', amount: 60 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 15,
			steps: [
				'Drain tuna. Beat eggs with chopped sibuyas and kamatis.',
				'Fold tuna into the egg mix and cook as an omelette.',
				'Serve with rice.',
			],
			batchTip: 'Keep tuna cans ready; cook omelettes fresh.',
		},
		'tilapia-escabeche': {
			id: 'tilapia-escabeche',
			name: 'Tilapia Escabeche',
			proteinId: 'tilapia',
			proteinGrams: 180,
			sides: [
				{ id: 'sibuyas', amount: 50 },
				{ id: 'bawang', amount: 10 },
				{ id: 'suka', amount: 30 },
				{ id: 'repa', amount: 80 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 30,
			steps: [
				'Pan-fry tilapia until cooked; set aside.',
				'Sauté sibuyas, bawang, and repolyo. Deglaze with suka.',
				'Pour sauce over fish. Serve with rice.',
			],
			batchTip: 'Cook fish day-of when possible; prep veggie sauce ahead.',
		},
		'tilapia-steamed': {
			id: 'tilapia-steamed',
			name: 'Steamed Tilapia with Ginger',
			proteinId: 'tilapia',
			proteinGrams: 180,
			sides: [
				{ id: 'luya', amount: 20 },
				{ id: 'bawang', amount: 8 },
				{ id: 'toyo', amount: 15 },
				{ id: 'kangkong', amount: 80 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 25,
			steps: [
				'Steam tilapia with luya and bawang until flaky.',
				'Drizzle light toyo. Blanch or sauté kangkong on the side.',
				'Serve with rice.',
			],
			batchTip: 'Portion fish fillets raw; steam only for the cook window.',
		},
		'pork-adobo': {
			id: 'pork-adobo',
			name: 'Lean Pork Adobo',
			proteinId: 'pork-tenderloin',
			proteinGrams: 170,
			sides: [
				{ id: 'rice', amount: 90 },
				{ id: 'sibuyas', amount: 50 },
				{ id: 'bawang', amount: 15 },
				{ id: 'toyo', amount: 20 },
				{ id: 'suka', amount: 20 },
			],
			timeMin: 40,
			steps: [
				'Cut pork into cubes. Simmer with toyo, suka, bawang, and sibuyas.',
				'Cook until tender and sauce reduces.',
				'Serve with rice.',
			],
			batchTip: 'Excellent for multi-day fridge batches.',
		},
		'pork-giniling': {
			id: 'pork-giniling',
			name: 'Pork Giniling',
			proteinId: 'pork-tenderloin',
			proteinGrams: 170,
			sides: [
				{ id: 'sibuyas', amount: 50 },
				{ id: 'bawang', amount: 12 },
				{ id: 'tomato', amount: 80 },
				{ id: 'repa', amount: 70 },
				{ id: 'rice', amount: 90 },
			],
			timeMin: 35,
			steps: [
				'Mince or finely chop pork. Sauté bawang and sibuyas.',
				'Add pork, then kamatis; simmer. Fold in repolyo.',
				'Serve with rice.',
			],
			batchTip: 'One big giniling pot covers several days easily.',
		},
		'beef-stirfry': {
			id: 'beef-stirfry',
			name: 'Beef Sirloin Stir-Fry',
			proteinId: 'beef-sirloin',
			proteinGrams: 160,
			sides: [
				{ id: 'sibuyas', amount: 50 },
				{ id: 'bawang', amount: 10 },
				{ id: 'sitaw', amount: 80 },
				{ id: 'toyo', amount: 15 },
				{ id: 'rice', amount: 90 },
			],
			timeMin: 25,
			steps: [
				'Slice beef thin against the grain.',
				'Hot-pan sear beef, then toss with sibuyas, bawang, sitaw, and toyo.',
				'Serve immediately with rice.',
			],
			batchTip: 'Pre-slice beef; stir-fry per cook day for best texture.',
		},
		'beef-nilaga': {
			id: 'beef-nilaga',
			name: 'Beef Nilaga',
			proteinId: 'beef-sirloin',
			proteinGrams: 170,
			sides: [
				{ id: 'sibuyas', amount: 50 },
				{ id: 'luya', amount: 15 },
				{ id: 'repa', amount: 100 },
				{ id: 'kalabasa', amount: 100 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 50,
			steps: [
				'Simmer beef with sibuyas and luya until tender.',
				'Add kalabasa, then repolyo near the end.',
				'Serve with rice.',
			],
			batchTip: 'Classic batch soup — portion into day containers.',
		},
		'bangus-sinigang': {
			id: 'bangus-sinigang',
			name: 'Bangus Sinigang Bowl',
			proteinId: 'bangus',
			proteinGrams: 180,
			sides: [
				{ id: 'sibuyas', amount: 40 },
				{ id: 'tomato', amount: 80 },
				{ id: 'sitaw', amount: 70 },
				{ id: 'kangkong', amount: 80 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 35,
			steps: [
				'Simmer sibuyas and kamatis in sour broth.',
				'Add bangus and sitaw; cook until fish is done.',
				'Finish with kangkong. Serve with rice.',
			],
			batchTip: 'Prep veggies ahead; cook fish in the window you will eat.',
		},
		'bangus-grilled': {
			id: 'bangus-grilled',
			name: 'Grilled Bangus',
			proteinId: 'bangus',
			proteinGrams: 180,
			sides: [
				{ id: 'tomato', amount: 80 },
				{ id: 'sibuyas', amount: 40 },
				{ id: 'suka', amount: 20 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 25,
			steps: [
				'Season bangus lightly and grill or pan-sear.',
				'Serve with kamatis, sibuyas, and suka on the side over rice.',
			],
			batchTip: 'Best cooked fresh; portion fillets in the freezer ahead.',
		},
		'shrimp-garlic': {
			id: 'shrimp-garlic',
			name: 'Garlic Shrimp',
			proteinId: 'shrimp',
			proteinGrams: 160,
			sides: [
				{ id: 'bawang', amount: 20 },
				{ id: 'sibuyas', amount: 30 },
				{ id: 'kangkong', amount: 80 },
				{ id: 'rice', amount: 80 },
			],
			timeMin: 20,
			steps: [
				'Sauté lots of bawang until fragrant. Add shrimp until pink.',
				'Toss in kangkong briefly.',
				'Serve with rice.',
			],
			batchTip: 'Keep shrimp frozen; thaw only for the cook window.',
		},
		'shrimp-ginataan': {
			id: 'shrimp-ginataan',
			name: 'Shrimp Ginataan',
			proteinId: 'shrimp',
			proteinGrams: 160,
			sides: [
				{ id: 'gata', amount: 50 },
				{ id: 'sitaw', amount: 80 },
				{ id: 'kalabasa', amount: 100 },
				{ id: 'bawang', amount: 10 },
				{ id: 'siling_labuyo', amount: 4 },
				{ id: 'kamote', amount: 120 },
			],
			timeMin: 30,
			steps: [
				'Sauté bawang and chili. Add kalabasa and gata; simmer.',
				'Add sitaw, then shrimp until just cooked.',
				'Serve over kamote.',
			],
			batchTip: 'Cook sauce base ahead; add shrimp last when reheating.',
		},
		'eggwhite-scramble': {
			id: 'eggwhite-scramble',
			name: 'Egg White Veggie Scramble',
			proteinId: 'egg-whites',
			proteinGrams: 200,
			sides: [
				{ id: 'sibuyas', amount: 40 },
				{ id: 'tomato', amount: 60 },
				{ id: 'kangkong', amount: 60 },
				{ id: 'rice', amount: 70 },
			],
			timeMin: 15,
			steps: [
				'Sauté sibuyas, kamatis, and kangkong.',
				'Pour in egg whites and scramble softly.',
				'Serve with rice.',
			],
			batchTip: 'Chop veggies once; scramble egg whites fresh.',
		},
		'turkey-giniling': {
			id: 'turkey-giniling',
			name: 'Turkey Giniling',
			proteinId: 'ground-turkey',
			proteinGrams: 170,
			sides: [
				{ id: 'sibuyas', amount: 50 },
				{ id: 'bawang', amount: 12 },
				{ id: 'tomato', amount: 80 },
				{ id: 'repa', amount: 70 },
				{ id: 'rice', amount: 90 },
			],
			timeMin: 30,
			steps: [
				'Sauté bawang and sibuyas. Brown turkey.',
				'Add kamatis and simmer. Fold in repolyo.',
				'Serve with rice.',
			],
			batchTip: 'One pot covers several board days.',
		},
	};

	/** Rotating default day templates so a week is not identical every day. */
	const DEFAULT_DAY_PATTERNS = [
		['tokwa-scramble', 'chicken-adobo', 'tuna-bicol'],
		['eggwhite-scramble', 'pork-adobo', 'tilapia-steamed'],
		['tuna-omelette', 'chicken-tinola', 'shrimp-garlic'],
		['tokwa-sisig', 'beef-stirfry', 'bangus-sinigang'],
		['tokwa-adobo', 'chicken-inasal', 'shrimp-ginataan'],
		['tuna-bicol', 'pork-giniling', 'tilapia-escabeche'],
		['eggwhite-scramble', 'turkey-giniling', 'bangus-grilled'],
	];

	const EMPTY_MACROS = { calories: 0, protein: 0, carbs: 0, fats: 0 };

	/* ------------------------------------------------------------------ */
	/* Helpers                                                            */
	/* ------------------------------------------------------------------ */

	function clampOption(value, allowed, fallback) {
		const n = Number(value);
		return allowed.includes(n) ? n : fallback;
	}

	function sanitizeMacroValue(raw, key) {
		const n = Number(raw);
		if (!Number.isFinite(n) || n < 0) {
			return 0;
		}
		return key === 'calories' ? Math.round(n) : Math.round(n * 10) / 10;
	}

	function uid() {
		return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
	}

	function el(tag, className, text) {
		const node = document.createElement(tag);
		if (className) {
			node.className = className;
		}
		if (typeof text === 'string') {
			node.textContent = text;
		}
		return node;
	}

	function clearNode(node) {
		if (!node) {
			return;
		}
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
	}

	function formatAmount(amount, unit) {
		if (unit === 'pcs') {
			return `${amount} pcs`;
		}
		if (unit === 'ml') {
			return `${amount} ml`;
		}
		if (amount >= 1000) {
			return `${(amount / 1000).toFixed(2)} kg`;
		}
		return `${amount} g`;
	}

	function buildCatalog(overrides) {
		const catalog = {};
		Object.keys(DEFAULT_INGREDIENTS).forEach((id) => {
			const base = DEFAULT_INGREDIENTS[id];
			const override = overrides && overrides[id] ? overrides[id] : null;
			catalog[id] = {
				...base,
				macrosPer100g: {
					calories: Number(override?.calories ?? base.macrosPer100g.calories),
					protein: Number(override?.protein ?? base.macrosPer100g.protein),
					carbs: Number(override?.carbs ?? base.macrosPer100g.carbs),
					fats: Number(override?.fats ?? base.macrosPer100g.fats),
				},
			};
		});
		return catalog;
	}

	function macrosFromGrams(grams, per100) {
		const f = grams / 100;
		return {
			calories: Math.round(per100.calories * f),
			protein: Math.round(per100.protein * f * 10) / 10,
			carbs: Math.round(per100.carbs * f * 10) / 10,
			fats: Math.round(per100.fats * f * 10) / 10,
		};
	}

	function toGrams(catalog, ingredientId, amount) {
		const item = catalog[ingredientId];
		if (!item) {
			return 0;
		}
		if (item.unit === 'pcs' && item.gramsPerUnit) {
			return amount * item.gramsPerUnit;
		}
		return amount;
	}

	function addMacros(a, b) {
		return {
			calories: a.calories + b.calories,
			protein: Math.round((a.protein + b.protein) * 10) / 10,
			carbs: Math.round((a.carbs + b.carbs) * 10) / 10,
			fats: Math.round((a.fats + b.fats) * 10) / 10,
		};
	}

	function resolveMeal(meal) {
		const viand = VIANDS[meal.viandId];
		if (!viand) {
			return null;
		}
		return {
			instanceId: meal.instanceId,
			viandId: viand.id,
			name: viand.name,
			proteinId: viand.proteinId,
			proteinGrams: meal.proteinGrams || viand.proteinGrams,
			sides: viand.sides.map((s) => ({ id: s.id, amount: s.amount })),
			timeMin: viand.timeMin,
			steps: viand.steps.slice(),
			batchTip: viand.batchTip,
		};
	}

	function getMealMacros(catalog, meal) {
		const resolved = resolveMeal(meal);
		if (!resolved) {
			return { ...EMPTY_MACROS };
		}
		let totals = { ...EMPTY_MACROS };
		const protein = catalog[resolved.proteinId];
		if (protein) {
			totals = addMacros(
				totals,
				macrosFromGrams(resolved.proteinGrams, protein.macrosPer100g)
			);
		}
		resolved.sides.forEach((side) => {
			const item = catalog[side.id];
			if (!item) {
				return;
			}
			totals = addMacros(
				totals,
				macrosFromGrams(
					toGrams(catalog, side.id, side.amount),
					item.macrosPer100g
				)
			);
		});
		return totals;
	}

	function getDayMacros(catalog, day) {
		return day.meals.reduce(
			(acc, meal) => addMacros(acc, getMealMacros(catalog, meal)),
			{ ...EMPTY_MACROS }
		);
	}

	function getAverageDailyMacros(catalog, days) {
		const active = days.filter((d) => d.meals.length > 0);
		if (!active.length) {
			return { ...EMPTY_MACROS };
		}
		const sum = active.reduce(
			(acc, day) => addMacros(acc, getDayMacros(catalog, day)),
			{ ...EMPTY_MACROS }
		);
		const n = active.length;
		return {
			calories: Math.round(sum.calories / n),
			protein: Math.round((sum.protein / n) * 10) / 10,
			carbs: Math.round((sum.carbs / n) * 10) / 10,
			fats: Math.round((sum.fats / n) * 10) / 10,
		};
	}

	function createMealFromViand(viandId) {
		const viand = VIANDS[viandId];
		if (!viand) {
			return null;
		}
		return {
			instanceId: uid(),
			viandId: viand.id,
			proteinGrams: viand.proteinGrams,
		};
	}

	function createDefaultDay(dayIndex) {
		const pattern =
			DEFAULT_DAY_PATTERNS[dayIndex % DEFAULT_DAY_PATTERNS.length];
		return {
			dayIndex,
			meals: pattern.map((id) => createMealFromViand(id)).filter(Boolean),
		};
	}

	/**
	 * Detect legacy boards where every day cloned the same 3-meal template.
	 * @param {Array} days
	 */
	function isUniformLegacyBoard(days) {
		if (!Array.isArray(days) || days.length < 2) {
			return false;
		}
		const signature = (day) =>
			(day.meals || []).map((m) => m.viandId).join('|');
		const first = signature(days[0]);
		if (!first) {
			return false;
		}
		const legacyDefault = 'tokwa-scramble|chicken-adobo|tuna-bicol';
		return first === legacyDefault && days.every((d) => signature(d) === first);
	}

	function buildPlanDays(weeks, previousDays) {
		const dayCount = weeks * 7;
		const prev = Array.isArray(previousDays) ? previousDays : [];
		const days = [];

		for (let i = 0; i < dayCount; i += 1) {
			const existing = prev.find((d) => d.dayIndex === i);
			if (existing && Array.isArray(existing.meals)) {
				days.push({
					dayIndex: i,
					meals: existing.meals
						.map((m) => {
							if (!VIANDS[m.viandId]) {
								return null;
							}
							return {
								instanceId: m.instanceId || uid(),
								viandId: m.viandId,
								proteinGrams:
									typeof m.proteinGrams === 'number'
										? m.proteinGrams
										: VIANDS[m.viandId].proteinGrams,
							};
						})
						.filter(Boolean),
				});
			} else {
				days.push(createDefaultDay(i));
			}
		}

		return days;
	}

	function aggregateIngredients(days) {
		const totals = {};
		days.forEach((day) => {
			day.meals.forEach((meal) => {
				const resolved = resolveMeal(meal);
				if (!resolved) {
					return;
				}
				totals[resolved.proteinId] =
					(totals[resolved.proteinId] || 0) + resolved.proteinGrams;
				resolved.sides.forEach((side) => {
					totals[side.id] = (totals[side.id] || 0) + side.amount;
				});
			});
		});
		return totals;
	}

	function groupGrocery(catalog, totals) {
		const buckets = {
			'lean-proteins': [],
			'complex-carbs': [],
			'veggies-staples': [],
		};

		Object.keys(totals).forEach((id) => {
			const item = catalog[id];
			const amount = totals[id];
			if (!item || !amount) {
				return;
			}
			const bucket = buckets[item.category];
			if (!bucket) {
				return;
			}
			bucket.push({
				id: item.id,
				name: item.name,
				amount: Math.round(amount),
				unit: item.unit,
			});
		});

		return Object.keys(CATEGORY_META)
			.sort((a, b) => CATEGORY_META[a].order - CATEGORY_META[b].order)
			.map((key) => ({
				category: key,
				label: CATEGORY_META[key].label,
				items: buckets[key].sort((a, b) => a.name.localeCompare(b.name)),
			}))
			.filter((group) => group.items.length > 0);
	}

	function buildBatchRecipes(daysSlice) {
		const byViand = {};

		daysSlice.forEach((day) => {
			day.meals.forEach((meal) => {
				const resolved = resolveMeal(meal);
				if (!resolved) {
					return;
				}
				if (!byViand[resolved.viandId]) {
					byViand[resolved.viandId] = {
						viandId: resolved.viandId,
						name: resolved.name,
						proteinId: resolved.proteinId,
						proteinGrams: 0,
						sides: {},
						count: 0,
						timeMin: resolved.timeMin,
						steps: resolved.steps,
						batchTip: resolved.batchTip,
					};
				}
				const entry = byViand[resolved.viandId];
				entry.count += 1;
				entry.proteinGrams += resolved.proteinGrams;
				resolved.sides.forEach((side) => {
					entry.sides[side.id] = (entry.sides[side.id] || 0) + side.amount;
				});
			});
		});

		return Object.keys(byViand)
			.map((id) => byViand[id])
			.sort((a, b) => a.name.localeCompare(b.name));
	}

	function viandsByProtein() {
		const groups = {};
		Object.keys(VIANDS).forEach((id) => {
			const viand = VIANDS[id];
			const proteinName =
				DEFAULT_INGREDIENTS[viand.proteinId]?.name || viand.proteinId;
			if (!groups[proteinName]) {
				groups[proteinName] = [];
			}
			groups[proteinName].push(viand);
		});
		Object.keys(groups).forEach((key) => {
			groups[key].sort((a, b) => a.name.localeCompare(b.name));
		});
		return groups;
	}

	/* ------------------------------------------------------------------ */
	/* Persistence                                                        */
	/* ------------------------------------------------------------------ */

	function loadState() {
		try {
			let raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) {
				raw = window.localStorage.getItem('fitPal.mealPlanner.v3');
			}
			if (!raw) {
				return null;
			}
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object') {
				return null;
			}
			return parsed;
		} catch (err) {
			return null;
		}
	}

	function snapshotDays(days) {
		return days.map((day) => ({
			dayIndex: day.dayIndex,
			meals: day.meals.map((meal) => ({
				instanceId: meal.instanceId,
				viandId: meal.viandId,
				proteinGrams: meal.proteinGrams,
			})),
		}));
	}

	function saveState(state) {
		try {
			const payload = {
				grocerySpanWeeks: state.grocerySpanWeeks,
				batchWindowDays: state.batchWindowDays,
				currentTab: state.currentTab,
				boardWeek: state.boardWeek,
				dailyTargets: state.dailyTargets,
				macroOverrides: state.macroOverrides,
				checkedGrocery: state.checkedGrocery,
				cookedDayIndexes: state.cookedDayIndexes,
				boardSavedAt: state.boardSavedAt,
				boardHistory: state.boardHistory,
				days: snapshotDays(state.days),
			};
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch (err) {
			/* ignore */
		}
	}

	function createInitialState(saved) {
		const weeks = clampOption(saved?.grocerySpanWeeks, GROCERY_SPAN_OPTIONS, 1);
		const targets = { ...DEFAULT_TARGETS, ...(saved?.dailyTargets || {}) };
		MACRO_KEYS.forEach((key) => {
			targets[key] = sanitizeMacroValue(targets[key], key);
		});

		const cooked = Array.isArray(saved?.cookedDayIndexes)
			? saved.cookedDayIndexes.map(Number).filter((n) => !Number.isNaN(n))
			: [];

		let days;
		if (saved?.days && isUniformLegacyBoard(saved.days)) {
			days = buildPlanDays(weeks, null);
		} else {
			days = buildPlanDays(weeks, saved?.days);
		}

		return {
			grocerySpanWeeks: weeks,
			batchWindowDays: clampOption(
				saved?.batchWindowDays,
				BATCH_WINDOW_OPTIONS,
				3
			),
			currentTab: TABS.includes(saved?.currentTab) ? saved.currentTab : 'board',
			boardWeek: Math.max(0, Number(saved?.boardWeek) || 0),
			dailyTargets: targets,
			macroOverrides:
				saved?.macroOverrides && typeof saved.macroOverrides === 'object'
					? saved.macroOverrides
					: {},
			checkedGrocery:
				saved?.checkedGrocery && typeof saved.checkedGrocery === 'object'
					? saved.checkedGrocery
					: {},
			cookedDayIndexes: cooked,
			boardSavedAt: saved?.boardSavedAt || null,
			boardHistory: Array.isArray(saved?.boardHistory)
				? saved.boardHistory.slice(0, MAX_BOARD_HISTORY)
				: [],
			days,
		};
	}

	/* ------------------------------------------------------------------ */
	/* App                                                                */
	/* ------------------------------------------------------------------ */

	const App = {
		state: null,
		catalog: DEFAULT_INGREDIENTS,
		addingToDayIndex: null,
		confirmAction: null,
		refs: {},

		init() {
			const root = document.getElementById('fit-pal-meal-planner-app');
			if (!root) {
				return;
			}

			this.refs = {
				root,
				tabButtons: root.querySelectorAll('.fit-pal-planner__tab'),
				panels: root.querySelectorAll('.fit-pal-planner__panel'),
				spanSelect: document.getElementById('fit-pal-grocery-span'),
				batchSelect: document.getElementById('fit-pal-batch-window'),
				batchRange: document.getElementById('fit-pal-batch-range'),
				board: document.getElementById('meal-plan-board'),
				boardHistory: document.getElementById('fit-pal-board-history'),
				grocery: document.getElementById('grocery-list-container'),
				batchOutput: document.getElementById('batch-cooking-output'),
				macrosEditor: document.getElementById('food-macros-editor'),
				targetsEditor: document.getElementById('targets-editor'),
				targetsDrawer: document.getElementById('fit-pal-targets-drawer'),
				foodMacrosDrawer: document.getElementById('fit-pal-food-macros-drawer'),
				mealModal: document.getElementById('fit-pal-meal-modal'),
				mealModalList: document.getElementById('meal-modal-list'),
				mealModalHint: document.getElementById('meal-modal-hint'),
				confirmModal: document.getElementById('fit-pal-confirm-modal'),
				confirmTitle: document.getElementById('confirm-modal-title'),
				confirmMessage: document.getElementById('confirm-modal-message'),
				confirmOk: document.getElementById('fit-pal-confirm-ok'),
				saveBtn: document.getElementById('fit-pal-save-board'),
				saveStatus: document.getElementById('fit-pal-save-status'),
				copyBtn: document.getElementById('fit-pal-copy-grocery'),
				copyStatus: document.getElementById('fit-pal-copy-status'),
				logCookedBtn: document.getElementById('fit-pal-log-cooked'),
				resetCookBtn: document.getElementById('fit-pal-reset-cook'),
				cookStatus: document.getElementById('fit-pal-cook-status'),
				openTargets: document.getElementById('fit-pal-open-targets'),
				openFoodMacros: document.getElementById('fit-pal-open-food-macros'),
			};

			if (!this.refs.board || !this.refs.grocery || !this.refs.batchOutput) {
				return;
			}

			this.state = createInitialState(loadState());
			this.refreshCatalog();
			this.bindEvents();
			this.syncControls();
			this.showTab(this.state.currentTab);
			this.render();
		},

		refreshCatalog() {
			this.catalog = buildCatalog(this.state.macroOverrides);
		},

		persist() {
			saveState(this.state);
		},

		bindEvents() {
			this.refs.tabButtons.forEach((btn) => {
				btn.addEventListener('click', () => this.showTab(btn.dataset.tab));
			});

			if (this.refs.spanSelect) {
				this.refs.spanSelect.addEventListener('change', () => {
					this.setGrocerySpan(
						clampOption(this.refs.spanSelect.value, GROCERY_SPAN_OPTIONS, 1)
					);
				});
			}

			if (this.refs.batchSelect) {
				this.refs.batchSelect.addEventListener('change', () => {
					this.state.batchWindowDays = clampOption(
						this.refs.batchSelect.value,
						BATCH_WINDOW_OPTIONS,
						3
					);
					this.persist();
					this.renderCook();
				});
			}

			if (this.refs.saveBtn) {
				this.refs.saveBtn.addEventListener('click', () => this.saveBoard());
			}

			if (this.refs.copyBtn) {
				this.refs.copyBtn.addEventListener('click', () => this.copyGrocery());
			}

			if (this.refs.logCookedBtn) {
				this.refs.logCookedBtn.addEventListener('click', () =>
					this.logDoneCooking()
				);
			}

			if (this.refs.resetCookBtn) {
				this.refs.resetCookBtn.addEventListener('click', () =>
					this.openConfirm({
						type: 'reset-cook',
						title: 'Reset cooking progress?',
						message:
							'This clears all “cooked” day marks so you can batch from the start again. Your meal board stays the same.',
						confirmLabel: 'Reset cooking progress',
					})
				);
			}

			if (this.refs.confirmOk) {
				this.refs.confirmOk.addEventListener('click', () =>
					this.runConfirmAction()
				);
			}

			if (this.refs.openTargets) {
				this.refs.openTargets.addEventListener('click', () =>
					this.openDrawer('targets')
				);
			}

			if (this.refs.openFoodMacros) {
				this.refs.openFoodMacros.addEventListener('click', () =>
					this.openDrawer('food-macros')
				);
			}

			this.refs.root.addEventListener('click', (event) => {
				const target = event.target;
				if (!(target instanceof HTMLElement)) {
					return;
				}

				if (target.closest('[data-close-drawer]')) {
					const closer = target.closest('[data-close-drawer]');
					this.closeDrawer(closer.getAttribute('data-close-drawer'));
					return;
				}

				if (target.closest('[data-close-modal]')) {
					const closer = target.closest('[data-close-modal]');
					const which = closer.getAttribute('data-close-modal');
					if (which === 'confirm') {
						this.closeConfirmModal();
					} else {
						this.closeMealModal();
					}
					return;
				}

				const addBtn = target.closest('[data-add-meal-day]');
				if (addBtn) {
					this.openMealModal(Number(addBtn.getAttribute('data-add-meal-day')));
					return;
				}

				const removeBtn = target.closest('[data-remove-meal]');
				if (removeBtn) {
					this.removeMeal(
						Number(removeBtn.getAttribute('data-day-index')),
						removeBtn.getAttribute('data-remove-meal')
					);
					return;
				}

				const pickViand = target.closest('[data-pick-viand]');
				if (pickViand) {
					this.addMeal(
						this.addingToDayIndex,
						pickViand.getAttribute('data-pick-viand')
					);
					return;
				}

				const restoreBtn = target.closest('[data-restore-history]');
				if (restoreBtn) {
					this.restoreBoardHistory(
						restoreBtn.getAttribute('data-restore-history')
					);
					return;
				}

				const deleteHistoryBtn = target.closest('[data-delete-history]');
				if (deleteHistoryBtn) {
					this.openConfirm({
						type: 'delete-history',
						historyId: deleteHistoryBtn.getAttribute('data-delete-history'),
						title: 'Delete this meal board?',
						message:
							'This removes the saved board from your history. Your current meal board will not change.',
						confirmLabel: 'Delete board',
					});
					return;
				}

				const resetIngredient = target.closest('[data-reset-ingredient]');
				if (resetIngredient) {
					this.resetMacroOverride(
						resetIngredient.getAttribute('data-reset-ingredient')
					);
					return;
				}

				if (target.dataset.resetAllMacros === '1') {
					this.resetAllMacroOverrides();
				}
			});

			this.refs.board.addEventListener('change', (event) => {
				const target = event.target;
				if (
					target instanceof HTMLSelectElement &&
					target.classList.contains('fit-pal-board-week-select')
				) {
					this.state.boardWeek = Math.max(0, Number(target.value) || 0);
					this.persist();
					this.renderBoard();
				}
			});

			this.refs.grocery.addEventListener('change', (event) => {
				const target = event.target;
				if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
					return;
				}
				const id = target.dataset.ingredientId;
				if (!id) {
					return;
				}
				this.state.checkedGrocery[id] = target.checked;
				this.persist();
			});

			this.refs.macrosEditor.addEventListener('change', (event) => {
				const target = event.target;
				if (!(target instanceof HTMLInputElement)) {
					return;
				}
				const id = target.dataset.ingredientId;
				const macro = target.dataset.macroKey;
				if (!id || !MACRO_KEYS.includes(macro)) {
					return;
				}
				this.updateMacroOverride(id, macro, target.value);
			});

			this.refs.targetsEditor.addEventListener('change', (event) => {
				const target = event.target;
				if (!(target instanceof HTMLInputElement)) {
					return;
				}
				const key = target.dataset.targetKey;
				if (!MACRO_KEYS.includes(key)) {
					return;
				}
				this.state.dailyTargets[key] = sanitizeMacroValue(target.value, key);
				this.persist();
				this.renderBoard();
				this.renderTargetsEditor();
			});

			document.addEventListener('keydown', (event) => {
				if (event.key !== 'Escape') {
					return;
				}
				this.closeMealModal();
				this.closeConfirmModal();
				this.closeDrawer('targets');
				this.closeDrawer('food-macros');
			});
		},

		showTab(tab) {
			const next = TABS.includes(tab) ? tab : 'board';
			this.state.currentTab = next;
			this.persist();

			this.refs.panels.forEach((panel) => {
				const active = panel.dataset.panel === next;
				panel.classList.toggle('is-active', active);
				if (active) {
					panel.removeAttribute('hidden');
				} else {
					panel.setAttribute('hidden', '');
				}
			});

			this.refs.tabButtons.forEach((btn) => {
				const active = btn.dataset.tab === next;
				btn.classList.toggle('is-active', active);
				if (active) {
					btn.setAttribute('aria-current', 'page');
				} else {
					btn.removeAttribute('aria-current');
				}
			});

			if (next === 'cook') {
				this.renderCook();
			}
			if (next === 'grocery') {
				this.renderGrocery();
			}
		},

		syncControls() {
			if (this.refs.spanSelect) {
				this.refs.spanSelect.value = String(this.state.grocerySpanWeeks);
			}
			if (this.refs.batchSelect) {
				this.refs.batchSelect.value = String(this.state.batchWindowDays);
			}
			if (this.refs.saveStatus && this.state.boardSavedAt) {
				this.refs.saveStatus.textContent = `Saved ${new Date(
					this.state.boardSavedAt
				).toLocaleString()}`;
			}
		},

		/**
		 * Keep viewport position when re-rendering the board after local edits.
		 * @param {() => void} fn
		 */
		withScrollPreserved(fn) {
			const x = window.scrollX;
			const y = window.scrollY;
			fn();
			window.scrollTo(x, y);
		},

		setGrocerySpan(weeks) {
			const nextWeeks = clampOption(weeks, GROCERY_SPAN_OPTIONS, 1);
			this.state.grocerySpanWeeks = nextWeeks;
			this.state.days = buildPlanDays(nextWeeks, this.state.days);
			this.state.cookedDayIndexes = this.state.cookedDayIndexes.filter(
				(i) => i < nextWeeks * 7
			);
			const maxWeek = Math.max(0, nextWeeks - 1);
			if (this.state.boardWeek > maxWeek) {
				this.state.boardWeek = maxWeek;
			}
			this.syncControls();
			this.persist();
			this.render();
		},

		saveBoard() {
			const entry = {
				id: uid(),
				savedAt: new Date().toISOString(),
				label: `${this.state.grocerySpanWeeks}-week board`,
				grocerySpanWeeks: this.state.grocerySpanWeeks,
				cookedDayIndexes: this.state.cookedDayIndexes.slice(),
				days: snapshotDays(this.state.days),
			};

			this.state.boardHistory = [entry]
				.concat(this.state.boardHistory || [])
				.slice(0, MAX_BOARD_HISTORY);
			this.state.boardSavedAt = entry.savedAt;
			this.persist();

			if (this.refs.saveStatus) {
				this.refs.saveStatus.textContent = `Saved ${new Date(
					entry.savedAt
				).toLocaleString()}`;
			}
			this.renderBoardHistory();
		},

		restoreBoardHistory(historyId) {
			const entry = (this.state.boardHistory || []).find((h) => h.id === historyId);
			if (!entry) {
				return;
			}

			this.state.grocerySpanWeeks = clampOption(
				entry.grocerySpanWeeks,
				GROCERY_SPAN_OPTIONS,
				1
			);
			this.state.days = buildPlanDays(entry.grocerySpanWeeks, entry.days);
			this.state.cookedDayIndexes = Array.isArray(entry.cookedDayIndexes)
				? entry.cookedDayIndexes.slice()
				: [];
			this.state.boardSavedAt = new Date().toISOString();
			this.syncControls();
			this.persist();
			this.render();

			if (this.refs.saveStatus) {
				this.refs.saveStatus.textContent = `Restored board from ${new Date(
					entry.savedAt
				).toLocaleString()}`;
			}
		},

		deleteBoardHistory(historyId) {
			this.state.boardHistory = (this.state.boardHistory || []).filter(
				(h) => h.id !== historyId
			);
			this.persist();
			this.renderBoardHistory();
		},

		getUncookedDays() {
			return this.state.days.filter(
				(day) =>
					!this.state.cookedDayIndexes.includes(day.dayIndex) &&
					day.meals.length > 0
			);
		},

		getBatchSlice() {
			return this.getUncookedDays().slice(0, this.state.batchWindowDays);
		},

		logDoneCooking() {
			const slice = this.getBatchSlice();
			if (!slice.length) {
				if (this.refs.cookStatus) {
					this.refs.cookStatus.textContent =
						'No uncooked days left. Reset cooking progress to start another cook cycle.';
				}
				return;
			}

			slice.forEach((day) => {
				if (!this.state.cookedDayIndexes.includes(day.dayIndex)) {
					this.state.cookedDayIndexes.push(day.dayIndex);
				}
			});
			this.state.cookedDayIndexes.sort((a, b) => a - b);
			this.persist();

			const labels = slice.map((d) => `Day ${d.dayIndex + 1}`).join(', ');
			if (this.refs.cookStatus) {
				this.refs.cookStatus.textContent = `Logged done: ${labels}`;
			}

			this.withScrollPreserved(() => {
				this.renderBoard();
				this.renderCook();
			});
		},

		resetCookProgress() {
			this.state.cookedDayIndexes = [];
			this.persist();
			if (this.refs.cookStatus) {
				this.refs.cookStatus.textContent =
					'Cook progress reset — you can batch from Day 1 again.';
			}
			this.renderBoard();
			this.renderCook();
		},

		openDrawer(which) {
			const drawer =
				which === 'targets'
					? this.refs.targetsDrawer
					: this.refs.foodMacrosDrawer;
			const trigger =
				which === 'targets' ? this.refs.openTargets : this.refs.openFoodMacros;
			if (!drawer) {
				return;
			}
			drawer.removeAttribute('hidden');
			if (trigger) {
				trigger.setAttribute('aria-expanded', 'true');
			}
			if (which === 'targets') {
				this.renderTargetsEditor();
			} else {
				this.renderMacrosEditor();
			}
		},

		closeDrawer(which) {
			const drawer =
				which === 'targets'
					? this.refs.targetsDrawer
					: this.refs.foodMacrosDrawer;
			const trigger =
				which === 'targets' ? this.refs.openTargets : this.refs.openFoodMacros;
			if (!drawer) {
				return;
			}
			drawer.setAttribute('hidden', '');
			if (trigger) {
				trigger.setAttribute('aria-expanded', 'false');
			}
		},

		openMealModal(dayIndex) {
			if (Number.isNaN(dayIndex)) {
				return;
			}
			this.addingToDayIndex = dayIndex;
			if (this.refs.mealModalHint) {
				this.refs.mealModalHint.textContent = `Pick a viand for Day ${
					dayIndex + 1
				}.`;
			}
			this.renderMealModalList();
			this.refs.mealModal.removeAttribute('hidden');
		},

		closeMealModal() {
			this.addingToDayIndex = null;
			if (this.refs.mealModal) {
				this.refs.mealModal.setAttribute('hidden', '');
			}
		},

		/**
		 * @param {{ type: string, title: string, message: string, confirmLabel?: string, historyId?: string }} options
		 */
		openConfirm(options) {
			this.confirmAction = options;
			if (this.refs.confirmTitle) {
				this.refs.confirmTitle.textContent = options.title || 'Are you sure?';
			}
			if (this.refs.confirmMessage) {
				this.refs.confirmMessage.textContent =
					options.message || 'This action cannot be undone.';
			}
			if (this.refs.confirmOk) {
				this.refs.confirmOk.textContent = options.confirmLabel || 'Confirm';
			}
			if (this.refs.confirmModal) {
				this.refs.confirmModal.removeAttribute('hidden');
			}
		},

		closeConfirmModal() {
			this.confirmAction = null;
			if (this.refs.confirmModal) {
				this.refs.confirmModal.setAttribute('hidden', '');
			}
		},

		runConfirmAction() {
			const action = this.confirmAction;
			this.closeConfirmModal();
			if (!action) {
				return;
			}
			if (action.type === 'reset-cook') {
				this.resetCookProgress();
				return;
			}
			if (action.type === 'delete-history' && action.historyId) {
				this.deleteBoardHistory(action.historyId);
			}
		},

		renderMealModalList() {
			const list = this.refs.mealModalList;
			clearNode(list);
			const groups = viandsByProtein();

			Object.keys(groups)
				.sort((a, b) => a.localeCompare(b))
				.forEach((proteinName) => {
					const section = el('section', 'fit-pal-modal__group');
					section.appendChild(
						el('h4', 'fit-pal-modal__group-title', proteinName)
					);
					const grid = el('div', 'fit-pal-modal__grid');

					groups[proteinName].forEach((viand) => {
						const btn = document.createElement('button');
						btn.type = 'button';
						btn.className = 'fit-pal-modal__viand';
						btn.dataset.pickViand = viand.id;

						btn.appendChild(el('span', 'fit-pal-modal__viand-name', viand.name));
					btn.appendChild(
						el(
							'span',
							'fit-pal-modal__viand-meta',
							`~${viand.timeMin} min · ${viand.proteinGrams}g raw protein`
						)
					);
						grid.appendChild(btn);
					});

					section.appendChild(grid);
					list.appendChild(section);
				});
		},

		addMeal(dayIndex, viandId) {
			const day = this.state.days.find((d) => d.dayIndex === dayIndex);
			const meal = createMealFromViand(viandId);
			if (!day || !meal) {
				return;
			}
			day.meals.push(meal);
			this.state.cookedDayIndexes = this.state.cookedDayIndexes.filter(
				(i) => i !== dayIndex
			);
			this.closeMealModal();
			this.persist();
			this.withScrollPreserved(() => this.render());
		},

		removeMeal(dayIndex, instanceId) {
			const day = this.state.days.find((d) => d.dayIndex === dayIndex);
			if (!day) {
				return;
			}
			day.meals = day.meals.filter((m) => m.instanceId !== instanceId);
			this.persist();
			this.withScrollPreserved(() => this.render());
		},

		updateMacroOverride(ingredientId, macroKey, rawValue) {
			if (!DEFAULT_INGREDIENTS[ingredientId]) {
				return;
			}
			const value = sanitizeMacroValue(rawValue, macroKey);
			const current = this.state.macroOverrides[ingredientId]
				? { ...this.state.macroOverrides[ingredientId] }
				: { ...DEFAULT_INGREDIENTS[ingredientId].macrosPer100g };
			current[macroKey] = value;

			const defaults = DEFAULT_INGREDIENTS[ingredientId].macrosPer100g;
			const matchesDefault = MACRO_KEYS.every(
				(key) => Number(current[key]) === Number(defaults[key])
			);

			if (matchesDefault) {
				delete this.state.macroOverrides[ingredientId];
			} else {
				this.state.macroOverrides[ingredientId] = current;
			}

			this.refreshCatalog();
			this.persist();
			this.render();
			this.renderMacrosEditor();
		},

		resetMacroOverride(ingredientId) {
			delete this.state.macroOverrides[ingredientId];
			this.refreshCatalog();
			this.persist();
			this.render();
			this.renderMacrosEditor();
		},

		resetAllMacroOverrides() {
			this.state.macroOverrides = {};
			this.refreshCatalog();
			this.persist();
			this.render();
			this.renderMacrosEditor();
		},

		async copyGrocery() {
			const totals = aggregateIngredients(this.state.days);
			const groups = groupGrocery(this.catalog, totals);
			const lines = [`Fit Pal grocery list — ${this.state.grocerySpanWeeks} week(s)`];

			groups.forEach((group) => {
				lines.push('');
				lines.push(group.label.toUpperCase());
				group.items.forEach((item) => {
					lines.push(`- ${item.name}: ${formatAmount(item.amount, item.unit)}`);
				});
			});

			const text = lines.join('\n');
			try {
				if (navigator.clipboard && navigator.clipboard.writeText) {
					await navigator.clipboard.writeText(text);
				} else {
					const area = document.createElement('textarea');
					area.value = text;
					document.body.appendChild(area);
					area.select();
					document.execCommand('copy');
					document.body.removeChild(area);
				}
				if (this.refs.copyStatus) {
					this.refs.copyStatus.textContent = 'Grocery list copied.';
				}
			} catch (err) {
				if (this.refs.copyStatus) {
					this.refs.copyStatus.textContent = 'Could not copy. Select and copy manually.';
				}
			}
		},

		render() {
			this.renderBoard();
			this.renderBoardHistory();
			this.renderGrocery();
			this.renderCook();
		},

		renderBoardHistory() {
			const container = this.refs.boardHistory;
			if (!container) {
				return;
			}
			clearNode(container);

			const history = this.state.boardHistory || [];
			if (!history.length) {
				container.appendChild(
					el(
						'p',
						'fit-pal-board-history__empty',
						'Saved boards appear here so you can restore an earlier plan.'
					)
				);
				return;
			}

			container.appendChild(
				el('h3', 'fit-pal-board-history__title', 'Previous meal boards')
			);
			const list = el('ul', 'fit-pal-board-history__list');

			history.forEach((entry) => {
				const li = el('li', 'fit-pal-board-history__item');
				const info = el('div', 'fit-pal-board-history__info');
				info.appendChild(
					el('p', 'fit-pal-board-history__label', entry.label || 'Saved board')
				);
				info.appendChild(
					el(
						'p',
						'fit-pal-board-history__date',
						new Date(entry.savedAt).toLocaleString()
					)
				);
				li.appendChild(info);

				const actions = el('div', 'fit-pal-board-history__actions');
				const restore = document.createElement('button');
				restore.type = 'button';
				restore.className = 'fit-pal-planner__btn fit-pal-planner__btn--ghost';
				restore.dataset.restoreHistory = entry.id;
				restore.textContent = 'Restore';
				actions.appendChild(restore);

				const remove = document.createElement('button');
				remove.type = 'button';
				remove.className = 'fit-pal-planner__btn fit-pal-planner__btn--ghost';
				remove.dataset.deleteHistory = entry.id;
				remove.textContent = 'Delete';
				actions.appendChild(remove);

				li.appendChild(actions);
				list.appendChild(li);
			});

			container.appendChild(list);
		},

		/**
		 * Compact target-vs-actual meters for a single day card.
		 * @param {{ calories: number, protein: number, carbs: number, fats: number }} dayMacros
		 */
		buildDayMacroMeters(dayMacros) {
			const wrap = el('div', 'fit-pal-day-macros');
			const targets = this.state.dailyTargets;

			MACRO_KEYS.forEach((key) => {
				const item = el('div', 'fit-pal-day-macros__item');
				const label =
					key === 'calories' ? 'kcal' : key.charAt(0).toUpperCase();
				const actual =
					key === 'calories'
						? String(dayMacros[key])
						: String(dayMacros[key]);
				const target = targets[key];
				const pct = target
					? Math.min(100, Math.round((dayMacros[key] / target) * 100))
					: 0;

				item.appendChild(
					el(
						'p',
						'fit-pal-day-macros__label',
						`${label} ${actual}/${target}`
					)
				);
				const bar = el('div', 'fit-pal-day-macros__bar');
				const fill = el('span', 'fit-pal-day-macros__fill');
				fill.style.width = `${pct}%`;
				bar.appendChild(fill);
				item.appendChild(bar);
				wrap.appendChild(item);
			});

			return wrap;
		},

		renderTargetsEditor() {
			const container = this.refs.targetsEditor;
			clearNode(container);
			container.appendChild(
				el(
					'p',
					'fit-pal-food-macros__hint',
					'Set your daily targets. Each day card on the meal board shows progress against these.'
				)
			);

			const grid = el('div', 'fit-pal-targets-editor__grid');
			MACRO_KEYS.forEach((key) => {
				const field = el('div', 'fit-pal-food-macros__field');
				const label = el(
					'label',
					'fit-pal-food-macros__label',
					key === 'calories' ? 'Calories (kcal)' : `${key} (g)`
				);
				const inputId = `target-${key}`;
				label.setAttribute('for', inputId);
				const input = document.createElement('input');
				input.type = 'number';
				input.id = inputId;
				input.className = 'fit-pal-food-macros__input';
				input.min = '0';
				input.step = key === 'calories' ? '1' : '0.1';
				input.value = String(this.state.dailyTargets[key]);
				input.dataset.targetKey = key;
				field.appendChild(label);
				field.appendChild(input);
				grid.appendChild(field);
			});
			container.appendChild(grid);
		},

		renderMacrosEditor() {
			const container = this.refs.macrosEditor;
			clearNode(container);

			const toolbar = el('div', 'fit-pal-food-macros__toolbar');
			toolbar.appendChild(
				el(
					'p',
					'fit-pal-food-macros__hint',
					'Optional — override per 100 g values from your product labels.'
				)
			);
			const resetAll = el(
				'button',
				'fit-pal-planner__btn fit-pal-planner__btn--ghost',
				'Reset all'
			);
			resetAll.type = 'button';
			resetAll.dataset.resetAllMacros = '1';
			toolbar.appendChild(resetAll);
			container.appendChild(toolbar);

			Object.keys(CATEGORY_META)
				.sort((a, b) => CATEGORY_META[a].order - CATEGORY_META[b].order)
				.forEach((category) => {
					const items = Object.keys(this.catalog)
						.map((id) => this.catalog[id])
						.filter((item) => item.category === category)
						.sort((a, b) => a.name.localeCompare(b.name));
					if (!items.length) {
						return;
					}

					const section = el('section', 'fit-pal-food-macros__group');
					section.appendChild(
						el(
							'h4',
							'fit-pal-food-macros__group-title',
							CATEGORY_META[category].label
						)
					);

					items.forEach((item) => {
						const card = el('article', 'fit-pal-food-macros__card');
						const header = el('div', 'fit-pal-food-macros__card-header');
						header.appendChild(el('h5', 'fit-pal-food-macros__name', item.name));
						if (this.state.macroOverrides[item.id]) {
							header.appendChild(
								el('span', 'fit-pal-food-macros__badge', 'Custom')
							);
							const resetBtn = el('button', 'fit-pal-food-macros__reset', 'Reset');
							resetBtn.type = 'button';
							resetBtn.dataset.resetIngredient = item.id;
							header.appendChild(resetBtn);
						}
						card.appendChild(header);

						const grid = el('div', 'fit-pal-food-macros__grid');
						MACRO_KEYS.forEach((key) => {
							const field = el('div', 'fit-pal-food-macros__field');
							const label = el(
								'label',
								'fit-pal-food-macros__label',
								key === 'calories' ? 'kcal' : `${key} g`
							);
							const inputId = `macro-${item.id}-${key}`;
							label.setAttribute('for', inputId);
							const input = document.createElement('input');
							input.type = 'number';
							input.id = inputId;
							input.className = 'fit-pal-food-macros__input';
							input.min = '0';
							input.step = key === 'calories' ? '1' : '0.1';
							input.value = String(item.macrosPer100g[key]);
							input.dataset.ingredientId = item.id;
							input.dataset.macroKey = key;
							field.appendChild(label);
							field.appendChild(input);
							grid.appendChild(field);
						});
						card.appendChild(grid);
						section.appendChild(card);
					});

					container.appendChild(section);
				});
		},

		renderBoard() {
			const board = this.refs.board;
			clearNode(board);

			const weeks = this.state.grocerySpanWeeks;
			const weekIndex = Math.min(this.state.boardWeek, weeks - 1);
			const start = weekIndex * 7;
			const end = Math.min(start + 7, this.state.days.length);
			const visibleDays = this.state.days.slice(start, end);

			if (weeks > 1) {
				const weekBar = el('div', 'fit-pal-board-week');
				const label = el('label', 'fit-pal-control-bar__label', 'Show week');
				label.setAttribute('for', 'fit-pal-board-week');
				const select = document.createElement('select');
				select.id = 'fit-pal-board-week';
				select.className = 'fit-pal-control-bar__select fit-pal-board-week-select';
				for (let w = 0; w < weeks; w += 1) {
					const option = document.createElement('option');
					option.value = String(w);
					option.textContent = `Week ${w + 1} (Days ${w * 7 + 1}–${Math.min(
						(w + 1) * 7,
						weeks * 7
					)})`;
					if (w === weekIndex) {
						option.selected = true;
					}
					select.appendChild(option);
				}
				weekBar.appendChild(label);
				weekBar.appendChild(select);
				board.appendChild(weekBar);
			}

			const fragment = document.createDocumentFragment();

			visibleDays.forEach((day) => {
				const isCooked = this.state.cookedDayIndexes.includes(day.dayIndex);
				const dayCard = el(
					'article',
					`fit-pal-day-card${isCooked ? ' is-cooked' : ''}`
				);
				const dayMacros = getDayMacros(this.catalog, day);

				const header = el('header', 'fit-pal-day-card__header');
				const titleWrap = el('div', 'fit-pal-day-card__title-wrap');
				titleWrap.appendChild(
					el('h3', 'fit-pal-day-card__title', `Day ${day.dayIndex + 1}`)
				);
				if (isCooked) {
					titleWrap.appendChild(
						el('span', 'fit-pal-day-card__badge', 'Cooked')
					);
				}
				header.appendChild(titleWrap);

				const addBtn = document.createElement('button');
				addBtn.type = 'button';
				addBtn.className = 'fit-pal-day-card__add';
				addBtn.dataset.addMealDay = String(day.dayIndex);
				addBtn.textContent = '+ Add meal';
				header.appendChild(addBtn);
				dayCard.appendChild(header);

				if (day.meals.length) {
					dayCard.appendChild(this.buildDayMacroMeters(dayMacros));
				} else {
					dayCard.appendChild(
						el(
							'p',
							'fit-pal-day-card__empty',
							'No meals yet — add a viand.'
						)
					);
				}

				const mealList = el('div', 'fit-pal-day-card__meals');

				day.meals.forEach((meal) => {
					const resolved = resolveMeal(meal);
					if (!resolved) {
						return;
					}
					const mealMacros = getMealMacros(this.catalog, meal);
					const mealCard = el('div', 'fit-pal-meal-card');

					const mealHeader = el('div', 'fit-pal-meal-card__top');
					mealHeader.appendChild(
						el('h4', 'fit-pal-meal-card__title', resolved.name)
					);

					const removeBtn = document.createElement('button');
					removeBtn.type = 'button';
					removeBtn.className = 'fit-pal-meal-card__remove';
					removeBtn.dataset.removeMeal = meal.instanceId;
					removeBtn.dataset.dayIndex = String(day.dayIndex);
					removeBtn.setAttribute('aria-label', `Remove ${resolved.name}`);
					removeBtn.textContent = '−';
					mealHeader.appendChild(removeBtn);
					mealCard.appendChild(mealHeader);

					const proteinName =
						this.catalog[resolved.proteinId]?.name || resolved.proteinId;
					mealCard.appendChild(
						el('p', 'fit-pal-meal-card__protein', proteinName)
					);
					mealCard.appendChild(
						el(
							'p',
							'fit-pal-meal-card__macros',
							`${mealMacros.calories} kcal · ${mealMacros.protein}g protein · ${resolved.proteinGrams}g raw`
						)
					);

					mealList.appendChild(mealCard);
				});

				dayCard.appendChild(mealList);
				fragment.appendChild(dayCard);
			});

			board.appendChild(fragment);
		},

		renderGrocery() {
			const container = this.refs.grocery;
			clearNode(container);

			const totals = aggregateIngredients(this.state.days);
			const groups = groupGrocery(this.catalog, totals);
			const weeks = this.state.grocerySpanWeeks;

			container.appendChild(
				el(
					'p',
					'fit-pal-grocery__intro',
					`${weeks}-week palengke list · ${weeks * 7} days`
				)
			);

			if (!groups.length) {
				container.appendChild(
					el('p', 'fit-pal-grocery__empty', 'Add meals on the board to build a list.')
				);
				return;
			}

			groups.forEach((group) => {
				const section = el('section', 'fit-pal-grocery__group');
				section.appendChild(
					el('h4', 'fit-pal-grocery__group-title', group.label)
				);
				const list = el('ul', 'fit-pal-grocery__list');
				group.items.forEach((item) => {
					const li = el('li', 'fit-pal-grocery__item');
					const checkboxId = `grocery-${item.id}`;
					const label = document.createElement('label');
					label.className = 'fit-pal-grocery__label';
					label.setAttribute('for', checkboxId);

					const checkbox = document.createElement('input');
					checkbox.type = 'checkbox';
					checkbox.id = checkboxId;
					checkbox.className = 'fit-pal-grocery__checkbox';
					checkbox.dataset.ingredientId = item.id;
					checkbox.checked = Boolean(this.state.checkedGrocery[item.id]);

					label.appendChild(checkbox);
					label.appendChild(
						el(
							'span',
							'fit-pal-grocery__text',
							`${item.name} — ${formatAmount(item.amount, item.unit)}`
						)
					);
					li.appendChild(label);
					list.appendChild(li);
				});
				section.appendChild(list);
				container.appendChild(section);
			});
		},

		renderCook() {
			const output = this.refs.batchOutput;
			clearNode(output);

			const uncooked = this.getUncookedDays();
			const slice = this.getBatchSlice();
			const remaining = uncooked.length;
			const cookedCount = this.state.cookedDayIndexes.length;
			const allCooked =
				this.state.days.some((d) => d.meals.length > 0) && remaining === 0;

			if (this.refs.resetCookBtn) {
				if (cookedCount > 0) {
					this.refs.resetCookBtn.removeAttribute('hidden');
				} else {
					this.refs.resetCookBtn.setAttribute('hidden', '');
				}
			}

			if (this.refs.batchRange) {
				if (!slice.length) {
					this.refs.batchRange.textContent = allCooked
						? 'All days cooked'
						: 'No days in window';
				} else {
					const first = slice[0].dayIndex + 1;
					const last = slice[slice.length - 1].dayIndex + 1;
					this.refs.batchRange.textContent =
						first === last ? `Day ${first}` : `Days ${first}–${last}`;
				}
			}

			output.appendChild(
				el(
					'p',
					'fit-pal-batch-output__intro',
					`${cookedCount} day(s) cooked · ${remaining} remaining on the board`
				)
			);

			if (!slice.length) {
				output.appendChild(
					el(
						'p',
						'fit-pal-batch-output__empty',
						allCooked
							? 'Board is fully cooked. Click “Reset cooking progress” above to clear cook marks and batch again with the same meals.'
							: 'Widen the batch window to include remaining days.'
					)
				);
				return;
			}

			const dayChips = el('p', 'fit-pal-batch-output__days');
			dayChips.textContent = `Cooking: ${slice
				.map((d) => `Day ${d.dayIndex + 1}`)
				.join(', ')}`;
			output.appendChild(dayChips);

			const totals = aggregateIngredients(slice);
			const groups = groupGrocery(this.catalog, totals);
			const weightsSection = el('section', 'fit-pal-batch-output__group');
			weightsSection.appendChild(
				el(
					'h4',
					'fit-pal-batch-output__group-title',
					'Combined raw prep weights'
				)
			);

			groups.forEach((group) => {
				const sub = el('div', 'fit-pal-batch-output__subgroup');
				sub.appendChild(
					el('h5', 'fit-pal-batch-output__subgroup-title', group.label)
				);
				const list = el('ul', 'fit-pal-batch-output__list');
				group.items.forEach((item) => {
					list.appendChild(
						el(
							'li',
							'fit-pal-batch-output__item',
							`${item.name}: ${formatAmount(item.amount, item.unit)}`
						)
					);
				});
				sub.appendChild(list);
				weightsSection.appendChild(sub);
			});
			output.appendChild(weightsSection);

			const recipes = buildBatchRecipes(slice);
			const recipeSection = el('section', 'fit-pal-batch-recipes');
			recipeSection.appendChild(
				el('h4', 'fit-pal-batch-output__group-title', 'Recipes')
			);

			recipes.forEach((recipe) => {
				const card = el('article', 'fit-pal-recipe-card-batch');
				const title =
					recipe.count > 1
						? `${recipe.name} × ${recipe.count}`
						: recipe.name;
				card.appendChild(el('h5', 'fit-pal-recipe-card-batch__title', title));

				const proteinName =
					this.catalog[recipe.proteinId]?.name || recipe.proteinId;
				card.appendChild(
					el(
						'p',
						'fit-pal-recipe-card-batch__meta',
						`~${recipe.timeMin} min · ${proteinName}`
					)
				);

				card.appendChild(
					el('p', 'fit-pal-recipe-card-batch__label', 'Scaled ingredients')
				);
				const ingList = el('ul', 'fit-pal-batch-output__list');
				ingList.appendChild(
					el(
						'li',
						'fit-pal-batch-output__item',
						`${proteinName}: ${formatAmount(
							Math.round(recipe.proteinGrams),
							'g'
						)}`
					)
				);
				Object.keys(recipe.sides).forEach((id) => {
					const item = this.catalog[id];
					if (!item) {
						return;
					}
					ingList.appendChild(
						el(
							'li',
							'fit-pal-batch-output__item',
							`${item.name}: ${formatAmount(
								Math.round(recipe.sides[id]),
								item.unit
							)}`
						)
					);
				});
				card.appendChild(ingList);

				card.appendChild(
					el('p', 'fit-pal-recipe-card-batch__label', 'Method')
				);
				const steps = el('ol', 'fit-pal-recipe-card-batch__steps');
				recipe.steps.forEach((step) => {
					steps.appendChild(el('li', '', step));
				});
				card.appendChild(steps);

				if (recipe.batchTip) {
					card.appendChild(
						el(
							'p',
							'fit-pal-recipe-card-batch__tip',
							`Tip: ${recipe.batchTip}`
						)
					);
				}

				recipeSection.appendChild(card);
			});

			output.appendChild(recipeSection);
		},
	};

	function boot() {
		App.init();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}

	window.FitPalMealPlanner = App;
})(window, document);
