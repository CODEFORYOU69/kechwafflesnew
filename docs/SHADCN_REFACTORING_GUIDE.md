# 🎨 Guide de Refactoring avec shadcn/ui

## ✅ Pages Déjà Refactorisées

### 1. `/app/concours/auth/page.tsx` ✅
**Composants utilisés:**
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Button` (variants: default, outline)
- `Input`
- `Label`
- `Badge`

---

### 2. `/app/concours/scan/page.tsx` ✅
**Composants utilisés:**
- `Card`, `CardContent`, `CardTitle`, `CardDescription`
- `Button`
- `Badge`
- Icônes Lucide: `CheckCircle2`, `XCircle`, `Loader2`

---

## 📋 Pages à Refactoriser

### 3. `/app/concours/pronostics/page.tsx`

**Remplacer:**
```tsx
// ❌ AVANT
<div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
  <h1>🏆 Pronostics CAN 2025</h1>
  <p>Pronostiquez les scores et gagnez des lots !</p>
</div>

// ✅ APRÈS
<Card>
  <CardHeader>
    <CardTitle>🏆 Pronostics CAN 2025</CardTitle>
    <CardDescription>Pronostiquez les scores et gagnez des lots !</CardDescription>
  </CardHeader>
</Card>
```

**Composants à utiliser:**
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Button` (variant="default" pour "Faire mon pronostic")
- `Badge` pour les statuts (Phase de poules, En attente, etc.)
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` pour le modal de pronostic
- `Input` type="number" pour les scores
- `Label` pour les labels de formulaire

**Modal de pronostic:**
```tsx
<Dialog open={!!selectedMatch} onOpenChange={() => closeModal()}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Votre pronostic</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4">
      <div>
        <Label>Score domicile</Label>
        <Input type="number" value={homeScore} onChange={...} />
      </div>
      {/* ... */}
      <Button onClick={submitPronostic}>Valider</Button>
    </div>
  </DialogContent>
</Dialog>
```

---

### 4. `/app/concours/mes-pronostics/page.tsx`

**Composants à utiliser:**
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button` avec icône de retour (Lucide `ArrowLeft`)
- `Badge` pour les résultats (Score exact, Bon résultat, Manqué)
- Grille de cartes de stats

**Stats Cards:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  <Card>
    <CardContent className="pt-6">
      <p className="text-sm text-muted-foreground">Total</p>
      <p className="text-3xl font-bold">{stats.totalPronostics}</p>
    </CardContent>
  </Card>
  {/* ... */}
</div>
```

---

### 5. `/app/concours/classement/page.tsx`

**Composants à utiliser:**
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button`
- `Badge` pour le rang de l'utilisateur
- `Separator` entre les entrées du classement

**Card utilisateur:**
```tsx
<Card className="border-orange-500 bg-orange-50">
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Votre classement</p>
        <p className="text-4xl font-bold">#{userRank.rank}</p>
      </div>
      <Badge variant="default">
        {userRank.totalPoints} points
      </Badge>
    </div>
  </CardContent>
</Card>
```

---

### 6. `/app/concours/mes-tickets/page.tsx`

**Composants à utiliser:**
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` pour les filtres
- `Badge` pour les statuts (GAGNANT, RÉCLAMÉ, EN COURS)
- `Button`

**Filtres avec Tabs:**
```tsx
<Tabs defaultValue="all" onValueChange={setFilter}>
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="all">Tous ({tickets.length})</TabsTrigger>
    <TabsTrigger value="waiting">En attente ({waitingCount})</TabsTrigger>
    <TabsTrigger value="winners">Gagnants ({winnersCount})</TabsTrigger>
  </TabsList>
</Tabs>
```

---

### 7. `/app/concours/mes-lots/page.tsx`

**Composants à utiliser:**
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Tabs` pour les filtres (Tous, Disponibles, Utilisés)
- `Badge` pour les statuts
- `Button`

**Lot avec QR Code:**
```tsx
<Card className={isAvailable ? "border-orange-500" : ""}>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>{getTypeLabel(reward.type)}</CardTitle>
      <Badge variant={isAvailable ? "default" : "secondary"}>
        {isAvailable ? "DISPONIBLE" : "UTILISÉ"}
      </Badge>
    </div>
    <CardDescription>{reward.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <img src={qrCodes[reward.id]} alt="QR Code" />
  </CardContent>
</Card>
```

---

### 8. `/app/loyalty/card/page.tsx`

**Composants à utiliser:**
- `Card` (avec gradients pour les tiers)
- `Badge` pour le tier
- `Button`

**Carte membre:**
```tsx
<Card className="bg-gradient-to-br from-orange-600 to-amber-700 text-white">
  <CardHeader>
    <div className="flex justify-between">
      <CardTitle>KECH WAFFLES</CardTitle>
      <Badge variant="secondary">{tierInfo.name}</Badge>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-mono">{card.cardNumber}</p>
    <img src={card.qrCode} className="w-32 h-32 bg-white rounded p-2" />
  </CardContent>
</Card>
```

---

### 9. `/app/admin/qr-code/page.tsx`

**Composants à utiliser:**
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button` (variants: default, outline, destructive)
- `Badge`
- Icônes Lucide: `Download`, `Printer`, `RefreshCw`

**Actions:**
```tsx
<div className="flex flex-col gap-3">
  <Button onClick={downloadQR} variant="default">
    <Download className="mr-2 h-4 w-4" />
    Télécharger PNG
  </Button>
  <Button onClick={printQR} variant="outline">
    <Printer className="mr-2 h-4 w-4" />
    Imprimer
  </Button>
  <Button onClick={generateNewQR} variant="secondary">
    <RefreshCw className="mr-2 h-4 w-4" />
    Régénérer
  </Button>
</div>
```

---

### 10. `/app/admin/verify-ticket/page.tsx`

**Composants à utiliser:**
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Input` pour le code ticket
- `Label`
- `Button`
- `Badge`

**Scanner:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>✅ Vérification Tickets</CardTitle>
    <CardDescription>Vérifier et valider les tickets gagnants</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div>
        <Label>Code Ticket (BUT-XXXXXX)</Label>
        <Input
          value={ticketCode}
          onChange={(e) => setTicketCode(e.target.value)}
          placeholder="BUT-ABC123"
        />
      </div>
      <Button onClick={verifyTicket} className="w-full">
        Vérifier
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## 🎨 Palette de Couleurs avec shadcn/ui

### Variants de Button
- `default` - Orange (action principale)
- `outline` - Blanc avec bordure
- `secondary` - Gris
- `destructive` - Rouge (actions dangereuses)
- `ghost` - Transparent

### Variants de Badge
- `default` - Orange
- `secondary` - Gris
- `outline` - Avec bordure
- `destructive` - Rouge

---

## 📦 Composants Manquants à Installer

Si nécessaire, installez ces composants supplémentaires :

```bash
# Progress bar (pour progression tier fidélité)
npx shadcn@latest add progress

# Alert (pour messages d'avertissement)
npx shadcn@latest add alert

# Avatar (pour photos utilisateurs)
npx shadcn@latest add avatar

# Scroll Area (pour listes longues)
npx shadcn@latest add scroll-area
```

---

## 🔄 Pattern de Remplacement Systématique

### 1. Headers de Page
```tsx
// ❌ AVANT
<div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-800 mb-2">Titre</h1>
  <p className="text-gray-600">Description</p>
</div>

// ✅ APRÈS
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
</Card>
```

### 2. Boutons
```tsx
// ❌ AVANT
<button
  onClick={handleClick}
  className="bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600"
>
  Cliquer
</button>

// ✅ APRÈS
<Button onClick={handleClick}>
  Cliquer
</Button>
```

### 3. Inputs
```tsx
// ❌ AVANT
<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
  placeholder="Entrez..."
/>

// ✅ APRÈS
<div className="space-y-2">
  <Label htmlFor="field">Label</Label>
  <Input
    id="field"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Entrez..."
  />
</div>
```

### 4. Badges de Statut
```tsx
// ❌ AVANT
<span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
  DISPONIBLE
</span>

// ✅ APRÈS
<Badge variant="default">DISPONIBLE</Badge>
<Badge variant="secondary">UTILISÉ</Badge>
<Badge variant="destructive">EXPIRÉ</Badge>
```

### 5. Cards de Contenu
```tsx
// ❌ AVANT
<div className="bg-white rounded-xl shadow-lg p-6">
  <h3>Titre</h3>
  <p>Contenu</p>
</div>

// ✅ APRÈS
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Contenu</p>
  </CardContent>
</Card>
```

---

## ✅ Checklist de Refactoring

Pour chaque page :

- [ ] Remplacer tous les `<div className="bg-white ...">` par `<Card>`
- [ ] Remplacer tous les `<h1>`, `<h2>` par `<CardTitle>`
- [ ] Remplacer tous les `<p className="text-gray-600">` par `<CardDescription>`
- [ ] Remplacer tous les `<button>` par `<Button>`
- [ ] Remplacer tous les `<input>` par `<Input>` avec `<Label>`
- [ ] Remplacer les modals custom par `<Dialog>`
- [ ] Remplacer les tabs custom par `<Tabs>`
- [ ] Remplacer les badges custom par `<Badge>`
- [ ] Ajouter les icônes Lucide React où nécessaire
- [ ] Tester la page après refactoring

---

## 🚀 Avantages du Refactoring

✅ **Cohérence** : Design uniforme dans toute l'app
✅ **Accessibilité** : Composants accessibles ARIA par défaut
✅ **Maintenabilité** : Code plus propre et facile à modifier
✅ **Thème** : Support automatique du mode sombre (si activé)
✅ **Performance** : Composants optimisés
✅ **Responsive** : Meilleure gestion mobile

---

**Toutes les pages suivront ce pattern pour un design professionnel et cohérent ! 🎨**
