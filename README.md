# suuui-bot

The bot behind the [SuuUI Discord server](https://discord.gg/JkdTrRXdDw). The whole server lives in
[`plan.mjs`](plan.mjs): roles, channels, permissions, posts, rules, AutoMod, onboarding. [`setup.mjs`](setup.mjs) makes
the server match it through the Discord API. Change the plan, run it again, done.

It runs once and exits; it is not an always-online bot.

## What it sets up

| | |
|---|---|
| **Server** | Name, icon, Community, verification and media filter, description |
| **Roles** | Developer, Moderator, Contributor; the nine classes in the game's class colours; Tester, Plugin Author; Tank, Healer, DPS; ping roles. Colours come from the SuuUI design system |
| **Channels** | Eight categories: Start here, SuuUI, Support, Testing (Testers only), Development, Azeroth, Voice, Staff (hidden) |
| **Forums** | #ui-showcase, #profiles, #suggestions, #help, #bug-reports, with tags and posting guidelines |
| **Posts** | #welcome, #rules, #faq, #known-issues, #test-builds; edited in place on every run |
| **Rules** | The #rules post and Discord's rules screening, from one list |
| **Onboarding** | Class (required), role, pings, Tester and Plugin Author; the welcome screen |
| **AutoMod** | Slurs and sexual content, spam, invite links and scams, alerts to #mod-log |
| **Webhooks** | GitHub releases to #releases; commits, pull requests and issues to #github-feed |
| **Look** | The bot's avatar and banner, the `:suuui:` emoji |

## First run

1. **Server:** create an empty Discord server.
2. **Bot:** in the [Developer Portal](https://discord.com/developers/applications), create an application. Under **Bot**, click **Reset Token** and copy the token.
3. **Invite:** under **OAuth2 → URL Generator**, tick **bot** and **Administrator**, open the URL and add the bot to the server.
4. **Server ID:** turn on **User Settings → Advanced → Developer Mode**, then right-click the server and click **Copy Server ID**.
5. **Settings:** copy `.env.example` to `.env` and fill in `DISCORD_TOKEN` and `GUILD_ID`. `GITHUB_TOKEN` is only needed for the repository webhooks.
6. **Apply:** run `node setup.mjs --apply --prune`. `--prune` removes Discord's default channels.
7. **Roles:** in **Server Settings → Roles**, drag the bot's role to the top, then run `node setup.mjs --apply` again to sort the roles. A bot can't move its own role.

## Running it

```sh
node setup.mjs                  # dry run: shows what would change, changes nothing
node setup.mjs --apply          # make the server match plan.mjs
node setup.mjs --apply --prune  # also delete channels the plan doesn't have
node setup.mjs --apply --profile  # upload the bot's avatar and banner again
node setup.mjs --apply --no-github  # leave the GitHub repository's webhooks alone
```

Needs Node 22 or newer; there are no runtime dependencies. Settings come from the environment, or from `.env` for
anything the environment doesn't set.

### In a container

```sh
docker build -t suuui-discord-setup .
docker run --rm --env-file .env suuui-discord-setup            # dry run
docker run --rm --env-file .env suuui-discord-setup --apply
```

Or `docker compose run --rm discord-setup --apply`. `.env` never goes into the image.

## Changing the server

Edit [`plan.mjs`](plan.mjs) and run `node setup.mjs --apply`. Things are found by name, so a rename creates a new
channel or role: rename it in Discord too, or delete the old one.

- **`:suuui:` in text** becomes the server's emoji; `<#channel>` becomes a channel link.
- **Rules** live in `rules`, used by both the #rules post and rules screening (300 characters each at most).

## Images

`assets/` holds the SuuUI marks from [suuui-website](https://github.com/DomenikIrrgang/suuui-website) and the PNGs
made from them: the server icon, the bot's avatar and banner, and the emoji. After changing
[`render-images.mjs`](render-images.mjs):

```sh
npm install
npm run images
node setup.mjs --apply --profile
```

Discord can't replace an emoji's picture: delete the emoji in Server Settings, then run the setup again.

## Good to know

- **Rules screening** uses an endpoint Discord's own client uses but doesn't document. If it stops working, edit the
  rules under Server Settings → Safety Setup.
- **Mass-mention AutoMod:** Community servers get Discord's own rule for this, which the API can't edit, so the plan
  leaves it as it is.
- **Profile changes** are rate-limited hard, so the avatar and banner only go up when the bot has none or with
  `--profile`.

## Licence

MIT, see [`LICENSE`](LICENSE). [Marcellus SC](assets/fonts) is under the SIL Open Font License, see
[`assets/fonts/OFL.txt`](assets/fonts/OFL.txt).
