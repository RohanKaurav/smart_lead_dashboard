function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
          Smart Leads Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Phase 0 complete
        </h1>
        <p className="mt-3 text-slate-600">
          React + TypeScript + Tailwind are wired up. Next up: authentication and
          leads API.
        </p>
        <div className="mt-6 rounded-lg bg-slate-50 p-4 text-left text-sm text-slate-700">
          <p className="font-medium text-slate-900">Verify the API</p>
          <code className="mt-2 block break-all text-indigo-700">
            GET {import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'}
            /health
          </code>
        </div>
      </div>
    </div>
  )
}

export default App
