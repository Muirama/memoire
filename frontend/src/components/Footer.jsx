import React from "react";
import { FaFacebook, FaDiscord, FaTwitch, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-[#0D0D0D]/80 backdrop-blur-sm text-gray-400 py-8 text-center border-t border-[#E50914]/20 relative z-20"
      role="contentinfo"
    >
      <p className="mb-4">
        &copy; {new Date().getFullYear()} Gascom esports Madagascar. Tous droits réservés.
      </p>
      <nav aria-label="Réseaux sociaux" className="mt-4">
        <ul className="flex justify-center items-center gap-6">
          <li>
            <a
              href="https://www.facebook.com/GascomEsport"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-nous sur Facebook"
              className="inline-flex items-center gap-2 hover:text-[#E50914] transition duration-300"
            >
              <FaFacebook size={20} />
              <span>Facebook</span>
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/2Xyxpq2KJa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rejoignez notre Discord"
              className="inline-flex items-center gap-2 hover:text-[#E50914] transition duration-300"
            >
              <FaDiscord size={20} />
              <span>Discord</span>
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/gascomesports/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez-nous sur Instagram"
              className="inline-flex items-center gap-2 hover:text-[#E50914] transition duration-300"
            >
              <FaInstagram size={20} />
              <span>Instagram</span>
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
