import type { ImgHTMLAttributes } from 'react'
import { resolveImage, type ImageName } from '../../lib/images'

/** Responsive image from the optimised set, with intrinsic size to hold its space. */
export function Picture({
  name,
  alt,
  sizes = '100vw',
  eager = false,
  ...rest
}: {
  name: ImageName
  alt: string
  sizes?: string
  eager?: boolean
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'alt' | 'width' | 'height'>) {
  const image = resolveImage(name)
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      {...rest}
    />
  )
}
