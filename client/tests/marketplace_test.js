import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

async function runTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        console.log('Navigating to Home to set auth...');
        await driver.get('http://localhost:5173/');

        // Mock User Login
        console.log('Injecting Mock User...');
        await driver.executeScript("localStorage.setItem('user', JSON.stringify({ name: 'Test User', role: 'farmer' }));");

        console.log('Navigating to Marketplace...');
        await driver.get('http://localhost:5173/marketplace');

        // Wait for redirect logic to process
        await driver.wait(until.urlContains('/marketplace/farmer'), 5000);

        // Check URL
        assert.ok((await driver.getCurrentUrl()).includes('/marketplace/farmer'), 'Should be redirected to farmer marketplace');

        console.log('SUCCESS: Marketplace Page Loaded!');
    } catch (err) {
        console.error('TEST FAILED:', err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
}
runTest();
