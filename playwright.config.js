const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.js/,
  timeout: 30000,
  retries: 1,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4173', headless: true },
  reporter: [['list']]
});
