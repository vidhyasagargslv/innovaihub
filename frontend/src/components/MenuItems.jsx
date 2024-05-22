
function MenuItems({ iconSrc, altText, children, onSelect }) {
    return (
      <button 
        className="flex gap-3 justify-between px-3.5 py-2 mt-2 text-sm font-medium whitespace-nowrap text-zinc-900 bg-transparent border-none cursor-pointer hover:bg-gray-200 rounded-lg" 
        onClick={onSelect}
      >
        <img loading="lazy" src={iconSrc} alt={altText} className="w-6 aspect-square" />
        <div className="flex-auto self-start">{children}</div>
      </button>
    );
  }
export default MenuItems