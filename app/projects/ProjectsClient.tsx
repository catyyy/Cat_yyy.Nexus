"use client";

import { useEffect, useState } from "react";
import nextConfig from "@/next.config";
import Image from "next/image";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { useProjectStore } from "@/store/projectStore";

const BASE_PATH = nextConfig.basePath || "";

export function ProjectsClient() {
  const projects = useProjectStore(state => state.projects);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedId]);

  const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <main className="relative min-h-screen">
      <div>
        <section id="projects" className="min-h-screen relative">
          <div className="max-w-4xl mx-auto px-4 py-24 pb-32">
            {/* <h2 className="text-3xl font-bold mb-8">Projects</h2> */}
            {/* <h2 className="text-3xl font-bold mb-8">Projects</h2> */}
            <div className="relative w-full min-h-[600px]">
              <MotionConfig transition={{ type: "tween", duration: 0.25, ease: "circOut" }}>
                <AnimatePresence mode="popLayout">
                {!selectedId ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10"
                  >
                    <div className="flex flex-wrap gap-14 justify-center items-center h-full">
                      {projects.map((project) => (
                        <motion.div
                          layoutId={`card-container-${project.id}`}
                          key={project.id}
                          className="group relative bg-black/95 w-80 h-60 cursor-pointer transition-all duration-300 overflow-hidden select-none border-b-2 border-[#32c8f4]"
                          style={{
                            borderRadius: 0,
                            boxShadow: 'none',
                            borderLeft: 'none',
                            borderRight: 'none',
                            borderTop: 'none'
                          }}
                          onClick={() => setSelectedId(project.id)}
                          whileHover={{ scale: 1.05 }}
                        >
                          {/* 底部蓝色横条 */}
                          <motion.div
                            className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#32c8f4] opacity-70 group-hover:opacity-100 group-hover:h-[3px] transition-all"
                            style={{ borderRadius: 0 }}
                          />
                          <motion.div
                            layoutId={`card-image-container-${project.id}`}
                            style={{ position: 'relative', width: '100%', height: '148.3px', margin: 0, padding: 0 }}
                          >
                            <Image
                              src={`${BASE_PATH}${project.image}`}
                              alt={project.title}
                              fill
                              style={{
                                objectFit: 'cover',
                                borderRadius: 0,
                                margin: 0,
                                padding: 0,
                                display: 'block',
                              }}
                            />
                          </motion.div>
                          <motion.div
                            className="px-4 pt-3 pb-2"
                            layoutId={`card-content-${project.id}`}
                          >
                            <motion.h3
                              layoutId={`card-title-${project.id}`}
                              className="relative text-xl font-bold mb-2 transition-colors duration-300 text-[#32c8f4] group-hover:text-[#ffe600]"
                            >
                              {project.title}
                            </motion.h3>
                            <motion.p
                              layoutId={`card-desc-${project.id}`}
                              className="text-gray-300 text-sm line-clamp-3"
                            >
                              {project.description}
                            </motion.p>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="details"
                    layoutId={`card-container-${selectedProject!.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[900] bg-black overflow-y-auto"
                    style={{
                      top: '60px', // Below Navbar
                      borderRadius: 0,
                      border: 'none'
                    }}
                  >
                    <div className="relative w-full min-h-full flex flex-col">
                      {/* Image Section - Full Width Banner */}
                      <motion.div
                        layoutId={`card-image-container-${selectedProject!.id}`}
                        className="relative w-full h-64 md:h-[50vh] shrink-0"
                      >
                        <Image
                          src={`${BASE_PATH}${selectedProject!.detailImage || selectedProject!.image}`}
                          alt={selectedProject!.title}
                          fill
                          className="object-cover"
                          priority
                        />

                        {/* Mobile Close Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(null);
                          }}
                          className="absolute top-4 left-4 bg-black/50 hover:bg-black/80 text-white w-10 h-10 flex items-center justify-center rounded-full transition-colors z-20 md:hidden"
                        >
                          ✕
                        </button>

                        {/* Desktop Close Button - Now overlaying image top-right */}
                        <div className="absolute top-8 right-8 hidden md:flex z-20">
                          <button
                            onClick={() => setSelectedId(null)}
                            className="bg-black/50 hover:bg-[#32c8f4] hover:text-black text-white w-12 h-12 flex items-center justify-center rounded-full transition-colors border border-white/20 backdrop-blur-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>

                      {/* Content Section */}
                      <motion.div
                        layoutId={`card-content-${selectedProject!.id}`}
                        className="w-full max-w-4xl mx-auto p-8 md:p-16 flex flex-col bg-black"
                      >
                        <motion.h3
                          layoutId={`card-title-${selectedProject!.id}`}
                          className="text-4xl md:text-6xl font-bold mb-8 text-[#32c8f4]"
                        >
                          {selectedProject!.title}
                        </motion.h3>

                        <motion.div className="w-24 h-1 bg-[#ffe600] mb-8" />

                        {/* Technologies */}
                        {selectedProject!.technologies && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-wrap gap-3 mb-10"
                          >
                            {selectedProject!.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-4 py-1.5 bg-[#1a1a1a] text-[#32c8f4] text-sm md:text-base border border-[#32c8f4]/30 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </motion.div>
                        )}

                        <motion.div
                          layoutId={`card-desc-${selectedProject!.id}`}
                          className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12"
                        >
                          {selectedProject!.longDescription || selectedProject!.description}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="flex flex-wrap gap-6"
                        >
                          {selectedProject!.link! && (
                            <button
                              onClick={() => window.open(selectedProject!.link!, '_blank')}
                              className="inline-block px-8 py-4 bg-[#32c8f4] text-black font-bold text-lg tracking-wider hover:bg-[#ffe600] transition-colors duration-300"
                            >
                              VISIT PROJECT
                            </button>
                          )}

                          {selectedProject!.githubLink! && (
                            <button
                              onClick={() => window.open(selectedProject!.githubLink!, '_blank')}
                              className="inline-block px-8 py-4 border-2 border-[#32c8f4] text-[#32c8f4] font-bold text-lg tracking-wider hover:bg-[#32c8f4] hover:text-black transition-colors duration-300"
                            >
                              VISIT ON GITHUB
                            </button>
                          )}
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </MotionConfig>
            </div>
          </div>
          {/* NetworkGraph moved to GlobalBackground */}

          {/* Removed old overlay code since it's now integrated above */}
        </section>
      </div>
    </main>
  );
}
