"""Verify the delayed wedding offer and the updated terms in the local preview."""
import asyncio
from playwright.async_api import async_playwright


async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 1800})
        await page.goto("http://localhost:8080", wait_until="domcontentloaded")
        trigger = page.locator(".wedding-special-trigger")
        await trigger.wait_for(state="visible", timeout=15000)
        await page.wait_for_timeout(2000)
        await trigger.click()
        dialog = page.get_by_role("dialog", name="Your day, beautifully remembered.")
        await dialog.wait_for(state="visible")

        # The revised end date and promotion price must be visible in the offer.
        assert await dialog.get_by_text("6 January 2027").is_visible()
        assert await dialog.get_by_text("R6 500", exact=True).is_visible()
        assert await dialog.get_by_text("Was R10 000").is_visible()
        assert await dialog.get_by_text("Save R3 500").is_visible()

        # The poster's location, coverage, inclusions, payment and exclusions are surfaced.
        for detail in [
            "Gauteng only",
            "Maximum of 6 hours",
            "20-minute edit",
            "150 high-resolution, professionally colour-graded photos",
            "R1 500",
            "R3 000",
            "R2 000",
            "Transport, hospitality and accommodation are excluded if required.",
        ]:
            assert await dialog.get_by_text(detail, exact=False).is_visible(), f"Missing offer detail: {detail}"

        await page.get_by_role("button", name="Close wedding special details").click()
        assert await page.get_by_role("dialog").count() == 0
        await browser.close()
        print("PASS: delayed teaser opens the offer with the revised date, price, inclusions and terms.")


asyncio.run(main())