const {test, expect} = require('@playwright/test');


test('Shop - Print Selected Content',async ({page})=>
//print all same elements from an ID or class
{
    await page.goto("https://sauce-demo.myshopify.com/");
    console.log(await page.title());
    await expect(page).toHaveTitle("Sauce Demo");
    const infoProd = page.locator("#page-content h3");
    const allTitles = await infoProd.allTextContents();
    console.log(allTitles);

})

