'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-screen w-screen bg-sunset flex items-center justify-center p-8 font-mono text-white selection:bg-charcoal selection:text-sunset">
            <div className="max-w-xl w-full space-y-8">
                <div className="text-8xl">:(</div>

                <div className="space-y-4">
                    <h1 className="text-2xl bg-white text-sunset inline-block px-2">SYSTEM_ERROR: 404_ROUTE_NOT_FOUND</h1>
                    <p className="border-l-2 border-white/30 pl-4 leading-relaxed opacity-90">
                        A fatal exception 404 has occurred at 0028:C0011E36 in VXD VMM(01) +
                        00010E36. The current application will be terminated.
                    </p>
                    <ul className="list-disc list-inside opacity-70 text-sm space-y-1 pt-4">
                        <li>Press any key to terminate the current application.</li>
                        <li>Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
                    </ul>
                </div>

                <div className="pt-8 text-center">
                    <Link
                        href="/"
                        className="inline-block px-8 py-3 border-2 border-white hover:bg-white hover:text-sunset transition-colors uppercase tracking-widest text-sm"
                    >
                        Reboot System
                    </Link>
                </div>
            </div>
        </div>
    );
}
