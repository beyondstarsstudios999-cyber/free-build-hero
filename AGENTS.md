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
- Use the already-installed Embla hook for the homepage slider's horizontal looping and touch physics; keep its viewport isolated from the existing controls so presentation stays unchanged.
- Keep campaign banners and thumbnails as versioned public assets referenced by root-relative paths so Vercel serves them independently of Lovable and replacements bypass stale browser caches.
