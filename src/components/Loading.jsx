// src/components/Loading.tsx
import Lottie from 'lottie-react';
import cat from '@/assets/totoro.json';
import { useThemeToggle } from '@/hooks/useThemeToggle';

export default function Loading() {
  const { isDark } = useThemeToggle();
  const size = 128;

  return (
    <div className={`lottie-wrapper h-screen w-screen flex items-center justify-center transition-colors duration-500 ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className={`w-[${size}px] h-[${size}px] md:w-64 md:h-64 flex items-center justify-center`}>
        <Lottie
          animationData={cat}
          loop
          autoplay
        />
      </div>
    </div>
  );
}
