import Lottie from 'lottie-react';
import cat from '@/assets/totoro.json';

export default function Loading() {
  const sizi = 128;
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className={`w-${sizi} h-${sizi} md:h-64 w-64 flex items-center justify-center`}>
        <Lottie
          animationData={cat}
          loop={true}
          autoplay={true}
        />
      </div>
    </div>
  );
}
