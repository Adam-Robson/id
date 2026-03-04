import Image from "next/image"

export function Icon({
  srcLight,
  srcDark,
  className,
  alt,
  width,
  height
}: {
  srcLight: string
  srcDark: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  return (
    <>
      <Image className={`block dark:hidden ${className ?? ""}`} src={srcLight} alt={alt} width={width} height={height} priority />
      <Image className={`hidden dark:block ${className ?? ""}`} src={srcDark} alt={alt} width={width} height={height} priority />
    </>
  )
}

