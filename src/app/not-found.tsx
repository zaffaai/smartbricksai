import Link from "next/link";
import { Home, TrendingUp, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="foresight-bg min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-black text-blue-600 mb-2">404</p>
        <h1 className="text-xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          This page doesn&apos;t exist or has been moved. Head back to your portfolio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/portfolio"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Portfolio Hub
          </Link>
          <Link
            href="/dashboard/property"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4" />
            Explore Properties
          </Link>
          <Link
            href="/dashboard/foresight"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            Foresight
          </Link>
        </div>
      </div>
    </div>
  );
}
