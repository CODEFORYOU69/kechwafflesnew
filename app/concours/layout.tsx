import Image from "next/image";

export default function ConcoursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <Image
        src="/images/elements/wallpaper.png"
        alt="Background"
        fill
        className="object-cover fixed"
        priority
      />
      {/* Overlay pour améliorer la lisibilité */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
