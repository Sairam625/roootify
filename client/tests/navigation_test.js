import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

async function runTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        console.log('Navigating to Home Page...');
        await driver.get('http://localhost:5173/');

        // Wait for Navbar
        await driver.wait(until.elementLocated(By.tagName('nav')), 5000);

        // Test Loans Link
        console.log('Testing Loans Navigation...');
        let loansLink = await driver.findElement(By.xpath("//a[contains(text(), 'Loans')]"));
        await loansLink.click();
        await driver.wait(until.urlContains('/loans'), 5000);
        assert.ok((await driver.getCurrentUrl()).includes('/loans'), 'URL should contain /loans');

        // Test Market Trends Link
        console.log('Testing Market Trends Navigation...');
        let pricesLink = await driver.findElement(By.xpath("//a[contains(text(), 'Market Trends')]"));
        await pricesLink.click();
        await driver.wait(until.urlContains('/prices'), 5000);
        assert.ok((await driver.getCurrentUrl()).includes('/prices'), 'URL should contain /prices');

        // Test Marketplace Link
        console.log('Testing Marketplace Navigation...');
        let marketplaceLink = await driver.findElement(By.xpath("//a[contains(text(), 'Marketplace')]"));
        await marketplaceLink.click();
        await driver.wait(until.urlContains('/marketplace'), 5000);
        assert.ok((await driver.getCurrentUrl()).includes('/marketplace'), 'URL should contain /marketplace');

        console.log('SUCCESS: Navigation Verified!');
    } catch (err) {
        console.error('TEST FAILED:', err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
}
runTest();
