import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Encrypt from './Encrypt';
import Decrypt from './Decrypt';

export default function TabsApp() {
  return (
    <>
      <Tabs defaultValue="enkripsi">
        <TabsList className="w-full h-10">
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
