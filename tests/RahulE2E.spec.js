const {test, expect} = require('@playwright/test');

async function login(page) {
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await expect(page).toHaveTitle("Let's Shop");
    const userEmail = "teste@gmail.com.br";
    await page.locator('#userEmail').fill("teste@gmail.com.br");
    await page.locator('#userPassword').fill("SuperSecretPassword!1");
    await page.locator('#login').click();
    await expect(page.getByText('Automation Practice')).toBeVisible();
    await page.locator(".card-body h5").last().waitFor();

    return userEmail;
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
    function getTestCard() {
        return {
            number: '4242424242424242',
            expiryM: '12',
            expiryY: '30',
            cvv: '123',
            name: 'Test User'
        };
    };

    let expectedTotal = 0;
    let prodValue1 = 0;
    let prodValue2 = 0;
    let prodValue3 = 0;
    const productName1 = 'ZARA COAT 3';
    const productName2 = 'iphone 13 pro';
    const productName3 = 'ADIDAS ORIGINAL';
    const products = [productName1,productName2,productName3];
    const productValues = [];
    const card = getTestCard();
    const cuponCode = "rahulshettyacademy";
    const country = 'Nicaragua'
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: '2-digit'}).replace(',', '');

    const userEmail = await login(page); 

    //Adding products to cart
    for (const product of products) {
        const value = await addProduct(page, product);
        productValues.push(value);
        expectedTotal += value;
    };

    //Validating cart page
    await page.locator('button.btn-custom:has-text("Cart")').click();
    await expect(page.getByText('My Cart')).toBeVisible();
    
    //Validating products name
    for (const product of products) {
        await expect(page.locator('.cart h3', { hasText: product })).toBeVisible();
    }

    //Validating products values
    for (let i = 0; i < products.length; i++) {
        const item = page.locator('.cartWrap li').filter({
            hasText: products[i]
        });
        const priceText = await item.locator('.prodTotal p').textContent();
        const price = Number(priceText.replace(/[^\d]/g, ''));
        expect(price).toBe(productValues[i]);
    };

    //Validating total cart value
    const totalRow = page.locator('.totalRow').filter({
        has: page.locator('.label', { hasText: /^Total$/ })
    });
    const totalText = await totalRow.locator('.value').textContent();
    const uiTotal = Number(totalText.replace(/[^\d]/g, ''));
    expect(uiTotal).toBe(expectedTotal);
        
    //Adding Personal Information in checkout page
    await page.locator('button.btn-primary:has-text("Checkout")').click();
    await expect(page.getByText('Payment Method')).toBeVisible();
    await page.locator('.field', { hasText: 'Credit Card Number' }).locator('input').fill(card.number);
    const expiryField = page.locator('.field', { hasText: 'Expiry Date ' });
    const monthDropdown = await expiryField.locator('select').nth(0);
    const yearDropdown = await expiryField.locator('select').nth(1);
    await monthDropdown.selectOption({ label: card.expiryM });
    await yearDropdown.selectOption({ label: card.expiryY });
    await page.locator('.field', { hasText: 'CVV Code' }).locator('input').fill(card.cvv);
    await page.locator('.field', { hasText: 'Name on Card' }).locator('input').fill(card.name);
    await page.locator('.field', { hasText: 'Apply Coupon' }).locator('input').fill(cuponCode);

    //Adding Shipping Information in checkout page
    const email = (await page.locator('.user__name label').textContent())?.trim();
    expect(email).toBe(userEmail);
    await page.locator("[placeholder*='Country']").pressSequentially(country, { delay: 1000 });
    await page.locator(`button.ta-item:has-text("${country}")`).click();

    //Place order
    await page.locator('.action__submit').click();
    await expect(page.getByText('Thankyou for the order.')).toBeVisible();

    for (let i = 0; i < products.length; i++) {
        page.locator('.title div').filter({ hasText: products[i] });
        page.locator('.title div').filter({ hasText: productValues[i]});
    };    

    //Getting orders number
    const orderIds = await page.locator('label:has-text("|")').allTextContents();
    const cleanedIds = orderIds.map(id =>id.replace(/\|/g, '').trim());

    //Validating Orders page
    await page.locator('.fa-handshake-o').click();
    await expect(page.getByText('Your Orders')).toBeVisible();
 
    //Validating table
    for (let i = 0; i < products.length; i++) {
        const row = page.locator('tbody tr').filter({has: page.locator('th', { hasText: cleanedIds[i] })});
        await expect(row.locator('td', { hasText: products[i] })).toBeVisible();
        await expect(row.locator('td', { hasText: productValues[i].toString() })).toBeVisible();
        await expect(row.locator('td', { hasText: formattedDate })).toBeVisible();
    }; 

})
