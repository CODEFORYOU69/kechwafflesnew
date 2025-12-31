const supplementsSales = [
  "extra jambon",
  "extra mozzarella",
  "extra olives",
  "extra pepperoni",
  "extra poulet",
  "extra thon",
  "extra viande hachée",
  "extra viande hachee",
  "fromage cheddar",
  "oignons caramélisés",
  "oignons caramelises",
  "sauce gruyère lyonnaise",
  "sauce gruyere lyonnaise",
  "sauce harissa",
  "sauce mayo",
  "sauce pesto",
  "saucisse extra",
  "fromage mozzarella",
];

const productName = "Oignons Caramélisés";
const productNameLower = productName.toLowerCase();

console.log(`Test de détection pour: "${productName}"`);
console.log(`En minuscules: "${productNameLower}"`);
console.log();

const isSale = supplementsSales.some(supplement => {
  const matches = productNameLower.includes(supplement);
  console.log(`  "${supplement}" -> ${matches ? "✅ MATCH" : "❌ no match"}`);
  return matches;
});

console.log();
console.log(`Résultat final: ${isSale ? "✅ SALÉ" : "❌ SUCRÉ"}`);
