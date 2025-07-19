import { Button } from '@/components/ui/Button';

export default function BtnClear({ resetForm }) {
  return <Button onClick={resetForm}>Clear</Button>;
}
