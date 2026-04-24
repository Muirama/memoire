import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaDiscord,
} from "react-icons/fa";

import logo_GES_blanc from "/LOGO/Logo_GES_blanc.svg";

const gascomContacts = [
  { label: "Telephone", value: "+261 32 70 712 26", icon: FaPhone },
  { label: "Telephone 2", value: "+261 34 63 60 43", icon: FaPhone },
  { label: "Telephone 3", value: "+33 7 67 66 81 42", icon: FaPhone },
  { label: "Email", value: "Gascomesports@gmail.com", icon: FaEnvelope },
  { label: "Adresse", value: "A renseigner", icon: FaMapMarkerAlt },
];

const partnerLogos = [
  {
    href: "https://www.orange.mg/",
    label: "Orange Madagascar",
    image: "/Logo Orange.png",
  },
  {
    href: "https://loaline.com/",
    label: "Centre Loaline",
    image: "/loaline-bronze.png",
  },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-gray-200 py-12 text-[#ffffff]"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Section 1: Logo */}
          <div className="flex flex-col items-center border-gray-300 md:items-start lg:border-r lg:pr-12">
            <img
              src={logo_GES_blanc}
              alt="Gascom Esports"
              className=" w-auto h-20 mb-8"
            />
          </div>

          {/* Section 2: Sponsors*/}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest">
              Sponsors
            </h3>
            <div className="flex flex-row gap-4">
              {partnerLogos.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-20 w-auto object-contain object-left"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Section 3: Informations (Contacts) */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest">
              Informations
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {gascomContacts.map((item, index) => (
                <li key={index} className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-gray-400">
                    {item.label}
                  </span>
                  <span className=" transition-colors">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Réseaux Sociaux */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest">
              Réseaux sociaux
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a
                  href="https://www.facebook.com/GascomEsport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-700 flex items-center gap-2"
                >
                  <FaFacebook size={14} /> Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/gascomesports/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-700 flex items-center gap-2"
                >
                  <FaInstagram size={14} /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/fmCFAbhHj4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-700 flex items-center gap-2"
                >
                  <FaDiscord size={14} /> Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bas de page */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center text-[10px] uppercase tracking-widest text-gray-400">
          &copy; {new Date().getFullYear()} Gascom Esports Madagascar. Tous
          droits réservés.
        </div>
      </div>
    </footer>
  );
}
