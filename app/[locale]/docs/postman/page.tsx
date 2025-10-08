"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Download, FileJson, Sparkles, CheckCircle2, ExternalLink } from "lucide-react";

export default function PostmanPage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${locale}`} className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Fetchify
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href={`/${locale}/docs`} className="text-slate-300 hover:text-white transition-colors">
                ← Back to Documentation
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6">
              <FileJson size={18} />
              <span className="text-sm font-medium">Postman Collection</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Fetchify API Postman Collection
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Import our pre-configured Postman collection and start testing the API in seconds
            </p>
          </div>

          {/* Download Card */}
          <div className="card-modern p-8 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
                <FileJson className="text-white" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Download Collection</h2>
                <p className="text-slate-400">Complete Fetchify API collection for Postman</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-green-400" size={20} />
                <span>All API endpoints pre-configured</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-green-400" size={20} />
                <span>Environment variables for easy testing</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-green-400" size={20} />
                <span>Example requests and responses</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="text-green-400" size={20} />
                <span>Authentication already set up</span>
              </div>
            </div>

            <a
              href="/postman_collection.json"
              download="fetchify_api_collection.json"
              className="btn-primary inline-flex items-center gap-2 w-full justify-center"
            >
              <Download size={20} />
              Download Postman Collection
            </a>
          </div>

          {/* How to Import */}
          <div className="card-modern p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">How to Import</h3>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">Download the Collection</h4>
                  <p className="text-slate-300">Click the download button above to get the JSON file.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">Open Postman</h4>
                  <p className="text-slate-300">Launch Postman on your desktop or web browser.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">Import Collection</h4>
                  <p className="text-slate-300 mb-3">Click "Import" in Postman and select the downloaded JSON file.</p>
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
                    <code className="text-blue-400 text-sm">Collections → Import → Upload Files → Select fetchify_api_collection.json</code>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">Configure Variables</h4>
                  <p className="text-slate-300 mb-3">Set your API key in the collection variables:</p>
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-700">
                    <code className="text-green-400 text-sm">api_key = YOUR_API_KEY_HERE</code>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-2">Start Testing!</h4>
                  <p className="text-slate-300">You're ready to make API calls. Try the "Extract Product Data" request first.</p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="card-modern p-8 mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">What's Included</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <h4 className="font-bold text-white mb-3">📦 Products Endpoints</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Extract Product Data (Header Auth)</li>
                  <li>• Extract Product Data (URL Auth)</li>
                </ul>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <h4 className="font-bold text-white mb-3">💳 Credits Endpoints</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Check Credit Balance</li>
                </ul>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <h4 className="font-bold text-white mb-3">🔑 Pre-configured Auth</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• X-API-Key header authentication</li>
                  <li>• URL parameter authentication</li>
                </ul>
              </div>

              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                <h4 className="font-bold text-white mb-3">📝 Example Responses</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Success responses (200)</li>
                  <li>• Error responses (401, 402, 500)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              href={`/${locale}/docs`}
              className="card-modern p-6 hover:border-blue-500/50 transition-all group"
            >
              <div className="text-blue-400 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">Full Documentation</h4>
              <p className="text-slate-400 text-sm mb-3">Complete API reference with examples</p>
              <span className="text-blue-400 text-sm group-hover:underline">Read docs →</span>
            </Link>

            <a 
              href="/docs/API_QUICKSTART.md"
              target="_blank"
              className="card-modern p-6 hover:border-violet-500/50 transition-all group"
            >
              <div className="text-violet-400 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">Quick Start Guide</h4>
              <p className="text-slate-400 text-sm mb-3">Get started in 5 minutes</p>
              <span className="text-violet-400 text-sm group-hover:underline">Get started →</span>
            </a>

            <Link 
              href={`/${locale}/dashboard/playground`}
              className="card-modern p-6 hover:border-emerald-500/50 transition-all group"
            >
              <div className="text-emerald-400 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h4 className="font-bold text-white mb-2">API Playground</h4>
              <p className="text-slate-400 text-sm mb-3">Test the API in your browser</p>
              <span className="text-emerald-400 text-sm group-hover:underline">Try now →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-800/50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Fetchify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
