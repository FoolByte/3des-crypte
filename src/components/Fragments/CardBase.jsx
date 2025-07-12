import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CardBase({ title = 'Card Title', children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
