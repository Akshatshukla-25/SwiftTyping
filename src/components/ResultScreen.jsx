export default function ResultScreen({ wpm, accuracy, correctWords, wrongWords, timeOption, onRestart }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      <div className="text-center">
        {/* Big WPM number */}
        <p className="text-[#646669] text-sm uppercase tracking-widest mb-2">wpm</p>
        <p className="text-[#e2b714] text-8xl font-bold mb-8">{wpm}</p>

        {/* Stats grid */}
        <div className="flex gap-12 justify-center mb-10">
          <div className="text-center">
            <p className="text-[#646669] text-xs uppercase tracking-widest mb-1">accuracy</p>
            <p className="text-[#d1d0c5] text-3xl font-semibold">{accuracy}%</p>
          </div>
          <div className="text-center">
            <p className="text-[#646669] text-xs uppercase tracking-widest mb-1">correct</p>
            <p className="text-[#d1d0c5] text-3xl font-semibold">{correctWords}</p>
          </div>
          <div className="text-center">
            <p className="text-[#646669] text-xs uppercase tracking-widest mb-1">incorrect</p>
            <p className="text-[#ca4754] text-3xl font-semibold">{wrongWords}</p>
          </div>
          <div className="text-center">
            <p className="text-[#646669] text-xs uppercase tracking-widest mb-1">time</p>
            <p className="text-[#d1d0c5] text-3xl font-semibold">{timeOption}s</p>
          </div>
        </div>

        {/* Restart button */}
        <button
          onClick={onRestart}
          className="px-8 py-3 border border-[#e2b714] text-[#e2b714] rounded-lg hover:bg-[#e2b714] hover:text-[#323437] transition-colors text-base"
        >
          ↺ play again
        </button>
      </div>
    </div>
  )
}