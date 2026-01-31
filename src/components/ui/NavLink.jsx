import React from 'react';
import { motion } from 'framer-motion';

export const NavLink = ({ item, active, onClick }) => (
    <a
        href={item.path || `#${item.id}`}
        onClick={onClick}
        className={`relative px-3 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${active ? 'text-[#7112AF] scale-105' : 'text-slate-300 hover:text-white hover:scale-105'}`}
    >
        {item.label}
        {active && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-[#7112AF]/20 rounded-lg -z-10 blur-md" />}
    </a>
);
