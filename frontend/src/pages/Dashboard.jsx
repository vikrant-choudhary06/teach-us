import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineCalculator,
  HiOutlineGlobe,
  HiOutlineBookOpen,
  HiOutlineDatabase,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineMenuAlt2,
  HiOutlineX,
  HiOutlineChevronRight,
  HiOutlineChat,
  HiOutlineStatusOnline,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineHand,
  HiOutlineCloudUpload,
} from 'react-icons/hi'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [userEmail, setUserEmail] = useState('educator@acharya.ai')
  const [userName, setUserName] = useState('Educator')
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [credits, setCredits] = useState(30)
  const navigate = useNavigate()

  const [uploadedPages, setUploadedPages] = useState([])
  const [digitizedResult, setDigitizedResult] = useState(null)

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      setUserEmail(savedEmail)
    }
    const savedInfo = localStorage.getItem('userInfo')
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo)
        if (info.name) {
          setUserName(info.name)
        }
      } catch (e) {
        console.error('Error parsing userInfo:', e)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userInfo')
    navigate('/login')
  }

  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: HiOutlineHome, description: 'Class summary & quick actions' },
    { id: 'flight-deck', name: 'Live Flight Deck', icon: HiOutlineStatusOnline, description: 'Live whiteboard & student response split-screen' },
    { id: 'library', name: 'My Library', icon: HiOutlineFolder, description: 'Access saved templates & generations' },
    { id: 'workspace', name: 'My Workspace', icon: HiOutlineClipboardList, description: 'Manage ongoing drafts & materials' },
    { id: 'planner', name: 'Lesson Planner', icon: HiOutlineCalendar, description: 'Create comprehensive lesson plans in seconds' },
    { id: 'digitizer', name: 'Paper Digitizer', icon: HiOutlineDocumentText, description: 'Digitize handwritten exams & assignments' },
    { id: 'visual-aids', name: 'Visual Aids', icon: HiOutlineSparkles, description: 'Create engaging diagrams and charts for your lessons' },
    { id: 'math-helper', name: 'Math Helper', icon: HiOutlineCalculator, description: 'Solve any math problem with step-by-step explanations' },
    { id: 'hyper-local', name: 'Hyper-Local Content', icon: HiOutlineGlobe, description: "Create content that resonates with your students' region" },
    { id: 'story', name: 'Story Generator', icon: HiOutlineBookOpen, description: 'Generate educational narratives and case studies' },
    { id: 'knowledge-base', name: 'Knowledge Base', icon: HiOutlineDatabase, description: 'Upload documents to create custom learning contexts' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab setActiveTab={setActiveTab} menuItems={menuItems} userEmail={userEmail} userName={userName} />
      case 'flight-deck':
        return <LiveFlightDeck digitizedResult={digitizedResult} setActiveTab={setActiveTab} />
      case 'digitizer':
        return (
          <PaperDigitizer
            uploadedPages={uploadedPages}
            setUploadedPages={setUploadedPages}
            digitizedResult={digitizedResult}
            setDigitizedResult={setDigitizedResult}
          />
        )
      default:
        return <FeatureWorkspace tabId={activeTab} menuItem={menuItems.find(item => item.id === activeTab)} />
    }
  }

  return (
    <div className="h-screen bg-[#020504] text-[#f1f5f9] flex font-sans overflow-hidden relative">
      {/* ── BACKGROUND ORBITS & GRID ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-300px] left-[-300px] w-[900px] h-[900px] rounded-full bg-emerald-500/[0.05] blur-[160px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[800px] h-[800px] rounded-full bg-green-500/[0.04] blur-[150px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-400/[0.02] blur-[100px]" />
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── FLOATING SPATIAL SIDEBAR (DESKTOP) ── */}
      <aside className={`hidden md:flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 shrink-0 border border-white/[0.1] bg-[#070b09]/60 backdrop-blur-2xl rounded-2xl py-6 relative z-10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20 px-3' : 'w-66 lg:w-72 px-5'
      }`}>
        {/* Logo and Brand */}
        <div className={`flex items-center gap-3 mb-6 shrink-0 relative group ${isSidebarCollapsed ? 'justify-center px-0' : 'px-2'}`}>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-center text-emerald-400 transition-all duration-300 relative group cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.05)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            {/* Default Book Icon */}
            <span className="block group-hover:hidden transition-all duration-300">
              <HiOutlineBookOpen size={16} />
            </span>

            {/* Hover Layout Sidebar Icon */}
            <span className="hidden group-hover:block transition-all duration-300">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </span>
          </button>
          {!isSidebarCollapsed && (
            <span className="text-lg font-extrabold tracking-tight text-white font-space flex items-center gap-1.5">
              Acharya <span className="text-emerald-400 font-bold">AI</span>
            </span>
          )}
        </div>

        {/* Dynamic Scrollable Navigation */}
        <nav className={`flex-1 space-y-1 pr-1 overflow-y-auto ${isSidebarCollapsed ? 'scrollbar-none' : 'custom-sidebar-scroll'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center rounded-xl text-left text-sm font-bold tracking-wide font-space transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.1)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  } ${isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-3'}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-emerald-400 transition-colors'} />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </div>
                  {!isSidebarCollapsed && isActive && (
                    <motion.span
                      layoutId="sidebarActiveDot"
                      className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Sidebar Footer (Credits + Profile) */}
        <div className="pt-5 border-t border-white/[0.1] space-y-4 shrink-0 mt-3">
          {/* Custom Credit System */}
          {!isSidebarCollapsed ? (
            <div className="bg-[#0b100d]/80 border border-white/[0.06] p-3.5 rounded-xl shadow-inner">
              <div className="flex justify-between items-center text-xs font-black tracking-wider text-gray-300 uppercase font-space">
                <span>Class Credits</span>
                <span className="text-emerald-400 font-extrabold">{credits} / 30</span>
              </div>
              <div className="w-full bg-[#18231d] rounded-full h-2.5 mt-2.5 overflow-hidden border border-white/[0.02]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(credits / 30) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="bg-gradient-to-r from-emerald-400 to-green-400 h-full rounded-full shadow-[0_0_8px_#10b981]"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`Credits: ${credits} / 30`}>
              <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                {credits}
              </span>
            </div>
          )}

          {/* Profile Card */}
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-black text-emerald-400 text-sm shrink-0 uppercase">
                  {(userName || userEmail).substring(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-black text-white truncate leading-none">{userName}</p>
                  <p className="text-xs text-gray-400 truncate mt-1.5 leading-none font-medium">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 shrink-0"
                title="Sign Out"
              >
                <HiOutlineLogout size={16} />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-lg bg-white/[0.03] hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all shrink-0 cursor-pointer"
                title="Sign Out"
              >
                <HiOutlineLogout size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR DRAW ── */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-[#070b09] border-r border-[#1f2924]/80 p-5 z-50 md:hidden flex flex-col justify-between"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                      <HiOutlineBookOpen className="text-black" size={18} />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-white font-space">
                      Acharya <span className="text-emerald-400 font-bold">AI</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg border border-white/10 text-white transition-colors"
                  >
                    <HiOutlineX size={18} />
                  </button>
                </div>

                <nav className="flex-1 space-y-1.5 custom-sidebar-scroll pr-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id)
                          setIsMobileSidebarOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-bold font-space transition-all duration-200 ${
                          isActive
                            ? 'text-white bg-emerald-500/10 border border-emerald-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </button>
                    )
                  })}
                </nav>

                <div className="pt-5 border-t border-[#1f2924]/80 space-y-4 shrink-0 mt-3">
                  <div className="px-1">
                    <div className="flex justify-between items-center text-xs font-black text-gray-300 font-space">
                      <span>CREDITS</span>
                      <span className="text-emerald-400 font-extrabold">{credits} / 30</span>
                    </div>
                    <div className="w-full bg-[#16201b] rounded-full h-2 mt-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(credits / 30) * 100}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white/[0.02] p-3 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center font-black text-emerald-400 text-sm">
                        {(userName || userEmail).substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-black text-white truncate">{userName}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400">
                      <HiOutlineLogout size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 custom-sidebar-scroll h-full">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.08] bg-[#020504]/80 backdrop-blur-md px-6 py-4.5 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] text-white md:hidden transition-colors"
            >
              <HiOutlineMenuAlt2 size={20} />
            </button>
            <div className="hidden md:block">
              <h1 className="text-sm sm:text-base font-extrabold font-space text-white flex items-center gap-2">
                Workspace <HiOutlineChevronRight className="text-gray-500" size={14} /> <span className="text-emerald-400">{menuItems.find(item => item.id === activeTab)?.name}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-48 lg:w-56 rounded-lg border border-white/[0.1] bg-white/[0.02] py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none transition-all"
              />
            </div>
            <button className="p-2.5 rounded-lg border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.06] text-white transition-colors relative">
              <HiOutlineBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Floating Agent Assistant */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className="w-12 h-12 rounded-full bg-[#10b981] hover:bg-emerald-400 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/30"
        >
          <HiOutlineChat size={22} />
        </button>
      </div>

      <AnimatePresence>
        {isAIChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.96 }}
            className="fixed bottom-18 right-5 w-80 sm:w-96 h-[400px] bg-[#070b09]/95 border border-white/[0.1] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-space">Acharya Helper</span>
              </div>
              <button onClick={() => setIsAIChatOpen(false)} className="text-gray-400 hover:text-white">
                <HiOutlineX size={18} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm text-gray-200">
              <div className="bg-white/[0.03] border border-white/[0.06] p-3.5 rounded-xl leading-relaxed font-medium">
                Welcome, Educator! I can help you generate worksheets, solve math tasks, digitize test notes, or draft case studies. Let me know what you want to construct!
              </div>
            </div>
            <div className="p-3 border-t border-white/[0.08] bg-white/[0.01]">
              <input
                type="text"
                placeholder="Ask your assistant..."
                className="w-full bg-[#0d120f] border border-white/[0.08] rounded-xl px-3 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── SPATIAL OVERVIEW TAB ── */
function OverviewTab({ setActiveTab, menuItems, userEmail, userName }) {
  const gridFeatures = menuItems.filter(
    (item) => item.id !== 'overview' && item.id !== 'library' && item.id !== 'workspace'
  )

  const summaryStats = [
    { label: 'Total Topics', value: 0, limit: 10, unit: 'topics', color: 'from-emerald-500 to-green-500' },
    { label: 'Assets Created', value: 3, limit: 12, unit: 'assets', color: 'from-emerald-400 to-emerald-600' },
    { label: 'Weekly Activity', value: 0, limit: 5, unit: 'actions', color: 'from-green-400 to-emerald-500' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Title block */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black font-space tracking-tight text-white leading-none">
          Welcome Back, <span className="text-emerald-400 font-bold">{userName || userEmail}</span>
        </h2>
        <p className="text-gray-300 text-sm sm:text-base mt-2.5 font-semibold">
          Ready to create something amazing? Select a tool below to begin.
        </p>
      </div>

      {/* ── SPATIAL WEEKLY SUMMARY PANEL ── */}
      <div className="border border-white/[0.08] rounded-2xl bg-white/[0.02] p-5.5 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full bg-emerald-500/[0.04] blur-[80px] pointer-events-none" />

        <div className="flex items-center justify-between mb-4.5">
          <div className="flex items-center gap-2">
            <HiOutlineClipboardList className="text-emerald-400" size={20} />
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white font-space">Your Weekly Analytics</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {summaryStats.map((stat, i) => {
            const percentage = (stat.value / stat.limit) * 100
            return (
              <div
                key={i}
                className="p-5 border border-white/[0.06] bg-[#070b09]/80 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 shadow-md"
              >
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                  <div className="flex items-baseline gap-1.5 mt-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-space">{stat.value}</span>
                    <span className="text-xs sm:text-sm text-gray-400 font-semibold">/ {stat.limit} {stat.unit}</span>
                  </div>
                </div>

                {/* Progress bar meter */}
                <div className="mt-5">
                  <div className="w-full bg-white/[0.05] rounded-full h-2 overflow-hidden border border-white/[0.01]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── FEATURES INTERACTIVE GRID ── */}
      <div className="space-y-4.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-300 font-space">Workspace Features</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {gridFeatures.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="relative p-6.5 border border-white/[0.08] bg-[#070b09]/40 hover:bg-[#0c130f]/60 hover:border-emerald-500/35 hover:shadow-[0_10px_30px_rgba(16,185,129,0.06)] rounded-2xl transition-all duration-500 group cursor-pointer flex flex-col justify-between h-60 overflow-hidden"
              >
                {/* Custom top-right glow overlay */}
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/[0.03] group-hover:blur-xl transition-all duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-gray-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300 shadow">
                      <Icon size={18} />
                    </div>
                    {/* Glowing status pill */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/15 text-[10px] font-black text-emerald-400 font-space tracking-wide uppercase shadow-[0_0_8px_rgba(16,185,129,0.05)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active</span>
                    </div>
                  </div>
                  <h4 className="text-base font-black text-white mt-4 group-hover:text-emerald-400 transition-colors font-space tracking-tight leading-snug">
                    {feat.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2.5 line-clamp-2 leading-relaxed font-semibold group-hover:text-gray-200 transition-colors">
                    {feat.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-black text-gray-400 group-hover:text-emerald-400 transition-colors mt-6 pt-4 border-t border-white/[0.06]">
                  <span>Open workspace</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

/* ── FEATURE WORKSPACE PREVIEW ── */
function FeatureWorkspace({ tabId, menuItem }) {
  const Icon = menuItem.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={tabId}
      className="space-y-6"
    >
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 border border-white/[0.08] rounded-2xl bg-white/[0.02] backdrop-blur-md shadow-2xl">
        <div className="w-18 h-18 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-6 animate-pulse">
          <Icon size={30} />
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold font-space text-white mb-2">
          {menuItem.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 text-center max-w-sm leading-relaxed font-medium">
          {menuItem.description}. Describe the requirements for the {menuItem.name} feature and I will construct the user interface right away.
        </p>
        <button
          className="mt-6 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-emerald-500/30 text-xs sm:text-sm font-extrabold tracking-wide text-gray-200 hover:text-white transition-all active:scale-[0.98]"
          onClick={() => alert(`Ready to build the ${menuItem.name} module!`)}
        >
          Initialize Feature
        </button>
      </div>
    </motion.div>
  )
}


function LiveFlightDeck({ digitizedResult, setActiveTab }) {
  const [activeMode, setActiveMode] = useState('presentation') // 'presentation' | 'whiteboard'
  const [currentSlide, setCurrentSlide] = useState(1)
  const [brushColor, setBrushColor] = useState('#10b981')
  const [brushWidth, setBrushWidth] = useState(4)
  const [isDrawing, setIsDrawing] = useState(false)
  
  const [pdfUrl, setPdfUrl] = useState(null)
  const [pdfName, setPdfName] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handlePdfDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type === 'application/pdf') {
      loadPdf(files[0])
    } else {
      alert('Please upload a valid PDF file.')
    }
  }

  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0 && files[0].type === 'application/pdf') {
      loadPdf(files[0])
    } else {
      alert('Please upload a valid PDF file.')
    }
  }

  const loadPdf = (file) => {
    setIsUploading(true)
    const objectUrl = URL.createObjectURL(file)
    setPdfUrl(objectUrl)
    setPdfName(file.name)
    setIsUploading(false)
  }
  
  // Real-time simulated student states
  const [students, setStudents] = useState([
    { id: 1, name: 'Aarav Sharma', status: 'focused', lastActive: 'Active now' },
    { id: 2, name: 'Isha Patel', status: 'distracted', lastActive: '2m ago' },
    { id: 3, name: 'Rohan Das', status: 'focused', lastActive: 'Active now' },
    { id: 4, name: 'Sanya Sen', status: 'focused', lastActive: 'Active now' },
    { id: 5, name: 'Aditya Verma', status: 'distracted', lastActive: '5m ago' },
    { id: 6, name: 'Neha Rao', status: 'focused', lastActive: 'Active now' },
  ])

  // Active Hand-raises queue
  const [handRaises, setHandRaises] = useState([
    { id: 1, name: 'Rohan Das', time: 'Just now' },
    { id: 2, name: 'Aditya Verma', time: '1m ago' },
  ])

  // Poll state
  const [poll, setPoll] = useState({
    question: 'Are you following the explanation of Convolutional neural networks?',
    options: [
      { id: 'a', label: 'Yes, makes perfect sense', votes: 14 },
      { id: 'b', label: 'Need another example', votes: 7 },
      { id: 'c', label: 'Completely lost', votes: 3 },
    ],
    totalVotes: 24,
    isActive: true,
  })

  const canvasRef = useRef(null)

  // Simulation: toggle student focus states and votes periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Toggle a random student's state
      setStudents(prev => prev.map(s => {
        if (Math.random() > 0.7) {
          const newStatus = s.status === 'focused' ? 'distracted' : 'focused'
          return { ...s, status: newStatus, lastActive: newStatus === 'focused' ? 'Active now' : 'Tabbed out' }
        }
        return s
      }))

      // Increment a random poll option if poll is active
      setPoll(prev => {
        if (!prev.isActive) return prev
        const randomOptIndex = Math.floor(Math.random() * prev.options.length)
        const updatedOptions = prev.options.map((opt, idx) => {
          if (idx === randomOptIndex) {
            return { ...opt, votes: opt.votes + 1 }
          }
          return opt
        })
        return {
          ...prev,
          options: updatedOptions,
          totalVotes: prev.totalVotes + 1
        }
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Canvas Size Setup on mode switch
  useEffect(() => {
    if (activeMode === 'whiteboard' && canvasRef.current) {
      const canvas = canvasRef.current
      const container = canvas.parentElement
      canvas.width = container.clientWidth
      canvas.height = Math.max(container.clientHeight, 350)
      const ctx = canvas.getContext('2d')
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Draw grid helper on whiteboard for spatial style
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.03)'
      ctx.lineWidth = 1
      const step = 20
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }
  }, [activeMode])

  // Canvas drawing handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushWidth
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Redraw grid helper
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.03)'
    ctx.lineWidth = 1
    const step = 20
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }
  }

  const handleAcknowledgeHand = (id) => {
    setHandRaises(prev => prev.filter(item => item.id !== id))
  }

  const handleResetPoll = () => {
    setPoll({
      question: 'Are you following the explanation of Convolutional neural networks?',
      options: [
        { id: 'a', label: 'Yes, makes perfect sense', votes: 0 },
        { id: 'b', label: 'Need another example', votes: 0 },
        { id: 'c', label: 'Completely lost', votes: 0 },
      ],
      totalVotes: 0,
      isActive: true,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-4 w-full h-full"
    >
      {/* Workspace Toolbar */}
      <div className="border border-white/[0.08] bg-white/[0.02] p-4.5 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveMode('presentation')}
            className={`px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-space transition-all duration-300 ${
              activeMode === 'presentation'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35'
                : 'text-gray-400 hover:text-white border border-transparent hover:bg-white/[0.03]'
            }`}
          >
            Lecture Slides
          </button>
          <button
            onClick={() => setActiveMode('whiteboard')}
            className={`px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-space transition-all duration-300 ${
              activeMode === 'whiteboard'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35'
                : 'text-gray-400 hover:text-white border border-transparent hover:bg-white/[0.03]'
            }`}
          >
            Interactive Canvas
          </button>
        </div>

        {/* Whiteboard Color & Clear Controls */}
        {activeMode === 'whiteboard' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-[#0a0f0c] p-1.5 rounded-lg border border-white/[0.05]">
              {['#10b981', '#3b82f6', '#ef4444', '#ffffff'].map((color) => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    brushColor === color ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'border-transparent hover:scale-105'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={clearCanvas}
              className="p-2 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 transition-colors"
              title="Clear Board"
            >
              <HiOutlineTrash size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Live Presentation screen or Canvas drawing container */}
      <div className="border border-white/[0.08] bg-[#050907]/90 rounded-2xl h-[520px] relative overflow-hidden flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {activeMode === 'presentation' && (
          pdfUrl ? (
            /* presentation screen with actual PDF viewer */
            <div className="flex-1 flex flex-col justify-between relative animate-fadeIn h-full">
              {/* PDF Viewer Header Toolbar */}
              <div className="bg-[#0b100d] border-b border-white/[0.08] px-5 py-3 flex items-center justify-between text-xs text-gray-300 font-sans select-none shrink-0">
                <div className="flex items-center gap-3">
                  {/* Red PDF Icon */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-extrabold font-space truncate max-w-[150px] sm:max-w-xs text-white">{pdfName}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(pdfUrl);
                      setPdfUrl(null);
                      setPdfName('');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-[10px] text-red-400 hover:bg-red-500/10 transition-colors font-bold font-space"
                  >
                    Clear PDF
                  </button>
                  {/* PDF Badge */}
                  <span className="text-[9px] font-black tracking-widest text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded uppercase font-space border border-[#10b981]/20">
                    Live View
                  </span>
                </div>
              </div>

              {/* PDF Document Viewport (Actual Iframe) */}
              <div className="flex-1 w-full bg-[#181c19] overflow-hidden h-full">
                <iframe 
                  src={pdfUrl} 
                  className="w-full h-full border-none bg-white" 
                  title="Lecture PDF Document"
                />
              </div>
            </div>
          ) : (
            /* drag & drop PDF zone inside LECTURE SLIDES */
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handlePdfDrop}
              onClick={() => fileInputRef.current.click()}
              className={`flex-1 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 border-2 border-dashed m-6 rounded-2xl ${
                isDragOver 
                  ? 'border-emerald-400 bg-emerald-500/5' 
                  : 'border-[#2b312e] bg-[#181c19] hover:bg-[#1b1f1c]'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePdfChange} 
                accept=".pdf"
                className="hidden" 
              />
              {isUploading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  <p className="text-xs sm:text-sm font-space font-extrabold text-emerald-400 uppercase tracking-widest animate-pulse">
                    Loading PDF document...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <HiOutlineCloudUpload size={28} />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-xl font-bold font-space text-white tracking-tight">Drag & Drop Lecture PDF</h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
                      Drop your presentation PDF directly here to display it as-is.
                    </p>
                  </div>
                  <span className="text-xs text-[#525d57] font-semibold">
                    Click to browse files (PDF only)
                  </span>
                </div>
              )}
            </div>
          )
        )}

        {activeMode === 'whiteboard' && (
          /* interactive board canvas */
          <div className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden animate-fadeIn">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="absolute inset-0 block w-full h-full"
            />
            <div className="absolute bottom-4 right-4 pointer-events-none bg-black/40 border border-white/[0.06] backdrop-blur-md px-3.5 py-2 rounded-xl text-xs text-gray-400 font-semibold flex items-center gap-2">
              <HiOutlinePencil className="text-emerald-400" size={14} />
              <span>Draw directly here</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── INTERACTIVE PAPER DIGITIZER WORKSPACE ── */
function PaperDigitizer({ uploadedPages, setUploadedPages, digitizedResult, setDigitizedResult }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDigitizing, setIsDigitizing] = useState(false)
  
  const fileInputRef = useRef(null)

  const handleFileDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    addMockPages(files)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    addMockPages(files)
  }

  const addMockPages = (files) => {
    const newPages = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      id: Date.now() + Math.random()
    }))
    setUploadedPages(prev => [...prev, ...newPages])
  }

  const clearUploadedPages = () => {
    setUploadedPages([])
    setDigitizedResult(null)
  }

  const runDigitization = () => {
    setIsDigitizing(true)
    setTimeout(() => {
      setDigitizedResult({
        title: 'INGESTED QUESTION PAPER - MATH 101',
        subtitle: 'Processed via Acharya AI OCR engine',
        sections: [
          {
            title: 'Section A: Calculus Foundations',
            questions: [
              'Q1. Evaluate the limit: lim(x -> 0) [sin(5x) / 2x]. (3 Marks)',
              'Q2. Find the derivative of f(x) = e^(3x^2 - 5x + 2). (4 Marks)',
              'Q3. Compute the integral of x^3 ln(x) dx using integration by parts. (5 Marks)'
            ]
          },
          {
            title: 'Section B: Matrix Algebra',
            questions: [
              'Q4. For the matrix A = [[3, 1], [2, 4]], calculate the eigenvalues and eigenvectors. (6 Marks)',
              'Q5. Determine if the vector space dimension matches the kernel dimension of matrix T. (7 Marks)'
            ]
          }
        ]
      })
      setIsDigitizing(false)
    }, 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
    >
      {/* LEFT: Paper Digitizer Card (4 columns) */}
      <div className="lg:col-span-4">
        <div className="border border-white/[0.04] bg-[#0c0d0d] p-6.5 rounded-2xl flex flex-col space-y-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white font-space">
              Paper Digitizer
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-semibold">
              Upload handwritten paper pages one by one.
            </p>
          </div>

          {/* Dotted Upload Dropzone */}
          <div 
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-[#2b312e] border-dashed bg-[#181c19] hover:bg-[#1b1f1c] py-11 rounded-xl flex flex-col items-center justify-center space-y-3.5 cursor-pointer transition-all duration-300 ${
              isDragOver ? 'border-emerald-400 bg-emerald-500/5' : ''
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              className="hidden" 
            />
            
            {/* Custom SVG cloud upload icon matching reference image */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#525d57" strokeWidth="1.5">
              <path d="M12 15V9M9 12l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 16.5A4.5 4.5 0 0 0 17 7.5h-.7A7 7 0 1 0 4.5 14a4 4 0 0 0 0 5H18a4 4 0 0 0 0-7.5Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <span className="text-xs text-[#525d57] font-semibold">
              Click or drag to add pages
            </span>
          </div>

          {/* Uploaded Pages Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">
                Uploaded Pages
              </h4>
              {uploadedPages.length > 0 && (
                <button 
                  onClick={clearUploadedPages}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase font-space"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {uploadedPages.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto custom-sidebar-scroll pr-1">
                {uploadedPages.map((page, index) => (
                  <div key={page.id} className="flex justify-between items-center bg-[#131815] border border-white/[0.03] p-2.5 rounded-lg text-xs">
                    <span className="text-gray-300 truncate font-semibold max-w-[150px]">
                      Page {index + 1}: {page.name}
                    </span>
                    <span className="text-gray-500 text-[10px]">
                      {page.size}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 py-2 font-medium">
                No pages uploaded yet.
              </div>
            )}
          </div>

          {/* Olive Green Digitizer Button */}
          <button 
            disabled={uploadedPages.length === 0 || isDigitizing}
            onClick={runDigitization}
            className="w-full bg-[#5b892a] disabled:opacity-40 disabled:text-[#8ba76e] text-white font-semibold py-3 rounded-lg text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center hover:bg-[#6b9c32] active:scale-[0.99]"
          >
            {/* Crop Scan Icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
            </svg>
            Digitize Page by Page
          </button>
        </div>
      </div>

      {/* RIGHT: Digitized Result Card (8 columns) */}
      <div className="lg:col-span-8">
        <div className="border border-white/[0.04] bg-[#0c0d0d] p-6.5 rounded-2xl min-h-[490px] flex flex-col justify-between shadow-xl">
          {isDigitizing ? (
            /* Loading State */
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <p className="text-xs sm:text-sm font-space font-extrabold text-emerald-400 uppercase tracking-widest animate-pulse">
                Recognizing handwriting & generating LaTeX structures...
              </p>
            </div>
          ) : digitizedResult ? (
            /* Digitized Result View */
            <div className="flex-1 flex flex-col justify-between animate-fadeIn">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white font-space">
                      {digitizedResult.title}
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold mt-1">
                      {digitizedResult.subtitle}
                    </p>
                  </div>
                  
                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(digitizedResult, null, 2))
                        alert('Copied to clipboard!')
                      }}
                      className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-xs font-bold text-gray-300 hover:text-white transition-colors"
                    >
                      Copy JSON
                    </button>
                    <button 
                      onClick={() => alert('PDF report exported!')}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {digitizedResult.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-400 font-space tracking-wide uppercase border-l-2 border-emerald-500 pl-2.5">
                        {section.title}
                      </h4>
                      <ul className="space-y-2.5">
                        {section.questions.map((question, qIdx) => (
                          <li key={qIdx} className="text-xs sm:text-sm text-gray-200 bg-[#121614] border border-white/[0.02] p-3.5 rounded-xl leading-relaxed select-text font-medium">
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-4.5 mt-6 text-right">
                <span className="text-[10px] text-gray-500 font-space tracking-widest uppercase font-black">
                  Acharya AI Digitizer Module V1.0
                </span>
              </div>
            </div>
          ) : (
            /* Reference Image Muted Result state */
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white font-space leading-tight">
                  Digitized Result
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-semibold">
                  Your AI-formatted question paper will be built here.
                </p>
              </div>

              {/* Muted Center Display from reference image */}
              <div className="my-auto flex flex-col items-center justify-center space-y-4">
                {/* File Document Icon matching reference */}
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#262d29" strokeWidth="1.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-space text-gray-400 font-bold">
                    Turn physical papers into digital assets.
                  </p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    Upload an image of a question paper to get started.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-transparent" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}


