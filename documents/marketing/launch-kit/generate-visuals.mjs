#!/usr/bin/env node
/**
 * Génère les visuels du kit de relance dans launch-kit/images/ :
 *
 *   images/instagram/carousel/slide-1..6.jpg     1080×1350 — carrousel FR
 *   images/instagram/carousel-en/slide-1..6.jpg  1080×1350 — carrousel EN
 *   images/tiktok/cover.jpg                      1080×1920 — couverture Reel/TikTok (haut libre pour le hook)
 *   images/stories/relance.jpg                   1080×1920 — story J1 (place pour les stickers)
 *   images/google-business/feature.jpg           1200×900  — photo des posts GBP / posts FB avec lien
 *
 *   node documents/marketing/launch-kit/generate-visuals.mjs
 *
 * Même langage visuel que ../daily-posts/generate-visuals.mjs (palette globals.css, Montserrat).
 */
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../..");
const require = createRequire(join(ROOT, "package.json"));
const sharp = require("sharp");

const IMG = join(ROOT, "public/images/menu-items");

const INK = "#0D0A08";
const CREAM = "#F6F0E7";
const CREAM_300 = "#B9AD9A";
const EMBER = "#EFA63B";
const FONT = "Montserrat";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function text(str, { size, weight = 800, color = CREAM, spacing = 0, width = 0, align = "left" }) {
  const span = `<span foreground="${color}" weight="${weight}"${spacing ? ` letter_spacing="${spacing * 1024}"` : ""}>${esc(str)}</span>`;
  const opts = { text: span, font: `${FONT} ${size}`, rgba: true };
  if (width) { opts.width = width; opts.align = align; }
  const buf = await sharp({ text: opts }).png().toBuffer();
  const meta = await sharp(buf).metadata();
  return { buf, w: meta.width, h: meta.height };
}

const rect = (w, h, bg) => sharp({ create: { width: w, height: h, channels: 4, background: bg } }).png().toBuffer();
const photoBuf = (p, w, h) => sharp(p).rotate().resize(w, h, { fit: "cover", position: "attention" }).toBuffer();

async function chip(comps, { light, x, y, label = "KECH WAFFLES · MARRAKECH", size = 21 }) {
  const t = await text(label, { size, weight: 700, color: light ? INK : CREAM, spacing: 6 });
  comps.push({ input: await rect(t.w + 56, t.h + 26, light ? "#F6F0E7E6" : "#0D0A08CC"), left: x - 28, top: y });
  comps.push({ input: t.buf, left: x, top: y + 13 });
}

// pagination du carrousel : « 2 / 6 » en bas à droite de la bande
async function pageDots(comps, { n, total, W, bandTop }) {
  const t = await text(`${n} / ${total}`, { size: 24, weight: 700, color: CREAM_300, spacing: 2 });
  comps.push({ input: t.buf, left: W - 72 - t.w, top: bandTop + 56 });
  if (n < total) {
    const arrow = await text("→", { size: 34, weight: 800, color: EMBER });
    comps.push({ input: arrow.buf, left: W - 72 - arrow.w, top: bandTop + 96 });
  }
}

const W = 1080, H = 1350, BAND = 340, PAD = 72;

async function save(comps, w, h, out, q = 88) {
  await sharp({ create: { width: w, height: h, channels: 3, background: INK } }).composite(comps).jpeg({ quality: q }).toFile(out);
  console.log("✅", out.split("launch-kit/")[1]);
}

async function band(comps, { title, sub, titleSize = 60 }) {
  comps.push({ input: await rect(W, BAND, INK), left: 0, top: H - BAND });
  comps.push({ input: await rect(96, 8, EMBER), left: PAD, top: H - BAND + 52 });
  const t = await text(title, { size: titleSize, weight: 800, color: CREAM });
  comps.push({ input: t.buf, left: PAD, top: H - BAND + 84 });
  if (sub) {
    const s = await text(sub, { size: 30, weight: 600, color: CREAM_300 });
    comps.push({ input: s.buf, left: PAD, top: Math.min(H - BAND + 96 + t.h, H - s.h - 44) });
  }
}

// —— slide photo plein cadre + bande
async function photoSlide({ photo, light, title, sub, n, total, out }) {
  const comps = [{ input: await photoBuf(photo, W, H - BAND), left: 0, top: 0 }];
  await chip(comps, { light, x: PAD, y: 54 });
  await band(comps, { title, sub });
  await pageDots(comps, { n, total, W, bandTop: H - BAND });
  await save(comps, W, H, out);
}

// —— slide triptyque : 3 photos en bandes verticales + bande
async function triptychSlide({ photos, title, sub, n, total, out }) {
  const colW = Math.floor(W / 3), colH = H - BAND;
  const comps = [];
  for (let i = 0; i < 3; i++) {
    comps.push({ input: await photoBuf(photos[i], colW, colH), left: i * colW, top: 0 });
    if (i) comps.push({ input: await rect(4, colH, INK), left: i * colW - 2, top: 0 });
  }
  await chip(comps, { light: false, x: PAD, y: 54 });
  await band(comps, { title, sub, titleSize: 52 });
  await pageDots(comps, { n, total, W, bandTop: H - BAND });
  await save(comps, W, H, out);
}

// —— slide duel : 2 photos côte à côte + étiquettes + bande
async function splitSlide({ photos, labels, title, sub, n, total, out }) {
  const colW = Math.floor(W / 2), colH = H - BAND;
  const comps = [];
  for (let i = 0; i < 2; i++) {
    comps.push({ input: await photoBuf(photos[i], colW, colH), left: i * colW, top: 0 });
    const l = await text(labels[i], { size: 26, weight: 800, color: INK, spacing: 5 });
    comps.push({ input: await rect(l.w + 48, l.h + 26, EMBER), left: i * colW + Math.round((colW - l.w - 48) / 2), top: colH - 110 });
    comps.push({ input: l.buf, left: i * colW + Math.round((colW - l.w) / 2), top: colH - 110 + 13 });
  }
  comps.push({ input: await rect(4, colH, INK), left: colW - 2, top: 0 });
  await chip(comps, { light: false, x: PAD, y: 54 });
  await band(comps, { title, sub });
  await pageDots(comps, { n, total, W, bandTop: H - BAND });
  await save(comps, W, H, out);
}

// —— slide typographique (fond ink)
async function typoSlide({ big, title, sub, n, total, out, logoTop = false }) {
  const comps = [];
  await chip(comps, { light: false, x: PAD, y: 54 });
  let y = 340;
  if (logoTop) {
    const lg = await sharp(join(IMG, "TransparentWhite.png")).resize(340).png().toBuffer();
    const m = await sharp(lg).metadata();
    comps.push({ input: lg, left: Math.round((W - m.width) / 2), top: 240 });
    y = 240 + m.height + 80;
  }
  if (big) {
    const b = await text(big, { size: 170, weight: 800, color: EMBER });
    comps.push({ input: b.buf, left: Math.round((W - b.w) / 2), top: y });
    y += b.h + 48;
  }
  comps.push({ input: await rect(120, 8, EMBER), left: Math.round((W - 120) / 2), top: y });
  y += 42;
  const t = await text(title, { size: 64, weight: 800, color: CREAM, width: W - 200, align: "centre" });
  comps.push({ input: t.buf, left: Math.round((W - t.w) / 2), top: y });
  y += t.h + 28;
  if (sub) {
    const s = await text(sub, { size: 32, weight: 600, color: CREAM_300, width: W - 220, align: "centre" });
    comps.push({ input: s.buf, left: Math.round((W - s.w) / 2), top: y });
  }
  await pageDots(comps, { n, total, W, bandTop: H - BAND });
  await save(comps, W, H, out);
}

// —— cover TikTok 9:16 : photo plein cadre, texte au tiers bas, HAUT LAISSÉ LIBRE pour le hook
async function tiktokCover({ photo, title, sub, out }) {
  const w = 1080, h = 1920;
  const comps = [{ input: await photoBuf(photo, w, h), left: 0, top: 0 }];
  const t = await text(title, { size: 66, weight: 800, color: CREAM });
  const s = await text(sub, { size: 32, weight: 600, color: CREAM_300 });
  const panelW = Math.min(Math.max(t.w, s.w) + 128, w - 140);
  const panelH = 56 + 8 + 24 + t.h + 18 + s.h + 56;
  const top = 1450 - panelH;
  comps.push({ input: Buffer.from(`<svg width="${panelW}" height="${panelH}"><rect width="100%" height="100%" rx="28" fill="${INK}" fill-opacity="0.90"/></svg>`), left: 70, top });
  comps.push({ input: await rect(96, 8, EMBER), left: 134, top: top + 56 });
  comps.push({ input: t.buf, left: 134, top: top + 88 });
  comps.push({ input: s.buf, left: 134, top: top + 88 + t.h + 18 });
  await save(comps, w, h, out);
}

// —— story 9:16 : carte de marque, gros vide au milieu pour les stickers (sondage, lien…)
async function storyCard({ title, sub, footer, out }) {
  const w = 1080, h = 1920;
  const comps = [];
  const lg = await sharp(join(IMG, "TransparentWhite.png")).resize(300).png().toBuffer();
  const m = await sharp(lg).metadata();
  comps.push({ input: lg, left: Math.round((w - m.width) / 2), top: 200 });
  const t = await text(title, { size: 76, weight: 800, color: CREAM, width: w - 180, align: "centre" });
  comps.push({ input: t.buf, left: Math.round((w - t.w) / 2), top: 200 + m.height + 70 });
  comps.push({ input: await rect(120, 8, EMBER), left: Math.round((w - 120) / 2), top: 200 + m.height + 70 + t.h + 36 });
  const s = await text(sub, { size: 36, weight: 600, color: CREAM_300, width: w - 220, align: "centre" });
  comps.push({ input: s.buf, left: Math.round((w - s.w) / 2), top: 200 + m.height + 70 + t.h + 78 });
  const f = await text(footer, { size: 30, weight: 700, color: EMBER, spacing: 3, width: w - 220, align: "centre" });
  comps.push({ input: f.buf, left: Math.round((w - f.w) / 2), top: 1620 });
  await save(comps, w, h, out);
}

// —— image GBP/FB 4:3
async function gbpFeature({ photo, title, out }) {
  const w = 1200, h = 900, bandH = 200;
  const comps = [{ input: await photoBuf(photo, w, h - bandH), left: 0, top: 0 }];
  comps.push({ input: await rect(w, bandH, INK), left: 0, top: h - bandH });
  comps.push({ input: await rect(96, 8, EMBER), left: 64, top: h - bandH + 44 });
  const t = await text(title, { size: 40, weight: 800, color: CREAM, width: w - 320 });
  comps.push({ input: t.buf, left: 64, top: h - bandH + 72 });
  const lg = await sharp(join(IMG, "TransparentWhite.png")).resize(150).png().toBuffer();
  const m = await sharp(lg).metadata();
  comps.push({ input: lg, left: w - m.width - 56, top: h - bandH + Math.round((bandH - m.height) / 2) });
  await save(comps, w, h, out);
}

// ————— Run —————
for (const d of ["instagram/carousel", "instagram/carousel-en", "tiktok", "stories", "google-business"]) {
  mkdirSync(join(HERE, "images", d), { recursive: true });
}
const OUT = (p) => join(HERE, "images", p);
const TOTAL = 6;

const CAROUSELS = {
  "carousel": {
    s1: { title: "La gaufre,\nprise au sérieux.", sub: "Kech Waffles · Al Badii, Marrakech" },
    s2: { title: "Craffles. Liégeoises.\nPizza waffles.", sub: "Et les signatures marocaines : amlou, fleur d'oranger…" },
    s3: { title: "Sucré d'un côté.\nSalé de l'autre.", sub: "Personne ne se dispute.", labels: ["SUCRÉ", "SALÉ"] },
    s4: { title: "Le kunefe\nest arrivé.", sub: "Préparé à la commande, servi brûlant." },
    s5: { big: "2h", title: "On sert jusqu'à 2h du matin.\nTous les soirs.", sub: "Sauf le lundi — on recharge les fers" },
    s6: { title: "MAG 33 Al Badii,\nMarrakech.", sub: "Sur place ou sur Glovo\n@kech_waffles · www.kechwaffles.com" },
  },
  "carousel-en": {
    s1: { title: "Waffles,\ntaken seriously.", sub: "Kech Waffles · Al Badii, Marrakech" },
    s2: { title: "Craffles. Liège waffles.\nPizza waffles.", sub: "Plus Moroccan signatures: amlou, orange blossom…" },
    s3: { title: "Sweet on one side.\nSavory on the other.", sub: "Everybody wins.", labels: ["SWEET", "SAVORY"] },
    s4: { title: "The kunefe\nhas landed.", sub: "Made to order, served hot." },
    s5: { big: "2am", title: "Open till 2am.\nEvery night.", sub: "Closed on Mondays" },
    s6: { title: "Al Badii,\nMarrakech.", sub: "Dine in or Glovo\n@kech_waffles · www.kechwaffles.com" },
  },
};

for (const [dir, S] of Object.entries(CAROUSELS)) {
  await photoSlide({ photo: join(IMG, "craflechocolatfraise.jpg"), light: false, ...S.s1, n: 1, total: TOTAL, out: OUT(`instagram/${dir}/slide-1.jpg`) });
  await triptychSlide({ photos: [join(IMG, "craflesoreo.jpg"), join(IMG, "gauffresliegeoise2.jpg"), join(IMG, "pizzawaffles.jpg")], ...S.s2, n: 2, total: TOTAL, out: OUT(`instagram/${dir}/slide-2.jpg`) });
  await splitSlide({ photos: [join(IMG, "liegeoisenutella.jpg"), join(IMG, "pzzawaffleboisée.jpg")], ...S.s3, n: 3, total: TOTAL, out: OUT(`instagram/${dir}/slide-3.jpg`) });
  await photoSlide({ photo: join(IMG, "kunefe.png"), light: false, ...S.s4, n: 4, total: TOTAL, out: OUT(`instagram/${dir}/slide-4.jpg`) });
  await typoSlide({ ...S.s5, n: 5, total: TOTAL, out: OUT(`instagram/${dir}/slide-5.jpg`) });
  await typoSlide({ ...S.s6, logoTop: true, n: 6, total: TOTAL, out: OUT(`instagram/${dir}/slide-6.jpg`) });
}

await tiktokCover({ photo: join(IMG, "craflechocolatfraise.jpg"), title: "La gaufre,\nprise au sérieux.", sub: "Kech Waffles · Al Badii, Marrakech", out: OUT("tiktok/cover.jpg") });
await storyCard({ title: "On vous doit\ndes nouvelles 👀", sub: "Nouvelles signatures marocaines,\nkunefe, et une surprise en cuisine…", footer: "MAG 33 AL BADII · MARRAKECH", out: OUT("stories/relance.jpg") });
await gbpFeature({ photo: join(IMG, "gauffresliegeoise.jpg"), title: "Gaufres · craffles · kunefe · café — Al Badii, Marrakech", out: OUT("google-business/feature.jpg") });
