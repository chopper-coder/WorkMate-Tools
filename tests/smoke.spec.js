const { test, expect } = require('@playwright/test');

test('home loads under strict CSP with 24 tools', async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/工作喵工具箱|WorkMate Tools/);
  await expect(page.locator('#toolCount')).toHaveText('24');
  await expect(page.locator('#allToolGrid [data-tool]')).toHaveCount(24);
  expect(await page.locator('#favoriteGrid [data-tool]').count()).toBeGreaterThan(0);
  await expect(page.locator('#buildNotice')).toBeHidden();
  expect(errors).toEqual([]);
});

test('all core tools can open without page errors', async ({page}) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  const ids=await page.locator('#allToolGrid [data-tool]').evaluateAll(es=>es.map(e=>e.dataset.tool));
  expect(ids).toHaveLength(24);
  for(const id of ids){
    await page.locator(`#allToolGrid [data-tool="${id}"]`).click();
    await expect(page.locator('#toolView')).toHaveClass(/active/);
    await page.locator('#backBtn').click();
  }
  expect(errors).toEqual([]);
});

test('category filtering hides favorite section', async ({page}) => {
  await page.goto('/');
  await page.locator('[data-cat="image"]').click();
  await expect(page.locator('#favoriteSection')).toHaveClass(/hidden/);
  await expect(page.locator('#allToolGrid [data-tool]')).toHaveCount(3);
});

test('download is gated by export confirmation', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="text-clean"]').click();
  await page.locator('#tcIn').fill('  A  \n\nA');
  await page.locator('[data-act="all"]').click();
  await page.locator('#tcSave').click();
  await expect(page.locator('#exportModal')).not.toHaveClass(/hidden/);
  await expect(page.locator('#exportMeta')).toContainText('文字整理結果.txt');
  await page.locator('#exportCancel').click();
  await expect(page.locator('#exportModal')).toHaveClass(/hidden/);
});

test('annotation recovery and project controls exist', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="image-annotate"]').click();
  await expect(page.locator('#iaProjectSave')).toBeVisible();
  await expect(page.locator('#iaProjectOpen')).toHaveCount(1);
  await expect(page.locator('#iaLock')).toBeVisible();
  await expect(page.locator('#iaDraftClear')).toBeVisible();
  await expect(page.locator('#iaDraftState')).toContainText('自動復原');
});

test('Excel clean exposes integrity protections', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="excel-clean"]').click();
  await expect(page.locator('#toolMount')).toContainText('number format');
  await expect(page.locator('#toolMount')).toContainText('公式');
});


test('Excel clean detects formula risk and preserves displayed leading zero in preview', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="excel-clean"]').click();
  await page.locator('#cleanFile').setInputFiles('samples/excel_integrity_v16.xlsx');
  await page.locator('#cleanAnalyze').click();
  await expect(page.locator('#cleanOut')).toContainText('000123');
  await expect(page.locator('#cleanOut')).toContainText('公式');
  const block=page.locator('input[name="formulaPolicy"][value="block"]');
  await expect(block).toBeChecked();
  await page.locator('#cleanDownload').click();
  await expect(page.locator('#exportModal')).toHaveClass(/hidden/);
});

test('annotation project can reopen and save through preview gate', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="image-annotate"]').click();
  await page.locator('#iaProjectOpen').setInputFiles('samples/annotation_project_v17.workmate');
  await expect(page.locator('#iaStatus')).toContainText('3 個標註物件');
  await page.locator('#iaProjectSave').click();
  await expect(page.locator('#exportModal')).not.toHaveClass(/hidden/);
  await expect(page.locator('#exportMeta')).toContainText('WorkMate_圖片標註專案.workmate');
});


test('raffle supports alternates, fullscreen control, and keeps duplicates by default', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="raffle"]').click();
  await expect(page.locator('#rfAltCount')).toBeVisible();
  await expect(page.locator('#rfFullscreen')).toBeVisible();
  await expect(page.locator('#rfDedupe')).not.toBeChecked();
});

test('random grouping does not silently dedupe', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="random-group"]').click();
  await expect(page.locator('#rgDedupe')).not.toBeChecked();
  await page.locator('#rgIn').fill('王小明\n王小明\n陳小華');
  await page.locator('#rgRun').click();
  await expect(page.locator('#rgOut')).toContainText('本次全部保留');
});

test('QR and image compression expose progress and cancel controls', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="qr-batch"]').click();
  await expect(page.locator('#qrCancel')).toBeVisible();
  await expect(page.locator('#qrProgress')).toHaveCount(1);
  await page.locator('#backBtn').click();
  await page.locator('#allToolGrid [data-tool="image-compress"]').click();
  await expect(page.locator('#icCancel')).toBeVisible();
  await expect(page.locator('#icProgress')).toHaveCount(1);
});


test('Excel clean reports mixed-type columns before export', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="excel-clean"]').click();
  await page.locator('#cleanFile').setInputFiles('samples/excel_mixed_types_v17.xlsx');
  await page.locator('#cleanAnalyze').click();
  await expect(page.locator('#cleanOut')).toContainText('型別混合欄');
  await expect(page.locator('#cleanOut')).toContainText('前導 0');
  await expect(page.locator('#cleanOut')).toContainText('日期');
});


test('number uppercase converts ordinary and TWD currency values', async ({page}) => {
  await page.goto('/');
  await page.locator('#allToolGrid [data-tool="number-uppercase"]').click();
  await page.locator('#nuIn').fill('0\n10\n101\n10001\n12345.6\n123.456\n-20.05');
  await page.locator('#nuMode').selectOption('currency');
  await page.locator('#nuRun').click();
  const out=page.locator('#nuOut');
  await expect(out).toContainText('新臺幣零元整');
  await expect(out).toContainText('新臺幣壹拾元整');
  await expect(out).toContainText('新臺幣壹佰零壹元整');
  await expect(out).toContainText('新臺幣壹萬零壹元整');
  await expect(out).toContainText('新臺幣壹萬貳仟參佰肆拾伍元陸角整');
  await expect(out).toContainText('新臺幣壹佰貳拾參元肆角陸分');
  await expect(out).toContainText('負新臺幣貳拾元零伍分');
  await page.locator('#nuMode').selectOption('number');
  await page.locator('#nuRun').click();
  await expect(out).toContainText('壹萬貳仟參佰肆拾伍點陸');
});
