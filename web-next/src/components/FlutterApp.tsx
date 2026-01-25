'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export interface FlutterAppProps {
  /** Unique ID for the Flutter app instance */
  id: string;
  /** Width of the Flutter app container */
  width?: string | number;
  /** Height of the Flutter app container */
  height?: string | number;
  /** Additional CSS classes */
  className?: string;
  /** Flutter app configuration */
  config?: {
    assetBase?: string;
    canvasKitBaseUrl?: string;
    renderer?: 'canvaskit' | 'html';
  };
  /** Callback when Flutter app is loaded */
  onLoad?: () => void;
  /** Callback when Flutter app encounters an error */
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    _flutter?: any;
    flutterConfiguration?: any;
  }
}

export default function FlutterApp({
  id,
  width = '100%',
  height = '100%',
  className = '',
  config = {},
  onLoad,
  onError,
}: FlutterAppProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flutterAppRef = useRef<any>(null);
  const isLoadingRef = useRef(false);

  const defaultConfig = {
    assetBase: '/flutter-assets/',
    canvasKitBaseUrl: '/flutter-assets/canvaskit/',
    renderer: 'canvaskit' as const,
    ...config,
  };

  const loadFlutterApp = useCallback(async () => {
    if (isLoadingRef.current || !containerRef.current) return;

    isLoadingRef.current = true;

    try {
      // Set Flutter configuration
      window.flutterConfiguration = {
        assetBase: defaultConfig.assetBase,
        canvasKitBaseUrl: defaultConfig.canvasKitBaseUrl,
      };

      // Load Flutter bootstrap script
      if (!window._flutter) {
        const script = document.createElement('script');
        script.src = `${defaultConfig.assetBase}flutter_bootstrap.js`;
        script.async = true;

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        // Wait for Flutter to be available
        let attempts = 0;
        while (!window._flutter && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
      }

      // Initialize Flutter app
      if (window._flutter && window._flutter.loader) {
        const app = await window._flutter.loader.load({
          config: {
            entrypointBaseUrl: defaultConfig.assetBase,
            canvasKitBaseUrl: defaultConfig.canvasKitBaseUrl,
          }
        });

        // Mount Flutter app to the container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          await app.mount(containerRef.current);
          flutterAppRef.current = app;

          onLoad?.();
        }
      } else {
        throw new Error('Flutter failed to load');
      }
    } catch (error) {
      console.error('Failed to load Flutter app:', error);
      onError?.(error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [id, defaultConfig, onLoad, onError]);

  useEffect(() => {
    loadFlutterApp();

    // Cleanup function
    return () => {
      if (flutterAppRef.current) {
        try {
          flutterAppRef.current.unmount?.();
        } catch (error) {
          console.warn('Error unmounting Flutter app:', error);
        }
        flutterAppRef.current = null;
      }
    };
  }, [loadFlutterApp]);

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <div
      ref={containerRef}
      className={`flutter-app-container ${className}`}
      style={containerStyle}
      data-flutter-id={id}
    >
      {/* Loading placeholder */}
      <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading Flutter App...</p>
        </div>
      </div>
    </div>
  );
}

// Hook for Flutter communication
export function useFlutterCommunication(flutterId: string) {
  const sendMessage = useCallback((message: any) => {
    if (typeof window !== 'undefined' && window._flutter) {
      const event = new CustomEvent('flutter-message', {
        detail: { flutterId, message }
      });
      window.dispatchEvent(event);
    }
  }, [flutterId]);

  const subscribe = useCallback((callback: (message: any) => void) => {
    if (typeof window === 'undefined') return () => { };

    const handler = (event: CustomEvent) => {
      if (event.detail.flutterId === flutterId) {
        callback(event.detail.message);
      }
    };

    window.addEventListener('flutter-response' as any, handler);

    return () => {
      window.removeEventListener('flutter-response' as any, handler);
    };
  }, [flutterId]);

  return { sendMessage, subscribe };
}