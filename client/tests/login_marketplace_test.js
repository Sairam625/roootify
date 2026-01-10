import { Builder, By, until, logging } from 'selenium-webdriver';
import assert from 'assert';

async function runTest() {
    // Launch browser
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
    let driver = await new Builder().forBrowser('chrome').setLoggingPrefs(prefs).build();

    try {
        // --- LOGIN FLOW ---
        console.log('--- STARTING LOGIN FLOW ---');
        console.log('Navigating to Login Page...');
        await driver.get('http://localhost:5173/login');
        await driver.sleep(2000);

        // Wait for the container to load
        await driver.wait(until.elementLocated(By.id('container')), 10000);

        // Ensure we are in "Sign In" mode (default)
        // Verify "Sign In" header is visible in the right panel (sign-in-container)
        let signInHeader = await driver.findElement(By.xpath("//div[contains(@class, 'sign-in-container')]//h1[contains(text(), 'Sign in')]"));
        await driver.wait(until.elementIsVisible(signInHeader), 5000);

        // Enter Email
        console.log('Entering Email...');
        let emailInput = await driver.findElement(By.xpath("//div[contains(@class, 'sign-in-container')]//input[@type='email']"));
        await emailInput.sendKeys('pa@gmail.com');
        await driver.sleep(1500);

        // Enter Password
        console.log('Entering Password...');
        let passwordInput = await driver.findElement(By.xpath("//div[contains(@class, 'sign-in-container')]//input[@type='password']"));
        await passwordInput.sendKeys('123123123');
        await driver.sleep(1500);

        // Click Sign In Button
        console.log('Clicking Sign In...');
        let signInButton = await driver.findElement(By.xpath("//div[contains(@class, 'sign-in-container')]//button[contains(text(), 'Sign In')]"));
        await signInButton.click();
        await driver.sleep(3000);

        // Wait for redirection to Home or Dashboard
        // Assuming successful login redirects to '/'
        await driver.wait(until.urlIs('http://localhost:5173/'), 10000);
        console.log('Login Successful! Redirected to Home.');
        await driver.sleep(2000);


        // --- MARKETPLACE FLOW ---
        console.log('--- STARTING MARKETPLACE FLOW ---');
        console.log('Navigating to Farmer Marketplace...');
        // We can navigate directly or click links. Let's navigate directly to be safe and fast.
        await driver.get('http://localhost:5173/marketplace/farmer');
        await driver.sleep(3000);

        // Wait for "Add New Listing" header
        let addListingHeader = await driver.findElement(By.xpath("//h2[contains(text(), 'Add New Listing')]"));
        await driver.wait(until.elementIsVisible(addListingHeader), 10000);
        console.log('Farmer Dashboard Loaded.');

        // Fill Form
        console.log('Filling Listing Form...');
        await driver.sleep(1000);

        // Select Crop: Potato
        let cropSelect = await driver.findElement(By.name('cropName'));
        await cropSelect.findElement(By.xpath("//option[@value='Potato']")).click();
        await driver.sleep(1000);

        // Enter Quantity
        let quantityInput = await driver.findElement(By.name('quantity'));
        await quantityInput.sendKeys('500 kg');
        await driver.sleep(1000);

        // Enter Price
        let priceInput = await driver.findElement(By.name('price'));
        await priceInput.sendKeys('20000');
        await driver.sleep(1000);

        // Check Transport (Optional, let's check it)
        let transportCheckbox = await driver.findElement(By.name('transport'));
        await transportCheckbox.click();
        await driver.sleep(1000);

        // Verify values
        let cropValue = await cropSelect.getAttribute('value');
        let quantityValue = await quantityInput.getAttribute('value');
        let priceValue = await priceInput.getAttribute('value');
        console.log(`VALUES: Crop=${cropValue}, QQty=${quantityValue}, Price=${priceValue}`);

        // Submit Form
        console.log('Submitting Listing...');
        let submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'List Crop for Sale')]"));
        await submitButton.click();
        await driver.sleep(3000);

        // Check for success message or alert
        try {
            let successMessage = await driver.findElement(By.xpath("//div[contains(text(), 'Listing added successfully')]"));
            await driver.wait(until.elementIsVisible(successMessage), 5000);
            console.log('SUCCESS: Listing created successfully!');
        } catch (e) {
            console.log('Success message not found, checking for alert...');
            try {
                let alert = await driver.switchTo().alert();
                let alertText = await alert.getText();
                console.error('ALERT FOUND:', alertText);
                await alert.accept();
            } catch (alertErr) {
                console.log('No alert found.');
                // Dump source
                let source = await driver.getPageSource();
                console.log('PAGE SOURCE:', source);

                // Check user in localStorage
                let user = await driver.executeScript("return localStorage.getItem('user');");
                console.log('LOCALSTORAGE USER:', user);

                let logs = await driver.manage().logs().get(logging.Type.BROWSER);
                console.log('BROWSER LOGS:', logs);
            }
            throw e;
        }

    } catch (err) {
        console.error('TEST FAILED:', err);
        try {
            let logs = await driver.manage().logs().get(logging.Type.BROWSER);
            console.log('BROWSER LOGS:', logs);
            let source = await driver.getPageSource();
            // console.log('PAGE SOURCE:', source); // Commented out to avoid noise unless needed
        } catch (logErr) {
            console.error('Error fetching logs:', logErr);
        }
        process.exit(1);
    } finally {
        // Close browser
        await driver.quit();
    }
}

runTest();
