# Intégration Apple Wallet & Google Wallet

Ce document explique comment implémenter complètement l'ajout de la carte de membre au Apple Wallet et Google Wallet.

## État actuel

✅ **Implémenté:**
- Logo Kech Waffles sur la carte
- Téléchargement de la carte en PNG (html2canvas)
- Bouton "Ajouter au Wallet" (placeholder)

⏳ **À implémenter:**
- Génération de fichiers .pkpass (Apple Wallet)
- Intégration API Google Wallet Pass

---

## Apple Wallet (.pkpass)

### Prérequis

1. **Compte Apple Developer** ($99/an)
2. **Pass Type ID Certificate** depuis Apple Developer Portal
3. **Certificat et clé privée** (.pem files)

### Installation des dépendances

```bash
pnpm add passkit-generator
```

### Étapes d'implémentation

#### 1. Créer un Pass Type ID

1. Va sur [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/passTypeId)
2. Crée un nouveau "Pass Type ID" (ex: `pass.com.kechwaffles.loyalty`)
3. Télécharge le certificat
4. Convertis le certificat en format .pem:

```bash
openssl pkcs12 -in Certificates.p12 -out certificate.pem -clcerts -nokeys
openssl pkcs12 -in Certificates.p12 -out key.pem -nocerts -nodes
```

#### 2. Créer l'API route

Crée `/app/api/loyalty/wallet/apple/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { PKPass } from "passkit-generator";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  // Récupérer les données de la carte depuis la DB
  const card = await prisma.memberCard.findUnique({
    where: { userId },
    include: { user: true },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  try {
    const pass = await PKPass.from({
      model: path.resolve("./passkit/loyalty.pass"),
      certificates: {
        wwdr: fs.readFileSync("./passkit/certs/wwdr.pem"),
        signerCert: fs.readFileSync("./passkit/certs/certificate.pem"),
        signerKey: fs.readFileSync("./passkit/certs/key.pem"),
        signerKeyPassphrase: process.env.PASS_CERTIFICATE_PASSWORD,
      },
    }, {
      serialNumber: card.cardNumber,
      description: "Carte Fidélité Kech Waffles",
      organizationName: "Kech Waffles",
      passTypeIdentifier: "pass.com.kechwaffles.loyalty",
      teamIdentifier: process.env.APPLE_TEAM_ID,
    });

    // Personnaliser le pass
    pass.primaryFields.push({
      key: "points",
      label: "Points",
      value: card.currentPoints.toString(),
    });

    pass.secondaryFields.push({
      key: "tier",
      label: "Niveau",
      value: card.tier,
    });

    pass.auxiliaryFields.push({
      key: "member-name",
      label: "Membre",
      value: card.user.name,
    });

    pass.barcodes = [{
      format: "PKBarcodeFormatQR",
      message: card.qrCode,
      messageEncoding: "iso-8859-1",
    }];

    const buffer = pass.getAsBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="kech-waffles-${card.cardNumber}.pkpass"`,
      },
    });
  } catch (error) {
    console.error("Error generating Apple Wallet pass:", error);
    return NextResponse.json({ error: "Failed to generate pass" }, { status: 500 });
  }
}
```

#### 3. Structure du dossier passkit

```
passkit/
├── loyalty.pass/
│   ├── pass.json           # Configuration du pass
│   ├── logo.png           # Logo (160x50px)
│   ├── logo@2x.png        # Logo retina (320x100px)
│   ├── icon.png           # Icône (29x29px)
│   ├── icon@2x.png        # Icône retina (58x58px)
│   └── strip.png          # Image de fond (375x123px)
└── certs/
    ├── wwdr.pem           # Apple WWDR certificate
    ├── certificate.pem    # Ton certificat
    └── key.pem            # Ta clé privée
```

#### 4. Fichier pass.json

```json
{
  "formatVersion": 1,
  "passTypeIdentifier": "pass.com.kechwaffles.loyalty",
  "serialNumber": "placeholder",
  "teamIdentifier": "YOUR_TEAM_ID",
  "organizationName": "Kech Waffles",
  "description": "Carte Fidélité Kech Waffles",
  "logoText": "Kech Waffles",
  "foregroundColor": "rgb(255, 255, 255)",
  "backgroundColor": "rgb(251, 146, 60)",
  "storeCard": {
    "headerFields": [],
    "primaryFields": [],
    "secondaryFields": [],
    "auxiliaryFields": [],
    "backFields": [
      {
        "key": "terms",
        "label": "CONDITIONS",
        "value": "Carte valable uniquement à Kech Waffles Marrakech. Points cumulables sur tous les achats."
      }
    ]
  }
}
```

#### 5. Mettre à jour le client

```typescript
async function addToWallet() {
  try {
    const response = await fetch(`/api/loyalty/wallet/apple?userId=${session?.user?.id}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kech-waffles-${card?.cardNumber}.pkpass`;
    a.click();
  } catch (error) {
    console.error("Error adding to Apple Wallet:", error);
    alert("Erreur lors de l'ajout au wallet");
  }
}
```

---

## Google Wallet

### Prérequis

1. **Compte Google Cloud** (gratuit)
2. **API Google Wallet activée**
3. **Service Account** avec clé JSON

### Installation

```bash
pnpm add googleapis
```

### Étapes d'implémentation

#### 1. Créer un Service Account

1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. Crée un projet ou sélectionne un existant
3. Active l'API "Google Wallet API"
4. Crée un Service Account
5. Télécharge la clé JSON

#### 2. Créer une Loyalty Class

```typescript
// lib/google-wallet.ts
import { google } from "googleapis";

const credentials = JSON.parse(process.env.GOOGLE_WALLET_SERVICE_ACCOUNT!);

async function createLoyaltyClass() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
  });

  const client = await auth.getClient();
  const walletobjects = google.walletobjects({
    version: "v1",
    auth: client,
  });

  const classId = `${credentials.project_id}.kech_waffles_loyalty`;

  const loyaltyClass = {
    id: classId,
    issuerName: "Kech Waffles",
    programName: "Programme Fidélité",
    programLogo: {
      sourceUri: {
        uri: "https://www.kechwaffles.com/images/menu-items/TransparentBlack.jpg",
      },
    },
    reviewStatus: "UNDER_REVIEW",
    hexBackgroundColor: "#fb923c",
    localizedIssuerName: {
      defaultValue: {
        language: "fr",
        value: "Kech Waffles",
      },
    },
  };

  try {
    await walletobjects.loyaltyclass.insert({
      requestBody: loyaltyClass,
    });
  } catch (error) {
    console.error("Error creating loyalty class:", error);
  }
}
```

#### 3. Créer l'API route

```typescript
// app/api/loyalty/wallet/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  const card = await prisma.memberCard.findUnique({
    where: { userId },
    include: { user: true },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const credentials = JSON.parse(process.env.GOOGLE_WALLET_SERVICE_ACCOUNT!);
  const classId = `${credentials.project_id}.kech_waffles_loyalty`;
  const objectId = `${classId}.${card.cardNumber}`;

  const loyaltyObject = {
    id: objectId,
    classId: classId,
    state: "ACTIVE",
    accountName: card.user.name,
    accountId: card.cardNumber,
    barcode: {
      type: "QR_CODE",
      value: card.qrCode,
    },
    loyaltyPoints: {
      label: "Points",
      balance: {
        int: card.currentPoints,
      },
    },
  };

  // Créer le JWT
  const claims = {
    iss: credentials.client_email,
    aud: "google",
    origins: ["https://www.kechwaffles.com"],
    typ: "savetowallet",
    payload: {
      loyaltyObjects: [loyaltyObject],
    },
  };

  const token = jwt.sign(claims, credentials.private_key, {
    algorithm: "RS256",
  });

  const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

  return NextResponse.json({ url: saveUrl });
}
```

#### 4. Mettre à jour le client

```typescript
async function addToWallet() {
  // Détecter le système d'exploitation
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isIOS) {
    // Apple Wallet
    const response = await fetch(`/api/loyalty/wallet/apple?userId=${session?.user?.id}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kech-waffles-${card?.cardNumber}.pkpass`;
    a.click();
  } else if (isAndroid) {
    // Google Wallet
    const response = await fetch(`/api/loyalty/wallet/google?userId=${session?.user?.id}`);
    const data = await response.json();
    window.location.href = data.url;
  } else {
    alert("Wallet non supporté sur ce système");
  }
}
```

---

## Variables d'environnement

Ajoute dans `.env.local` et sur Vercel:

```env
# Apple Wallet
APPLE_TEAM_ID=YOUR_TEAM_ID
PASS_CERTIFICATE_PASSWORD=your_cert_password

# Google Wallet
GOOGLE_WALLET_SERVICE_ACCOUNT='{...json content...}'
```

---

## Ressources

- [Apple Wallet Developer](https://developer.apple.com/wallet/)
- [Google Wallet API](https://developers.google.com/wallet)
- [passkit-generator NPM](https://www.npmjs.com/package/passkit-generator)
- [Google Wallet Codelab](https://codelabs.developers.google.com/add-to-wallet-web)

---

## Notes importantes

1. **Apple Wallet** nécessite un certificat valide et un compte Developer payant
2. **Google Wallet** est gratuit mais nécessite une validation Google
3. Les deux plateformes peuvent prendre plusieurs jours pour la validation
4. Testez d'abord avec des passes de test avant de passer en production
