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
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineSupport,
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineMenuAlt2,
  HiOutlineX,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineChat,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineStatusOnline,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineHand,
  HiSelector,
  HiOutlineCloudUpload,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineColorSwatch,
  HiOutlineKey,
  HiOutlineQuestionMarkCircle,
  HiOutlineRefresh,
  HiOutlineExternalLink,
  HiOutlineLightningBolt,
  HiOutlineAcademicCap,
  HiOutlineClock,
  HiOutlineStar,
} from 'react-icons/hi'

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const email = localStorage.getItem('userEmail')
    if (email && email !== 'educator@acharya.ai') {
      const saved = localStorage.getItem(`acharyai_${email}_isDarkMode`)
      if (saved !== null) return saved === 'true'
    }
    const saved = localStorage.getItem('isDarkMode')
    return saved !== null ? saved === 'true' : true
  })
  const [colorTheme, setColorTheme] = useState(() => {
    const email = localStorage.getItem('userEmail')
    if (email && email !== 'educator@acharya.ai') {
      return localStorage.getItem(`acharyai_${email}_colorTheme`) || 'fresh'
    }
    return localStorage.getItem('colorTheme') || 'fresh'
  })
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'overview'
  })
  const [settingsTab, setSettingsTab] = useState(() => {
    return localStorage.getItem('settingsTab') || 'appearance'
  })

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem('settingsTab', settingsTab)
  }, [settingsTab])
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [userEmail, setUserEmail] = useState('educator@acharya.ai')
  const [userName, setUserName] = useState(() => {
    const savedName = localStorage.getItem('profile_name')
    if (savedName) return savedName
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (savedInfo) {
        const info = JSON.parse(savedInfo)
        if (info.name) return info.name
      }
    } catch (e) {}
    return 'Educator'
  })
  const [userPicture, setUserPicture] = useState('')
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [credits, setCredits] = useState(() => {
    const email = localStorage.getItem('userEmail')
    if (email && email !== 'educator@acharya.ai') {
      const saved = localStorage.getItem(`acharyai_${email}_credits`)
      if (saved !== null) return parseInt(saved, 10)
    }
    return 30
  })
  const [totalTopics, setTotalTopics] = useState(() => {
    return parseInt(localStorage.getItem('stats_totalTopics') || '0', 10)
  })
  const [assetsCreated, setAssetsCreated] = useState(() => {
    return parseInt(localStorage.getItem('stats_assetsCreated') || '0', 10)
  })
  const [weeklyActivity, setWeeklyActivity] = useState(() => {
    return parseInt(localStorage.getItem('stats_weeklyActivity') || '0', 10)
  })
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('stats_totalTopics', totalTopics.toString())
  }, [totalTopics])

  useEffect(() => {
    localStorage.setItem('stats_assetsCreated', assetsCreated.toString())
  }, [assetsCreated])

  useEffect(() => {
    localStorage.setItem('stats_weeklyActivity', weeklyActivity.toString())
  }, [weeklyActivity])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--x', `${x}px`)
    e.currentTarget.style.setProperty('--y', `${y}px`)
  }

  const markToolUsed = (toolId) => {
    try {
      const used = JSON.parse(localStorage.getItem('used_ai_tools') || '[]')
      if (!used.includes(toolId)) {
        used.push(toolId)
        localStorage.setItem('used_ai_tools', JSON.stringify(used))
      }
    } catch (e) {}
  }

  const [uploadedPages, setUploadedPages] = useState(() => {
    const email = localStorage.getItem('userEmail')
    if (email && email !== 'educator@acharya.ai') {
      const saved = localStorage.getItem(`acharyai_${email}_uploadedPages`)
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return []
  })
  const [digitizedResult, setDigitizedResult] = useState(() => {
    const email = localStorage.getItem('userEmail')
    if (email && email !== 'educator@acharya.ai') {
      const saved = localStorage.getItem(`acharyai_${email}_digitizedResult`)
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return null
  })

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('real_students')
      return saved ? JSON.parse(saved) : [
        { id: 1, name: 'Aarav Sharma', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Submitted (Graded)', currentProgress: 'Reviewing slides', doubt: null, row: 0, col: 0, grade: '23/25', aiFeedback: 'Well structured and clear math definitions.' },
        { id: 2, name: 'Isha Patel', status: 'distracted', lastActive: '2m ago', assignmentStatus: 'Pending', currentProgress: 'Idle', doubt: null, row: 0, col: 1, grade: 'N/A', aiFeedback: '' },
        { id: 3, name: 'Rohan Das', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Not Started', currentProgress: 'Reading PDF', doubt: 'Need help with Convolutional step', row: 0, col: 2, grade: 'N/A', aiFeedback: '' },
        { id: 4, name: 'Sanya Sen', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Submitted (Pending Grade)', currentProgress: 'Note-taking', doubt: null, row: 1, col: 0, grade: 'N/A', aiFeedback: '' },
        { id: 5, name: 'Aditya Verma', status: 'distracted', lastActive: '5m ago', assignmentStatus: 'Needs Revision', currentProgress: 'Tabbed out', doubt: 'How does max pooling work?', row: 1, col: 1, grade: '12/25', aiFeedback: 'Incomplete matrix computations in section B.' },
        { id: 6, name: 'Neha Rao', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Submitted (Graded)', currentProgress: 'Reading PDF', doubt: null, row: 1, col: 2, grade: '24/25', aiFeedback: 'Excellent reasoning and detailed calculus proofs.' },
        { id: 7, name: 'Vikram Singh', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Pending', currentProgress: 'Answering Poll', doubt: null, row: 2, col: 0, grade: 'N/A', aiFeedback: '' },
        { id: 8, name: 'Ananya Goel', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Submitted (Graded)', currentProgress: 'Reading PDF', doubt: null, row: 2, col: 1, grade: '21/25', aiFeedback: 'Solid integration steps. Keep practicing limits.' },
        { id: 9, name: 'Kabir Mehta', status: 'distracted', lastActive: '3m ago', assignmentStatus: 'Not Started', currentProgress: 'Idle', doubt: null, row: 2, col: 2, grade: 'N/A', aiFeedback: '' },
        { id: 10, name: 'Priya Nair', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Submitted (Pending Grade)', currentProgress: 'Taking notes', doubt: null, row: 3, col: 0, grade: 'N/A', aiFeedback: '' },
        { id: 11, name: 'Rishi Kapoor', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Pending', currentProgress: 'Reviewing slides', doubt: null, row: 3, col: 1, grade: 'N/A', aiFeedback: '' },
        { id: 12, name: 'Tara Iyer', status: 'focused', lastActive: 'Active now', assignmentStatus: 'Submitted (Graded)', currentProgress: 'Answering Poll', doubt: null, row: 3, col: 2, grade: '22/25', aiFeedback: 'Good layout and formula definitions.' },
      ]
    } catch (e) {
      return []
    }
  })

  const [deployedMaterial, setDeployedMaterial] = useState(() => {
    const email = localStorage.getItem('userEmail')
    if (email && email !== 'educator@acharya.ai') {
      const saved = localStorage.getItem(`acharyai_${email}_deployedMaterial`)
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
      }
    }
    return null
  })

  // Toast notification state
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const pushWorksheetToClass = (sourceName, contentSummary) => {
    setStudents(prev => prev.map(s => ({
      ...s,
      currentProgress: `Solving: ${contentSummary}`,
      status: 'focused',
    })))
    showToast(`Worksheet from "${sourceName}" pushed to all ${students.length} student workstations!`, 'success')
  }

  useEffect(() => {
    if (!localStorage.getItem('profile_memberSince')) {
      const date = new Date()
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const formattedDate = `${day}/${month}/${year}`
      localStorage.setItem('profile_memberSince', formattedDate)
    }
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      setUserEmail(savedEmail)
    }
    const savedInfo = localStorage.getItem('userInfo')
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo)
        const savedName = localStorage.getItem('profile_name')
        if (savedName) {
          setUserName(savedName)
        } else if (info.name) {
          setUserName(info.name)
        }
        if (info.picture) {
          setUserPicture(info.picture)
        }
        if (info.token) {
          const fetchStudents = async () => {
            try {
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
              const res = await fetch(`${API_URL}/api/students`, {
                headers: {
                  'Authorization': `Bearer ${info.token}`
                }
              })
              if (res.ok) {
                const data = await res.json()
                if (Array.isArray(data)) {
                  const mapped = data.map((st, index) => ({
                    id: st._id,
                    name: st.name,
                    email: st.email || '',
                    status: 'focused',
                    lastActive: 'Active now',
                    assignmentStatus: 'Not Started',
                    currentProgress: 'Idle',
                    doubt: null,
                    row: Math.floor(index / 3),
                    col: index % 3,
                    grade: 'N/A',
                    aiFeedback: ''
                  }))
                  setStudents(mapped)
                  localStorage.setItem('real_students', JSON.stringify(mapped))
                }
              }
            } catch (err) {
              console.error('Failed to fetch students from backend:', err)
            }
          }
          fetchStudents()

          const fetchProfile = async () => {
            try {
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
              const res = await fetch(`${API_URL}/api/auth/profile`, {
                headers: {
                  'Authorization': `Bearer ${info.token}`
                }
              })
              if (res.ok) {
                const data = await res.json()
                if (data.createdAt) {
                  const date = new Date(data.createdAt)
                  const day = String(date.getDate()).padStart(2, '0')
                  const month = String(date.getMonth() + 1).padStart(2, '0')
                  const year = date.getFullYear()
                  const formattedDate = `${day}/${month}/${year}`
                  localStorage.setItem('profile_memberSince', formattedDate)
                }
              }
            } catch (err) {
              console.error('Failed to fetch user profile:', err)
            }
          }
          fetchProfile()
        }
      } catch (e) {
        console.error('Error parsing userInfo:', e)
      }
    }

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        setActiveTab('profile')
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        setActiveTab('settings')
        setSettingsTab('appearance')
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'q') {
        e.preventDefault()
        handleLogout()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // User-specific State Syncing Effects
  useEffect(() => {
    if (userEmail && userEmail !== 'educator@acharya.ai') {
      localStorage.setItem(`acharyai_${userEmail}_students`, JSON.stringify(students))
    }
  }, [students, userEmail])

  useEffect(() => {
    if (userEmail && userEmail !== 'educator@acharya.ai') {
      localStorage.setItem(`acharyai_${userEmail}_credits`, credits.toString())
    }
  }, [credits, userEmail])

  useEffect(() => {
    if (userEmail && userEmail !== 'educator@acharya.ai') {
      localStorage.setItem(`acharyai_${userEmail}_uploadedPages`, JSON.stringify(uploadedPages))
    }
  }, [uploadedPages, userEmail])

  useEffect(() => {
    if (userEmail && userEmail !== 'educator@acharya.ai') {
      localStorage.setItem(`acharyai_${userEmail}_digitizedResult`, JSON.stringify(digitizedResult))
    }
  }, [digitizedResult, userEmail])

  useEffect(() => {
    if (userEmail && userEmail !== 'educator@acharya.ai') {
      localStorage.setItem(`acharyai_${userEmail}_deployedMaterial`, JSON.stringify(deployedMaterial))
    }
  }, [deployedMaterial, userEmail])

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('activeTab')
    localStorage.removeItem('settingsTab')
    navigate('/login')
  }

  const handleAddStudent = async (name, email) => {
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      if (!info.token) return

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${info.token}`
        },
        body: JSON.stringify({ name, email, classroom: 'General' })
      })

      if (res.ok) {
        const newStudent = await res.json()
        showToast(`Student "${name}" enrolled successfully!`, 'success')
        
        // Fetch updated student list
        const reRes = await fetch(`${API_URL}/api/students`, {
          headers: {
            'Authorization': `Bearer ${info.token}`
          }
        })
        if (reRes.ok) {
          const reData = await reRes.json()
          const mapped = reData.map((st, index) => ({
            id: st._id,
            name: st.name,
            email: st.email || '',
            status: 'focused',
            lastActive: 'Active now',
            assignmentStatus: 'Not Started',
            currentProgress: 'Idle',
            doubt: null,
            row: Math.floor(index / 3),
            col: index % 3,
            grade: 'N/A',
            aiFeedback: ''
          }))
          setStudents(mapped)
          localStorage.setItem('real_students', JSON.stringify(mapped))
        }
      } else {
        const errData = await res.json()
        showToast(errData.message || 'Failed to add student.', 'error')
      }
    } catch (err) {
      console.error(err)
      // Offline fallback: save locally
      setStudents(prev => {
        const index = prev.length
        const updated = [...prev, {
          id: 'local-' + Date.now(),
          name,
          email,
          status: 'focused',
          lastActive: 'Active now',
          assignmentStatus: 'Not Started',
          currentProgress: 'Idle',
          doubt: null,
          row: Math.floor(index / 3),
          col: index % 3,
          grade: 'N/A',
          aiFeedback: ''
        }]
        localStorage.setItem('real_students', JSON.stringify(updated))
        return updated
      })
      showToast(`Student "${name}" added locally (Offline).`, 'success')
    }
  }

  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: HiOutlineHome, description: 'Class summary & quick actions' },
    { id: 'flight-deck', name: 'Live Flight Deck', icon: HiOutlineStatusOnline, description: 'Live whiteboard & student response split-screen' },
    { id: 'planner', name: 'Lesson Planner', icon: HiOutlineCalendar, description: 'Create comprehensive lesson plans in seconds' },
    { id: 'digitizer', name: 'Paper Digitizer', icon: HiOutlineDocumentText, description: 'Digitize handwritten exams & assignments' },
    { id: 'visual-aids', name: 'Visual Aids', icon: HiOutlineSparkles, description: 'Create engaging diagrams and charts for your lessons' },
    { id: 'math-helper', name: 'Math Helper', icon: HiOutlineCalculator, description: 'Solve any math problem with step-by-step explanations' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            setActiveTab={setActiveTab}
            menuItems={menuItems}
            userEmail={userEmail}
            userName={userName}
            totalTopics={totalTopics}
            assetsCreated={assetsCreated}
            weeklyActivity={weeklyActivity}
          />
        )
      case 'flight-deck':
        return (
          <LiveFlightDeck
            digitizedResult={digitizedResult}
            setActiveTab={setActiveTab}
            students={students}
            setStudents={setStudents}
            pushWorksheetToClass={pushWorksheetToClass}
            deployedMaterial={deployedMaterial}
            setDeployedMaterial={setDeployedMaterial}
            handleAddStudent={handleAddStudent}
          />
        )
      case 'math-helper':
        return (
          <MathHelper
            pushWorksheetToClass={pushWorksheetToClass}
            onProblemSolved={() => {
              setWeeklyActivity(prev => prev + 1)
              markToolUsed('math-helper')
            }}
          />
        )
      case 'digitizer':
        return (
          <PaperDigitizer
            uploadedPages={uploadedPages}
            setUploadedPages={setUploadedPages}
            digitizedResult={digitizedResult}
            setDigitizedResult={setDigitizedResult}
            students={students}
            setStudents={setStudents}
            showToast={showToast}
            onAssetCreated={() => {
              setAssetsCreated(prev => prev + 1)
              setWeeklyActivity(prev => prev + 1)
              markToolUsed('digitizer')
            }}
          />
        )
      case 'planner':
        return (
          <LessonPlanner
            setDeployedMaterial={setDeployedMaterial}
            setActiveTab={setActiveTab}
            showToast={showToast}
            onPlanGenerated={() => {
              setTotalTopics(prev => prev + 1)
              setAssetsCreated(prev => prev + 1)
              setWeeklyActivity(prev => prev + 1)
              markToolUsed('planner')
            }}
          />
        )
      case 'visual-aids':
        return (
          <VisualAids
            setDeployedMaterial={setDeployedMaterial}
            setActiveTab={setActiveTab}
            showToast={showToast}
            onAidGenerated={() => {
              setAssetsCreated(prev => prev + 1)
              setWeeklyActivity(prev => prev + 1)
              markToolUsed('visual-aids')
            }}
          />
        )
      case 'support':
        return <SupportView showToast={showToast} />
      case 'profile':
        return (
          <ProfileView
            showToast={showToast}
            userEmail={userEmail}
            userName={userName}
            totalTopics={totalTopics}
            assetsCreated={assetsCreated}
            totalStudents={students.length}
            weeklyActivity={weeklyActivity}
            onEditRedirect={() => {
              setActiveTab('settings')
              setSettingsTab('profile')
            }}
            setActiveTab={setActiveTab}
          />
        )
      case 'settings':
        return (
          <SettingsView
            showToast={showToast}
            userEmail={userEmail}
            userName={userName}
            setUserName={setUserName}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            currentTab={settingsTab}
            setCurrentTab={setSettingsTab}
            totalTopics={totalTopics}
            assetsCreated={assetsCreated}
          />
        )
      default:
        return <FeatureWorkspace tabId={activeTab} menuItem={menuItems.find(item => item.id === activeTab)} />
    }
  }

  return (
    <div onMouseMove={handleMouseMove} className={`h-screen bg-[#020504] text-[#f1f5f9] flex font-sans overflow-hidden relative theme-${colorTheme} ${!isDarkMode ? 'light-theme' : ''} premium-glow-global`}>
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
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      style={{ boxShadow: '0 0 10px var(--theme-glow, #10b981)' }}
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
            <div className="bg-[#0b100d]/80 border border-white/[0.06] p-4 rounded-xl shadow-inner space-y-3.5">
              {/* Row 1 */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <HiOutlineLightningBolt className="text-emerald-400" size={16} />
                  <span>Credits</span>
                </div>
                <span className="text-[10px] text-gray-500 font-semibold">Daily reset</span>
              </div>
              
              {/* Row 2 */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Daily Credits</span>
                <span className="text-white font-extrabold">{credits} / 30</span>
              </div>

              {/* Progress Bar Row */}
              <div className="w-full bg-[#18231d] rounded-full h-2 mt-2 overflow-hidden border border-white/[0.02]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(credits / 30) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ boxShadow: '0 0 6px var(--theme-glow, #10b981)' }}
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

          {/* Profile Card Wrapper */}
          <div className="relative">
            {/* Drop-up Menu */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-[#070b09] border border-black/[0.06] dark:border-white/[0.08] rounded-xl shadow-2xl z-50 p-1 flex flex-col divide-y divide-black/[0.04] dark:divide-white/[0.04] text-left select-none overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-3 flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white truncate">
                      {userName || userEmail}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5 font-medium">
                      {userEmail}
                    </span>
                  </div>

                  {/* Group 1 */}
                  <div className="py-1 w-full flex flex-col">
                    <button
                      onClick={() => {
                        setActiveTab('profile')
                        setIsProfileMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-emerald-500 text-gray-700 dark:text-gray-200 hover:text-white transition-all text-xs font-semibold group cursor-pointer block text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <HiOutlineUser className="text-gray-400 group-hover:text-white transition-colors" size={16} />
                          <span>My profile</span>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono font-medium group-hover:text-white/80 transition-colors">Ctrl+P</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('settings')
                        setSettingsTab('appearance')
                        setIsProfileMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-emerald-500 text-gray-700 dark:text-gray-200 hover:text-white transition-all text-xs font-semibold group cursor-pointer block text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <HiOutlineCog className="text-gray-400 group-hover:text-white transition-colors" size={16} />
                          <span>Settings</span>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono font-medium group-hover:text-white/80 transition-colors">Ctrl+S</span>
                      </div>
                    </button>
                  </div>

                  {/* Group 2 */}
                  <div className="py-1 w-full flex flex-col">
                    <button
                      onClick={() => {
                        setIsDarkMode(!isDarkMode)
                        setIsProfileMenuOpen(false)
                        showToast(`Theme switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode`, 'info')
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-emerald-500 text-gray-700 dark:text-gray-200 hover:text-white transition-all text-xs font-semibold group cursor-pointer block text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <HiOutlineMoon className="text-gray-400 group-hover:text-white transition-colors" size={16} />
                          <span>Dark Mode</span>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('support')
                        setIsProfileMenuOpen(false)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-emerald-500 text-gray-700 dark:text-gray-200 hover:text-white transition-all text-xs font-semibold group cursor-pointer block text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <HiOutlineSupport className="text-gray-400 group-hover:text-white transition-colors" size={16} />
                          <span>Support</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Group 3 */}
                  <div className="py-1 w-full flex flex-col">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white transition-all text-xs font-semibold group cursor-pointer block text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <HiOutlineLogout className="text-red-400 group-hover:text-white transition-colors" size={16} />
                          <span>Log out</span>
                        </div>
                        <span className="text-[10px] text-red-400 group-hover:text-white/80 font-mono font-medium transition-colors">Ctrl+Q</span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSidebarCollapsed ? (
              <div 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all cursor-pointer select-none ${isProfileMenuOpen ? 'bg-black/[0.03] dark:bg-white/[0.03]' : ''}`}
                title="Account Settings"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {localStorage.getItem('profile_image') || userPicture ? (
                    <img src={localStorage.getItem('profile_image') || userPicture} alt="Profile" className="w-9 h-9 rounded-full border border-emerald-500/20 object-cover shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-600 text-sm shrink-0 uppercase">
                      {(userName || userEmail).substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex flex-col text-left">
                    <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white truncate max-w-[120px] leading-tight">
                      {userName || userEmail}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 truncate max-w-[140px] mt-0.5 leading-none">
                      {userEmail}
                    </span>
                  </div>
                </div>
                <HiSelector className="text-gray-400 shrink-0" size={16} />
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold uppercase transition-all shrink-0 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20"
                  title="Account Settings"
                >
                  {localStorage.getItem('profile_image') || userPicture ? (
                    <img src={localStorage.getItem('profile_image') || userPicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (userName || userEmail).substring(0, 2).toUpperCase()
                  )}
                </button>
              </div>
            )}
          </div>
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
                    <div className="flex items-center gap-2.5 min-w-0">
                      {localStorage.getItem('profile_image') || userPicture ? (
                        <img src={localStorage.getItem('profile_image') || userPicture} alt="Profile" className="w-8 h-8 rounded-lg border border-emerald-500/20 object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center font-black text-emerald-400 text-sm shrink-0 uppercase">
                          {(userName || userEmail).substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-black text-white truncate">{userName}</p>
                      </div>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 shrink-0">
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
                Workspace <HiOutlineChevronRight className="text-gray-500" size={14} /> <span className="text-emerald-400">{
                  menuItems.find(item => item.id === activeTab)?.name || 
                  (activeTab === 'profile' ? 'My Profile' : 
                   activeTab === 'settings' ? 'Settings' : 
                   activeTab === 'support' ? 'Support' : 
                   activeTab.charAt(0).toUpperCase() + activeTab.slice(1))
                }</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3" />
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
          className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/30"
          style={{ boxShadow: '0 10px 15px -3px var(--theme-glow, rgba(16, 185, 129, 0.3))' }}
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

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 px-5 py-3.5 bg-[#0a0f0c]/90 border border-emerald-500/40 text-emerald-300 backdrop-blur-xl rounded-xl shadow-2xl flex items-center gap-3 font-space text-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_var(--color-emerald-400)]" />
            <span className="font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── SPATIAL OVERVIEW TAB ── */
function OverviewTab({ setActiveTab, menuItems, userEmail, userName, totalTopics, assetsCreated, weeklyActivity }) {
  const gridFeatures = menuItems.filter(
    (item) => item.id !== 'overview' && item.id !== 'library' && item.id !== 'workspace'
  )

  const summaryStats = [
    { label: 'Total Topics', value: totalTopics, limit: 10, unit: 'topics', color: 'from-emerald-500 to-green-500' },
    { label: 'Assets Created', value: assetsCreated, limit: 12, unit: 'assets', color: 'from-emerald-400 to-emerald-600' },
    { label: 'Weekly Activity', value: weeklyActivity, limit: 5, unit: 'actions', color: 'from-green-400 to-emerald-500' },
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
            return (
              <div
                key={i}
                className="p-5 border border-white/[0.06] bg-[#070b09]/80 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 shadow-md"
              >
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                  <div className="flex items-baseline gap-1.5 mt-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white font-space">{stat.value}</span>
                    <span className="text-xs sm:text-sm text-gray-400 font-semibold">{stat.unit}</span>
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


function LiveFlightDeck({ digitizedResult, setActiveTab, students, setStudents, pushWorksheetToClass, deployedMaterial, setDeployedMaterial, handleAddStudent }) {
  const [activeMode, setActiveMode] = useState('presentation') // 'presentation' | 'whiteboard'
  const [brushColor, setBrushColor] = useState('#10b981')
  const [brushWidth, setBrushWidth] = useState(4)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  
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

  const canvasRef = useRef(null)

  // Simulation: toggle student focus states and doubts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents(prev => prev.map(s => {
        let updated = { ...s }
        // Randomly toggle focus
        if (Math.random() > 0.8) {
          const newStatus = s.status === 'focused' ? 'distracted' : 'focused'
          updated.status = newStatus
          updated.lastActive = newStatus === 'focused' ? 'Active now' : 'Tabbed out'
        }
        // Randomly raise a doubt/hand
        if (Math.random() > 0.93 && !s.doubt) {
          const doubtOptions = [
            'Confused about derivatives',
            'How is limit defined here?',
            'What is the formula for eigenvectors?',
            'Is this step on the test?',
            'Can we do another example?'
          ]
          updated.doubt = doubtOptions[Math.floor(Math.random() * doubtOptions.length)]
        }
        return updated
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [setStudents])

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

  // Seat Swapping / Drag Drop Handlers
  const handleDragStart = (e, studentId) => {
    e.dataTransfer.setData('text/plain', studentId.toString())
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, targetRow, targetCol) => {
    e.preventDefault()
    const draggedStudentId = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (isNaN(draggedStudentId)) return

    setStudents(prev => {
      const copy = prev.map(s => ({ ...s }))
      const sourceStudent = copy.find(s => s.id === draggedStudentId)
      const targetStudent = copy.find(s => s.row === targetRow && s.col === targetCol)

      if (sourceStudent) {
        if (targetStudent) {
          // Swap positions
          const tempRow = sourceStudent.row
          const tempCol = sourceStudent.col
          sourceStudent.row = targetStudent.row
          sourceStudent.col = targetStudent.col
          targetStudent.row = tempRow
          targetStudent.col = tempCol
        } else {
          // Move to empty cell
          sourceStudent.row = targetRow
          sourceStudent.col = targetCol
        }
      }
      return copy
    })
  }

  const getStudentAt = (row, col) => {
    return students.find(s => s.row === row && s.col === col)
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  const handleResolveDoubt = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, doubt: null, status: 'focused' }
      }
      return s
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-6 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Whiteboard / Presentation (7 columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Workspace Toolbar */}
          <div className="border border-white/[0.08] bg-white/[0.02] p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveMode('presentation')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-space transition-all duration-300 ${
                  activeMode === 'presentation'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35'
                    : 'text-gray-400 hover:text-white border border-transparent hover:bg-white/[0.03]'
                }`}
              >
                Lecture Slides
              </button>
              <button
                onClick={() => setActiveMode('whiteboard')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-space transition-all duration-300 ${
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
              <div className="flex items-center gap-3.5">
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
                
                {/* One Click Feature Push Button */}
                <button
                  onClick={() => pushWorksheetToClass('Whiteboard Canvas', 'Whiteboard Interactive Worksheet')}
                  className="px-3.5 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold font-space flex items-center gap-1.5 transition-all"
                  title="Push whiteboard to all student screens"
                >
                  <HiOutlineSparkles size={14} />
                  <span>Push to Class</span>
                </button>

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
              deployedMaterial ? (
                /* display deployed workflow or diagram */
                <div className="flex-1 flex flex-col justify-between relative animate-fadeIn h-full bg-[#0a0f0c] p-5 text-gray-200">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-space uppercase">
                        {deployedMaterial.type === 'lesson' ? 'Lesson Plan' : 'Visual Aid'} Deployed
                      </span>
                      <h4 className="text-sm font-extrabold text-white font-space truncate max-w-[200px] sm:max-w-md">{deployedMaterial.title}</h4>
                    </div>
                    <button
                      onClick={() => setDeployedMaterial(null)}
                      className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-[10px] text-red-400 hover:bg-red-500/10 transition-colors font-bold font-space"
                    >
                      Clear Material
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-sidebar-scroll pr-1 select-text space-y-4 font-sans text-sm">
                    {deployedMaterial.type === 'lesson' ? (
                      /* Render Lesson workflow */
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold font-space uppercase">
                          {deployedMaterial.subject && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                              Subject: {deployedMaterial.subject}
                            </span>
                          )}
                          {deployedMaterial.grade && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                              Grade: {deployedMaterial.grade}
                            </span>
                          )}
                          {deployedMaterial.duration && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                              Duration: {deployedMaterial.duration} Mins
                            </span>
                          )}
                        </div>

                        {deployedMaterial.objectives && (
                          <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl text-left">
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space mb-1">Learning Objectives</h5>
                            <p className="text-xs text-gray-300 font-medium leading-relaxed">{deployedMaterial.objectives}</p>
                          </div>
                        )}

                        {deployedMaterial.content.map((sec, idx) => (
                          <div key={idx} className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold font-space border-b border-white/[0.04] pb-1.5">
                              <span className="text-emerald-400">{sec.time}</span>
                              <span className="text-gray-400 uppercase tracking-wider text-[10px]">{sec.phase}</span>
                            </div>
                            <h5 className="font-bold text-white text-sm">{sec.title}</h5>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">{sec.desc}</p>
                            {sec.interactive && (
                              <div className="mt-2.5 p-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300 font-semibold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Interactive Element: {sec.interactive}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Render Diagram */
                      <div className="flex flex-col h-full items-center justify-center space-y-6 py-6">
                        <div className="flex flex-wrap gap-4 justify-center items-center max-w-lg w-full">
                          {deployedMaterial.content.nodes.map((node, nIdx) => (
                            <div key={nIdx} className="flex items-center gap-3">
                              <div className="p-4 bg-[#0d1310] border border-emerald-500/30 rounded-xl shadow-lg flex flex-col items-center justify-center min-w-[120px] text-center">
                                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black font-space">{node.type}</span>
                                <span className="text-xs text-white font-extrabold mt-1.5">{node.label}</span>
                              </div>
                              {nIdx < deployedMaterial.content.nodes.length - 1 && (
                                <span className="text-emerald-500 font-bold text-lg">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                        {deployedMaterial.content.chartData && (
                          <div className="w-full max-w-md bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-3">
                            <h5 className="text-xs font-bold font-space uppercase text-gray-400 text-center">Interactive Graph Data</h5>
                            <div className="space-y-2">
                              {deployedMaterial.content.chartData.map((d, dIdx) => (
                                <div key={dIdx} className="space-y-1">
                                  <div className="flex justify-between text-[11px] text-gray-300 font-semibold">
                                    <span>{d.label}</span>
                                    <span>{d.value}%</span>
                                  </div>
                                  <div className="w-full bg-[#18231d] h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-400 h-full" style={{ width: `${d.value}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : pdfUrl ? (
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
                      <span className="text-[9px] font-black tracking-widest text-[var(--color-emerald-500)] bg-[var(--color-emerald-500)]/10 px-2.5 py-1 rounded uppercase font-space border border-[var(--color-emerald-500)]/20">
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
        </div>

        {/* RIGHT PANEL: Seating Grid & Workspace Inspector (5 columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          {/* Seating Grid Card */}
          <div className="border border-white/[0.04] bg-[#0c0d0d] p-5 rounded-2xl shadow-xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-space">Interactive Seating Grid</h3>
                <p className="text-xs text-gray-400 mt-0.5">Drag & drop desks to swap students. Click to inspect.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const name = prompt("Enter Student's Full Name:")
                  if (!name) return
                  const email = prompt("Enter Student's Email:")
                  if (!email) return
                  handleAddStudent(name, email)
                }}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-colors font-space shrink-0 cursor-pointer"
              >
                + Add Student
              </button>
            </div>

            {/* Room Desk Grid */}
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 4 }).map((_, rIdx) =>
                Array.from({ length: 3 }).map((_, cIdx) => {
                  const student = getStudentAt(rIdx, cIdx)
                  if (student) {
                    const isSelected = selectedStudentId === student.id
                    const hasDoubt = student.doubt !== null
                    const isDistracted = student.status === 'distracted'

                    let borderStyle = 'border-white/[0.08] bg-white/[0.02]'
                    let glowStyle = ''
                    if (hasDoubt) {
                      borderStyle = 'border-rose-500/40 bg-rose-950/20'
                      glowStyle = 'shadow-[0_0_12px_rgba(244,63,94,0.25)] animate-pulse'
                    } else if (isDistracted) {
                      borderStyle = 'border-amber-500/30 bg-amber-950/10'
                      glowStyle = 'shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                    } else if (isSelected) {
                      borderStyle = 'border-emerald-500 bg-emerald-950/20'
                      glowStyle = 'shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    } else {
                      borderStyle = 'border-white/[0.08] hover:border-emerald-500/40 hover:bg-white/[0.04]'
                    }

                    return (
                      <div
                        key={student.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, student.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, rIdx, cIdx)}
                        onClick={() => setSelectedStudentId(student.id)}
                        className={`p-3 rounded-xl border ${borderStyle} ${glowStyle} flex flex-col justify-between h-24 cursor-pointer select-none transition-all duration-300 relative group`}
                      >
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-40 transition-opacity text-gray-500 cursor-grab">
                          <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 2a2 2 0 11-2-2 2 2 0 012 2zm6 0a2 2 0 11-2-2 2 2 0 012 2zm-6 6a2 2 0 11-2-2 2 2 0 012 2zm6 0a2 2 0 11-2-2 2 2 0 012 2zm-6 6a2 2 0 11-2-2 2 2 0 012 2zm6 0a2 2 0 11-2-2 2 2 0 012 2z" />
                          </svg>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded text-[10px] font-black flex items-center justify-center ${
                            hasDoubt 
                              ? 'bg-rose-500/20 text-rose-400' 
                              : isDistracted 
                                ? 'bg-amber-500/20 text-amber-400' 
                                : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate leading-none">{student.name.split(' ')[0]}</p>
                            <p className="text-[9px] text-gray-500 truncate mt-1">{student.status === 'focused' ? 'Focused' : 'Idle'}</p>
                          </div>
                        </div>

                        <div className="mt-1">
                          <p className="text-[8px] text-gray-400 truncate font-semibold">
                            {student.currentProgress}
                          </p>
                        </div>

                        {hasDoubt && (
                          <span className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-rose-500 flex items-center justify-center text-[9px] text-black font-black animate-bounce">
                            !
                          </span>
                        )}
                      </div>
                    )
                  } else {
                    return (
                      <div
                        key={`empty-${rIdx}-${cIdx}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, rIdx, cIdx)}
                        className="border border-dashed border-white/[0.04] bg-transparent rounded-xl h-24 flex items-center justify-center text-[9px] text-gray-600 font-semibold"
                      >
                        Empty
                      </div>
                    )
                  }
                })
              )}
            </div>
          </div>

          {/* Workstation Inspector */}
          <div className="border border-white/[0.04] bg-[#0c0d0d] p-5 rounded-2xl shadow-xl min-h-[190px] flex flex-col justify-between">
            {selectedStudent ? (
              <div className="animate-fadeIn flex flex-col h-full justify-between space-y-4">
                <div className="space-y-3.5">
                  <div className="flex justify-between items-start border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-bold text-sm">
                        {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-space leading-tight">{selectedStudent.name}</h4>
                        <p className="text-[10px] text-gray-400">Desk: Row {selectedStudent.row + 1}, Col {selectedStudent.col + 1}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedStudentId(null)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <HiOutlineX size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider font-space">Workspace Activity</p>
                      <p className="text-white font-bold mt-1 truncate">{selectedStudent.currentProgress}</p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl">
                      <p className="text-[9px] text-gray-500 uppercase font-black tracking-wider font-space">Submission Status</p>
                      <p className={`font-bold mt-1 ${
                        selectedStudent.assignmentStatus.includes('Graded') 
                          ? 'text-emerald-400' 
                          : selectedStudent.assignmentStatus.includes('Pending') 
                            ? 'text-amber-400' 
                            : 'text-gray-300'
                      }`}>{selectedStudent.assignmentStatus}</p>
                    </div>
                  </div>

                  {selectedStudent.grade && selectedStudent.grade !== 'N/A' && (
                    <div className="bg-emerald-950/10 border border-emerald-500/20 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-emerald-400 uppercase font-black tracking-wider font-space">Grade Book Score</span>
                        <span className="text-emerald-400 font-extrabold">{selectedStudent.grade}</span>
                      </div>
                      {selectedStudent.aiFeedback && (
                        <p className="text-[10px] text-gray-300 leading-normal italic font-semibold">
                          AI: "{selectedStudent.aiFeedback}"
                        </p>
                      )}
                    </div>
                  )}

                  {selectedStudent.doubt && (
                    <div className="p-3 bg-rose-500/5 border border-rose-500/25 text-rose-300 rounded-xl text-xs flex justify-between items-center animate-pulse">
                      <div className="flex items-center gap-2">
                        <HiOutlineHand className="text-rose-400 flex-shrink-0 animate-bounce" size={16} />
                        <div>
                          <p className="font-bold text-white leading-none">Doubt Raised</p>
                          <p className="text-[10px] text-rose-300/80 mt-1 font-medium">"{selectedStudent.doubt}"</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleResolveDoubt(selectedStudent.id)}
                        className="px-2 py-1 bg-rose-500/15 border border-rose-500/35 hover:bg-rose-500/25 rounded-md text-[10px] text-rose-400 font-bold transition-all"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 border-t border-white/[0.06] pt-3">
                  <button
                    onClick={() => {
                      alert(`Extension challenge pushed to ${selectedStudent.name}'s workstation!`);
                    }}
                    className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2 rounded-xl text-xs font-bold font-space transition-all flex items-center justify-center gap-1.5"
                  >
                    <HiOutlineSparkles size={13} />
                    <span>Push Challenge</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="my-auto text-center flex flex-col items-center justify-center space-y-2 py-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#262d29" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                </svg>
                <div>
                  <p className="text-xs font-space text-gray-400 font-bold">Workstation Inspector</p>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Select a student's desk to monitor live details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── INTERACTIVE PAPER DIGITIZER WORKSPACE ── */
function PaperDigitizer({ uploadedPages, setUploadedPages, digitizedResult, setDigitizedResult, students, setStudents, showToast, onAssetCreated }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDigitizing, setIsDigitizing] = useState(false)
  const [digitizerMode, setDigitizerMode] = useState('upload') // 'upload' | 'camera'
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || 1)
  const [isScanning, setIsScanning] = useState(false)
  
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
        type: 'grade',
        title: 'INGESTED QUESTION PAPER - MATH 101',
        subtitle: 'Processed via Acharya AI OCR engine',
        score: '20/25',
        studentName: 'General Ingestion',
        feedback: 'Calculus steps solved correctly. Minor limit normalization issue in Section A.',
        sections: [
          {
            title: 'Section A: Calculus Foundations',
            questions: [
              'Q1. Evaluate the limit: lim(x -> 0) [sin(5x) / 2x]. (3 Marks)',
              'Q2. Find the derivative of f(x) = e^(3x^2 - 5x + 2). (4 Marks)',
              'Q3. Compute the integral of x^3 ln(x) dx using integration by parts. (5 Marks)'
            ]
          }
        ]
      })
      setIsDigitizing(false)
      if (onAssetCreated) onAssetCreated()
    }, 2000)
  }

  const runCameraScan = () => {
    if (isScanning) return
    setIsScanning(true)
    const targetStudent = students.find(s => s.id === selectedStudentId)
    setTimeout(() => {
      const scores = ['18/25', '21/25', '23/25', '25/25', '22/25']
      const feedChoices = [
        'Demonstrated excellent understanding of differentiation rules. The chain rule application is perfect.',
        'Good calculus proofs, but integration by parts was left incomplete at the final substitution step.',
        'Perfect score! All matrices solved, eigenvalues correct, and calculus derivations are completely correct.',
        'Minor algebraic error in Section A limit formulation. The final answer should be 5/2, not 5.'
      ]
      
      const chosenScore = scores[Math.floor(Math.random() * scores.length)]
      const chosenFeedback = feedChoices[Math.floor(Math.random() * feedChoices.length)]

      // Update student grade in global state
      setStudents(prev => prev.map(s => {
        if (s.id === selectedStudentId) {
          return {
            ...s,
            assignmentStatus: `Submitted (Graded - ${chosenScore})`,
            grade: chosenScore,
            aiFeedback: chosenFeedback,
            status: 'focused'
          }
        }
        return s
      }))

      setDigitizedResult({
        type: 'grade',
        title: `GRADED NOTEBOOK: ${targetStudent ? targetStudent.name.toUpperCase() : 'STUDENT'}`,
        subtitle: 'OCR Handwritten Grader Output',
        score: chosenScore,
        studentName: targetStudent ? targetStudent.name : 'Selected Student',
        feedback: chosenFeedback,
        sections: [
          {
            title: 'Section A: Student Solutions Ingested',
            questions: [
              'Ingested: lim(x->0) [sin(5x) / 2x] = 5/2. -> Correct.',
              'Ingested: f\'(x) = d/dx [e^(3x^2-5x+2)] = (6x-5)e^(3x^2-5x+2). -> Correct.',
              'Ingested: Integral x^3 ln(x) dx. -> Partially Complete.'
            ]
          }
        ]
      })
      setIsScanning(false)
      showToast(`Marks (${chosenScore}) filled in Gradebook for ${targetStudent ? targetStudent.name : 'student'}!`, 'success')
      if (onAssetCreated) onAssetCreated()
    }, 2500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
    >
      {/* LEFT: Paper Digitizer Card (5 columns) */}
      <div className="lg:col-span-5">
        <div className="border border-white/[0.04] bg-[#0c0d0d] p-5 rounded-2xl flex flex-col space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-space">
                Paper Digitizer
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 font-semibold">
                Digitize handwritten notebooks or scan with camera.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#050907] p-1 rounded-xl border border-white/[0.05]">
            <button
              onClick={() => setDigitizerMode('upload')}
              className={`py-2 rounded-lg text-xs font-bold font-space transition-colors ${
                digitizerMode === 'upload' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25' : 'text-gray-400 hover:text-white'
              }`}
            >
              Upload Document
            </button>
            <button
              onClick={() => setDigitizerMode('camera')}
              className={`py-2 rounded-lg text-xs font-bold font-space transition-colors ${
                digitizerMode === 'camera' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25' : 'text-gray-400 hover:text-white'
              }`}
            >
              Camera Scanner
            </button>
          </div>

          {digitizerMode === 'upload' ? (
            <div className="space-y-4">
              {/* Dotted Upload Dropzone */}
              <div 
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                className={`border border-[#2b312e] border-dashed bg-[#181c19] hover:bg-[#1b1f1c] py-11 rounded-xl flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all duration-300 ${
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
                
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#525d57" strokeWidth="1.5">
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
                  <div className="space-y-2 max-h-36 overflow-y-auto custom-sidebar-scroll pr-1">
                    {uploadedPages.map((page, index) => (
                      <div key={page.id} className="flex justify-between items-center bg-[#131815] border border-white/[0.03] p-2 rounded-lg text-xs">
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
                  <div className="text-xs text-gray-500 py-1 font-medium">
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                </svg>
                Digitize Page by Page
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Phone Camera view mockup */}
              <div className="border border-white/[0.08] bg-[#020503] rounded-xl h-56 relative overflow-hidden flex flex-col items-center justify-center p-4">
                {/* Views Finder Corners */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-500" />
                
                {/* Laser scan animation line */}
                {isScanning && (
                  <motion.div 
                    initial={{ y: -60 }}
                    animate={{ y: 70 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', repeatType: 'reverse' }}
                    className="absolute left-0 right-0 h-0.5 bg-emerald-400 z-10"
                    style={{ boxShadow: '0 0 10px var(--theme-glow, #10b981)' }}
                  />
                )}

                <div className="text-center space-y-2 relative z-0">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={isScanning ? 'var(--theme-glow, #10b981)' : '#475569'} strokeWidth="1.5" className={isScanning ? 'animate-pulse' : ''}>
                    <path d="M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[11px] font-space text-gray-400 font-bold uppercase tracking-wider">
                    {isScanning ? 'Reading handwriting...' : 'Point Phone Camera at Notebook'}
                  </p>
                  <p className="text-[9px] text-gray-500 font-semibold">Camera scanner feed simulated</p>
                </div>
              </div>

              {/* Student Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space">Assign to Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(parseInt(e.target.value, 10))}
                  className="w-full bg-[#121614] border border-white/[0.08] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all font-semibold font-space"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.assignmentStatus})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={runCameraScan}
                disabled={isScanning}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-extrabold py-3 rounded-lg text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                {isScanning ? 'Analyzing Handwritings...' : 'Scan & Auto-Grade Notebook'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Digitized Result Card (7 columns) */}
      <div className="lg:col-span-7">
        <div className="border border-white/[0.04] bg-[#0c0d0d] p-6.5 rounded-2xl min-h-[490px] flex flex-col justify-between shadow-xl">
          {isDigitizing || isScanning ? (
            /* Loading State */
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <p className="text-xs sm:text-sm font-space font-extrabold text-emerald-400 uppercase tracking-widest animate-pulse text-center">
                {isScanning ? 'Analyzing handwriting structure & filling gradebook...' : 'Recognizing handwriting & generating LaTeX structures...'}
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
                      onClick={() => alert('Grading report exported!')}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Scoring and feedback callout */}
                  {digitizedResult.type === 'grade' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-emerald-950/20 border border-emerald-500/25 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-space">Auto-Graded Marks</p>
                          <p className="text-2xl font-black text-emerald-400 mt-1 font-space">{digitizedResult.score}</p>
                        </div>
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2 py-1 rounded font-space uppercase">Gradebook Synced</span>
                      </div>
                      
                      <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-space">Student</p>
                        <p className="text-sm font-bold text-white mt-1.5 font-space">{digitizedResult.studentName}</p>
                      </div>

                      <div className="md:col-span-2 p-4 bg-emerald-500/[0.02] border border-emerald-500/15 rounded-xl space-y-1.5">
                        <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-space font-black">AI Feedback Generated</p>
                        <p className="text-xs text-gray-200 leading-relaxed font-semibold">"{digitizedResult.feedback}"</p>
                      </div>
                    </div>
                  )}

                  {digitizedResult.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3 mt-2">
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-400 font-space tracking-wide uppercase border-l-2 border-emerald-500 pl-2.5">
                        {section.title}
                      </h4>
                      <ul className="space-y-2">
                        {section.questions.map((question, qIdx) => (
                          <li key={qIdx} className="text-xs sm:text-sm text-gray-200 bg-[#121614] border border-white/[0.02] p-3 rounded-xl leading-relaxed select-text font-semibold">
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
                  Acharya AI Digitizer Module V2.0 (OCR Live)
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
                  Gradebook data and transcription will be built here.
                </p>
              </div>

              <div className="my-auto flex flex-col items-center justify-center space-y-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#262d29" strokeWidth="1.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-space text-gray-400 font-bold">
                    Turn physical papers into digital grades.
                  </p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    Upload notebook pages or use camera scanner to auto-grade.
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

/* ── MATH HELPER WORKSPACE ── */
export function MathHelper({ pushWorksheetToClass, onProblemSolved }) {
  const [problem, setProblem] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('Calculus')
  const [solutionSteps, setSolutionSteps] = useState(null)
  const [isSolving, setIsSolving] = useState(false)

  const sampleProblems = {
    Calculus: [
      { q: "Evaluate the limit: lim(x -> 0) [sin(5x) / 2x]", ans: ["Step 1: Identify that this is a limit of the form 0/0.", "Step 2: Use the standard limit rule lim(u -> 0) [sin(u)/u] = 1.", "Step 3: Rewrite the limit as lim(x -> 0) [ (5/2) * (sin(5x)/5x) ].", "Step 4: Take the limit: (5/2) * 1 = 5/2."] },
      { q: "Find the derivative of f(x) = e^(3x^2 - 5x + 2)", ans: ["Step 1: Identify the outer function as e^u and inner as u = 3x^2 - 5x + 2.", "Step 2: Apply the chain rule: d/dx [e^u] = e^u * du/dx.", "Step 3: Calculate du/dx = 6x - 5.", "Step 4: Combine the results: f'(x) = (6x - 5) * e^(3x^2 - 5x + 2)."] }
    ],
    Algebra: [
      { q: "For matrix A = [[3, 1], [2, 4]], calculate the eigenvalues.", ans: ["Step 1: Setup the characteristic equation det(A - λI) = 0.", "Step 2: Compute det([[3 - λ, 1], [2, 4 - λ]]) = (3 - λ)(4 - λ) - 2 = 0.", "Step 3: Solve λ^2 - 7λ + 10 = 0.", "Step 4: Factor the quadratic: (λ - 2)(λ - 5) = 0. The eigenvalues are λ = 2 and λ = 5."] }
    ]
  }

  const handleSolve = () => {
    if (!problem.trim()) return
    setIsSolving(true)
    setTimeout(() => {
      let steps = ["Step 1: Parse the input equation.", "Step 2: Recognize variables and operators.", "Step 3: Apply relevant mathematical theorems.", "Step 4: Simplify output expression."]
      
      const allSamples = [...sampleProblems.Calculus, ...sampleProblems.Algebra]
      const found = allSamples.find(s => s.q.toLowerCase().includes(problem.toLowerCase()) || problem.toLowerCase().includes(s.q.toLowerCase()))
      if (found) {
        steps = found.ans
      }
      
      setSolutionSteps(steps)
      setIsSolving(false)
      if (onProblemSolved) onProblemSolved()
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
    >
      {/* Input panel (5 cols) */}
      <div className="lg:col-span-5 border border-white/[0.04] bg-[#0c0d0d] p-6.5 rounded-2xl flex flex-col space-y-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white font-space">Math Helper</h3>
          <p className="text-xs text-gray-400 mt-1 font-semibold">Solve and push interactive worksheets to your students.</p>
        </div>

        {/* Topic Selector */}
        <div className="flex gap-2">
          {Object.keys(sampleProblems).map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-space transition-colors ${
                selectedTopic === topic ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.02] text-gray-400 border border-transparent'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Pre-populated templates */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space">Sample Problems</label>
          <div className="space-y-1.5">
            {sampleProblems[selectedTopic].map((samp, idx) => (
              <button
                key={idx}
                onClick={() => setProblem(samp.q)}
                className="w-full text-left p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] rounded-xl text-xs text-gray-300 transition-colors font-medium"
              >
                {samp.q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space">Problem Expression</label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={3}
            placeholder="Type your math equation here..."
            className="w-full bg-[#121614] border border-white/[0.08] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-medium resize-none"
          />
        </div>

        <button
          onClick={handleSolve}
          disabled={!problem.trim() || isSolving}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black font-extrabold py-3 rounded-lg text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center active:scale-[0.99]"
        >
          {isSolving ? 'Solving Problem...' : 'Solve Problem with AI'}
        </button>
      </div>

      {/* Solution panel (7 cols) */}
      <div className="lg:col-span-7 border border-white/[0.04] bg-[#0c0d0d] p-6.5 rounded-2xl min-h-[420px] flex flex-col justify-between shadow-xl">
        {isSolving ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-xs sm:text-sm font-space font-extrabold text-emerald-400 uppercase tracking-widest animate-pulse">
              Calculating analytical steps...
            </p>
          </div>
        ) : solutionSteps ? (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white font-space">AI Analytical Solver</h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">Verified step-by-step solution</p>
                </div>
              </div>

              <div className="space-y-4">
                {solutionSteps.map((step, idx) => (
                  <div key={idx} className="p-3.5 bg-[#121614] border border-white/[0.02] rounded-xl text-xs sm:text-sm text-gray-200 leading-relaxed font-semibold">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-4.5 mt-6 flex flex-col gap-3">
              <button
                onClick={() => pushWorksheetToClass('Math Helper', `Equation: ${problem.substring(0, 30)}...`)}
                className="w-full bg-[#5b892a] hover:bg-[#6b9c32] text-white font-extrabold py-3 rounded-lg text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <HiOutlineSparkles size={16} />
                One-Click Push to Students
              </button>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 font-space tracking-widest uppercase font-black">
                  Acharya AI Math Solver V1.0
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white font-space leading-tight">Step-by-Step Solution</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Interactive LaTeX & markdown output will appear here.</p>
            </div>

            <div className="my-auto flex flex-col items-center justify-center space-y-4">
              <HiOutlineCalculator className="text-[#262d29]" size={48} />
              <div className="text-center">
                <p className="text-sm font-space text-gray-400 font-bold">Solve complex math equations instantly.</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Select a sample problem or type your own to get started.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-transparent" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── LESSON PLANNER WORKSPACE ── */
function CustomDropdown({ label, value, options, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={`relative space-y-1.5 flex-1 text-left ${isOpen ? 'z-40' : 'z-10'}`} ref={dropdownRef}>
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#121614] border border-white/[0.08] hover:border-emerald-500/40 rounded-xl px-3 py-2.5 text-xs flex items-center justify-between font-semibold font-space transition-all cursor-pointer"
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : (placeholder || `Select ${label}`)}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transform transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : 'text-gray-500'}`}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-[#0a0f0c]/95 border border-white/[0.08] rounded-xl shadow-2xl z-30 py-1.5 backdrop-blur-xl animate-fadeIn">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold font-space transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 flex items-center justify-between ${
                value === opt.value ? 'text-emerald-400 bg-emerald-500/[0.03]' : 'text-gray-300'
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_var(--color-emerald-400)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function LessonPlanner({ setDeployedMaterial, setActiveTab, showToast, onPlanGenerated }) {
  const [grade, setGrade] = useState('')

  const subjectsByGrade = {
    'Grade 8': [
      { label: 'Mathematics', value: 'Mathematics' },
      { label: 'Science', value: 'Science' },
      { label: 'Social Studies', value: 'Social Studies' },
      { label: 'English', value: 'English' }
    ],
    'Grade 9': [
      { label: 'Mathematics', value: 'Mathematics' },
      { label: 'Science', value: 'Science' },
      { label: 'Social Studies', value: 'Social Studies' },
      { label: 'English', value: 'English' }
    ],
    'Grade 10': [
      { label: 'Mathematics', value: 'Mathematics' },
      { label: 'Science', value: 'Science' },
      { label: 'Social Studies', value: 'Social Studies' },
      { label: 'English', value: 'English' }
    ],
    'Grade 11 (Science)': [
      { label: 'Physics', value: 'Physics' },
      { label: 'Chemistry', value: 'Chemistry' },
      { label: 'Biology', value: 'Biology' },
      { label: 'Mathematics', value: 'Mathematics' },
      { label: 'English', value: 'English' }
    ],
    'Grade 11 (Commerce)': [
      { label: 'Accountancy', value: 'Accountancy' },
      { label: 'Business Studies', value: 'Business Studies' },
      { label: 'Economics', value: 'Economics' },
      { label: 'English', value: 'English' }
    ],
    'Grade 11 (Arts)': [
      { label: 'History', value: 'History' },
      { label: 'Geography', value: 'Geography' },
      { label: 'Political Science', value: 'Political Science' },
      { label: 'English', value: 'English' }
    ],
    'Grade 12 (Science)': [
      { label: 'Physics', value: 'Physics' },
      { label: 'Chemistry', value: 'Chemistry' },
      { label: 'Biology', value: 'Biology' },
      { label: 'Mathematics', value: 'Mathematics' },
      { label: 'English', value: 'English' }
    ],
    'Grade 12 (Commerce)': [
      { label: 'Accountancy', value: 'Accountancy' },
      { label: 'Business Studies', value: 'Business Studies' },
      { label: 'Economics', value: 'Economics' },
      { label: 'English', value: 'English' }
    ],
    'Grade 12 (Arts)': [
      { label: 'History', value: 'History' },
      { label: 'Geography', value: 'Geography' },
      { label: 'Political Science', value: 'Political Science' },
      { label: 'English', value: 'English' }
    ],
    'Coding': [
      { label: 'Python', value: 'Python' },
      { label: 'JavaScript', value: 'JavaScript' },
      { label: 'C++', value: 'C++' },
      { label: 'Java', value: 'Java' },
      { label: 'HTML & CSS', value: 'HTML & CSS' }
    ]
  }

  const subjectOptions = grade ? (subjectsByGrade[grade] || []) : []

  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState('')
  const [learningObjectives, setLearningObjectives] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [lessonPlan, setLessonPlan] = useState(null)

  const handleGradeChange = (newGrade) => {
    setGrade(newGrade)
    const newSubjects = subjectsByGrade[newGrade] || []
    if (newSubjects.length > 0) {
      setSubject(newSubjects[0].value)
    } else {
      setSubject('')
    }
  }

  const handleGenerate = () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setLessonPlan({
        title: `Lesson Plan: ${topic}`,
        subject: subject,
        grade: grade,
        duration: duration,
        objectives: learningObjectives || 'Understand core conceptual models and interactive exercises.',
        workflow: [
          { time: '0m - 10m', phase: 'Introduction', title: 'Hook & Context Setting', desc: `Introduce ${topic} in ${subject} class. Check prerequisite knowledge.`, interactive: 'Raise Hand check' },
          { time: '10m - 25m', phase: 'Core Concept', title: 'Direct Instruction', desc: `Present the primary concepts of ${topic}. Highlight formulas and definitions. Objective: ${learningObjectives || 'Understand core theories'}.`, interactive: 'Whiteboard drawing comparison' },
          { time: '25m - 35m', phase: 'Active Check', title: 'Interactive Poll', desc: `Run a live class poll to gauge student understanding of the core concept.`, interactive: 'Active understanding check poll' },
          { time: '35m - 45m', phase: 'Guided Practice', title: 'Student Workstations', desc: `Push an interactive worksheet to all student desks. Monitor live progress in seating grid.`, interactive: 'One-click challenge worksheet' }
        ]
      })
      setIsGenerating(false)
      showToast('AI Lesson Plan generated successfully!', 'success')
      if (onPlanGenerated) onPlanGenerated()
    }, 2000)
  }

  const handleDeploy = () => {
    if (!lessonPlan) return
    setDeployedMaterial({
      type: 'lesson',
      title: lessonPlan.title,
      subject: lessonPlan.subject,
      grade: lessonPlan.grade,
      duration: lessonPlan.duration,
      objectives: lessonPlan.objectives,
      content: lessonPlan.workflow
    })
    showToast('Lesson workflow deployed to Live Flight Deck!', 'success')
    setActiveTab('flight-deck')
  }

  const durationOptions = [
    { label: '30 Mins', value: '30' },
    { label: '45 Mins', value: '45' },
    { label: '60 Mins', value: '60' }
  ]

  const gradeOptions = [
    { label: 'Grade 8', value: 'Grade 8' },
    { label: 'Grade 9', value: 'Grade 9' },
    { label: 'Grade 10', value: 'Grade 10' },
    { label: 'Grade 11 (Science)', value: 'Grade 11 (Science)' },
    { label: 'Grade 11 (Commerce)', value: 'Grade 11 (Commerce)' },
    { label: 'Grade 11 (Arts)', value: 'Grade 11 (Arts)' },
    { label: 'Grade 12 (Science)', value: 'Grade 12 (Science)' },
    { label: 'Grade 12 (Commerce)', value: 'Grade 12 (Commerce)' },
    { label: 'Grade 12 (Arts)', value: 'Grade 12 (Arts)' },
    { label: 'Coding', value: 'Coding' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
    >
      <div className="lg:col-span-5 border border-white/[0.04] bg-[#0c0d0d] p-5.5 rounded-2xl flex flex-col space-y-5 shadow-xl">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white font-space">Lesson Planner</h3>
          <p className="text-xs text-gray-400 mt-1 font-semibold">Generate structured lesson workflows in seconds.</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <CustomDropdown
              label="Grade Level"
              value={grade}
              options={gradeOptions}
              onChange={handleGradeChange}
            />
            <CustomDropdown
              label="Subject"
              value={subject}
              options={subjectOptions}
              onChange={setSubject}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space">Lesson Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Photosynthesis, Quadratic Equations..."
              className="w-full bg-[#121614] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="flex gap-4">
            <CustomDropdown
              label="Duration"
              value={duration}
              options={durationOptions}
              onChange={setDuration}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space">Learning Objectives</label>
            <textarea
              value={learningObjectives}
              onChange={(e) => setLearningObjectives(e.target.value)}
              rows={2}
              placeholder="e.g. Students will be able to understand light reactions..."
              className="w-full bg-[#121614] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-medium resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || !subject || !grade || !duration || isGenerating}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black font-extrabold py-3 rounded-lg text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center active:scale-[0.99]"
          >
            {isGenerating ? 'Generating Lesson Plan...' : 'Generate Plan'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 border border-white/[0.04] bg-[#0c0d0d] p-6.5 rounded-2xl min-h-[420px] flex flex-col justify-between shadow-xl">
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-xs sm:text-sm font-space font-extrabold text-emerald-400 uppercase tracking-widest animate-pulse">
              Structuring curriculum outline...
            </p>
          </div>
        ) : lessonPlan ? (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="border-b border-white/[0.06] pb-4 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-white font-space">{lessonPlan.title}</h3>
                    <p className="text-xs text-emerald-400 font-semibold mt-1">Generated Workflow Timeline</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-[10px] font-bold font-space uppercase">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Subject: {lessonPlan.subject}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Grade: {lessonPlan.grade}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Duration: {lessonPlan.duration} Mins
                  </span>
                </div>

                <div className="bg-[#121614] border border-white/[0.04] p-3 rounded-xl text-left">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space mb-1">Learning Objectives</h4>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed">{lessonPlan.objectives}</p>
                </div>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto custom-sidebar-scroll pr-1">
                {lessonPlan.workflow.map((sec, idx) => (
                  <div key={idx} className="p-3 bg-[#121614] border border-white/[0.02] rounded-xl text-xs space-y-1 font-semibold">
                    <div className="flex justify-between text-[10px] text-emerald-400 font-space uppercase">
                      <span>{sec.time}</span>
                      <span>{sec.phase}</span>
                    </div>
                    <p className="text-white text-xs font-bold">{sec.title}</p>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-0.5">{sec.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-4 mt-4 flex flex-col gap-3">
              <button
                onClick={handleDeploy}
                className="w-full bg-[#5b892a] hover:bg-[#6b9c32] text-white font-extrabold py-3 rounded-lg text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <HiOutlineSparkles size={16} />
                Deploy to Live Flight Deck
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white font-space leading-tight">Lesson Timeline</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Generate a lesson plan to view the active workflow timeline.</p>
            </div>

            <div className="my-auto flex flex-col items-center justify-center space-y-4">
              <HiOutlineCalendar className="text-[#262d29]" size={48} />
              <div className="text-center">
                <p className="text-sm font-space text-gray-400 font-bold">Generate comprehensive plans instantly.</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Specify a topic and duration to get started.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-transparent" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── VISUAL AIDS WORKSPACE ── */
export function VisualAids({ setDeployedMaterial, setActiveTab, showToast, onAidGenerated }) {
  const [prompt, setPrompt] = useState('')
  const [aidType, setAidType] = useState('diagram') // 'diagram' | 'chart'
  const [isGenerating, setIsGenerating] = useState(false)
  const [visualAid, setVisualAid] = useState(null)

  const handleGenerate = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      if (aidType === 'diagram') {
        setVisualAid({
          title: `Diagram: ${prompt}`,
          type: 'diagram',
          data: {
            nodes: [
              { label: 'Input Data', type: 'Source' },
              { label: 'Feature Extraction', type: 'Process' },
              { label: 'CNN Weights', type: 'Model' },
              { label: 'Prediction Output', type: 'Result' }
            ]
          }
        })
      } else {
        setVisualAid({
          title: `Chart: ${prompt}`,
          type: 'chart',
          data: {
            nodes: [{ label: 'Performance', type: 'Metric' }],
            chartData: [
              { label: 'Focused students', value: 80 },
              { label: 'Tabbed out', value: 15 },
              { label: 'Doubt raising', value: 5 }
            ]
          }
        })
      }
      setIsGenerating(false)
      showToast('Visual aid successfully generated!', 'success')
      if (onAidGenerated) onAidGenerated()
    }, 2000)
  }

  const handleDeploy = () => {
    if (!visualAid) return
    setDeployedMaterial({
      type: 'diagram',
      title: visualAid.title,
      content: visualAid.data
    })
    showToast('Visual Aid deployed to Live Flight Deck!', 'success')
    setActiveTab('flight-deck')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
    >
      <div className="lg:col-span-5 border border-white/[0.04] bg-[#0c0d0d] p-5.5 rounded-2xl flex flex-col space-y-5 shadow-xl">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white font-space">Visual Aids</h3>
          <p className="text-xs text-gray-400 mt-1 font-semibold">Auto-generate interactive diagrams and charts.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space">Diagram Prompt</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. CNN architecture layer flow, Student attention graph..."
              className="w-full bg-[#121614] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-space">Aid Type</label>
            <div className="grid grid-cols-2 gap-2 bg-[#050907] p-1 rounded-xl border border-white/[0.05]">
              <button
                onClick={() => setAidType('diagram')}
                className={`py-2 rounded-lg text-xs font-bold font-space transition-colors ${
                  aidType === 'diagram' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25' : 'text-gray-400 hover:text-white'
                }`}
              >
                Process Diagram
              </button>
              <button
                onClick={() => setAidType('chart')}
                className={`py-2 rounded-lg text-xs font-bold font-space transition-colors ${
                  aidType === 'chart' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25' : 'text-gray-400 hover:text-white'
                }`}
              >
                Interactive Chart
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black font-extrabold py-3 rounded-lg text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center active:scale-[0.99]"
          >
            {isGenerating ? 'Generating Visual Aid...' : 'Generate Visual Aid'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 border border-white/[0.04] bg-[#0c0d0d] p-6.5 rounded-2xl min-h-[420px] flex flex-col justify-between shadow-xl">
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-xs sm:text-sm font-space font-extrabold text-emerald-400 uppercase tracking-widest animate-pulse">
              Constructing vector layout...
            </p>
          </div>
        ) : visualAid ? (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white font-space">{visualAid.title}</h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">Generated Visual Asset</p>
                </div>
              </div>

              {/* Render dynamic mockup of Diagram / Chart */}
              <div className="flex flex-col items-center justify-center border border-white/[0.04] p-6 rounded-xl bg-white/[0.01]">
                {visualAid.type === 'diagram' ? (
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    {visualAid.data.nodes.map((node, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="px-3.5 py-2.5 bg-emerald-950/20 border border-emerald-500/35 rounded-xl text-center min-w-[100px] shadow-lg">
                          <p className="text-[8px] text-emerald-400 uppercase font-black font-space tracking-wider">{node.type}</p>
                          <p className="text-xs text-white font-bold mt-1">{node.label}</p>
                        </div>
                        {idx < visualAid.data.nodes.length - 1 && (
                          <span className="text-emerald-500 font-bold hidden md:inline">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full max-w-sm space-y-3.5">
                    {visualAid.data.chartData.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-300 font-semibold">
                          <span>{item.label}</span>
                          <span>{item.value}%</span>
                        </div>
                        <div className="w-full bg-[#18231d] h-2.5 rounded-full overflow-hidden border border-white/[0.02]">
                          <div className="bg-emerald-400 h-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-4 mt-4">
              <button
                onClick={handleDeploy}
                className="w-full bg-[#5b892a] hover:bg-[#6b9c32] text-white font-extrabold py-3 rounded-lg text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <HiOutlineSparkles size={16} />
                Deploy to Live Flight Deck
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white font-space leading-tight">Visual Preview</h3>
              <p className="text-xs text-gray-400 mt-1 font-semibold">Generate visual aid assets to render output.</p>
            </div>

            <div className="my-auto flex flex-col items-center justify-center space-y-4">
              <HiOutlineSparkles className="text-[#262d29]" size={48} />
              <div className="text-center">
                <p className="text-sm font-space text-gray-400 font-bold">Construct high quality educational vector graphics.</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">Type an asset prompt above to generate.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-transparent" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── SUPPORT & HELP CENTER WORKSPACE ── */
export function SupportView({ showToast }) {
  const [activeFaq, setActiveFaq] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const faqs = [
    {
      q: 'How do I reset my password?',
      a: 'You can reset your password by clicking on the Profile option in your account menu and selecting reset password, or by contacting your administrator.'
    },
    {
      q: 'How do I use the Lesson Planner tool?',
      a: 'Select your Subject and Grade Level, type a topic, specify the duration, and click Generate. You can then review and deploy it to the Live Flight Deck.'
    },
    {
      q: 'Is my data secure?',
      a: 'Yes, all school worksheets, test papers, and student grades are fully encrypted and securely stored in compliance with standard security benchmarks.'
    },
    {
      q: 'Can I use Acharya AI on multiple devices?',
      a: 'Yes, you can log in to your account from any desktop computer, tablet, or mobile smartphone concurrently.'
    }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setIsSending(true)
    setTimeout(() => {
      showToast('Message sent! Our support team will contact you soon.', 'success')
      setName('')
      setEmail('')
      setMessage('')
      setIsSending(false)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-10 w-full max-w-5xl mx-auto pb-12"
    >
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-black font-space tracking-tight text-white leading-none">Support & Help Center</h2>
        <p className="text-gray-400 text-base font-semibold">We're here to help. Find answers to your questions below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start w-full">
        {/* FAQs list */}
        <div className="md:col-span-6 border border-white/[0.04] bg-[#0c0d0d] p-8 rounded-2xl flex flex-col space-y-6 shadow-xl min-h-[500px] text-left">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white font-space">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4 divide-y divide-white/[0.06]">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div key={idx} className={`${idx > 0 ? 'pt-4' : ''} space-y-3`}>
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm sm:text-base font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <HiOutlineChevronDown
                      size={20}
                      className={`text-gray-400 transform transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-400 font-medium leading-relaxed bg-white/[0.02] border border-white/[0.02] p-4 rounded-xl mt-2">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact Form */}
        <form 
          onSubmit={handleSubmit}
          className="md:col-span-6 border border-white/[0.04] bg-[#0c0d0d] p-8 rounded-2xl flex flex-col space-y-5 shadow-xl text-left"
        >
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white font-space">Contact Us</h3>
            <p className="text-sm text-gray-400 mt-1 font-semibold">Can't find an answer? Send us a message.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-space">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-[#121614] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-space">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-[#121614] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider font-space">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Describe your issue..."
                className="w-full bg-[#121614] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all font-medium resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !name.trim() || !email.trim() || !message.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black font-extrabold py-4 rounded-lg text-sm sm:text-base tracking-wide transition-colors flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
            >
              <HiOutlineChat size={18} />
              {isSending ? 'Sending Message...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>

      {/* Other Ways to Reach Us */}
      <div className="space-y-4.5 text-left mt-8">
        <h3 className="text-xl font-bold tracking-tight text-white font-space">Other Ways to Reach Us</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Email Support */}
          <div className="flex items-center gap-4.5 p-6 border border-white/[0.08] bg-[#0c0d0d] rounded-2xl shadow-xl">
            <HiOutlineMail className="text-[var(--color-emerald-500)] shrink-0" size={32} />
            <div className="flex flex-col">
              <span className="text-base font-bold text-white">Email Support</span>
              <span className="text-sm text-gray-400 mt-0.5 font-medium">info@acharya.ai</span>
            </div>
          </div>

          {/* Phone Support */}
          <div className="flex items-center gap-4.5 p-6 border border-white/[0.08] bg-[#0c0d0d] rounded-2xl shadow-xl">
            <HiOutlinePhone className="text-[var(--color-emerald-500)] shrink-0" size={32} />
            <div className="flex flex-col">
              <span className="text-base font-bold text-white">Phone Support</span>
              <span className="text-sm text-gray-400 mt-0.5 font-medium">+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function ProfileView({ userEmail, userName, showToast, totalTopics = 0, assetsCreated = 0, totalStudents = 12, weeklyActivity = 0, onEditRedirect, setActiveTab }) {
  const profileImage = localStorage.getItem('profile_image') || null
  const coverImage = localStorage.getItem('profile_cover') || null
  const profileName = localStorage.getItem('profile_name') || userName || userEmail
  
  const schoolName = localStorage.getItem('profile_schoolName') || ''
  const subjectsTaught = localStorage.getItem('profile_subjectsTaught') || ''
  const experience = localStorage.getItem('profile_experience') || ''
  const qualification = localStorage.getItem('profile_qualification') || ''
  const memberSince = localStorage.getItem('profile_memberSince') || (() => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  })()
  const aboutMe = localStorage.getItem('profile_aboutMe') || 'Dedicated and passionate educator with a focus on creating engaging and effective learning environments. Experienced in teaching various subjects. Committed to leveraging AI technology to enhance teaching efficiency and student outcomes.'

  const usedAiToolsCount = (() => {
    try {
      const list = JSON.parse(localStorage.getItem('used_ai_tools') || '[]')
      const inferred = new Set(list)
      if (totalTopics > 0) inferred.add('planner')
      if (assetsCreated > totalTopics) inferred.add('digitizer')
      return inferred.size
    } catch (e) {
      return 0
    }
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-6 w-full max-w-5xl mx-auto pb-12 text-left"
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold font-space tracking-tight text-white leading-tight">My Profile</h2>
        <p className="text-gray-400 text-sm font-semibold">View your public profile details and statistics.</p>
      </div>

      {/* Profile Details Card */}
      <div className="border border-white/[0.06] bg-[#070a08]/40 rounded-2xl p-8 shadow-xl backdrop-blur-md">
        <div className="space-y-8">
          {/* Profile Header Card */}
          <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0c0d0d] pb-6">
            {/* Cover Image / Gradient */}
            <div 
              className="relative w-full h-44 sm:h-52 rounded-t-3xl overflow-hidden border-b border-white/[0.04]"
              style={{
                background: 'linear-gradient(to right, var(--theme-dark-accent, #021c0e), var(--theme-cta-from, #0c1c13), var(--theme-glow, #10b981))'
              }}
            >
              {coverImage ? (
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div 
                  className="w-full h-full opacity-80"
                  style={{
                    background: 'linear-gradient(to right, var(--theme-dark-accent, #021c0e), var(--theme-cta-from, #0c1c13), var(--theme-glow, #10b981))'
                  }}
                />
              )}
            </div>
            
            {/* Profile Photo Overlapping */}
            <div className="absolute left-6 sm:left-8 top-[176px] sm:top-[208px] -translate-y-1/2 z-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-[#070a08] bg-[#1a0f12] flex items-center justify-center shadow-2xl relative select-none">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl font-extrabold text-[var(--color-emerald-400)]">
                    {(profileName || 'E').charAt(0).toUpperCase()}
                  </span>
                )}
                {/* Active Status Badge */}
                <span className="absolute bottom-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-emerald-500 border-[3px] border-[#070a08] shadow-md" />
              </div>
            </div>

            {/* Profile Bio Details Row */}
            <div className="pt-16 sm:pt-6 px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1 min-w-0 sm:pl-32">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-space leading-tight truncate mb-0.5">
                  {profileName}
                </h2>
                <div className="text-xs text-gray-400 font-medium leading-none mb-2">
                  {userEmail}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <HiOutlineAcademicCap className="text-gray-500 shrink-0" size={14} />
                  <span>{schoolName || 'Institution not set'}</span>
                </div>
                <div className="pt-0.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 uppercase tracking-wider">
                    Teacher
                  </span>
                </div>
              </div>

              <button
                onClick={onEditRedirect}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-black/60 hover:bg-black border border-white/[0.08] hover:border-white/20 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md cursor-pointer font-space"
              >
                <HiOutlinePencil size={13} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Left and Right Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* About Card */}
              <div className="border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-6 sm:p-7 shadow-md flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                  <h3 className="font-space text-sm font-bold text-white uppercase tracking-wider">ABOUT</h3>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {aboutMe}
                </p>
              </div>

              {/* Usage Overview Card */}
              <div className="border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-6 sm:p-7 shadow-md flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                  <h3 className="font-space text-base font-bold text-white">Usage Overview</h3>
                </div>
                
                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1: AI Tools Used */}
                  <div className="border border-white/[0.04] bg-[#050706] p-5 rounded-2xl flex flex-col shadow-md">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <HiOutlineUser size={15} />
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">AI Tools Used</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white mt-3 font-space">{usedAiToolsCount}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">This month</div>
                  </div>

                  {/* Card 2: Time Saved */}
                  <div className="border border-white/[0.04] bg-[#050706] p-5 rounded-2xl flex flex-col shadow-md">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <HiOutlineClock size={15} />
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Time Saved</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white mt-3 font-space">
                      {((totalTopics * 3) + (assetsCreated * 2))}h
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Estimated</div>
                  </div>

                  {/* Card 3: Resources */}
                  <div className="border border-white/[0.04] bg-[#050706] p-5 rounded-2xl flex flex-col shadow-md">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <HiOutlineDocumentText size={15} />
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Resources</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white mt-3 font-space">
                      {assetsCreated}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Created</div>
                  </div>

                  {/* Card 4: AI Tokens */}
                  <div className="border border-white/[0.04] bg-[#050706] p-5 rounded-2xl flex flex-col shadow-md">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <HiOutlineLightningBolt size={15} />
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">AI Tokens</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white mt-3 font-space">
                      {((totalTopics * 15) + (assetsCreated * 8)).toFixed(1)}k
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Processed</div>
                  </div>

                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Details Card */}
              <div className="border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-6 sm:p-7 shadow-md flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                  <h3 className="font-space text-base font-bold text-white">Details</h3>
                </div>
                
                <div className="space-y-5">
                  {/* Institution */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <HiOutlineAcademicCap size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Institution</span>
                      <span className="text-sm font-semibold text-white mt-0.5">{schoolName || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <HiOutlineBookOpen size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subjects</span>
                      <span className="text-sm font-semibold text-white mt-0.5">{subjectsTaught || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <HiOutlineStar size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Experience</span>
                      <span className="text-sm font-semibold text-white mt-0.5">{experience || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <HiOutlineAcademicCap size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Qualification</span>
                      <span className="text-sm font-semibold text-white mt-0.5">{qualification || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <HiOutlineMail size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email</span>
                      <span className="text-sm font-semibold text-white mt-0.5 truncate max-w-[180px]">{userEmail || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <HiOutlineCalendar size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Member Since</span>
                      <span className="text-sm font-semibold text-white mt-0.5">{memberSince}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function EditProfileForm({ userEmail, userName, setUserName, showToast }) {
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem('profile_image') || null)
  const [coverImage, setCoverImage] = useState(() => localStorage.getItem('profile_cover') || null)
  const profileInputRef = useRef(null)
  const coverInputRef = useRef(null)
  
  const [fullName, setFullName] = useState(() => localStorage.getItem('profile_name') || userName || '')
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('profile_schoolName') || '')
  const [subjectsTaught, setSubjectsTaught] = useState(() => localStorage.getItem('profile_subjectsTaught') || '')
  const [experience, setExperience] = useState(() => localStorage.getItem('profile_experience') || '')
  const [qualification, setQualification] = useState(() => localStorage.getItem('profile_qualification') || '')
  const [memberSince, setMemberSince] = useState(() => localStorage.getItem('profile_memberSince') || (() => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  })())
  const [aboutMe, setAboutMe] = useState(() => localStorage.getItem('profile_aboutMe') || 'Dedicated and passionate educator with a focus on creating engaging and effective learning environments. Experienced in teaching various subjects. Committed to leveraging AI technology to enhance teaching efficiency and student outcomes.')

  const handleFileClick = (type) => {
    if (type === 'profile' && profileInputRef.current) {
      profileInputRef.current.click()
    } else if (type === 'cover' && coverInputRef.current) {
      coverInputRef.current.click()
    }
  }

  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (type === 'profile') {
          setProfileImage(event.target.result)
          localStorage.setItem('profile_image', event.target.result)
          showToast('Profile photo updated successfully!', 'success')
        } else {
          setCoverImage(event.target.result)
          localStorage.setItem('profile_cover', event.target.result)
          showToast('Cover image updated successfully!', 'success')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    localStorage.setItem('profile_name', fullName)
    localStorage.setItem('profile_schoolName', schoolName)
    localStorage.setItem('profile_subjectsTaught', subjectsTaught)
    localStorage.setItem('profile_experience', experience)
    localStorage.setItem('profile_qualification', qualification)
    localStorage.setItem('profile_memberSince', memberSince)
    localStorage.setItem('profile_aboutMe', aboutMe)
    if (setUserName) {
      setUserName(fullName)
    }
    showToast('Profile updated successfully!', 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold font-space text-white">Edit Profile</h3>
        <p className="text-xs text-gray-500 mt-1">Update your profile photo, cover image, and description details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
        {/* Profile Photo */}
        <div className="md:col-span-4 flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">Profile Photo</label>
          <div
            onClick={() => handleFileClick('profile')}
            className="flex-grow min-h-[220px] border-2 border-dashed border-white/[0.08] bg-[#0c0f0d] rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/[0.01] transition-all group"
          >
            {profileImage ? (
              <div className="relative group" onClick={(e) => e.stopPropagation()}>
                <img src={profileImage} alt="Profile" className="w-28 h-28 rounded-full object-cover border border-white/10" />
                <div 
                  onClick={() => handleFileClick('profile')}
                  className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-bold transition-all cursor-pointer"
                >
                  Change
                </div>
              </div>
            ) : (
              <>
                <HiOutlineCloudUpload size={28} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs text-gray-400 mt-3 font-semibold group-hover:text-white transition-colors">Click or drag to upload</span>
              </>
            )}
            <input
              type="file"
              ref={profileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'profile')}
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="md:col-span-8 flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">Cover Image</label>
          <div
            onClick={() => handleFileClick('cover')}
            className="flex-grow min-h-[220px] border-2 border-dashed border-white/[0.08] bg-[#0c0f0d] rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/[0.01] transition-all group"
          >
            {coverImage ? (
              <div className="relative w-full h-[180px] group" onClick={(e) => e.stopPropagation()}>
                <img src={coverImage} alt="Cover" className="w-full h-full rounded-xl object-cover border border-white/10" />
                <div 
                  onClick={() => handleFileClick('cover')}
                  className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-bold transition-all cursor-pointer"
                >
                  Change Image
                </div>
              </div>
            ) : (
              <>
                <HiOutlineCloudUpload size={28} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-xs text-gray-400 mt-3 font-semibold group-hover:text-white transition-colors">Click or drag to upload</span>
              </>
            )}
            <input
              type="file"
              ref={coverInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'cover')}
            />
          </div>
        </div>
      </div>

      {/* Profile Information Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/[0.06]">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Full Name"
            className="bg-[#050706] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium placeholder-gray-500"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">Email Address</label>
          <input
            type="email"
            value={userEmail}
            disabled
            placeholder="Your email address"
            className="bg-[#050706] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-gray-400 cursor-not-allowed opacity-60 font-medium placeholder-gray-500"
          />
        </div>

        {/* School Name */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">School Name</label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="e.g., Delhi Public School"
            className="bg-[#050706] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium placeholder-gray-500"
          />
        </div>

        {/* Subjects Taught */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">Subjects Taught</label>
          <input
            type="text"
            value={subjectsTaught}
            onChange={(e) => setSubjectsTaught(e.target.value)}
            placeholder="e.g., Mathematics, Science"
            className="bg-[#050706] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium placeholder-gray-500"
          />
        </div>

        {/* Years of Experience */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">Years of Experience</label>
          <input
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g., 5 years"
            className="bg-[#050706] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium placeholder-gray-500"
          />
        </div>

        {/* Qualification */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">Qualification</label>
          <input
            type="text"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="e.g., B.Ed, M.Sc in Mathematics"
            className="bg-[#050706] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium placeholder-gray-500"
          />
        </div>

        {/* Member Since */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 mb-2">Member Since</label>
          <input
            type="text"
            value={memberSince}
            disabled
            className="bg-[#050706]/50 border border-white/[0.04] rounded-xl px-4 py-3.5 text-sm text-gray-400 font-medium cursor-not-allowed"
          />
        </div>

        {/* About Me */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-xs font-bold text-gray-400 mb-2">About Me</label>
          <textarea
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Write a brief bio about your teaching journey..."
            rows={4}
            className="bg-[#050706] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium placeholder-gray-500 resize-none w-full"
          />
        </div>
      </div>

      {/* Editing Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06] mt-4">
        <button
          type="button"
          onClick={handleSaveProfile}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-lg text-xs tracking-wide transition-all cursor-pointer"
        >
          Save Profile
        </button>
      </div>
    </div>
  )
}

export function SettingsView({ 
  showToast, 
  userEmail, 
  userName,
  setUserName,
  isDarkMode, 
  setIsDarkMode, 
  colorTheme, 
  setColorTheme,
  currentTab,
  setCurrentTab,
  totalTopics,
  assetsCreated
}) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--x', `${x}px`)
    e.currentTarget.style.setProperty('--y', `${y}px`)
  }

  // Sub-states for various tabs
  const [defaultLanguage, setDefaultLanguage] = useState('English')
  const [defaultGradeLevel, setDefaultGradeLevel] = useState('Grade 8')
  const [aiCreativity, setAiCreativity] = useState('Balanced')
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [isCreativityOpen, setIsCreativityOpen] = useState(false)
  const [customInstructions, setCustomInstructions] = useState('')
  const [defaultSubject, setDefaultSubject] = useState('Mathematics')
  const [accountEmail, setAccountEmail] = useState('educator@acharya.ai')
  const [autoSaveContent, setAutoSaveContent] = useState(true)

  const tabs = [
    { id: 'profile', name: 'Profile', icon: HiOutlineUser },
    { id: 'appearance', name: 'Appearance', icon: HiOutlineColorSwatch },
    { id: 'ai', name: 'AI Assistant', icon: HiOutlineSparkles },
    { id: 'workspace', name: 'Workspace', icon: HiOutlineFolder },
    { id: 'account', name: 'Account', icon: HiOutlineKey },
    { id: 'help', name: 'Help', icon: HiOutlineQuestionMarkCircle }
  ]

  const handleSaveSettings = () => {
    if (userEmail && userEmail !== 'educator@acharya.ai') {
      localStorage.setItem(`acharyai_${userEmail}_colorTheme`, colorTheme)
      localStorage.setItem(`acharyai_${userEmail}_isDarkMode`, isDarkMode.toString())
    }
    localStorage.setItem('colorTheme', colorTheme)
    localStorage.setItem('isDarkMode', isDarkMode.toString())
    showToast('Settings saved successfully!', 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-6 w-full max-w-5xl mx-auto pb-12"
    >
      {/* Header */}
      <div className="text-left space-y-1">
        <h2 className="text-3xl font-extrabold font-space tracking-tight text-white leading-tight">Settings</h2>
        <p className="text-gray-400 text-sm font-semibold">Manage your account, appearance, and application preferences.</p>
      </div>

      {/* Tabs list */}
      <div className="bg-[#0b0e0c]/80 border border-white/[0.06] p-1 rounded-xl flex gap-1 items-center overflow-x-auto w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-black/50 border border-white/[0.08] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Tab panel container */}
      <div onMouseMove={handleMouseMove} className="premium-glow-large border border-white/[0.06] bg-[#070a08]/40 rounded-2xl p-8 text-left shadow-xl backdrop-blur-md min-h-[400px] flex flex-col justify-between">

        {/* PROFILE TAB */}
        {currentTab === 'profile' && (
          <EditProfileForm
            showToast={showToast}
            userEmail={userEmail}
            userName={userName}
            setUserName={setUserName}
          />
        )}

        {/* APPEARANCE TAB */}
        {currentTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-space text-white">Appearance</h3>
              <p className="text-xs text-gray-500 mt-1">Customize the look and feel of the application.</p>
            </div>

            {/* Color Theme section */}
            <div className="space-y-4">
              <div>
                <span className="text-sm font-bold text-white">Color Theme</span>
                <p className="text-xs text-gray-500 mt-0.5">Choose a color theme for the interface.</p>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fresh theme */}
                <div
                  onClick={() => {
                    setColorTheme('fresh')
                    showToast('Theme accent switched to Fresh (Lime)!', 'success')
                  }}
                  className={`relative p-5 border rounded-2xl bg-[#0c0d0d] shadow-lg cursor-pointer flex flex-col gap-3 transition-all ${
                    colorTheme === 'fresh'
                      ? 'border-[#82e22c] shadow-[0_0_15px_rgba(130,226,44,0.15)]'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {/* Selected checkmark */}
                  {colorTheme === 'fresh' && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#82e22c] flex items-center justify-center text-black font-extrabold text-xs">
                      ✓
                    </div>
                  )}

                  {/* Visual preview */}
                  <div className="flex gap-2">
                    {/* Light preview card */}
                    <div className="w-10 h-7 rounded bg-white border border-black/10 p-0.5 flex flex-col justify-end">
                      <div className="w-4 h-1 rounded-sm bg-[#82e22c]" />
                    </div>
                    {/* Dark preview card */}
                    <div className="w-10 h-7 rounded bg-[#101412] border border-white/10 p-0.5 flex flex-col justify-end">
                      <div className="w-4 h-1 rounded-sm bg-[#82e22c]" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Fresh</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Lime green, energetic and youthful</p>
                  </div>

                  <div className="flex gap-1.5 mt-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#82e22c]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#65b21e]" />
                  </div>
                </div>

                {/* Teal theme */}
                <div
                  onClick={() => {
                    setColorTheme('teal')
                    showToast('Theme accent switched to Teal!', 'success')
                  }}
                  className={`relative p-5 border rounded-2xl bg-[#0c0d0d] shadow-lg cursor-pointer flex flex-col gap-3 transition-all ${
                    colorTheme === 'teal'
                      ? 'border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.15)]'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {colorTheme === 'teal' && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-teal-400 flex items-center justify-center text-black font-extrabold text-xs">
                      ✓
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="w-10 h-7 rounded bg-white border border-black/10 p-0.5 flex flex-col justify-end">
                      <div className="w-4 h-1 rounded-sm bg-teal-400" />
                    </div>
                    <div className="w-10 h-7 rounded bg-[#101412] border border-white/10 p-0.5 flex flex-col justify-end">
                      <div className="w-4 h-1 rounded-sm bg-teal-400" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Teal</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Deep teal, calm and professional</p>
                  </div>

                  <div className="flex gap-1.5 mt-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-teal-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-teal-600" />
                  </div>
                </div>

                {/* Forest theme */}
                <div
                  onClick={() => {
                    setColorTheme('forest')
                    showToast('Theme accent switched to Forest (Green)!', 'success')
                  }}
                  className={`relative p-5 border rounded-2xl bg-[#0c0d0d] shadow-lg cursor-pointer flex flex-col gap-3 transition-all ${
                    colorTheme === 'forest'
                      ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {colorTheme === 'forest' && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black font-extrabold text-xs">
                      ✓
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="w-10 h-7 rounded bg-white border border-black/10 p-0.5 flex flex-col justify-end">
                      <div className="w-4 h-1 rounded-sm bg-emerald-500" />
                    </div>
                    <div className="w-10 h-7 rounded bg-[#101412] border border-white/10 p-0.5 flex flex-col justify-end">
                      <div className="w-4 h-1 rounded-sm bg-emerald-500" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Forest</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Nature green, growth-oriented</p>
                  </div>

                  <div className="flex gap-1.5 mt-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600" />
                  </div>
                </div>

                {/* Indigo theme */}
                <div
                  onClick={() => {
                    setColorTheme('indigo')
                    showToast('Theme accent switched to Indigo!', 'success')
                  }}
                  className={`relative p-5 border rounded-2xl bg-[#0c0d0d] shadow-lg cursor-pointer flex flex-col gap-3 transition-all ${
                    colorTheme === 'indigo'
                      ? 'border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.15)]'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {colorTheme === 'indigo' && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-indigo-400 flex items-center justify-center text-black font-extrabold text-xs">
                      ✓
                    </div>
                  )}

                  <div className="flex gap-2">
                    <div className="w-10 h-7 rounded bg-white border border-black/10 p-0.5 flex flex-col justify-end">
                      <div className="w-4 h-1 rounded-sm bg-indigo-400" />
                    </div>
                    <div className="w-10 h-7 rounded bg-[#101412] border border-white/10 p-0.5 flex flex-col justify-end">
                      <div className="w-4 h-1 rounded-sm bg-indigo-400" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">Indigo</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Deep blue, intellectual and premium</p>
                  </div>

                  <div className="flex gap-1.5 mt-1">
                    <span className="w-3.5 h-3.5 rounded-full bg-indigo-400" />
                    <span className="w-3.5 h-3.5 rounded-full bg-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Mode toggle section */}
            <div
              onClick={() => {
                setIsDarkMode(!isDarkMode)
                showToast(`Theme switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode`, 'info')
              }}
              className="border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-white/20 transition-all mt-6"
            >
              <div>
                <span className="text-sm font-bold text-white">Dark Mode</span>
                <p className="text-xs text-gray-400 mt-0.5">Toggle between light and dark appearance.</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-300">
                {isDarkMode ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
              </div>
            </div>
          </div>
        )}
        {/* AI ASSISTANT TAB */}
        {currentTab === 'ai' && (
          <div 
            className="space-y-6 relative" 
            style={{ zIndex: (isLangOpen || isCreativityOpen) ? 20 : undefined }}
          >
            <div>
              <h3 className="text-xl font-bold font-space text-white">AI Assistant</h3>
              <p className="text-xs text-gray-500 mt-1">Customize the default behavior of the AI assistant.</p>
            </div>

            <div className="space-y-4 mt-6">
              {/* Default Language Row */}
              <div 
                onMouseMove={handleMouseMove} 
                className="premium-glow-hover border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative"
                style={{ zIndex: isLangOpen ? 30 : undefined }}
              >
                <div>
                  <span className="text-sm font-bold text-white">Default Language</span>
                  <p className="text-xs text-gray-500 mt-1">Set the default language for generated content.</p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLangOpen(!isLangOpen)
                      setIsCreativityOpen(false)
                    }}
                    className="flex items-center justify-between bg-[#0e1110]/90 border border-white/10 hover:border-emerald-500 hover:bg-[#121614] hover:shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all duration-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white font-semibold cursor-pointer min-w-[140px] text-left outline-none relative"
                  >
                    <span>{defaultLanguage}</span>
                    <HiOutlineChevronDown className={`absolute right-3.5 text-gray-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} size={14} />
                  </button>

                  <AnimatePresence>
                    {isLangOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 mt-2 w-40 bg-[#070b09] border border-white/[0.08] rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5"
                      >
                        {['English', 'Hindi', 'Spanish', 'French'].map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              setDefaultLanguage(lang)
                              setIsLangOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer outline-none focus:outline-none ${
                              defaultLanguage === lang
                                ? 'bg-emerald-500 text-black font-extrabold shadow'
                                : 'text-gray-400 hover:text-white hover:bg-emerald-500/20 focus:text-white focus:bg-emerald-500/20'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* AI Creativity Level Row */}
              <div 
                onMouseMove={handleMouseMove} 
                className="premium-glow-hover border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative"
                style={{ zIndex: isCreativityOpen ? 30 : undefined }}
              >
                <div>
                  <span className="text-sm font-bold text-white">AI Creativity Level</span>
                  <p className="text-xs text-gray-500 mt-1">Control the creativity of the AI responses.</p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreativityOpen(!isCreativityOpen)
                      setIsLangOpen(false)
                    }}
                    className="flex items-center justify-between bg-[#0e1110]/90 border border-emerald-500 hover:bg-[#121614] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all duration-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white font-semibold cursor-pointer min-w-[140px] text-left outline-none relative"
                  >
                    <span>{aiCreativity}</span>
                    <HiOutlineChevronDown className={`absolute right-3.5 text-gray-400 transition-transform duration-200 ${isCreativityOpen ? 'rotate-180' : ''}`} size={14} />
                  </button>

                  <AnimatePresence>
                    {isCreativityOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="absolute right-0 mt-2 w-40 bg-[#070b09] border border-white/[0.08] rounded-xl shadow-2xl z-50 p-1 flex flex-col gap-0.5"
                      >
                        {['Balanced', 'Creative', 'Precise'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              setAiCreativity(lvl)
                              setIsCreativityOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer outline-none focus:outline-none ${
                              aiCreativity === lvl
                                ? 'bg-emerald-500 text-black font-extrabold shadow'
                                : 'text-gray-400 hover:text-white hover:bg-emerald-500/20 focus:text-white focus:bg-emerald-500/20'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WORKSPACE TAB */}
        {currentTab === 'workspace' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-space text-white">Workspace</h3>
              <p className="text-xs text-gray-500 mt-1">Manage your content and storage preferences.</p>
            </div>

            <div className="mt-6">
              <div onMouseMove={handleMouseMove} className="premium-glow-hover border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">Auto-save Content</span>
                  <p className="text-xs text-gray-500 mt-1">Automatically save all generated content to your workspace.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoSaveContent(!autoSaveContent)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                    autoSaveContent ? 'bg-emerald-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black shadow-md transform transition-transform duration-200 ${
                      autoSaveContent ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNT TAB */}
        {currentTab === 'account' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-space text-white">Account & Security</h3>
              <p className="text-xs text-gray-500 mt-1">Manage your account email and security settings.</p>
            </div>

            <div className="space-y-4 mt-6">
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-[#050706] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed opacity-60 font-medium placeholder-gray-500"
                />
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="pt-6 border-t border-white/[0.06] space-y-4">
              <div>
                <h4 className="text-sm font-bold text-red-500">Delete Account</h4>
                <p className="text-xs text-gray-500 mt-1">Permanently delete your account and all your data. This action cannot be undone.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  showToast('Account deletion request received.', 'info')
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-lg text-xs tracking-wide transition-colors cursor-pointer"
              >
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* HELP TAB */}
        {currentTab === 'help' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-space text-white">Help & Support</h3>
              <p className="text-xs text-gray-500 mt-1">Get help with Learnivo and connect with our teacher community.</p>
            </div>

            <div className="space-y-4 mt-6">
              {/* Take the Tour Again */}
              <div onMouseMove={handleMouseMove} className="premium-glow-hover border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-300">
                    <HiOutlineRefresh size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Take the Tour Again</span>
                    <span className="text-xs text-gray-400 mt-0.5 block">Learn how to use Learnivo features</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Starting system tour...', 'info')
                  }}
                  className="px-4 py-2 bg-black border border-white/10 hover:border-white/20 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  Restart Tour
                </button>
              </div>

              {/* Join Teacher Community */}
              <div onMouseMove={handleMouseMove} className="premium-glow-hover border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-300">
                    <HiOutlineChat className="text-emerald-500" size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Join Teacher Community</span>
                    <span className="text-xs text-gray-400 mt-0.5 block">WhatsApp group for tips, support & updates</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.open('https://whatsapp.com', '_blank')
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg text-xs font-extrabold transition-all cursor-pointer"
                >
                  <span>Join Group</span>
                  <HiOutlineExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Need Immediate Help? */}
            <div onMouseMove={handleMouseMove} className="premium-glow-hover border border-white/[0.08] bg-[#0c0d0d] rounded-2xl p-6 mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">Need Immediate Help?</h4>
                <p className="text-xs text-gray-400 mt-1">If you need quick assistance, you can also reach out directly via WhatsApp.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.open('https://wa.me/xyz', '_blank')
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-black border border-white/10 hover:border-white/20 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <HiOutlineChat size={16} className="text-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        {currentTab !== 'profile' && (
          <div 
            className="mt-8 pt-6 border-t border-white/[0.06] flex justify-end gap-3 relative"
            style={{ zIndex: 1 }}
          >
            <button
              onClick={handleSaveSettings}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-lg text-sm tracking-wide transition-colors cursor-pointer"
            >
              Save All Settings
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}




