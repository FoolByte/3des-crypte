import Lottie from 'lottie-react';
import cat from '@/assets/totoro.json';

export default function Loading2() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="w-32 h-32 md:w-64 md:h-64 flex items-center justify-center">
        <Lottie
          animationData={cat}
          loop
          autoplay
        />
      </div>
    </div>
  );
}
