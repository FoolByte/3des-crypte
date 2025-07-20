import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Encrypt from '../cryption/Encrypt';
import Decrypt from '../cryption/Decrypt';

export default function TabsApp() {
  return (
    <>
      <Tabs defaultValue="enkripsi">
        <TabsList className="w-full h-15 mb-5">
          <TabsTrigger value="enkripsi">Enkripsi</TabsTrigger>
          <TabsTrigger value="dekripsi">Dekripsi</TabsTrigger>
        </TabsList>
        <TabsContent value="enkripsi">
          <Encrypt />
        </TabsContent>
        <TabsContent value="dekripsi">
          <Decrypt />
        </TabsContent>
      </Tabs>
    </>
  );
}
