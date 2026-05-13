import { useState, useEffect, useRef } from 'react'

const WORD_LIST = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "his", "by", "from", "they", "we", "say", "her", "she", "or", "an",
  "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when",
  "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them",
  "see", "other", "than", "then", "now", "look", "only", "come", "its",
  "over", "think", "also", "back", "after", "use", "two", "how", "our",
  "work", "first", "well", "way", "even", "new", "want", "because", "any",
]

function getRandomWords() {
  const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5)
  return [...shuffled, ...shuffled, ...shuffled]
}

export default function useTypingEngine(timeOption) {
  const [words, setWords] = useState(getRandomWords)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState('')
  const [wordStatuses, setWordStatuses] = useState({})
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(timeOption)
  const [correctWords, setCorrectWords] = useState(0)
  const [wrongWords, setWrongWords] = useState(0)
  const [typedHistory, setTypedHistory] = useState([])

  const timerRef = useRef(null)

  // We use a ref for currentInput inside the event listener
  // because event listeners can't see updated state directly
  const currentInputRef = useRef('')
  const currentWordIndexRef = useRef(0)
  const finishedRef = useRef(false)
  const startedRef = useRef(false)
  const typedHistoryRef = useRef([])

  // Keep refs in sync with state
  useEffect(() => { currentInputRef.current = currentInput }, [currentInput])
  useEffect(() => { currentWordIndexRef.current = currentWordIndex }, [currentWordIndex])
  useEffect(() => { finishedRef.current = finished }, [finished])
  useEffect(() => { startedRef.current = started }, [started])
  useEffect(() => { typedHistoryRef.current = typedHistory }, [typedHistory])

  // Reset when timeOption changes
  useEffect(() => {
    reset()
  }, [timeOption])

  // Start countdown when user starts typing
  useEffect(() => {
    if (!started || finished) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [started])

  // Global keydown listener
  useEffect(() => {
    function handleKeyDown(e) {
      if (finishedRef.current) return

      // Ignore modifier keys
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const key = e.key

      // Start timer on first real keystroke
      if (!startedRef.current && key.length === 1) {
        setStarted(true)
      }

      if (key === ' ') {
        e.preventDefault()
        const typed = currentInputRef.current.trim()
        if (typed === '') return // ignore empty space
        submitWord(typed, currentWordIndexRef.current)

      } else if (key === 'Backspace') {
        if (currentInputRef.current.length > 0) {
          setCurrentInput(prev => prev.slice(0, -1))
        } else if (currentWordIndexRef.current > 0) {
          // Go back to previous word
          const prevIndex = currentWordIndexRef.current - 1
          const prevTyped = typedHistoryRef.current[prevIndex] || ''
          
          setCurrentWordIndex(prevIndex)
          setCurrentInput(prevTyped)
          
          // Revert stats and status
          setWordStatuses(prev => {
            const next = { ...prev }
            const wasCorrect = next[prevIndex] === 'correct'
            if (wasCorrect) setCorrectWords(c => c - 1)
            else setWrongWords(w => w - 1)
            delete next[prevIndex]
            return next
          })
          
          setTypedHistory(prev => {
            const next = [...prev]
            next.pop()
            return next
          })
        }

      } else if (key.length === 1) {
        // Single printable character
        setCurrentInput(prev => prev + key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, []) // only runs once on mount

  function submitWord(typed, wordIndex) {
    const expected = words[wordIndex]
    const isCorrect = typed === expected

    setWordStatuses(prev => ({
      ...prev,
      [wordIndex]: isCorrect ? 'correct' : 'wrong'
    }))

    if (isCorrect) setCorrectWords(prev => prev + 1)
    else setWrongWords(prev => prev + 1)

    setTypedHistory(prev => {
      const next = [...prev]
      next[wordIndex] = typed
      return next
    })

    setCurrentWordIndex(prev => prev + 1)
    setCurrentInput('')
  }

  function reset() {
    clearInterval(timerRef.current)
    setWords(getRandomWords())
    setCurrentWordIndex(0)
    setCurrentInput('')
    setWordStatuses({})
    setStarted(false)
    setFinished(false)
    setTimeLeft(timeOption)
    setCorrectWords(0)
    setWrongWords(0)
    setTypedHistory([])
    currentInputRef.current = ''
    currentWordIndexRef.current = 0
    finishedRef.current = false
    startedRef.current = false
  }

  const elapsedMinutes = (timeOption - timeLeft) / 60
  const wpm = elapsedMinutes > 0 ? Math.round(correctWords / elapsedMinutes) : 0
  const totalAttempted = correctWords + wrongWords
  const accuracy = totalAttempted > 0 ? Math.round((correctWords / totalAttempted) * 100) : 100

  return {
    words,
    currentWordIndex,
    currentInput,
    wordStatuses,
    started,
    finished,
    timeLeft,
    correctWords,
    wrongWords,
    wpm,
    accuracy,
    reset,
  }
}