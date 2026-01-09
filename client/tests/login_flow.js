import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

async function runTest() {
    // Launch browser
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to Login Page
        console.log('Navigating to Login Page...');
        await driver.get('http://localhost:5173/login');

        // Wait for the container to load
        await driver.wait(until.elementLocated(By.id('container')), 10000);

        // Verify "Sign in" text is present (initially in Sign In mode)
        let bodyText = await driver.findElement(By.tagName('body')).getText();
        // Note: Due to the overlay, texts from both sides might be in the DOM.
        // We want to verify the active view. The active view is 'Sign In' by default (isSignUp = false)

        // Click "Sign Up" button in the overlay to toggle mode
        console.log('Switching to Sign Up mode...');
        // The "Sign Up" button is in the overlay-right panel
        let signUpButton = await driver.findElement(By.xpath("//div[contains(@class, 'overlay-right')]//button[contains(text(), 'Sign Up')]"));
        await signUpButton.click();

        // Wait for the animation to complete and the header to be visible
        console.log('Waiting for "Create Account" header to be visible...');
        let createAccountHeader = await driver.findElement(By.xpath("//h1[contains(text(), 'Create Account')]"));
        await driver.wait(until.elementIsVisible(createAccountHeader), 5000);

        let isVisible = await createAccountHeader.isDisplayed();
        assert.ok(isVisible, 'Create Account header should be visible');

        // Verify Name Input
        let nameInput = await driver.findElement(By.xpath("//input[@placeholder='Name']"));
        assert.ok(await nameInput.isDisplayed(), 'Name input should be visible');

        // Verify Email Input
        let emailInput = await driver.findElement(By.xpath("//input[@placeholder='Email']"));
        assert.ok(await emailInput.isDisplayed(), 'Email input should be visible');

        // Verify Phone Number Input exists
        console.log('Verifying Phone Number field...');
        let phoneInput = await driver.findElement(By.xpath("//input[@placeholder='Phone Number']"));
        assert.ok(await phoneInput.isDisplayed(), 'Phone Number input should be visible');

        // Verify Password Input
        let passwordInput = await driver.findElement(By.xpath("//input[@placeholder='Password']"));
        assert.ok(await passwordInput.isDisplayed(), 'Password input should be visible');

        console.log('SUCCESS: All elements verified!');

    } catch (err) {
        console.error('TEST FAILED:', err);
    } finally {
        // Close browser
        await driver.quit();
    }
}

runTest();
