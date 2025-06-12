import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Netflix-style Starting Animation */}
      <div className="relative">
        {/* Main C Letter with Netflix-style reveal */}
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute inset-0 text-red-600 text-9xl font-black blur-2xl opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.3] }}
            transition={{ duration: 2, times: [0, 0.5, 1] }}
          >
            C
          </motion.div>
          
          {/* Main letter */}
          <motion.div
            className="relative text-red-600 text-9xl font-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            C
          </motion.div>
        </motion.div>

        {/* Netflix-style expanding circle */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-red-600/40 rounded-full"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ 
            width: [0, 400, 600],
            height: [0, 400, 600],
            opacity: [0, 0.8, 0],
          }}
          transition={{ 
            duration: 2.5,
            times: [0, 0.6, 1],
            ease: "easeOut"
          }}
        />

        {/* Secondary expanding circle */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-red-600/20 rounded-full"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ 
            width: [0, 300, 500],
            height: [0, 300, 500],
            opacity: [0, 0.6, 0],
          }}
          transition={{ 
            duration: 2.2,
            delay: 0.3,
            times: [0, 0.6, 1],
            ease: "easeOut"
          }}
        />
      </div>

      {/* Brand Name Animation - Single C followed by INEX */}
      <motion.div
        className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.8 }}
      >
        <div className="flex items-center">
          {/* Single C logo */}
          <motion.div
            className="text-red-600 text-6xl font-black mr-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            animate={{
              textShadow: [
                "0 0 20px rgba(229, 9, 20, 0.5)",
                "0 0 40px rgba(229, 9, 20, 0.8)",
                "0 0 20px rgba(229, 9, 20, 0.5)",
              ],
            }}
            transition={{ 
              textShadow: { duration: 2, repeat: Infinity },
              opacity: { duration: 0.8, delay: 2 },
              scale: { duration: 0.8, delay: 2 }
            }}
          >
            C
          </motion.div>
          
          {/* INEX with letter-by-letter animation */}
          <div className="flex">
            {['I', 'N', 'E', 'X'].map((letter, index) => (
              <motion.span
                key={index}
                className="text-6xl font-black text-white tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 2.3 + (index * 0.15),
                  ease: "easeOut"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Netflix-style Loading Progress Bar */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-800 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.2 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 1.5, 
            delay: 3.5,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Netflix-style floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -100],
              x: [0, Math.random() * 50 - 25],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Netflix-style radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-red-900/10 via-transparent to-transparent" />
      
      {/* Additional atmospheric effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      />
    </div>
  );
};

export default LoadingScreen;