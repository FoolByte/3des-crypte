import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeToggle } from '@/hooks/useThemeToggle';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeToggle();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {isDark ? <Sun className="h-5 w-5 transition-all" /> : <Moon className="h-5 w-5 transition-all" />}
    </Button>
  );
}
