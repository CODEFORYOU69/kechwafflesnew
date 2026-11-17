import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import { prisma } from "./prisma";
import { DEFAULT_SITE_SETTINGS, parseStoredSettings, type SiteSettings } from "./site-settings";

/** Every page that reads the settings carries this tag: saving them refreshes the whole site. */
const SITE_SETTINGS_TAG = "site-settings";
const SETTINGS_ID = "site";

/** Straight from the database, for the admin: never a cached value. */
export async function readSiteSettingsFresh(): Promise<SiteSettings> {
  const row = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
  return parseStoredSettings(row);
}

// The pages stay static: they rebuild when the admin saves, and at worst every hour.
const readCachedSettings = unstable_cache(readSiteSettingsFresh, [SITE_SETTINGS_TAG], {
  tags: [SITE_SETTINGS_TAG],
  revalidate: 3600,
});

/**
 * For the public pages. The defaults when the database does not answer, as the menu does in
 * `menu-products.ts`: the page still builds, with the hours the site has always shown.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    return await readCachedSettings();
  } catch (error) {
    console.error("Réglages du site indisponibles, valeurs par défaut:", error);
    return DEFAULT_SITE_SETTINGS;
  }
});

export async function saveSiteSettings(settings: SiteSettings) {
  const data = {
    sections: settings.sections,
    openingHours: settings.hours,
    isTemporarilyClosed: settings.isTemporarilyClosed,
  };
  await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...data },
    update: data,
  });
  revalidateTag(SITE_SETTINGS_TAG);
}
