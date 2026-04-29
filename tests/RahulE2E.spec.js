const {test, expect} = require('@playwright/test');

async function login(page) {
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await page.locator('#userEmail').fill("teste@gmail.com.br");
    await page.locator('#userPassword').fill("SuperSecretPassword!1");
    await page.locator('#login').click();
    await expect(page.getByText('Automation Practice')).toBeVisible();
    await page.locator(".card-body h5").last().waitFor();
}

async function addProduct(page,product) {
    const cartCount = page.locator('button:has-text("Cart") label');
    const before = Number((await cartCount.textContent())?.trim());
    const productSelector = page.locator('.card-body').filter({ hasText: product });
    const priceText = await productSelector.locator('.text-muted').textContent();
    const price = Number(priceText.replace(/[^\d]/g, ''));
    await productSelector.locator('button:has-text("Add to cart")').click();
    await expect(page.getByText('Product Added to Cart')).toBeVisible();
    await expect(cartCount).toHaveText(String(before+1));

    return price;
}

test.only('E2E Checkout',async ({page})=>
{
    let expectedTotal = 0;
    let prodValue1 = 0;
    let prodValue2 = 0;
    let prodValue3 = 0;
    const productName1 = 'ZARA COAT';
    const productName2 = 'iphone 13 pro';
    const productName3 = 'ADIDAS ORIGINAL';
    const products = [productName1,productName2,productName3];
    const productValues = [];

    await login(page); 
    for (const product of products) {
        const value = await addProduct(page, product);
        productValues.push(value);
        expectedTotal += value;
    };
    console.log(productValues);
    await page.locator('button.btn-custom:has-text("Cart")').click();
    await expect(page.getByText('My Cart')).toBeVisible();
    // validating products name
    for (const product of products) {
        await expect(page.locator('.cart h3', { hasText: product })).toBeVisible();
    }
    // validating products values
    for (let i = 0; i < products.length; i++) {
        const item = page.locator('.cartWrap li').filter({
            hasText: products[i]
        });
        const priceText = await item.locator('.prodTotal p').textContent();
        const price = Number(priceText.replace(/[^\d]/g, ''));
        expect(price).toBe(productValues[i]);
    };
    // validating total cart value
    const totalRow = page.locator('.totalRow').filter({
        has: page.locator('.label', { hasText: /^Total$/ })
    });
    const totalText = await totalRow.locator('.value').textContent();
    const uiTotal = Number(totalText.replace(/[^\d]/g, ''));
    expect(uiTotal).toBe(expectedTotal);
        
})
