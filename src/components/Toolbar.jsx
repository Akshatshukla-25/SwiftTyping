const TIME_OPTIONS = [15, 30, 60, 120]

export default function Toolbar({ timeOption, setTimeOption, wpm, accuracy, timeLeft, totalTime }) {
  // Progress bar width as percentage
  const progressPercent = (timeLeft / totalTime) * 100

  return (
    <div className="w-full max-w-3xl mb-6">
      {/* Live stats row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-[#e2b714] text-3xl font-bold">{wpm}</div>
            <div className="text-xs uppercase tracking-widest mt-1">wpm</div>
          </div>
          <div className="text-center">
            <div className="text-[#e2b714] text-3xl font-bold">{accuracy}</div>
            <div className="text-xs uppercase tracking-widest mt-1">acc %</div>
          </div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="text-[#e2b714] text-3xl font-bold">{timeLeft}</div>
          <div className="text-xs uppercase tracking-widest mt-1">sec</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#2c2e31] rounded-full mb-4">
        <div
          className="h-1 bg-[#e2b714] rounded-full transition-all duration-1000"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Time selector buttons */}
      <div className="flex gap-2 justify-center">
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