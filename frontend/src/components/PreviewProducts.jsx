import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await api.get("/shop");

        // produits aléatoires (plus dynamique)
        const shuffled = [...res.data.products].sort(() => 0.5 - Math.random());

        setProducts(shuffled.slice(0, 8)); // 8 pour carrousel
      } catch (err) {
        console.error(err);
      }
    };

    fetchPreview();
  }, []);

  return (
    <section className="py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Produits en vedette
        </h2>

        <Link
          to="/shop"
          className="text-[#E50914] hover:text-[#FF1E56] font-semibold transition"
        >
          Voir plus →
        </Link>
      </div>

      {/* Carrousel */}
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={16}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4},
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
