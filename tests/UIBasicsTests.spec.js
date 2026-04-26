const {test, expect} = require('@playwright/test');


test('Browser Context Playwright test',async ({browser})=>
{
      const context = await browser.newContext(); 
      const page = await context.newPage();
      await page.goto("https://the-internet.herokuapp.com/")

})

test('Page Playwright test',async ({page})=>
{
    await page.goto("https://the-internet.herokuapp.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle("The Internet");

})

test('Page Playwright Login-Success',async ({page})=>
{
    await page.goto("https://practice.expandtesting.com/login");
    console.log(await page.title());
    //await page.locator('#username').type("practice")  -old
    await page.locator('#username').fill("practice");
    await page.locator('#password').fill("SuperSecretPassword!");
    await page.locator('#submit-login').click();
    await expect(page).toHaveTitle("Secure Page page for Automation Testing Practice");

})

test('Page Playwright Login-Fail',async ({page})=>
{
    await page.goto("https://practice.expandtesting.com/login");
    console.log(await page.title());
    //await page.locator('#username').type("practice")  -old
    await page.locator('#username').fill("practice123");
    await page.locator('#password').fill("SuperSecretPassword!");
    await page.locator('#submit-login').click();
    await expect(page.locator('#flash')).toHaveText('Your password is invalid!');

})


