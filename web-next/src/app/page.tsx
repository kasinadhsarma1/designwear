'use client';

import FlutterApp from '@/components/FlutterApp';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <FlutterApp id="flutter_main" />
        </main>
    );
}
