import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  hover?: boolean;
  padding?: boolean;
  className?: string;
};

const Card = ({ 
  children, 
  hover = false, 
  padding = true,
  className = '' 
}: CardProps) => {
  return (
    <div className={`
      bg-white rounded-2xl shadow-lg
      ${hover ? 'card-hover' : ''}
      ${padding ? 'p-6' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;