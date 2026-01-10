import Link from 'next/link';
import { Target, Users, Trophy, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute top-40 -right-20 h-96 w-96 rounded-full bg-secondary/20 blur-[100px]" />
        </div>

        <nav className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Goals</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Link href="/signup" className="gap-2">
                  Unirse ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <Badge variant="outline" className="mb-6 animate-fade-in border-primary/20 bg-primary/5 text-primary">
            The 502 Project Ecosystem
          </Badge>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="block">Tecnología de</span>
            <span className="bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent">
              Nivel Mundial
            </span>
            <span className="block">desde Guatemala</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            Queremos potencializar Guatemala como referente de tecnología. 
            No importa si sos técnico o no, si estás creando, experimentando, o apenas aprendiendo.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/20" asChild>
              <Link href="/signup">
                Empezar a construir
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-primary/20 hover:bg-primary/5" asChild>
              <Link href="#vision">
                Conoce nuestra visión
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Vision Section */}
      <section id="vision" className="py-24 bg-muted/30 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">The 502 Project</h2>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  Creemos que desde Guatemala podemos hacer tecnología de nivel mundial.
                </p>
                <p>
                  Este es el espacio donde los emprendedores, founders y builders de Guatemala se juntan y construyen.
                </p>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/50 shadow-sm">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <p className="text-base font-medium text-foreground">
                    The Goals Project es un módulo de nuestra comunidad principal.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-background border border-border/50 shadow-lg hover:border-primary/50 transition-colors">
                  <Target className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-bold mb-2">Build</h3>
                  <p className="text-sm text-muted-foreground">Construye proyectos con impacto real.</p>
                </div>
                <div className="p-6 rounded-2xl bg-background border border-border/50 shadow-lg translate-y-8 hover:border-secondary/50 transition-colors">
                  <Users className="h-8 w-8 text-secondary mb-4" />
                  <h3 className="font-bold mb-2">Connect</h3>
                  <p className="text-sm text-muted-foreground">Conecta con otros builders y founders.</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="p-6 rounded-2xl bg-background border border-border/50 shadow-lg hover:border-yellow-500/50 transition-colors">
                  <Trophy className="h-8 w-8 text-yellow-500 mb-4" />
                  <h3 className="font-bold mb-2">Grow</h3>
                  <p className="text-sm text-muted-foreground">Crece profesionalmente y escala tus ideas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Todo lo que necesitas para alcanzar tus metas
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Una plataforma diseñada para ayudarte a definir, trackear y
              cumplir tus objetivos con el apoyo de una comunidad.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Metas Macro y Micro"
              description="Define tus objetivos anuales y divídelos en metas semanales manejables."
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Review Semanal"
              description="Revisa tu progreso cada semana con evidencias y métricas claras."
              color="text-green-500"
              bgColor="bg-green-500/10"
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title="Ranking por Metas"
              description="Compite sanamente con otros que comparten tus mismas metas."
              color="text-yellow-500"
              bgColor="bg-yellow-500/10"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Sistema de Match"
              description="Conecta con personas afines para apoyarse mutuamente."
              color="text-purple-500"
              bgColor="bg-purple-500/10"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, bgColor }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
  bgColor: string;
}) {
  return (
    <div className="group rounded-2xl border border-border p-8 transition-all hover:bg-muted/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <div className={`mb-4 inline-flex rounded-xl ${bgColor} p-3 ${color}`}>
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
