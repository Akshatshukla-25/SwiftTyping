import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Toolbar from './components/Toolbar'
import TypingArea from './components/TypingArea'
import ResultScreen from './components/ResultScreen'

const wordsDict = {
    short: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
    "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
    "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
    "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    ],
    medium: [
    "about", "after", "again", "along", "also", "another", "around", "because",
    "before", "between", "bring", "build", "change", "could", "every", "found",
    "given", "great", "group", "house", "large", "learn", "leave", "light",
    "might", "never", "night", "often", "other", "place", "point", "power",
    "right", "river", "should", "small", "sound", "still", "study", "their",
    "thing", "think", "those", "three", "under", "until", "water", "where",
    "which", "world", "would", "write", "young", "above", "below", "close",
    ],
    long: [
    "beautiful", "beginning", "carefully", "certainly", "community", "complete",
    "consider", "continue", "different", "direction", "discovery", "education",
    "everything", "excellent", "experience", "important", "including", "knowledge",
    "language", "listening", "materials", "measuring", "necessary", "operation",
    "organized", "paragraph", "political", "presented", "president", "producing",
    "questions", "recognize", "represent", "resources", "satisfied", "something",
    "sometimes", "structure", "surprised", "technology", "temperature", "together",
    ],
};

const sentencesDict = {
    short: [
    "The sun sets in the west.",
    "She reads every single day.",
    "Birds fly south in winter.",
    "He wrote a short letter.",
    "The cat sat on the mat.",
    "Water boils at one hundred degrees.",
    "They walked home after school.",
    "I enjoy listening to music.",
    "The dog barked at the door.",
    "She smiled and waved goodbye.",
    ],
    medium: [
    "The quick brown fox jumps over the lazy dog near the river.",
    "Learning a new skill takes time, patience, and consistent effort.",
    "She opened the window and let the cool morning breeze flow in.",
    "The library was quiet except for the soft sound of turning pages.",
    "He decided to take a different route home and discovered a new park.",
    "Technology has changed the way people communicate with each other.",
    "The mountain trail was steep but offered a breathtaking view at the top.",
    "Reading books regularly can improve your vocabulary and critical thinking.",
    ],
    long: [
    "The history of computing is a fascinating journey from mechanical calculators to powerful machines that fit in the palm of your hand.",
    "Scientists around the world are collaborating on research that could fundamentally change our understanding of the universe and our place in it.",
    "She had always dreamed of traveling the world and experiencing different cultures, and finally after years of saving, her dream was becoming a reality.",
    "Modern programming languages have abstracted away much of the complexity of working directly with hardware, allowing developers to focus on solving problems.",
    ],
};

const codeDict = {
    short: [
    "for i in range(10):\n    print(i)",
    "x = [1, 2, 3, 4, 5]\nprint(sum(x))",
    "while True:\n    break",
    "def greet(name):\n    return f'Hello, {name}'",
    ],
    medium: [
    "for i in range(10):\n    if i % 2 == 0:\n        print(f'{i} is even')\n    else:\n        print(f'{i} is odd')",
    "def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result",
    "count = 0\nwhile count < 5:\n    print(f'count is {count}')\n    count += 1",
    ],
    long: [
    "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr",
    "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
    ],
};

function generateWords(mode) {
  if (mode === 'sentences') {
    const all = [...sentencesDict.short, ...sentencesDict.medium, ...sentencesDict.long]
    const shuffled = all.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 15).join(' ').split(' ').filter(Boolean)
  } else if (mode === 'code') {
    const all = [...codeDict.short, ...codeDict.medium, ...codeDict.long]
    const shuffled = all.sort(() => Math.random() - 0.5)
    let text = shuffled.slice(0, 5).join(' \n \n ')
    text = text.replace(/\n/g, ' \n ')
    return text.split(' ')
  } else {
    const all = [...wordsDict.short, ...wordsDict.medium, ...wordsDict.long]
    const shuffled = all.sort(() => Math.random() - 0.5)
    return [...shuffled, ...shuffled, ...shuffled].slice(0, 200)
  }
}

export default function App() {
  const [mode, setMode] = useState('words')
  const [testType, setTestType] = useState('time') // 'time' or 'words'
  const [timeOption, setTimeOption] = useState(30)   // selected time (15/30/60/120)
  const [wordCountOption, setWordCountOption] = useState(25) // selected words (10/25/50/100)
  const [elapsedTime, setElapsedTime] = useState(0)        // countdown or countup
  const [started, setStarted] = useState(false)       // has user started typing?
  const [finished, setFinished] = useState(false)     // is the test done?
  const [words, setWords] = useState(() => generateWords('words'))  // the word list
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentInput, setCurrentInput] = useState('') // what user is typing now
  const [wordStatuses, setWordStatuses] = useState({}) // correct/wrong per word index
  const [correctWords, setCorrectWords] = useState(0)
  const [wrongWords, setWrongWords] = useState(0)
  const [typedHistory, setTypedHistory] = useState([])

  const timerRef = useRef(null)

  // When options change, reset everything
  useEffect(() => {
    resetTest()
  }, [timeOption, wordCountOption, testType, mode])

  // Timer
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const next = prev + 1
          if (testType === 'time' && next >= timeOption) {
            clearInterval(timerRef.current)
            setFinished(true)
          }
          return next
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [started, finished, testType, timeOption])

  function resetTest() {
    clearInterval(timerRef.current)
    setElapsedTime(0)
    setStarted(false)
    setFinished(false)
    
    let newWords = generateWords(mode)
    if (testType === 'words') {
      while (newWords.length < wordCountOption) {
         newWords = [...newWords, ...generateWords(mode)]
      }
      newWords = newWords.slice(0, wordCountOption)
    }
    setWords(newWords)
    
    setCurrentWordIndex(0)
    setCurrentInput('')
    setWordStatuses({})
    setCorrectWords(0)
    setWrongWords(0)
    setTypedHistory([])
  }

  // Called from TypingArea when user types
  function handleInput(value) {
    if (finished) return

    // Start timer on first keystroke
    if (!started && value.length > 0) {
      setStarted(true)
    }

    const expected = words[currentWordIndex]

    if (value.endsWith('\n')) {
      if (expected === '\n') {
         setWordStatuses(prev => ({ ...prev, [currentWordIndex]: 'correct' }))
         setCorrectWords(prev => prev + 1)
         setTypedHistory(prev => { const next = [...prev]; next[currentWordIndex] = '\n'; return next })
      } else {
         setWordStatuses(prev => ({ ...prev, [currentWordIndex]: 'wrong' }))
         setWrongWords(prev => prev + 1)
         setTypedHistory(prev => { const next = [...prev]; next[currentWordIndex] = value; return next })
      }
      const newIndex = currentWordIndex + 1
      setCurrentWordIndex(newIndex)
      setCurrentInput('')
      
      if (testType === 'words' && newIndex >= wordCountOption) {
        clearInterval(timerRef.current)
        setFinished(true)
      }
      return
    }

    // User pressed space — move to next word
    if (value.endsWith(' ')) {
      const typed = value.slice(0, -1)
      const isCorrect = typed === expected

      setWordStatuses(prev => ({ ...prev, [currentWordIndex]: isCorrect ? 'correct' : 'wrong' }))

      if (isCorrect) setCorrectWords(prev => prev + 1)
      else setWrongWords(prev => prev + 1)

      setTypedHistory(prev => {
        const next = [...prev]
        next[currentWordIndex] = typed
        return next
      })

      const newIndex = currentWordIndex + 1
      setCurrentWordIndex(newIndex)
      setCurrentInput('')

      if (testType === 'words' && newIndex >= wordCountOption) {
        clearInterval(timerRef.current)
        setFinished(true)
      }
    } else {
      setCurrentInput(value)
    }
  }

  function handleTab() {
    if (finished) return
    if (!started) setStarted(true)

    let newWordIndex = currentWordIndex
    let newStatuses = { ...wordStatuses }
    let newHistory = [...typedHistory]
    let newCorrect = correctWords
    let newWrong = wrongWords

    // Tab acts as 4 spaces.
    // 1st space: applies to currentInput
    if (newWordIndex < words.length) {
      const typed1 = currentInput
      const expected1 = words[newWordIndex]
      const isCorrect1 = typed1 === expected1
      newStatuses[newWordIndex] = isCorrect1 ? 'correct' : 'wrong'
      if (isCorrect1) newCorrect++
      else newWrong++
      newHistory[newWordIndex] = typed1
      newWordIndex++
    }

    // 2nd, 3rd, 4th spaces: apply as empty strings
    for (let i = 0; i < 3; i++) {
      if (newWordIndex < words.length) {
        const expected = words[newWordIndex]
        const isCorrect = ('' === expected)
        newStatuses[newWordIndex] = isCorrect ? 'correct' : 'wrong'
        if (isCorrect) newCorrect++
        else newWrong++
        newHistory[newWordIndex] = ''
        newWordIndex++
      }
    }

    setWordStatuses(newStatuses)
    setCorrectWords(newCorrect)
    setWrongWords(newWrong)
    setTypedHistory(newHistory)
    setCurrentWordIndex(newWordIndex)
    setCurrentInput('')

    if (testType === 'words' && newWordIndex >= wordCountOption) {
      clearInterval(timerRef.current)
      setFinished(true)
    }
  }

  function handleBackspaceToPreviousWord() {
    if (currentWordIndex > 0) {
      const prevIndex = currentWordIndex - 1
      const prevTyped = typedHistory[prevIndex] || ''
      
      setCurrentWordIndex(prevIndex)
      setCurrentInput(prevTyped)
      
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
  }

  // Calculate WPM live
  const elapsedMinutes = elapsedTime / 60
  const wpm = elapsedMinutes > 0 ? Math.round(correctWords / elapsedMinutes) : 0
  const totalAttempted = correctWords + wrongWords
  const accuracy = totalAttempted > 0 ? Math.round((correctWords / totalAttempted) * 100) : 100

  return (
    <div className="min-h-screen bg-[#323437] text-[#646669] flex flex-col">
      <Header />

      {!finished ? (
        <main className="flex flex-col items-center justify-center flex-1 px-4">
          <Toolbar
            testType={testType}
            setTestType={setTestType}
            timeOption={timeOption}
            setTimeOption={setTimeOption}
            wordCountOption={wordCountOption}
            setWordCountOption={setWordCountOption}
            elapsedTime={elapsedTime}
            currentWordIndex={currentWordIndex}
            wpm={wpm}
            accuracy={accuracy}
            totalTime={timeOption}
            mode={mode}
            setMode={setMode}
          />
          <TypingArea
            words={words}
            currentWordIndex={currentWordIndex}
            currentInput={currentInput}
            wordStatuses={wordStatuses}
            onInput={handleInput}
            onTab={handleTab}
            onBackspaceToPrevious={handleBackspaceToPreviousWord}
            started={started}
          />
        </main>
      ) : (
        <ResultScreen
          wpm={wpm}
          accuracy={accuracy}
          correctWords={correctWords}
          wrongWords={wrongWords}
          timeTaken={testType === 'time' ? timeOption : elapsedTime}
          onRestart={resetTest}
        />
      )}
    </div>
  )
}