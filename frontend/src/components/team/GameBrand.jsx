export default function GameBrand({
  game,
  className = "",
  logoClassName = "w-full h-full object-contain",
  textClassName = "",
}) {
  if (game.logo) {
    return (
      <img
        src={game.logo}
        alt={game.name}
        className={logoClassName}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center text-center font-black uppercase tracking-[0.35em] text-white ${className}`}
    >
      <span className={textClassName || "text-3xl"}>
        {game.logoText || game.name}
      </span>
    </div>
  );
}
