import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

async function runTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        console.log('Navigating to Home Page...');
        await driver.get('http://localhost:5173/');

        // Verify Hero Text
        console.log('Verifying Hero Section...');
        let heroText = await driver.findElement(By.xpath("//h1[contains(text(), 'Empowering Indian Agriculture')]"));
        await driver.wait(until.elementIsVisible(heroText), 5000);
        assert.ok(await heroText.isDisplayed(), 'Hero text should be visible');

        console.log('SUCCESS: Home Page Verified!');
    } catch (err) {
        console.error('TEST FAILED:', err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
}
runTest();
