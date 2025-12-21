import { useState, useRef, useEffect } from 'react';
import { Oomph } from '@/utils/Oomph';
import Image from 'next/image';
import nextConfig from '@/next.config';
import { motion, AnimatePresence, usePresence } from 'framer-motion';

const BASE_PATH = nextConfig.basePath || "";

interface CardInfo {
  title: string;
  position: { top: string; left: string };
}

const cards: CardInfo[] = [
  {
    title: "Property",
    position: { top: '27%', left: '25%' }
  },
  {
    title: "Contact",
    position: { top: '30%', left: '64%' }
  },
  {
    title: "Skills",
    position: { top: '60%', left: '65%' }
  },
  {
    title: "Profile",
    position: { top: '56%', left: '28%' }
  }
];

// 技能图标数据 - 按分类组织
const skillIconsByCategory: { [key: string]: { src: string; alt: string }[] } = {
  'Frontend': [
    { src: `${BASE_PATH}/icons/nextdotjs.svg`, alt: 'Next.js' },
    { src: `${BASE_PATH}/icons/typescript.svg`, alt: 'TypeScript' },
    { src: `${BASE_PATH}/icons/flask.svg`, alt: 'Flask' },
  ],
  'Backend': [
    { src: `${BASE_PATH}/icons/nodedotjs.svg`, alt: 'Node.js' },
    { src: `${BASE_PATH}/icons/python.svg`, alt: 'Python' },
    { src: `${BASE_PATH}/icons/googleappsscript.svg`, alt: 'GAS' },
    { src: `${BASE_PATH}/icons/cplusplus.svg`, alt: 'C++' },
  ],
  'Database': [
    { src: `${BASE_PATH}/icons/postgresql.svg`, alt: 'PostgreSQL' },
  ],
  'Infrastructure': [
    { src: `${BASE_PATH}/icons/linux.svg`, alt: 'Linux' },
    { src: `${BASE_PATH}/icons/docker.svg`, alt: 'Docker' },
    { src: `${BASE_PATH}/icons/amazonaws.svg`, alt: 'AWS' },
    { src: `${BASE_PATH}/icons/supabase.svg`, alt: 'Supabase' },
    { src: `${BASE_PATH}/icons/vercel.svg`, alt: 'Vercel' },
    { src: `${BASE_PATH}/icons/googlecloud.svg`, alt: 'Google Cloud' },
  ],
  'Dev Tools': [
    { src: `${BASE_PATH}/icons/unity.svg`, alt: 'Unity' },
    { src: `${BASE_PATH}/icons/githubcopilot.svg`, alt: 'GitHub Copilot' },
    { src: `${BASE_PATH}/icons/googlegemini.svg`, alt: 'Gemini' },
    { src: `${BASE_PATH}/icons/visualstudiocode.svg`, alt: 'VS Code' },
    { src: `${BASE_PATH}/icons/git.svg`, alt: 'Git' },
    { src: `${BASE_PATH}/icons/svn.svg`, alt: 'SVN' },
  ],
};

const skillCategories = ['Frontend', 'Backend', 'Database', 'Infrastructure', 'Dev Tools'];

interface ContactItem {
  icon: string;
  label: string;
  value: string;
  link: string;
  copyText?: string;
}

interface ContactCategory {
  title: string;
  items: ContactItem[];
}

export default function FloatingCards() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [typedIndexes, setTypedIndexes] = useState<number[]>([]);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const oomphInstances = useRef<(Oomph | null)[]>([]);
  const [isPresent, safeToRemove] = usePresence();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isPresent) {
      setActiveCard(null);
      const timer = setTimeout(() => setIsExiting(true), 400);
      
      // Call safeToRemove after animations are likely done
      const removeTimer = setTimeout(() => {
        if (safeToRemove) safeToRemove();
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [isPresent, safeToRemove]);

  const propertyContents = [
    'Cat_yyy',
    '御影(Mikage)',
    '24',
    'Tokyo',
    'Institute of Science Tokyo',
  ];

  // Skills 入场动画阶段状态
  const [skillsStage, setSkillsStage] = useState({ title: false, grid: false, icons: false, controls: false });

  // 技能分类状态
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Profile打字机内容
  const profileText = `Senior at Science Tokyo, soon-to-be game engineer.\nBorn programmer - installed OS at 8, made games at 10, won algorithm competitions at 17.\nLoves challenges and innovation, never plays it safe.\nKeen problem identifier, excels at spotting and solving issues from a programmer's lens.\nCurrently venturing into entrepreneurship.`;
  const [profileTyped, setProfileTyped] = useState('');
  const profileInterval = useRef<NodeJS.Timeout | null>(null);

  // 漂浮动画状态
  const [floatOffsets, setFloatOffsets] = useState<{x: number, y: number}[]>(() => cards.map(() => ({x: 0, y: 0})));

  // 卡片内容ref
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 跟踪窗口尺寸，避免初始渲染偏移
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [ready, setReady] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showContactFullscreen, setShowContactFullscreen] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const infoTextRefs = useRef<(HTMLElement | null)[]>([]);
  const infoOomphInstances = useRef<(Oomph | null)[]>([]);

  useEffect(() => {
    cards.forEach((_, index) => {
      if (titleRefs.current[index] && !oomphInstances.current[index]) {
        oomphInstances.current[index] = new Oomph(titleRefs.current[index]!, {
          scramble: true,
          animationStartDelay: 0
        });
      }
    });
    return () => {
      if (typingInterval.current) clearInterval(typingInterval.current);
    };
  }, []);

  useEffect(() => {
    if (activeCard === 0) {
      // Delay showing info to allow avatar to appear first
      const timer = setTimeout(() => {
        setShowInfo(true);
      }, 600); // Wait for avatar expansion/settle

      // Width expansion logic (kept for card sizing)
      setTypedIndexes(propertyContents.map(() => 0));
      let line = 0;
      if (typingInterval.current) clearInterval(typingInterval.current);
      
      typingInterval.current = setInterval(() => {
        setTypedIndexes(prev => {
          const next = [...prev];
          while (line < propertyContents.length && next[line] >= propertyContents[line].length) {
            line++;
          }
          if (line < propertyContents.length) {
            next[line] = next[line] + 1;
          }
          return next;
        });
        if (line >= propertyContents.length) {
          if (typingInterval.current) clearInterval(typingInterval.current);
        }
      }, 30);

      return () => clearTimeout(timer);
    } else {
      setShowInfo(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard]);

  // Handle Scramble Text for Info Section
  useEffect(() => {
    if (showInfo) {
      infoTextRefs.current.forEach((el, index) => {
        if (el && !infoOomphInstances.current[index]) {
           infoOomphInstances.current[index] = new Oomph(el, {
            scramble: true,
            animationStartDelay: index * 100 // Stagger effect
          });
        }
        if (infoOomphInstances.current[index]) {
          // Reset text content to ensure scramble has something to work with if needed
          // But Oomph usually handles it. We just call scrambleText.
          infoOomphInstances.current[index]?.scrambleText(800 + index * 100, false);
        }
      });
    } else {
      infoOomphInstances.current.forEach(instance => {
        instance?.unscrambleText();
      });
    }
  }, [showInfo]);

  useEffect(() => {
    // Skills 入场动画序列：标题 -> 网格背景 -> 图标 -> 底部控件
    const timer1 = setTimeout(() => setSkillsStage(prev => ({ ...prev, title: true })), 300);
    const timer2 = setTimeout(() => setSkillsStage(prev => ({ ...prev, grid: true })), 1000);
    const timer3 = setTimeout(() => setSkillsStage(prev => ({ ...prev, icons: true })), 1900);
    const timer4 = setTimeout(() => setSkillsStage(prev => ({ ...prev, controls: true })), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);



  useEffect(() => {
    // Profile 默认展开，启动打字机效果
    setProfileTyped('');
    let idx = 0;
    const timer = setTimeout(() => {
      profileInterval.current = setInterval(() => {
        idx++;
        setProfileTyped(profileText.slice(0, idx));
        if (idx >= profileText.length) {
          if (profileInterval.current) clearInterval(profileInterval.current);
        }
      }, 12);
    }, 800);

    return () => {
      clearTimeout(timer);
      if (profileInterval.current) clearInterval(profileInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 轻微漂浮动画
  useEffect(() => {
    let t = 0;
    let running = true;
    function animate() {
      if (window.innerWidth <= 768) {
        if (running) requestAnimationFrame(animate);
        return;
      }

      t += 0.028;
      setFloatOffsets(cards.map((_, i) => {
        // 增加漂浮幅度
        const ampX = 18;
        const ampY = 14;
        return {
          x: ampX * Math.sin(t + i),
          y: ampY * Math.cos(t + i * 1.3)
        };
      }));
      if (running) requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, []);

  useEffect(() => {
    function update() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setReady(true);
    }
    update();
    window.addEventListener('resize', update);
    
    // Initial expansion animation for avatar card
    const timer = setTimeout(() => {
      setActiveCard(0);
    }, 500);

    return () => {
      window.removeEventListener('resize', update);
      clearTimeout(timer);
    };
  }, []);

  const handleCardEnter = (index: number) => {
    // If hovering contact card (index 1), profile card (index 3), or skills card (index 2), do NOT set it as activeCard
    // This prevents other cards (like avatar at index 0) from shrinking
    if (index === 1 || index === 2 || index === 3) return;

    setActiveCard(index);
    if (oomphInstances.current[index]) {
      oomphInstances.current[index]?.scrambleText(800, false);
    }
  };

  const handleCardLeave = (index: number) => {
    // 移动端点击后不立即关闭，允许用户查看内容
    const isMobile = windowSize.width <= 768;
    if (isMobile) return;
    
    // 如果离开的是头像卡片、Skills 卡片或 Profile 卡片，保持展开状态
    if (index === 0 || index === 2 || index === 3) return;

    // Contact card doesn't trigger active state, so leaving it shouldn't change active state
    if (index === 1) return;
    
    // 离开其他卡片时，恢复到头像卡片展开状态
    setActiveCard(0);
    
    // 清理离开的卡片状态
    setTypedIndexes([]);
    if (typingInterval.current) clearInterval(typingInterval.current);
    if (oomphInstances.current[index]) {
      oomphInstances.current[index]?.unscrambleText();
    }
  };

  const handleCardClick = (index: number) => {
    if (index === 0 || index === 2 || index === 3) return;

    if (index === 1) {
      setShowContactFullscreen(true);
      return;
    }
    
    // 移动端点击处理：如果卡片已激活则关闭，否则激活
    const isMobile = windowSize.width <= 768;
    if (isMobile) {
      if (activeCard === index) {
        // 点击已展开的头像卡片不关闭
        if (index === 0) return;

        // 点击其他已展开卡片，恢复到头像卡片
        setActiveCard(0);
        setTypedIndexes([]);
        if (typingInterval.current) clearInterval(typingInterval.current);
        if (oomphInstances.current[index]) {
          oomphInstances.current[index]?.unscrambleText();
        }
      } else {
        handleCardEnter(index);
      }
    }
  };

  // Contact categories data
  const contactCategories: ContactCategory[] = [
    {
      title: "SNS",
      items: [
        { icon: `${BASE_PATH}/X-mark.svg`, label: "X / TWITTER", value: "@cat_yyy", link: "https://x.com/cat_yyy" },
        { icon: `${BASE_PATH}/QQ.svg`, label: "QQ", value: "@MikageNeko", link: "https://qm.qq.com/q/BOxXfDRGnu" },
      ]
    },
    {
      title: "Development",
      items: [
        { icon: `${BASE_PATH}/github-mark.svg`, label: "GITHUB", value: "@catyyy", link: "https://github.com/catyyy" },
        { icon: `${BASE_PATH}/email-mark.svg`, label: "EMAIL", value: "zongyejian@hotmail.com", link: "mailto:zongyejian@hotmail.com" },
      ]
    },
    {
      title: "Gaming",
      items: [
        { icon: `${BASE_PATH}/steam.svg`, label: "STEAM", value: "@cat_yyy", link: "https://steamcommunity.com/id/cat_yyy/" },
        { icon: `${BASE_PATH}/Battlenet.svg`, label: "BATTLENET", value: "catyyy#1913", link: "", copyText: "catyyy#1913" },
      ]
    }
  ];

  const handleCopyClick = (text: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  const isMobile = windowSize.width <= 768;

  // Lock body scroll when Contact modal is open
  useEffect(() => {
    if (showContactFullscreen) {
      document.body.style.overflow = 'hidden';
      // Also prevent scrolling on the main content container if possible
      const mainContent = document.getElementById('about');
      if (mainContent) mainContent.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const mainContent = document.getElementById('about');
      if (mainContent) mainContent.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      const mainContent = document.getElementById('about');
      if (mainContent) mainContent.style.overflow = '';
    };
  }, [showContactFullscreen]);

  return (
    <div className={`${isMobile ? 'relative min-h-screen' : 'absolute inset-0'} transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'} ${isMobile ? 'overflow-x-hidden flex flex-col items-center pt-32 pb-4' : ''}`}>
      <AnimatePresence>
        {showContactFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[900] bg-black overflow-y-auto overflow-x-hidden flex flex-col touch-auto"
            style={{ top: '60px' }}
            onTouchMove={(e) => e.stopPropagation()} // Stop propagation to prevent body scroll
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowContactFullscreen(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/50 hover:bg-[#32c8f4] hover:text-black text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-colors border border-white/20 backdrop-blur-sm z-20"
            >
              ✕
            </button>

            {/* Header with Icon and Title */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-center gap-6 pt-8 pb-4 px-4"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image 
                  src={`${BASE_PATH}/images/contact/contact-icon.png`}
                  alt="Contact"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-[#32c8f4]">CONTACT</h2>
                <div className="w-20 h-1 bg-[#ffe600] mt-2" />
              </div>
            </motion.div>

            {/* Content Section - Flexible Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 pb-8"
            >
              {/* Three Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full pb-20 md:pb-0">
                {contactCategories.map((category, catIndex) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + catIndex * 0.1 }}
                    className="flex flex-col"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-[#32c8f4]" />
                      {category.title}
                    </h3>
                    
                    <div className="space-y-3 flex-1">
                      {category.items.map((item, itemIndex) => (
                        <motion.a
                          key={itemIndex}
                          href={item.link || "javascript:void(0)"}
                          target={item.link ? "_blank" : undefined}
                          rel={item.link ? "noopener noreferrer" : undefined}
                          onClick={item.copyText ? (e) => handleCopyClick(item.copyText!, e) : undefined}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + catIndex * 0.1 + itemIndex * 0.05 }}
                          className="group relative flex items-center gap-3 bg-white/5 p-4 border border-white/10 hover:border-[#ffe600] hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="bg-white p-2 flex items-center justify-center w-12 h-12 shrink-0">
                            <Image src={item.icon} alt={item.label} width={28} height={28} className="object-contain" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-gray-400 text-[10px] font-mono mb-0.5">{item.label}</span>
                            <span className="text-white text-sm md:text-base font-bold group-hover:text-[#ffe600] transition-colors truncate">
                              {item.value}
                            </span>
                          </div>
                          {item.copyText && copiedText === item.copyText && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#32c8f4] text-black px-3 py-1 rounded text-sm font-bold whitespace-nowrap"
                            >
                              已复制!
                            </motion.div>
                          )}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* {ready && (
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          width={windowSize.width}
          height={windowSize.height}
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 5 }}
        >
          {cards.map((card, index) => {
            const el = cardRefs.current[index];
            if (!el || points.length === 0) return null;
            if (activeCard !== index) return null;
            const rect = el.getBoundingClientRect();
            const svgRect = svgRef.current?.getBoundingClientRect();
            // 检查当前scale
            let scale = 1;
            const className = el.className || '';
            if (className.includes('scale-95')) scale = 0.95;
            // 视觉左上角修正
            const cardX = (svgRect ? rect.left - svgRect.left : rect.left) + (1 - scale) * rect.width / 2;
            const cardY = (svgRect ? rect.top - svgRect.top : rect.top) + (1 - scale) * rect.height / 2;
            // 找到最近的点
            let minDist = Infinity;
            let nearest = null;
            for (const p of points) {
              const d = (p.x - cardX) ** 2 + (p.y - cardY) ** 2;
              if (d < minDist) {
                minDist = d;
                nearest = p;
              }
            }
            if (!nearest) return null;
            return (
              <line
                key={index}
                x1={cardX}
                y1={cardY}
                x2={nearest.x}
                y2={nearest.y}
                stroke="#32c8f4"
                strokeWidth={2}
                opacity={0.85}
              />
            );
          })}
        </svg>
      )} */}
      {ready && cards.map((card, index) => {
        // 计算卡片宽高
        const isActive = activeCard === index;
        
        // 桌面端定位逻辑
        let leftPos = 0, topPos = 0;
        if (!isMobile) {
          const left = windowSize.width * parseFloat(card.position.left) / 100;
          const top = windowSize.height * parseFloat(card.position.top) / 100;
          leftPos = left + (floatOffsets[index]?.x || 0);
          topPos = top + (floatOffsets[index]?.y || 0);
        }
        
        // Mobile Order: Avatar(0) -> Profile(3) -> Skills(2). Contact(1) is special.
        const mobileOrder = index === 0 ? 1 : index === 3 ? 2 : index === 2 ? 3 : 99;

        return (
          <motion.div
            key={index}
            ref={el => { cardRefs.current[index] = el; }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className={`transition-all duration-300 ${isMobile ? (index === 1 ? 'absolute' : 'relative w-[95%] max-w-[600px] mb-6') : 'absolute'}`}
            style={isMobile ? (index === 1 ? {
              // Contact card on mobile: top right corner, scaled down
              top: '90px',
              right: '5%',
              zIndex: 50,
              transform: 'scale(0.4)',
              transformOrigin: 'top right'
            } : {
              order: mobileOrder,
              zIndex: 10,
              transformOrigin: 'center top'
            }) : {
              left: leftPos,
              top: topPos,
              zIndex: isActive ? 20 : 10,
              transformOrigin: 'left top'
            }}
          >
            <div
                className={`group relative transition-all duration-300 ${
                  isMobile 
                    ? 'scale-100 opacity-100' 
                    : (isActive || index === 0 || index === 2 || index === 3
                      ? 'scale-100 opacity-100'
                      : 'scale-95 opacity-90 hover:scale-105 hover:opacity-100')
                } ${isMobile || index === 1 || index === 3 ? 'cursor-pointer' : ''}`}
                onMouseEnter={() => {
                  // Only trigger hover effect for Contact card via local state or CSS, not global activeCard
                  // For other cards, use standard behavior
                  if (index !== 1) handleCardEnter(index);
                }}
                onMouseLeave={() => {
                  if (index !== 1) handleCardLeave(index);
                }}
                onClick={() => handleCardClick(index)}
              >
                {/* Skills 标题单独框体 */}
                {index === 2 && (
                  <div 
                    className="bg-[#32c8f4] text-black px-4 py-1 text-xl font-bold inline-block mb-2"
                    style={{
                      opacity: skillsStage.title ? 1 : 0,
                      transition: 'opacity 0.5s ease-out'
                    }}
                  >
                    Skills
                  </div>
                )}
                
                <div
                  style={{
                    ...(index === 0
                      ? {
                          minWidth: `${120 + Math.min(120, (propertyContents.reduce((sum, str, i) => sum + (typedIndexes[i] || 0), 0)) * 4)}px`,
                          transition: 'min-width 0.3s cubic-bezier(0.4,0,0.2,1)'
                        }
                      : {}),
                    overflow: index === 0 ? 'visible' : 'hidden',
                    ...(index === 2 ? {
                      background: 'transparent',
                      paddingTop: 0,
                      borderBottom: 'none',
                      position: 'relative',
                      paddingBottom: '20px',
                    } : {})
                  }}
                  className={`relative transition-all duration-300 ${
                    index === 0
                      ? ''
                      : index === 1
                        ? ''
                        : index === 2
                          ? 'p-0 ' + (isMobile ? 'w-full' : (activeCard === index ? 'min-w-[240px]' : 'min-w-[120px]'))
                          : index === 3
                            ? 'bg-black/80 backdrop-blur-sm p-4 ' + (isMobile ? 'w-full' : 'min-w-[420px] max-w-[420px]')
                            : 'bg-black/80 backdrop-blur-sm p-4 ' + (activeCard === index ? (isMobile ? 'min-w-[280px]' : 'min-w-[240px]') : 'min-w-[120px]')
                  } ${isMobile ? 'max-w-full' : ''}`}
                >
                <div className={`absolute top-0 left-0 right-0 h-[2px] z-10 ${index === 0 || index === 2 ? 'hidden' : 'bg-[#32c8f4] opacity-70 group-hover:opacity-100 group-hover:h-[3px]'} transition-all`}></div>

                <h3 
                  ref={(el: HTMLHeadingElement | null) => {
                    titleRefs.current[index] = el;
                  }}
                  className={`relative text-xl font-bold mb-2 transition-colors duration-300 ${
                    index === 2 ? 'hidden' : (activeCard === index ? (index === 0 ? 'hidden' : 'text-[#32c8f4]') : (index === 0 ? 'hidden' : 'text-white'))
                  }`}
                >
                  {index === 1 ? (
                     <div className="relative w-[120px] h-[120px]">
                       <Image 
                         src={`${BASE_PATH}/images/contact/contact-icon.png`}
                         alt="Contact"
                         fill
                         className="object-cover"
                       />
                     </div>
                  ) : (
                    card.title
                  )}
                </h3>

                <div 
                  className={`transition-all duration-300 ${
                    index === 0 ? 'overflow-visible' : 'overflow-hidden'
                  } ${
                    isMobile 
                      ? 'opacity-100' 
                      : (activeCard === index && index !== 1 ? 'max-h-96 opacity-100' : (index === 0 || index === 2 || index === 3 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'))
                  }`}
                >
                  <div className={`text-gray-300 animate-fadeIn space-y-2`}
                  >
                    {index === 0 && (
                      <div 
                        className={`fade-in font-sans select-none pointer-events-none transition-all duration-300`}
                        style={{
                          transform: isMobile ? `scale(${Math.min(1, (windowSize.width * 0.95) / 430)})` : 'none',
                          transformOrigin: 'top left', // Scale from left to ensure alignment
                          marginLeft: isMobile ? `${Math.max(0, (windowSize.width - (430 * Math.min(1, (windowSize.width * 0.95) / 430))) / 2)}px` : '0' // Manual centering
                        }}
                      >
                        
                        {/* Main Layout Container */}
                        <div className="relative">
                          
                          {/* Header Box - Floating above Avatar */}
                          <div 
                            className={`absolute left-0 -top-[28px] z-50 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start ${showInfo ? 'opacity-100' : 'opacity-0'}`}
                            style={{
                              clipPath: showInfo ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
                              transition: 'clip-path 0.5s ease-out, opacity 0.5s ease-out'
                            }}
                          >
                              <div className="bg-black text-gray-400 text-[10px] font-mono leading-none px-1 py-[1px] w-full">Profiler_App</div>
                              <div className="bg-black text-gray-400 text-[10px] font-mono leading-none px-1 py-[1px] w-full">v0.2xx[beta]</div>
                          </div>

                          <div className="flex gap-3 items-start">
                            {/* Left Column: Avatar + Code */}
                            <div className="relative flex flex-col gap-0 w-[120px] shrink-0 z-20">
                              {/* Avatar Image */}
                              <div className={`relative w-[120px] h-[120px] bg-black transition-all duration-300 overflow-hidden ${'grayscale-0'}`}>
                                <Image 
                                  src={`${BASE_PATH}/avatar.jpeg`}
                                  alt="Avatar"
                                  fill
                                  className="object-cover"
                                />
                                {/* Inner Border */}
                                <div className="absolute inset-0 border-[4px] border-black pointer-events-none z-10"></div>
                              </div>
                              {/* Code Box */}
                              <div 
                                className={`bg-black text-gray-400 text-[10px] font-mono px-1 py-0.5 w-full z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 absolute -bottom-[20px] ${showInfo ? 'opacity-100' : 'opacity-0'}`}
                                style={{
                                  clipPath: showInfo ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                                  transition: 'clip-path 0.5s ease-out 0.2s, opacity 0.5s ease-out 0.2s'
                                }}
                              >
                                ***-**-****
                              </div>
                            </div>

                            {/* Right Column: Info Boxes */}
                            <div 
                              className={`flex flex-col items-start gap-0 pt-1 transition-all duration-700 ease-out pl-2 scale-[0.85] origin-top-left -ml-14 z-30 ${showInfo ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                              style={{
                                clipPath: showInfo ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
                                transition: 'clip-path 0.7s ease-out, opacity 0.7s ease-out, transform 0.7s ease-out'
                              }}
                            >
                              
                              {/* Name Box - White */}
                              <div ref={el => { infoTextRefs.current[0] = el; }} className="bg-white text-black px-4 py-1 font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2 ml-[46px] z-10 relative whitespace-nowrap">
                                Cat_yyy
                              </div>

                              {/* Main Title Box - White with Arrow */}
                              <div className="relative flex items-center filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] ml-6 z-20">
                                {/* Clip Path Container */}
                                <div className="bg-white h-[44px] flex items-center pr-6 pl-[28px] relative" style={{clipPath: 'polygon(22px 0%, 100% 0%, 100% 100%, 22px 100%, 0% 50%)'}}>
                                  <span ref={el => { infoTextRefs.current[1] = el; }} className="text-4xl font-black uppercase tracking-tighter leading-none !text-black ml-[-4px] whitespace-nowrap">MAKING GAMES</span>
                                </div>
                              </div>

                              {/* Info Row 1: Age */}
                              <div className="flex items-center bg-black text-white px-3 py-1 text-base font-bold font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-[140px] justify-between ml-[46px] z-10 relative whitespace-nowrap">
                                <span className="text-gray-400">Age:</span>
                                <span ref={el => { infoTextRefs.current[2] = el; }}>24</span>
                              </div>

                              {/* Info Row 2: Job */}
                              <div className="flex items-center bg-black text-white px-3 py-1 text-base font-bold font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-[240px] justify-between ml-[46px] z-10 relative whitespace-nowrap">
                                <span className="text-gray-400">Job:</span>
                                <span ref={el => { infoTextRefs.current[3] = el; }}>Student / Dev</span>
                              </div>

                              {/* Info Row 3: Affiliation */}
                              <div className="flex items-center bg-black text-white px-3 py-1 text-base font-bold font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-[260px] justify-between ml-[46px] z-10 relative whitespace-nowrap">
                                <span className="text-gray-400">Affiliation:</span>
                                <span ref={el => { infoTextRefs.current[4] = el; }}>Science Tokyo</span>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {index === 1 && activeCard === 1 && (
                      <div className="fade-in flex gap-4 items-center">
                        {/* Content moved to modal */}
                      </div>
                    )}
                    {index === 2 && (
                      <div className="fade-in relative">
                        {/* 主内容区域 */}
                        <div className="relative">
                          {/* 透明斜线背景 */}
                          <div 
                            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                            style={{
                              opacity: skillsStage.grid ? 1 : 0,
                              transition: 'opacity 0.8s ease-out'
                            }}
                          >
                            <svg className="w-full h-full" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                              {/* 上横线 */}
                              <line x1="0" y1="0" x2="240" y2="0" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                              {/* 下横线 */}
                              <line x1="0" y1="160" x2="240" y2="160" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                              {/* 斜线 - 保持固定角度，覆盖整个区域 */}
                              {Array.from({ length: 35 }).map((_, i) => (
                                <line key={i} x1={i * 20 - 200} y1="0" x2={i * 20 - 100} y2="160" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                              ))}
                            </svg>
                          </div>
                          <div className="relative z-10">
                            <div className={`grid gap-4 p-4 ${isMobile ? 'grid-cols-4 justify-items-center' : 'grid-cols-4'}`}>
                              {Array.from({ length: 8 }).map((_, idx) => {
                                const currentIcons = skillIconsByCategory[skillCategories[currentCategoryIndex]];
                                const icon = currentIcons[idx];
                                const iconSize = isMobile ? 56 : 44;
                                const innerIconSize = isMobile ? 44 : 36;
                                
                                return (
                                  <div 
                                    key={idx} 
                                    style={{
                                      width: iconSize, 
                                      height: iconSize, 
                                      display:'flex', 
                                      alignItems:'center', 
                                      justifyContent:'center',
                                      opacity: skillsStage.icons && icon ? 1 : 0,
                                      transform: skillsStage.icons && icon ? 'scale(1)' : 'scale(0.8)',
                                      transition: `opacity 0.3s ease-out ${idx * 0.05}s, transform 0.3s ease-out ${idx * 0.05}s`
                                    }}
                                  >
                                    {icon && (
                                      <div style={{width: iconSize, height: iconSize, background:'#fff', borderRadius:0, borderBottom:'4px solid #ffe600', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}}>
                                        <Image src={icon.src} alt={icon.alt} width={innerIconSize} height={innerIconSize} style={{width: innerIconSize, height: innerIconSize, objectFit:'contain', display:'block'}} />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        {/* 分类按钮 - 在斜线框体下方 */}
                        <div 
                          className="flex items-center justify-center gap-2 mt-2"
                          style={{
                            opacity: skillsStage.controls ? 1 : 0,
                            transform: skillsStage.controls ? 'translateY(0)' : 'translateY(-10px)',
                            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
                          }}
                        >
                          <button 
                            onClick={() => setCurrentCategoryIndex((prev) => (prev - 1 + skillCategories.length) % skillCategories.length)}
                            className="bg-[#32c8f4] text-black flex items-center justify-center font-bold hover:bg-[#ffe600] transition-all cursor-pointer"
                            style={{
                              width: skillsStage.controls ? '24px' : '0px',
                              height: '24px',
                              overflow: 'hidden',
                              transition: 'width 0.4s ease-out 0.2s, background-color 0.2s'
                            }}
                          >
                            <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" aria-hidden="true">
                              <polygon points="6,0 2,4 6,8" fill="currentColor" />
                            </svg>
                          </button>
                          <div className="bg-[#32c8f4] text-black px-4 py-1 text-xs font-bold min-w-[120px] text-center">
                            {skillCategories[currentCategoryIndex]}
                          </div>
                          <button 
                            onClick={() => setCurrentCategoryIndex((prev) => (prev + 1) % skillCategories.length)}
                            className="bg-[#32c8f4] text-black flex items-center justify-center font-bold hover:bg-[#ffe600] transition-all cursor-pointer"
                            style={{
                              width: skillsStage.controls ? '24px' : '0px',
                              height: '24px',
                              overflow: 'hidden',
                              transition: 'width 0.4s ease-out 0.2s, background-color 0.2s'
                            }}
                          >
                            <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" aria-hidden="true">
                              <polygon points="2,0 6,4 2,8" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="fade-in text-base leading-relaxed whitespace-pre-line" style={{maxHeight: isMobile ? 'none' : '50vh', wordBreak: 'break-word', overflow: isMobile ? 'visible' : 'auto'}}>
                        {profileTyped}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}