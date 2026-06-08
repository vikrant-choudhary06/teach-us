import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineStatusOnline,
  HiOutlineLogout,
  HiOutlineLightningBolt,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineChevronRight,
  HiOutlineRefresh,
  HiOutlineChat,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineMenuAlt2
} from 'react-icons/hi'

import ActiveTeacherCourses from '../components/ActiveTeacherCourses'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const defaultCourses = [
  {
    _id: 'default-ai-101',
    title: 'Introduction to Artificial Intelligence',
    description: 'Learn the fundamentals of ML, Deep Learning, and Adaptive Networks.',
    chapters: [
      {
        chapterTitle: 'Chapter 1: Machine Learning Foundations',
        mainVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        quizQuestion: 'Which technique is primarily used in supervised learning to predict continuous outputs?',
        quizOptions: [
          'Linear Regression & Gradient Descent',
          'K-Means Clustering',
          'Q-Learning Reinforcement loop',
          'Principal Component Analysis (PCA)'
        ],
        quizCorrectIndex: 0,
        advancedVideoUrl: 'https://www.w3schools.com/html/movie.mp4', // Simulates Advanced deep neural nets
        remedialVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' // Simulates Foundations
      }
    ]
  },
  {
    _id: 'default-quantum-201',
    title: 'Quantum Computing Fundamentals',
    description: 'Master qubits, superposition, quantum circuits, and teleportation logic.',
    chapters: [
      {
        chapterTitle: 'Chapter 1: Qubits & Superposition',
        mainVideoUrl: 'https://www.w3schools.com/html/movie.mp4',
        quizQuestion: 'What mathematical state defines a qubit in pure superposition?',
        quizOptions: [
          'Only state |0⟩',
          'Only state |1⟩',
          'A linear combination: α|0⟩ + β|1⟩',
          'A classical logic bit vector'
        ],
        quizCorrectIndex: 2,
        advancedVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        remedialVideoUrl: 'https://www.w3schools.com/html/movie.mp4'
      }
    ]
  }
]

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Auth / Student profile states
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('Student')
  const [userPicture, setUserPicture] = useState('')
  const [userId, setUserId] = useState('')
  const [userUid, setUserUid] = useState('')
  const [credits, setCredits] = useState(30)
  const [courses, setCourses] = useState(defaultCourses)

  // Branching narrative player states
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0)
  const [videoPlayState, setVideoPlayState] = useState('main') // 'main' | 'advanced' | 'remedial'
  const [videoUrl, setVideoUrl] = useState('')
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [quizTimer, setQuizTimer] = useState(60)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false)
  const [quizCorrect, setQuizCorrect] = useState(null)
  const [videoFinished, setVideoFinished] = useState(false)
  const [branchingPath, setBranchingPath] = useState('Standard Route') // for Skill Tree highlight
  const videoRef = useRef(null)

  // Multi-Player Co-op matchmaking & gaming states
  const [coopStatus, setCoopStatus] = useState('idle') // 'idle' | 'searching' | 'matched' | 'victory'
  const [partnerInfo, setPartnerInfo] = useState(null)
  const [roomId, setRoomId] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isPartnerReady, setIsPartnerReady] = useState(false)
  const [creditsAwarded, setCreditsAwarded] = useState(false)

  // Social & Invite System states
  const [friends, setFriends] = useState([])
  const [pendingIncoming, setPendingIncoming] = useState([])
  const [pendingOutgoing, setPendingOutgoing] = useState([])
  const [addFriendInput, setAddFriendInput] = useState('')
  const [activeSocialTab, setActiveSocialTab] = useState('friends')
  const [onlineStatuses, setOnlineStatuses] = useState({})
  const [activeInvite, setActiveInvite] = useState(null)
  const [inviteTimer, setInviteTimer] = useState(15)

  // Live Class / Flight Deck Sync state
  const [liveMaterial, setLiveMaterial] = useState(null)
  const [activeMode, setActiveMode] = useState('presentation')
  const [isJoined, setIsJoined] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [pdfName, setPdfName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Redesigned Flight Deck Sync states
  const [deckPin, setDeckPin] = useState('')
  const [deckWhiteboardHistory, setDeckWhiteboardHistory] = useState([])
  const [deckChatMessages, setDeckChatMessages] = useState([])
  const [deckChatInput, setDeckChatInput] = useState('')
  const [deckDoubtInput, setDeckDoubtInput] = useState('')
  const [deckIsSharingWhiteboard, setDeckIsSharingWhiteboard] = useState(false)
  const [deckZoom, setDeckZoom] = useState(1.0)
  const [deckPanOffset, setDeckPanOffset] = useState({ x: 0, y: 0 })

  // Synced drawing board states
  const canvasRef = useRef(null)
  const liveCanvasRef = useRef(null)
  const tempStrokeRef = useRef(null)
  const deckChatEndRef = useRef(null)

  const [isDrawing, setIsDrawing] = useState(false)
  const [brushColor, setBrushColor] = useState('#10b981')
  const [brushSize, setBrushSize] = useState(4)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)

  const drawLiveActionScaled = (ctx, action, targetWidth, targetHeight) => {
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

  const redrawLiveCanvas = () => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(deckPanOffset.x, deckPanOffset.y);
    ctx.scale(deckZoom, deckZoom);

    // Draw grid background
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
    ctx.lineWidth = 1 / deckZoom;
    const gridStep = 25;
    const halfW = 2000;
    const halfH = 2000;
    for (let x = -halfW; x < canvas.width + halfW; x += gridStep) {
      ctx.beginPath(); ctx.moveTo(x, -halfH); ctx.lineTo(x, canvas.height + halfH); ctx.stroke();
    }
    for (let y = -halfH; y < canvas.height + halfH; y += gridStep) {
      ctx.beginPath(); ctx.moveTo(-halfW, y); ctx.lineTo(canvas.width + halfW, y); ctx.stroke();
    }

    // Draw history
    deckWhiteboardHistory.forEach(action => {
      drawLiveActionScaled(ctx, action, canvas.width, canvas.height);
    });
    ctx.restore();
  };

  useEffect(() => {
    if (isJoined && liveCanvasRef.current) {
      redrawLiveCanvas();
    }
  }, [deckWhiteboardHistory, isJoined, activeTab, deckZoom, deckPanOffset, deckIsSharingWhiteboard]);

  useEffect(() => {
    if (deckChatEndRef.current) {
      deckChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [deckChatMessages]);

  useEffect(() => {
    if (deckIsSharingWhiteboard && liveCanvasRef.current) {
      const canvas = liveCanvasRef.current;
      const container = canvas.parentElement;
      if (container) {
        const timer = setTimeout(() => {
          canvas.width = container.clientWidth || 800;
          canvas.height = Math.max(container.clientHeight, 500);
          redrawLiveCanvas();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [deckIsSharingWhiteboard]);


  const socketRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (activeMode === 'whiteboard' && liveCanvasRef.current) {
      const canvas = liveCanvasRef.current
      const container = canvas.parentElement
      canvas.width = container.clientWidth
      canvas.height = Math.max(container.clientHeight, 400)
      
      const ctx = canvas.getContext('2d')
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Draw grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.03)'
      ctx.lineWidth = 1
      const step = 20
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
    }
  }, [activeMode, activeTab])

  // Load User Data & Courses
  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    const savedInfo = localStorage.getItem('userInfo')
    if (email) setUserEmail(email)

    let token = ''
    if (savedInfo) {
      try {
        const info = JSON.parse(savedInfo)
        if (info.role === 'Teacher') {
          navigate('/professor-dashboard')
          return
        }
        setUserName(info.name || 'Student')
        setUserId(info._id || '')
        setUserUid(info.uid || '')
        if (info.picture) setUserPicture(info.picture)
        if (info.credits !== undefined) setCredits(info.credits)
        token = info.token
      } catch (e) {
        console.error(e)
      }
    } else {
      navigate('/login')
      return
    }

    // Fetch user profile from DB to verify sync
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (data.credits !== undefined) setCredits(data.credits)
          if (data.uid) {
            setUserUid(data.uid)
            // Save to userInfo local store
            const currentInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
            localStorage.setItem('userInfo', JSON.stringify({ ...currentInfo, uid: data.uid }))
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchProfile()

    // Fetch friends list on dashboard load
    fetchFriendsList(token)

    // Fetch Branching Courses from Database
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const dbCourses = await res.json()
          if (Array.isArray(dbCourses) && dbCourses.length > 0) {
            setCourses([...defaultCourses, ...dbCourses])
          }
        }
      } catch (e) {
        console.error('Failed to load DB branching courses, using seeded defaults.', e)
      }
    }
    fetchCourses()
  }, [])

  // Socket connection configuration
  useEffect(() => {
    socketRef.current = io(API_URL)

    socketRef.current.on('connect', () => {
      console.log('Socket client connected:', socketRef.current.id)
      if (userId) {
        socketRef.current.emit('social:join_lobby', { userId, userName })
      }
    })

    socketRef.current.on('social:user_online', ({ userId: onlineId }) => {
      setOnlineStatuses((prev) => ({ ...prev, [onlineId]: true }))
    })

    socketRef.current.on('social:user_offline', ({ userId: offlineId }) => {
      setOnlineStatuses((prev) => ({ ...prev, [offlineId]: false }))
    })

    socketRef.current.on('coop:invite_received', ({ requesterName, requesterId, roomId, courseId }) => {
      setActiveInvite({ requesterName, requesterId, roomId, courseId })
      setInviteTimer(15)
    })

    socketRef.current.on('coop:matched', ({ roomId, partnerName, partnerId }) => {
      setRoomId(roomId)
      setPartnerInfo({ name: partnerName, id: partnerId })
      setCoopStatus('matched')
      setChatMessages([
        {
          sender: 'System',
          role: 'System',
          text: `Study session established with ${partnerName}! Connect and solve the whiteboard task.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ])
    })

    socketRef.current.on('coop:chat_message', (msgObj) => {
      setChatMessages((prev) => [...prev, msgObj])
    })

    socketRef.current.on('coop:draw', ({ x1, y1, x2, y2, color, size }) => {
      drawOnCanvas(x1, y1, x2, y2, color, size)
    })

    socketRef.current.on('coop:clear_canvas', () => {
      clearLocalCanvas()
    })

    socketRef.current.on('coop:partner_disconnected', () => {
      setCoopStatus('idle')
      setPartnerInfo(null)
      setRoomId('')
      alert('Your study partner disconnected. Returning to lobby.')
    })

    socketRef.current.on('coop:complete_mission', () => {
      triggerVictory()
    })

    socketRef.current.on('student:join_success', ({ deckUid }) => {
      alert(`Successfully joined Professor's Deck: ${deckUid}`)
      setIsJoined(true)
      setDeckPin(deckUid)
      setDeckWhiteboardHistory([])
      setDeckChatMessages([])
    })

    socketRef.current.on('student:join_error', ({ message }) => {
      alert(`Join failed: ${message}`)
    })

    socketRef.current.on('student:sync_state', ({ whiteboardHistory, chatMessages, doubts, isSharingWhiteboard, zoom, panOffset }) => {
      setDeckWhiteboardHistory(whiteboardHistory || [])
      setDeckChatMessages(chatMessages || [])
      setDeckIsSharingWhiteboard(isSharingWhiteboard || false)
      setDeckZoom(zoom || 1.0)
      setDeckPanOffset(panOffset || { x: 0, y: 0 })
    })

    socketRef.current.on('student:toggle_share_whiteboard', ({ isSharing }) => {
      setDeckIsSharingWhiteboard(isSharing)
    })

    socketRef.current.on('student:sync_zoom_pan', ({ zoom, panOffset }) => {
      setDeckZoom(zoom)
      setDeckPanOffset(panOffset)
    })

    socketRef.current.on('student:draw_start', ({ x, y, color, size, tool, width, height }) => {
      tempStrokeRef.current = {
        type: tool,
        points: [{ x, y }],
        color,
        size,
        canvasWidth: width,
        canvasHeight: height
      };
      redrawLiveCanvas();
    });

    socketRef.current.on('student:draw_move', ({ x, y, tool }) => {
      if (!tempStrokeRef.current) return;
      tempStrokeRef.current.points.push({ x, y });
      
      const canvas = liveCanvasRef.current;
      if (!canvas) return;
      redrawLiveCanvas();
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.translate(deckPanOffset.x, deckPanOffset.y);
      ctx.scale(deckZoom, deckZoom);
      drawLiveActionScaled(ctx, tempStrokeRef.current, canvas.width, canvas.height);
      ctx.restore();
    });

    socketRef.current.on('student:draw_end', (data) => {
      tempStrokeRef.current = null;
      if (data && data.action) {
        setDeckWhiteboardHistory(prev => [...prev, data.action]);
      }
    });

    socketRef.current.on('student:clear_canvas', () => {
      tempStrokeRef.current = null;
      setDeckWhiteboardHistory([]);
    });

    socketRef.current.on('student:sync_history', (history) => {
      tempStrokeRef.current = null;
      setDeckWhiteboardHistory(history || []);
    });

    socketRef.current.on('deck:chat_message', (msg) => {
      setDeckChatMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('student:deck_closed', () => {
      alert('The Professor has ended the live class session.');
      setIsJoined(false);
      setDeckPin('');
      setDeckWhiteboardHistory([]);
      setDeckChatMessages([]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [userId])

  // Triggers lobby socket join when userId loads asynchronously
  useEffect(() => {
    if (userId && socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('social:join_lobby', { userId, userName })
      fetchFriendsList()
    }
  }, [userId])

  // Direct Session invitation timeout loop
  useEffect(() => {
    let interval = null
    if (activeInvite && inviteTimer > 0) {
      interval = setInterval(() => {
        setInviteTimer((prev) => prev - 1)
      }, 1000)
    } else if (inviteTimer === 0 && activeInvite) {
      setActiveInvite(null)
    }
    return () => clearInterval(interval)
  }, [activeInvite, inviteTimer])

  // Video URL sync when course or playState changes
  useEffect(() => {
    if (selectedCourse) {
      const chapter = selectedCourse.chapters[currentChapterIdx]
      if (chapter) {
        if (videoPlayState === 'main') {
          setVideoUrl(chapter.mainVideoUrl)
        } else if (videoPlayState === 'advanced') {
          setVideoUrl(chapter.advancedVideoUrl)
        } else if (videoPlayState === 'remedial') {
          setVideoUrl(chapter.remedialVideoUrl)
        }
      }
    }
  }, [selectedCourse, currentChapterIdx, videoPlayState])

  // Micro-Quiz Countdown Timer Loop
  useEffect(() => {
    let interval = null
    if (isQuizOpen && quizTimer > 0) {
      interval = setInterval(() => {
        setQuizTimer((prev) => prev - 1)
      }, 1000)
    } else if (quizTimer === 0 && isQuizOpen) {
      handleQuizSubmit(true) // Auto-submit incorrect on timeout
    }
    return () => clearInterval(interval)
  }, [isQuizOpen, quizTimer])

  // Fetch accepted friends & requests lists
  const fetchFriendsList = async (customToken = null) => {
    try {
      let token = customToken
      if (!token) {
        const savedInfo = localStorage.getItem('userInfo')
        if (!savedInfo) return
        token = JSON.parse(savedInfo).token
      }
      if (!token) return

      const res = await fetch(`${API_URL}/api/auth/social/friends`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setFriends(data.friends || [])
        setPendingIncoming(data.pendingIncoming || [])
        setPendingOutgoing(data.pendingOutgoing || [])

        // Query status for friends
        const friendIds = (data.friends || []).map((f) => f._id)
        if (friendIds.length > 0 && socketRef.current) {
          socketRef.current.emit('social:check_online', { friendIds }, (statuses) => {
            setOnlineStatuses(statuses || {})
          })
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Send request by tag UID
  const handleSendFriendRequest = async (e) => {
    e.preventDefault()
    if (!addFriendInput.trim()) return
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const token = JSON.parse(savedInfo).token

      const res = await fetch(`${API_URL}/api/auth/social/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ uid: addFriendInput.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        alert(data.message || 'Friend request sent!')
        setAddFriendInput('')
        fetchFriendsList()
      } else {
        alert(data.message || 'Failed to send request.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Respond Friendship
  const handleRespondFriendRequest = async (friendshipId, status) => {
    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const token = JSON.parse(savedInfo).token

      const res = await fetch(`${API_URL}/api/auth/social/friends/request/${friendshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        fetchFriendsList()
      } else {
        const data = await res.json()
        alert(data.message || 'Error responding to request')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Send Direct Invitation to Friend
  const handleInviteFriend = (friendId) => {
    if (socketRef.current) {
      socketRef.current.emit('coop:invite_friend', { friendId, courseId: 'all-coop-course' })
      alert('Invite sent! Waiting for friend response.')
    }
  }

  // Accept Direct Invite
  const handleAcceptInvite = () => {
    if (activeInvite && socketRef.current) {
      socketRef.current.emit('coop:accept_invite', {
        roomId: activeInvite.roomId,
        requesterId: activeInvite.requesterId
      })
      setRoomId(activeInvite.roomId)
      setPartnerInfo({ name: activeInvite.requesterName, id: activeInvite.requesterId })
      setCoopStatus('matched')
      setChatMessages([
        {
          sender: 'System',
          role: 'System',
          text: `Joined session started by ${activeInvite.requesterName}!`,
          timestamp: new Date().toLocaleTimeString()
        }
      ])
      setActiveInvite(null)
    }
  }

  const handleDeclineInvite = () => {
    setActiveInvite(null)
  }

  // Canvas drawing functionality
  const drawOnCanvas = (x1, y1, x2, y2, color, size) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = color
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    setIsDrawing(true)
    setLastX(e.clientX - rect.left)
    setLastY(e.clientY - rect.top)
  }

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    drawOnCanvas(lastX, lastY, x, y, brushColor, brushSize)

    // Broadcast stroke to partner
    if (socketRef.current && roomId) {
      socketRef.current.emit('coop:draw', {
        x1: lastX,
        y1: lastY,
        x2: x,
        y2: y,
        color: brushColor,
        size: brushSize
      })
    }

    setLastX(x)
    setLastY(y)
  }

  const handleCanvasMouseUp = () => {
    setIsDrawing(false)
  }

  const clearLocalCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const handleClearCanvas = () => {
    clearLocalCanvas()
    if (socketRef.current && roomId) {
      socketRef.current.emit('coop:clear_canvas')
    }
  }

  // Branching Video Playback End Trigger
  const handleVideoEnded = () => {
    if (videoPlayState === 'main') {
      setIsQuizOpen(true)
      setQuizTimer(60)
      setSelectedAnswer(null)
      setIsQuizSubmitted(false)
    } else {
      setVideoFinished(true)
    }
  }

  // Micro-Quiz Submission & Narrative Branching Logic
  const handleQuizSubmit = (isTimeout = false) => {
    if (isQuizSubmitted) return
    setIsQuizSubmitted(true)
    const chapter = selectedCourse.chapters[currentChapterIdx]

    const isCorrect = !isTimeout && selectedAnswer === chapter.quizCorrectIndex
    setQuizCorrect(isCorrect)

    setTimeout(() => {
      setIsQuizOpen(false)
      if (isCorrect) {
        setVideoPlayState('advanced')
        setBranchingPath('Advanced Route')
      } else {
        setVideoPlayState('remedial')
        setBranchingPath('Deep-Dive Route')
      }
    }, 2000)
  }

  // Real-Time Matchmaking queue handler
  const handleFindPartner = () => {
    setCoopStatus('searching')
    if (socketRef.current) {
      socketRef.current.emit('coop:join_queue', {
        userId,
        userName,
        courseId: 'all-coop-course'
      })
    }
  }

  const handleCancelSearch = () => {
    setCoopStatus('idle')
    if (socketRef.current) {
      socketRef.current.emit('coop:leave_queue', { userId })
    }
  }

  // Chat message send
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!chatInput.trim() || !roomId) return

    const msgObj = {
      sender: userName,
      role: 'Student',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString()
    }

    setChatMessages((prev) => [...prev, msgObj])
    if (socketRef.current) {
      socketRef.current.emit('coop:chat_message', msgObj)
    }
    setChatInput('')
  }

  // Gaming Victory & Sync Credits Update
  const handleCompleteMission = () => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('coop:complete_mission')
    } else {
      triggerVictory()
    }
  }

  const triggerVictory = async () => {
    setCoopStatus('victory')
    if (creditsAwarded) return
    setCreditsAwarded(true)

    // Award +5 daily credits in database profile
    const newCredits = credits + 5
    setCredits(newCredits)

    try {
      const savedInfo = localStorage.getItem('userInfo')
      if (!savedInfo) return
      const info = JSON.parse(savedInfo)
      if (!info.token) return

      await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${info.token}`
        },
        body: JSON.stringify({ credits: newCredits })
      })

      // Also update local storage values
      localStorage.setItem(`acharyai_${userEmail}_credits`, newCredits.toString())
      localStorage.setItem('userInfo', JSON.stringify({ ...info, credits: newCredits }))
    } catch (e) {
      console.error('Failed to award coop credits', e)
    }
  }

  const handleCloseVictory = () => {
    setCoopStatus('idle')
    setPartnerInfo(null)
    setRoomId('')
    setChatMessages([])
    setCreditsAwarded(false)
    fetchFriendsList()
  }

  const handleLogout = () => {
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userInfo')
    navigate('/login')
  }

  return (
    <div className="h-screen bg-[#020504] text-[#f1f5f9] flex font-sans overflow-hidden relative premium-glow-global">
      {/* ── BACKGROUND ORBITS ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-300px] left-[-300px] w-[900px] h-[900px] rounded-full bg-emerald-500/[0.04] blur-[160px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[800px] h-[800px] rounded-full bg-green-500/[0.03] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* ── FLOATING SIDEBAR (DESKTOP) ── */}
      <aside
        className={`hidden md:flex flex-col h-[calc(100vh-2rem)] my-4 ml-4 shrink-0 border border-white/[0.1] bg-[#070b09]/60 backdrop-blur-2xl rounded-2xl py-6 relative z-10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20 px-3' : 'w-66 lg:w-72 px-5'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6 shrink-0 px-2 justify-between">
          {!isSidebarCollapsed && (
            <span className="text-lg font-extrabold tracking-tight text-white font-space flex items-center gap-1.5">
              Acharya <span className="text-emerald-400 font-bold">AI</span>
            </span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/40 flex items-center justify-center text-emerald-400 transition-all cursor-pointer"
          >
            <HiOutlineBookOpen size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center rounded-xl text-left text-sm font-bold tracking-wide font-space transition-all duration-300 py-3 px-3.5 ${
              activeTab === 'overview'
                ? 'text-white bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.1)]'
                : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HiOutlineHome size={18} className="mr-2 text-emerald-400" />
            {!isSidebarCollapsed && <span>Control Center</span>}
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center rounded-xl text-left text-sm font-bold tracking-wide font-space transition-all duration-300 py-3 px-3.5 ${
              activeTab === 'courses'
                ? 'text-white bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.1)]'
                : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HiOutlineBookOpen size={18} className="mr-2 text-emerald-400" />
            {!isSidebarCollapsed && <span>Branching Courses</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab('coop')
              fetchFriendsList()
            }}
            className={`w-full flex items-center rounded-xl text-left text-sm font-bold tracking-wide font-space transition-all duration-300 py-3 px-3.5 ${
              activeTab === 'coop'
                ? 'text-white bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.1)]'
                : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HiOutlineStatusOnline size={18} className="mr-2 text-emerald-400" />
            {!isSidebarCollapsed && <span>Co-Op Study Rooms</span>}
          </button>

          <button
            onClick={() => setActiveTab('live-class')}
            className={`w-full flex items-center rounded-xl text-left text-sm font-bold tracking-wide font-space transition-all duration-300 py-3 px-3.5 ${
              activeTab === 'live-class'
                ? 'text-white bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.1)]'
                : 'text-gray-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <HiOutlineSparkles size={18} className="mr-2 text-emerald-400" />
            {!isSidebarCollapsed && <span>Cohort Stream</span>}
          </button>
        </nav>

        {/* Sidebar Footer (Credits tracker) */}
        <div className="pt-4 border-t border-white/[0.1] space-y-4 mt-3">
          {!isSidebarCollapsed ? (
            <div className="bg-[#0b100d]/80 border border-white/[0.06] p-4 rounded-xl space-y-2.5 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-1">
                  <HiOutlineLightningBolt className="text-emerald-400" size={14} />
                  Credits
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">Live status</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Class Credits</span>
                <span className="text-white font-extrabold">{credits} / 30</span>
              </div>
              <div className="w-full bg-[#18231d] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (credits / 30) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title={`Credits: ${credits}/30`}>
              <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400">
                {credits}
              </span>
            </div>
          )}

          {/* Student Profile Card */}
          <div className="flex items-center gap-3 border-t border-white/[0.06] pt-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-emerald-400 overflow-hidden">
              {userPicture ? (
                <img src={userPicture} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <HiOutlineUser size={18} />
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-none">{userName}</p>
                <p className="text-[9px] font-mono font-semibold text-emerald-400 truncate mt-1">{userUid || 'Lobby...'}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Logout"
            >
              <HiOutlineLogout size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Header Bar */}
        <header className="h-16 border-b border-white/[0.08] px-6 flex items-center justify-between bg-[#040906]/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden text-gray-300 hover:text-white cursor-pointer"
            >
              <HiOutlineMenuAlt2 size={22} />
            </button>
            <h1 className="text-base font-black tracking-tight uppercase text-white font-space">
              Learner Dashboard <span className="text-emerald-400">/ {activeTab}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-400">Server Status: <span className="text-emerald-400">Online</span></span>
          </div>
        </header>

        {/* Dynamic Tab Switcher */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Welcome Card */}
                <div className="relative rounded-3xl border border-white/[0.08] p-8 bg-gradient-to-r from-[#061209] to-[#040806] overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px]" />
                  <h2 className="text-2xl font-black text-white font-space">Welcome back, {userName}!</h2>
                  <p className="text-xs text-gray-400 font-semibold mt-2 leading-relaxed max-w-xl">
                    Dive into your personalized branching curriculum. Answer Micro-Quizzes to dynamically adapt course difficulty to your level, or find a peer and study together in real-time Co-Op rooms.
                  </p>
                </div>

                {/* Dashboard statistics grids */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#070b09]/50 border border-white/[0.08] p-5 rounded-2xl">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Course Credits Earned</p>
                    <p className="text-white text-3xl font-black font-space mt-2">{credits}</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1.5">Daily Progress Status Active</p>
                  </div>
                  <div className="bg-[#070b09]/50 border border-white/[0.08] p-5 rounded-2xl">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Assigned Courses</p>
                    <p className="text-white text-3xl font-black font-space mt-2">{courses.length}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1.5">Includes custom teacher syllabus</p>
                  </div>
                  <div className="bg-[#070b09]/50 border border-white/[0.08] p-5 rounded-2xl">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Level & Achievements</p>
                    <p className="text-white text-3xl font-black font-space mt-2">Level {Math.floor(credits / 10) + 1}</p>
                    <p className="text-[10px] text-emerald-400 font-bold mt-1.5">Next level at {(Math.floor(credits / 10) + 1) * 10} credits</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {!selectedCourse ? (
                  <>
                    <ActiveTeacherCourses />
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-black text-white font-space">Your Branching Syllabus</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {courses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-[#070b09]/60 border border-white/[0.08] p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/35 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-md text-[9px] font-bold text-emerald-400 tracking-wider uppercase font-space">
                              Adaptive Branching
                            </span>
                            {course.courseImage && (
                              <div className="mt-4 rounded-xl overflow-hidden h-32 w-full border border-white/[0.08]">
                                <img 
                                  src={course.courseImage.startsWith('http') ? course.courseImage : `${API_URL.replace(/\\/$/, '')}/${course.courseImage.replace(/^\\//, '')}`} 
                                  alt={course.title} 
                                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                                  onError={(e) => { e.target.onerror = null; e.target.src = '/brain.jpg'; }}
                                />
                              </div>
                            )}
                            <h4 className="text-base font-black text-white mt-4 font-space truncate">{course.title}</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-semibold mt-2.5 mb-6">
                              {course.description || 'No description provided.'}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCourse(course)
                              setCurrentChapterIdx(0)
                              setVideoPlayState('main')
                              setBranchingPath('Standard Route')
                              setVideoFinished(false)
                            }}
                            className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-black text-xs font-black uppercase tracking-wider hover:scale-[1.02] transition-transform cursor-pointer"
                          >
                            Enter Course Player
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  </>
                ) : (
                  // Course Player Screen
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Netflix Video Player */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => setSelectedCourse(null)}
                          className="text-xs text-gray-400 hover:text-white flex items-center font-bold"
                        >
                          ← Back to Syllabus
                        </button>
                        <span className="px-2.5 py-1 bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 rounded-full text-[10px] font-bold">
                          Active Branch: {branchingPath}
                        </span>
                      </div>

                      {/* Video Wrapper */}
                      <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-black aspect-video flex items-center justify-center">
                        {isQuizOpen ? (
                          // Glassmorphic Micro-Quiz Popup Overlay
                          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
                            <div className="max-w-md w-full p-6 border border-white/[0.1] bg-[#070b09]/80 rounded-2xl text-center space-y-6 relative overflow-hidden">
                              <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl" />
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Pop-up Micro Quiz</span>
                                <span className="text-xs text-emerald-400 font-bold font-mono">
                                  Timer: {quizTimer}s
                                </span>
                              </div>
                              <p className="text-sm font-bold text-white font-space leading-relaxed">
                                {selectedCourse.chapters[currentChapterIdx].quizQuestion}
                              </p>

                              <div className="space-y-2.5 text-left">
                                {selectedCourse.chapters[currentChapterIdx].quizOptions.map((opt, i) => (
                                  <button
                                    key={i}
                                    disabled={isQuizSubmitted}
                                    onClick={() => setSelectedAnswer(i)}
                                    className={`w-full py-3 px-4 rounded-xl border text-xs font-semibold text-left transition-all ${
                                      selectedAnswer === i
                                        ? 'border-emerald-500 bg-emerald-500/15 text-white'
                                        : 'border-white/[0.06] bg-white/[0.02] text-gray-300 hover:border-white/20'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>

                              {!isQuizSubmitted ? (
                                <button
                                  disabled={selectedAnswer === null}
                                  onClick={() => handleQuizSubmit(false)}
                                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-black text-xs font-black uppercase tracking-wider disabled:opacity-40"
                                >
                                  Submit Answer
                                </button>
                              ) : (
                                <div className="py-2.5 text-xs font-bold font-space uppercase tracking-wider">
                                  {quizCorrect ? (
                                    <span className="text-emerald-400 animate-pulse">✓ Correct! Adjusting for Advanced Course Path...</span>
                                  ) : (
                                    <span className="text-orange-400 animate-pulse">✖ Adjusting path to Deep-Dive Foundations...</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : null}

                        {/* HTML5 Video Player */}
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          controls
                          onEnded={handleVideoEnded}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="bg-[#070b09]/50 border border-white/[0.08] p-5 rounded-2xl space-y-1.5">
                        <h4 className="text-sm font-extrabold text-white">
                          {selectedCourse.chapters[currentChapterIdx].chapterTitle}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                          Our custom Netflix Adaptive logic automatically monitors your micro-quiz responses to branch and adjust course difficulty. You are currently studying on the standard chapter timeline.
                        </p>
                      </div>
                    </div>

                    {/* Right: Collapsible Game-Style Roadmap Skill Tree */}
                    <div className="space-y-6">
                      <div className="bg-[#070b09]/50 border border-white/[0.08] p-5 rounded-2xl space-y-4">
                        <h4 className="text-sm font-extrabold text-white font-space">Branching Skill Tree</h4>
                        <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                          Your live learning trajectory across Chapter nodes. Sahi jawab leads to the Advanced route, incorrect redirects to Foundation.
                        </p>

                        {/* Interactive Skill Tree Diagram SVG */}
                        <div className="border border-white/[0.06] bg-black/60 rounded-xl p-4 flex items-center justify-center relative overflow-hidden h-64">
                          <svg className="w-full h-full" viewBox="0 0 200 240">
                            {/* Lines */}
                            <line
                              x1="100"
                              y1="40"
                              x2="50"
                              y2="120"
                              stroke={videoPlayState === 'remedial' ? '#f97316' : '#ffffff20'}
                              strokeWidth={videoPlayState === 'remedial' ? '3' : '1'}
                            />
                            <line
                              x1="100"
                              y1="40"
                              x2="150"
                              y2="120"
                              stroke={videoPlayState === 'advanced' ? '#10b981' : '#ffffff20'}
                              strokeWidth={videoPlayState === 'advanced' ? '3' : '1'}
                            />

                            {/* Node 1: Main Video */}
                            <circle
                              cx="100"
                              cy="40"
                              r="16"
                              fill="#070b09"
                              stroke={videoPlayState === 'main' ? '#10b981' : '#ffffff40'}
                              strokeWidth="2.5"
                            />
                            <text x="100" y="44" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                              MAIN
                            </text>

                            {/* Node 2: Remedial Foundation */}
                            <circle
                              cx="50"
                              cy="120"
                              r="16"
                              fill="#070b09"
                              stroke={videoPlayState === 'remedial' ? '#f97316' : '#ffffff20'}
                              strokeWidth="2.5"
                            />
                            <text x="50" y="124" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                              FOUND
                            </text>

                            {/* Node 3: Advanced */}
                            <circle
                              cx="150"
                              cy="120"
                              r="16"
                              fill="#070b09"
                              stroke={videoPlayState === 'advanced' ? '#10b981' : '#ffffff20'}
                              strokeWidth="2.5"
                            />
                            <text x="150" y="124" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">
                              ADV
                            </text>

                            {/* Node labels */}
                            <text x="100" y="70" fill="#a1a1aa" fontSize="6" textAnchor="middle">
                              Micro-Quiz Branch
                            </text>
                          </svg>

                          <div className="absolute bottom-2 left-2 flex flex-col text-[7px] space-y-1 bg-black/70 p-2 rounded border border-white/[0.08]">
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-gray-300">Green = Advanced Path</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                              <span className="text-gray-300">Orange = Foundation Path</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'coop' && (
              <motion.div
                key="coop"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="h-full flex flex-col"
              >
                {coopStatus === 'idle' && (
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl mx-auto mt-6">
                    {/* Matchmaker Box */}
                    <div className="lg:col-span-3 flex flex-col items-center justify-center p-8 border border-white/[0.08] bg-[#070b09]/40 backdrop-blur-xl rounded-3xl text-center space-y-5">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <HiOutlineStatusOnline size={28} />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-black text-white font-space">Real-Time Queue Matchmaking</h3>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-semibold max-w-sm">
                          Search for online students studying Chapter 1. Sockets automatically pairs you in real-time to start a collaborative study session.
                        </p>
                      </div>
                      <button
                        onClick={handleFindPartner}
                        className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-green-400 text-black text-[10px] font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
                      >
                        Start Matchmaking Sonar
                      </button>
                    </div>

                    {/* Social Widget Panel */}
                    <div className="lg:col-span-2 border border-white/[0.08] bg-[#070b09]/40 backdrop-blur-xl rounded-3xl p-5 flex flex-col space-y-4 min-h-[300px]">
                      <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                        <span className="text-xs font-black text-white font-space">Social & Study Friends</span>
                        <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 font-bold font-mono">
                          UID: {userUid || 'Lobby...'}
                        </span>
                      </div>

                      {/* Inner social tab switches */}
                      <div className="flex bg-white/[0.02] border border-white/[0.06] p-0.5 rounded-lg text-[10px] font-bold font-space">
                        {['friends', 'requests', 'add'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveSocialTab(tab)}
                            className={`flex-1 text-center py-1.5 rounded-md capitalize cursor-pointer transition-all ${
                              activeSocialTab === tab
                                ? 'bg-emerald-500 text-black font-extrabold shadow'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {tab === 'requests' ? `Requests (${pendingIncoming.length})` : tab}
                          </button>
                        ))}
                      </div>

                      {/* Inner Tab contents */}
                      <div className="flex-1 overflow-y-auto max-h-48 pr-1 text-xs scrollbar-none">
                        {activeSocialTab === 'friends' && (
                          <div className="space-y-2">
                            {friends.length === 0 ? (
                              <p className="text-gray-500 text-[10px] italic text-center py-4">No friends added yet. Add peers by UID to invite them.</p>
                            ) : (
                              friends.map((friend) => {
                                const isOnline = !!onlineStatuses[friend._id];
                                return (
                                  <div key={friend._id} className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
                                      <div>
                                        <p className="text-white font-bold leading-none">{friend.name}</p>
                                        <p className="text-[8px] text-gray-500 mt-1 font-mono">{friend.uid}</p>
                                      </div>
                                    </div>
                                    {isOnline ? (
                                      <button
                                        onClick={() => handleInviteFriend(friend._id)}
                                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/25 rounded text-[8px] font-bold transition-all cursor-pointer"
                                      >
                                        Invite
                                      </button>
                                    ) : (
                                      <span className="text-[8px] text-gray-500 font-bold uppercase">Offline</span>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}

                        {activeSocialTab === 'requests' && (
                          <div className="space-y-2">
                            {pendingIncoming.length === 0 ? (
                              <p className="text-gray-500 text-[10px] italic text-center py-4">No pending friend requests.</p>
                            ) : (
                              pendingIncoming.map((req) => (
                                <div key={req.friendshipId} className="bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-xl flex items-center justify-between">
                                  <div>
                                    <p className="text-white font-bold leading-none">{req.name}</p>
                                    <p className="text-[8px] text-gray-500 mt-1 font-mono">{req.uid}</p>
                                  </div>
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleRespondFriendRequest(req.friendshipId, 'accepted')}
                                      className="px-2 py-0.5 bg-emerald-500 text-black rounded text-[8px] font-bold cursor-pointer"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleRespondFriendRequest(req.friendshipId, 'declined')}
                                      className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-white rounded text-[8px] font-bold cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        {activeSocialTab === 'add' && (
                          <form onSubmit={handleSendFriendRequest} className="space-y-2.5">
                            <div className="space-y-1">
                              <label className="text-[9px] text-gray-500 font-bold uppercase">Search Student UID tag</label>
                              <input
                                type="text"
                                value={addFriendInput}
                                onChange={(e) => setAddFriendInput(e.target.value)}
                                placeholder="e.g. SANYASEN#1234"
                                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white placeholder-gray-600 focus:outline-none"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2 bg-emerald-500 text-black font-bold text-[10px] uppercase rounded-lg cursor-pointer"
                            >
                              Send Friend Request
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {coopStatus === 'searching' && (
                  <div className="flex flex-col items-center justify-center p-12 border border-white/[0.08] bg-[#070b09]/40 backdrop-blur-xl rounded-3xl text-center space-y-6 max-w-xl mx-auto mt-10 relative overflow-hidden">
                    {/* Glowing radar scan pulse ring animations */}
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" />
                      <div
                        className="absolute inset-4 rounded-full border border-emerald-500/30 animate-ping"
                        style={{ animationDelay: '0.4s' }}
                      />
                      <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <HiOutlineRefresh size={26} className="animate-spin" />
                      </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                      <h3 className="text-xl font-black text-white font-space animate-pulse">Radar Scanning Online Peers</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                        Searching matching queue for students active in Chapter 1...
                      </p>
                    </div>
                    <button
                      onClick={handleCancelSearch}
                      className="py-2.5 px-6 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel Search Lobby
                    </button>
                  </div>
                )}

                {coopStatus === 'matched' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[480px]">
                    {/* Left Panel: Collaborative Workspace controls & Shared Chat */}
                    <div className="lg:col-span-1 flex flex-col bg-[#070b09]/50 border border-white/[0.08] rounded-2xl overflow-hidden p-4 space-y-4">
                      {/* Partner Card */}
                      <div className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs font-bold text-white truncate max-w-[130px]">
                            Partner: {partnerInfo?.name || 'Loading...'}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded text-[8px] font-bold">
                          Matched
                        </span>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto space-y-3 p-1 custom-sidebar-scroll text-xs">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex flex-col max-w-[85%] rounded-xl p-3 ${
                              msg.sender === 'System'
                                ? 'bg-white/[0.02] border border-white/[0.06] text-gray-400 self-center text-center'
                                : msg.sender === userName
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-white ml-auto text-right'
                                : 'bg-white/[0.04] border border-white/[0.08] text-gray-200 mr-auto text-left'
                            }`}
                          >
                            <span className="text-[8px] font-bold text-gray-500">{msg.sender}</span>
                            <p className="mt-1 font-semibold leading-relaxed">{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Send Form */}
                      <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Type co-op chat message..."
                          className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="submit"
                          className="px-4 bg-emerald-500 text-black rounded-xl font-bold flex items-center justify-center cursor-pointer"
                        >
                          <HiOutlineChat size={16} />
                        </button>
                      </form>
                    </div>

                    {/* Right Panel: Shared Interactive Canvas / Whiteboard */}
                    <div className="lg:col-span-2 flex flex-col bg-[#070b09]/50 border border-white/[0.08] rounded-2xl overflow-hidden p-4 space-y-4">
                      {/* Canvas Controls Header */}
                      <div className="flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">Shared Co-Op Canvas</span>
                          <span className="text-[10px] text-gray-500">Drawing syncs in real-time</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleClearCanvas}
                            className="p-2 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                            title="Clear Board"
                          >
                            <HiOutlineTrash size={14} />
                          </button>
                          <button
                            onClick={handleCompleteMission}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-400 text-black text-[10px] font-black uppercase tracking-wider rounded-lg hover:scale-[1.02] transition-transform cursor-pointer"
                          >
                            Complete Mission
                          </button>
                        </div>
                      </div>

                      {/* Whiteboard Board */}
                      <div className="flex-1 bg-black/60 rounded-xl relative overflow-hidden border border-white/[0.06]">
                        <canvas
                          ref={canvasRef}
                          width={600}
                          height={400}
                          onMouseDown={handleCanvasMouseDown}
                          onMouseMove={handleCanvasMouseMove}
                          onMouseUp={handleCanvasMouseUp}
                          onMouseLeave={handleCanvasMouseUp}
                          className="absolute inset-0 w-full h-full cursor-crosshair"
                        />
                      </div>

                      {/* Bottom Brush Options */}
                      <div className="flex items-center justify-between shrink-0 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 font-semibold">Select Color:</span>
                          <div className="flex gap-2">
                            {['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#ffffff'].map((color) => (
                              <button
                                key={color}
                                onClick={() => setBrushColor(color)}
                                className={`w-5 h-5 rounded-full border transition-all ${
                                  brushColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-semibold">Brush Size:</span>
                          <input
                            type="range"
                            min="2"
                            max="12"
                            value={brushSize}
                            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                            className="accent-emerald-500 w-24"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {coopStatus === 'victory' && (
                  <div className="flex flex-col items-center justify-center p-12 border border-white/[0.08] bg-[#070b09]/50 backdrop-blur-2xl rounded-3xl text-center space-y-6 max-w-xl mx-auto mt-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 animate-pulse" />
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.3)] shrink-0 animate-bounce">
                      <HiOutlineSparkles size={40} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white font-space uppercase tracking-tight">Co-Op Target Cleared!</h3>
                      <p className="text-sm font-black text-emerald-400 font-space">+5 Class Credits Earned</p>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold max-w-sm mx-auto">
                        Amazing teamwork! Both student profiles have been awarded credits in the database registry. Keep solving collaborative chapters!
                      </p>
                    </div>
                    <button
                      onClick={handleCloseVictory}
                      className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-green-400 text-black text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
                    >
                      Return to Lobby
                    </button>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === 'live-class' && (
              <motion.div
                key="live-class"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full h-[calc(100vh-120px)] flex flex-col space-y-6"
              >
                {!isJoined ? (
                  <div className="flex flex-col items-center justify-center p-12 border border-white/[0.08] bg-[#070b09]/40 backdrop-blur-xl rounded-3xl text-center space-y-6 max-w-md mx-auto my-16 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="w-16 h-16 rounded-full bg-[#121a15] border border-white/[0.05] mx-auto flex items-center justify-center text-emerald-400/70 shadow-inner">
                      <HiOutlineSparkles size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white font-space">Join Cohort Stream</h3>
                      <p className="text-xs text-gray-500 mt-1">Enter the 6-digit Stream PIN provided by your Instructor/Creator.</p>
                    </div>
                    <div className="flex gap-2 w-full">
                       <input 
                          id="deck-pin-input"
                          type="text" 
                          placeholder="e.g. 123456" 
                          maxLength={6}
                          className="w-full bg-[#0a0f0c] border border-emerald-500/20 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-white text-center font-mono font-bold tracking-[0.25em] outline-none placeholder:tracking-normal placeholder:text-gray-600 placeholder:font-sans text-lg"
                       />
                       <button
                         onClick={() => {
                           const pin = document.getElementById('deck-pin-input').value;
                           if (pin && pin.length === 6 && socketRef.current) {
                              socketRef.current.emit('student:join_deck', {
                                deckUid: pin,
                                studentDetails: { name: userName, email: userEmail, uid: userUid }
                              });
                           } else {
                              alert("Please enter a valid 6-digit Deck PIN.");
                           }
                         }}
                         className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-space rounded-xl transition-colors shrink-0 cursor-pointer shadow-md"
                       >
                         Join
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 min-h-0">
                    
                    {/* LEFT COLUMN: Sync Board (8 columns) */}
                    {deckIsSharingWhiteboard ? (
                      <div className="lg:col-span-8 flex flex-col space-y-4 min-h-0">
                        <div className="border border-white/[0.08] bg-white/[0.02] px-4 py-3 rounded-2xl flex items-center justify-between shadow-lg shrink-0">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider font-space">Live Whiteboard Sync</h4>
                          </div>
                          <div className="text-[10px] text-gray-400 font-semibold flex items-center gap-2">
                            <span>Professor is presenting</span>
                          </div>
                        </div>

                        <div className="border border-white/[0.08] bg-[#050907]/90 rounded-2xl flex-1 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col min-h-0">
                          <div className="flex-1 w-full h-full relative overflow-hidden select-none">
                            <canvas
                              ref={liveCanvasRef}
                              className="absolute inset-0 block w-full h-full"
                            />
                            <div className="absolute bottom-4 left-4 pointer-events-none bg-black/50 border border-white/[0.06] backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] text-gray-400 font-semibold shadow-md">
                              <span>Read-only synced board</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="lg:col-span-8 flex flex-col items-center justify-center p-12 border border-white/[0.08] bg-[#070b09]/40 backdrop-blur-xl rounded-3xl text-center space-y-6 min-h-[450px] relative overflow-hidden shadow-2xl">
                        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-emerald-500/[0.01] blur-[100px] pointer-events-none" />
                        <div className="w-18 h-18 rounded-2xl bg-[#0b120e] border border-white/[0.05] flex items-center justify-center text-emerald-500/50 shadow-inner">
                          <HiOutlineStatusOnline size={36} className="animate-pulse" />
                        </div>
                        <div className="space-y-2.5 max-w-md relative z-10">
                          <h3 className="text-lg font-bold text-white font-space tracking-tight">Whiteboard Share is Inactive</h3>
                          <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                            The Professor has stopped sharing the whiteboard. Please pay attention to the live lecture. You can still ask doubts and chat in the side panels.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* RIGHT COLUMN: Sidebar (Submit Doubt & Synced Chat) (4 columns) */}
                    <div className="lg:col-span-4 flex flex-col space-y-4 min-h-0 max-h-full">
                      
                      {/* Ask a Doubt Panel */}
                      <div className="border border-white/[0.08] bg-[#070b09]/80 p-4 rounded-2xl flex flex-col shrink-0 shadow-lg">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space border-b border-white/[0.06] pb-2">
                          Ask a Doubt
                        </h4>
                        <div className="mt-3 space-y-2">
                          <textarea
                            value={deckDoubtInput}
                            onChange={(e) => setDeckDoubtInput(e.target.value)}
                            placeholder="Type your doubt here for the Professor..."
                            rows={3}
                            className="w-full bg-black/60 border border-white/10 focus:border-emerald-500/60 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none leading-relaxed resize-none font-semibold"
                          />
                          <button
                            onClick={() => {
                              if (!deckDoubtInput.trim()) return;
                              const doubt = {
                                id: Date.now().toString(),
                                studentName: userName,
                                text: deckDoubtInput,
                                timestamp: new Date().toLocaleTimeString()
                              };
                              if (socketRef.current) {
                                socketRef.current.emit('deck:submit_doubt', { deckUid: deckPin, doubt });
                                alert('Doubt submitted to Professor!');
                              }
                              setDeckDoubtInput('');
                            }}
                            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md font-space"
                          >
                            Send Doubt
                          </button>
                        </div>
                      </div>

                      {/* Synced Room Chat */}
                      <div className="border border-white/[0.08] bg-[#070b09]/80 p-4 rounded-2xl flex flex-col min-h-0 flex-1 shadow-lg">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space border-b border-white/[0.06] pb-2 shrink-0">
                          Classroom Chat
                        </h4>

                        <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 text-[11px] custom-sidebar-scroll">
                          {deckChatMessages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-500 text-[10px] italic">
                              Chat logs are empty.
                            </div>
                          ) : (
                            deckChatMessages.map((msg, idx) => (
                              <div
                                key={idx}
                                className={`flex flex-col max-w-[85%] rounded-xl px-3 py-2 border ${
                                  msg.sender === userName
                                    ? 'bg-emerald-500/10 border-emerald-500/25 text-white ml-auto text-right'
                                    : 'bg-white/[0.04] border-white/[0.08] text-gray-200 mr-auto text-left'
                                }`}
                              >
                                <span className="text-[8px] font-bold text-gray-500">{msg.sender} • {msg.timestamp}</span>
                                <p className="mt-0.5 font-semibold leading-relaxed select-text">{msg.text}</p>
                              </div>
                            ))
                          )}
                          <div ref={deckChatEndRef} />
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!deckChatInput.trim()) return;
                            const msg = {
                              sender: userName,
                              text: deckChatInput,
                              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            };
                            if (socketRef.current) {
                              socketRef.current.emit('deck:chat_message', { deckUid: deckPin, message: msg });
                            }
                            setDeckChatInput('');
                          }}
                          className="flex gap-2 shrink-0"
                        >
                          <input
                            type="text"
                            value={deckChatInput}
                            onChange={(e) => setDeckChatInput(e.target.value)}
                            placeholder="Message class..."
                            className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="submit"
                            className="px-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <HiOutlineChat size={14} />
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── REAL-TIME CO-OP SESSION INVITE POP-UP OVERLAY ── */}
      <AnimatePresence>
        {activeInvite && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-5 w-80 rounded-2xl border border-emerald-500/30 bg-[#070b09]/95 backdrop-blur-xl shadow-2xl flex flex-col space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider font-space">Co-Op Invitation</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono font-bold">{inviteTimer}s</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-relaxed">
                <strong>{activeInvite.requesterName}</strong> has invited you to join a collaborative study session!
              </p>
              <p className="text-[10px] text-gray-500 mt-1">Accepting will join you to their canvas workspace immediately.</p>
            </div>
            <div className="flex gap-2 text-xs font-bold font-space">
              <button
                onClick={handleAcceptInvite}
                className="flex-1 py-2 rounded-lg bg-emerald-500 text-black cursor-pointer hover:scale-[1.02] transition-all font-extrabold"
              >
                Accept
              </button>
              <button
                onClick={handleDeclineInvite}
                className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white cursor-pointer transition-all"
              >
                Decline
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE SIDEBAR DRAW NAV ── */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="w-64 h-full bg-[#040806] border-r border-white/10 p-5 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-extrabold text-white font-space">
                    Acharya <span className="text-emerald-400">AI</span>
                  </span>
                  <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-400">
                    <HiOutlineX size={18} />
                  </button>
                </div>
                <nav className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab('overview')
                      setIsMobileSidebarOpen(false)
                    }}
                    className="w-full flex items-center py-3 px-4 text-xs font-bold text-gray-300 rounded-lg hover:bg-white/[0.04]"
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('courses')
                      setIsMobileSidebarOpen(false)
                    }}
                    className="w-full flex items-center py-3 px-4 text-xs font-bold text-gray-300 rounded-lg hover:bg-white/[0.04]"
                  >
                    Branching Courses
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('coop')
                      setIsMobileSidebarOpen(false)
                    }}
                    className="w-full flex items-center py-3 px-4 text-xs font-bold text-gray-300 rounded-lg hover:bg-white/[0.04]"
                  >
                    Co-Op Study Rooms
                  </button>
                </nav>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Credits</span>
                  <span className="text-emerald-400 font-extrabold">{credits}/30</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl font-bold text-xs"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
