'use client';

import React from 'react';
import { Leaf, FlaskConical, Truck, Cpu, Thermometer, Droplet, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EarthFarmlandCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-spruce select-none">
      {/* Background glow effects - premium ambient lighting */}
      <div className="absolute top-[15%] left-[20%] w-[25rem] h-[25rem] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[20%] right-[15%] w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] bg-primary-dark/25 rounded-full blur-[90px]" />

      {/* Modern thin tech grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Floating Processing & Supply-Chain Elements */}
      <div className="absolute inset-0">
        {[
          { Icon: Leaf, left: '10%', top: '25%', size: 30, delay: 0, duration: 25, label: 'Organic Sourcing' },
          { Icon: Droplet, left: '85%', top: '15%', size: 26, delay: 2, duration: 22, label: 'Wood Pressing' },
          { Icon: FlaskConical, left: '72%', top: '65%', size: 32, delay: 5, duration: 28, label: 'Lab Testing' },
          { Icon: Truck, left: '12%', top: '70%', size: 36, delay: 1, duration: 30, label: 'Cold-Chain Dispatch' },
          { Icon: Cpu, left: '82%', top: '42%', size: 30, delay: 7, duration: 24, label: 'Central CPU' },
          { Icon: Thermometer, left: '22%', top: '45%', size: 28, delay: 3, duration: 27, label: 'Temp Controlled' },
          { Icon: ShieldCheck, left: '50%', top: '82%', size: 32, delay: 4, duration: 26, label: 'Purity Check' },
        ].map((item, index) => {
          const { Icon, left, top, size, delay, duration, label } = item;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0.05, y: 30 }}
              animate={{
                opacity: [0.06, 0.2, 0.06],
                y: [-25, 25, -25],
                rotate: [0, 90, 180, 270, 360],
                scale: [0.92, 1.05, 0.92]
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                left,
                top,
              }}
              className="text-accent-light/10 hover:text-accent-light/30 transition-colors flex flex-col items-center gap-1 group cursor-default"
            >
              <Icon size={size} strokeWidth={1.2} className="drop-shadow-[0_0_8px_rgba(189,161,87,0.1)]" />
              <span className="text-[8px] font-bold uppercase tracking-widest text-white/5 group-hover:text-white/20 transition-all font-league whitespace-nowrap">
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative Logistics Routing Paths */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M 120 220 Q 320 120 620 320 T 1120 220"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="10 10"
          animate={{ strokeDashoffset: [-20, 20] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="text-accent-light"
        />
        <motion.path
          d="M 180 580 Q 480 680 780 480 T 1280 620"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 8"
          animate={{ strokeDashoffset: [20, -20] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="text-white"
        />
      </svg>
    </div>
  );
}
