/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const COUNTRIES = {
  450: { name: "Madagascar", sub: "Océan Indien", color: "#E50914" },
  480: { name: "Maurice", sub: "Océan Indien", color: "#E50914" },
  638: { name: "La Réunion", sub: "Océan Indien", color: "#E50914" },
  710: { name: "Afrique du Sud", sub: "Afrique", color: "#ff6b6b" },
  818: { name: "Égypte", sub: "Afrique du Nord", color: "#ff6b6b" },
  250: { name: "France (métropole)", sub: "Europe", color: "#ff9999" },
};

const COORDS = {
  450: [46.8, -19.0],
  480: [57.5, -20.2],
  638: [55.5, -21.1],
  710: [24.0, -30.0],
  818: [30.0, 26.0],
  250: [2.3, 46.2],
};

const LEGEND = [
  { color: "#E50914", label: "Océan Indien" },
  { color: "#ff6b6b", label: "Afrique" },
  { color: "#ff9999", label: "Europe" },
];

export default function PlayersCountriesMap() {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const loadLibs = async () => {
      const [d3mod, tpjmod] = await Promise.all([
        import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
        import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
      ]);

      const d3 = d3mod;
      const topojson = tpjmod;

      const container = svgRef.current;
      const svg = d3.select(container);
      svg.selectAll("*").remove();

      const width = 900;
      const height = 440;

      const projection = d3
        .geoNaturalEarth1()
        .scale(148)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath(projection);

      const world = await d3.json(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
      );

      const features = topojson.feature(
        world,
        world.objects.countries
      ).features;

      // 🌍 Pays
      svg
        .selectAll("path")
        .data(features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#1e1e1e")
        .attr("stroke", "#333")
        .attr("stroke-width", 0.4);

      // 📍 POINTS (LONG / LAT → PROJECTION)
      Object.entries(COUNTRIES).forEach(([id, c]) => {
        const coords = COORDS[id];
        if (!coords) return;

        const [x, y] = projection(coords);

        // Glow animé
        svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 10)
          .attr("fill", "none")
          .attr("stroke", c.color)
          .attr("stroke-width", 2)
          .attr("opacity", 0.6)
          .transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr("r", 25)
          .attr("opacity", 0)
          .on("end", function repeat() {
            d3.select(this)
              .attr("r", 10)
              .attr("opacity", 0.6)
              .transition()
              .duration(1500)
              .attr("r", 25)
              .attr("opacity", 0)
              .on("end", repeat);
          });

        // Point central
        svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 5)
          .attr("fill", "#fff")
          .attr("stroke", c.color)
          .attr("stroke-width", 2);
      });
    };

    loadLibs();
  }, []);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-[#E50914] text-sm font-bold tracking-[0.32em] uppercase">
            Players Map
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Nos joueurs rayonnent au-delà des frontières
          </h2>
        </motion.div>

        <svg
          ref={svgRef}
          viewBox="0 0 900 440"
          className="w-full rounded-2xl border border-white/5"
        />
      </div>
    </section>
  );
}