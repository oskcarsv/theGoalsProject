'use client';

import { 
  Palette, 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tus preferencias y cuenta
        </p>
      </div>

      <div className="grid gap-6">
        {/* Apariencia */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Apariencia</CardTitle>
            </div>
            <CardDescription>
              Personaliza cómo se ve la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === 'light' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Sun className="h-6 w-6" />
                  <span className="text-sm font-medium">Claro</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === 'dark' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Moon className="h-6 w-6" />
                  <span className="text-sm font-medium">Oscuro</span>
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === 'system' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Laptop className="h-6 w-6" />
                  <span className="text-sm font-medium">Sistema</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuenta */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Cuenta</CardTitle>
            </div>
            <CardDescription>
              Información personal y privacidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/profile">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer group">
                <div className="space-y-1">
                  <p className="font-medium group-hover:text-primary transition-colors">Editar Perfil</p>
                  <p className="text-sm text-muted-foreground">Actualiza tu nombre, bio y redes sociales</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Notificaciones (Simulado) */}
        <Card className="opacity-80">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notificaciones</CardTitle>
            </div>
            <CardDescription>
              Próximamente: Configura tus alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios Semanales</Label>
                <p className="text-sm text-muted-foreground">Recibir alerta para el review</p>
              </div>
              <Switch disabled checked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nuevos Matches</Label>
                <p className="text-sm text-muted-foreground">Alerta cuando alguien coincida contigo</p>
              </div>
              <Switch disabled checked />
            </div>
          </CardContent>
        </Card>

        {/* Sesión */}
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-500">Zona de Peligro</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full sm:w-auto gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
