/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MAP_WIDTH = 900;
const MAP_HEIGHT = 440;

const COUNTRY_POINTS = [
  {
    id: 450,
    name: "Madagascar",
    sub: "Océan Indien",
    color: "#E50914",
    coords: [46.8, -19.0],
  },
  {
    id: 480,
    name: "Maurice",
    sub: "Océan Indien",
    color: "#E50914",
    coords: [57.5, -20.2],
  },
  {
    id: 638,
    name: "La Réunion",
    sub: "Océan Indien",
    color: "#E50914",
    coords: [55.5, -21.1],
  },
  {
    id: 710,
    name: "Afrique du Sud",
    sub: "Afrique",
    color: "#ff6b6b",
    coords: [24.0, -30.0],
  },
  {
    id: 818,
    name: "Égypte",
    sub: "Afrique du Nord",
    color: "#ff6b6b",
    coords: [30.0, 26.0],
  },
  {
    id: 250,
    name: "France (métropole)",
    sub: "Europe",
    color: "#ff9999",
    coords: [2.3, 46.2],
  },
];

const LEGEND = [
  { color: "#E50914", label: "Océan Indien" },
  { color: "#ff6b6b", label: "Afrique" },
  { color: "#ff9999", label: "Europe" },
];

function getTooltipPosition(country) {
  const horizontalOffset = country.x > MAP_WIDTH * 0.72 ? -18 : 18;
  const verticalOffset = country.y < MAP_HEIGHT * 0.28 ? 18 : -18;
  const translateX = horizontalOffset < 0 ? "-100%" : "0%";
  const translateY = verticalOffset < 0 ? "-100%" : "0%";

  return {
    left: `${(country.x / MAP_WIDTH) * 100}%`,
    top: `${(country.y / MAP_HEIGHT) * 100}%`,
    transform: `translate(calc(${translateX} + ${horizontalOffset}px), calc(${translateY} + ${verticalOffset}px))`,
  };
}

export default function PlayersCountriesMap() {
  const svgRef = useRef(null);
  const [projectedCountries, setProjectedCountries] = useState([]);
  const [activeCountryId, setActiveCountryId] = useState(null);
  const [isMobileLike, setIsMobileLike] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const updateDeviceMode = () => setIsMobileLike(mediaQuery.matches);

    updateDeviceMode();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateDeviceMode);
      return () => mediaQuery.removeEventListener("change", updateDeviceMode);
    }

    mediaQuery.addListener(updateDeviceMode);
    return () => mediaQuery.removeListener(updateDeviceMode);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadMap = async () => {
      const [d3mod, topojsonMod] = await Promise.all([
        import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
        import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
      ]);

      if (cancelled || !svgRef.current) {
        return;
      }

      const d3 = d3mod;
      const topojson = topojsonMod;
      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove();
      svg.attr("viewBox", `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`);

      const projection = d3
        .geoNaturalEarth1()
        .scale(148)
        .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

      const path = d3.geoPath(projection);

      const world = await d3.json(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
      );

      if (cancelled || !world) {
        return;
      }

      const features = topojson.feature(
        world,
        world.objects.countries,
      ).features;

      svg
        .selectAll("path")
        .data(features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#171717")
        .attr("stroke", "#303030")
        .attr("stroke-width", 0.45);

      const nextProjectedCountries = COUNTRY_POINTS.map((country) => {
        const [x, y] = projection(country.coords) ?? [];

        return {
          ...country,
          x,
          y,
        };
      }).filter(
        (country) => Number.isFinite(country.x) && Number.isFinite(country.y),
      );

      setProjectedCountries(nextProjectedCountries);
    };

    loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!projectedCountries.length) {
      return;
    }

    if (!isMobileLike) {
      setActiveCountryId(null);
      return;
    }

    let index = 0;
    setActiveCountryId(projectedCountries[0].id);

    const intervalId = window.setInterval(() => {
      index = (index + 1) % projectedCountries.length;
      setActiveCountryId(projectedCountries[index].id);
    }, 2200);

    return () => window.clearInterval(intervalId);
  }, [isMobileLike, projectedCountries]);

  const activeCountry =
    projectedCountries.find((country) => country.id === activeCountryId) ??
    null;

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          className="mb-10 text-center md:mb-14"
        >
          <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#E50914]">
            Players Map
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Nos joueurs rayonnent au-delà des frontières
          </h2>
        </motion.div>

        <div className="relative aspect-[900/440] overflow-hidden rounded-2xl border border-white/5 bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.14),_transparent_45%),linear-gradient(180deg,_rgba(255,255,255,0.02),_rgba(255,255,255,0))]">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="h-full w-full"
          />

          <div className="pointer-events-none absolute inset-0 z-10">
            {projectedCountries.map((country, index) => {
              const isActive = country.id === activeCountryId;

              return (
                <button
                  key={country.id}
                  type="button"
                  aria-label={`Afficher ${country.name}`}
                  className="pointer-events-auto absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  style={{
                    left: `${(country.x / MAP_WIDTH) * 100}%`,
                    top: `${(country.y / MAP_HEIGHT) * 100}%`,
                  }}
                  onMouseEnter={() => setActiveCountryId(country.id)}
                  onMouseLeave={() => {
                    if (!isMobileLike) {
                      setActiveCountryId(null);
                    }
                  }}
                  onFocus={() => setActiveCountryId(country.id)}
                  onBlur={() => {
                    if (!isMobileLike) {
                      setActiveCountryId(null);
                    }
                  }}
                  onClick={() => setActiveCountryId(country.id)}
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute h-5 w-5 rounded-full border"
                    style={{ borderColor: country.color }}
                    animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                    transition={{
                      duration: 2.2,
                      ease: "easeOut",
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.22,
                    }}
                  />

                  <motion.span
                    aria-hidden="true"
                    className="absolute h-4 w-4 rounded-full border-2 bg-white"
                    style={{
                      borderColor: country.color,
                      boxShadow: isActive
                        ? `0 0 0 6px ${country.color}22, 0 0 24px ${country.color}`
                        : `0 0 0 3px ${country.color}18`,
                    }}
                    animate={isActive ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{
                      duration: 0.9,
                      ease: "easeInOut",
                      repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                    }}
                  />
                </button>
              );
            })}

            <AnimatePresence>
              {activeCountry && !isMobileLike && (
                <div
                  className="pointer-events-none absolute z-20"
                  style={getTooltipPosition(activeCountry)}
                >
                  <motion.div
                    key={activeCountry.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="min-w-[190px] rounded-2xl border border-white/12 bg-black/80 px-4 py-3 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: activeCountry.color,
                          boxShadow: `0 0 16px ${activeCountry.color}`,
                        }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {activeCountry.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                          {activeCountry.sub}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3 text-xs text-white/65">
            {LEGEND.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs uppercase tracking-[0.18em] text-white/35">
            {isMobileLike
              ? "Mode mobile : le pays actif defile automatiquement."
              : "Survolez un point pour afficher le pays."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isMobileLike && activeCountry && (
            <motion.div
              key={activeCountry.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: activeCountry.color,
                    boxShadow: `0 0 16px ${activeCountry.color}`,
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {activeCountry.name}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                    {activeCountry.sub}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
