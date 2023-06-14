const puppeteer = require("puppeteer");
async function checkOverlappingComponents(url, viewportWidth, viewportHeight) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });

  const page = (await browser.pages())[0];

  await page.goto(url);
  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  await page.waitForSelector("body");

  const overlappingElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("body *")).filter(
      (el) => el.offsetWidth > 0 && el.offsetHeight > 0
    );
    const isOverlapping = (el1, el2) => {
      const rect1 = el1.getBoundingClientRect();
      const rect2 = el2.getBoundingClientRect();

      return !(
        rect1.top + rect1.height < rect2.top ||
        rect1.top > rect2.top + rect2.height ||
        rect1.left + rect1.width < rect2.left ||
        rect1.left > rect2.left + rect2.width
      );
    };

    const overlapping = [];

    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        if (isOverlapping(elements[i], elements[j])) {
          overlapping.push(
            "Element 1: " +
              elements[i].outerHTML +
              "\nElement 2: " +
              elements[j].outerHTML +
              "\n\n"
          );
        }
      }
    }

    // return overlapping;
    document.body.innerHTML = overlapping;
  });

  console.log("Overlapping elements:");
  console.log(
    await page.evaluate(() => document.querySelector("body").innerHTML)
  );
  try {
    overlappingElements?.forEach(([el1, el2]) => {
      console.log(el1, el2);
    });
  } catch (err) {
    console.log("ERROR:", err.message);
  }

  await browser.close();
}

const url = "https://pension-form.netlify.app";

try {
  // desktop view
  //   checkOverlappingComponents(url, 1280, 800);
  //   // mobile view
  //   checkOverlappingComponents(url, 320, 480);
  //   // tablet view
  //   checkOverlappingComponents(url, 768, 1024);
  //   // xl view
  checkOverlappingComponents(url, 1920, 1080);
} catch (err) {
  console.log(err.message);
}
