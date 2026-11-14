<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the homepage campaign carousel client-side and image-driven so it remains fast, portable, and free of external service costs.
- Use Embla with its Fade companion for overlapping campaign transitions and touch physics, and CSS for each picture's zoom cycle; isolate the viewport from the controls to preserve presentation.
- Keep campaign banners and thumbnails as versioned public assets referenced by root-relative paths so Vercel serves them independently of Lovable and replacements bypass stale browser caches.
- Keep shared website logos as traced SVG public assets and device icons as sized, versioned public PNGs referenced by the shared root head, so both pages stay crisp and portable on Vercel.
- Group portfolio clips by their actual aspect ratio, display two videos per row on desktop and one on mobile, and host any clip exceeding repository file limits through an asset pointer.
