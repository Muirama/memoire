/* eslint-disable no-unused-vars */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const COUNTRIES = {
  450: { name: "Madagascar", sub: "Océan Indien", color: "#E50914" },
  480: { name: "Maurice", sub: "Océan Indien", color: "#E50914" },
  638: { name: "La Réunion", sub: "Océan Indien", color: "#E50914" },
  710: { name: "Afrique du Sud", sub: "Afrique", color: "#ff6b6b" },
  818: { name: "Égypte", sub: "Afrique du Nord", color: "#ff6b6b" },
  250: { name: "France", sub: "Europe", color: "#ff9999" },
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
    let d3, topojson;

    // Charger D3 et TopoJSON dynamiquement si pas déjà présents
    const loadLibs = async () => {
      const [d3mod, tpjmod] = await Promise.all([
        import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
        import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
      ]);
      d3 = d3mod;
      topojson = tpjmod;
      drawMap();
    };

    const drawMap = async () => {
      const container = svgRef.current;
      if (!container) return;

      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const landFill = isDark ? "#2a2a2a" : "#d4d4d4";
      const border = isDark ? "#444" : "#fff";
      const textColor = isDark ? "#e5e5e5" : "#111";
      const textSub = isDark ? "#999" : "#555";

      const svg = d3.select(container);
      svg.selectAll("*").remove();

      const projection = d3.geoNaturalEarth1().scale(148).translate([450, 240]);
      const path = d3.geoPath(projection);

      const tooltip = d3.select(tooltipRef.current);

      const world = await d3.json(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
      );
      const features = topojson.feature(
        world,
        world.objects.countries,
      ).features;

      // Pays
      svg
        .selectAll("path.country")
        .data(features)
        .join("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("stroke", border)
        .attr("stroke-width", 0.4)
        .attr("fill", (d) => COUNTRIES[String(d.id)]?.color || landFill)
        .attr("cursor", (d) =>
          COUNTRIES[String(d.id)] ? "pointer" : "default",
        )
        .on("mouseover", function (event, d) {
          const info = COUNTRIES[String(d.id)];
          if (!info) return;
          d3.select(this).attr("fill", "#ff0022").attr("stroke-width", 1.2);
          tooltip
            .style("opacity", "1")
            .html(
              `<strong>${info.name}</strong><br><span style="color:#E50914;font-size:11px">${info.sub}</span>`,
            );
        })
        .on("mousemove", function (event) {
          const rect = svgRef.current.parentElement.getBoundingClientRect();
          tooltip
            .style("left", event.clientX - rect.left + 14 + "px")
            .style("top", event.clientY - rect.top - 44 + "px");
        })
        .on("mouseout", function (event, d) {
          const info = COUNTRIES[String(d.id)];
          if (!info) return;
          d3.select(this).attr("fill", info.color).attr("stroke-width", 0.4);
          tooltip.style("opacity", "0");
        });

      // Points blancs sur les pays mis en avant
      features.forEach((feat) => {
        const info = COUNTRIES[String(feat.id)];
        if (!info) return;
        const [cx, cy] = path.centroid(feat);
        if (isNaN(cx) || isNaN(cy)) return;
        svg
          .append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", 5)
          .attr("fill", "#fff")
          .attr("stroke", "#E50914")
          .attr("stroke-width", 2)
          .attr("pointer-events", "none");
      });

      // Légende
      const legend = svg.append("g").attr("transform", "translate(18, 395)");
      LEGEND.forEach(({ color, label }, i) => {
        legend
          .append("rect")
          .attr("x", i * 130)
          .attr("y", 0)
          .attr("width", 12)
          .attr("height", 12)
          .attr("rx", 3)
          .attr("fill", color);
        legend
          .append("text")
          .attr("x", i * 130 + 18)
          .attr("y", 10)
          .attr("fill", textSub)
          .attr("font-size", 12)
          .text(label);
      });
    };

    loadLibs();
  }, []);

  return (
    <section
      id="players-countries"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Fond décoratif */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-[#E50914] text-sm font-bold tracking-[0.32em] uppercase">
            Players Map
          </p>
          <h2
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold
                         text-white leading-tight"
          >
            Nos joueurs rayonnent au-delà des frontières
          </h2>
          <p
            className="mt-4 max-w-3xl mx-auto text-sm md:text-base
                        text-gray-300 leading-relaxed"
          >
            Une communauté connectée entre l'océan Indien, l'Afrique et
            l'Europe.
          </p>
        </motion.div>

        {/* Carte */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Tooltip */}
          <div
            ref={tooltipRef}
            className="absolute z-50 pointer-events-none opacity-0 transition-opacity
                       bg-[#1a1a1a] text-white border border-[#E50914] rounded-xl
                       px-4 py-2 text-sm shadow-xl"
            style={{ transition: "opacity 0.15s" }}
          />

          {/* SVG carte */}
          <svg
            ref={svgRef}
            viewBox="0 0 900 440"
            className="w-full rounded-2xl border border-white/5"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        </motion.div>

        {/* Légende pays (liste) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
        </motion.div>
      </div>
    </section>
  );
}
