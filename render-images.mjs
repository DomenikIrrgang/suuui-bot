// Renders the server icon, the bot's avatars and its profile banner from the SuuUI mark and crest.
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";

const surface = "#131116";
const svgBody = (file) => readFileSync(file, "utf8").replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>.*?<\/title>/, "");
const mark = svgBody("assets/suuui-mark.svg");
const crest = svgBody("assets/suuui-crest.svg");
const markSmall = svgBody("assets/suuui-mark-small.svg");

function render(name, viewWidth, viewHeight, outWidth, body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewWidth} ${viewHeight}">${body}</svg>`;
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: outWidth },
    font: { fontFiles: ["assets/fonts/MarcellusSC-Regular.ttf"], loadSystemFonts: false, defaultFontFamily: "Marcellus SC" },
  }).render().asPng();
  writeFileSync(`assets/${name}.png`, png);
  console.log(`${name}.png`, png.length, "bytes");
}

// Server icon and plain avatar: the mark on SuuUI's surface; Discord crops to a circle and the diamond fits inside.
render("icon", 100, 100, 512, `<rect width="100" height="100" fill="${surface}"/>${mark}`);
render("avatar", 100, 100, 1024, `<rect width="100" height="100" fill="${surface}"/>${mark}`);

// Emoji: the small mark (thicker gilt, no hairline, made for 16–24px) on a transparent ground, at Discord's 128px.
render("emoji-suuui", 100, 100, 128, markSmall);

// "Ready" avatar: the gem carries arcane's glow, SuuUI's signal for "ready, yours to act on". Transparent around the
// diamond, so the profile circle takes Discord's own background.
render("avatar-ready", 100, 100, 1024, `
  <defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>
  ${mark}
  <polygon points="50,27 73,50 50,73 27,50" fill="#3FD0FF" opacity="0.55" filter="url(#glow)"/>
  <polygon points="50,31 69,50 50,69 31,50" fill="#3FD0FF"/>
  <polygon points="50,31 50,50 31,50" fill="#FFFFFF" fill-opacity="0.45"/>
  <polygon points="69,50 50,69 50,50" fill="#000000" fill-opacity="0.18"/>`);

// Profile banner (5:2): the crest with its gilt wings and the tagline, inside a 1px gilt frame like SuuUI's anchors.
render("banner", 1200, 480, 1200, `
  <rect width="1200" height="480" fill="${surface}"/>
  <rect x="24.5" y="24.5" width="1151" height="431" fill="none" stroke="#C9A75A" stroke-opacity="0.38"/>
  <g transform="translate(200 70) scale(2)">${crest}</g>
  <text x="600" y="380" text-anchor="middle" font-family="Marcellus SC" font-size="40" letter-spacing="3" fill="#E6CC8A">Quiet until it matters</text>`);
