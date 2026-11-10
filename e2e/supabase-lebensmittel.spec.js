import { test, expect } from './support/fixtures.js';
import { setupSupabase, writesTo, readsFrom } from './support/supabase-mock.js';

// Charakterisierungstests für Lebensmittel (lebensmittel): Basisdaten und eigene Einträge.

const FOOD = { name: 'Alt', category: 'Gemüse', purin: 1, protein: 1, kcal: 1, carbs: 1, fat: 1, fiber: 0 };

async function fillFoodForm(page, values) {
  await page.evaluate((v) => {
    document.getElementById('af-name').value = v.name;
    document.getElementById('af-purin').value = v.purin;
    document.getElementById('af-kcal').value = v.kcal;
    document.getElementById('af-protein').value = v.protein;
    document.getElementById('af-carbs').value = v.carbs;
    document.getElementById('af-fat').value = v.fat;
    document.getElementById('af-fiber').value = v.fiber;
  }, values);
}

test.describe('Supabase – lebensmittel', () => {
  test('saveNewFood: neues Lebensmittel ohne Treffer: PATCH, dann POST mit Feldern, kein DELETE', async ({ page }) => {
    const requests = await setupSupabase(page);
    await fillFoodForm(page, { name: 'Testfood', purin: 12, kcal: 40, protein: 2, carbs: 3, fat: 1, fiber: 0.5 });

    await page.evaluate(() => { _editFoodIdx = null; saveNewFood(); });

    await expect.poll(() => writesTo(requests, 'lebensmittel').length).toBe(2);
    const [patch, post] = writesTo(requests, 'lebensmittel');
    expect(patch.method).toBe('PATCH');
    expect(patch.query).toBe('?user_id=eq.mario&name=eq.Testfood');
    expect(post.method).toBe('POST');
    expect(post.body).toMatchObject({ user_id: 'mario', name: 'Testfood', purin: 12, kcal: 40, protein: 2, carbs: 3, fat: 1, fiber: 0.5 });
  });

  test('saveNewFood beim Bearbeiten: ein PATCH über den alten Namen, kein DELETE, kein POST', async ({ page }) => {
    const requests = await setupSupabase(page, { 'PATCH:lebensmittel': [{ name: 'Neu' }] });
    await page.evaluate((food) => {
      customFoods = [food];
      mergeCustomFoods();
      _editFoodIdx = 0;
    }, FOOD);
    await fillFoodForm(page, { name: 'Neu', purin: 5, kcal: 5, protein: 5, carbs: 5, fat: 5, fiber: 5 });

    await page.evaluate(() => saveNewFood());

    await expect.poll(() => writesTo(requests, 'lebensmittel').length).toBe(1);
    await page.waitForTimeout(300);
    const [patch] = writesTo(requests, 'lebensmittel');
    expect(patch.method).toBe('PATCH');
    expect(patch.query).toBe('?user_id=eq.mario&name=eq.Alt');
    expect(patch.body.name).toBe('Neu');
    expect(writesTo(requests, 'lebensmittel').map((r) => r.method)).toEqual(['PATCH']);
  });

  test('saveNewFood beim Bearbeiten: schlägt das PATCH fehl, wird nichts gelöscht und nichts neu angelegt', async ({ page }) => {
    const requests = await setupSupabase(page, { 'FAIL:PATCH:lebensmittel': true });
    await page.evaluate((food) => {
      customFoods = [food];
      mergeCustomFoods();
      _editFoodIdx = 0;
    }, FOOD);
    await fillFoodForm(page, { name: 'Neu', purin: 5, kcal: 5, protein: 5, carbs: 5, fat: 5, fiber: 5 });

    await page.evaluate(() => saveNewFood());

    await expect.poll(() => writesTo(requests, 'lebensmittel').length).toBe(1);
    await page.waitForTimeout(300);
    expect(writesTo(requests, 'lebensmittel').map((r) => r.method)).toEqual(['PATCH']);
  });

  test('deleteCustomFood: DELETE über user_id und name', async ({ page }) => {
    const requests = await setupSupabase(page);
    await page.evaluate((food) => {
      customFoods = [food];
      mergeCustomFoods();
      deleteCustomFood(0);
    }, FOOD);

    await expect.poll(() => writesTo(requests, 'lebensmittel').length).toBe(1);
    const [del] = writesTo(requests, 'lebensmittel');
    expect(del.method).toBe('DELETE');
    expect(del.query).toBe('?user_id=eq.mario&name=eq.Alt');
  });

  test('replaceFoods: je Lebensmittel PATCH, ohne Treffer POST; veraltete Einträge zuletzt entfernen', async ({ page }) => {
    const requests = await setupSupabase(page);
    await page.evaluate((food) => {
      customFoods = [food, { ...food, name: 'Zwei' }];
      localStorage.setItem('purin_custom_foods', JSON.stringify(customFoods));
      return SupabaseSync.replaceFoods(customFoods);
    }, FOOD);

    await expect.poll(() => writesTo(requests, 'lebensmittel').length).toBe(5);
    const [pa1, p1, pa2, p2, del] = writesTo(requests, 'lebensmittel');
    expect(pa1.method).toBe('PATCH');
    expect(pa1.query).toBe('?user_id=eq.mario&name=eq.Alt');
    expect(p1.method).toBe('POST');
    expect(p1.body.name).toBe('Alt');
    expect(pa2.method).toBe('PATCH');
    expect(p2.method).toBe('POST');
    expect(p2.body.name).toBe('Zwei');
    // Löschen erst am Schluss, nur für Namen, die nicht mehr in der Liste stehen
    expect(del.method).toBe('DELETE');
    expect(del.query).toBe('?user_id=eq.mario&name=not.in.(' + encodeURIComponent('"Alt","Zwei"') + ')');
  });

  test('replaceFoods: schlägt ein Schreibvorgang fehl, wird nichts gelöscht', async ({ page }) => {
    const requests = await setupSupabase(page, { 'FAIL:POST:lebensmittel': true });
    await page.evaluate((food) => {
      customFoods = [food];
      localStorage.setItem('purin_custom_foods', JSON.stringify(customFoods));
      return SupabaseSync.replaceFoods(customFoods).catch(() => {});
    }, FOOD);

    await expect.poll(() => writesTo(requests, 'lebensmittel').length).toBe(2);
    await page.waitForTimeout(300);
    const methods = writesTo(requests, 'lebensmittel').map((r) => r.method);
    expect(methods).toEqual(['PATCH', 'POST']);
  });

  test('refreshBaseFoodsFromSupabase: liest __base__ sortiert und übernimmt Basisdaten', async ({ page }) => {
    const base = { name: 'Basisfood', category: 'Fleisch', purin: 100, protein: 20, kcal: 150, carbs: 0, fiber: 0, fat: 5 };
    const requests = await setupSupabase(page, {
      lebensmittel: (q) => (q.includes('__base__') ? [base] : []),
    });

    await page.evaluate(() => refreshBaseFoodsFromSupabase());

    const reads = readsFrom(requests, 'lebensmittel');
    expect(reads.some((r) => r.query === '?user_id=eq.__base__&order=id.asc&limit=600')).toBe(true);
    const names = await page.evaluate(() => currentBaseData.map((f) => f.name));
    expect(names).toEqual(['Basisfood']);
  });

  test('liveRefresh: liest eigene Lebensmittel sortiert nach id und übernimmt abweichenden Stand', async ({ page }) => {
    const remote = { name: 'Remote', category: 'Obst', purin: 2, protein: 1, kcal: 30, carbs: 6, fiber: 1, fat: 0 };
    const requests = await setupSupabase(page, {
      lebensmittel: (q) => (q.includes('__base__') ? [] : [remote]),
    });

    await page.evaluate(() => liveRefresh());

    const reads = readsFrom(requests, 'lebensmittel').filter((r) => !r.query.includes('__base__'));
    expect(reads.some((r) => r.query === '?user_id=eq.mario&order=id.asc')).toBe(true);
    const names = await page.evaluate(() => customFoods.map((f) => f.name));
    expect(names).toEqual(['Remote']);
  });

  test('liveRefresh: lädt lokale Lebensmittel hoch, wenn der Server leer ist', async ({ page }) => {
    const requests = await setupSupabase(page);
    await page.evaluate((food) => {
      // Erstgerät simulieren: noch nie synchronisiert
      localStorage.removeItem('purin_synced_foods');
      customFoods = [food];
      liveRefresh();
    }, FOOD);

    // Erstmigration läuft über saveFood: PATCH ohne Treffer, dann POST
    await expect.poll(() => writesTo(requests, 'lebensmittel').length).toBe(2);
    const [, post] = writesTo(requests, 'lebensmittel');
    expect(post.method).toBe('POST');
    expect(post.body).toMatchObject({ user_id: 'mario', name: 'Alt' });
  });
});
