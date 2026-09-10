import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const socialPostSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      weekNumber: { type: "integer" },
      dayOfWeek: { type: "string" },
      scheduledAt: { type: "string" },
      platform: { type: "array", items: { type: "string" } },
      postType: { type: "string" },
      theme: { type: "string" },
      product: { type: "string" },
      title: { type: "string" },
      caption: { type: "string" },
      hashtags: { type: "array", items: { type: "string" } },
      remotionTemplate: { type: "string" },
      visualBrief: { type: "string" },
    },
    required: [
      "weekNumber",
      "dayOfWeek",
      "scheduledAt",
      "platform",
      "postType",
      "theme",
      "title",
      "caption",
      "hashtags",
      "remotionTemplate",
      "visualBrief",
    ],
  },
};

const responseSchema = {
  type: "object",
  properties: {
    month: { type: "integer" },
    year: { type: "integer" },
    monthContext: { type: "string" },
    posts: socialPostSchema,
  },
  required: ["month", "year", "monthContext", "posts"],
};

export async function generateMonthPlan(month: number, year: number) {
  const prompt = `Tu es le social media manager de Kech Waffles, restaurant de gaufres gastronomiques à Marrakech.

BRAND :
- Waffles gastronomiques au chocolat Callebaut (différenciateur premium)
- Ligne "Moroccan Touch" : Chebakia, Amlou, Corne de Gazelle
- Shots vitaminés au wheatgrass cultivé en hydroponie
- Ticanmisu : desserts en boîte, 11 saveurs
- Livraison Glovo
- Identité visuelle : vert #2D6A4F, ambre #F4A261, rouge #E63946
- Ton : chaleureux, artisanal, fier du patrimoine culinaire marocain

RÈGLES :
- 4 posts/semaine : lundi, mercredi, vendredi, samedi
- Rotation thèmes : product → behind_scenes → moroccan_touch → promotion
- 60% image, 30% reel (15-30s), 10% story
- Plateforme principale : instagram. Ajouter facebook si pertinent.
- Captions bilingues français + arabe darija naturel (pas Google Trad)
- 6 à 8 hashtags ciblés par post
- Tenir compte du contexte mois ${month}/${year}
- remotionTemplate : choisir parmi ProductShowcase | BehindScenes | MoroccanTouch | Promotion
- visualBrief : description précise (angle, props, texte à afficher)

Génère le plan pour le mois ${month} / ${year} avec environ 16 posts (4 par semaine).`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const data = JSON.parse(response.text ?? "{}") as {
    month: number;
    year: number;
    monthContext: string;
    posts: Array<{
      weekNumber: number;
      dayOfWeek: string;
      scheduledAt: string;
      platform: string[];
      postType: string;
      theme: string;
      product?: string;
      title: string;
      caption: string;
      hashtags: string[];
      remotionTemplate: string;
      visualBrief: string;
    }>;
  };

  // Delete existing plan for same month/year before creating new one
  await prisma.monthPlan.deleteMany({ where: { month, year } });

  return prisma.monthPlan.create({
    data: {
      month,
      year,
      monthContext: data.monthContext,
      posts: {
        create: data.posts.map((p) => ({
          weekNumber: p.weekNumber,
          dayOfWeek: p.dayOfWeek,
          scheduledAt: new Date(p.scheduledAt),
          platform: p.platform,
          postType: p.postType,
          theme: p.theme,
          product: p.product ?? null,
          title: p.title,
          caption: p.caption,
          hashtags: p.hashtags,
          visualBrief: p.visualBrief,
          remotionTemplate: p.remotionTemplate,
        })),
      },
    },
    include: { posts: { orderBy: { scheduledAt: "asc" } } },
  });
}
