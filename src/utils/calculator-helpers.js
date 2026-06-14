const PIZZA_STYLE_CONFIG = {
  neapolitan: { hydration: 62, thickness: 0.085, referenceWeight: 250, translationKey: 'neapolitan' },
  'new-york': { hydration: 63, thickness: 0.095, referenceWeight: 280, translationKey: 'newYork' },
  sicilian: { hydration: 70, thickness: 0.12, referenceWeight: 380, translationKey: 'sicilian' },
  'thin-crust': { hydration: 58, thickness: 0.08, referenceWeight: 220, translationKey: 'thinCrust' },
  detroit: { hydration: 72, thickness: 0.13, referenceWeight: 400, translationKey: 'detroit' },
};

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

function parseRatio(ratio) {
  const [starter = 1, flour = 1, water = 1] = String(ratio || '1:1:1').split(':').map(Number);
  return { starter, flour, water };
}

export function isFlourIngredient(name, flourTerms = []) {
  const normalizedName = normalizeText(name);
  if (!normalizedName) return false;

  return flourTerms.some((term) => {
    const normalizedTerm = normalizeText(term);
    return normalizedTerm && normalizedName.includes(normalizedTerm);
  });
}

export function shouldCloseMenuOnDocumentClick({
  isMenuOpen,
  targetInsideNav,
  targetInsideToggle,
}) {
  return Boolean(isMenuOpen && !targetInsideNav && !targetInsideToggle);
}

export function getPizzaStyleState(style, descriptions = {}) {
  const config = PIZZA_STYLE_CONFIG[style] || PIZZA_STYLE_CONFIG['new-york'];

  return {
    hydration: config.hydration,
    thickness: config.thickness,
    description: descriptions[config.translationKey] || '',
  };
}

export function calculatePizzaRecipe({
  style = 'new-york',
  pizzaCount = 0,
  pizzaSizeCm = 0,
  hydrationPercent,
}) {
  const config = PIZZA_STYLE_CONFIG[style] || PIZZA_STYLE_CONFIG['new-york'];
  const safeCount = Math.max(0, Math.round(Number(pizzaCount) || 0));
  const safeSize = Math.max(0, Number(pizzaSizeCm) || 0);
  const hydration = Number.isFinite(Number(hydrationPercent)) ? Number(hydrationPercent) : config.hydration;

  if (safeCount <= 0 || safeSize <= 0 || hydration <= 0) {
    return null;
  }

  const diameterFactor = safeSize / 30;
  const doughPerBall = Math.round(config.referenceWeight * diameterFactor * diameterFactor);
  const totalDough = doughPerBall * safeCount;
  const flour = Math.round(totalDough / ((100 + hydration + 0.5 + 2 + 2) / 100));
  const water = Math.round(flour * (hydration / 100));
  const yeast = roundToOneDecimal(flour * 0.005);
  const salt = Math.round(flour * 0.02);
  const oil = Math.round(flour * 0.02);

  return {
    doughPerBall,
    totalDough,
    flour,
    water,
    yeast,
    salt,
    oil,
  };
}

export function calculateSourdoughTargetPlan({
  desiredTotal = 0,
  existingStarter = 0,
  ratio = '1:1:1',
}) {
  const safeDesiredTotal = Math.max(0, Number(desiredTotal) || 0);
  const safeExistingStarter = Math.max(0, Number(existingStarter) || 0);
  const parsedRatio = parseRatio(ratio);
  const totalParts = parsedRatio.starter + parsedRatio.flour + parsedRatio.water;

  if (safeDesiredTotal <= 0 || totalParts <= 0 || parsedRatio.starter <= 0) {
    return null;
  }

  const requiredStarter = roundToOneDecimal(safeDesiredTotal * (parsedRatio.starter / totalParts));
  const feasible = safeExistingStarter >= requiredStarter;
  const starterToUse = feasible ? requiredStarter : safeExistingStarter;
  const flourNeeded = roundToOneDecimal(starterToUse * (parsedRatio.flour / parsedRatio.starter));
  const waterNeeded = roundToOneDecimal(starterToUse * (parsedRatio.water / parsedRatio.starter));
  const finalTotal = roundToOneDecimal(starterToUse + flourNeeded + waterNeeded);
  const discardAmount = feasible ? roundToOneDecimal(safeExistingStarter - starterToUse) : 0;
  const deficit = feasible ? 0 : roundToOneDecimal(safeDesiredTotal - finalTotal);

  return {
    feasible,
    requiredStarter,
    starterToUse: roundToOneDecimal(starterToUse),
    flourNeeded,
    waterNeeded,
    discardAmount,
    finalTotal,
    deficit,
  };
}
