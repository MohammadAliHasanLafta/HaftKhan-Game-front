import { ref, onMounted, onUnmounted } from 'vue'

export function useBackgroundMusic(musicFileName, options = {}) {
  const { loop = true, autoplay = false, volume = 0.5 } = options
  
  const audioRef = ref(null)
  const musicSrc = ref(null)
  const musicSrcOgg = ref(null)
  const isPlaying = ref(false)
  const isLoading = ref(true)

  const loadMusic = async () => {
    isLoading.value = true
    try {
      const musicModule = await import(`../assets/audio/${musicFileName}.mp3`)
      musicSrc.value = musicModule.default
    } catch (e) {
      musicSrc.value = null
    }
    
    try {
      const musicOggModule = await import(`../assets/audio/${musicFileName}.ogg`)
      musicSrcOgg.value = musicOggModule.default
    } catch (e) {
      musicSrcOgg.value = null
    }
    isLoading.value = false
  }

  const play = async () => {
    if (!audioRef.value) {
      return false
    }
    if (!musicSrc.value && !musicSrcOgg.value) {
      return false
    }
    try {
      audioRef.value.volume = volume
      await audioRef.value.play()
      isPlaying.value = true
      return true
    } catch (e) {
      // Silently fail if autoplay is blocked
      isPlaying.value = false
      return false
    }
  }

  const pause = () => {
    if (audioRef.value) {
      audioRef.value.pause()
      isPlaying.value = false
    }
  }

  const stop = () => {
    if (audioRef.value) {
      audioRef.value.pause()
      audioRef.value.currentTime = 0
      isPlaying.value = false
    }
  }

  const setVolume = (vol) => {
    if (audioRef.value) {
      audioRef.value.volume = Math.max(0, Math.min(1, vol))
    }
  }

  onMounted(async () => {
    await loadMusic()
    if (autoplay && !isLoading.value && (musicSrc.value || musicSrcOgg.value)) {
      // Wait for audio element to be ready and DOM to be updated
      // Try multiple times with increasing delays to ensure audio element is connected
      const tryPlay = async (attempt = 0) => {
        if (audioRef.value) {
          const success = await play()
          if (!success && attempt < 3) {
            // Retry if failed (might be autoplay policy blocking)
            setTimeout(() => tryPlay(attempt + 1), 300 * (attempt + 1))
          }
        } else if (attempt < 5) {
          // Audio element not ready yet, retry
          setTimeout(() => tryPlay(attempt + 1), 200 * (attempt + 1))
        }
      }
      // Start trying after a short delay
      setTimeout(() => tryPlay(), 100)
    }
  })

  onUnmounted(() => {
    stop()
  })

  return {
    audioRef,
    musicSrc,
    musicSrcOgg,
    isPlaying,
    isLoading,
    play,
    pause,
    stop,
    setVolume
  }
}

