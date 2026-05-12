import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import TypingArea from './components/TypingArea'
import ResultScreen from './components/ResultScreen'

// All the words that will appear in the test
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

// Shuffle the word list so it's random every time
function getRandomWords() {
  const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5)
  // repeat enough words to last any timer length
  return [...shuffled, ...shuffled, ...shuffled]
}

export default function App() {
  const [timeOption, setTimeOption] = useState(30)   // selected time (15/30/60/120)
  const [timeLeft, setTimeLeft] = useState(30)        // countdown
  const [started, setStarted] = useState(false)       // has user started typing?
  const [finished, setFinished] = useState(false)     // is the test done?
  const [words, setWords] = useState(getRandomWords)  // the word list
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState('') // what user is typing now
  const [wordStatuses, setWordStatuses] = useState({}) // correct/wrong per word index
  const [correctWords, setCorrectWords] = useState(0)
  const [wrongWords, setWrongWords] = useState(0)

  const timerRef = useRef(null)

  // When time option changes, reset everything
  useEffect(() => {
    resetTest()
  }, [timeOption])

  // Countdown timer
  useEffect(() => {
    if (started && !finished) {
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
    }
    return () => clearInterval(timerRef.current)
  }, [started])

  function resetTest() {
    clearInterval(timerRef.current)
    setTimeLeft(timeOption)
    setStarted(false)
    setFinished(false)
    setWords(getRandomWords())
    setCurrentWordIndex(0)
    setCurrentInput('')
    setWordStatuses({})
    setCorrectWords(0)
    setWrongWords(0)
  }

  // Called from TypingArea when user types
  function handleInput(value) {
    if (finished) return

    // Start timer on first keystroke
    if (!started && value.length > 0) {
      setStarted(true)
    }

    // User pressed space — move to next word
    if (value.endsWith(' ')) {
      const typed = value.trim()
      const expected = words[currentWordIndex]
      const isCorrect = typed === expected

      setWordStatuses(prev => ({ ...prev, [currentWordIndex]: isCorrect ? 'correct' : 'wrong' }))

      if (isCorrect) setCorrectWords(prev => prev + 1)
      else setWrongWords(prev => prev + 1)

      setCurrentWordIndex(prev => prev + 1)
      setCurrentInput('')
    } else {
      setCurrentInput(value)
    }
  }

  // Calculate WPM live
  const elapsedMinutes = (timeOption - timeLeft) / 60
  const wpm = elapsedMinutes > 0 ? Math.round(correctWords / elapsedMinutes) : 0
  const totalAttempted = correctWords + wrongWords
  const accuracy = totalAttempted > 0 ? Math.round((correctWords / totalAttempted) * 100) : 100

  return (
    <div className="min-h-screen bg-[#323437] text-[#646669] flex flex-col">
      <Header />

      {!finished ? (
        <main className="flex flex-col items-center justify-center flex-1 px-4">
          <Toolbar
            timeOption={timeOption}
            setTimeOption={setTimeOption}
            wpm={wpm}
            accuracy={accuracy}
            timeLeft={timeLeft}
            totalTime={timeOption}
          />
          <TypingArea
            words={words}
            currentWordIndex={currentWordIndex}
            currentInput={currentInput}
            wordStatuses={wordStatuses}
            onInput={handleInput}
            started={started}
          />
        </main>
      ) : (
        <ResultScreen
          wpm={wpm}
          accuracy={accuracy}
          correctWords={correctWords}
          wrongWords={wrongWords}
          timeOption={timeOption}
          onRestart={resetTest}
        />
      )}
    </div>
  )
}