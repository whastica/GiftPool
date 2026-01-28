/**
 * Custom Hooks Barrel Export
 * 
 * This file re-exports all custom hooks for convenient importing.
 * Instead of: import { useForm } from './hooks/useForm'
 * You can do: import { useForm } from './hooks'
 * 
 * Benefits:
 * - Cleaner imports
 * - Single entry point
 * - Easy to refactor
 */

// Form handling
export { useForm, default as useFormDefault } from './useForm'

// Responsive & Media
export { useIsMobile, default as useIsMobileDefault } from './useIsMobile'
export { useMediaQuery, default as useMediaQueryDefault } from './useMediaQuery'
export { useScrollPosition, default as useScrollPositionDefault } from './useScrollPosition'

// Performance
export { useDebounce, default as useDebounceDefault } from './useDebounce'

// Storage
export { useLocalStorage, default as useLocalStorageDefault } from './useLocalStorage'

// Utilities
export { useCopyToClipboard, default as useCopyToClipboardDefault } from './useCopyToClipBoard'
export { useAsync, default as useAsyncDefault } from './useAsync'
