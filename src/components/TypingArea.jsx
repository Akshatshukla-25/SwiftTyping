import { useEffect, useRef } from 'react'

export default function TypingArea({ words, currentWordIndex, currentInput, wordStatuses, onInput, started }) {
  const inputRef = useRef(null)
  const displayRef = useRef(null)

  // Auto-focus the input when component loads
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Auto-scroll so current word is always visible
  useEffect(() => {
    const currentWordEl = displayRef.current?.querySelector(`[data-index="${currentWordIndex}"]`)
    if (currentWordEl) {
      currentWordEl.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [currentWordIndex])

  return (
    <div className="w-full max-w-3xl" onClick={() => inputRef.current?.focus()}>
      {/* Word display */}
      <div
        ref={displayRef}
        className="h-32 overflow-hidden mb-6 font-mono text-2xl leading-relaxed select-none cursor-text"
      >
        {words.map((word, wordIndex) => {
          const status = wordStatuses[wordIndex]         // 'correct' | 'wrong' | undefined
          const isCurrentWord = wordIndex === currentWordIndex

          return (
            <span
              key={wordIndex}
              data-index={wordIndex}
              className={`inline-block mr-3 ${
                status === 'correct' ? 'text-[#d1d0c5]' :
                status === 'wrong'   ? 'text-[#ca4754] underline' :
                'text-[#646669]'
              }`}
            >
              {word.split('').map((char, charIndex) => {
                // Figure out the color of each character
                let charColor = 'text-[#646669]' // default: untyped gray

                if (isCurrentWord) {
                  if (charIndex < currentInput.length) {
                    // User has typed this character
                    charColor = currentInput[charIndex] === char
                      ? 'text-[#d1d0c5]'   // correct
                      : 'text-[#ca4754]'    // wrong
                  }
                } else if (status === 'correct') {
                  charColor = 'text-[#d1d0c5]'
                } else if (status === 'wrong') {
                  charColor = 'text-[#ca4754]'
                }

                // Show blinking cursor before the current character position
                const isCursorHere = isCurrentWord && charIndex === currentInput.length

                return (
                  <span key={charIndex} className="relative">
                    {/* Blinking cursor */}
                    {isCursorHere && (
                      <span className="absolute -left-0.5 top-1 bottom-1 w-0.5 bg-[#e2b714] animate-pulse" />
                    )}
                    <span className={charColor}>{char}</span>
                  </span>
                )
              })}
            </span>
          )
        })}
      </div>

      {/* Hidden input — captures keystrokes */}
      <input
        ref={inputRef}
        value={currentInput}
        onChange={e => onInput(e.target.value)}
        className="opacity-0 absolute w-px h-px"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Fake visible input bar */}
      <div className="flex gap-3 items-center">
        <div
          className="flex-1 h-11 bg-[#2c2e31] rounded-lg px-4 flex items-center font-mono text-base text-[#d1d0c5] cursor-text border border-transparent focus-within:border-[#e2b714]"
        >
          {currentInput || (
            <span className="text-[#646669]">
              {started ? 'keep typing...' : 'click here or start typing...'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}