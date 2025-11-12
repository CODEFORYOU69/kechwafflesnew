"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  RefreshCw,
  Loader2,
  Edit,
  Trash2,
  Search,
  FileDown,
  ShoppingBag,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ProductVariant = {
  id: string;
  option1Name: string | null;
  option1Value: string | null;
  option2Name: string | null;
  option2Value: string | null;
  price: number;
  variantSku: string | null;
  loyverseVariantId: string | null;
  isActive: boolean;
};

type Product = {
  id: string;
  handle: string;
  sku: string;
  name: string;
  category: string;
  description: string | null;
  image: string | null;
  price: number | null;
  isModifier: boolean;
  hasTax: boolean;
  isActive: boolean;
  outOfStock: boolean;
  displayOrder: number;
  loyverseItemId: string | null;
  lastSyncAt: string | null;
  syncSource: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export default function ProduitsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [generatingPDFGlovo, setGeneratingPDFGlovo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editedVariants, setEditedVariants] = useState<ProductVariant[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/admin/products");

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        setError("Erreur lors du chargement des produits");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncLoyverse = async () => {
    if (!confirm("Synchroniser tous les produits depuis Loyverse ? Cela peut prendre quelques minutes.")) {
      return;
    }

    try {
      setSyncing(true);
      const response = await fetch("/api/admin/products/sync-loyverse", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `✅ Synchronisation terminée !\n\n` +
          `Total: ${data.stats.total}\n` +
          `Créés: ${data.stats.created}\n` +
          `Mis à jour: ${data.stats.updated}\n` +
          `Erreurs: ${data.stats.errors.length}\n\n` +
          (data.errors.length > 0 ? `Erreurs:\n${data.errors.slice(0, 3).join("\n")}` : "")
        );
        fetchProducts();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.message || "Impossible de synchroniser"}`);
      }
    } catch {
      alert("Erreur lors de la synchronisation");
    } finally {
      setSyncing(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);

      // Ouvrir l'URL dans un nouvel onglet pour télécharger le PDF
      window.open("/api/admin/products/generate-pdf", "_blank");

      // Attendre un peu pour l'effet de chargement
      setTimeout(() => {
        setGeneratingPDF(false);
      }, 2000);
    } catch {
      alert("Erreur lors de la génération du PDF");
      setGeneratingPDF(false);
    }
  };

  const handleGeneratePDFGlovo = async () => {
    try {
      setGeneratingPDFGlovo(true);

      // Ouvrir l'URL dans un nouvel onglet pour télécharger le PDF Glovo
      window.open("/api/admin/products/generate-pdf-glovo", "_blank");

      // Attendre un peu pour l'effet de chargement
      setTimeout(() => {
        setGeneratingPDFGlovo(false);
      }, 2000);
    } catch {
      alert("Erreur lors de la génération du PDF Glovo");
      setGeneratingPDFGlovo(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtrer par catégorie
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  };

  const getCategories = () => {
    const categories = new Set(products.map((p) => p.category));
    return Array.from(categories).sort();
  };

  const getDisplayPrice = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map((v) => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) {
        return `${min.toFixed(0)} Dh`;
      }
      return `${min.toFixed(0)} - ${max.toFixed(0)} Dh`;
    }
    return product.price ? `${product.price.toFixed(0)} Dh` : "N/A";
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditedVariants([...product.variants]);
    setEditDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleVariantPriceChange = (variantId: string, newPrice: number) => {
    setEditedVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, price: newPrice } : v))
    );
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variants: editedVariants.map((v) => ({
            option1Name: v.option1Name,
            option1Value: v.option1Value,
            option2Name: v.option2Name,
            option2Value: v.option2Value,
            price: v.price,
            variantSku: v.variantSku,
            loyverseVariantId: v.loyverseVariantId,
            isActive: v.isActive,
          })),
        }),
      });

      if (response.ok) {
        alert("✅ Produit mis à jour avec succès !");
        setEditDialogOpen(false);
        fetchProducts();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.error || "Impossible de sauvegarder"}`);
      }
    } catch {
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("✅ Produit supprimé avec succès !");
        setDeleteDialogOpen(false);
        fetchProducts();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.error || "Impossible de supprimer"}`);
      }
    } catch {
      alert("Erreur lors de la suppression");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOutOfStock = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outOfStock: !product.outOfStock,
        }),
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.error || "Impossible de modifier le statut"}`);
      }
    } catch {
      alert("Erreur lors de la modification");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !product.isActive,
        }),
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.error || "Impossible de modifier le statut"}`);
      }
    } catch {
      alert("Erreur lors de la modification");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
            Gestion des Produits
          </h1>
          <p className="text-gray-600">Gérez votre menu et synchronisez avec Loyverse</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Synchronisez avec Loyverse ou générez le PDF du menu
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={handleSyncLoyverse}
            disabled={syncing}
            className="bg-gradient-to-r from-green-600 via-amber-500 to-red-600"
          >
            {syncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Synchronisation...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync avec Loyverse
              </>
            )}
          </Button>

          <Button
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            variant="outline"
          >
            {generatingPDF ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Générer PDF Menu
              </>
            )}
          </Button>

          <Button
            onClick={handleGeneratePDFGlovo}
            disabled={generatingPDFGlovo}
            variant="outline"
          >
            {generatingPDFGlovo ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Générer PDF Glovo
              </>
            )}
          </Button>

          <Button onClick={fetchProducts} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>

          <div className="ml-auto">
            <Badge variant="secondary">
              {products.length} produits
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre par catégorie */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white"
            >
              <option value="all">Toutes les catégories</option>
              {getCategories().map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <Card>
        <CardHeader>
          <CardTitle>Produits ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Sync</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {searchQuery || selectedCategory !== "all"
                        ? "Aucun produit trouvé"
                        : "Aucun produit. Synchronisez avec Loyverse pour commencer."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image ? (
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                            <Image
                              src={`/images/menu-items/${product.image}`}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                            N/A
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {product.category.split(" - ").pop()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {getDisplayPrice(product)}
                      </TableCell>
                      <TableCell>
                        {product.variants.length > 0 ? (
                          <Badge variant="secondary">{product.variants.length}</Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.isActive ? (
                          <Badge className="bg-green-600">Actif</Badge>
                        ) : (
                          <Badge variant="destructive">Inactif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.loyverseItemId ? (
                          <Badge className="bg-blue-600">
                            Loyverse
                          </Badge>
                        ) : (
                          <Badge variant="outline">Manuel</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleOutOfStock(product)}
                            className={product.outOfStock ? "bg-orange-50 border-orange-300" : ""}
                            title={product.outOfStock ? "Remettre en stock" : "Marquer victime de son succès"}
                          >
                            <ShoppingBag className={`h-4 w-4 ${product.outOfStock ? "text-orange-600" : ""}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(product)}
                            className={!product.isActive ? "bg-gray-100" : ""}
                            title={product.isActive ? "Masquer du menu" : "Afficher sur le menu"}
                          >
                            {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-gray-500" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les prix des variants. Les changements seront synchronisés avec Loyverse.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Product Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {selectedProduct.image && (
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image
                      src={`/images/menu-items/${selectedProduct.image}`}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedProduct.category}
                  </Badge>
                </div>
              </div>

              {/* Variants Pricing */}
              <div className="space-y-3">
                <h4 className="font-medium">Prix des variants</h4>
                {editedVariants.map((variant) => (
                  <div key={variant.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {variant.option1Name && variant.option1Value && (
                          <span>
                            {variant.option1Name}: {variant.option1Value}
                          </span>
                        )}
                        {variant.option2Name && variant.option2Value && (
                          <span className="ml-2">
                            | {variant.option2Name}: {variant.option2Value}
                          </span>
                        )}
                        {!variant.option1Name && "Prix standard"}
                      </div>
                      {variant.variantSku && (
                        <div className="text-xs text-gray-500 font-mono">
                          {variant.variantSku}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantPriceChange(variant.id, parseFloat(e.target.value))
                        }
                        className="w-24"
                      />
                      <span className="text-sm font-medium">Dh</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={saving}
              className="bg-gradient-to-r from-green-600 via-amber-500 to-red-600"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
              {selectedProduct.image && (
                <div className="relative w-16 h-16 rounded overflow-hidden">
                  <Image
                    src={`/images/menu-items/${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
