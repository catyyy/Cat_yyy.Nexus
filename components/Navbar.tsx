"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Oomph } from '@/utils/Oomph';
import nextConfig from "@/next.config";
const BASE_PATH = nextConfig.basePath || "";

const Navbar = () => {
  const pathname = usePathname();
  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const mobileNavLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isOnDarkBg, setIsOnDarkBg] = useState(false);

  useEffect(() => {
    // Determine if we are on a dark background page
    // Currently only '/about' is explicitly dark (bg-black)
    let targetIsDark = false;
    if (pathname === '/about') {
      targetIsDark = true;
    }

    // Delay the color switch to match the page exit animation duration (0.8s)
    // This ensures the navbar text remains visible against the exiting page background
    // We start the transition slightly earlier so it blends with the page fade
    const timer = setTimeout(() => {
      setIsOnDarkBg(targetIsDark);
    }, 100);

    // Update active state based on pathname immediately
    const index = pathname === '/' ? 0 : pathname === '/about' ? 1 : pathname === '/projects' ? 2 : -1;
    if (index !== -1) {
      updateNavHighlight(index);
    } else if (pathname === '/') {
       // fallback for home page if exact match fails
       updateNavHighlight(0);
    }

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // 初始化字母动画效果（仅桌面端）
    navLinksRef.current.forEach((link, index) => {
      if (link) {
        const oomph = new Oomph(link, {
          scramble: true,
          animationStartDelay: 500 * index
        });
        oomph.init();
      }
    });

    // 初始化移动端导航栏的字母动画效果
    mobileNavLinksRef.current.forEach((link, index) => {
      if (link) {
        const oomph = new Oomph(link, {
          scramble: true,
          animationStartDelay: 500 * index
        });
        oomph.init();
      }
    });
  }, []);

  const updateNavHighlight = (index: number) => {
    // 更新桌面端导航高亮
    navLinksRef.current.forEach((link, i) => {
      if (link) {
        link.parentElement?.classList.toggle('active', i === index);
      }
    });
    
    // 更新移动端导航高亮
    mobileNavLinksRef.current.forEach((link, i) => {
      if (link) {
        link.parentElement?.classList.toggle('active', i === index);
      }
    });
  };

  return (
    <>
      {/* 顶部导航栏 - 移动端只显示logo */}
       <header 
         id="header" 
        className={isOnDarkBg ? 'on-dark' : 'on-light'}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '60px',
          zIndex: 1000,
        }}
      >
        <h1 className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" scroll={false} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Image 
                src={`${BASE_PATH}/favicon.ico`} 
                alt="Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8 object-contain"
                priority
             />
            <span>.Nexus();</span>
          </Link>
        </h1>
        {/* 桌面端导航栏 */}
        <nav className="desktop-nav">
          <ul>
            <li>
              <span></span>
              <Link 
                href="/"
                className="bel"
                ref={el => { if(el) navLinksRef.current[0] = el }}
                data-chapter-index="0"
                scroll={false}
              >
                Home
              </Link>
            </li>
            <li>
              <span></span>
              <Link 
                href="/about"
                className="dis"
                ref={el => { if(el) navLinksRef.current[1] = el }}
                data-chapter-index="1"
                scroll={false}
              >
                About
              </Link>
            </li>
            <li>
              <span></span>
              <Link 
                href="/projects"
                className="ima"
                ref={el => { if(el) navLinksRef.current[2] = el }}
                data-chapter-index="2"
                scroll={false}
              >
                Projects
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* 移动端底部导航栏 */}
      <nav className={`mobile-bottom-nav ${isOnDarkBg ? 'on-dark' : 'on-light'}`}>
        <ul>
          <li>
            <span></span>
            <Link 
              href="/"
              className="bel mobile-nav-link"
              ref={el => { if(el) mobileNavLinksRef.current[0] = el }}
              data-chapter-index="0"
              scroll={false}
            >
              Home
            </Link>
          </li>
          <li>
            <span></span>
            <Link 
              href="/about"
              className="dis mobile-nav-link"
              ref={el => { if(el) mobileNavLinksRef.current[1] = el }}
              data-chapter-index="1"
              scroll={false}
            >
              About
            </Link>
          </li>
          <li>
            <span></span>
            <Link 
              href="/projects"
              className="ima mobile-nav-link"
              ref={el => { if(el) mobileNavLinksRef.current[2] = el }}
              data-chapter-index="2"
              prefetch={false}
              scroll={false}
            >
              Projects
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
