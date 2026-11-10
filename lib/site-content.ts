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
  region: "Marrakech-Safi",
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

/** « Mardi, mercredi, jeudi et samedi : 11h – 2h. … Lundi : fermé. », read from `OPENING_HOURS`. */
export function openingHoursSentence() {
  const groups = new Map<string, string[]>();
  for (const { day, label } of OPENING_HOURS) {
    groups.set(label, [...(groups.get(label) ?? []), day]);
  }

  return [...groups]
    .map(([label, days]) => {
      const names = days.map((day, index) => (index === 0 ? day : day.toLowerCase()));
      const list =
        names.length > 1 ? `${names.slice(0, -1).join(", ")} et ${names.at(-1)}` : names[0];
      return `${list} : ${label === "Fermé" ? "fermé" : label}.`;
    })
    .join(" ");
}

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

/**
 * Asked before coming, answered on `/location`, in its FAQPage schema and in `llms.txt`.
 * Every answer restates a fact held above: change the fact there, not here.
 */
export const FAQ = {
  eyebrow: "03 — Questions",
  titleLines: ["Avant de pousser", "la porte."],
  items: [
    {
      id: "cafe",
      question: "Quel café sert Kech Waffles à Marrakech ?",
      answer:
        "Du café de spécialité, préparé au comptoir devant vous : espresso et ristretto, cortado, flat white, cappuccino et latte, cold brew, et des boissons glacées signatures comme l’Ice White Mocha ou l’Ice Latte Caramel.",
    },
    {
      id: "croffle",
      question: "Qu’est-ce qu’une croffle ?",
      answer:
        "Un croissant passé au fer à gaufre : feuilleté dedans, croustillant dehors. C’est le produit phare de la carte, cuit à la minute, nature ou garni : caramel spéculoos, chocolat fraise, trois chocolats, coco, Oreo.",
    },
    {
      id: "horaires",
      question: "Quels sont les horaires du café ?",
      answer: `${openingHoursSentence()} ${GIRLS_ONLY.closedNote}`,
    },
    {
      id: "adresse",
      question: "Où se trouve le café ?",
      answer: `Au ${CONTACT.addressLine}, à ${CONTACT.city}, à 15 minutes du Jardin Majorelle. Parking gratuit à proximité, et la ligne 17 du bus s’arrête à Al Badii.`,
    },
    {
      id: "reservation",
      question: "Faut-il réserver ?",
      answer: "Non, le café ne prend pas de réservation, Girls Only compris : poussez la porte.",
    },
    {
      id: "girls-only",
      question: "Qu’est-ce que le Girls Only ?",
      answer: `${GIRLS_ONLY.intro} De 11h à 2h du matin, sans réservation.`,
    },
    {
      id: "travailler",
      question: "Peut-on travailler ou réviser au café ?",
      answer:
        "Oui. Le Café IA offre un cadre pour travailler, coder et échanger autour de l’IA, et un service informatique aide les étudiants : le code, les projets d’études, le CV et les dossiers scolaires.",
    },
    {
      id: "livraison",
      question: "Peut-on se faire livrer ?",
      answer: "Oui, la carte est disponible en livraison sur Glovo, à Marrakech.",
    },
    {
      id: "gaufres",
      question: "Servez-vous encore des gaufres ?",
      answer: `${MENU_SECTION.waffleNote} Un corner installé chez vous, cuisson à la minute devant vos invités, dès 30 personnes, à Marrakech et sa région.`,
    },
  ],
};

/** « Tuesday, Wednesday, Thursday and Saturday: 11am – 2am. … », read from `OPENING_HOURS`. */
export function openingHoursEnglish() {
  return englishHourGroups()
    .map(({ days, hours }) => `${listInEnglish(days)}: ${hours}.`)
    .join(" ");
}

/** Days sharing the same hours, closed days last: the rows of the English hours table. */
export function englishHourGroups() {
  const groups = new Map<string, string[]>();
  for (const day of OPENING_HOURS) {
    const hours =
      day.opensAt === null || day.closesAt === null
        ? "closed"
        : `${englishClock(day.opensAt)} – ${englishClock(day.closesAt)}`;
    groups.set(hours, [...(groups.get(hours) ?? []), ENGLISH_DAYS[day.weekday]]);
  }

  return [...groups]
    .map(([hours, days]) => ({ days, hours }))
    .sort((a, b) => Number(a.hours === "closed") - Number(b.hours === "closed"));
}

function englishClock(minutes: number) {
  const time = minutes % (24 * 60);
  const hour = Math.floor(time / 60);
  const rest = time % 60;
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}${rest ? `:${String(rest).padStart(2, "0")}` : ""}${hour < 12 ? "am" : "pm"}`;
}

function listInEnglish(items: string[]) {
  return items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}` : items[0];
}

/** Indexed like `Date.getDay()`. */
const ENGLISH_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * `/en`, one page for visitors who search in English. Translated from the facts above, never
 * beyond them: the rest of the site stays in French.
 */
export const ENGLISH = {
  title: "Specialty coffee and croffles in Marrakech",
  description:
    "Specialty coffee shop in Marrakech (MAG 33, Al Badii), 15 minutes from the Jardin Majorelle: croffles made to order, homemade pastries, open until 2am. Girls Only on Tuesdays and Thursdays.",
  hero: {
    eyebrow: "Specialty coffee · Croffles · Marrakech",
    meta: "MAG 33 · Al Badii, Marrakech",
    titleLines: ["Push", "the door."],
    titleSuffix: " Kech Waffles, specialty coffee and croffles in Marrakech",
    lead: "Coffee taken seriously, croffles of the day, Girls Only on Tuesdays and Thursdays, and an AI Café for students.",
    note: "Tuesday to Sunday, until 2am.",
    directionsCta: "Get directions",
    deliveryCta: "Order on Glovo",
    imageAlt:
      "The front of Kech Waffles at night: lit sign, glass doors, terracotta wall and golden counter",
  },
  coffee: {
    eyebrow: "01 — Specialty coffee",
    titleLines: ["Coffee,", "taken seriously."],
    intro:
      "One counter, one machine, and baristas who taste before they serve. Every bean needs its own grind, every drink its own dose. We adjust, we taste, we start again until the cup is right.",
    families: [
      { name: "Espresso", drinks: ["Ristretto", "Espresso", "Double", "Lungo"] },
      { name: "Milk", drinks: ["Cortado", "Flat White", "Cappuccino", "Latte"] },
      { name: "Cold", drinks: ["Cold Brew"] },
      {
        name: "Signatures",
        drinks: ["Ice White Mocha", "Ice Latte Caramel", "Ice Caramel Macchiato", "Ice Matcha Latte"],
      },
    ],
    imageAlt: "An espresso and a latte in double-walled glasses on the black granite counter",
  },
  croffles: {
    eyebrow: "02 — Croffles",
    titleLines: ["Fresh from", "the iron."],
    intro:
      "The house speciality: a croissant pressed in a waffle iron, flaky inside and crisp outside. Made to order, plain or topped. Next to them, homemade pastries of the day: giant cookies, brownies, brioches and cakes.",
    items: [
      { id: "caramel", name: "Caramel speculoos", alt: "Caramel and speculoos croffle on a black plate engraved with the logo" },
      { id: "fraise", name: "Chocolate strawberry", alt: "Chocolate croffle with fresh strawberries" },
      { id: "trois-chocolats", name: "Triple chocolate", alt: "Triple chocolate croffle with a golden fork" },
      { id: "nature", name: "Plain", alt: "Plain croffle with golden layers" },
    ],
    menuCta: "See the full menu (in French)",
  },
  girlsOnly: {
    eyebrow: "03 — Girls Only",
    titleLines: ["Tuesdays and Thursdays,", "women only."],
    intro:
      "Every Tuesday and Thursday, Kech Waffles is reserved for women only, staff included. A safe space to meet up, work or unwind, from 11am to 2am. No booking: just push the door.",
  },
  aiCafe: {
    eyebrow: "04 — AI Café",
    titleLines: ["The AI Café,", "and IT help."],
    intro:
      "A place to work, code and talk about AI. And IT help for students: the code that won’t run, the study project that’s stuck, the CV and school paperwork to tidy up. Themed evenings around code, to meet people and network.",
    cta: "Ask on WhatsApp",
    message: "Hello Kech Waffles, I would like to know more about the AI Café.",
  },
  visit: {
    eyebrow: "05 — Visit",
    titleLines: ["Al Badii,", "Marrakech."],
    addressTitle: "Address",
    hoursTitle: "Opening hours",
    girlsOnlyNote: "Tuesdays and Thursdays, the café is for women only.",
    accessTitle: "Getting there",
    access: [
      "15 minutes from the Jardin Majorelle",
      "Free parking nearby",
      "Bus line 17, Al Badii stop",
    ],
    mapsCta: "Open in Google Maps",
    whatsappCta: "WhatsApp",
  },
  faq: {
    eyebrow: "06 — Questions",
    titleLines: ["Before you", "push the door."],
    items: [
      {
        id: "coffee",
        question: "What coffee does Kech Waffles serve in Marrakech?",
        answer:
          "Specialty coffee, made at the counter in front of you: espresso and ristretto, cortado, flat white, cappuccino and latte, cold brew, and signature iced drinks such as the Ice White Mocha or the Ice Latte Caramel.",
      },
      {
        id: "croffle",
        question: "What is a croffle?",
        answer:
          "A croissant pressed in a waffle iron: flaky inside, crisp outside. It is the house speciality, made to order, plain or topped: caramel speculoos, chocolate strawberry, triple chocolate, coconut, Oreo.",
      },
      {
        id: "hours",
        question: "When is the café open?",
        answer: `${openingHoursEnglish()} On Tuesdays and Thursdays, the café is for women only.`,
      },
      {
        id: "location",
        question: "Where is the café?",
        answer: `At ${CONTACT.addressLine}, ${CONTACT.city}, 15 minutes from the Jardin Majorelle. Free parking nearby, and bus line 17 stops at Al Badii.`,
      },
      {
        id: "booking",
        question: "Do I need to book?",
        answer: "No, the café does not take bookings, Girls Only included: just push the door.",
      },
      {
        id: "work",
        question: "Can I work or study there?",
        answer:
          "Yes. The AI Café is a place to work, code and talk about AI, and an IT help service supports students with code, study projects, CVs and school paperwork.",
      },
      {
        id: "delivery",
        question: "Do you deliver?",
        answer: "Yes, the menu is available for delivery on Glovo, in Marrakech.",
      },
      {
        id: "waffles",
        question: "Do you still serve waffles?",
        answer:
          "Traditional waffles have left the menu and are kept for events: a waffle corner set up at your venue, cooked to order in front of your guests, from 30 guests, in Marrakech and the region.",
      },
    ],
  },
};
