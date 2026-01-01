
/**
 * Reusable Card component for content display
 */
const Card = ({ children, className = '', hover = false, onClick }) => {
  const baseStyles = 'bg-white border border-gray-200 rounded-lg overflow-hidden';
  const hoverStyles = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;