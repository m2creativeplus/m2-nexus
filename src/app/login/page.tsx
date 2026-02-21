export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f18] text-white">
      <div className="p-8 rounded-2xl glass-card w-full max-w-md border border-[#ffffff10]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[#D4AF37] to-[#b5952f] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <span className="text-2xl font-bold text-[#0a0f18]">M2</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">M2 NEXUS Control</h1>
          <p className="text-sm text-gray-400">Restricted Sovereign Access</p>
        </div>
        
        <form className="space-y-4" action="/api/login" method="POST">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Passphrase</label>
            <input 
              type="password" 
              name="password"
              className="w-full bg-[#1e293b50] border border-[#ffffff20] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              placeholder="Enter clearance code"
              autoFocus
            />
          </div>
          <button type="submit" className="w-full py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-[#b5952f] transition-colors mt-6">
            Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
}
