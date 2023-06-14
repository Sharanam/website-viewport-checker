const puppeteer = require("puppeteer");
module.exports = async function (url) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--start-maximized"],
      ignoreDefaultArgs: ["--enable-automation"],
    });

    async function pageOpener(page, viewportWidth, viewportHeight) {
      await page.goto(url);
      await page.setViewport({
        width: viewportWidth,
        height: viewportHeight,
      });
    }

    const testableViewport = [
      [1280, 800],
      [320, 480],
      [768, 1024],
      [1920, 1080],
    ];
    for (let viewport of testableViewport) {
      const page = await browser.newPage();
      pageOpener(page, viewport[0], viewport[1]);
    }

    // close blank first tab
    const pages = await browser.pages();
    await pages[0].close();
  } catch (err) {
    console.log(err);
  }
};
