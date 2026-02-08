/**
 * Skeleton loader para wishlists
 * Muestra placeholders mientras cargan los datos
 */

interface WishlistSkeletonProps {
  count?: number
}

const WishlistSkeleton = ({ count = 3 }: WishlistSkeletonProps) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="grid md:grid-cols-12 gap-6">
            {/* Image Skeleton */}
            <div className="md:col-span-2">
              <div className="w-full h-32 bg-gray-200 rounded-lg skeleton-shimmer" />
            </div>

            {/* Info Skeleton */}
            <div className="md:col-span-7 space-y-4">
              {/* Title and Badge */}
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 skeleton-shimmer" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 skeleton-shimmer" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full skeleton-shimmer" />
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded-full skeleton-shimmer" />
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24 skeleton-shimmer" />
                  <div className="h-4 bg-gray-200 rounded w-16 skeleton-shimmer" />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gray-200 rounded w-32 skeleton-shimmer" />
                <div className="h-4 w-1 bg-gray-200 rounded skeleton-shimmer" />
                <div className="h-4 bg-gray-200 rounded w-40 skeleton-shimmer" />
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="md:col-span-3 space-y-2">
              <div className="h-10 bg-gray-200 rounded-lg skeleton-shimmer" />
              <div className="h-10 bg-gray-200 rounded-lg skeleton-shimmer" />
              <div className="h-10 bg-gray-200 rounded-lg skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WishlistSkeleton