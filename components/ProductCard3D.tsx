import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ProductCard3D = ({ children, index = 0, className = "" }: any) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [0, 1], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [0, 1], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    
    x.set(relX);
    y.set(relY);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-shadow border border-slate-100 group relative z-10 hover:z-50 ${className}`}
    >
      <div 
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} 
        className="h-full w-full relative"
      >
        {children}
      </div>
    </motion.div>
  );
};

export default ProductCard3D;
