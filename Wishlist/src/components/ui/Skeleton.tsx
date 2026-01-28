type SkeletonProps = {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
};

const radiusMap = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-2xl',
  full: 'rounded-full',
};

const Skeleton = ({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
}: SkeletonProps) => {
  return (
    <div
      className={`
        bg-gray-200 animate-pulse
        ${radiusMap[rounded]}
        ${className}
      `}
      style={{ width, height }}
      aria-hidden
    />
  );
};

export default Skeleton;
