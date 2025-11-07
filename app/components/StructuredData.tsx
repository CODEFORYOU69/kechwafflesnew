export function StructuredData() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Kech Waffles",
    description:
      "Restaurant à Marrakech spécialisé en gaufres tiramisu, pancakes, milkshakes, bubble waffles, pizza waffles et boissons gourmandes.",
    image: "https://www.kechwaffles.com/images/menu-items/TransparentBlack.jpg",
    "@id": "https://www.kechwaffles.com",
    url: "https://www.kechwaffles.com",
    telephone: "+212-XXXXXXXXX", // À mettre à jour
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Votre adresse", // À mettre à jour
      addressLocality: "Marrakech",
      postalCode: "40000",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.6295, // À mettre à jour avec vos coordonnées
      longitude: -7.9811,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "23:00",
      },
    ],
    servesCuisine: ["Desserts", "Gaufres", "Crêpes", "Boissons"],
    menu: "https://www.kechwaffles.com/menu",
    acceptsReservations: "False",
    sameAs: [
      // Ajoutez vos réseaux sociaux ici
      // "https://www.facebook.com/kechwaffles",
      // "https://www.instagram.com/kechwaffles",
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Kech Waffles",
    image: "https://www.kechwaffles.com/images/menu-items/TransparentBlack.jpg",
    "@id": "https://www.kechwaffles.com",
    url: "https://www.kechwaffles.com",
    telephone: "+212-XXXXXXXXX", // À mettre à jour
    address: {
      "@type": "PostalAddress",
      streetAddress: "Votre adresse", // À mettre à jour
      addressLocality: "Marrakech",
      postalCode: "40000",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.6295, // À mettre à jour
      longitude: -7.9811,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "23:00",
      },
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kech Waffles",
    url: "https://www.kechwaffles.com",
    logo: "https://www.kechwaffles.com/images/menu-items/TransparentBlack.jpg",
    description:
      "Restaurant à Marrakech spécialisé en gaufres tiramisu, pancakes, milkshakes, bubble waffles et boissons gourmandes.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Votre adresse", // À mettre à jour
      addressLocality: "Marrakech",
      postalCode: "40000",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+212-XXXXXXXXX", // À mettre à jour
      contactType: "customer service",
      areaServed: "MA",
      availableLanguage: ["French", "Arabic"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  );
}
