import TabsApp from './components/Fragments/TabsApp';
import { TextAnimate } from '@/components/magicui/text-animate';
import Lottie from 'lottie-react';
import imgAnimate from '@/assets/lottieimage.json';

function App() {
  return (
    <div className="flex flex-col justify-center p-5 md:px-50">
      <div className="flex flex-col justify-center items-center mb-5 relative mt-5">
        {/* Lottie di belakang teks */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 opacity-80 pointer-events-none z-0">
          <Lottie
            animationData={imgAnimate}
            loop={true}
            autoplay={true}
          />
        </div>

        {/* Teks utama */}
        <TextAnimate
          animation="slideLeft"
          by="character"
          className="text-4xl font-bold mb-1 z-10"
        >
          Image Encryption
        </TextAnimate>

        <TextAnimate
          animation="slideLeft"
          by="character"
          className="text-center text-lg hidden md:block z-10"
        >
          Amankan gambar Anda dengan teknologi enkripsi Triple DES yang kuat. Proses enkripsi dan dekripsi dilakukan secara lokal di browser Anda.
        </TextAnimate>
      </div>

      <TabsApp />
    </div>
  );
}

export default App;
