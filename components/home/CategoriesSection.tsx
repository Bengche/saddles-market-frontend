"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Western",
    slug: "western",
    image:
      "https://saddleonlineshop.com/cdn/shop/products/9075PonySS_2.jpg?v=1640371922",
    desc: "Classic comfort for trail and ranch",
  },
  {
    name: "English",
    slug: "english",
    image: "https://i.ebayimg.com/images/g/C7AAAOSwgjxlAEVo/s-l400.jpg",
    desc: "Elegant tradition and performance",
  },
  {
    name: "Dressage",
    slug: "dressage",
    image:
      "https://batessaddles.eu/cdn/shop/files/900f5e982bd95b47f29f9206e397d759.png?v=1729221812",
    desc: "Precision for the art of dressage",
  },
  {
    name: "Jumping",
    slug: "jumping",
    image:
      "https://oursaddlery.com/wp-content/uploads/2021/05/Jumping_Saddle_Prestige_Paris_Classic_Black_1.jpg",
    desc: "Freedom and security over fences",
  },
  {
    name: "Trail",
    slug: "trail",
    image:
      "https://farmandranchdepot.com/images/product/KS-Braden-Trail-Saddle-KS2634.jpeg",
    desc: "Built for long-distance adventures",
  },
  {
    name: "Youth",
    slug: "youth",
    image:
      "https://www.chicksaddlery.com/Merchant2/graphics/00000001/WT5394_271x380_2.jpg",
    desc: "Safe and comfortable for young riders",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45 } },
};

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <p className="text-gold-500 text-sm font-medium tracking-widest uppercase mb-3">
            By Discipline
          </p>
          <h2 className="section-heading section-heading-center font-bold text-primary-500 inline-block pb-4">
            Shop by Category
          </h2>
          <p className="text-gray-500 mt-6 max-w-xl mx-auto text-base leading-relaxed">
            Whether you ride Western, English, or everything in between — we
            have the perfect saddle for your discipline.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={item}>
              <Link
                href={`/products?discipline=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[3/2] flex items-end block"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                {/* Darker gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-900/70 to-transparent" />
                {/* Content */}
                <div className="relative z-10 p-4 md:p-5 w-full">
                  <p className="text-xs text-gold-400 font-medium mb-0.5 uppercase tracking-wider">
                    {cat.desc}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                    {cat.name}
                    <span className="w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5h6M5 2l3 3-3 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
