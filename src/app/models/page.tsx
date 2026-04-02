export default function ModelTelemetryPage() {
  return (
    <main className="p-8 pb-20 w-full animate-fade-in backdrop-blur-md bg-black/40 min-h-screen border-l border-zinc-900 border-r">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Inference Telemetry</h1>
        <p className="text-zinc-400 font-light text-lg">
          Local-first AI Model routing, failover rules, and utilization load.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-6xl">
        {/* LM Studio Primary */}
        <div className="bg-zinc-900/40 p-6 rounded-xl border border-green-500/30">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-white">LM Studio (Primary)</h3>
             <span className="h-3 w-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse"></span>
          </div>
          <p className="text-sm text-zinc-400 mb-1">Port: :1234</p>
          <p className="text-sm text-zinc-400 mb-4">Target: llama-3-8b-instruct</p>
          <div className="text-xs text-green-400 bg-green-500/10 inline-block px-2 py-1 rounded">Reasoning Ready</div>
        </div>

        {/* Ollama Heavy */}
        <div className="bg-zinc-900/40 p-6 rounded-xl border border-green-500/30">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-white">Ollama (Heavy)</h3>
             <span className="h-3 w-3 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
          </div>
          <p className="text-sm text-zinc-400 mb-1">Port: :11434</p>
          <p className="text-sm text-zinc-400 mb-4">Target: deepseek-coder</p>
          <div className="text-xs text-green-400 bg-green-500/10 inline-block px-2 py-1 rounded">Execution Ready</div>
        </div>

        {/* Gemini Fallback */}
        <div className="bg-zinc-900/40 p-6 rounded-xl border border-zinc-800 opacity-60 grayscale hover:grayscale-0 transition duration-300">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-white">Gemini CLI (Fallback)</h3>
             <span className="h-3 w-3 bg-zinc-600 rounded-full"></span>
          </div>
          <p className="text-sm text-zinc-400 mb-1">Port: Cloud API</p>
          <p className="text-sm text-zinc-400 mb-4">Target: gemini-3.1-pro</p>
          <div className="text-xs text-zinc-400 bg-zinc-800 inline-block px-2 py-1 rounded">Sleeping (Offline)</div>
        </div>
      </section>

      <section className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 shadow-2xl backdrop-blur-sm max-w-6xl h-96">
         <h2 className="text-xl font-medium text-white mb-4">Live GPU / Context Load Tensor Stream</h2>
         <div className="flex h-full items-center justify-center border border-zinc-800 bg-black rounded-lg relative overflow-hidden">
            <div className="text-zinc-600 flex flex-col items-center">
               <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
               <p>Awaiting OpenClaw Stream Connection</p>
            </div>
         </div>
      </section>
    </main>
  );
}
