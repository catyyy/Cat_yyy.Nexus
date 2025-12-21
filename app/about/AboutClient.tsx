"use client";

import FloatingCards from "@/components/FloatingCards";
import { useEffect } from "react";

export default function AboutClient() {
  // const points = useParticleStore(state => state.points);
  
  useEffect(() => {
    // 添加 about-page 类到 body
    document.body.classList.add('about-page');
    
    // 阻止触摸滚动
    const preventScroll = (e: TouchEvent) => {
      // 移动端允许滚动
      if (window.innerWidth <= 768) return;
      e.preventDefault();
    };
    
    const preventWheel = (e: WheelEvent) => {
      // 移动端允许滚动
      if (window.innerWidth <= 768) return;
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
    <main id="about" className="relative min-h-screen bg-transparent about-page">
      <FloatingCards />
    </main>
  );
}
