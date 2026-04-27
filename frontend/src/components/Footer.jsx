import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaDiscord,
} from "react-icons/fa";

const gascomContacts = [
  {
    label: "Telephone",
    value: "+261 32 70 712 26",
    icon: FaPhone,
  },
  {
    label: "Telephone 2",
    value: "+261 34 63 620 43",
    icon: FaPhone,
  },
  {
    label: "Telephone 3",
    value: "+33 7 67 66 81 42",
    icon: FaPhone,
  },
  {
    label: "Email",
    value: "Gascomesports@gmail.com",
    icon: FaEnvelope,
  },
  {
    label: "Adresse",
    value: "Lot IVK 165 Ankadifotsy, Antananarivo",
    icon: FaMapMarkerAlt,
  },
];

const sponsorLogos = [
  {
    href: "https://www.orange.mg/",
    label: "Orange Madagascar",
    image: "/Logo Orange.png",
    imageClassName: "h-[74px] sm:h-[82px]",
  },
  {
    href: "https://loaline.com/",
    label: "Centre Loaline",
    image: "/loaline-bronze.png",
    imageClassName: "h-[126px] sm:h-[140px]",
    logoFilterClassName: "brightness-0 invert",
  },
];

const partnerLogos = [
  {
    href: "https://www.instagram.com/syki.261?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    label: "SYKI",
    image: "/LOGO/Logo SYKI Blanc.png",
    imageClassName: "h-[44px] sm:h-[48px]",
  },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative z-20 border-t border-[#E50914]/15 bg-[#070707]/92 text-gray-400"
      role="contentinfo"
    >
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 md:px-6 md:py-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[20px] border border-white/8 bg-black/25 p-3.5">
          <img
            src="/LOGO/Logo_GES_blanc.svg"
            alt="Gascom Esports"
            className="h-auto w-auto max-w-[108px]"
          />
          <p className="mt-1.5 text-[10px] italic text-gray-300">
            Unis par une seule passion, l'esport
          </p>

          <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {gascomContacts.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start gap-2 rounded-lg border border-white/7 bg-white/[0.02] px-2.5 py-2"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E50914]/12 text-[#E50914]">
                    <Icon className="text-[10px]" />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#E50914]">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-300">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[20px] border border-white/8 bg-black/25 p-3.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#E50914]">
            Sponsors
          </p>

          <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-2 sm:max-w-[470px]">
            {sponsorLogos.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-[94px] items-center justify-center transition-all duration-300"
                aria-label={`Visiter ${item.label}`}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className={`w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03] ${item.imageClassName} ${item.logoFilterClassName ?? ""}`}
                />
              </a>
            ))}
          </div>

          <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#E50914]">
            Partenaires
          </p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:max-w-[320px]">
            {partnerLogos.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-[56px] items-center justify-center transition-all duration-300"
                aria-label={`Visiter ${item.label}`}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className={`w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03] ${item.imageClassName}`}
                />
              </a>
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-2">
            <a
              href="https://www.facebook.com/GascomEsport"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]/12 text-white transition-all duration-300 hover:bg-[#E50914]/25"
              aria-label="Facebook"
            >
              <FaFacebook className="text-base" />
            </a>
            <a
              href="https://www.instagram.com/gascomesports/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]/12 text-white transition-all duration-300 hover:bg-[#E50914]/25"
              aria-label="Instagram"
            >
              <FaInstagram className="text-base" />
            </a>
            <a
              href="https://discord.gg/fmCFAbhHj4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914]/12 text-white transition-all duration-300 hover:bg-[#E50914]/25"
              aria-label="Discord"
            >
              <FaDiscord className="text-base" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/6">
        <div className="mx-auto max-w-7xl px-4 py-2.5 text-center text-[10px] text-gray-500 md:px-6 md:text-[11px]">
          &copy; {new Date().getFullYear()} Gascom Esports Madagascar. Tous
          droits reserves.
        </div>
      </div>
    </footer>
  );
}
