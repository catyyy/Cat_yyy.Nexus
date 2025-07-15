"use client";

import { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import Navbar from "@/components/Navbar";
import NetworkGraphComponent from "@/components/NetworkGraph";
import { Oomph } from "@/utils/Oomph";
import nextConfig from "@/next.config";
const BASE_PATH = nextConfig.basePath || "";

const TITLES = ["Full-stack Engineer", "Tech Enthusiast", "Continuous Learner"];

export default function Home() {
  const [titleIndex, setTitleIndex] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const oomphRef = useRef<Oomph | null>(null);

  useEffect(() => {
    // 添加 home-page 类到 body
    document.body.classList.add('home-page');
    
    // 清理函数，组件卸载时移除类
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  useEffect(() => {
    if (titleRef.current && !oomphRef.current) {
      oomphRef.current = new Oomph(titleRef.current, {
        scramble: true,
        animationStartDelay: 0
      });
    }

    const intervalId = setInterval(() => {
      if (oomphRef.current && titleRef.current) {
        const nextIndex = (titleIndex + 1) % TITLES.length;
        const nextText = TITLES[nextIndex];
        
        // 清除现有的动画并重置状态
        if (oomphRef.current.isInScrambledState()) {
          oomphRef.current.unscrambleText();
        }
        
        // 更新文本并开始新的动画，使用更温和的动画时长
        oomphRef.current.updateText(nextText);
        oomphRef.current.scrambleText(800, true);  // 减少动画时长到800ms使其更流畅
        
        // 延迟更新状态和显示文本
        setTimeout(() => {
          setTitleIndex(nextIndex);
          if (titleRef.current) {
            titleRef.current.innerText = nextText;
          }
          // 重置乱码状态
          if (oomphRef.current) {
            oomphRef.current.unscrambleText();
          }
        }, 800);  // 对应减少后的动画时长
      }
    }, 4000);  // 保持相同的切换间隔

    return () => clearInterval(intervalId);
  }, [titleIndex]);

  return (
    <main className="relative min-h-screen">
      <div>
        <section id="home" className="min-h-screen relative">
          <div className="avatar-container">
            <div className="avatar-frame">
              <Image 
                src={`${BASE_PATH}/avatar.jpeg`}
                alt="Cat_yyy's avatar"
                width={200}
                height={200}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div className="intro-text">
              <h2 className="text-4xl font-bold">Cat_yyy</h2>
              <h3 ref={titleRef}>{TITLES[titleIndex]}</h3>
              <p className="text-xs font-bold" style={{ whiteSpace: 'nowrap' }}>
                Welcome to My personal website.
                <span className="wave" style={{ display: 'inline-block', marginLeft: '8px' }}>
                  👋🏼
                </span>
              </p>
            </div>
          </div>
          <div className="network-container">
            <Navbar />
            <NetworkGraphComponent />
          </div>
        </section>
      </div>
    </main>
  );
}
