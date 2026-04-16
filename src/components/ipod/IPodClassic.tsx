import { useState, useEffect, useCallback, useRef } from "react"
import { IPodDisplay } from "./IPodDisplay"
import { ClickWheel } from "./ClickWheel"
import { musicLibrary, type Artist, type Album, type Song } from "./music-library"
import { useMusicPlayback } from "./music-playback-context"
import { useClickWheelSound } from "./ClickWheelSoundProvider"

export function IPodClassic() {
  const { navigation, setNavigation, selectedIndex, setSelectedIndex, isPlaying, setIsPlaying, volume, setVolume, playerRef } =
    useMusicPlayback()

  const { playClick } = useClickWheelSound()

  const [hideUI, setHideUI] = useState(false)

  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const posRef = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)

  // Hold-to-seek state
  const seekHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seekInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const isSeeking = useRef(false)
  const SEEK_HOLD_DELAY = 500
  const SEEK_STEP_SECONDS = 5
  const SEEK_INTERVAL_MS = 300

  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (navigation.level === "nowPlaying" && isPlaying) {
      const timer = setTimeout(() => {
        setHideUI(true)
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setHideUI(false)
    }
  }, [navigation.level, isPlaying])

  const showUI = () => {
    setHideUI(false)
  }

  const getCurrentList = useCallback(() => {
    switch (navigation.level) {
      case "artists":
        return musicLibrary
      case "albums":
        return navigation.selectedArtist?.albums || []
      case "songs":
        return navigation.selectedAlbum?.songs || []
      default:
        return []
    }
  }, [navigation.level, navigation.selectedArtist, navigation.selectedAlbum])

  const handleSelect = () => {
    playClick()
    showUI()

    if (navigation.level === "nowPlaying") {
      setIsPlaying((prev) => !prev)
      return
    }

    const currentList = getCurrentList()

    if (navigation.level === "artists") {
      const artist = currentList[selectedIndex] as Artist
      setNavigation({
        level: "albums",
        selectedArtist: artist,
        selectedAlbum: null,
        selectedSong: null,
      })
      setSelectedIndex(0)
    } else if (navigation.level === "albums") {
      const album = currentList[selectedIndex] as Album
      setNavigation({
        ...navigation,
        level: "songs",
        selectedAlbum: album,
        selectedSong: null,
      })
      setSelectedIndex(0)
    } else if (navigation.level === "songs") {
      const song = currentList[selectedIndex] as Song
      setNavigation({
        ...navigation,
        level: "nowPlaying",
        selectedSong: song,
      })
      setIsPlaying(true)
    }
  }

  const handleMenu = () => {
    playClick()
    showUI()

    if (navigation.level === "nowPlaying") {
      setNavigation({
        level: "songs",
        selectedArtist: navigation.selectedArtist,
        selectedAlbum: navigation.selectedAlbum,
        selectedSong: navigation.selectedSong,
      })
      const songs = navigation.selectedAlbum?.songs || []
      const currentSongIndex = songs.findIndex((s) => s.id === navigation.selectedSong?.id)
      setSelectedIndex(currentSongIndex >= 0 ? currentSongIndex : 0)
    } else if (navigation.level === "songs") {
      const currentAlbum = navigation.selectedAlbum
      setNavigation({
        level: "albums",
        selectedArtist: navigation.selectedArtist,
        selectedAlbum: null,
        selectedSong: null,
      })
      const albums = navigation.selectedArtist?.albums || []
      const currentAlbumIndex = albums.findIndex((a) => a.name === currentAlbum?.name)
      setSelectedIndex(currentAlbumIndex >= 0 ? currentAlbumIndex : 0)
    } else if (navigation.level === "albums") {
      const artistName = navigation.selectedArtist?.name
      setNavigation({
        level: "artists",
        selectedArtist: null,
        selectedAlbum: null,
        selectedSong: null,
      })
      const artistIndex = musicLibrary.findIndex((a) => a.name === artistName)
      setSelectedIndex(artistIndex >= 0 ? artistIndex : 0)
    }
  }

  const handleScrollUp = () => {
    showUI()
    if (navigation.level !== "nowPlaying") {
      setSelectedIndex((prev) => Math.max(0, prev - 1))
    }
  }

  const handleScrollDown = () => {
    showUI()
    if (navigation.level !== "nowPlaying") {
      const currentList = getCurrentList()
      setSelectedIndex((prev) => Math.min(currentList.length - 1, prev + 1))
    }
  }

  const seekBy = useCallback((seconds: number) => {
    try {
      const current = playerRef.current?.getCurrentTime?.()
      const duration = playerRef.current?.getDuration?.()
      if (typeof current === "number" && typeof duration === "number") {
        const target = Math.max(0, Math.min(duration, current + seconds))
        playerRef.current.seekTo(target, true)
      }
    } catch { /* player not ready */ }
  }, [playerRef])

  const clearSeekTimers = useCallback(() => {
    if (seekHoldTimer.current) {
      clearTimeout(seekHoldTimer.current)
      seekHoldTimer.current = null
    }
    if (seekInterval.current) {
      clearInterval(seekInterval.current)
      seekInterval.current = null
    }
  }, [])

  const handleNextDown = useCallback(() => {
    isSeeking.current = false
    clearSeekTimers()
    seekHoldTimer.current = setTimeout(() => {
      isSeeking.current = true
      showUI()
      seekBy(SEEK_STEP_SECONDS)
      seekInterval.current = setInterval(() => {
        seekBy(SEEK_STEP_SECONDS)
      }, SEEK_INTERVAL_MS)
    }, SEEK_HOLD_DELAY)
  }, [clearSeekTimers, seekBy])

  const handleNextUp = useCallback(() => {
    clearSeekTimers()
    if (!isSeeking.current) {
      playClick()
      showUI()
      if (navigation.selectedAlbum && navigation.selectedSong) {
        const songs = navigation.selectedAlbum.songs
        const currentIndex = songs.findIndex((s) => s.id === navigation.selectedSong?.id)
        if (currentIndex < songs.length - 1) {
          const nextSong = songs[currentIndex + 1]
          setNavigation({ ...navigation, selectedSong: nextSong })
          setIsPlaying(true)
        }
      }
    }
    isSeeking.current = false
  }, [clearSeekTimers, playClick, navigation, setNavigation, setIsPlaying])

  const handlePreviousDown = useCallback(() => {
    isSeeking.current = false
    clearSeekTimers()
    seekHoldTimer.current = setTimeout(() => {
      isSeeking.current = true
      showUI()
      seekBy(-SEEK_STEP_SECONDS)
      seekInterval.current = setInterval(() => {
        seekBy(-SEEK_STEP_SECONDS)
      }, SEEK_INTERVAL_MS)
    }, SEEK_HOLD_DELAY)
  }, [clearSeekTimers, seekBy])

  const handlePreviousUp = useCallback(() => {
    clearSeekTimers()
    if (!isSeeking.current) {
      playClick()
      showUI()
      if (navigation.selectedAlbum && navigation.selectedSong) {
        const songs = navigation.selectedAlbum.songs
        const currentIndex = songs.findIndex((s) => s.id === navigation.selectedSong?.id)
        if (currentIndex > 0) {
          const prevSong = songs[currentIndex - 1]
          setNavigation({ ...navigation, selectedSong: prevSong })
          setIsPlaying(true)
        }
      }
    }
    isSeeking.current = false
  }, [clearSeekTimers, playClick, navigation, setNavigation, setIsPlaying])

  useEffect(() => {
    return () => clearSeekTimers()
  }, [clearSeekTimers])

  const handlePlayPause = () => {
    playClick()
    showUI()
    if (navigation.selectedSong) {
      setIsPlaying((prev) => !prev)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    showUI()
    setVolume(Math.max(0, Math.min(100, newVolume)))
  }

  // Drag handlers
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
    dragStart.current = { x: clientX - posRef.current.x, y: clientY - posRef.current.y }
    hasMoved.current = false
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      const newX = clientX - dragStart.current.x
      const newY = clientY - dragStart.current.y
      if (Math.abs(newX - posRef.current.x) > 3 || Math.abs(newY - posRef.current.y) > 3) {
        hasMoved.current = true
      }
      posRef.current = { x: newX, y: newY }
      setPosition({ x: newX, y: newY })
    }
    const onEnd = () => setIsDragging(false)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("touchmove", onMove, { passive: false })
    window.addEventListener("mouseup", onEnd)
    window.addEventListener("touchend", onEnd)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("mouseup", onEnd)
      window.removeEventListener("touchend", onEnd)
    }
  }, [isDragging])

  const toggleCollapsed = () => {
    if (!hasMoved.current) setCollapsed((c) => !c)
  }

  const isInMenu = navigation.level !== "nowPlaying"

  if (collapsed) {
    return (
      <div
        className="fixed bottom-6 left-6 z-50 cursor-pointer select-none"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onMouseUp={toggleCollapsed}
        onTouchEnd={toggleCollapsed}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6a6a72] via-[#4a4a52] to-[#2a2a32] shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-[#1a1a22] flex items-center justify-center hover:scale-105 transition-transform">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3a3a42] via-[#2a2a32] to-[#1a1a22] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#4a4a52] to-[#2a2a32] shadow-inner" />
          </div>
        </div>
        {isPlaying && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
        )}
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-50 select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: 266,
        height: 434,
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setCollapsed(true)}
        className="absolute -top-3 -right-3 z-60 w-8 h-8 rounded-full bg-[#2a2a32] border border-[#4a4a52] text-white/80 hover:text-white text-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        &times;
      </button>

      {/* Drag handle */}
      <div
        className="absolute -top-5 left-1/2 -translate-x-1/2 z-60 w-20 h-5 rounded-full bg-[#4a4a52]/70 cursor-grab active:cursor-grabbing flex items-center justify-center shadow-md"
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <div className="w-10 h-[3px] bg-white/40 rounded-full" />
      </div>

      {/* Scaled iPod - 0.7x. The container above has the matching scaled dimensions so controls align. */}
      <div style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: 380, height: 620 }}>
        <div className="relative z-10 flex items-center justify-center">
          {/* Outer shadow/glow */}
          <div className="absolute w-[390px] h-[630px] bg-black/20 rounded-[42px] blur-xl"></div>

          {/* iPod Body - Main shell with metallic gradient */}
          <div className="relative w-[380px] h-[620px] bg-gradient-to-br from-[#6a6a72] via-[#4a4a52] to-[#2a2a32] rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] border-[1px] border-[#1a1a22]">
            {/* Top highlight for glossy effect */}
            <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-white/10 to-transparent rounded-t-[40px] pointer-events-none"></div>

            {/* Inner bezel with depth */}
            <div className="absolute inset-[4px] rounded-[36px] bg-gradient-to-b from-[#3a3a42] via-[#4a4a52] to-[#3a3a42] shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(0,0,0,0.8)]">
              {/* Screen Area with inset bezel effect */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[320px] h-[240px]">
                {/* Screen bezel - outer frame */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#2a2a32] via-[#1a1a22] to-[#2a2a32] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)]">
                  <div className="absolute inset-[3px] bg-gradient-to-b from-[#e0e0e5] via-[#f5f5f7] to-[#d8d8dd] rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.3)_inset,0_-1px_0_rgba(255,255,255,0.5)_inset] overflow-hidden">
                    {/* Screen glass reflection */}
                    <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none z-10"></div>
                    <IPodDisplay
                      key={navigation.level}
                      navigation={navigation}
                      selectedIndex={selectedIndex}
                      isPlaying={isPlaying}
                      volume={volume}
                      hideUI={hideUI}
                    />
                  </div>
                </div>
              </div>

              {/* Click Wheel */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <ClickWheel
                  onNext={handleNextUp}
                  onPrevious={handlePreviousUp}
                  onNextDown={handleNextDown}
                  onNextUp={handleNextUp}
                  onPreviousDown={handlePreviousDown}
                  onPreviousUp={handlePreviousUp}
                  onPlayPause={handlePlayPause}
                  onMenu={handleMenu}
                  onSelect={handleSelect}
                  onVolumeChange={handleVolumeChange}
                  onScrollUp={handleScrollUp}
                  onScrollDown={handleScrollDown}
                  volume={volume}
                  showPlaylist={isInMenu}
                  isPlaying={isPlaying}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
