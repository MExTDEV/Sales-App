import type { DesignAssetPreview } from "@/types/sales";

export function UserAvatar({
  className = "size-8",
  name,
  photo
}: {
  className?: string;
  name: string;
  photo?: DesignAssetPreview;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-blue-50 text-[0.65rem] font-black text-[#003B83] ring-1 ring-blue-100 ${className}`}>
      {photo?.previewUrl ? <img alt={name} className="h-full w-full object-cover" src={photo.previewUrl} /> : initials}
    </div>
  );
}
