import TabsApp from './components/Fragments/TabsApp';
import { TextAnimate } from '@/components/magicui/text-animate';

function App() {
  return (
    <div className="flex flex-col justify-center p-5 ">
      <div className="flex flex-col justify-center items-center mb-5">
        <TextAnimate
          animation="slideLeft"
          by="character"
          className="text-4xl font-bold mb-1"
        >
          Image Encryption
        </TextAnimate>
        <TextAnimate
          animation="slideLeft"
          by="character"
          // once
          className="text-center text-lg hidden md:block"
        >
          Amankan gambar Anda dengan teknologi enkripsi Triple DES yang kuat. Proses enkripsi dan dekripsi dilakukan secara lokal di browser Anda.
        </TextAnimate>
      </div>
      <TabsApp />
    </div>
  );
}

export default App;
