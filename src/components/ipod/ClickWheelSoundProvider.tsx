import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from "react"

interface ClickWheelSoundContextType {
  playClick: (velocity?: number) => void
  setEnabled: (enabled: boolean) => void
  enabled: boolean
}

const ClickWheelSoundContext = createContext<ClickWheelSoundContextType | null>(null)

const CLICK_SOUND_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sound-2-3MBFmUiLFA8hzXiIffCRSUl1Oom5sL.mov"

export function ClickWheelSoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const lastPlayTimeRef = useRef<number>(0)
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const velocityHistoryRef = useRef<number[]>([])
  const isUnlockedRef = useRef(false)

  useEffect(() => {
    const initAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (!AudioContextClass) return

        audioContextRef.current = new AudioContextClass()

        const response = await fetch(CLICK_SOUND_URL)
        const arrayBuffer = await response.arrayBuffer()
        audioBufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer)
      } catch {
        // Audio init failed silently
      }
    }

    initAudio()

    const unlockAudio = async () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended" && !isUnlockedRef.current) {
        try {
          await audioContextRef.current.resume()
          isUnlockedRef.current = true
        } catch {
          // Unlock failed
        }
      }
    }

    const events = ["touchstart", "touchend", "mousedown", "keydown"] as const
    events.forEach((event) => {
      document.addEventListener(event, unlockAudio, { once: true })
    })

    return () => {
      audioContextRef.current?.close()
      events.forEach((event) => {
        document.removeEventListener(event, unlockAudio)
      })
    }
  }, [])

  const playClick = useCallback(
    async (velocity = 1) => {
      if (!enabled || !audioContextRef.current || !audioBufferRef.current) return

      if (audioContextRef.current.state === "suspended") {
        try {
          await audioContextRef.current.resume()
        } catch {
          return
        }
      }

      const now = performance.now()

      velocityHistoryRef.current.push(velocity)
      if (velocityHistoryRef.current.length > 5) velocityHistoryRef.current.shift()

      const avgVelocity =
        velocityHistoryRef.current.reduce((sum, v) => sum + v, 0) / velocityHistoryRef.current.length
      const debounceTime = Math.max(25, 120 - avgVelocity * 95)

      if (now - lastPlayTimeRef.current < debounceTime) return

      try {
        currentSourceRef.current?.stop()
      } catch {
        // Source already stopped
      }

      try {
        const source = audioContextRef.current.createBufferSource()
        source.buffer = audioBufferRef.current

        const gainNode = audioContextRef.current.createGain()
        const volumeAttenuation = Math.exp(-avgVelocity / 0.4)
        gainNode.gain.value = Math.max(0.2, Math.min(1, 0.6 * volumeAttenuation))

        source.connect(gainNode)
        gainNode.connect(audioContextRef.current.destination)
        source.start(0)
        currentSourceRef.current = source

        source.onended = () => {
          if (currentSourceRef.current === source) currentSourceRef.current = null
        }

        lastPlayTimeRef.current = now
      } catch {
        // Playback error
      }
    },
    [enabled],
  )

  return (
    <ClickWheelSoundContext.Provider value={{ playClick, setEnabled, enabled }}>
      {children}
    </ClickWheelSoundContext.Provider>
  )
}

export function useClickWheelSound() {
  const context = useContext(ClickWheelSoundContext)
  if (!context) {
    throw new Error("useClickWheelSound must be used within ClickWheelSoundProvider")
  }
  return context
}
