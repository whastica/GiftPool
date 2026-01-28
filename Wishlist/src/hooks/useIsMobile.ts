import { useState, useEffect } from 'react'

/**
 * Custom hook to detect if viewport is mobile size
 * @param {number} breakpoint - Width breakpoint (default: 768px)
 * @returns {boolean} True if viewport width is less than breakpoint
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    
    // Check on mount
    checkMobile()
    
    // Add event listener
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}

export default useIsMobile