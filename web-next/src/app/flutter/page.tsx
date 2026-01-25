'use client';

import { useState } from 'react';

export default function FlutterIntegrationPage() {
  const [isFlutterLoaded, setIsFlutterLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Flutter + Next.js Integration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your Flutter app running seamlessly within Next.js
          </p>
        </div>

        {/* Status Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Integration Status
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isFlutterLoaded ? '✅ Flutter app loaded successfully' : '⏳ Loading Flutter app...'}
              </p>
            </div>
            <div className="flex space-x-2">
              <a
                href="/flutter-assets"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Open Full Flutter App
              </a>
              <a
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>

        {/* Flutter App Container - Using iframe for perfect compatibility */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Flutter App (DesignWear)
            </h2>
            <a
              href="/flutter-assets"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Open in New Tab
            </a>
          </div>
          <div style={{ height: '80vh' }}>
            <iframe
              src="/flutter-assets"
              width="100%"
              height="100%"
              frameBorder="0"
              title="Flutter DesignWear App"
              onLoad={() => setIsFlutterLoaded(true)}
              style={{
                border: 'none',
                borderRadius: '0 0 8px 8px',
              }}
              allow="cross-origin-isolated"
            />
          </div>
        </div>

        {/* Integration Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Integration Details
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Framework Integration</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>✅ Flutter Web App embedded in Next.js</li>
                  <li>✅ Shared API endpoints between Flutter and React</li>
                  <li>✅ TypeScript types mirroring Dart models</li>
                  <li>✅ Unified development workflow</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Available Endpoints</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li><code>/api/products</code> - Product data</li>
                  <li><code>/api/categories</code> - Category data</li>
                  <li><code>/api/flutter</code> - Flutter communication</li>
                  <li><code>/api/health</code> - System health</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}