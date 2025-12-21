"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

// FrozenRouter ensures that the exiting component retains the context (and thus the route) 
// of the page it was rendering, rather than updating immediately to the new route.
// This prevents the "flash" of new content during the exit animation.
function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isAbout ? { opacity: 0, y: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={
          isHome 
            ? { opacity: 0, y: 0 } 
            : isAbout
              ? { opacity: 0, transition: { delay: 0.8, duration: 0.5 } }
              : { opacity: 0, y: -20 }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-full min-h-screen relative"
      >
        <div className="w-full min-h-screen relative">
          <FrozenRouter>{children}</FrozenRouter>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
