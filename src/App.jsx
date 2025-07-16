import TabsApp from './components/Fragments/TabsApp';
import { TextAnimate } from '@/components/magicui/text-animate';
import Lottie from 'lottie-react';
import imgAnimate from '@/assets/lottieimage.json';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <main className="flex flex-col justify-between p-5 md:px-80 min-h-screen ">
      <div>
        {/* Add theme toggle button */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Main content with animation */}
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
        </div>

        <TabsApp />
      </div>
      <footer>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">Tugas Kriptografi Khairul Iman 7 SIA 1</div>
      </footer>
    </main>
  );
}

export default App;
