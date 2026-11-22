# ShiftBrief

ShiftBrief is a shared queue for fictional security shift handoffs. An outgoing analyst records what they checked and leaves a next action. The incoming analyst acknowledges the note and adds their findings. The activity timeline shows acknowledgments and findings with their authors and timestamps.

## Try the workflow

1. Open the app and select **Open shared queue**. Sign in.
2. Use **Try an example**, **Preview note**, and **Save handoff**.
3. Sign in to a second account in another browser profile. Open the saved handoff in both profiles.
4. In the second profile, select **Mark as seen** and use **Add update** to record a fictional finding.
5. Check that both profiles show the acknowledgment and update, that the viewer count changes when the other profile closes the note, and that activity survives a refresh.

All signed-in demo analysts share one queue. Use fictional security cases.

## DeepSpace integrations

- Auth identifies analysts and gates the shared queue.
- Data Sync saves handoffs, acknowledgments, and findings. The client waits for a server confirmation before confirming a write in the form. The acknowledgment collection enforces one receipt per analyst per handoff.
- Presence Rooms show how many other analysts have the same handoff open.

The demo focuses on one handoff from creation through follow-up. It skips alert ingestion, automated response, and separate team workspaces.

## Local setup

Use Node.js 24 and npm 11.6 or later. Run `npm ci`. Sign in with `npx deepspace auth login`, verify the intended owner with `npx deepspace auth whoami`, and register with `npx deepspace app init`. Then run `npm run validate`, `npm run lint`, `npm run build`, and `npm run dev`. Deploy from a clean commit with `npm run deploy`.

The coding agent scaffolded the app, implemented the workflow, and ran TypeScript and ESLint. Deploy verification and the two-account walkthrough are pending.
