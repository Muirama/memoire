import { motion } from "framer-motion";

export default function PoweredByOrange() {
  return (
    <section
      id="powered-by-orange"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,121,0,0.12)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[28px] border border-[#ff7900]/25 bg-[#120700]/70 px-6 py-8 md:px-10 md:py-10 backdrop-blur-md shadow-[0_0_35px_rgba(255,121,0,0.12)]"
        >
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#ff7900] to-transparent opacity-70" />
          <div className="absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff7900] to-transparent opacity-40" />

          <div className="text-center">
            <p className="text-[#ff7900] text-sm font-bold tracking-[0.28em] uppercase">
              Powered By
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">
              Une connexion qui fait rayonner la scène esport à Madagascar
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed">
              Decouvrez notre Sponsor en cliquant sur le lien ci-dessous
            </p>
          </div>

          <motion.a
            href="https://orange.mg/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.99 }}
            className="group relative mt-8 block"
            aria-label="Visiter orange.mg"
          >
            <div className="absolute inset-0 rounded-[30px] bg-[#ff7900]/20 blur-3xl opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute -inset-2 rounded-[34px] border border-[#ff7900]/35 shadow-[0_0_35px_rgba(255,121,0,0.45)] transition-all duration-300 group-hover:shadow-[0_0_60px_rgba(255,121,0,0.8)]" />

            <div className="relative rounded-[28px] border border-[#ff7900]/20 bg-black/85 px-4 py-5 md:px-6 md:py-6">
              <img
                src="/Powered.png"
                alt="Powered by Orange"
                className="mx-auto w-full max-w-[620px] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
