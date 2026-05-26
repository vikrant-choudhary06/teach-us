import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiDocumentText,
  HiPhotograph,
  HiCalculator,
  HiGlobeAlt,
  HiStar,
  HiDatabase,
  HiArrowRight,
  HiSparkles,
  HiCheckCircle,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

// Custom Bento Card with Mouse Spotlight Hover Effect
const BentoCard = ({ children, className = '' }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#070908] p-6 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-emerald-500/5 shadow-2xl ${className}`}
    >
      {/* Dynamic Cursor Spotlight */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition duration-300 rounded-2xl z-0"
          style={{
            background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, rgba(16, 185, 129, 0.05), transparent 80%)`,
          }}
        />
      )}
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

export default function FeaturesSection() {
  // 1. Lesson Planner Interactive State
  const [plannerTopic, setPlannerTopic] = useState('photosynthesis');
  const plannerData = {
    photosynthesis: {
      subject: 'Biology • Class 9',
      title: 'Photosynthesis Plan',
      objectives: ['Identify chlorophyl role', 'Differentiate Light/Dark phases'],
      activity: 'Observe starch presence in green leaves using iodine.',
    },
    gravity: {
      subject: 'Physics • Class 9',
      title: "Newton's Gravity Plan",
      objectives: ['Define Universal Constant G', 'Calculate acceleration due to g'],
      activity: 'Balloon drop test to observe terminal velocity.',
    },
    history: {
      subject: 'History • Class 6',
      title: 'Indus Valley Plan',
      objectives: ['Understand grid city planning', 'Explore trade seal relics'],
      activity: 'Create mock clay seals in class activity.',
    },
  };

  // 2. Visual Aids State
  const [orbitSpeed, setOrbitSpeed] = useState(5);

  // 3. Math Solver State
  const [mathTab, setMathTab] = useState('algebra');
  const mathSolutions = {
    algebra: {
      equation: 'x² - 5x + 6 = 0',
      steps: ['Factorize: (x - 2)(x - 3) = 0', 'Roots: x = 2 or x = 3'],
    },
    calculus: {
      equation: '∫ (2x + 1) dx',
      steps: ['Apply Integration Power Rule', 'Result: x² + x + C'],
    },
  };

  // 4. Translator State
  const [transLang, setTransLang] = useState('hi');
  const translations = {
    hi: 'हिंदी: "गुरुत्वाकर्षण वह बल है जिसके द्वारा एक पिंड दूसरे को आकर्षित करता है।"',
    te: 'తెలుగు: "గురుత్వాకర్షణ అనేది ఒక శరీరం మరొకదానిని ఆకర్షించే శక్తి."',
    ta: 'தமிழ்: "ஈர்ப்பு என்பது ஒரு உடல் மற்றொரு உடலை ஈர்க்கும் விசையாகும்."',
  };

  // 5. Story Generator State
  const [storyIndex, setStoryIndex] = useState(0);
  const stories = [
    {
      topic: 'Class 6 • The Solar System',
      story: 'Once upon a time in a school in Pune, a teacher explained gravity by telling a story about planets playing tag around the campfire (the Sun), running in circular tracks...',
    },
    {
      topic: 'Class 9 • Water Cycle',
      story: 'Meet Pip, a water drop. After sunbathing on a leaf, he floated up to join a cloud party, got heavy, and parachuted down as rain to start the slide again...',
    },
  ];

  return (
    <section id="features" className="section-padding bg-black relative overflow-hidden">
      {/* Soft Academic Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[20%] left-[-15%] w-[500px] h-[500px] bg-green-955/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-15%] w-[500px] h-[500px] bg-emerald-955/5 rounded-full blur-[140px]" />
      </div>

      <div className="container-custom relative z-10 max-w-6xl">
        
        {/* Section Header */}
        <div className="mb-16 text-center flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 tracking-wide"
          >
            📚 CLASSROOM ASSISTANT
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-space max-w-3xl leading-tight">
            Everything you need to <span className="text-emerald-400">Transform your Classroom.</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-xl font-sans">
            Explore clean, automated assistant tools designed specifically for modern educators.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          
          {/* Card 1: AI Lesson Planner (Double size width, single height - 2 Cols x 1 Row) */}
          <BentoCard className="md:col-span-2">
            <div className="flex flex-col sm:flex-row gap-6 items-stretch h-full">
              {/* Left Side */}
              <div className="flex flex-col justify-between flex-1 md:w-[55%]">
                <div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold tracking-widest uppercase font-sans">
                    Lesson Planner
                  </span>
                  <h3 className="text-xl font-bold text-white font-space mt-2">
                    Architect Lessons in Seconds.
                  </h3>
                  <p className="text-gray-400 text-[11px] mt-1 font-sans leading-normal">
                    Draft complete lesson guides. Choose a CBSE/ICSE topic below to watch the planner generate steps instantly:
                  </p>

                  {/* Preset Topic Buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-3 font-sans">
                    {Object.keys(plannerData).map((key) => (
                      <button
                        key={key}
                        onClick={() => setPlannerTopic(key)}
                        className={`px-2.5 py-1 rounded-full text-[9px] font-semibold border transition-all ${
                          plannerTopic === key
                            ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/15'
                            : 'border-white/10 bg-white/[0.02] text-gray-400 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        {plannerData[key].title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider font-sans"
                  >
                    Create Custom Worksheets <HiArrowRight />
                  </Link>
                </div>
              </div>

              {/* Right Side: Friendly Glass Worksheet Preview */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-2.5 shadow-inner text-left font-sans md:w-[45%] justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={plannerTopic}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-1">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{plannerData[plannerTopic].subject}</span>
                      <span className="text-[8px] text-emerald-400 font-semibold flex items-center gap-0.5">
                        ✓ Ready
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-white leading-tight">{plannerData[plannerTopic].title}</h4>
                      
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Objectives:</span>
                        {plannerData[plannerTopic].objectives.map((obj, i) => (
                          <p key={i} className="text-gray-300 text-[10px] leading-tight">
                            • {obj}
                          </p>
                        ))}
                      </div>

                      <div className="pt-0.5">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block">Class Activity:</span>
                        <p className="text-[10px] text-gray-300 italic leading-snug">"{plannerData[plannerTopic].activity}"</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Interactive Visuals (1 Col x 1 Row) */}
          <BentoCard>
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold tracking-widest uppercase font-sans">
                  Slides
                </span>
                <h4 className="text-base font-bold text-white font-space mt-2">
                  Bring Concepts to Life.
                </h4>
                <p className="text-gray-400 text-[10px] mt-1 font-sans">
                  Orbit model speed controls:
                </p>
              </div>

              {/* Modern Slide Graphic with Orbit Speed control */}
              <div className="relative h-28 bg-white/[0.02] border border-white/10 rounded-xl flex flex-col items-center justify-center p-3">
                <div className="relative w-14 h-14 flex items-center justify-center bg-white/[0.01] rounded-full border border-white/5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10 - orbitSpeed, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 border border-dashed border-emerald-500/40 rounded-full"
                  />
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] z-10">
                    <HiPhotograph size={10} />
                  </div>
                  {/* Orbiting particle */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8 - orbitSpeed, repeat: Infinity, ease: 'linear' }}
                    className="absolute w-14 h-14"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  </motion.div>
                </div>

                <div className="w-full px-2 mt-2">
                  <input
                    type="range"
                    min="1"
                    max="9"
                    value={orbitSpeed}
                    onChange={(e) => setOrbitSpeed(Number(e.target.value))}
                    className="w-full appearance-none cursor-pointer accent-emerald-400"
                    style={{
                      height: '3px',
                      background: `linear-gradient(to right, #34d399 0%, #34d399 ${((orbitSpeed - 1) / 8) * 100}%, rgba(255,255,255,0.1) ${((orbitSpeed - 1) / 8) * 100}%, rgba(255,255,255,0.1) 100%)`,
                      borderRadius: '999px',
                    }}
                  />
                  <div className="flex justify-between text-[6px] text-gray-500 font-semibold mt-1 uppercase tracking-wide">
                    <span>Slow</span>
                    <span>Speed: {orbitSpeed}x</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 font-medium font-sans">
                Generates vector slides for physics & chemistry instantly.
              </div>
            </div>
          </BentoCard>

          {/* Card 3: Math Helper (1 Col x 1 Row) */}
          <BentoCard>
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold tracking-widest uppercase font-sans">
                  Math
                </span>
                <h4 className="text-base font-bold text-white font-space mt-2">
                  Deconstruct Mathematics.
                </h4>
                <p className="text-gray-400 text-[10px] mt-1 font-sans">
                  Tap to solve equations:
                </p>

                {/* Math Type Selector */}
                <div className="flex gap-2 mt-3 font-sans">
                  <button
                    onClick={() => setMathTab('algebra')}
                    className={`px-3 py-1 rounded-full text-[8px] font-bold border transition-colors ${
                      mathTab === 'algebra' ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/10 text-gray-400 bg-white/[0.01]'
                    }`}
                  >
                    Algebra
                  </button>
                  <button
                    onClick={() => setMathTab('calculus')}
                    className={`px-3 py-1 rounded-full text-[8px] font-bold border transition-colors ${
                      mathTab === 'calculus' ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/10 text-gray-400 bg-white/[0.01]'
                    }`}
                  >
                    Calculus
                  </button>
                </div>
              </div>

              {/* Math Solution Card */}
              <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-center gap-2 font-sans">
                <div className="text-white text-xs font-bold border border-white/10 p-2 rounded bg-white/[0.01] text-center">
                  {mathSolutions[mathTab].equation}
                </div>
                <div className="space-y-1.5 my-1">
                  {mathSolutions[mathTab].steps.map((step, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.3 }}
                      key={idx}
                      className={idx === mathSolutions[mathTab].steps.length - 1 ? "text-emerald-400 font-bold text-[10px] flex items-center gap-1" : "text-gray-300 text-[10px]"}
                    >
                      {idx === mathSolutions[mathTab].steps.length - 1 && <span className="text-emerald-500">✔</span>}
                      {step}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 4: Hyper-Local Content (1 Col x 1 Row) */}
          <BentoCard>
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold tracking-widest uppercase font-sans">
                  Languages
                </span>
                <h4 className="text-base font-bold text-white font-space mt-2">
                  Regional Translation.
                </h4>
                <p className="text-gray-400 text-[10px] mt-1 font-sans">
                  Select a language to translate:
                </p>

                {/* Translation Language Tabs */}
                <div className="flex gap-1.5 mt-3 font-sans">
                  {Object.keys(translations).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setTransLang(lang)}
                      className={`px-3 py-1 rounded-full text-[8px] font-bold border transition-colors ${
                        transLang === lang ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/10 text-gray-400 bg-white/[0.01]'
                      }`}
                    >
                      {lang === 'hi' ? 'Hindi' : lang === 'te' ? 'Telugu' : 'Tamil'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Translation sheet */}
              <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-center font-sans">
                <span className="text-[7px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                  🇮🇳 TRANSLATION:
                </span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={transLang}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-white leading-relaxed font-semibold italic"
                  >
                    "{translations[transLang]}"
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </BentoCard>

          {/* Card 5: Story Generator (Double size - 3 Cols x 1 Row) */}
          <BentoCard className="md:col-span-3">
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold tracking-widest uppercase font-sans">
                  Stories
                </span>
                <h4 className="text-xl font-bold text-white font-space mt-2">
                  Learn Through Narratives & Stories.
                </h4>
                <p className="text-gray-400 text-xs mt-1 font-sans">
                  Generate moral-based concept stories to keep younger classes engaged:
                </p>
              </div>

              {/* Storybook Mockup Sheet */}
              <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3 min-h-[100px] font-sans">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={storyIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">
                        Topic: {stories[storyIndex].topic}
                      </span>
                      <p className="text-gray-200 text-xs leading-relaxed italic mt-1.5 max-w-xl">
                        "{stories[storyIndex].story}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Story control */}
              <div className="flex justify-between items-center font-sans">
                <button
                  onClick={() => setStoryIndex((prev) => (prev + 1) % stories.length)}
                  className="px-4 py-1.5 rounded-full border border-white/10 hover:border-emerald-500/30 bg-white/[0.01] hover:bg-emerald-500/10 hover:text-emerald-400 text-gray-300 text-[10px] font-bold transition-all"
                >
                  📖 Next Story Concept
                </button>
                <Link
                  to="/login"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 uppercase tracking-wider"
                >
                  Generate E-Stories <HiArrowRight />
                </Link>
              </div>
            </div>
          </BentoCard>

          {/* Card 6: Knowledge Base Checklists (1 Col x 1 Row) */}
          <BentoCard>
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold tracking-widest uppercase font-sans">
                  NCERT Files
                </span>
                <h4 className="text-base font-bold text-white font-space mt-2">
                  Board Syllabus Indexer.
                </h4>
                <p className="text-gray-400 text-[10px] mt-1 font-sans">
                  Access textbook & guidelines repository:
                </p>
              </div>

              {/* Clean Academic Index List */}
              <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between gap-2 font-sans text-xs">
                <div className="space-y-2">
                  {[
                    { name: 'NCERT Math Class 10.pdf', size: '4.8 MB' },
                    { name: 'CBSE Syllabus 2026.pdf', size: '1.2 MB' },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/[0.04] pb-1.5">
                      <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                        <span className="text-emerald-400 text-sm">📁</span>
                        <span className="truncate text-gray-200 font-medium">{file.name}</span>
                      </div>
                      <span className="text-gray-500 text-[10px]">{file.size}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[9px] text-emerald-400 font-bold text-center flex items-center gap-1 justify-center mt-1">
                  ✓ Verified Board Guidelines
                </div>
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
