import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type MutableRefObject,
  type Dispatch,
  type SetStateAction,
} from "react"
import { musicLibrary, type Artist, type Album, type Song } from "./music-library"

export type NavigationLevel = "artists" | "albums" | "songs" | "nowPlaying"

export interface NavigationState {
  level: NavigationLevel
  selectedArtist: Artist | null
  selectedAlbum: Album | null
  selectedSong: Song | null
}

interface VideoRect {
  top: number
  left: number
  width: number
  height: number
}

interface MusicPlaybackContextType {
  navigation: NavigationState
  setNavigation: (state: NavigationState) => void
  selectedIndex: number
  setSelectedIndex: Dispatch<SetStateAction<number>>
  isPlaying: boolean
  setIsPlaying: Dispatch<SetStateAction<boolean>>
  volume: number
  setVolume: (volume: number) => void
  playerRef: MutableRefObject<any>
  setVideoRect: (rect: VideoRect | null) => void
}

const MusicPlaybackContext = createContext<MusicPlaybackContextType | undefined>(undefined)

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

export function MusicPlaybackProvider({ children }: { children: ReactNode }) {
  const [navigation, setNavigation] = useState<NavigationState>({
    level: "artists",
    selectedArtist: null,
    selectedAlbum: null,
    selectedSong: null,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const playerRef = useRef<any>(null)
  const [videoRect, setVideoRect] = useState<VideoRect | null>(null)
  const [playerReady, setPlayerReady] = useState(false)
  const previousSongRef = useRef<Song | null>(null)
  const isPlayingRef = useRef(isPlaying)
  const isLoadingRef = useRef(false)
  const navigationRef = useRef(navigation)

  useEffect(() => {
    navigationRef.current = navigation
  }, [navigation])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  const playNextSong = () => {
    const nav = navigationRef.current
    if (!nav.selectedSong || !nav.selectedAlbum || !nav.selectedArtist) return

    const artistIndex = musicLibrary.findIndex((a) => a.name === nav.selectedArtist!.name)
    const albumIndex = nav.selectedArtist!.albums.findIndex((a) => a.name === nav.selectedAlbum!.name)
    const songIndex = nav.selectedAlbum!.songs.findIndex((s) => s.id === nav.selectedSong!.id)

    isPlayingRef.current = true

    if (songIndex < nav.selectedAlbum!.songs.length - 1) {
      const nextSong = nav.selectedAlbum!.songs[songIndex + 1]
      setNavigation({ ...nav, selectedSong: nextSong })
      setIsPlaying(true)
      return
    }

    if (albumIndex < nav.selectedArtist!.albums.length - 1) {
      const nextAlbum = nav.selectedArtist!.albums[albumIndex + 1]
      const nextSong = nextAlbum.songs[0]
      setNavigation({ ...nav, selectedAlbum: nextAlbum, selectedSong: nextSong })
      setIsPlaying(true)
      return
    }

    if (artistIndex < musicLibrary.length - 1) {
      const nextArtist = musicLibrary[artistIndex + 1]
      const nextAlbum = nextArtist.albums[0]
      const nextSong = nextAlbum.songs[0]
      setNavigation({
        level: "nowPlaying",
        selectedArtist: nextArtist,
        selectedAlbum: nextAlbum,
        selectedSong: nextSong,
      })
      setIsPlaying(true)
      return
    }

    const firstArtist = musicLibrary[0]
    const firstAlbum = firstArtist.albums[0]
    const firstSong = firstAlbum.songs[0]
    setNavigation({
      level: "nowPlaying",
      selectedArtist: firstArtist,
      selectedAlbum: firstAlbum,
      selectedSong: firstSong,
    })
    setIsPlaying(true)
  }

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      createPlayer()
      return
    }

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
    if (!existingScript) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    window.onYouTubeIframeAPIReady = () => {
      createPlayer()
    }

    function createPlayer() {
      const container = document.getElementById("youtube-player")
      if (!container || playerRef.current) return

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 0,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              isLoadingRef.current = false
              isPlayingRef.current = true
              setIsPlaying(true)
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              if (!isLoadingRef.current) {
                isPlayingRef.current = false
                setIsPlaying(false)
              }
              isLoadingRef.current = false
            } else if (event.data === window.YT.PlayerState.ENDED) {
              isLoadingRef.current = false
              isPlayingRef.current = false
              setIsPlaying(false)
              playNextSong()
            }
          },
          onError: () => {
            isLoadingRef.current = false
          },
        },
      })
    }
  }, [])

  useEffect(() => {
    if (playerReady && playerRef.current && navigation.selectedSong) {
      const songChanged = previousSongRef.current?.id !== navigation.selectedSong.id
      if (songChanged && !isLoadingRef.current) {
        previousSongRef.current = navigation.selectedSong
        isLoadingRef.current = true
        try {
          if (isPlayingRef.current) {
            playerRef.current.loadVideoById({ videoId: navigation.selectedSong.id, startSeconds: 0 })
          } else {
            playerRef.current.cueVideoById({ videoId: navigation.selectedSong.id, startSeconds: 0 })
          }
        } catch {
          isLoadingRef.current = false
        }
      }
    }
  }, [navigation.selectedSong, playerReady])

  useEffect(() => {
    if (playerReady && playerRef.current && navigation.selectedSong) {
      if (!isLoadingRef.current) {
        try {
          if (isPlaying) {
            playerRef.current.playVideo()
          } else {
            playerRef.current.pauseVideo()
          }
        } catch {
          // Player not ready yet
        }
      }
    }
  }, [isPlaying, playerReady, navigation.selectedSong])

  useEffect(() => {
    if (playerReady && playerRef.current) {
      playerRef.current.setVolume(volume)
    }
  }, [volume, playerReady])

  const showOnScreen = !!(videoRect && isPlaying && navigation.selectedSong)

  return (
    <MusicPlaybackContext.Provider
      value={{
        navigation,
        setNavigation,
        selectedIndex,
        setSelectedIndex,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        playerRef,
        setVideoRect,
      }}
    >
      <div
        id="youtube-player-wrapper"
        style={
          showOnScreen && videoRect
            ? {
              position: "fixed",
              top: videoRect.top,
              left: videoRect.left,
              width: videoRect.width,
              height: videoRect.height,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 5,
            }
            : {
              position: "fixed",
              top: 0,
              left: 0,
              width: 0,
              height: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }
        }
      >
        <div id="youtube-player" style={{ width: "100%", height: "100%" }} />
      </div>
      {children}
    </MusicPlaybackContext.Provider>
  )
}

export function useMusicPlayback() {
  const context = useContext(MusicPlaybackContext)
  if (context === undefined) {
    throw new Error("useMusicPlayback must be used within a MusicPlaybackProvider")
  }
  return context
}
