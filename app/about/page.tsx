"use client";

import Navbar from "@/components/Navbar";
import AboutNetworkGraphComponent from "@/components/AboutNetworkGraph";
import FloatingCards from "@/components/FloatingCards";
import { useState, useEffect } from "react";

export default function About() {
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  
  useEffect(() => {
    // 添加 about-page 类到 body
    document.body.classList.add('about-page');
    
    // 阻止触摸滚动
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    
    // 添加事件监听器
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });
    
    // 清理函数，组件卸载时移除类和事件监听器
    return () => {
      document.body.classList.remove('about-page');
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventWheel);
    };
  }, []);
  
  return (
    <main id="about" className="relative min-h-screen bg-black about-page">
      <AboutNetworkGraphComponent setPoints={setPoints} />
      <FloatingCards points={points} />
      <Navbar />
    </main>
  );
}