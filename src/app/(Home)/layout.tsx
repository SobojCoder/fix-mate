import { Suspense } from 'react';
import Navbar from '@/components/navbar';
import React from 'react';

/* Navbar reads usePathname(), which can't resolve during prerendering on
   dynamic routes like /services/[id]. Suspense lets the static shell ship a
   same-size placeholder instead of failing the build (Next 16 cacheComponents). */
const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Suspense
                fallback={
                    <header
                        aria-hidden
                        className="sticky top-0 z-50 px-3 pt-3 sm:px-6"
                    >
                        <div className="mx-auto h-[62px] max-w-7xl rounded-2xl border border-white/10 bg-[#05070D]/90" />
                    </header>
                }
            >
                <Navbar />
            </Suspense>
            {children}
        </div>
    );
};

export default HomeLayout;
