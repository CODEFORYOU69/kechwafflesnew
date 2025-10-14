/**
 * Utilitaires de cryptage pour les codes QR
 * Utilise Web Crypto API avec AES-GCM
 */

const SALT_LENGTH = 16;
const IV_LENGTH = 12;

/**
 * Génère une clé de cryptage à partir d'un mot de passe et d'un salt
 */
async function deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Importer le mot de passe comme clé
  const baseKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  // Dériver une clé AES-GCM
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Crypte un code QR avec un mot de passe et un salt aléatoire
 */
export async function encryptQRCode(code: string): Promise<string> {
  try {
    // Générer un mot de passe unique pour cette session
    const sessionPassword = crypto.randomUUID();

    // Générer un salt aléatoire
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

    // Générer un IV (Initialization Vector) aléatoire
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Dériver la clé de cryptage
    const key = await deriveKey(sessionPassword, salt);

    // Encoder le code en bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(code);

    // Crypter avec AES-GCM
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      data
    );

    // Combiner salt + iv + données cryptées
    const encryptedArray = new Uint8Array(encryptedData);
    const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(encryptedArray, salt.length + iv.length);

    // Convertir en base64 pour le stockage
    const base64Encrypted = btoa(String.fromCharCode(...combined));

    // Stocker le mot de passe en mémoire seulement (pas de stockage persistant)
    sessionStorage.setItem("_qr_key", sessionPassword);

    return base64Encrypted;
  } catch (error) {
    console.error("Erreur cryptage QR:", error);
    throw new Error("Impossible de crypter le code QR");
  }
}

/**
 * Décrypte un code QR crypté
 */
export async function decryptQRCode(encryptedCode: string): Promise<string> {
  try {
    // Récupérer le mot de passe de session
    const sessionPassword = sessionStorage.getItem("_qr_key");
    if (!sessionPassword) {
      throw new Error("Clé de session manquante");
    }

    // Convertir base64 en bytes
    const combined = Uint8Array.from(atob(encryptedCode), (c) => c.charCodeAt(0));

    // Extraire salt, iv et données cryptées
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encryptedData = combined.slice(SALT_LENGTH + IV_LENGTH);

    // Dériver la clé de décryptage
    const key = await deriveKey(sessionPassword, salt);

    // Décrypter
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedData
    );

    // Décoder les bytes en string
    const decoder = new TextDecoder();
    const code = decoder.decode(decryptedData);

    // Nettoyer la clé de session après utilisation
    sessionStorage.removeItem("_qr_key");

    return code;
  } catch (error) {
    console.error("Erreur décryptage QR:", error);
    // Nettoyer la clé en cas d'erreur
    sessionStorage.removeItem("_qr_key");
    throw new Error("Impossible de décrypter le code QR");
  }
}

/**
 * Stocke un code QR crypté en sessionStorage
 */
export async function storeEncryptedQRCode(code: string, key: string): Promise<void> {
  const encrypted = await encryptQRCode(code);
  sessionStorage.setItem(key, encrypted);
}

/**
 * Récupère et décrypte un code QR depuis sessionStorage
 */
export async function retrieveEncryptedQRCode(key: string): Promise<string | null> {
  const encrypted = sessionStorage.getItem(key);
  if (!encrypted) {
    return null;
  }

  try {
    const decrypted = await decryptQRCode(encrypted);
    // Nettoyer après récupération
    sessionStorage.removeItem(key);
    return decrypted;
  } catch {
    // Nettoyer en cas d'erreur
    sessionStorage.removeItem(key);
    return null;
  }
}
