import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
            setIsHovering(true);
        } else {
            setIsHovering(false);
        }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
        window.removeEventListener('mousemove', updateMousePosition);
        window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-indigo-500 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{ 
            x: mousePosition.x - 6, 
            y: mousePosition.y - 6,
            scale: isHovering ? 0 : 1
        }}
        transition={{ type: 'spring', stiffness: 1000, damping: 28, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-indigo-400 rounded-full pointer-events-none z-[9998] hidden md:block mix-blend-difference"
        animate={{ 
            x: mousePosition.x - 20, 
            y: mousePosition.y - 20,
            scale: isHovering ? 1.5 : 1,
            backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            borderColor: isHovering ? 'rgba(99, 102, 241, 0)' : 'rgba(99, 102, 241, 1)'
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
      />
    </>
  );
};

export default CustomCursor;