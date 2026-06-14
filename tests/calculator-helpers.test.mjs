import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isFlourIngredient,
  shouldCloseMenuOnDocumentClick,
  getPizzaStyleState,
  calculatePizzaRecipe,
  calculateSourdoughTargetPlan,
} from '../src/utils/calculator-helpers.js';

test('isFlourIngredient recognizes localized flour names', () => {
  assert.equal(isFlourIngredient('Bread flour', ['Flour', '面粉']), true);
  assert.equal(isFlourIngredient('高筋面粉', ['Flour', '面粉']), true);
  assert.equal(isFlourIngredient('Harina panificable', ['Harina']), true);
  assert.equal(isFlourIngredient('Water', ['Flour', '面粉']), false);
});

test('shouldCloseMenuOnDocumentClick keeps menu open for toggle child clicks', () => {
  assert.equal(
    shouldCloseMenuOnDocumentClick({
      isMenuOpen: true,
      targetInsideNav: false,
      targetInsideToggle: true,
    }),
    false,
  );

  assert.equal(
    shouldCloseMenuOnDocumentClick({
      isMenuOpen: true,
      targetInsideNav: false,
      targetInsideToggle: false,
    }),
    true,
  );
});

test('getPizzaStyleState returns style-specific description', () => {
  const translations = {
    neapolitan: 'Soft, airy rim with light leopard spotting.',
    newYork: 'Thin, foldable, slightly crispy. The classic street slice.',
  };

  assert.deepEqual(getPizzaStyleState('new-york', translations), {
    hydration: 63,
    thickness: 0.095,
    description: translations.newYork,
  });

  assert.deepEqual(getPizzaStyleState('neapolitan', translations), {
    hydration: 62,
    thickness: 0.085,
    description: translations.neapolitan,
  });
});

test('calculatePizzaRecipe matches the guide weight for a 30cm New York pizza', () => {
  assert.deepEqual(
    calculatePizzaRecipe({
      style: 'new-york',
      pizzaCount: 2,
      pizzaSizeCm: 30,
      hydrationPercent: 63,
    }),
    {
      doughPerBall: 280,
      totalDough: 560,
      flour: 334,
      water: 210,
      yeast: 1.7,
      salt: 7,
      oil: 7,
    },
  );
});

test('calculateSourdoughTargetPlan flags when starter is insufficient for the target amount', () => {
  assert.deepEqual(
    calculateSourdoughTargetPlan({
      desiredTotal: 400,
      existingStarter: 50,
      ratio: '1:1:1',
    }),
    {
      feasible: false,
      requiredStarter: 133.3,
      starterToUse: 50,
      flourNeeded: 50,
      waterNeeded: 50,
      discardAmount: 0,
      finalTotal: 150,
      deficit: 250,
    },
  );
});
