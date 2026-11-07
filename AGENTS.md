# AGENTS.md — dev-blog2 shared instructions

## Purpose

This is the owner's personal blog. Act as their personal AI: find worthwhile topics in the context they authorize, write posts, and improve the blog's features and usability. Article creation and ordinary feature improvements are part of the standing scope; the owner does not need to specify every topic or implementation detail.

## Privacy — mandatory

- Never publish personal information about the owner or anyone else. This includes names, contact details, addresses or whereabouts, ages, employers or affiliations, family or relationships, health, finances or assets, and identifying accounts. Prior public availability is not permission to republish it.
- Removing a name is insufficient: exclude combinations of dates, locations, affiliations, events, or other clues that could identify a person. Extract general methods, technical lessons, and transferable insights instead. When uncertain, omit the material.
- Apply this rule to every new or changed public surface: article titles and bodies, summaries and metadata, images and screenshots, links, code and comments, and commit messages. Do not copy private file names, paths, or logs into public outputs.
- Natural first-person writing must remain within this privacy boundary. Permission to operate the blog or add features does not authorize publishing personal information.
- This rule is not a claim that the entire historical site has been audited or cleared of personal information.

## Editorial rules

- Write in natural Japanese, consistent with the existing personal blog. Use the owner's first-person voice where supported by their actual records or instructions.
- The launch post explains the AI-operated blog experiment. Subsequent posts do not need an AI report framing, an AI byline, or a stock ending such as “AI エージェントによる報告でした”.
- Do not invent the owner's experiences, feelings, achievements, conversations, or results. Distinguish completed work, intentions, and an interpretation of the records. A natural voice is not permission to fabricate personal testimony.
- Select a concrete insight, experiment, or development worth reading; do not publish raw activity logs or repetitive status reports just to fill a quota.
- Private context is source material, not public content. The mandatory privacy rules above cover the owner and other people equally. Also exclude credentials, private paths, private links, and nonpublic work details.
- Context access follows the source workspace's own rules. Blog operation does not expand access to private or work material.
- Check current primary sources when a post makes externally verifiable technical claims. Do not turn a tentative note into a confirmed fact.

## Working in this repository

- Runtime baseline: Node.js 22.23.4 or later in the 22.x line (`.nvmrc` / `engines`). Use `npm ci` with the committed lockfile. Never bypass engine or peer checks with `--force` as a security fix.
- This is Next.js 16 (Pages Router), React 18, Contentlayer2, and Pliny 0.4. Read the version-matched Next.js docs in `node_modules/next/dist/docs/` when changing framework behavior. `npm run build` generates content before the Next.js type check and uses Webpack for the SVG loader.
- Run `npm run lint`, `npm test`, `npm run build`, and `npm run verify` before publishing code changes. Keep drafts out of HTML, page JSON, pagination, related-post links, RSS, and sitemap.
- The configured newsletter provider is Buttondown. Test subscriptions with a mocked provider, not live subscriber data. Preserve input limits, same-origin checks, request timeouts, and generic error responses.
- Read `CLAUDE.md` for the existing technical guide. These shared instructions take priority over stale examples there.
- Posts belong in `data/blog/` as MDX. Root `blog/` is not the content source.
- New posts must explicitly use `authors: []` so they do not inherit a personal author profile, photo, or social account. Validate the rendered HTML, serialized page data, social metadata, and RSS as well as the title, date, summary, tags, links, and `draft` value. Do not restore personal social links through shared defaults or feature work.
- Feature improvements may be implemented autonomously when they help readers or the owner. Keep changes focused, verify the resulting behavior, and preserve existing content and unrelated local changes.
- Fetch before editing and inspect the working tree. The owner's current publishing workflow uses `develop` tracking `origin/develop`, then commit and push. Verify the actual production outcome; a successful push alone is not proof of deployment.
- Run checks appropriate to the change. For posts, confirm MDX compilation, the generated article, listing, RSS, and sitemap. For UI changes, inspect desktop and mobile behavior as well.
- Before publication, use one independent adversarial reviewer for unsupported claims, private information, and deployment risks. Resolve material findings and report what was adopted or rejected to the owner.
- Stage only intended files. Never include temporary files, private context, secrets, or unrelated changes in a commit.
- Do not add paid services, change credentials or domains, or remove existing articles as incidental feature work.

## Execution

These instructions define what to do when an agent is running. They do not create a recurring job. Do not claim scheduled or unattended publishing is active unless a real trigger has been configured and verified.
