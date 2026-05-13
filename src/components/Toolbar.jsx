const TIME_OPTIONS = [15, 30, 60, 120]
const WORD_OPTIONS = [10, 25, 50, 100]
const MODES = ['words', 'sentences', 'code']
const TEST_TYPES = ['time', 'words']

export default function Toolbar({ testType, setTestType, timeOption, setTimeOption, wordCountOption, setWordCountOption, elapsedTime, currentWordIndex, mode, setMode }) {
  const displayValue = testType === 'time' ? timeOption - elapsedTime : `${currentWordIndex}/${wordCountOption}`
  const displayLabel = testType === 'time' ? 'sec' : 'words'

  return (
    <div className="w-full max-w-5xl mb-6">
      {/* Timer / Progress */}
      <div className="text-center mb-4">
        <div className="text-[#e2b714] text-4xl font-bold">{displayValue}</div>
        <div className="text-xs uppercase tracking-widest mt-1 text-[#646669]">{displayLabel}</div>
      </div>

      

      {/* Selectors */}
      <div className="flex flex-wrap gap-6 justify-center mb-6">
        {/* Test Type selector */}
        <div className="flex gap-2">
          {TEST_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTestType(t)}
              className={`px-4 py-1 rounded-full text-sm transition-colors ${
                testType === t
                  ? 'text-[#e2b714] border border-[#e2b714]'
                  : 'text-[#646669] hover:text-[#d1d0c5] border border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="w-px bg-[#2c2e31]" />

        {/* Mode selector */}
        <div className="flex gap-2">
          {MODES.map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1 rounded-full text-sm transition-colors ${
                mode === m
                  ? 'text-[#e2b714] border border-[#e2b714]'
                  : 'text-[#646669] hover:text-[#d1d0c5] border border-transparent'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="w-px bg-[#2c2e31]" />

        {/* Time / Word selector */}
        <div className="flex gap-2">
          {testType === 'time' ? (
            TIME_OPTIONS.map(t => (
              <button
                key={t}
                onClick={() => setTimeOption(t)}
                className={`px-4 py-1 rounded-full text-sm transition-colors ${
                  timeOption === t
                    ? 'text-[#e2b714] border border-[#e2b714]'
                    : 'text-[#646669] hover:text-[#d1d0c5] border border-transparent'
                }`}
              >
                {t}s
              </button>
            ))
          ) : (
            WORD_OPTIONS.map(w => (
              <button
                key={w}
                onClick={() => setWordCountOption(w)}
                className={`px-4 py-1 rounded-full text-sm transition-colors ${
                  wordCountOption === w
                    ? 'text-[#e2b714] border border-[#e2b714]'
                    : 'text-[#646669] hover:text-[#d1d0c5] border border-transparent'
                }`}
              >
                {w}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}