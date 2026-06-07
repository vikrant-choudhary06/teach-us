import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

  const handleMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHoveredCardIndex(index);
  };

  const pricingData = [
    {
      title: "Basic",
      price: "Free",
      isCustom: false,
      pillBg: "bg-white",
      pillText: "text-gray-800",
      headerBg: "bg-[#f3f4f6]/80",
      description: "For individuals exploring the power of AI in education.",
      btnText: "Try it for free",
      features: [
        "5 uses/month of basic AI tools",
        "Workspace & Library access",
        "Community Support",
        "Cancel anytime",
      ],
      isEmailLink: false,
      linkTo: "/login",
    },
    {
      title: "Professional",
      price: null, // calculated based on isAnnual
      isCustom: false,
      pillBg: "bg-[#007A55]",
      pillText: "text-white",
      headerBg: "bg-[#E7EFE9]",
      description:
        "For individual teachers wanting to unlock the full potential of AI.",
      btnText: "Get Pro Membership",
      features: [
        "Unlimited Lesson Plans & Quizzes",
        "100 Credits/month for premium",
        "AI-powered evaluation tools",
        "Cancel anytime",
      ],
      isEmailLink: false,
      linkTo: "/login",
    },
    {
      title: "Enterprise",
      price: "Custom",
      isCustom: true,
      pillBg: "bg-white",
      pillText: "text-gray-800",
      headerBg: "bg-[#f3f4f6]/80",
      description: "For schools and educational institutions needing scale.",
      btnText: "Contact Sales",
      features: [
        "All Pro features for every user",
        "Unlimited credits globally",
        "Admin dashboard & analytics",
        "Cancel anytime",
      ],
      isEmailLink: true,
      linkTo: "mailto:sales@techus.in?subject=School%20License%20Inquiry",
    },
  ];

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 bg-brand-cream relative overflow-hidden border-t border-brand-forest/10"
    >
      {/* Background glow effects */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-brand-sage/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] bg-brand-sage/20 rounded-full blur-[130px]" />
      </div>

      <div className="container-custom relative z-10 px-4">
        {/* Title */}
        <h2 className="font-space text-4xl sm:text-5xl font-extrabold text-center text-black mb-2">
          Pricing plans
        </h2>

        {/* Subtitle */}
        <p className="text-brand-text-muted text-center text-xs sm:text-sm lg:text-base max-w-2xl mx-auto mb-12 leading-relaxed">
          Start for free and upgrade anytime to unlock powerful new AI
          capabilities for your classroom. Pay in various ways. Cancel anytime.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3.5 mb-16">
          <span
            onClick={() => setIsAnnual(false)}
            className={`text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none ${
              !isAnnual
                ? "text-brand-forest"
                : "text-brand-text-muted/65 hover:text-brand-forest"
            }`}
          >
            Monthly
          </span>

          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6 rounded-full p-1 bg-brand-sage border border-brand-forest/10 hover:bg-[#DCE6DF] transition-colors focus:outline-none"
            aria-label="Toggle annual billing"
          >
            <motion.div
              layout
              className="w-4 h-4 rounded-full bg-brand-forest shadow-sm"
              animate={{ x: isAnnual ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>

          <div className="flex items-center gap-2">
            <span
              onClick={() => setIsAnnual(true)}
              className={`text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none ${
                isAnnual
                  ? "text-brand-forest"
                  : "text-brand-text-muted/65 hover:text-brand-forest"
              }`}
            >
              Annually
            </span>
            <span className="bg-[var(--color-emerald-500)]/15 text-[var(--color-emerald-500)] border border-[var(--color-emerald-500)]/25 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              20% OFF
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
          {pricingData.map((plan, index) => {
            const isHovered = hoveredCardIndex === index;
            return (
              <div
                key={index}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                className={`relative rounded-[2rem] border p-4 flex flex-col h-full transition-all duration-300 overflow-hidden bg-white ${
                  isHovered
                    ? "border-[#007A55] shadow-[0_10px_35px_rgba(0,122,85,0.08)] scale-[1.01]"
                    : "border-brand-forest/10 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                }`}
              >
                {/* Top neon green line glow highlight on hover */}
                {isHovered && (
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#007A55] to-transparent z-20 animate-pulse"
                    style={{ boxShadow: "0 0 15px #007A55" }}
                  />
                )}

                {/* Spotlight */}
                <div
                  className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(0, 122, 85, 0.05), transparent 80%)`,
                  }}
                />

                {/* Inset Header Box */}
                <div
                  className={`${plan.headerBg} rounded-[1.5rem] p-6 flex flex-col items-start w-full relative z-10 border border-black/[0.03]`}
                >
                  <span
                    className={`${plan.pillBg} ${plan.pillText} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm`}
                  >
                    {plan.title}
                  </span>

                  {plan.title === "Professional" ? (
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="font-space text-4xl font-extrabold text-brand-forest">
                        {isAnnual ? "₹499" : "₹599"}
                      </span>
                      <span className="text-brand-text-muted/80 text-xs font-semibold">
                        /month
                      </span>
                    </div>
                  ) : (
                    <div className="mt-6 font-space text-4xl font-extrabold text-brand-forest">
                      {plan.price}
                    </div>
                  )}
                </div>

                {/* Body Info */}
                <div className="px-4 pt-6 pb-4 flex-1 flex flex-col relative z-10 text-left">
                  <p className="text-black font-semibold text-xs sm:text-sm leading-snug min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Forest Green Capsule Button */}
                  {plan.isEmailLink ? (
                    <a
                      href={plan.linkTo}
                      className="w-full bg-[#0F2D24] hover:bg-[#153C30] text-white font-bold text-xs sm:text-sm py-3 rounded-full text-center mt-5 transition-all duration-300 shadow-md shadow-black/10 active:scale-[0.98] select-none block"
                    >
                      {plan.btnText}
                    </a>
                  ) : (
                    <Link
                      to={plan.linkTo}
                      className="w-full bg-[#0F2D24] hover:bg-[#153C30] text-white font-bold text-xs sm:text-sm py-3 rounded-full text-center mt-5 transition-all duration-300 shadow-md shadow-black/10 active:scale-[0.98] select-none block"
                    >
                      {plan.btnText}
                    </Link>
                  )}

                  {/* Checklist */}
                  <ul className="space-y-3.5 mt-8 flex-1">
                    {plan.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-text-muted"
                      >
                        <span className="text-[#007A55] font-bold select-none shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
