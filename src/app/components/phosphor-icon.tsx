import { useIconContext } from "@/contexts/icon-provider";
import type { IconProps } from "@/types/icon-props";

export default function PhosphorIcon({
  as: Tag,
  className,
  size,
  weight,
}: IconProps) {
  const ctx = useIconContext();
  const classString = [ctx.className, className].filter(Boolean).join(" ");

  return (
    <Tag
      size={size ?? ctx.size}
      weight={weight ?? ctx.weight}
      className={classString}
    />
  );
}
