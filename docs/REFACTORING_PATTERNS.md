# 🔄 Patterns de Refactoring Complets

## ✅ Pages Déjà Terminées avec shadcn/ui

1. ✅ `/app/concours/auth/page.tsx`
2. ✅ `/app/concours/scan/page.tsx`
3. ✅ `/app/concours/pronostics/page.tsx`

---

## 📝 Imports Communs pour Toutes les Pages

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
```

---

## 🔄 Pattern 1: Header de Page avec Bouton Retour

**❌ Ancien Code:**
```tsx
<div className="flex items-center gap-4 mb-6">
  <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg">
    <svg>...</svg>
  </button>
  <div>
    <h1 className="text-3xl font-bold">Titre</h1>
    <p className="text-gray-600">Description</p>
  </div>
</div>
```

**✅ Nouveau Code:**
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <CardTitle>Titre</CardTitle>
        <CardDescription>Description</CardDescription>
      </div>
    </div>
  </CardHeader>
</Card>
```

---

## 🔄 Pattern 2: Grille de Stats (mes-pronostics)

**❌ Ancien Code:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  <div className="bg-white rounded-xl shadow-lg p-4">
    <p className="text-sm text-gray-600">Total</p>
    <p className="text-3xl font-bold">{stats.totalPronostics}</p>
  </div>
</div>
```

**✅ Nouveau Code:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  <Card>
    <CardContent className="pt-6">
      <p className="text-sm text-muted-foreground">Total</p>
      <p className="text-3xl font-bold">{stats.totalPronostics}</p>
    </CardContent>
  </Card>
</div>
```

---

## 🔄 Pattern 3: Liste de Résultats avec Badges

**❌ Ancien Code:**
```tsx
{prono.result.isExactScore && (
  <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
    🎯 Score exact (+5 pts)
  </span>
)}
```

**✅ Nouveau Code:**
```tsx
{prono.result.isExactScore && (
  <Badge variant="default" className="bg-green-100 text-green-700">
    🎯 Score exact (+5 pts)
  </Badge>
)}
```

---

## 🔄 Pattern 4: Filtres avec Tabs

**❌ Ancien Code:**
```tsx
<div className="flex gap-2 mb-6 bg-white rounded-xl p-2">
  <button
    onClick={() => setFilter("all")}
    className={`flex-1 py-2 px-4 rounded-lg ${filter === "all" ? "bg-orange-500 text-white" : "text-gray-600"}`}
  >
    Tous
  </button>
</div>
```

**✅ Nouveau Code:**
```tsx
<Tabs value={filter} onValueChange={setFilter}>
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="all">Tous ({count})</TabsTrigger>
    <TabsTrigger value="available">Disponibles ({available})</TabsTrigger>
    <TabsTrigger value="used">Utilisés ({used})</TabsTrigger>
  </TabsList>
</Tabs>
```

---

## 🔄 Pattern 5: Empty State

**❌ Ancien Code:**
```tsx
<div className="bg-white rounded-2xl shadow-xl p-12 text-center">
  <span className="text-6xl mb-4 block">🎁</span>
  <h2 className="text-2xl font-bold mb-2">Aucun lot</h2>
  <p className="text-gray-600">Description</p>
</div>
```

**✅ Nouveau Code:**
```tsx
<Card>
  <CardContent className="pt-12 pb-12 text-center">
    <span className="text-6xl mb-4 block">🎁</span>
    <CardTitle className="text-2xl mb-2">Aucun lot</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardContent>
</Card>
```

---

## 🔄 Pattern 6: Card avec Statut (mes-tickets, mes-lots)

**❌ Ancien Code:**
```tsx
<div className={`bg-white rounded-xl shadow-lg p-6 ${ticket.hasWon ? "ring-2 ring-green-400" : ""}`}>
  <div className="flex items-center justify-between mb-4">
    <span className="text-xs font-mono text-gray-500">{ticket.ticketCode}</span>
    {ticket.hasWon && (
      <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
        🎉 GAGNANT
      </span>
    )}
  </div>
</div>
```

**✅ Nouveau Code:**
```tsx
<Card className={ticket.hasWon ? "border-green-500" : ""}>
  <CardHeader>
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono text-muted-foreground">{ticket.ticketCode}</span>
      {ticket.hasWon && (
        <Badge variant="default" className="bg-green-100 text-green-700">
          🎉 GAGNANT
        </Badge>
      )}
    </div>
  </CardHeader>
  <CardContent>
    {/* Contenu */}
  </CardContent>
</Card>
```

---

## 🔄 Pattern 7: Alert Box

**❌ Ancien Code:**
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
  <h3 className="font-bold text-blue-900 mb-2">💡 Instructions</h3>
  <p className="text-sm text-blue-800">Contenu...</p>
</div>
```

**✅ Nouveau Code:**
```tsx
<Alert className="border-blue-200 bg-blue-50">
  <AlertDescription className="text-blue-900">
    <h3 className="font-bold mb-2">💡 Instructions</h3>
    <p className="text-sm">Contenu...</p>
  </AlertDescription>
</Alert>
```

---

## 🔄 Pattern 8: Progress Bar (Carte Fidélité)

**❌ Ancien Code:**
```tsx
<div className="w-full bg-gray-200 rounded-full h-3">
  <div
    className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full"
    style={{ width: `${progress}%` }}
  ></div>
</div>
```

**✅ Nouveau Code:**
```tsx
import { Progress } from "@/components/ui/progress";

<Progress value={progress} className="h-3" />
```

---

## 🔄 Pattern 9: Input avec Label

**❌ Ancien Code:**
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">Label</label>
  <input
    type="text"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
    placeholder="..."
  />
</div>
```

**✅ Nouveau Code:**
```tsx
<div className="space-y-2">
  <Label htmlFor="field-id">Label</Label>
  <Input
    id="field-id"
    type="text"
    placeholder="..."
  />
</div>
```

---

## 🔄 Pattern 10: Loading State

**❌ Ancien Code:**
```tsx
<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
```

**✅ Nouveau Code:**
```tsx
<Loader2 className="h-16 w-16 animate-spin text-orange-500" />
```

---

## 📄 Refactoring Complet par Page

### Page: `/app/concours/mes-pronostics/page.tsx`

**Changements principaux:**
1. Header avec bouton retour → Pattern 1
2. Grille de stats (6 cards) → Pattern 2
3. Liste des pronostics avec badges → Pattern 3
4. Empty state → Pattern 5

### Page: `/app/concours/classement/page.tsx`

**Changements principaux:**
1. Card utilisateur avec gradient (garder gradient custom)
2. Podium (3 cards avec gradients spéciaux)
3. Liste classement → utiliser `Card` pour chaque entrée
4. Alert pour les lots → Pattern 7

### Page: `/app/concours/mes-tickets/page.tsx`

**Changements principaux:**
1. Alert info en haut → Pattern 7
2. Filtres → Pattern 4 (Tabs)
3. Liste tickets → Pattern 6
4. Empty state → Pattern 5

### Page: `/app/concours/mes-lots/page.tsx`

**Changements principaux:**
1. Summary card avec stats
2. Filtres → Pattern 4
3. Cards de lots avec QR code → Pattern 6
4. Alert expiration → Pattern 7
5. Alert instructions → Pattern 7

### Page: `/app/loyalty/card/page.tsx`

**Changements principaux:**
1. Card membre (garder gradient custom pour les tiers)
2. Progress bar vers prochain tier → Pattern 8
3. Liste des avantages → `Card` + liste
4. Alert instructions → Pattern 7

### Pages Admin: `/app/admin/qr-code/page.tsx` & `/app/admin/verify-ticket/page.tsx`

**Changements principaux:**
1. Headers → `Card` + `CardHeader`
2. Boutons d'actions → `Button` avec variants
3. Inputs admin → Pattern 9
4. Cards de résultat → Pattern 6

---

## ✅ Checklist de Refactoring par Page

Pour chaque page à refactoriser:

- [ ] Remplacer tous les `<div className="bg-white ...">` par `<Card>`
- [ ] Remplacer les titres par `<CardTitle>`
- [ ] Remplacer les descriptions par `<CardDescription>`
- [ ] Remplacer tous les `<button>` par `<Button>` avec variant approprié
- [ ] Remplacer tous les `<input>` par `<Input>` + `<Label>`
- [ ] Remplacer les badges custom par `<Badge>`
- [ ] Remplacer les tabs custom par `<Tabs>`
- [ ] Remplacer les alerts custom par `<Alert>`
- [ ] Remplacer les spinners par `<Loader2>`
- [ ] Ajouter icônes Lucide où nécessaire
- [ ] Tester la page

---

## 🎨 Variants de Badge à Utiliser

```tsx
// Statuts positifs
<Badge variant="default">Disponible</Badge>
<Badge className="bg-green-100 text-green-700">Gagnant</Badge>

// Statuts neutres
<Badge variant="secondary">En attente</Badge>
<Badge variant="outline">Phase de poules</Badge>

// Statuts négatifs
<Badge variant="destructive">Expiré</Badge>
<Badge className="bg-red-100 text-red-700">Manqué</Badge>
```

---

## 🎨 Variants de Button à Utiliser

```tsx
// Actions principales
<Button>Action Principale</Button>

// Actions secondaires
<Button variant="outline">Secondaire</Button>

// Actions tertiaires
<Button variant="ghost">Tertiaire</Button>

// Actions destructives
<Button variant="destructive">Supprimer</Button>

// Bouton icône seul
<Button variant="ghost" size="icon">
  <ArrowLeft className="h-4 w-4" />
</Button>
```

---

**Suivez ces patterns et toutes vos pages auront un design cohérent et professionnel! 🎨✨**
