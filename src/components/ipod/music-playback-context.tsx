import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
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

interface MusicPlaybackContextType {
  navigation: NavigationState
  setNavigation: (state: NavigationState) => void
  selectedIndex: number
  setSelectedIndex: Dispatch<SetStateAction<number>>
  isPlaying: boolean
  setIsPlaying: Dispatch<SetStateAction<boolean>>
  playNext: () => void
  playPrevious: () => void
  volume: number
  setVolume: (volume: number) => void
  playerRef: MutableRefObject<any>
}

const MusicPlaybackContext = createContext<MusicPlaybackContextType | undefined>(undefined)

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

// Flat play order across the whole library so next/previous cross album and artist boundaries.
interface QueueEntry {
  artist: Artist
  album: Album
  song: Song
}

const playQueue: QueueEntry[] = musicLibrary.flatMap((artist) =>
  artist.albums.flatMap((album) => album.songs.map((song) => ({ artist, album, song })))
)

function queueIndexOf(song: Song | null) {
  if (!song) return -1
  return playQueue.findIndex((entry) => entry.song.id === song.id)
}

export function MusicPlaybackProvider({ children }: { children: ReactNode }) {
  const [navigation, setNavigation] = useState<NavigationState>({
    level: "artists",
    selectedArtist: null,
    selectedAlbum: null,
    selectedSong: null,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  // isPlaying is the user's intent. It drives the player; the player never overrides it
  // except when a track ends, so a stray buffering/playing event can't undo a pause press.
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const playerRef = useRef<any>(null)
  const [playerReady, setPlayerReady] = useState(false)
  const loadedSongIdRef = useRef<string | null>(null)
  const navigationRef = useRef(navigation)

  useEffect(() => {
    navigationRef.current = navigation
  }, [navigation])

  const jumpTo = useCallback((entry: QueueEntry) => {
    const nav = navigationRef.current
    setNavigation({
      level: nav.level === "nowPlaying" ? "nowPlaying" : nav.level,
      selectedArtist: entry.artist,
      selectedAlbum: entry.album,
      selectedSong: entry.song,
    })
    setIsPlaying(true)
  }, [])

  const playNext = useCallback(() => {
    const index = queueIndexOf(navigationRef.current.selectedSong)
    if (index === -1 || playQueue.length === 0) return
    jumpTo(playQueue[(index + 1) % playQueue.length])
  }, [jumpTo])

  const playPrevious = useCallback(() => {
    const index = queueIndexOf(navigationRef.current.selectedSong)
    if (index === -1 || playQueue.length === 0) return
    // Classic behaviour: restart the track if it's been playing for a bit, otherwise go back.
    const current = playerRef.current?.getCurrentTime?.()
    if (typeof current === "number" && current > 3) {
      try {
        playerRef.current.seekTo(0, true)
      } catch { /* player not ready */ }
      setIsPlaying(true)
      return
    }
    jumpTo(playQueue[(index - 1 + playQueue.length) % playQueue.length])
  }, [jumpTo])

  const playNextRef = useRef(playNext)
  useEffect(() => {
    playNextRef.current = playNext
  }, [playNext])

  useEffect(() => {
    function createPlayer() {
      const container = document.getElementById("youtube-player")
      if (!container || playerRef.current) return

      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        playerVars: {
          autoplay: 0,
          controls: 0,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playNextRef.current()
            }
          },
        },
      })
    }

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
  }, [])

  // Keep the player in sync with (selectedSong, isPlaying). Loading a new song and
  // toggling playback are handled in one place so they can't race each other.
  useEffect(() => {
    const player = playerRef.current
    const song = navigation.selectedSong
    if (!playerReady || !player || !song) return

    try {
      if (loadedSongIdRef.current !== song.id) {
        loadedSongIdRef.current = song.id
        if (isPlaying) {
          player.loadVideoById({ videoId: song.id, startSeconds: 0 })
        } else {
          player.cueVideoById({ videoId: song.id, startSeconds: 0 })
        }
        return
      }
      if (isPlaying) {
        player.playVideo()
      } else {
        player.pauseVideo()
      }
    } catch {
      // Player not ready yet
    }
  }, [navigation.selectedSong, isPlaying, playerReady])

  useEffect(() => {
    if (playerReady && playerRef.current) {
      playerRef.current.setVolume(volume)
    }
  }, [volume, playerReady])

  return (
    <MusicPlaybackContext.Provider
      value={{
        navigation,
        setNavigation,
        selectedIndex,
        setSelectedIndex,
        isPlaying,
        setIsPlaying,
        playNext,
        playPrevious,
        volume,
        setVolume,
        playerRef,
      }}
    >
      <div style={{ display: "none" }}>
        <div id="youtube-player" />
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
