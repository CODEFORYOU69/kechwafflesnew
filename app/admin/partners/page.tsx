"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Pencil, Trash2, Building2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PartnerTier = "PREMIUM" | "GOLD" | "SILVER" | "BRONZE";

interface Partner {
  id: string;
  name: string;
  description: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  tier: PartnerTier;
  prizeTitle: string;
  prizeDescription?: string;
  prizeValue?: number;
  prizeImage?: string;
  prizeQuantity: number;
  isActive: boolean;
  isVisible: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    tier: "BRONZE" as PartnerTier,
    prizeTitle: "",
    prizeDescription: "",
    prizeValue: "",
    prizeImage: "",
    prizeQuantity: "1",
    isActive: true,
    isVisible: true,
    displayOrder: "0",
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/admin/partners");
      if (response.ok) {
        const data = await response.json();
        setPartners(data.partners);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingPartner
      ? `/api/admin/partners/${editingPartner.id}`
      : "/api/admin/partners";

    const method = editingPartner ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPartners();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving partner:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce partenaire ?")) return;

    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchPartners();
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      description: partner.description,
      logo: partner.logo || "",
      address: partner.address || "",
      phone: partner.phone || "",
      email: partner.email || "",
      website: partner.website || "",
      tier: partner.tier,
      prizeTitle: partner.prizeTitle,
      prizeDescription: partner.prizeDescription || "",
      prizeValue: partner.prizeValue?.toString() || "",
      prizeImage: partner.prizeImage || "",
      prizeQuantity: partner.prizeQuantity.toString(),
      isActive: partner.isActive,
      isVisible: partner.isVisible,
      displayOrder: partner.displayOrder.toString(),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      tier: "BRONZE",
      prizeTitle: "",
      prizeDescription: "",
      prizeValue: "",
      prizeImage: "",
      prizeQuantity: "1",
      isActive: true,
      isVisible: true,
      displayOrder: "0",
    });
    setEditingPartner(null);
    setShowForm(false);
  };

  const getTierBadgeColor = (tier: PartnerTier) => {
    switch (tier) {
      case "PREMIUM":
        return "bg-purple-500 text-white";
      case "GOLD":
        return "bg-yellow-500 text-white";
      case "SILVER":
        return "bg-gray-400 text-white";
      case "BRONZE":
        return "bg-amber-700 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
                Gestion des Partenaires
              </h1>
              <p className="text-gray-600">Commerçants de votre rue</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau partenaire
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingPartner ? "Modifier le partenaire" : "Nouveau partenaire"}
              </CardTitle>
              <CardDescription>
                Renseignez les informations du commerce partenaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom du commerce *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tier">Niveau de partenariat</Label>
                    <Select
                      value={formData.tier}
                      onValueChange={(value: PartnerTier) =>
                        setFormData({ ...formData, tier: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                        <SelectItem value="GOLD">Gold</SelectItem>
                        <SelectItem value="SILVER">Silver</SelectItem>
                        <SelectItem value="BRONZE">Bronze</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logo">URL du logo</Label>
                    <Input
                      id="logo"
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>

                {/* Cadeau */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Cadeau proposé pour le concours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prizeTitle">Titre du cadeau *</Label>
                      <Input
                        id="prizeTitle"
                        value={formData.prizeTitle}
                        onChange={(e) => setFormData({ ...formData, prizeTitle: e.target.value })}
                        required
                        placeholder="ex: Bon d'achat 50 MAD"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prizeValue">Valeur (MAD)</Label>
                      <Input
                        id="prizeValue"
                        type="number"
                        step="0.01"
                        value={formData.prizeValue}
                        onChange={(e) => setFormData({ ...formData, prizeValue: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="prizeDescription">Description du cadeau</Label>
                    <textarea
                      id="prizeDescription"
                      className="w-full min-h-[80px] p-2 border rounded-md"
                      value={formData.prizeDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, prizeDescription: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="prizeImage">Image du cadeau (URL)</Label>
                      <Input
                        id="prizeImage"
                        type="url"
                        value={formData.prizeImage}
                        onChange={(e) => setFormData({ ...formData, prizeImage: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="prizeQuantity">Quantité disponible</Label>
                      <Input
                        id="prizeQuantity"
                        type="number"
                        min="1"
                        value={formData.prizeQuantity}
                        onChange={(e) =>
                          setFormData({ ...formData, prizeQuantity: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Options d&apos;affichage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="displayOrder">Ordre d&apos;affichage</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-7">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isActive">Partenaire actif</Label>
                    </div>
                    <div className="flex items-center space-x-2 mt-7">
                      <input
                        type="checkbox"
                        id="isVisible"
                        checked={formData.isVisible}
                        onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="isVisible">Visible sur la page concours</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingPartner ? "Mettre à jour" : "Créer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Partners List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des partenaires ({partners.length})</CardTitle>
            <CardDescription>Gérez vos partenaires commerciaux</CardDescription>
          </CardHeader>
          <CardContent>
            {partners.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun partenaire pour le moment</p>
                <Button onClick={() => setShowForm(true)} className="mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un partenaire
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {partner.logo && (
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg"
                            unoptimized
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{partner.name}</h3>
                            <Badge className={getTierBadgeColor(partner.tier)}>
                              {partner.tier}
                            </Badge>
                            {partner.isActive && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Actif
                              </Badge>
                            )}
                            {partner.isVisible && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                Visible
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{partner.description}</p>
                          {partner.address && (
                            <p className="text-xs text-gray-500">📍 {partner.address}</p>
                          )}
                          {partner.phone && (
                            <p className="text-xs text-gray-500">📞 {partner.phone}</p>
                          )}
                          <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                            <p className="text-sm font-semibold text-amber-900">
                              🎁 {partner.prizeTitle}
                            </p>
                            {partner.prizeValue && (
                              <p className="text-xs text-amber-700">
                                Valeur: {partner.prizeValue} MAD
                              </p>
                            )}
                            <p className="text-xs text-amber-700">
                              Quantité: {partner.prizeQuantity}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(partner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(partner.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
