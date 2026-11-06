/**
 * Single source for the site's copy and business facts.
 *
 * Anything marked `À VALIDER` is an editorial proposal, not a confirmed fact:
 * the team has to check it before going live. No Tailwind classes here, `lib/`
 * is not scanned by Tailwind.
 */

export const SITE_URL = "https://www.kechwaffles.com";

export const CONTACT = {
  whatsappNumber: "212709388431",
  phoneDisplay: "+212 7 09 38 84 31",
  phoneE164: "+212709388431",
  addressLine: "MAG 33, Al Badii",
  city: "Marrakech",
  country: "Maroc",
  geo: { latitude: 31.663527, longitude: -8.003192 },
  mapsUrl: "https://maps.app.goo.gl/CpcUoJM1worpgeUZ9",
  wazeUrl: "https://www.waze.com/ul?ll=31.663527,-8.003192&navigate=yes",
  glovoUrl: "https://glovoapp.com/fr/ma/marrakech/stores/kech-waffles-mar",
  instagramHandle: "@kech_waffles",
  instagramUrl: "https://instagram.com/kech_waffles",
  facebookUrl: "https://facebook.com/kechwaffles",
  tiktokUrl: "https://tiktok.com/@kechwaffles",
  snapchatUrl: "https://snapchat.com/add/kechwaffles",
};

/** Opens WhatsApp on the café's number, with an optional prefilled message. */
export function whatsappUrl(text?: string) {
  const base = `https://wa.me/${CONTACT.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type OpeningDay = {
  day: string;
  short: string;
  /** 0 is Sunday, as in `Date.getDay()`. */
  weekday: number;
  /** Minutes after midnight, `null` when closed. */
  opensAt: number | null;
  /** Minutes after midnight; above 1440 means the next day. */
  closesAt: number | null;
  label: string;
};

const TWO_AM = 26 * 60;

export const OPENING_HOURS: OpeningDay[] = [
  { day: "Lundi", short: "Lun", weekday: 1, opensAt: null, closesAt: null, label: "Fermé" },
  { day: "Mardi", short: "Mar", weekday: 2, opensAt: 11 * 60, closesAt: TWO_AM, label: "11h – 2h" },
  { day: "Mercredi", short: "Mer", weekday: 3, opensAt: 11 * 60, closesAt: TWO_AM, label: "11h – 2h" },
  { day: "Jeudi", short: "Jeu", weekday: 4, opensAt: 11 * 60, closesAt: TWO_AM, label: "11h – 2h" },
  { day: "Vendredi", short: "Ven", weekday: 5, opensAt: 18 * 60 + 30, closesAt: TWO_AM, label: "18h30 – 2h" },
  { day: "Samedi", short: "Sam", weekday: 6, opensAt: 11 * 60, closesAt: TWO_AM, label: "11h – 2h" },
  { day: "Dimanche", short: "Dim", weekday: 0, opensAt: 18 * 60, closesAt: TWO_AM, label: "18h – 2h" },
];

export const HERO = {
  eyebrow: "Café de spécialité · Croffles · Marrakech",
  titleLines: ["Poussez", "la porte."],
  titleSuffix: " Kech Waffles, café de spécialité et croffles à Marrakech",
  lead: "Du café pris au sérieux, des croffles du jour, des mardis et jeudis Girls Only et un Café IA pour les étudiants.",
  scrollCue: "Défiler",
  finalEyebrow: "MAG 33 · Al Badii, Marrakech",
  finalTitle: "Un comptoir, un four, et des tables où l’on reste.",
  finalNote: "Du mardi au dimanche, jusqu’à 2h du matin.",
  doorAlt:
    "La façade de Kech Waffles de nuit : enseigne allumée, portes vitrées, mur terracotta et comptoir doré",
};

export const PILLARS = [
  { index: "01", label: "Café de spécialité", short: "Café", href: "/#cafe" },
  { index: "02", label: "La carte", short: "Carte", href: "/#carte" },
  { index: "03", label: "Girls Only", short: "Girls Only", href: "/#girls-only" },
  { index: "04", label: "Café IA", short: "Café IA", href: "/#cafe-ia" },
];

export const MARQUEE_ITEMS = [
  "Café de spécialité",
  "Croffles du jour",
  "Girls Only mardi & jeudi",
  "Café IA",
  "Al Badii, Marrakech",
];

export const COFFEE = {
  eyebrow: "01 — Café de spécialité",
  titleLines: ["Le café,", "pris au sérieux."],
  intro:
    "Un comptoir, une machine, des baristas qui goûtent avant de servir. Chaque grain demande sa mouture, chaque boisson son dosage. On règle, on goûte, on recommence jusqu’à ce que la tasse soit juste.",
  roastLabel: "Torréfaction",
  roastHint: "Faites glisser pour explorer les profils",
  /** À VALIDER : guide de profils, sans affirmer le stock réel. */
  roasts: [
    {
      id: "clair",
      label: "Clair",
      origin: "Éthiopie",
      notes: ["Floral", "Agrumes", "Thé noir"],
      body: "Vif et parfumé. L’acidité reste haute, le corps léger.",
      drinks: ["Americano", "Cold Brew"],
    },
    {
      id: "moyen",
      label: "Moyen",
      origin: "Colombie",
      notes: ["Caramel", "Fruits rouges", "Rond"],
      body: "L’équilibre. Assez de douceur pour le lait, assez de relief pour la tasse seule.",
      drinks: ["Cortado", "Flat White", "Cappuccino"],
    },
    {
      id: "fonce",
      label: "Foncé",
      origin: "Brésil",
      notes: ["Noisette", "Chocolat", "Faible acidité"],
      body: "Dense et rassurant. Il traverse le lait et le froid sans disparaître.",
      drinks: ["Espresso", "Ristretto", "Ice Mocha"],
    },
  ],
  roastNote: "Un guide des profils. Demandez au comptoir ce qui est en cours.",
  extractionsTitle: "Trois façons de le préparer",
  extractions: [
    {
      id: "espresso",
      name: "Espresso",
      detail: "Pression, mouture fine, et quelques secondes qui décident de tout.",
      drinks: ["Ristretto", "Espresso", "Double", "Lungo"],
    },
    {
      id: "lait",
      name: "Lait travaillé",
      detail: "Une micro-mousse dense, un lait chauffé juste assez pour rester doux.",
      drinks: ["Cortado", "Flat White", "Cappuccino", "Latte"],
    },
    {
      id: "froid",
      name: "Infusion à froid",
      detail: "Le café infuse dans l’eau froide, sans chaleur et tout en rondeur.",
      drinks: ["Cold Brew"],
    },
  ],
  stationLabel: "Station 01 — Espresso · Lait · Froid",
  stationTitle: "Le comptoir, en première ligne.",
  stationText:
    "Tout se passe devant vous : la mouture, l’extraction, le lait qui monte. Posez vos questions, goûtez.",
  stationImages: {
    back: {
      src: "/images/site/espresso-latte.jpg",
      alt: "Un espresso et un latte en verres double paroi sur le comptoir en granit noir",
    },
    front: {
      src: "/images/site/cappuccino-top.jpg",
      alt: "Un cappuccino vu de dessus, sur le comptoir en granit",
    },
    side: {
      src: "/images/site/barista-counter-2.jpg",
      alt: "Un latte en verre double paroi sur le comptoir sombre, devant le mur à lattes dorées portant le logo Kech Waffles",
    },
  },
  signaturesTitle: "Les signatures",
  signatures: [
    { name: "Ice White Mocha", detail: "Café glacé, chocolat blanc, lait" },
    { name: "White Mocha", detail: "Latte au chocolat blanc" },
    { name: "Ice Latte Caramel", detail: "Café glacé, lait, caramel" },
    { name: "Ice Latte Noisette", detail: "Café glacé, lait, noisette" },
    { name: "Ice Latte Vanille", detail: "Café glacé, lait, vanille" },
    { name: "Ice Caramel Macchiato", detail: "Café glacé, caramel macchiato" },
    { name: "Ice Dalgona", detail: "Café glacé fouetté" },
    { name: "Ice Matcha Latte", detail: "Matcha glacé, lait" },
  ],
};

export const MENU_SECTION = {
  eyebrow: "02 — La carte",
  titleLines: ["Sorti du four,", "servi sur place."],
  intro:
    "La carte commence par notre produit phare : les croffles, des croissants passés au fer, feuilletés dedans et croustillants dehors.",
  crofflesTitle: "Les croffles",
  crofflesNote: "Le produit phare. À la minute, nature ou avec garniture.",
  croffles: [
    {
      id: "caramel",
      name: "Caramel spéculoos",
      src: "/images/site/croffle-caramel.jpg",
      width: 1125,
      height: 2000,
      alt: "Croffle au caramel et aux spéculoos sur une assiette noire gravée du logo",
      position: "center",
    },
    {
      id: "fraise",
      name: "Chocolat fraise",
      src: "/images/site/croffle-fraise.jpg",
      width: 1506,
      height: 2000,
      alt: "Croffle au chocolat et aux fraises fraîches",
      position: "center 78%",
    },
    {
      id: "trois-chocolats",
      name: "Trois chocolats",
      src: "/images/site/croffle-3chocolats.jpg",
      width: 1506,
      height: 2000,
      alt: "Croffle aux trois chocolats avec une fourchette dorée",
      position: "center 70%",
    },
    {
      id: "coco",
      name: "Coco",
      src: "/images/site/croffle-coco.jpg",
      width: 1506,
      height: 2000,
      alt: "Croffle à la noix de coco, en gros plan sur le plan de travail en inox",
      position: "center",
    },
    {
      id: "oreo",
      name: "Oreo",
      src: "/images/site/croffle-oreo.jpg",
      width: 1506,
      height: 2000,
      alt: "Croffle aux biscuits Oreo",
      position: "center",
    },
    {
      id: "speculoos",
      name: "Spéculoos",
      src: "/images/site/croffle-speculos.jpg",
      width: 1506,
      height: 2000,
      alt: "Croffle au spéculoos sur un plan en bois",
      position: "center",
    },
    {
      id: "nature",
      name: "Nature",
      src: "/images/site/croffle-nature.jpg",
      width: 1204,
      height: 1248,
      alt: "Croffle nature, au feuilletage doré",
      position: "center",
    },
  ],
  freshTitle: "Frais du jour",
  /** Images générées par IA, faute de photo : le préfixe `ai-` les signale, à remplacer par de vraies photos. */
  freshNote: "Selon ce qui sort du four. Demandez au comptoir. Photos d’illustration.",
  fresh: [
    {
      id: "cookies",
      name: "Cookies géants",
      detail: "Frais du jour. À partager, ou pas.",
      src: "/images/site/ai-cookies.jpg",
      alt: "Cookies géants au chocolat fondant sur une assiette noire mouchetée de bleu",
    },
    {
      id: "brownies",
      name: "Brownies",
      detail: "Ultra-fondants, faits maison.",
      src: "/images/site/ai-brownies.jpg",
      alt: "Deux brownies empilés, au coeur de chocolat coulant",
    },
    {
      id: "brioches",
      name: "Brioches maison",
      detail: "Moelleuses, à la fournée.",
      src: "/images/site/ai-brioches.jpg",
      alt: "Brioche tressée au sucre perlé, avec une tranche coupée",
    },
    {
      id: "gateaux",
      name: "Gâteaux du jour",
      detail: "La vitrine change, le fait maison reste.",
      src: "/images/site/ai-gateaux.jpg",
      alt: "Part de gâteau au chocolat et à la crème, avec une fourchette dorée",
    },
  ],
  waffleNote: "Les gaufres traditionnelles ont quitté la carte. On les garde pour vos événements.",
  waffleCta: "Voir les prestations",
  menuCta: "Voir la carte",
};

/** Filters the database menu: traditional waffles are events only. */
export const EVENT_ONLY_PRODUCT_HANDLES = ["base-gaufre-liegeoise", "base-gaufre-bruxelles"];

/** Real photo shown instead of the catalogue image for these products. */
export const MENU_IMAGE_OVERRIDES: Record<string, string> = {
  "base-craffle": "/images/site/croffle-nature.jpg",
  "la-dubai": "/images/site/ai-croffle-dubai.jpg",
  "la-marrakchia": "/images/site/ai-croffle-marrakchia.jpg",
};

export const GIRLS_ONLY = {
  eyebrow: "03 — Girls Only",
  days: ["Mardi", "Jeudi"],
  titleSr: "Girls Only, tous les mardis et jeudis",
  intro:
    "Tous les mardis et jeudis, Kech Waffles est entièrement réservé aux filles, équipe comprise. Un safe space, sans regard à gérer, pour se retrouver, bosser ou souffler.",
  moments: [
    { id: "retrouver", name: "Se retrouver", detail: "La table entre copines, le temps que ça prend." },
    { id: "bosser", name: "Bosser", detail: "L’ordi ouvert, un latte à côté, personne pour vous déranger." },
    { id: "detendre", name: "Se détendre", detail: "Des croffles, un Ice White Mocha, et rien d’urgent." },
  ],
  weekLabel: "Le rendez-vous de la semaine",
  todayLabel: "Aujourd’hui",
  nextLabel: "Prochain rendez-vous",
  accessLines: ["Pas de réservation,", "poussez la porte."],
  accessText:
    "Ces jours-là, tout le café est à vous, de 11h à 2h du matin, et toute l’équipe est féminine.",
  accessCta: "Nous trouver",
  /** For every place that shows the opening hours: nobody finds out at the door. */
  closedNote: "Mardi et jeudi, le café est réservé aux filles.",
  programmeCta: "Voir le programme",
  /** À VALIDER : aucun programme détaillé n'a été fourni. */
  programmeTitle: "Le programme",
  programmeText:
    "Chaque rendez-vous a son ambiance. Le programme de la semaine est annoncé sur Instagram, et au comptoir.",
};

export const AI_CAFE = {
  eyebrow: "04 — Café IA",
  titleLines: ["Le Café IA,", "et le service informatique."],
  intro:
    "Un cadre pour travailler, coder et échanger autour de l’IA. Et un service informatique pour les étudiants : le code qui résiste, le projet d’études qui coince, le CV et les dossiers scolaires à mettre au propre.",
  terminalTitle: "kech-waffles — service-informatique",
  terminalPrompt: "De quoi avez-vous besoin ?",
  /** À VALIDER : formulation des services ; tarifs et horaires inconnus. */
  requests: [
    {
      id: "cv",
      label: "Mon CV",
      command: "cv --mise-en-forme",
      output: "CV et lettre de motivation : apportez ce que vous avez, on le met en forme avec vous.",
      message: "Bonjour Kech Waffles, j’aimerais de l’aide pour mon CV.",
    },
    {
      id: "dossier",
      label: "Mon dossier scolaire",
      command: "dossier --scolaire",
      output: "Inscriptions et documents à rendre : on vous aide à préparer le dossier et à le mettre au propre.",
      message: "Bonjour Kech Waffles, j’aimerais de l’aide pour mon dossier scolaire.",
    },
    {
      id: "code",
      label: "Mon code",
      command: "debug --a-deux",
      output: "Le bug résiste ? Montrez le code, on le lit à deux. C’est souvent là que ça se débloque.",
      message: "Bonjour Kech Waffles, je bloque sur mon code, est-ce que je peux passer ?",
    },
    {
      id: "projet",
      label: "Mon projet d’études",
      command: "projet --accompagnement",
      output: "PFE, site, appli, mémoire : on vous aide à clarifier le sujet et à trouver la prochaine étape.",
      message: "Bonjour Kech Waffles, je cherche un accompagnement pour mon projet d’études.",
    },
    {
      id: "ia",
      label: "Comprendre l’IA",
      command: "explain --ia --sans-jargon",
      output: "Modèles, prompts, usages : on en parle autour d’un café, sans jargon et sans promesses magiques.",
      message: "Bonjour Kech Waffles, j’aimerais échanger autour de l’IA au Café IA.",
    },
    {
      id: "soirees",
      label: "Les soirées code",
      command: "soirees --theme code",
      output: "Des soirées à thème sur le code, pour échanger et faire du networking. Demandez les prochaines dates.",
      message: "Bonjour Kech Waffles, quelles sont les prochaines soirées à thème sur le code ?",
    },
  ],
  ctaLabel: "Demander de l’aide",
  ctaDefaultMessage: "Bonjour Kech Waffles, je voudrais en savoir plus sur le Café IA et le service informatique.",
  pillars: [
    { id: "travailler", name: "Travailler", detail: "Une table, un café, et le calme qu’il faut pour avancer." },
    { id: "coder", name: "Coder", detail: "Seul ou à plusieurs, avec quelqu’un à qui poser la question." },
    { id: "echanger", name: "Échanger", detail: "Des soirées à thème sur le code, pour rencontrer du monde et faire du networking." },
  ],
  pageCta: "Découvrir le Café IA",
};

export const EVENTS_SECTION = {
  eyebrow: "Prestations",
  titleLines: ["Les gaufres,", "désormais sur mesure."],
  intro:
    "Les gaufres traditionnelles ont quitté la carte pour vos événements. On installe le corner chez vous et on cuit à la minute, devant vos invités.",
  highlights: [
    { label: "Cuisson", value: "À la minute, devant vos invités" },
    { label: "Format", value: "Dès 30 personnes" },
    { label: "Zone", value: "Marrakech et sa région" },
  ],
  images: {
    main: {
      src: "/images/site/gaufre-fraises.jpg",
      alt: "Bubble waffle aux fraises, aux framboises et à la chantilly, sur une assiette noire",
    },
    side: {
      src: "/images/site/gaufre-liegeoise.jpg",
      alt: "Gaufre liégeoise avec un filet de chocolat, sur une assiette noire gravée du logo",
    },
  },
  primaryCta: "Découvrir la prestation",
  secondaryCta: "Demander un devis",
  quoteMessage: "Bonjour Kech Waffles, je souhaite un devis pour un corner gaufres.",
};

export const VISIT = {
  eyebrow: "Nous trouver",
  titleLines: ["Al Badii,", "Marrakech."],
  /** À VALIDER : parking repris de l'ancien site. */
  intro: "À 15 minutes du Jardin Majorelle. Parking gratuit à proximité.",
  hoursTitle: "Horaires",
  addressTitle: "Adresse",
  directionsCta: "Itinéraire",
  deliveryCta: "Commander sur Glovo",
  locationCta: "Voir l’accès",
  whatsappCta: "Écrire sur WhatsApp",
};
