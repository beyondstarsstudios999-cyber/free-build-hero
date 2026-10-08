"""Run with python3 tests/slider_behavior.py against the local preview."""
import asyncio
from playwright.async_api import async_playwright


async def selected_slide(page):
    # Read the selected accessibility state, not thumbnail text or styling.
    return await page.locator('.carousel-thumbnail').evaluate_all(
        '(buttons) => buttons.findIndex(b => b.getAttribute("aria-current") === "true")'
    )


async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 1800})
        await page.goto("http://localhost:8080", wait_until="networkidle")
        await page.mouse.move(1270, 1700)

        # Autoplay: approximately six seconds, never before five seconds.
        start = await selected_slide(page)
        await page.wait_for_timeout(4800)
        assert await selected_slide(page) == start
        await page.wait_for_timeout(1600)
        assert await selected_slide(page) == (start + 1) % 5

        # Hover pauses; leaving resumes the six-second countdown.
        await page.locator('.media-hero').hover()
        start = await selected_slide(page)
        await page.wait_for_timeout(6400)
        assert await selected_slide(page) == start
        await page.mouse.move(1270, 1700)
        await page.wait_for_timeout(6400)
        assert await selected_slide(page) == (start + 1) % 5

        # Reduced motion stops autoplay but preserves manual progression.
        await page.emulate_media(reduced_motion="reduce")
        await page.wait_for_timeout(300)
        start = await selected_slide(page)
        await page.wait_for_timeout(6400)
        assert await selected_slide(page) == start
        await page.get_by_role('button', name='Next slide', exact=True).click()
        await page.wait_for_timeout(100)
        assert await selected_slide(page) == (start + 1) % 5
        await browser.close()
        print("PASS: six-second autoplay, hover pause/resume, reduced-motion manual navigation")


asyncio.run(main())