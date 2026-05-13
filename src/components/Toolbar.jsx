const TIME_OPTIONS = [15, 30, 60, 120]

export default function Toolbar({ timeOption, setTimeOption, timeLeft, totalTime }) {
  const progressPercent = (timeLeft / totalTime) * 100

  return (
    <div className="w-full max-w-3xl mb-6">
      {/* Timer */}
      <div className="text-center mb-4">
        <div className="text-[#e2b714] text-4xl font-bold">{timeLeft}</div>
        <div className="text-xs uppercase tracking-widest mt-1">sec</div>
      </div>

      

      {/* Time selector */}
      <div className="flex gap-2 justify-center mb-6">
        {TIME_OPTIONS.map(t => (
          <button
            key={t}
            onClick={() => setTimeOption(t)}
            className={`px-4 py-1 rounded-full text-sm transition-colors ${
              timeOption === t
                ? 'text-[#e2b714] border border-[#e2b714]'
                : 'hover:text-[#d1d0c5] border border-transparent'
            }`}
          >
            {t}s
          </button>
        ))}
      </div>
    </div>
  )
}