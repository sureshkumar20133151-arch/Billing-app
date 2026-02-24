import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in relative z-10">

      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400 drop-shadow-sm">
          Smart Pricing
        </h1>
        <p className="text-xl text-slate-300 max-w-md mx-auto">
          Manage your wholesale rates effortlessly and securely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Owner Card */}
        <Link href="/owner" className="block group">
          <div className="glass-panel p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:border-purple-500/50">
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-white">Owner</h2>
            <p className="text-slate-400">
              Upload invoices, set purchase rates, and manage profit margins securely.
            </p>
          </div>
        </Link>

        {/* Worker Card */}
        <Link href="/worker" className="block group delay-100">
          <div className="glass-panel p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-500/50">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:bg-emerald-500/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-white">Salesperson</h2>
            <p className="text-slate-400">
              Search the directory to view final sales rates. Purchase rates are hidden.
            </p>
          </div>
        </Link>
      </div>

    </div>
  );
}
