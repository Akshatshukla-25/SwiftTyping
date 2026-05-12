export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-[#2c2e31]">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-[#e2b714] text-xl font-bold">swift</span>
        <span className="text-[#646669] text-xl font-bold">typing</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-6 text-sm">
        <a href="#" className="hover:text-[#d1d0c5] transition-colors">leaderboard</a>
        <a href="#" className="hover:text-[#d1d0c5] transition-colors">about</a>
        <a href="#" className="hover:text-[#d1d0c5] transition-colors">settings</a>
      </nav>
    </header>
  )
}