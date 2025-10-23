# 📦 Système de Gestion des Produits & Menu PDF

## 🎯 Vue d'ensemble

Système complet de gestion des produits avec **synchronisation bidirectionnelle Loyverse** et génération automatique de PDF du menu.

---

## ✨ Fonctionnalités

### 1. 🔄 Synchronisation Loyverse
- **Import automatique** depuis Loyverse
- **Synchronisation bidirectionnelle** des prix
- **Enrichissement local** (images, descriptions)
- Modification de prix dans l'app → **mise à jour automatique dans Loyverse**

### 2. 📊 Gestion des Produits
- Liste complète des produits
- Filtrage par catégorie
- Recherche par nom/SKU
- Support des variants (tailles, options)
- Images et descriptions

### 3. 📄 Génération PDF du Menu
- **Design élégant et sobre** (noir/blanc/or)
- Page de couverture avec logo
- Organisation par catégories
- Prix actualisés automatiquement
- Format prêt à l'impression (A4)

---

## 🚀 Guide de démarrage

### Étape 1 : Reconnecter Loyverse

Le scope `ITEMS_WRITE` a été ajouté. Vous devez reconnecter Loyverse :

```bash
1. Allez sur /admin/loyverse
2. Cliquez sur "Déconnecter"
3. Cliquez sur "Reconnecter (nouveaux scopes)"
4. Autorisez les nouvelles permissions Loyverse
```

### Étape 2 : Synchroniser les produits

```bash
1. Allez sur /admin/produits
2. Cliquez sur "Sync avec Loyverse"
3. Attendez la fin de l'import (~200 produits)
4. Vérifiez que tous les produits sont importés
```

### Étape 3 : Générer le PDF

```bash
1. Sur /admin/produits
2. Cliquez sur "Générer PDF Menu"
3. Le PDF se télécharge automatiquement
```

---

## 📁 Structure des fichiers

```
app/
├── admin/
│   └── produits/
│       └── page.tsx                 # Page admin de gestion
├── api/
│   └── admin/
│       └── products/
│           ├── route.ts             # API CRUD
│           ├── [id]/route.ts        # API produit individuel
│           ├── sync-loyverse/route.ts  # Sync Loyverse
│           └── generate-pdf/route.ts   # Génération PDF

lib/
├── loyalty/
│   └── loyverse.ts                  # Fonctions API Loyverse
└── pdf/
    └── menu-pdf.tsx                 # Composant PDF React

prisma/
└── schema.prisma                    # Modèles Product & ProductVariant
```

---

## 🔧 API Routes

### GET /api/admin/products
Récupère tous les produits

**Query params:**
- `category` (optionnel) - Filtrer par catégorie
- `isActive` (optionnel) - Filtrer par statut

**Response:**
```json
{
  "products": [
    {
      "id": "...",
      "name": "Espresso",
      "sku": "ESP-001",
      "category": "Boissons - Cafés",
      "price": 15,
      "variants": [],
      "loyverseItemId": "abc123",
      ...
    }
  ]
}
```

### POST /api/admin/products/sync-loyverse
Synchronise avec Loyverse

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 200,
    "created": 150,
    "updated": 50,
    "errors": []
  }
}
```

### PUT /api/admin/products/[id]
Met à jour un produit (et sync avec Loyverse si lié)

**Body:**
```json
{
  "name": "Nouveau nom",
  "price": 20,
  "variants": [
    {
      "option1Name": "Taille",
      "option1Value": "Small",
      "price": 20,
      "loyverseVariantId": "xyz789"
    }
  ]
}
```

### GET /api/admin/products/generate-pdf
Génère et télécharge le PDF du menu

**Response:** PDF file (application/pdf)

---

## 🎨 Customisation du PDF

Le design du PDF est dans `lib/pdf/menu-pdf.tsx`.

### Modifier les couleurs

```typescript
const styles = StyleSheet.create({
  coverPage: {
    backgroundColor: "#1a1a1a", // Noir de fond
  },
  coverTitle: {
    color: "#D4AF37", // Or élégant
  },
  categoryTitle: {
    backgroundColor: "#1a1a1a",
    borderLeftColor: "#D4AF37",
  },
});
```

### Ajouter un logo

```typescript
import { Image } from "@react-pdf/renderer";

const CoverPage = () => (
  <Page size="A4" style={styles.coverPage}>
    <Image
      src="/logo-kech-waffles.png"
      style={{ width: 150, height: 150, marginBottom: 20 }}
    />
    <Text style={styles.coverTitle}>KECH WAFFLES</Text>
    ...
  </Page>
);
```

---

## 🔐 Scopes Loyverse requis

```
CUSTOMERS_READ
CUSTOMERS_WRITE
ITEMS_READ
ITEMS_WRITE    ← Nouveau scope pour modifier les prix
RECEIPTS_READ
STORES_READ
MERCHANT_READ
```

---

## 📊 Modèle de données

### Product
```prisma
model Product {
  id              String
  handle          String   @unique
  sku             String   @unique
  name            String
  category        String
  description     String?
  image           String?
  price           Float?   // null si variants
  isModifier      Boolean
  isActive        Boolean
  loyverseItemId  String?  // ID dans Loyverse
  lastSyncAt      DateTime?
  variants        ProductVariant[]
}
```

### ProductVariant
```prisma
model ProductVariant {
  id                String
  productId         String
  option1Name       String?
  option1Value      String?
  option2Name       String?
  option2Value      String?
  price             Float
  loyverseVariantId String?  // ID dans Loyverse
  isActive          Boolean
}
```

---

## 🎯 Workflow de modification de prix

```
┌─────────────────────────────────────────┐
│  Admin modifie prix dans l'interface   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  PUT /api/admin/products/[id]           │
│  • Mise à jour en DB                    │
│  • Si loyverseVariantId existe:         │
│    → updateLoyverseVariantPrice()       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Loyverse API                           │
│  PUT /variants/{id}                     │
│  { default_price: "20.00" }             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Prix mis à jour partout:               │
│  ✅ Base de données                     │
│  ✅ Loyverse (caisse)                   │
│  ✅ Menu web                            │
│  ✅ PDF généré                          │
└─────────────────────────────────────────┘
```

---

## 🐛 Dépannage

### La synchronisation échoue
```bash
# Vérifier la connexion Loyverse
curl /api/loyverse/status

# Vérifier les logs
pnpm dev
# Regarder les logs dans la console
```

### Les prix ne se mettent pas à jour dans Loyverse
```bash
# Vérifier que le produit a un loyverseItemId
# Vérifier les scopes dans /admin/loyverse
# Vérifier que ITEMS_WRITE est activé
```

### Le PDF ne se génère pas
```bash
# Vérifier que des produits existent
# Vérifier que les produits sont actifs (isActive: true)
# Vérifier les logs de l'API
```

---

## 📞 Support

Pour toute question ou problème :
1. Vérifier ce README
2. Consulter les logs serveur
3. Vérifier le statut Loyverse sur /admin/loyverse

---

## 🎉 C'est prêt !

Votre système de gestion des produits est maintenant opérationnel avec :
- ✅ Synchronisation Loyverse bidirectionnelle
- ✅ Gestion complète des produits et prix
- ✅ Génération automatique de PDF élégant
- ✅ Interface admin intuitive

**Bonne gestion ! 🚀**
