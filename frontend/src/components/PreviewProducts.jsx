import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../api/api";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Styles
import "swiper/css";
import "swiper/css/pagination";

export default function PreviewProducts() {
  const [products, setProducts] = useState([]);
  const swiperRef = useRef(null); //  IMPORTANT

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await api.get("/shop");
        const shuffled = [...res.data.products].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    };

    fetchPreview();
  }, []);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Gascom Shop - Nos produits phares
          </h2>
          <Link
            to="/shop"
            className="text-[#E50914] hover:text-[#FF1E56] font-semibold transition"
          >
            Voir plus →
          </Link>
        </div>

        {/* Carrousel */}
        <div
          onMouseEnter={() => swiperRef.current?.autoplay.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay.start()}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            style={{ alignItems: "stretch" }}
            className="preview-swiper"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {products.map((product, index) => (
              <SwiperSlide key={product.id} className="!h-auto flex">
                <div className="w-full flex">
                  <ProductCard product={product} index={index} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .preview-swiper .swiper-wrapper {
          align-items: stretch;
        }
        .preview-swiper .swiper-slide {
          height: auto !important;
          display: flex;
        }
        .preview-swiper .swiper-slide > div {
          width: 100%;
          display: flex;
        }
        .preview-swiper .swiper-slide > div > * {
          width: 100%;
          flex: 1;
        }
      `}</style>
    </section>
  );
}
