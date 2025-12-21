'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

class NetworkGraph {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private particles: Particle[];
    private animationFrameId: number;
    private centerPosition: { x: number; y: number };
    
    // Color state
    private currentLineColor: { r: number, g: number, b: number, alphaMultiplier: number };
    private targetLineColor: { r: number, g: number, b: number, alphaMultiplier: number };
    
    private currentPointColor: { r: number, g: number, b: number, alpha: number };
    private targetPointColor: { r: number, g: number, b: number, alpha: number };
    
    // Background color state
    private currentBgColor: { r: number, g: number, b: number };
    private targetBgColor: { r: number, g: number, b: number };
    
    // Current theme state
    private isDark: boolean = false;

    // Store setter
    // private setPoints: (points: { x: number; y: number }[]) => void;
    // private shouldUpdateStore: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.particles = [];
        this.animationFrameId = 0;
        this.centerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        // this.setPoints = setPoints;

        // Initialize colors (default to light theme)
        // Light Theme: Lines #e5e5e5 (229, 229, 229), Points #000000 (0, 0, 0) alpha 0.6
        this.currentLineColor = { r: 229, g: 229, b: 229, alphaMultiplier: 1.0 };
        this.targetLineColor = { r: 229, g: 229, b: 229, alphaMultiplier: 1.0 };
        
        this.currentPointColor = { r: 0, g: 0, b: 0, alpha: 0.6 };
        this.targetPointColor = { r: 0, g: 0, b: 0, alpha: 0.6 };

        // Background Color
        this.currentBgColor = { r: 255, g: 255, b: 255 };
        this.targetBgColor = { r: 255, g: 255, b: 255 };

        this.init();
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    public setTheme(isDark: boolean) {
        this.isDark = isDark;
        if (isDark) {
            // Dark Theme (About Page)
            // Lines: White, Points: White
            this.targetLineColor = { r: 255, g: 255, b: 255, alphaMultiplier: 1.0 };
            this.targetPointColor = { r: 255, g: 255, b: 255, alpha: 1.0 };
            this.targetBgColor = { r: 0, g: 0, b: 0 };
        } else {
            // Light Theme (Home Page)
            // Lines: #e5e5e5 (Very Light Grey), Points: Black
            this.targetLineColor = { r: 229, g: 229, b: 229, alphaMultiplier: 1.0 };
            this.targetPointColor = { r: 0, g: 0, b: 0, alpha: 0.6 };
            this.targetBgColor = { r: 255, g: 255, b: 255 };
        }
    }

    // public setShouldUpdateStore(should: boolean) {
    //     this.shouldUpdateStore = should;
    // }

    private init(): void {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
    }

    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.createParticles();
    }

    private createParticles(): void {
        // Use the density from AboutNetworkGraph
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 25000);
        this.particles = [];

        for (let i = 0; i < numberOfParticles; i++) {
            const margin = 50;
            const x = margin + Math.random() * (this.canvas.width - 2 * margin);
            const y = margin + Math.random() * (this.canvas.height - 2 * margin);
            
            this.particles.push(new Particle(
                x,
                y,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            ));
        }
    }

    private lerp(start: number, end: number, factor: number): number {
        return start + (end - start) * factor;
    }

    private updateColor(): void {
        // Smoothly transition current color to target color
        const factor = 0.05; // Adjust speed of color transition
        
        // Update Line Color
        this.currentLineColor.r = this.lerp(this.currentLineColor.r, this.targetLineColor.r, factor);
        this.currentLineColor.g = this.lerp(this.currentLineColor.g, this.targetLineColor.g, factor);
        this.currentLineColor.b = this.lerp(this.currentLineColor.b, this.targetLineColor.b, factor);
        this.currentLineColor.alphaMultiplier = this.lerp(this.currentLineColor.alphaMultiplier, this.targetLineColor.alphaMultiplier, factor);

        // Update Point Color
        this.currentPointColor.r = this.lerp(this.currentPointColor.r, this.targetPointColor.r, factor);
        this.currentPointColor.g = this.lerp(this.currentPointColor.g, this.targetPointColor.g, factor);
        this.currentPointColor.b = this.lerp(this.currentPointColor.b, this.targetPointColor.b, factor);
        this.currentPointColor.alpha = this.lerp(this.currentPointColor.alpha, this.targetPointColor.alpha, factor);

        // Update Background Color
        this.currentBgColor.r = this.lerp(this.currentBgColor.r, this.targetBgColor.r, factor);
        this.currentBgColor.g = this.lerp(this.currentBgColor.g, this.targetBgColor.g, factor);
        this.currentBgColor.b = this.lerp(this.currentBgColor.b, this.targetBgColor.b, factor);
    }

    private drawConnections(): void {
        // Update global color state
        this.updateColor();
        
        // Fill background
        this.ctx.fillStyle = `rgb(${this.currentBgColor.r}, ${this.currentBgColor.g}, ${this.currentBgColor.b})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Base line style
        this.ctx.lineWidth = 1.2;

        // Update particles
        for (const particle of this.particles) {
            particle.vx += (Math.random() - 0.5) * 0.002;
            particle.vy += (Math.random() - 0.5) * 0.002;

            const maxSpeed = 0.15;
            const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (currentSpeed > maxSpeed) {
                particle.vx = (particle.vx / currentSpeed) * maxSpeed;
                particle.vy = (particle.vy / currentSpeed) * maxSpeed;
            }

            particle.x += particle.vx;
            particle.y += particle.vy;

            const margin = 50;
            if (particle.x < margin) { particle.x = margin; particle.vx *= -0.5; }
            if (particle.x > this.canvas.width - margin) { particle.x = this.canvas.width - margin; particle.vx *= -0.5; }
            if (particle.y < margin) { particle.y = margin; particle.vy *= -0.5; }
            if (particle.y > this.canvas.height - margin) { particle.y = this.canvas.height - margin; particle.vy *= -0.5; }
        }

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            const connections = this.particles
                .map((p, index) => ({
                    particle: p,
                    distance: Math.sqrt(Math.pow(p.x - particle.x, 2) + Math.pow(p.y - particle.y, 2)),
                    index
                }))
                .filter(conn => conn.index !== i && conn.distance < 400)
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 4);

            if (connections.length >= 2) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                for (const conn of connections) {
                    this.ctx.lineTo(conn.particle.x, conn.particle.y);
                }
                this.ctx.lineTo(connections[0].particle.x, connections[0].particle.y);
                
                const avgDistance = connections.reduce((sum, conn) => sum + conn.distance, 0) / connections.length;
                // Opacity logic
                const baseOpacity = Math.max(0.2, 0.35 * (1 - avgDistance / 400));
                const opacity = baseOpacity * this.currentLineColor.alphaMultiplier;
                
                this.ctx.strokeStyle = `rgba(${this.currentLineColor.r}, ${this.currentLineColor.g}, ${this.currentLineColor.b}, ${opacity})`;
                this.ctx.stroke();
            }

            // Draw particles
            // Halo
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.currentPointColor.r}, ${this.currentPointColor.g}, ${this.currentPointColor.b}, ${0.1 * this.currentPointColor.alpha})`;
            this.ctx.fill();
            
            // Core
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.currentPointColor.r}, ${this.currentPointColor.g}, ${this.currentPointColor.b}, ${this.currentPointColor.alpha})`;
            this.ctx.fill();
        }
    }

    private animate(): void {
        // No need to clearRect as we are filling the background with color
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawConnections();
        
        // if (this.shouldUpdateStore) {
        //     this.setPoints(this.particles.map(p => ({x: p.x, y: p.y})));
        // }
        
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    public destroy(): void {
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
    }
}

class Particle {
    constructor(
        public x: number,
        public y: number,
        public vx: number,
        public vy: number
    ) {}
}

export default function GlobalBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const graphRef = useRef<NetworkGraph | null>(null);
    const pathname = usePathname();
    // const setPoints = useParticleStore(state => state.setPoints);

    // Initialize Graph
    useEffect(() => {
        if (canvasRef.current) {
            graphRef.current = new NetworkGraph(canvasRef.current);
        }

        return () => {
            if (graphRef.current) {
                graphRef.current.destroy();
            }
        };
    }, []); // Only run once on mount

    // Handle Theme and Store Update Logic based on Path
    useEffect(() => {
        if (!graphRef.current) return;

        // Determine Theme
        const isDark = pathname === '/about'; // Only About is dark for now
        graphRef.current.setTheme(isDark);

        // Determine if we need to update store (for FloatingCards)
        // Only update when on About page to save performance
        // graphRef.current.setShouldUpdateStore(pathname === '/about');

    }, [pathname]);

    // Background Color Logic
    
    return (
        <div 
            className="fixed inset-0 w-full h-full" 
            style={{ 
                zIndex: -1,
                // We rely on canvas for background color now to sync with animation
                // backgroundColor: isDarkBg ? '#000000' : '#ffffff',
                // transition: 'background-color 0.8s ease-in-out'
            }}
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 0 }}
            />
        </div>
    );
}
