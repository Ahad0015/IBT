import { useState } from 'react'

// Shows the dish photo when there is one. Falls back to the emoji if the
// dish has no image, or if the image file is missing.
export default function DishImage({ dish, alt = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const showPhoto = dish.image && failedSrc !== dish.image

  if (showPhoto) {
    return (
      <img
        className="dish-art__img"
        src={dish.image}
        alt={alt}
        loading="lazy"
        onError={() => setFailedSrc(dish.image)}
      />
    )
  }
  return <span className="dish-art__emoji" aria-hidden="true">{dish.emoji}</span>
}