import { useEffect, useRef, useState } from 'react'

// FR-6: voice input using the browser's built in speech recognition.
// Works in Chrome, Edge and Safari. Firefox doesn't have it.
export default function useSpeech(onText) {
  const Recognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  const [listening, setListening] = useState(false)
  const [error, setError] = useState(null)
  const recRef = useRef(null)
  const onTextRef = useRef(onText)

  useEffect(() => {
    onTextRef.current = onText
  }, [onText])

  useEffect(() => () => recRef.current?.abort(), [])

  function start() {
    if (!Recognition) return
    setError(null)
    const rec = new Recognition()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.continuous = true
    rec.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      if (last.isFinal) onTextRef.current(last[0].transcript)
    }
    rec.onerror = (event) => {
      setError(event.error === 'not-allowed' ? 'We need mic access to hear you.' : "Didn't catch that, try again.")
    }
    rec.onend = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  function stop() {
    recRef.current?.stop()
    setListening(false)
  }

  return { supported: Boolean(Recognition), listening, error, start, stop }
}
