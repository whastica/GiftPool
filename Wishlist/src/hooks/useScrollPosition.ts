import { useState, useEffect } from 'react'

/**
 * Custom hook to track window scroll position
 * @returns {number} Current scroll position in pixels
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset || window.scrollY)
    }
    
    // Set initial position
    updatePosition()
    
    // Add scroll event listener
    window.addEventListener('scroll', updatePosition, { passive: true })
    
    // Cleanup
    return () => window.removeEventListener('scroll', updatePosition)
  }, [])

  return scrollPosition
}

export default useScrollPosition