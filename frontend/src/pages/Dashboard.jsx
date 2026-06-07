import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import TourGuide from '../components/TourGuide'
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
  const socketRef = useRef(null)
  const [deckUid, setDeckUid] = useState(null)
  const navigate = useNavigate()

  // Lifted Live Flight Deck States to survive tab switches
  const [isDeckLive, setIsDeckLive] = useState(false)
  const [deckPin, setDeckPin] = useState('')
  const [deckJoinedStudents, setDeckJoinedStudents] = useState([])
  const [deckDoubts, setDeckDoubts] = useState([])
  const [deckChatMessages, setDeckChatMessages] = useState([])
  const [deckWhiteboardHistory, setDeckWhiteboardHistory] = useState([])
  const [deckHistoryIndex, setDeckHistoryIndex] = useState(0)
  const [deckIsSharingWhiteboard, setDeckIsSharingWhiteboard] = useState(false)
  const [deckZoom, setDeckZoom] = useState(1.0)
  const [deckPanOffset, setDeckPanOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const savedInfo = localStorage.getItem('userInfo')
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo)
        if (info.role === 'Student') {
          navigate('/student-dashboard')
          return
        }
      } catch (e) {}
    } else {
      navigate('/login')
      return
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    socketRef.current = io(API_URL)

    const newDeckUid = Math.floor(100000 + Math.random() * 900000).toString()
    setDeckUid(newDeckUid)

    // Register globally-active Live Flight Deck listeners
    socketRef.current.on('teacher:update_students', (studentsList) => {
      setDeckJoinedStudents(studentsList || []);
    });

    socketRef.current.on('deck:doubt_received', (doubt) => {
      setDeckDoubts(prev => [...prev, doubt]);
    });

    socketRef.current.on('deck:doubt_resolved', (doubtId) => {
      setDeckDoubts(prev => prev.filter(d => d.id !== doubtId));
    });

    socketRef.current.on('deck:chat_message', (msg) => {
      setDeckChatMessages(prev => [...prev, msg]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off('teacher:update_students');
        socketRef.current.off('deck:doubt_received');
        socketRef.current.off('deck:doubt_resolved');
        socketRef.current.off('deck:chat_message');
        socketRef.current.disconnect();
      }
    }
  }, [])

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
  const [tourStartTrigger, setTourStartTrigger] = useState(0)
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
  const [subjectsTaught, setSubjectsTaught] = useState(() => localStorage.getItem('profile_subjectsTaught') || '')
  const [experience, setExperience] = useState(() => localStorage.getItem('profile_experience') || '')
  const [qualification, setQualification] = useState(() => localStorage.getItem('profile_qualification') || '')
  const [aboutMe, setAboutMe] = useState(() => localStorage.getItem('profile_aboutMe') || 'Dedicated and passionate educator with a focus on creating engaging and effective learning environments. Experienced in teaching various subjects. Committed to leveraging AI technology to enhance teaching efficiency and student outcomes.')
  const [memberSince, setMemberSince] = useState(() => localStorage.getItem('profile_memberSince') || '')
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

  // Switch to the main overview tab when the tour is started
  useEffect(() => {
    if (tourStartTrigger > 0) {
      setActiveTab('overview')
    }
  }, [tourStartTrigger])

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenTour')
    if (!hasSeen) {
      setActiveTab('overview')
    }
  }, [])

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
    
    // Broadcast material to students via sockets
    if (socketRef.current && deployedMaterial) {
      socketRef.current.emit('teacher:push_material', deployedMaterial);
    }
    
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
                    status: st.status || 'focused',
                    lastActive: 'Active now',
                    assignmentStatus: st.assignmentStatus || 'Not Started',
                    currentProgress: st.currentProgress || 'Idle',
                    doubt: st.doubt !== undefined ? st.doubt : null,
                    row: st.row !== undefined ? st.row : Math.floor(index / 3),
                    col: st.col !== undefined ? st.col : index % 3,
                    grade: st.grade || 'N/A',
                    aiFeedback: st.aiFeedback || ''
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
                if (data.name) {
                  setUserName(data.name)
                  localStorage.setItem('profile_name', data.name)
                }
                if (data.picture) {
                  setUserPicture(data.picture)
                  localStorage.setItem('profile_image', data.picture)
                }
                if (data.credits !== undefined) setCredits(data.credits)
                if (data.subjectsTaught !== undefined) setSubjectsTaught(data.subjectsTaught)
                if (data.experience !== undefined) setExperience(data.experience)
                if (data.qualification !== undefined) setQualification(data.qualification)
                if (data.aboutMe !== undefined) setAboutMe(data.aboutMe)
                if (data.createdAt) {
                  const date = new Date(data.createdAt)
                  const day = String(date.getDate()).padStart(2, '0')
                  const month = String(date.getMonth() + 1).padStart(2, '0')
                  const year = date.getFullYear()
                  const formattedDate = `${day}/${month}/${year}`
                  setMemberSince(formattedDate)
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
      const syncCredits = async () => {
        try {
          const savedInfo = localStorage.getItem('userInfo')
          if (!savedInfo) return
          const info = JSON.parse(savedInfo)
          if (!info.token) return
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
          await fetch(`${API_URL}/api/auth/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${info.token}`
            },
            body: JSON.stringify({ credits })
          })
        } catch (e) {
          console.error('Failed to sync credits with backend:', e)
        }
      }
      syncCredits()
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
        
        if (socketRef.current) {
          socketRef.current.emit('teacher:add_student', newStudent)
        }
        
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
      showToast(`Failed to add student. Please check your network connection.`, 'error')
    }
  }

  const handleAddStudentByUid = async (uid) => {
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      if (!info.token) return

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/students/add-by-uid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${info.token}`
        },
        body: JSON.stringify({ uid, classroom: 'General' })
      })

      if (res.ok) {
        const newStudent = await res.json()
        showToast(`Student with UID "${uid}" enrolled successfully!`, 'success')
        
        if (socketRef.current) {
          socketRef.current.emit('teacher:add_student', newStudent)
        }
        
        // Fetch updated student list
        const reRes = await fetch(`${API_URL}/api/students`, {
          headers: { 'Authorization': `Bearer ${info.token}` }
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
      showToast(`Failed to add student by UID.`, 'error')
    }
  }

  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: HiOutlineHome, description: 'Class summary & quick actions' },
    { id: 'flight-deck', name: 'Live Flight Deck', icon: HiOutlineStatusOnline, description: 'Live student response & monitoring panel' },
    { id: 'whiteboard', name: 'Interactive Whiteboard', icon: HiOutlinePencil, description: 'Draw, present, and sync live canvas' },
    { id: 'planner', name: 'Lesson Planner', icon: HiOutlineCalendar, description: 'Create comprehensive lesson plans in seconds' },
    { id: 'digitizer', name: 'Paper Digitizer', icon: HiOutlineDocumentText, description: 'Digitize handwritten exams & assignments' },
    { id: 'visual-aids', name: 'Visual Aids', icon: HiOutlineSparkles, description: 'Create engaging diagrams and charts for your lessons' },
    { id: 'math-helper', name: 'Math Helper', icon: HiOutlineCalculator, description: 'Solve any math problem with step-by-step explanations' },
    { id: 'course-creator', name: 'Branching Course Creator', icon: HiOutlineBookOpen, description: 'Create and deploy custom branching syllabus routes for students' },
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
            socketRef={socketRef}
            deckUid={deckUid}
            handleAddStudentByUid={handleAddStudentByUid}
            digitizedResult={digitizedResult}
            setActiveTab={setActiveTab}
            students={students}
            setStudents={setStudents}
            pushWorksheetToClass={pushWorksheetToClass}
            deployedMaterial={deployedMaterial}
            setDeployedMaterial={setDeployedMaterial}
            handleAddStudent={handleAddStudent}
            isLive={isDeckLive}
            setIsLive={setIsDeckLive}
            deckPin={deckPin}
            setDeckPin={setDeckPin}
            joinedStudents={deckJoinedStudents}
            setJoinedStudents={setDeckJoinedStudents}
            doubts={deckDoubts}
            setDoubts={setDeckDoubts}
            chatMessages={deckChatMessages}
            setChatMessages={setDeckChatMessages}
            isSharingWhiteboard={deckIsSharingWhiteboard}
            setIsSharingWhiteboard={setDeckIsSharingWhiteboard}
          />
        )
      case 'whiteboard':
        return (
          <InteractiveWhiteboard
            socketRef={socketRef}
            isLive={isDeckLive}
            deckPin={deckPin}
            whiteboardHistory={deckWhiteboardHistory}
            setWhiteboardHistory={setDeckWhiteboardHistory}
            historyIndex={deckHistoryIndex}
            setHistoryIndex={setDeckHistoryIndex}
            isSharingWhiteboard={deckIsSharingWhiteboard}
            setIsSharingWhiteboard={setDeckIsSharingWhiteboard}
            zoom={deckZoom}
            setZoom={setDeckZoom}
            panOffset={deckPanOffset}
            setPanOffset={setDeckPanOffset}
            setActiveTab={setActiveTab}
          />
        )
      case 'math-helper':
        return (
          <MathHelper
            showToast={showToast}
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
            subjectsTaught={subjectsTaught}
            experience={experience}
            qualification={qualification}
            aboutMe={aboutMe}
            memberSince={memberSince}
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
            subjectsTaught={subjectsTaught}
            setSubjectsTaught={setSubjectsTaught}
            experience={experience}
            setExperience={setExperience}
            qualification={qualification}
            setQualification={setQualification}
            aboutMe={aboutMe}
            setAboutMe={setAboutMe}
            memberSince={memberSince}
            setMemberSince={setMemberSince}
            userPicture={userPicture}
            setUserPicture={setUserPicture}
            onRestartTour={() => setTourStartTrigger(prev => prev + 1)}
          />
        )
      case 'course-creator':
        return (
          <BranchingCourseCreator
            showToast={showToast}
            onCourseCreated={() => {
              setTotalTopics(prev => prev + 1)
              setWeeklyActivity(prev => prev + 1)
            }}
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
        <div className={`flex items-center gap-3 mb-6 shrink-0 relative group ${isSidebarCollapsed ? 'justify-center px-0' : 'px-2'}`} data-tour="brand-logo">
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
              techUs
            </span>
          )}
        </div>

        {/* Dynamic Scrollable Navigation */}
        <nav className={`flex-1 space-y-1 pr-1 overflow-y-auto ${isSidebarCollapsed ? 'scrollbar-none' : 'custom-sidebar-scroll'}`}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <div key={item.id} className="relative group" data-tour={`nav-${item.id}`}>
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
            <div className="bg-[#0b100d]/80 border border-white/[0.06] p-4 rounded-xl shadow-inner space-y-3.5" data-tour="credits-panel">
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
            <div className="flex justify-center" title={`Credits: ${credits} / 30`} data-tour="credits-panel">
              <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                {credits}
              </span>
            </div>
          )}

          {/* Profile Card Wrapper */}
          <div className="relative" data-tour="profile-menu">
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
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        setTourStartTrigger(prev => prev + 1)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-emerald-500 text-gray-700 dark:text-gray-200 hover:text-white transition-all text-xs font-semibold group cursor-pointer block text-left"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <HiOutlineSparkles className="text-gray-400 group-hover:text-white transition-colors" size={16} />
                          <span>Product Tour</span>
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
                      techUs
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
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-space">techUs Helper</span>
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
      <TourGuide
        startTrigger={tourStartTrigger}
        onComplete={() => setTourStartTrigger(0)}
        onStepChange={(stepIndex) => {
          if (stepIndex === 0 || stepIndex === 1 || stepIndex === 5) {
            setActiveTab('overview')
          } else if (stepIndex === 2) {
            setActiveTab('whiteboard')
          } else if (stepIndex === 3 || stepIndex === 4) {
            setActiveTab('flight-deck')
          }
        }}
      />
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
      <div data-tour="dashboard-title" className="w-fit">
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


function LiveFlightDeck({
  socketRef,
  deckUid: initialDeckUid,
  handleAddStudentByUid,
  digitizedResult,
  setActiveTab,
  students,
  setStudents,
  pushWorksheetToClass,
  deployedMaterial,
  setDeployedMaterial,
  handleAddStudent,
  
  // Destructured props from parent Dashboard component
  isLive,
  setIsLive,
  deckPin,
  setDeckPin,
  joinedStudents,
  setJoinedStudents,
  doubts,
  setDoubts,
  chatMessages,
  setChatMessages,
  isSharingWhiteboard,
  setIsSharingWhiteboard
}) {
  const [chatInput, setChatInput] = useState('');
  
  // Auto scroll chat
  const chatEndRef = useRef(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleToggleShare = (forceState = null) => {
    const nextSharing = forceState !== null ? forceState : !isSharingWhiteboard;
    setIsSharingWhiteboard(nextSharing);
    if (socketRef.current) {
      socketRef.current.emit('teacher:toggle_share_whiteboard', { isSharing: nextSharing });
    }
  };

  const handleStartDeck = () => {
    const pin = initialDeckUid || Math.floor(100000 + Math.random() * 900000).toString();
    setDeckPin(pin);
    setIsLive(true);
    setIsSharingWhiteboard(false);
    if (socketRef.current) {
      socketRef.current.emit('teacher:start_deck', { deckUid: pin });
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      sender: 'Professor',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    if (socketRef.current) {
      socketRef.current.emit('deck:chat_message', { deckUid: deckPin, message: msg });
    }
    setChatInput('');
  };

  const handleResolveDoubt = (doubtId) => {
    if (socketRef.current) {
      socketRef.current.emit('deck:resolve_doubt', { deckUid: deckPin, doubtId });
    }
  };

  const renderJoinedStudents = (fullHeight = false) => (
    <div className={`border border-white/[0.08] bg-[#070b09]/80 p-4 rounded-2xl flex flex-col min-h-0 ${fullHeight ? 'flex-1' : 'h-[190px] shrink-0'}`} data-tour="flight-deck-seating">
      <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.06] shrink-0">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space flex items-center gap-2">
          <span>Joined Students</span>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono text-[10px]">{joinedStudents.length}</span>
        </h4>
        <button
          type="button"
          onClick={() => {
            const name = prompt("Enter Student's Full Name:")
            if (!name) return
            const email = prompt("Enter Student's Email:")
            if (!email) return
            handleAddStudent(name, email)
          }}
          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold rounded transition-colors font-space shrink-0 cursor-pointer"
          data-tour="flight-deck-add-student"
        >
          + Add Student
        </button>
      </div>
      
      <div className="mt-3 overflow-y-auto flex-1 pr-1 space-y-2 custom-sidebar-scroll">
        {joinedStudents.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-[10px] text-gray-500 italic">Waiting for students to join using PIN...</p>
          </div>
        ) : (
          joinedStudents.map((student, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/[0.04] p-2 rounded-xl flex items-center justify-between transition-colors hover:bg-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-[10px] text-emerald-400 font-extrabold font-space">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate leading-none">{student.name}</p>
                  <p className="text-[9px] text-gray-500 truncate mt-1">{student.uid || student.email}</p>
                </div>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderDoubtInbox = (fullHeight = false) => (
    <div className="border border-white/[0.08] bg-[#070b09]/80 p-4 rounded-2xl flex flex-col min-h-0 flex-1">
      <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.06] shrink-0">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space flex items-center gap-2">
          <span>Doubt Inbox</span>
          {doubts.length > 0 && (
            <span className="bg-rose-500/15 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono text-[10px] animate-pulse">{doubts.length}</span>
          )}
        </h4>
      </div>

      <div className="mt-3 overflow-y-auto flex-1 pr-1 space-y-2.5 custom-sidebar-scroll">
        {doubts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-6">
            <svg className="w-8 h-8 text-[#262d29] mb-1.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
            <p className="text-[10px] text-gray-500 font-semibold">No doubts raised yet.</p>
          </div>
        ) : (
          doubts.map((doubt) => (
            <div key={doubt.id} className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-300 rounded-xl text-xs space-y-2 flex flex-col animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/[0.04] pb-1.5 shrink-0">
                <span className="font-extrabold text-white">{doubt.studentName}</span>
                <button
                  onClick={() => handleResolveDoubt(doubt.id)}
                  className="px-2 py-0.5 bg-rose-500/15 border border-rose-500/35 hover:bg-rose-500/25 rounded text-[9px] text-rose-400 font-bold transition-all cursor-pointer"
                >
                  Resolve
                </button>
              </div>
              <p className="text-[11px] text-gray-300 leading-normal italic font-semibold select-text">
                "${doubt.text}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderRoomChat = (fullHeight = false) => (
    <div className={`border border-white/[0.08] bg-[#070b09]/80 p-4 rounded-2xl flex flex-col min-h-0 ${fullHeight ? 'flex-1' : 'h-[250px] shrink-0'}`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] shrink-0">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">Synced Room Chat</h4>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 text-[11px] custom-sidebar-scroll">
        {chatMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-[10px] italic">
            Class chatroom is empty. Say hello!
          </div>
        ) : (
          chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] rounded-xl px-3 py-2 border ${
                msg.sender === 'Professor'
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-white ml-auto text-right'
                  : 'bg-white/[0.04] border-white/[0.08] text-gray-200 mr-auto text-left'
              }`}
            >
              <span className="text-[8px] font-bold text-gray-500">{msg.sender} • {msg.timestamp}</span>
              <p className="mt-0.5 font-semibold leading-relaxed select-text">{msg.text}</p>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendChat} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Broadcast announcement to classroom..."
          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-semibold"
        />
        <button
          type="submit"
          className="px-4 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
        </button>
      </form>
    </div>
  );

  if (!isLive) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-white/[0.08] bg-[#070b09]/40 backdrop-blur-xl rounded-3xl text-center space-y-6 max-w-2xl mx-auto my-12 relative overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.05)]">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-500/[0.02] blur-[100px] pointer-events-none" />
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative z-10 animate-pulse">
          <HiOutlineStatusOnline size={40} />
        </div>
        <div className="space-y-2.5 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-space tracking-tight">Interactive Flight Deck</h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto font-semibold">
            Start a live whiteboard class session. Draw structures, explain concepts, chat in real-time, and solve student doubts instantly.
          </p>
        </div>
        <button
          onClick={handleStartDeck}
          className="py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-black text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer shadow-[0_4px_20px_rgba(16,185,129,0.3)] relative z-10"
        >
          Start Live Flight Deck
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-4 w-full h-[calc(100vh-120px)]"
    >
      {/* Dynamic Session Controls Header */}
      <div className="border border-white/[0.08] bg-[#070b09]/90 p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          <div>
            <span className="text-sm font-black uppercase text-emerald-400 tracking-wider font-space">Live Flight Deck Session</span>
            {deckPin && <p className="text-[10px] text-gray-400 font-semibold mt-0.5">PIN: {deckPin} | Connected Students: {joinedStudents.length}</p>}
          </div>
        </div>
        
        {/* Buttons to share whiteboard / stop share / go to whiteboard */}
        <div className="flex items-center gap-3">
          {/* Share Whiteboard */}
          <button
            onClick={() => handleToggleShare(true)}
            disabled={isSharingWhiteboard}
            className={`py-2 px-5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-2 shadow-md ${
              isSharingWhiteboard
                ? 'bg-emerald-500/10 text-emerald-500/30 border border-white/[0.05] cursor-not-allowed opacity-40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.25)] border border-emerald-500/20'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742h.008v.008h-.008v-.008zM12 8.25a.75.75 0 100-1.5.75 0 000 1.5zm0 0v-3.75m0 3.75a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zm0 7.5v3.75M12 12h.008v.008H12V12z" /></svg>
            <span>Share Whiteboard</span>
          </button>

          {/* Stop Sharing */}
          <button
            onClick={() => handleToggleShare(false)}
            disabled={!isSharingWhiteboard}
            className={`py-2 px-5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-2 shadow-md ${
              !isSharingWhiteboard
                ? 'bg-rose-500/10 text-rose-500/30 border border-white/[0.05] cursor-not-allowed opacity-40'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.25)] border border-rose-500/25'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.36 18.36a9 9 0 01-12.728 0M12 2v10m0 0l-3-3m3 3l3-3" /></svg>
            <span>Stop Sharing</span>
          </button>

          <div className="w-px h-6 bg-white/[0.08] mx-1" />

          {/* Open Canvas Tab */}
          <button
            onClick={() => setActiveTab('whiteboard')}
            className="py-2 px-5 bg-gradient-to-r from-teal-500/20 to-emerald-500/10 hover:from-teal-500/35 hover:to-emerald-500/20 border border-teal-500/40 text-teal-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-md shadow-teal-500/10"
          >
            <HiOutlinePencil size={14} />
            <span>Go to Whiteboard</span>
          </button>
        </div>
      </div>

      {/* Main Grid Workspace - Always show student panels in 3-column layout */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch h-full min-h-0">
          {renderJoinedStudents(true)}
          {renderDoubtInbox(true)}
          {renderRoomChat(true)}
        </div>
      </div>
    </motion.div>
  );
}

function InteractiveWhiteboard({
  socketRef,
  isLive,
  deckPin,
  whiteboardHistory,
  setWhiteboardHistory,
  historyIndex,
  setHistoryIndex,
  isSharingWhiteboard,
  setIsSharingWhiteboard,
  zoom,
  setZoom,
  panOffset,
  setPanOffset,
  setActiveTab
}) {
  const [tool, setTool] = useState('pencil'); // 'pencil' | 'line' | 'rect' | 'circle' | 'eraser' | 'text' | 'select' | 'hand' | 'arrow' | 'diamond'
  const [brushColor, setBrushColor] = useState('#10b981');
  const [brushWidth, setBrushWidth] = useState(4);
  const [fillColor, setFillColor] = useState('transparent');
  const [opacity, setOpacity] = useState(100);
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontSize, setFontSize] = useState(4);
  const [textAlign, setTextAlign] = useState('left');

  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textInputPos, setTextInputPos] = useState(null);
  const [textInputValue, setTextInputValue] = useState('');

  const canvasRef = useRef(null);
  const currentStrokeRef = useRef(null);

  // Selection states
  const [selectedElementIdx, setSelectedElementIdx] = useState(-1);
  const draggedOriginalElementRef = useRef(null);

  // Redraw canvas on history, visibility, zoom, or pan changes
  useEffect(() => {
    redrawCanvas();
  }, [whiteboardHistory, historyIndex, zoom, panOffset]);

  // Sync zoom and pan wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleCanvasWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
      const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.15), 8.0);
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const nextPanOffset = {
        x: mouseX - (mouseX - panOffset.x) * (newZoom / zoom),
        y: mouseY - (mouseY - panOffset.y) * (newZoom / zoom)
      };
      
      setZoom(newZoom);
      setPanOffset(nextPanOffset);
      
      if (isLive && socketRef.current) {
        socketRef.current.emit('teacher:sync_zoom_pan', { zoom: newZoom, panOffset: nextPanOffset });
      }
    };
    canvas.addEventListener('wheel', handleCanvasWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleCanvasWheel);
    };
  }, [zoom, panOffset, isLive]);

  // Handle canvas size initialization and resize events
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = Math.max(container.clientHeight, 550);
      redrawCanvas();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleShare = () => {
    const nextSharing = !isSharingWhiteboard;
    setIsSharingWhiteboard(nextSharing);
    if (socketRef.current) {
      socketRef.current.emit('teacher:toggle_share_whiteboard', { isSharing: nextSharing });
    }
  };

  const handleZoomPanChange = (newZoom, newPanOffset) => {
    setZoom(newZoom);
    setPanOffset(newPanOffset);
    if (isLive && socketRef.current) {
      socketRef.current.emit('teacher:sync_zoom_pan', { zoom: newZoom, panOffset: newPanOffset });
    }
  };

  const drawActionScaled = (ctx, action, targetWidth, targetHeight) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const scaleX = targetWidth / (action.canvasWidth || 800);
    const scaleY = targetHeight / (action.canvasHeight || 600);
    
    const oldAlpha = ctx.globalAlpha;
    if (action.opacity !== undefined) {
      ctx.globalAlpha = action.opacity / 100;
    }
    
    if (action.type === 'pencil' || action.type === 'eraser') {
      if (action.points.length < 1) return;
      ctx.beginPath();
      ctx.strokeStyle = action.type === 'eraser' ? '#050907' : action.color;
      ctx.lineWidth = action.size * Math.min(scaleX, scaleY);
      ctx.moveTo(action.points[0].x * scaleX, action.points[0].y * scaleY);
      for (let i = 1; i < action.points.length; i++) {
        ctx.lineTo(action.points[i].x * scaleX, action.points[i].y * scaleY);
      }
      ctx.stroke();
    } else if (action.type === 'shape') {
      ctx.strokeStyle = action.color;
      ctx.lineWidth = action.size * Math.min(scaleX, scaleY);
      ctx.fillStyle = action.fillColor || 'transparent';
      
      const x1 = action.x1 * scaleX;
      const y1 = action.y1 * scaleY;
      const x2 = action.x2 * scaleX;
      const y2 = action.y2 * scaleY;
      
      if (action.shape === 'line') {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (action.shape === 'rect') {
        if (action.fillColor && action.fillColor !== 'transparent') {
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        }
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      } else if (action.shape === 'circle') {
        ctx.beginPath();
        const r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        ctx.arc(x1, y1, r, 0, 2 * Math.PI);
        if (action.fillColor && action.fillColor !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
      } else if (action.shape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(x1 + (x2 - x1) / 2, y1);
        ctx.lineTo(x2, y1 + (y2 - y1) / 2);
        ctx.lineTo(x1 + (x2 - x1) / 2, y2);
        ctx.lineTo(x1, y1 + (y2 - y1) / 2);
        ctx.closePath();
        if (action.fillColor && action.fillColor !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
      } else if (action.shape === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowLength = 12 * Math.min(scaleX, scaleY);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - arrowLength * Math.cos(angle - Math.PI / 6), y2 - arrowLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - arrowLength * Math.cos(angle + Math.PI / 6), y2 - arrowLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = action.color;
        ctx.fill();
      }
    } else if (action.type === 'text') {
      ctx.fillStyle = action.color;
      const scaledSize = action.size * Math.min(scaleX, scaleY);
      const fontFamily = action.fontFamily === 'handdrawn' ? '"Comic Sans MS", cursive, sans-serif' : action.fontFamily === 'mono' ? 'monospace' : 'sans-serif';
      ctx.font = `${scaledSize * 3 + 12}px ${fontFamily}`;
      ctx.textAlign = action.textAlign || 'left';
      ctx.fillText(action.text, action.x * scaleX, action.y * scaleY);
      ctx.textAlign = 'left';
    }
    
    ctx.globalAlpha = oldAlpha;
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);

    // Grid background
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
    ctx.lineWidth = 1 / zoom;
    const gridStep = 25;
    const halfW = 2000;
    const halfH = 2000;
    for (let x = -halfW; x < canvas.width + halfW; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, -halfH); ctx.lineTo(x, canvas.height + halfH); ctx.stroke();
    }
    for (let y = -halfH; y < canvas.height + halfH; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(-halfW, y); ctx.lineTo(canvas.width + halfW, y); ctx.stroke();
    }

    // Active history
    const activeHistory = whiteboardHistory.slice(0, historyIndex);
    activeHistory.forEach(action => {
      drawActionScaled(ctx, action, canvas.width, canvas.height);
    });

    ctx.restore();
  };

  const isHit = (action, x, y, threshold) => {
    if (action.type === 'pencil' || action.type === 'eraser') {
      return action.points.some(p => Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2)) <= threshold + action.size);
    } else if (action.type === 'shape') {
      const { x1, y1, x2, y2, shape } = action;
      if (shape === 'line' || shape === 'arrow') {
        const A = x - x1;
        const B = y - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;
        let xx, yy;
        if (param < 0) {
          xx = x1;
          yy = y1;
        } else if (param > 1) {
          xx = x2;
          yy = y2;
        } else {
          xx = x1 + param * C;
          yy = y1 + param * D;
        }
        const dist = Math.sqrt(Math.pow(x - xx, 2) + Math.pow(y - yy, 2));
        return dist <= threshold + action.size;
      } else if (shape === 'rect') {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        if (action.fillColor && action.fillColor !== 'transparent') {
          return x >= minX && x <= maxX && y >= minY && y <= maxY;
        }
        const nearLeft = Math.abs(x - minX) <= threshold;
        const nearRight = Math.abs(x - maxX) <= threshold;
        const nearTop = Math.abs(y - minY) <= threshold;
        const nearBottom = Math.abs(y - maxY) <= threshold;
        return ((nearLeft || nearRight) && y >= minY && y <= maxY) ||
               ((nearTop || nearBottom) && x >= minX && x <= maxX);
      } else if (shape === 'circle') {
        const cx = x1;
        const cy = y1;
        const r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        if (action.fillColor && action.fillColor !== 'transparent') {
          return dist <= r + threshold;
        }
        return Math.abs(dist - r) <= threshold;
      } else if (shape === 'diamond') {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        const cx = minX + (maxX - minX) / 2;
        const cy = minY + (maxY - minY) / 2;
        const rx = (maxX - minX) / 2;
        const ry = (maxY - minY) / 2;
        if (rx === 0 || ry === 0) return false;
        const term = Math.abs(x - cx) / rx + Math.abs(y - cy) / ry;
        if (action.fillColor && action.fillColor !== 'transparent') {
          return term <= 1.1;
        }
        return Math.abs(term - 1.0) <= 0.2;
      }
    } else if (action.type === 'text') {
      const { x: tx, y: ty, text, size } = action;
      const fontHeight = size * 3 + 12;
      const fontWidth = text.length * fontHeight * 0.6;
      return x >= tx && x <= tx + fontWidth && y >= ty - fontHeight && y <= ty;
    }
    return false;
  };

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const physicalX = clientX - rect.left;
    const physicalY = clientY - rect.top;
    
    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;
    
    return {
      x: (physicalX - panOffset.x) / (zoom * scaleX),
      y: (physicalY - panOffset.y) / (zoom * scaleY)
    };
  };

  const handleMouseDown = (e) => {
    if (textInputPos) return;
    const coords = getCanvasCoords(e);
    
    if (tool === 'hand') {
      setIsDrawing(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      draggedOriginalElementRef.current = { ...panOffset };
      return;
    }
    
    if (tool === 'text') {
      setTextInputPos(coords);
      setTextInputValue('');
      return;
    }
    
    setIsDrawing(true);
    setStartPos(coords);

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (tool === 'select') {
      const threshold = 10;
      const activeHistory = whiteboardHistory.slice(0, historyIndex);
      let foundIndex = -1;
      for (let i = activeHistory.length - 1; i >= 0; i--) {
        if (isHit(activeHistory[i], coords.x, coords.y, threshold)) {
          foundIndex = i;
          break;
        }
      }
      if (foundIndex !== -1) {
        setSelectedElementIdx(foundIndex);
        draggedOriginalElementRef.current = JSON.parse(JSON.stringify(activeHistory[foundIndex]));
      } else {
        setSelectedElementIdx(-1);
        draggedOriginalElementRef.current = null;
      }
      return;
    }

    if (tool === 'pencil' || tool === 'eraser') {
      const newAction = {
        type: tool,
        points: [coords],
        color: brushColor,
        size: brushWidth,
        opacity,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      };
      currentStrokeRef.current = newAction;
      if (isLive && socketRef.current) {
        socketRef.current.emit('teacher:draw_start', {
          x: coords.x,
          y: coords.y,
          color: tool === 'eraser' ? '#050907' : brushColor,
          size: brushWidth,
          tool,
          width: canvas.width,
          height: canvas.height
        });
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (tool === 'hand') {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      const startPan = draggedOriginalElementRef.current;
      if (startPan) {
        const nextPan = { x: startPan.x + deltaX, y: startPan.y + deltaY };
        setPanOffset(nextPan);
        if (isLive && socketRef.current) {
          socketRef.current.emit('teacher:sync_zoom_pan', { zoom, panOffset: nextPan });
        }
        redrawCanvas();
      }
      return;
    }

    const coords = getCanvasCoords(e);
    const ctx = canvas.getContext('2d');

    if (tool === 'select') {
      if (selectedElementIdx === -1 || !draggedOriginalElementRef.current) return;
      const deltaX = coords.x - startPos.x;
      const deltaY = coords.y - startPos.y;
      const original = draggedOriginalElementRef.current;
      
      let updated;
      if (original.type === 'pencil' || original.type === 'eraser') {
        updated = {
          ...original,
          points: original.points.map(p => ({ x: p.x + deltaX, y: p.y + deltaY }))
        };
      } else if (original.type === 'shape') {
        updated = {
          ...original,
          x1: original.x1 + deltaX,
          y1: original.y1 + deltaY,
          x2: original.x2 + deltaX,
          y2: original.y2 + deltaY
        };
      } else if (original.type === 'text') {
        updated = {
          ...original,
          x: original.x + deltaX,
          y: original.y + deltaY
        };
      }
      
      if (updated) {
        const copy = [...whiteboardHistory];
        copy[selectedElementIdx] = updated;
        setWhiteboardHistory(copy);
      }
      return;
    }

    const scaleX = canvas.width / 800;
    const scaleY = canvas.height / 600;

    if (tool === 'pencil' || tool === 'eraser') {
      currentStrokeRef.current.points.push(coords);
      if (isLive && socketRef.current) {
        socketRef.current.emit('teacher:draw_move', {
          x: coords.x,
          y: coords.y,
          tool
        });
      }
      redrawCanvas();
      
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoom, zoom);
      
      ctx.beginPath();
      ctx.strokeStyle = tool === 'eraser' ? '#050907' : brushColor;
      ctx.lineWidth = brushWidth * Math.min(scaleX, scaleY);
      const pts = currentStrokeRef.current.points;
      ctx.moveTo(pts[0].x * scaleX, pts[0].y * scaleY);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x * scaleX, pts[i].y * scaleY);
      }
      ctx.stroke();
      ctx.restore();
    } else {
      redrawCanvas();
      
      ctx.save();
      ctx.translate(panOffset.x, panOffset.y);
      ctx.scale(zoom, zoom);
      
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushWidth * Math.min(scaleX, scaleY);
      ctx.fillStyle = fillColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const x1 = startPos.x * scaleX;
      const y1 = startPos.y * scaleY;
      const x2 = coords.x * scaleX;
      const y2 = coords.y * scaleY;
      
      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (tool === 'rect') {
        if (fillColor && fillColor !== 'transparent') {
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        }
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      } else if (tool === 'circle') {
        ctx.beginPath();
        const r = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        ctx.arc(x1, y1, r, 0, 2 * Math.PI);
        if (fillColor && fillColor !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
      } else if (tool === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(x1 + (x2 - x1) / 2, y1);
        ctx.lineTo(x2, y1 + (y2 - y1) / 2);
        ctx.lineTo(x1 + (x2 - x1) / 2, y2);
        ctx.lineTo(x1, y1 + (y2 - y1) / 2);
        ctx.closePath();
        if (fillColor && fillColor !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
      } else if (tool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowLength = 12 * Math.min(scaleX, scaleY);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - arrowLength * Math.cos(angle - Math.PI / 6), y2 - arrowLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - arrowLength * Math.cos(angle + Math.PI / 6), y2 - arrowLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = brushColor;
        ctx.fill();
      }
      ctx.restore();
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (tool === 'hand') {
      draggedOriginalElementRef.current = null;
      return;
    }
    
    if (tool === 'select') {
      setSelectedElementIdx(-1);
      draggedOriginalElementRef.current = null;
      if (isLive && socketRef.current) {
        socketRef.current.emit('teacher:sync_history', whiteboardHistory);
      }
      return;
    }

    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    let finalAction = null;

    if (tool === 'pencil' || tool === 'eraser') {
      finalAction = currentStrokeRef.current;
    } else {
      finalAction = {
        type: 'shape',
        shape: tool,
        x1: startPos.x,
        y1: startPos.y,
        x2: coords.x,
        y2: coords.y,
        color: brushColor,
        fillColor: fillColor,
        size: brushWidth,
        opacity,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      };
    }

    if (finalAction) {
      const historyCopy = whiteboardHistory.slice(0, historyIndex);
      const newHistory = [...historyCopy, finalAction];
      setWhiteboardHistory(newHistory);
      setHistoryIndex(newHistory.length);
      
      if (isLive && socketRef.current) {
        socketRef.current.emit('teacher:draw_end', { action: finalAction });
      }
    }
    currentStrokeRef.current = null;
  };

  const handleTextCommit = () => {
    if (!textInputValue.trim() || !textInputPos) {
      setTextInputPos(null);
      return;
    }
    const canvas = canvasRef.current;
    const finalAction = {
      type: 'text',
      text: textInputValue,
      x: textInputPos.x,
      y: textInputPos.y + 5,
      color: brushColor,
      size: brushWidth,
      fontFamily: fontFamily,
      textAlign: textAlign,
      opacity: opacity,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    };

    const historyCopy = whiteboardHistory.slice(0, historyIndex);
    const newHistory = [...historyCopy, finalAction];
    setWhiteboardHistory(newHistory);
    setHistoryIndex(newHistory.length);
    
    if (isLive && socketRef.current) {
      socketRef.current.emit('teacher:draw_end', { action: finalAction });
    }
    
    setTextInputPos(null);
    setTextInputValue('');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (isLive && socketRef.current) {
        socketRef.current.emit('teacher:sync_history', whiteboardHistory.slice(0, newIndex));
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < whiteboardHistory.length) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (isLive && socketRef.current) {
        socketRef.current.emit('teacher:sync_history', whiteboardHistory.slice(0, newIndex));
      }
    }
  };

  const handleClearBoard = () => {
    setWhiteboardHistory([]);
    setHistoryIndex(0);
    if (isLive && socketRef.current) {
      socketRef.current.emit('teacher:clear_canvas');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-4 w-full h-[calc(100vh-120px)] animate-fadeIn"
    >
      {/* Interactive Whiteboard Control Header */}
      <div className="border border-white/[0.08] bg-[#070b09]/90 p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            <HiOutlinePencil size={18} />
          </div>
          <div>
            <span className="text-sm font-black uppercase text-emerald-400 tracking-wider font-space">Interactive Whiteboard</span>
            {isLive ? (
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">PIN: {deckPin} | Class Session is Live</p>
            ) : (
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Offline mode | Local Sandbox</p>
            )}
          </div>
        </div>

        {/* Live Broadcast / Share controls */}
        <div className="flex items-center gap-3">
          {isLive ? (
            <>
              {/* Broadcast Status Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] bg-black/40 text-[10px] font-bold text-gray-400">
                {isSharingWhiteboard ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="text-emerald-400 uppercase tracking-wide">Sharing Live</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-gray-600" />
                    <span className="uppercase tracking-wide">Sharing Inactive</span>
                  </>
                )}
              </div>

              {/* Share Toggle Button */}
              <button
                onClick={handleToggleShare}
                className={`py-2 px-5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-2 shadow-md ${
                  isSharingWhiteboard
                    ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.25)] border border-rose-500/25'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.25)] border border-emerald-500/20'
                }`}
              >
                {isSharingWhiteboard ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.36 18.36a9 9 0 01-12.728 0M12 2v10m0 0l-3-3m3 3l3-3" /></svg>
                    <span>Stop Sharing</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742h.008v.008h-.008v-.008zM12 8.25a.75.75 0 100-1.5.75 0 000 1.5zm0 0v-3.75m0 3.75a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zm0 7.5v3.75M12 12h.008v.008H12V12z" /></svg>
                    <span>Share Whiteboard</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('flight-deck')}
              className="py-2 px-5 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
            >
              <HiOutlineStatusOnline size={14} />
              <span>Start Live Flight Deck</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Drawing Sandbox Workspace */}
      <div className="flex-1 w-full min-h-0 relative">
        <div className="border border-white/[0.08] bg-[#050907]/95 rounded-2xl w-full h-full relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col min-h-0">
          
          {/* Floating Toolbar Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/85 border border-white/[0.08] p-1.5 rounded-xl shadow-2xl backdrop-blur-md">
            {[
              { id: 'select', label: 'Selection', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 7.827 5.34-2.508 1.157-1.378 1.16-.39 4.21Z" /></svg> },
              { id: 'hand', label: 'Hand (Pan)', icon: <HiOutlineHand size={16} /> },
              { id: 'pencil', label: 'Pencil (Freehand)', icon: <HiOutlinePencil size={16} /> },
              { id: 'line', label: 'Line', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="19" x2="19" y2="5" /></svg> },
              { id: 'arrow', label: 'Arrow', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg> },
              { id: 'rect', label: 'Rectangle', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="1" /></svg> },
              { id: 'diamond', label: 'Diamond', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3L21 12L12 21L3 12Z" /></svg> },
              { id: 'circle', label: 'Circle', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="9" /></svg> },
              { id: 'text', label: 'Text', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 7V4H20V7M12 4V20M9 20H15" /></svg> },
              { id: 'eraser', label: 'Eraser', icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2C14 1 16 1 17 2L21 6C22 7 22 9 21 10L14 17L18 20" /></svg> }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setTool(t.id); setTextInputPos(null); }}
                title={t.label}
                className={`p-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  tool === t.id
                    ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)] font-extrabold scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.icon}
              </button>
            ))}
          </div>

          {/* Configuration Sidebar Panel Overlay */}
          {tool !== 'select' && tool !== 'eraser' && tool !== 'hand' && (
            <div className="absolute top-20 left-4 z-20 flex flex-col gap-4 bg-black/85 border border-white/[0.08] p-4 rounded-xl shadow-2xl backdrop-blur-md w-56 text-xs max-h-[75%] overflow-y-auto custom-sidebar-scroll animate-fadeIn">
              {/* Stroke Color */}
              <div className="space-y-2">
                <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px]">Stroke Color</span>
                <div className="flex flex-wrap gap-1.5">
                  {['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#ffffff', '#000000'].map(c => (
                    <button
                      key={c}
                      onClick={() => setBrushColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5.5 h-5.5 rounded border transition-all duration-150 cursor-pointer ${
                        brushColor === c ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Fill Color */}
              {tool !== 'pencil' && tool !== 'text' && (
                <div className="space-y-2">
                  <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px]">Background Fill</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['transparent', 'rgba(16,185,129,0.15)', 'rgba(59,130,246,0.15)', 'rgba(239,68,68,0.15)', 'rgba(245,158,11,0.15)', 'rgba(255,255,255,0.15)'].map(c => (
                      <button
                        key={c}
                        onClick={() => setFillColor(c)}
                        style={{ backgroundColor: c === 'transparent' ? 'transparent' : c }}
                        className={`w-5.5 h-5.5 rounded border transition-all duration-150 cursor-pointer flex items-center justify-center ${
                          fillColor === c ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'
                        } ${c === 'transparent' ? 'border-white/[0.2] bg-[linear-gradient(45deg,transparent_45%,#fff_45%,#fff_55%,transparent_55%)]' : ''}`}
                      >
                        {c === 'transparent' && <span className="text-[10px] text-gray-500 font-bold">✖</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stroke Width */}
              <div className="space-y-2">
                <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px]">Stroke Width</span>
                <div className="flex gap-2">
                  {[
                    { id: 2, label: 'Thin' },
                    { id: 4, label: 'Medium' },
                    { id: 8, label: 'Bold' }
                  ].map(w => (
                    <button
                      key={w.id}
                      onClick={() => setBrushWidth(w.id)}
                      className={`flex-1 py-1.5 rounded text-[10px] border font-black transition-all cursor-pointer ${
                        brushWidth === w.id
                          ? 'bg-emerald-500 text-black border-emerald-500'
                          : 'bg-transparent text-gray-400 border-white/[0.08] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold uppercase">
                  <span>Opacity</span>
                  <span className="text-emerald-400 font-mono font-black">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Text Configurations */}
              {tool === 'text' && (
                <div className="space-y-3 pt-2 border-t border-white/[0.08] animate-fadeIn">
                  <div className="space-y-1.5">
                    <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px]">Font Family</span>
                    <div className="flex gap-1.5">
                      {[
                        { id: 'sans-serif', label: 'Sans' },
                        { id: 'mono', label: 'Mono' },
                        { id: 'handdrawn', label: 'Hand' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setFontFamily(f.id)}
                          className={`flex-1 py-1 rounded text-[9px] border font-bold transition-all cursor-pointer ${
                            fontFamily === f.id
                              ? 'bg-emerald-500 text-black border-emerald-500 font-black'
                              : 'bg-transparent text-gray-400 border-white/[0.08] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px]">Font Size</span>
                    <div className="flex gap-1">
                      {[
                        { id: 2, label: 'S' },
                        { id: 4, label: 'M' },
                        { id: 6, label: 'L' },
                        { id: 9, label: 'XL' }
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => setFontSize(s.id)}
                          className={`w-7 h-7 rounded border font-black text-[10px] flex items-center justify-center transition-all cursor-pointer ${
                            fontSize === s.id
                              ? 'bg-emerald-500 text-black border-emerald-500'
                              : 'bg-transparent text-gray-400 border-white/[0.08] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-gray-400 font-bold uppercase tracking-wider block text-[9px]">Alignment</span>
                    <div className="flex gap-1.5">
                      {[
                        { id: 'left', label: 'Left', icon: '⫷' },
                        { id: 'center', label: 'Center', icon: '⫸' },
                        { id: 'right', label: 'Right', icon: '⫵' }
                      ].map(a => (
                        <button
                          key={a.id}
                          onClick={() => setTextAlign(a.id)}
                          className={`flex-1 py-1 rounded text-[9px] border font-bold transition-all cursor-pointer ${
                            textAlign === a.id
                              ? 'bg-emerald-500 text-black border-emerald-500 font-black'
                              : 'bg-transparent text-gray-400 border-white/[0.08] hover:text-white'
                          }`}
                          title={a.label}
                        >
                          {a.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Canvas */}
          <div className="flex-1 w-full h-full relative cursor-crosshair overflow-hidden select-none" data-tour="flight-deck-presentation">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
              className="absolute inset-0 block w-full h-full"
            />
            
            <div className="absolute bottom-4 left-4 pointer-events-none bg-black/50 border border-white/[0.06] backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] text-gray-400 font-semibold flex items-center gap-1.5 shadow-md">
              <HiOutlinePencil className="text-emerald-400" size={12} />
              <span>{tool === 'text' ? 'Click canvas to type text' : tool === 'select' ? 'Click and drag items to move' : tool === 'hand' ? 'Drag canvas to pan | Use scroll wheel to zoom' : `Drawing with ${tool}`}</span>
            </div>

            {textInputPos && (
              <div
                className="absolute z-30 flex items-center bg-black/80 p-2 rounded-xl border border-emerald-500/30 shadow-2xl"
                style={{ top: textInputPos.y - 15, left: textInputPos.x - 10 }}
              >
                <input
                  type="text"
                  value={textInputValue}
                  onChange={(e) => setTextInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTextCommit();
                    if (e.key === 'Escape') setTextInputPos(null);
                  }}
                  placeholder="Type and press Enter..."
                  className="bg-transparent text-white text-xs outline-none border-none px-1 py-0.5 w-44 font-sans focus:ring-0"
                  autoFocus
                  onBlur={handleTextCommit}
                />
                <button
                  onClick={handleTextCommit}
                  className="ml-1 px-2 py-0.5 bg-emerald-500 text-black font-bold text-[10px] rounded"
                >
                  OK
                </button>
              </div>
            )}

            {/* Bottom Right Floating Zoom and History Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/85 border border-white/[0.08] p-1.5 rounded-xl shadow-2xl backdrop-blur-md">
              <span className="text-[10px] text-emerald-400 font-mono font-black px-1.5 select-none">{Math.round(zoom * 100)}%</span>
              <div className="w-px h-5 bg-white/[0.08]" />
              <button
                onClick={() => handleZoomPanChange(1.0, { x: 0, y: 0 })}
                className="p-1.5 bg-black/40 border border-white/[0.06] rounded text-[9px] text-gray-300 hover:text-white transition-colors cursor-pointer font-bold"
                title="Reset Zoom & Pan"
              >
                Reset
              </button>
              <div className="w-px h-5 bg-white/[0.08]" />
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 bg-black/40 border border-white/[0.06] rounded-lg text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-colors cursor-pointer"
                title="Undo"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= whiteboardHistory.length}
                className="p-2 bg-black/40 border border-white/[0.06] rounded-lg text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-colors cursor-pointer"
                title="Redo"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" /></svg>
              </button>
              <div className="w-px h-5 bg-white/[0.08] mx-0.5" />
              <button
                onClick={handleClearBoard}
                className="p-2 bg-red-950/15 border border-red-500/20 hover:border-red-500/40 hover:bg-red-950/35 text-red-400 rounded-lg transition-all duration-200 cursor-pointer"
                title="Clear whiteboard"
              >
                <HiOutlineTrash size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
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
      id: Date.now() + Math.random(),
      file: file
    }))
    setUploadedPages(prev => [...prev, ...newPages])
  }

  const clearUploadedPages = () => {
    setUploadedPages([])
    setDigitizedResult(null)
  }

  const runDigitization = async () => {
    if (uploadedPages.length === 0) return
    setIsDigitizing(true)
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      const token = info.token

      const formData = new FormData()
      formData.append('file', uploadedPages[0].file)

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/grader/digitize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Digitization failed')
      }

      const data = await res.json()
      setDigitizedResult(data)
      showToast('Document digitized successfully!', 'success')
      if (onAssetCreated) onAssetCreated()
    } catch (error) {
      console.error(error)
      showToast(error.message || 'Failed to digitize document', 'error')
    } finally {
      setIsDigitizing(false)
    }
  }

  const runCameraScan = async () => {
    if (isScanning) return
    setIsScanning(true)
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      const token = info.token

      const canvas = document.createElement('canvas')
      canvas.width = 10
      canvas.height = 10
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'rgba(0,0,0,0)'
      ctx.fillRect(0, 0, 10, 10)
      
      const fileBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'))
      const dummyFile = new File([fileBlob], 'scan.jpg', { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append('file', dummyFile)
      formData.append('studentId', selectedStudentId)
      formData.append('title', 'AI Handwritten Homework Grading')
      formData.append('rubric', 'Verify completeness, factual accuracy, clear explanations, and structure.')

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/grader/grade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'AI Grading failed')
      }

      const data = await res.json()

      const studentObj = students.find(s => s.id === selectedStudentId)
      setDigitizedResult({
        type: 'grade',
        score: data.evaluation.score,
        studentName: studentObj ? studentObj.name : 'Unknown Student',
        feedback: data.evaluation.feedback,
        title: 'AI Graded Homework',
        subtitle: `Processed via techUs OCR engine`,
        sections: [
          {
            title: 'Rubric Analysis',
            questions: [data.evaluation.rubricAnalysis]
          },
          {
            title: 'Extracted OCR Text',
            questions: [data.evaluation.extractedText]
          }
        ]
      })

      setStudents(prev => prev.map(s => {
        if (s.id === selectedStudentId) {
          return {
            ...s,
            grade: `${data.evaluation.score}/100`,
            assignmentStatus: 'Completed',
            aiFeedback: data.evaluation.feedback
          }
        }
        return s
      }))

      showToast('Homework graded successfully by AI!', 'success')
      if (onAssetCreated) onAssetCreated()
    } catch (error) {
      console.error(error)
      showToast(error.message || 'Failed to grade homework', 'error')
    } finally {
      setIsScanning(false)
    }
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
                  techUs Digitizer Module V2.0 (OCR Live)
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
export function MathHelper({ pushWorksheetToClass, onProblemSolved, showToast }) {
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

  const handleSolve = async () => {
    if (!problem.trim()) return
    setIsSolving(true)
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      const token = info.token

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/grader/solve-math`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problem,
          topic: selectedTopic
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Math Solver failed')
      }

      const data = await res.json()
      setSolutionSteps(data.solutionSteps || [])
      showToast('Problem solved successfully!', 'success')
      if (onProblemSolved) onProblemSolved()
    } catch (error) {
      console.error(error)
      showToast(error.message || 'Failed to solve problem', 'error')
    } finally {
      setIsSolving(false)
    }
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

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      const token = info.token

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/lessons/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          grade,
          subject,
          topic,
          duration,
          objectives: learningObjectives
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Lesson Plan generation failed')
      }

      const data = await res.json()
      setLessonPlan(data)
      showToast('Lesson plan generated successfully!', 'success')
      if (onPlanGenerated) onPlanGenerated()
    } catch (error) {
      console.error(error)
      showToast(error.message || 'Failed to generate lesson plan', 'error')
    } finally {
      setIsGenerating(false)
    }
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

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      const token = info.token

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/grader/visual-aid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt,
          type: aidType
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Visual Aid generation failed')
      }

      const data = await res.json()
      setVisualAid(data)
      showToast('Visual Aid generated successfully!', 'success')
      if (onAidGenerated) onAidGenerated()
    } catch (error) {
      console.error(error)
      showToast(error.message || 'Failed to generate visual aid', 'error')
    } finally {
      setIsGenerating(false)
    }
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

export function ProfileView({ 
  userEmail, 
  userName, 
  showToast, 
  totalTopics = 0, 
  assetsCreated = 0, 
  totalStudents = 12, 
  weeklyActivity = 0, 
  onEditRedirect, 
  setActiveTab,
  subjectsTaught = '',
  experience = '',
  qualification = '',
  aboutMe = 'Dedicated and passionate educator with a focus on creating engaging and effective learning environments. Experienced in teaching various subjects. Committed to leveraging AI technology to enhance teaching efficiency and student outcomes.',
  memberSince = '',
}) {
  const profileImage = localStorage.getItem('profile_image') || null
  const coverImage = localStorage.getItem('profile_cover') || null
  const profileName = localStorage.getItem('profile_name') || userName || userEmail
  
  const schoolName = localStorage.getItem('profile_schoolName') || ''
  
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

export function EditProfileForm({ 
  userEmail, 
  userName, 
  setUserName, 
  showToast,
  subjectsTaught: parentSubjectsTaught,
  setSubjectsTaught: setParentSubjectsTaught,
  experience: parentExperience,
  setExperience: setParentExperience,
  qualification: parentQualification,
  setQualification: setParentQualification,
  aboutMe: parentAboutMe,
  setAboutMe: setParentAboutMe,
  memberSince: parentMemberSince,
  setMemberSince: setParentMemberSince,
  userPicture,
  setUserPicture
}) {
  const [profileImage, setProfileImage] = useState(() => localStorage.getItem('profile_image') || userPicture || null)
  const [coverImage, setCoverImage] = useState(() => localStorage.getItem('profile_cover') || null)
  const profileInputRef = useRef(null)
  const coverInputRef = useRef(null)
  
  const [fullName, setFullName] = useState(() => localStorage.getItem('profile_name') || userName || '')
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('profile_schoolName') || '')
  const [subjectsTaught, setSubjectsTaught] = useState(parentSubjectsTaught)
  const [experience, setExperience] = useState(parentExperience)
  const [qualification, setQualification] = useState(parentQualification)
  const [memberSince, setMemberSince] = useState(parentMemberSince || (() => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  })())
  const [aboutMe, setAboutMe] = useState(parentAboutMe || 'Dedicated and passionate educator with a focus on creating engaging and effective learning environments. Experienced in teaching various subjects. Committed to leveraging AI technology to enhance teaching efficiency and student outcomes.')

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

  const handleSaveProfile = async () => {
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      if (!info.token) return

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${info.token}`
        },
        body: JSON.stringify({
          name: fullName,
          picture: profileImage,
          subjectsTaught,
          experience,
          qualification,
          aboutMe
        })
      })

      if (res.ok) {
        localStorage.setItem('profile_name', fullName)
        localStorage.setItem('profile_schoolName', schoolName)
        localStorage.setItem('profile_subjectsTaught', subjectsTaught)
        localStorage.setItem('profile_experience', experience)
        localStorage.setItem('profile_qualification', qualification)
        localStorage.setItem('profile_memberSince', memberSince)
        localStorage.setItem('profile_aboutMe', aboutMe)
        
        if (setUserName) setUserName(fullName)
        if (setParentSubjectsTaught) setParentSubjectsTaught(subjectsTaught)
        if (setParentExperience) setParentExperience(experience)
        if (setParentQualification) setParentQualification(qualification)
        if (setParentAboutMe) setParentAboutMe(aboutMe)
        if (setParentMemberSince) setParentMemberSince(memberSince)
        if (setUserPicture && profileImage) setUserPicture(profileImage)

        showToast('Profile updated successfully!', 'success')
      } else {
        showToast('Failed to update profile.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Failed to update profile due to connection error.', 'error')
    }
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
  assetsCreated,
  subjectsTaught,
  setSubjectsTaught,
  experience,
  setExperience,
  qualification,
  setQualification,
  aboutMe,
  setAboutMe,
  memberSince,
  setMemberSince,
  userPicture,
  setUserPicture,
  onRestartTour
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
            subjectsTaught={subjectsTaught}
            setSubjectsTaught={setSubjectsTaught}
            experience={experience}
            setExperience={setExperience}
            qualification={qualification}
            setQualification={setQualification}
            aboutMe={aboutMe}
            setAboutMe={setAboutMe}
            memberSince={memberSince}
            setMemberSince={setMemberSince}
            userPicture={userPicture}
            setUserPicture={setUserPicture}
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
                    if (onRestartTour) onRestartTour()
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

export function BranchingCourseCreator({ showToast, onCourseCreated }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [chapters, setChapters] = useState([
    {
      chapterTitle: 'Chapter 1: Foundations',
      mainVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      quizQuestion: 'Supervised learning works with what kind of data?',
      quizOptions: ['Labeled Data', 'Unlabeled Data', 'Simulated Environment Data', 'Feedback Reward Data'],
      quizCorrectIndex: 0,
      advancedVideoUrl: 'https://www.w3schools.com/html/movie.mp4',
      remedialVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    }
  ]);

  const handleAddChapter = () => {
    setChapters([...chapters, {
      chapterTitle: `Chapter ${chapters.length + 1}: Topic Name`,
      mainVideoUrl: '',
      quizQuestion: '',
      quizOptions: ['', '', '', ''],
      quizCorrectIndex: 0,
      advancedVideoUrl: '',
      remedialVideoUrl: '',
    }]);
  };

  const handleChapterChange = (index, field, value) => {
    const updated = [...chapters];
    updated[index][field] = value;
    setChapters(updated);
  };

  const handleOptionChange = (chIdx, optIdx, val) => {
    const updated = [...chapters];
    updated[chIdx].quizOptions[optIdx] = val;
    setChapters(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      showToast('Course Title is required', 'error');
      return;
    }

    try {
      const savedInfo = localStorage.getItem('userInfo');
      if (!savedInfo) return;
      const info = JSON.parse(savedInfo);
      if (!info.token) return;

      const res = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${info.token}`
        },
        body: JSON.stringify({ title, description, chapters })
      });

      if (res.ok) {
        showToast('Adaptive Branching Course Published Successfully!', 'success');
        setTitle('');
        setDescription('');
        setChapters([
          {
            chapterTitle: 'Chapter 1: Foundations',
            mainVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            quizQuestion: 'Supervised learning works with what kind of data?',
            quizOptions: ['Labeled Data', 'Unlabeled Data', 'Simulated Environment Data', 'Feedback Reward Data'],
            quizCorrectIndex: 0,
            advancedVideoUrl: 'https://www.w3schools.com/html/movie.mp4',
            remedialVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          }
        ]);
        if (onCourseCreated) onCourseCreated();
      } else {
        const err = await res.json();
        showToast(err.message || 'Failed to publish course', 'error');
      }
    } catch (err) {
      showToast('Error publishing branching course', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-[#070b09]/50 border border-white/[0.08] rounded-3xl space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white font-space">Branching Course Creator (Teacher Panel)</h2>
          <p className="text-xs text-gray-400 mt-1">Design an adaptive syllabus with seamless branching based on student micro-quizzes.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-md text-[10px] font-bold uppercase font-space">
          Adaptive Engine
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-gray-400">Course Syllabus Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Applied Neural Networks"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-gray-400">Brief Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Multi-path curriculum using micro-quizzes"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-t border-white/[0.08] pt-4">
            <h3 className="text-sm font-extrabold text-white font-space">Course Chapters ({chapters.length})</h3>
            <button
              type="button"
              onClick={handleAddChapter}
              className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/35 hover:bg-emerald-500/25 text-emerald-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              + Add Chapter Node
            </button>
          </div>

          {chapters.map((ch, chIdx) => (
            <div key={chIdx} className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-2xl space-y-4 relative">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={ch.chapterTitle}
                  onChange={(e) => handleChapterChange(chIdx, 'chapterTitle', e.target.value)}
                  className="bg-transparent border-b border-white/10 font-bold text-white text-xs focus:outline-none focus:border-emerald-500 w-1/2 py-0.5"
                />
                <span className="text-[10px] text-gray-500 font-space">Node #{chIdx + 1}</span>
              </div>

              {/* Videos Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-500">Main Video Link (Standard Path)</label>
                  <input
                    type="text"
                    value={ch.mainVideoUrl}
                    onChange={(e) => handleChapterChange(chIdx, 'mainVideoUrl', e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 text-emerald-400">Advanced Video Link (Correct Path)</label>
                  <input
                    type="text"
                    value={ch.advancedVideoUrl}
                    onChange={(e) => handleChapterChange(chIdx, 'advancedVideoUrl', e.target.value)}
                    placeholder="https://example.com/advanced.mp4"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-500 text-orange-400">Remedial Video Link (Incorrect Path)</label>
                  <input
                    type="text"
                    value={ch.remedialVideoUrl}
                    onChange={(e) => handleChapterChange(chIdx, 'remedialVideoUrl', e.target.value)}
                    placeholder="https://example.com/remedial.mp4"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Quiz Settings */}
              <div className="border-t border-white/[0.04] pt-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-gray-500">Micro-Quiz Question Popup</label>
                  <input
                    type="text"
                    value={ch.quizQuestion}
                    onChange={(e) => handleChapterChange(chIdx, 'quizQuestion', e.target.value)}
                    placeholder="Ask a quick verification question..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Options and correct index selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ch.quizOptions.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${chIdx}`}
                        checked={ch.quizCorrectIndex === optIdx}
                        onChange={() => handleChapterChange(chIdx, 'quizCorrectIndex', optIdx)}
                        className="accent-emerald-500 shrink-0"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(chIdx, optIdx, e.target.value)}
                        placeholder={`Option ${optIdx + 1}`}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-400 text-black text-xs font-black uppercase tracking-wider rounded-2xl hover:scale-[1.01] transition-transform cursor-pointer"
        >
          Publish Adaptive Branching Course
        </button>
      </form>
    </motion.div>
  );
}




