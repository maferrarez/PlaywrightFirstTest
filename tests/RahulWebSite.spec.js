const {test, expect} = require('@playwright/test');

async function login(page) {
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await page.locator('#userEmail').fill("teste@gmail.com.br");
    await page.locator('#userPassword').fill("SuperSecretPassword!1");
    await page.locator('#login').click();
    await expect(page.getByText('Automation Practice')).toBeVisible();    
}


// test('Create User',async ({page})=>
// {
//     await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
//     console.log(await page.title());
//     await expect(page).toHaveTitle("Let's Shop");
//     await page.locator('.text-reset').click();
//     await expect(page.getByText('I am 18 year or Older')).toBeVisible();
//     await page.locator('#firstName').fill("John");
//     await page.locator('#lastName').fill("Lenon");
//     await page.locator('#userEmail').fill("teste@gmail.com.br");
//     await page.locator('#userMobile').fill("9999999999");
//     await page.selectOption('select[formcontrolname="occupation"]', { label: 'Engineer' });
//     await page.getByLabel('Female').check();
//     await page.locator('#userPassword').fill("SuperSecretPassword!1");
//     await page.locator('#confirmPassword').fill("SuperSecretPassword!1");
//     await page.check('input[formcontrolname="required"]');
//     await page.locator('#login').click();
//     await expect(page.getByText('Account Created Successfully')).toBeVisible();
// })


test('Print First Product',async ({page})=>
{
    await login(page); 
    await page.locator(".card-body h5").last().waitFor();
    const cardBody = page.locator(".card-body h5");
    console.log(await cardBody.first().textContent());
    
})

test('Print All Products',async ({page})=>
{
    await login(page); 
    await page.locator(".card-body h5").last().waitFor();
    const allProd = await page.locator(".card-body h5").allTextContents();
    console.log(allProd);
    
})

test('Login-Fail',async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await page.locator('#userEmail').fill("teste@gmail.com.br");
    await page.locator('#userPassword').fill("SuperSecretPassword!1111");
    await page.locator('#login').click();
    await expect(page.getByText('Incorrect email or password.')).toBeVisible();

})

