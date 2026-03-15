export default function DashboardLoading() {
  return (
    <div className="foresight-bg min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs text-slate-400 font-medium">Loading intelligence…</p>
      </div>
    </div>
  );
}
