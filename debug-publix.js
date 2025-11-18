const puppeteer = require("puppeteer");

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: false, // Show the browser so you can see what's happening
    slowMo: 100, // Slow down by 100ms so you can see what's happening
  });

  const page = await browser.newPage();

  // Set a larger viewport
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to Publix digital coupons page...");
  await page.goto("https://www.publix.com/savings/digital-coupons", {
    waitUntil: "networkidle2",
  });

  // Take a screenshot
  await page.screenshot({ path: "publix-page.png", fullPage: true });
  console.log("Screenshot saved to publix-page.png");

  // Wait a bit for any modals/popups
  await page.waitForTimeout(2000);

  // Try to find sign-in related elements
  console.log("\nLooking for sign-in buttons...");

  const buttons = await page.evaluate(() => {
    const results = [];

    // Find all buttons and links
    // eslint-disable-next-line no-undef
    const elements = document.querySelectorAll("button, a");

    elements.forEach((el, index) => {
      const text = (el.textContent && el.textContent.trim()) || "";
      const classes = el.className;
      const id = el.id;
      const href = el.getAttribute("href");

      // Look for sign-in related elements
      if (
        text.toLowerCase().includes("sign") ||
        text.toLowerCase().includes("log") ||
        classes.toLowerCase().includes("sign") ||
        classes.toLowerCase().includes("log") ||
        classes.toLowerCase().includes("auth")
      ) {
        results.push({
          index,
          tagName: el.tagName,
          text: text.substring(0, 50),
          classes,
          id,
          href,
        });
      }
    });

    return results;
  });

  console.log("Found sign-in related elements:");
  console.log(JSON.stringify(buttons, null, 2));

  // Save HTML for inspection
  const html = await page.content();
  const fs = require("fs");
  fs.writeFileSync("publix-page.html", html);
  console.log("\nFull HTML saved to publix-page.html");

  console.log("\nBrowser will stay open for 30 seconds so you can inspect...");
  console.log("Look at the page and note what the sign-in button looks like!");

  await page.waitForTimeout(30000);

  await browser.close();
})();
