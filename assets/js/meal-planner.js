/**
 * Fit Pal — Meal Planner & Palengke Grocery Engine
 *
 * Step wizard · editable food macros · expanded protein swaps ·
 * batch recipes · grocery aggregation · localStorage.
 *
 * @package Fit_Pal
 */
(function (window, document) {
	'use strict';

	const STORAGE_KEY = 'fitPal.mealPlanner.v2';
	const GROCERY_SPAN_OPTIONS = [1, 2, 3, 4];
	const BATCH_WINDOW_OPTIONS = [2, 3, 5, 7];
	const STEP_COUNT = 4;
	const MACRO_KEYS = ['calories', 'protein', 'carbs', 'fats'];

	const DAILY_TARGETS = {
		calories: 2200,
		protein: 180,
		carbs: 220,
		fats: 65,
	};

	/**
	 * Default ingredient catalog — macros per 100 g (eggs use gramsPerUnit).
	 * Users can override macrosPer100g via the Food Macros step.
	 */
	const DEFAULT_INGREDIENTS = {
		'chicken-breast': {
			id: 'chicken-breast',
			name: 'Chicken Breast (skinless)',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
		},
		tokwa: {
			id: 'tokwa',
			name: 'Tokwa (firm tofu)',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 144, protein: 17, carbs: 3, fats: 9 },
		},
		'tuna-canned': {
			id: 'tuna-canned',
			name: 'Canned Tuna in Water',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 116, protein: 26, carbs: 0, fats: 1 },
		},
		tilapia: {
			id: 'tilapia',
			name: 'Tilapia Fillet',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 128, protein: 26, carbs: 0, fats: 2.7 },
		},
		'pork-tenderloin': {
			id: 'pork-tenderloin',
			name: 'Pork Tenderloin (lean)',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 143, protein: 26, carbs: 0, fats: 3.5 },
		},
		'beef-sirloin': {
			id: 'beef-sirloin',
			name: 'Beef Sirloin (lean)',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 158, protein: 27, carbs: 0, fats: 5 },
		},
		bangus: {
			id: 'bangus',
			name: 'Bangus Fillet (boneless)',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 148, protein: 20, carbs: 0, fats: 7 },
		},
		shrimp: {
			id: 'shrimp',
			name: 'Shrimp (peeled)',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 99, protein: 24, carbs: 0.2, fats: 0.3 },
		},
		'egg-whites': {
			id: 'egg-whites',
			name: 'Egg Whites',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 52, protein: 11, carbs: 0.7, fats: 0.2 },
		},
		'ground-turkey': {
			id: 'ground-turkey',
			name: 'Ground Turkey (lean)',
			category: 'lean-proteins',
			unit: 'g',
			isProteinSwap: true,
			macrosPer100g: { calories: 150, protein: 20, carbs: 0, fats: 8 },
		},
		eggs: {
			id: 'eggs',
			name: 'Eggs (whole)',
			category: 'lean-proteins',
			unit: 'pcs',
			gramsPerUnit: 50,
			isProteinSwap: false,
			macrosPer100g: { calories: 143, protein: 13, carbs: 1.1, fats: 9.5 },
		},
		rice: {
			id: 'rice',
			name: 'Rice (uncooked)',
			category: 'complex-carbs',
			unit: 'g',
			isProteinSwap: false,
			macrosPer100g: { calories: 365, protein: 7, carbs: 80, fats: 0.6 },
		},
		kamote: {
			id: 'kamote',
			name: 'Kamote (sweet potato)',
			category: 'complex-carbs',
			unit: 'g',
			isProteinSwap: false,
			macrosPer100g: { calories: 86, protein: 1.6, carbs: 20, fats: 0.1 },
		},
		sibuyas: {
			id: 'sibuyas',
			name: 'Sibuyas (onion)',
			category: 'veggies-staples',
			unit: 'g',
			isProteinSwap: false,
			macrosPer100g: { calories: 40, protein: 1.1, carbs: 9.3, fats: 0.1 },
		},
		bawang: {
			id: 'bawang',
			name: 'Bawang (garlic)',
			category: 'veggies-staples',
			unit: 'g',
			isProteinSwap: false,
			macrosPer100g: { calories: 149, protein: 6.4, carbs: 33, fats: 0.5 },
		},
		kangkong: {
			id: 'kangkong',
			name: 'Kangkong',
			category: 'veggies-staples',
			unit: 'g',
			isProteinSwap: false,
			macrosPer100g: { calories: 19, protein: 2.6, carbs: 3.1, fats: 0.2 },
		},
		sitaw: {
			id: 'sitaw',
			name: 'Sitaw (string beans)',
			category: 'veggies-staples',
			unit: 'g',
			isProteinSwap: false,
			macrosPer100g: { calories: 31, protein: 1.8, carbs: 7, fats: 0.1 },
		},
		repa: {
			id: 'repa',
			name: 'Repolyo / cabbage',
			category: 'veggies-staples',
			unit: 'g',
			isProteinSwap: false,
			macrosPer100g: { calories: 25, protein: 1.3, carbs: 5.8, fats: 0.1 },
		},
		toyo: {
			id: 'toyo',
			name: 'Toyo (soy sauce)',
			category: 'veggies-staples',
			unit: 'ml',
			isProteinSwap: false,
			macrosPer100g: { calories: 53, protein: 8, carbs: 5, fats: 0.1 },
		},
		suka: {
			id: 'suka',
			name: 'Suka (vinegar)',
			category: 'veggies-staples',
			unit: 'ml',
			isProteinSwap: false,
			macrosPer100g: { calories: 18, protein: 0, carbs: 0.7, fats: 0 },
		},
		gata: {
			id: 'gata',
			name: 'Gata (lite coconut milk)',
			category: 'veggies-staples',
			unit: 'ml',
			isProteinSwap: false,
			macrosPer100g: { calories: 120, protein: 1.2, carbs: 3, fats: 12 },
		},
		siling_labuyo: {
			id: 'siling_labuyo',
			name: 'Siling labuyo',
			category: 'veggies-staples',
			unit: 'g',
			isProteinSwap: false,
			macrosPer100g: { calories: 40, protein: 1.9, carbs: 8.8, fats: 0.4 },
		},
	};

	const CATEGORY_META = {
		'lean-proteins': { label: 'Lean Proteins', order: 1 },
		'complex-carbs': { label: 'Complex Carbs', order: 2 },
		'veggies-staples': { label: 'Veggies & Staples', order: 3 },
	};

	const PROTEIN_MEAL_LABELS = {
		tokwa: 'Tokwa Scramble & Eggs',
		'chicken-breast': 'Skinless Chicken Breast Adobo',
		'tuna-canned': 'Spicy Canned Tuna Bicol Express',
		tilapia: 'Grilled Tilapia Bowl',
		'pork-tenderloin': 'Lean Pork Adobo',
		'beef-sirloin': 'Beef Sirloin Stir-Fry',
		bangus: 'Sinigang-Style Bangus Bowl',
		shrimp: 'Garlic Shrimp & Greens',
		'egg-whites': 'Egg White Scramble Bowl',
		'ground-turkey': 'Turkey Giniling Bowl',
	};

	/**
	 * Slot recipes — method adapts to the active protein via {{protein}} tokens.
	 */
	const RECIPE_LIBRARY = {
		'meal-1': {
			slot: 'meal-1',
			baseName: 'Protein Scramble Bowl',
			timeMin: 20,
			servingsNote: '1 meal portion',
			steps: [
				'Dice {{protein}} into bite-size cubes (or drain if canned).',
				'Beat eggs with a pinch of salt. Sauté sibuyas until soft.',
				'Add {{protein}} to the pan; cook until heated through / lightly browned.',
				'Pour in eggs and scramble gently. Plate over cooked rice.',
			],
			batchTip:
				'Scramble proteins and eggs fresh per day if possible; pre-dice veggies and portion rice.',
		},
		'meal-2': {
			slot: 'meal-2',
			baseName: 'Adobo-Style Protein & Cabbage',
			timeMin: 45,
			servingsNote: '1 meal portion (scales for batch)',
			steps: [
				'Cut {{protein}} into even pieces. Smash bawang; slice sibuyas.',
				'Combine toyo, suka, bawang, and sibuyas in a pot. Bring to a simmer.',
				'Add {{protein}}; simmer covered 20–30 min until tender (shorter for fish/shrimp).',
				'Stir in shredded repolyo for the last 5 minutes. Serve with rice.',
			],
			batchTip:
				'Cook the full adobo batch once, cool fast, and fridge in day portions. Reheat gently with a splash of water.',
		},
		'meal-3': {
			slot: 'meal-3',
			baseName: 'Spicy Gata Protein Bowl',
			timeMin: 30,
			servingsNote: '1 meal portion',
			steps: [
				'Sauté bawang and siling labuyo. Add {{protein}} and sear briefly.',
				'Pour in lite gata; simmer 5–8 minutes (do not hard-boil canned fish).',
				'Add sitaw, then kangkong until just wilted. Season lightly.',
				'Serve over boiled or roasted kamote.',
			],
			batchTip:
				'Prep kamote and chop greens ahead. Finish the gata sauce the day you eat to keep seafood fresh.',
		},
	};

	const DEFAULT_MEAL_TEMPLATES = [
		{
			slot: 'meal-1',
			titleBase: 'Tokwa Scramble & Eggs',
			proteinId: 'tokwa',
			proteinGrams: 200,
			sides: [
				{ id: 'eggs', amount: 2 },
				{ id: 'rice', amount: 80 },
				{ id: 'sibuyas', amount: 40 },
			],
		},
		{
			slot: 'meal-2',
			titleBase: 'Skinless Chicken Breast Adobo',
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
		},
		{
			slot: 'meal-3',
			titleBase: 'Spicy Canned Tuna Bicol Express',
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
		},
	];

	const EMPTY_MACROS = { calories: 0, protein: 0, carbs: 0, fats: 0 };

	/* ------------------------------------------------------------------ */
	/* Catalog helpers (respect user macro overrides)                     */
	/* ------------------------------------------------------------------ */

	/**
	 * @param {Record<string, { calories?: number, protein?: number, carbs?: number, fats?: number }>} overrides
	 * @returns {typeof DEFAULT_INGREDIENTS}
	 */
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

	function proteinSwapIds(catalog) {
		return Object.keys(catalog).filter((id) => catalog[id].isProteinSwap);
	}

	/* ------------------------------------------------------------------ */
	/* Utilities                                                          */
	/* ------------------------------------------------------------------ */

	function clampOption(value, allowed, fallback) {
		const n = Number(value);
		return allowed.includes(n) ? n : fallback;
	}

	function clampStep(value) {
		const n = Number(value);
		if (!Number.isFinite(n)) {
			return 1;
		}
		return Math.min(STEP_COUNT, Math.max(1, Math.round(n)));
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

	function scaleProteinForMatch(catalog, currentGrams, fromId, toId) {
		const from = catalog[fromId];
		const to = catalog[toId];
		if (!from || !to || !to.macrosPer100g.protein) {
			return currentGrams;
		}
		const proteinGrams = (currentGrams / 100) * from.macrosPer100g.protein;
		const next = (proteinGrams / to.macrosPer100g.protein) * 100;
		return Math.max(50, Math.round(next / 5) * 5);
	}

	function mealTitleForProtein(proteinId, fallbackTitle) {
		return PROTEIN_MEAL_LABELS[proteinId] || fallbackTitle;
	}

	function addMacros(a, b) {
		return {
			calories: a.calories + b.calories,
			protein: Math.round((a.protein + b.protein) * 10) / 10,
			carbs: Math.round((a.carbs + b.carbs) * 10) / 10,
			fats: Math.round((a.fats + b.fats) * 10) / 10,
		};
	}

	function sanitizeMacroValue(raw, key) {
		const n = Number(raw);
		if (!Number.isFinite(n) || n < 0) {
			return 0;
		}
		if (key === 'calories') {
			return Math.round(n);
		}
		return Math.round(n * 10) / 10;
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

	/* ------------------------------------------------------------------ */
	/* Meal builders                                                      */
	/* ------------------------------------------------------------------ */

	function createMealFromTemplate(template, override) {
		const requestedId = override?.proteinId || template.proteinId;
		const proteinId = DEFAULT_INGREDIENTS[requestedId]?.isProteinSwap
			? requestedId
			: template.proteinId;
		const proteinGrams =
			typeof override?.proteinGrams === 'number'
				? override.proteinGrams
				: template.proteinGrams;

		return {
			slot: template.slot,
			title: mealTitleForProtein(proteinId, template.titleBase),
			titleBase: template.titleBase,
			proteinId,
			proteinGrams,
			sides: template.sides.map((s) => ({ id: s.id, amount: s.amount })),
		};
	}

	function createDay(dayIndex, swaps) {
		const meals = DEFAULT_MEAL_TEMPLATES.map((template) => {
			const swap = Array.isArray(swaps)
				? swaps.find((s) => s.slot === template.slot)
				: null;
			return createMealFromTemplate(template, swap || null);
		});
		return { dayIndex, meals };
	}

	function buildPlanDays(weeks, previousDays) {
		const dayCount = weeks * 7;
		const prev = Array.isArray(previousDays) ? previousDays : [];
		const days = [];

		for (let i = 0; i < dayCount; i += 1) {
			const existing = prev.find((d) => d.dayIndex === i);
			const swaps = existing
				? existing.meals.map((m) => ({
						slot: m.slot,
						proteinId: m.proteinId,
						proteinGrams: m.proteinGrams,
				  }))
				: null;
			days.push(createDay(i, swaps));
		}

		return days;
	}

	/* ------------------------------------------------------------------ */
	/* Aggregation                                                        */
	/* ------------------------------------------------------------------ */

	function getMealMacros(catalog, meal) {
		const protein = catalog[meal.proteinId];
		let totals = { ...EMPTY_MACROS };

		if (protein) {
			totals = addMacros(
				totals,
				macrosFromGrams(meal.proteinGrams, protein.macrosPer100g)
			);
		}

		meal.sides.forEach((side) => {
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
		if (!days.length) {
			return { ...EMPTY_MACROS };
		}
		const sum = days.reduce(
			(acc, day) => addMacros(acc, getDayMacros(catalog, day)),
			{ ...EMPTY_MACROS }
		);
		const n = days.length;
		return {
			calories: Math.round(sum.calories / n),
			protein: Math.round((sum.protein / n) * 10) / 10,
			carbs: Math.round((sum.carbs / n) * 10) / 10,
			fats: Math.round((sum.fats / n) * 10) / 10,
		};
	}

	function aggregateIngredients(days) {
		const totals = {};

		days.forEach((day) => {
			day.meals.forEach((meal) => {
				totals[meal.proteinId] =
					(totals[meal.proteinId] || 0) + meal.proteinGrams;
				meal.sides.forEach((side) => {
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
				category: item.category,
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

	/**
	 * Unique recipes for meals appearing in the batch window, with scaled ingredients.
	 * @param {Array} daysSlice
	 * @param {object} catalog
	 */
	function buildBatchRecipes(daysSlice, catalog) {
		/** @type {Record<string, { slot: string, proteinId: string, proteinGrams: number, sides: Record<string, number>, count: number }>} */
		const byKey = {};

		daysSlice.forEach((day) => {
			day.meals.forEach((meal) => {
				const key = `${meal.slot}::${meal.proteinId}`;
				if (!byKey[key]) {
					byKey[key] = {
						slot: meal.slot,
						proteinId: meal.proteinId,
						proteinGrams: 0,
						sides: {},
						count: 0,
					};
				}
				const entry = byKey[key];
				entry.count += 1;
				entry.proteinGrams += meal.proteinGrams;
				meal.sides.forEach((side) => {
					entry.sides[side.id] = (entry.sides[side.id] || 0) + side.amount;
				});
			});
		});

		return Object.keys(byKey).map((key) => {
			const entry = byKey[key];
			const recipe = RECIPE_LIBRARY[entry.slot];
			const proteinName = catalog[entry.proteinId]?.name || entry.proteinId;
			const title =
				mealTitleForProtein(entry.proteinId, recipe?.baseName || entry.slot) +
				(entry.count > 1 ? ` × ${entry.count}` : '');

			const steps = (recipe?.steps || []).map((step) =>
				step.replace(/\{\{protein\}\}/g, proteinName)
			);

			const ingredients = [
				{
					id: entry.proteinId,
					name: proteinName,
					amount: Math.round(entry.proteinGrams),
					unit: catalog[entry.proteinId]?.unit || 'g',
				},
			].concat(
				Object.keys(entry.sides).map((id) => ({
					id,
					name: catalog[id]?.name || id,
					amount: Math.round(entry.sides[id]),
					unit: catalog[id]?.unit || 'g',
				}))
			);

			return {
				key,
				slot: entry.slot,
				title,
				proteinId: entry.proteinId,
				count: entry.count,
				timeMin: recipe?.timeMin || 30,
				servingsNote: recipe?.servingsNote || '',
				batchTip: recipe?.batchTip || '',
				steps,
				ingredients,
			};
		});
	}

	/* ------------------------------------------------------------------ */
	/* Persistence                                                        */
	/* ------------------------------------------------------------------ */

	function loadState() {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) {
				return null;
			}
			const parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== 'object') {
				return null;
			}
			return {
				grocerySpanWeeks: clampOption(
					parsed.grocerySpanWeeks,
					GROCERY_SPAN_OPTIONS,
					1
				),
				batchWindowDays: clampOption(
					parsed.batchWindowDays,
					BATCH_WINDOW_OPTIONS,
					3
				),
				currentStep: clampStep(parsed.currentStep || 1),
				boardWeek: Math.max(0, Number(parsed.boardWeek) || 0),
				checkedGrocery:
					parsed.checkedGrocery && typeof parsed.checkedGrocery === 'object'
						? parsed.checkedGrocery
						: {},
				macroOverrides:
					parsed.macroOverrides && typeof parsed.macroOverrides === 'object'
						? parsed.macroOverrides
						: {},
				days: Array.isArray(parsed.days) ? parsed.days : [],
			};
		} catch (err) {
			return null;
		}
	}

	function saveState(state) {
		try {
			const payload = {
				grocerySpanWeeks: state.grocerySpanWeeks,
				batchWindowDays: state.batchWindowDays,
				currentStep: state.currentStep,
				boardWeek: state.boardWeek,
				checkedGrocery: state.checkedGrocery,
				macroOverrides: state.macroOverrides,
				days: state.days.map((day) => ({
					dayIndex: day.dayIndex,
					meals: day.meals.map((meal) => ({
						slot: meal.slot,
						proteinId: meal.proteinId,
						proteinGrams: meal.proteinGrams,
						titleBase: meal.titleBase,
						sides: meal.sides,
					})),
				})),
			};
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch (err) {
			/* ignore */
		}
	}

	function createInitialState(saved) {
		const weeks = saved ? saved.grocerySpanWeeks : 1;
		return {
			grocerySpanWeeks: weeks,
			batchWindowDays: saved ? saved.batchWindowDays : 3,
			currentStep: saved ? saved.currentStep : 1,
			boardWeek: saved ? saved.boardWeek : 0,
			checkedGrocery: saved?.checkedGrocery || {},
			macroOverrides: saved?.macroOverrides || {},
			days: buildPlanDays(weeks, saved?.days),
		};
	}

	/* ------------------------------------------------------------------ */
	/* App                                                                */
	/* ------------------------------------------------------------------ */

	const App = {
		state: null,
		catalog: DEFAULT_INGREDIENTS,
		refs: {},

		init() {
			const root = document.getElementById('fit-pal-meal-planner-app');
			if (!root) {
				return;
			}

			this.refs = {
				root,
				spanSelect: document.getElementById('fit-pal-grocery-span'),
				batchSelect: document.getElementById('fit-pal-batch-window'),
				planLength: document.getElementById('fit-pal-plan-length'),
				macrosEditor: document.getElementById('food-macros-editor'),
				board: document.getElementById('meal-plan-board'),
				batchOutput: document.getElementById('batch-cooking-output'),
				grocery: document.getElementById('grocery-list-container'),
				prevBtn: document.getElementById('fit-pal-step-prev'),
				nextBtn: document.getElementById('fit-pal-step-next'),
				stepButtons: root.querySelectorAll('.fit-pal-wizard__step'),
				panels: root.querySelectorAll('.fit-pal-wizard__panel'),
			};

			if (!this.refs.board || !this.refs.batchOutput || !this.refs.grocery) {
				return;
			}

			this.state = createInitialState(loadState());
			this.refreshCatalog();
			this.bindControls();
			this.syncControlValues();
			this.showStep(this.state.currentStep);
			this.render();
		},

		refreshCatalog() {
			this.catalog = buildCatalog(this.state.macroOverrides);
		},

		bindControls() {
			if (this.refs.spanSelect) {
				this.refs.spanSelect.addEventListener('change', () => {
					this.setGrocerySpan(
						clampOption(this.refs.spanSelect.value, GROCERY_SPAN_OPTIONS, 1)
					);
				});
			}

			if (this.refs.batchSelect) {
				this.refs.batchSelect.addEventListener('change', () => {
					this.setBatchWindow(
						clampOption(this.refs.batchSelect.value, BATCH_WINDOW_OPTIONS, 3)
					);
				});
			}

			this.refs.stepButtons.forEach((btn) => {
				btn.addEventListener('click', () => {
					this.showStep(Number(btn.dataset.step));
				});
			});

			if (this.refs.prevBtn) {
				this.refs.prevBtn.addEventListener('click', () => {
					this.showStep(this.state.currentStep - 1);
				});
			}

			if (this.refs.nextBtn) {
				this.refs.nextBtn.addEventListener('click', () => {
					if (this.state.currentStep >= STEP_COUNT) {
						this.showStep(1);
						return;
					}
					this.showStep(this.state.currentStep + 1);
				});
			}

			this.refs.board.addEventListener('change', (event) => {
				const target = event.target;
				if (!(target instanceof HTMLSelectElement)) {
					return;
				}
				if (target.classList.contains('fit-pal-meal-card__protein-select')) {
					const dayIndex = Number(target.dataset.dayIndex);
					const mealSlot = target.dataset.mealSlot;
					if (!mealSlot || Number.isNaN(dayIndex)) {
						return;
					}
					this.swapProtein(dayIndex, mealSlot, target.value);
					return;
				}
				if (target.classList.contains('fit-pal-board-week-select')) {
					this.state.boardWeek = Math.max(0, Number(target.value) || 0);
					this.persist();
					this.renderBoard();
				}
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

			this.refs.macrosEditor.addEventListener('click', (event) => {
				const target = event.target;
				if (!(target instanceof HTMLElement)) {
					return;
				}
				const resetId = target.dataset.resetIngredient;
				if (resetId) {
					this.resetMacroOverride(resetId);
				}
				if (target.dataset.resetAllMacros === '1') {
					this.resetAllMacroOverrides();
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
		},

		showStep(step) {
			const next = clampStep(step);
			this.state.currentStep = next;
			this.persist();

			this.refs.panels.forEach((panel) => {
				const isActive = Number(panel.dataset.panel) === next;
				panel.classList.toggle('is-active', isActive);
				if (isActive) {
					panel.removeAttribute('hidden');
				} else {
					panel.setAttribute('hidden', '');
				}
			});

			this.refs.stepButtons.forEach((btn) => {
				const isActive = Number(btn.dataset.step) === next;
				btn.classList.toggle('is-active', isActive);
				if (isActive) {
					btn.setAttribute('aria-current', 'step');
				} else {
					btn.removeAttribute('aria-current');
				}
			});

			if (this.refs.prevBtn) {
				this.refs.prevBtn.disabled = next <= 1;
			}
			if (this.refs.nextBtn) {
				this.refs.nextBtn.textContent =
					next >= STEP_COUNT ? 'Back to plan' : 'Continue';
			}

			window.scrollTo({ top: this.refs.root.offsetTop - 24, behavior: 'smooth' });
		},

		syncControlValues() {
			if (this.refs.spanSelect) {
				this.refs.spanSelect.value = String(this.state.grocerySpanWeeks);
			}
			if (this.refs.batchSelect) {
				this.refs.batchSelect.value = String(this.state.batchWindowDays);
			}
			if (this.refs.planLength) {
				this.refs.planLength.textContent = `${this.state.grocerySpanWeeks * 7} days`;
			}

			MACRO_KEYS.forEach((key) => {
				const targetEl = document.getElementById(`macro-target-${key}`);
				if (targetEl) {
					targetEl.textContent = String(DAILY_TARGETS[key]);
				}
			});
		},

		setGrocerySpan(weeks) {
			const nextWeeks = clampOption(weeks, GROCERY_SPAN_OPTIONS, 1);
			this.state.grocerySpanWeeks = nextWeeks;
			this.state.days = buildPlanDays(nextWeeks, this.state.days);

			const maxBatch = nextWeeks * 7;
			if (this.state.batchWindowDays > maxBatch) {
				this.state.batchWindowDays =
					BATCH_WINDOW_OPTIONS.filter((d) => d <= maxBatch).pop() || 2;
			}

			const maxWeek = Math.max(0, nextWeeks - 1);
			if (this.state.boardWeek > maxWeek) {
				this.state.boardWeek = maxWeek;
			}

			this.syncControlValues();
			this.persist();
			this.render();
		},

		setBatchWindow(days) {
			this.state.batchWindowDays = clampOption(days, BATCH_WINDOW_OPTIONS, 3);
			this.syncControlValues();
			this.persist();
			this.renderBatch();
		},

		swapProtein(dayIndex, mealSlot, newProteinId) {
			const swaps = proteinSwapIds(this.catalog);
			if (!swaps.includes(newProteinId)) {
				return;
			}
			const day = this.state.days.find((d) => d.dayIndex === dayIndex);
			if (!day) {
				return;
			}
			const meal = day.meals.find((m) => m.slot === mealSlot);
			if (!meal || meal.proteinId === newProteinId) {
				return;
			}

			meal.proteinGrams = scaleProteinForMatch(
				this.catalog,
				meal.proteinGrams,
				meal.proteinId,
				newProteinId
			);
			meal.proteinId = newProteinId;
			meal.title = mealTitleForProtein(newProteinId, meal.titleBase);

			this.persist();
			this.render();
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
			this.renderMacros();
			this.renderMacrosEditor();
			this.renderBoard();
			this.renderBatch();
			this.renderGrocery();
		},

		resetMacroOverride(ingredientId) {
			delete this.state.macroOverrides[ingredientId];
			this.refreshCatalog();
			this.persist();
			this.render();
		},

		resetAllMacroOverrides() {
			this.state.macroOverrides = {};
			this.refreshCatalog();
			this.persist();
			this.render();
		},

		persist() {
			saveState(this.state);
		},

		render() {
			this.renderMacros();
			this.renderMacrosEditor();
			this.renderBoard();
			this.renderBatch();
			this.renderGrocery();
		},

		renderMacros() {
			const actual = getAverageDailyMacros(this.catalog, this.state.days);

			MACRO_KEYS.forEach((key) => {
				const actualEl = document.getElementById(`macro-actual-${key}`);
				const barEl = document.getElementById(`macro-bar-${key}`);
				const meter = barEl && barEl.parentElement;

				if (actualEl) {
					actualEl.textContent = String(actual[key]);
				}

				const target = DAILY_TARGETS[key];
				const pct = target
					? Math.min(100, Math.round((actual[key] / target) * 100))
					: 0;

				if (barEl) {
					barEl.style.width = `${pct}%`;
				}
				if (meter && meter.getAttribute('role') === 'meter') {
					meter.setAttribute('aria-valuenow', String(pct));
				}
			});
		},

		renderMacrosEditor() {
			const container = this.refs.macrosEditor;
			clearNode(container);

			const toolbar = el('div', 'fit-pal-food-macros__toolbar');
			toolbar.appendChild(
				el(
					'p',
					'fit-pal-food-macros__hint',
					'Values are per 100 g (or per 100 g edible for eggs). Match your pack’s nutrition facts.'
				)
			);
			const resetAll = el('button', 'fit-pal-wizard__btn fit-pal-wizard__btn--ghost');
			resetAll.type = 'button';
			resetAll.dataset.resetAllMacros = '1';
			resetAll.textContent = 'Reset all to defaults';
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
						el('h3', 'fit-pal-food-macros__group-title', CATEGORY_META[category].label)
					);

					items.forEach((item) => {
						const card = el('article', 'fit-pal-food-macros__card');
						const header = el('div', 'fit-pal-food-macros__card-header');
						header.appendChild(el('h4', 'fit-pal-food-macros__name', item.name));

						const isCustom = Boolean(this.state.macroOverrides[item.id]);
						if (isCustom) {
							header.appendChild(
								el('span', 'fit-pal-food-macros__badge', 'Custom')
							);
							const resetBtn = el(
								'button',
								'fit-pal-food-macros__reset',
								'Reset'
							);
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
							input.setAttribute(
								'aria-label',
								`${item.name} ${key} per 100g`
							);

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
				const dayCard = el('article', 'fit-pal-day-card');
				const dayMacros = getDayMacros(this.catalog, day);

				const header = el('header', 'fit-pal-day-card__header');
				header.appendChild(
					el('h3', 'fit-pal-day-card__title', `Day ${day.dayIndex + 1}`)
				);
				header.appendChild(
					el(
						'p',
						'fit-pal-day-card__macros',
						`${dayMacros.calories} kcal · P ${dayMacros.protein}g · C ${dayMacros.carbs}g · F ${dayMacros.fats}g`
					)
				);
				dayCard.appendChild(header);

				const mealList = el('div', 'fit-pal-day-card__meals');
				const swaps = proteinSwapIds(this.catalog);

				day.meals.forEach((meal) => {
					const mealMacros = getMealMacros(this.catalog, meal);
					const mealCard = el('div', 'fit-pal-meal-card');

					mealCard.appendChild(
						el('p', 'fit-pal-meal-card__slot', meal.slot.replace('-', ' '))
					);
					mealCard.appendChild(
						el('h4', 'fit-pal-meal-card__title', meal.title)
					);
					mealCard.appendChild(
						el(
							'p',
							'fit-pal-meal-card__macros',
							`${mealMacros.calories} kcal · ${mealMacros.protein}g protein`
						)
					);

					const label = el('label', 'fit-pal-meal-card__label', 'Protein source');
					const selectId = `protein-${day.dayIndex}-${meal.slot}`;
					label.setAttribute('for', selectId);

					const select = document.createElement('select');
					select.id = selectId;
					select.className = 'fit-pal-meal-card__protein-select';
					select.dataset.dayIndex = String(day.dayIndex);
					select.dataset.mealSlot = meal.slot;
					select.setAttribute('aria-label', `Swap protein for ${meal.title}`);

					swaps.forEach((id) => {
						const option = document.createElement('option');
						option.value = id;
						option.textContent = this.catalog[id].name;
						if (id === meal.proteinId) {
							option.selected = true;
						}
						select.appendChild(option);
					});

					mealCard.appendChild(label);
					mealCard.appendChild(select);
					mealCard.appendChild(
						el(
							'p',
							'fit-pal-meal-card__weight',
							`Raw protein: ${meal.proteinGrams} g`
						)
					);

					mealList.appendChild(mealCard);
				});

				dayCard.appendChild(mealList);
				fragment.appendChild(dayCard);
			});

			board.appendChild(fragment);
		},

		renderBatch() {
			const output = this.refs.batchOutput;
			clearNode(output);

			const windowDays = Math.min(
				this.state.batchWindowDays,
				this.state.days.length
			);
			const slice = this.state.days.slice(0, windowDays);
			const totals = aggregateIngredients(slice);
			const groups = groupGrocery(this.catalog, totals);
			const recipes = buildBatchRecipes(slice, this.catalog);

			output.appendChild(
				el(
					'p',
					'fit-pal-batch-output__intro',
					`Prep session: Days 1–${windowDays}`
				)
			);

			const recipeSection = el('section', 'fit-pal-batch-recipes');
			recipeSection.appendChild(
				el('h4', 'fit-pal-batch-output__group-title', 'Recipes for this batch')
			);

			if (!recipes.length) {
				recipeSection.appendChild(
					el('p', 'fit-pal-batch-output__empty', 'No recipes in this window.')
				);
			} else {
				recipes.forEach((recipe) => {
					const card = el('article', 'fit-pal-recipe-card-batch');
					card.appendChild(el('h5', 'fit-pal-recipe-card-batch__title', recipe.title));
					card.appendChild(
						el(
							'p',
							'fit-pal-recipe-card-batch__meta',
							`~${recipe.timeMin} min · ${recipe.count} portion${
								recipe.count > 1 ? 's' : ''
							} in this window`
						)
					);

					const ingTitle = el(
						'p',
						'fit-pal-recipe-card-batch__label',
						'Scaled ingredients'
					);
					card.appendChild(ingTitle);
					const ingList = el('ul', 'fit-pal-batch-output__list');
					recipe.ingredients.forEach((item) => {
						const li = el('li', 'fit-pal-batch-output__item');
						li.textContent = `${item.name}: ${formatAmount(item.amount, item.unit)}`;
						ingList.appendChild(li);
					});
					card.appendChild(ingList);

					const methodLabel = el(
						'p',
						'fit-pal-recipe-card-batch__label',
						'Method'
					);
					card.appendChild(methodLabel);
					const steps = el('ol', 'fit-pal-recipe-card-batch__steps');
					recipe.steps.forEach((step) => {
						steps.appendChild(el('li', '', step));
					});
					card.appendChild(steps);

					if (recipe.batchTip) {
						card.appendChild(
							el('p', 'fit-pal-recipe-card-batch__tip', `Tip: ${recipe.batchTip}`)
						);
					}

					recipeSection.appendChild(card);
				});
			}

			output.appendChild(recipeSection);

			const weightsSection = el('section', 'fit-pal-batch-output__group');
			weightsSection.appendChild(
				el('h4', 'fit-pal-batch-output__group-title', 'Combined raw prep weights')
			);

			if (!groups.length) {
				weightsSection.appendChild(
					el(
						'p',
						'fit-pal-batch-output__empty',
						'No ingredients in this window.'
					)
				);
			} else {
				groups.forEach((group) => {
					const sub = el('div', 'fit-pal-batch-output__subgroup');
					sub.appendChild(
						el('h5', 'fit-pal-batch-output__subgroup-title', group.label)
					);
					const list = el('ul', 'fit-pal-batch-output__list');
					group.items.forEach((item) => {
						const li = el('li', 'fit-pal-batch-output__item');
						li.textContent = `${item.name}: ${formatAmount(
							item.amount,
							item.unit
						)}`;
						list.appendChild(li);
					});
					sub.appendChild(list);
					weightsSection.appendChild(sub);
				});
			}

			output.appendChild(weightsSection);
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
					el('p', 'fit-pal-grocery__empty', 'No grocery items yet.')
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
