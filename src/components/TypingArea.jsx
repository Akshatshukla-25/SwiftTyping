import { useEffect, useRef } from 'react'

export default function TypingArea({ words, currentWordIndex, currentInput, wordStatuses, onInput, onTab, onBackspaceToPrevious }) {
  const displayRef = useRef(null)

  // Focus hidden input on load
  useEffect(() => {
    document.getElementById('hidden-input')?.focus()
  }, [])

  // Auto scroll to current word
  useEffect(() => {
    if (!displayRef.current) return
    const currentWordEl = displayRef.current.querySelector(`[data-index="${currentWordIndex}"]`)
    if (currentWordEl) {
      currentWordEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [currentWordIndex])

  return (
    <div
      className="w-full max-w-5xl cursor-text"
      onClick={() => document.getElementById('hidden-input')?.focus()}
    >
      <div
        ref={displayRef}
        className="h-96 overflow-hidden font-mono text-2xl leading-relaxed select-none overflow-y-auto"
      >
          {words.map((word, wordIndex) => {
            const status = wordStatuses[wordIndex]
            const isCurrentWord = wordIndex === currentWordIndex

            if (word === '\n') {
              return (
                <div key={wordIndex} data-index={wordIndex} className="w-full h-2 relative my-1">
                  {isCurrentWord && (
                    <span className="absolute left-0 -top-4 text-[#e2b714] animate-pulse font-bold text-2xl">↵</span>
                  )}
                </div>
              )
            }

            if (word === '') {
              return (
                <span 
                  key={wordIndex} 
                  data-index={wordIndex} 
                  className={`inline-block w-4 h-6 relative ${status === 'wrong' ? 'border-b-4 border-[#ca4754]' : ''}`}
                >
                  {isCurrentWord && (
                    <span className="absolute -left-0.5 top-1 bottom-1 w-0.5 bg-[#e2b714] animate-pulse" />
                  )}
                </span>
              )
            }

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
                  let charColor = 'text-[#646669]'

                  if (isCurrentWord) {
                    if (charIndex < currentInput.length) {
                      charColor = currentInput[charIndex] === char
                        ? 'text-[#d1d0c5]'
                        : 'text-[#ca4754]'
                    }
                  } else if (status === 'correct') {
                    charColor = 'text-[#d1d0c5]'
                  } else if (status === 'wrong') {
                    charColor = 'text-[#ca4754]'
                  }

                  const isCursorHere = isCurrentWord && charIndex === currentInput.length

                  return (
                    <span key={charIndex} className="relative">
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

      <input
        id="hidden-input"
        value={currentInput}
        onChange={e => onInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Backspace' && currentInput === '') {
            e.preventDefault()
            onBackspaceToPrevious()
          } else if (e.key === 'Tab') {
            e.preventDefault()
            onTab && onTab()
          } else if (e.key === 'Enter') {
            e.preventDefault()
            onInput(currentInput + '\n')
          }
        }}
        className="opacity-0 absolute w-px h-px"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  )
}