'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Target,
  ArrowRight,
  ArrowLeft,
  User,
  Heart,
  Instagram,
  Linkedin,
  Loader2,
  Check,
  Laptop,
  Rocket,
  Dumbbell,
  Palette,
  Music,
  Plane,
  BookOpen,
  ChefHat,
  Camera,
  Gamepad2,
  Leaf,
  Sparkles,
  Brain,
  Crown,
  Users,
  ClipboardList,
  Repeat,
  Crosshair,
  MessageCircle,
  Wrench,
  Lightbulb,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { FOCUS_AREAS } from '@/types';
import { cn } from '@/lib/utils';
import type { UpdateTables } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

const PASSIONS = [
  { id: 'tech', label: 'Tecnología', icon: Laptop, color: 'from-blue-500 to-cyan-500' },
  { id: 'entrepreneur', label: 'Emprendimiento', icon: Rocket, color: 'from-purple-500 to-pink-500' },
  { id: 'sports', label: 'Deportes', icon: Dumbbell, color: 'from-orange-500 to-red-500' },
  { id: 'art', label: 'Arte y Diseño', icon: Palette, color: 'from-pink-500 to-rose-500' },
  { id: 'music', label: 'Música', icon: Music, color: 'from-violet-500 to-purple-500' },
  { id: 'travel', label: 'Viajes', icon: Plane, color: 'from-sky-500 to-blue-500' },
  { id: 'reading', label: 'Lectura', icon: BookOpen, color: 'from-amber-500 to-orange-500' },
  { id: 'cooking', label: 'Cocina', icon: ChefHat, color: 'from-green-500 to-emerald-500' },
  { id: 'fitness', label: 'Fitness', icon: Target, color: 'from-red-500 to-pink-500' },
  { id: 'photography', label: 'Fotografía', icon: Camera, color: 'from-slate-500 to-gray-500' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'from-indigo-500 to-blue-500' },
  { id: 'nature', label: 'Naturaleza', icon: Leaf, color: 'from-green-500 to-teal-500' },
];

const UNIQUE_TRAITS = [
  { id: 'creative', label: 'Soy creativo', icon: Sparkles },
  { id: 'analytical', label: 'Soy analítico', icon: Brain },
  { id: 'leader', label: 'Soy líder natural', icon: Crown },
  { id: 'empathetic', label: 'Soy empático', icon: Heart },
  { id: 'organized', label: 'Soy organizado', icon: ClipboardList },
  { id: 'adaptable', label: 'Me adapto fácil', icon: Repeat },
  { id: 'persistent', label: 'Soy persistente', icon: Crosshair },
  { id: 'communicator', label: 'Buen comunicador', icon: MessageCircle },
  { id: 'problem-solver', label: 'Resuelvo problemas', icon: Wrench },
  { id: 'innovative', label: 'Soy innovador', icon: Lightbulb },
];

const INTERESTS = [
  'Tecnología',
  'Deportes',
  'Lectura',
  'Música',
  'Viajes',
  'Cocina',
  'Arte',
  'Cine',
  'Gaming',
  'Fitness',
  'Meditación',
  'Emprendimiento',
  'Networking',
  'Fotografía',
  'Naturaleza',
];

interface OnboardingData {
  passions: string[];
  uniqueTraits: string[];
  focusAreas: string[];
  interests: string[];
  instagram: string;
  linkedin: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    passions: [],
    uniqueTraits: [],
    focusAreas: [],
    interests: [],
    instagram: '',
    linkedin: '',
  });

  const totalSteps = 4;

  const handleNext = () => {
    // Validation for each step
    if (step === 1 && (data.passions.length < 3 || data.uniqueTraits.length < 2)) {
      return;
    }
    if (step === 2 && data.focusAreas.length === 0) {
      return;
    }
    if (step === 3 && data.interests.length === 0) {
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const togglePassion = (passionId: string) => {
    setData((prev) => ({
      ...prev,
      passions: prev.passions.includes(passionId)
        ? prev.passions.filter((p) => p !== passionId)
        : [...prev.passions, passionId],
    }));
  };

  const toggleUniqueTrait = (traitId: string) => {
    setData((prev) => ({
      ...prev,
      uniqueTraits: prev.uniqueTraits.includes(traitId)
        ? prev.uniqueTraits.filter((t) => t !== traitId)
        : [...prev.uniqueTraits, traitId],
    }));
  };

  const toggleFocusArea = (areaId: string) => {
    setData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter((a) => a !== areaId)
        : [...prev.focusAreas, areaId],
    }));
  };

  const toggleInterest = (interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleComplete = async () => {
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // Build bio from selected items
    const passionLabels = PASSIONS
      .filter((p) => data.passions.includes(p.id))
      .map((p) => p.label);
    const traitLabels = UNIQUE_TRAITS
      .filter((t) => data.uniqueTraits.includes(t.id))
      .map((t) => t.label);

    const bio = passionLabels.length > 0
      ? `Me apasiona: ${passionLabels.join(', ')}`
      : '';
    
    const whatMakesYouDifferent = traitLabels.length > 0
      ? traitLabels.join(', ')
      : '';

    const updateData: UpdateTables<'profiles'> = {
      bio,
      what_makes_you_different: whatMakesYouDifferent,
      focus_areas: data.focusAreas,
      interests: data.interests,
      instagram: data.instagram || null,
      linkedin: data.linkedin || null,
      onboarding_completed: true,
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData as any)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-xl opacity-20"></div>
              <Target className="relative h-12 w-12 text-primary" />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Goals</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Cuéntanos sobre ti</h1>
            <p className="text-muted-foreground">
              Paso {step} de {totalSteps}
            </p>
            <div className="max-w-xs mx-auto">
              <Progress value={(step / totalSteps) * 100} className="h-2.5" />
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="space-y-8 pt-8 pb-8">
            {/* Step 1: About You */}
            {step === 1 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-3">
                  <div className="mx-auto relative w-fit">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                      <User className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">¿Qué te apasiona?</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Selecciona al menos 3 cosas que te encanten
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {PASSIONS.map((passion) => {
                    const selected = data.passions.includes(passion.id);
                    const Icon = passion.icon;
                    return (
                      <button
                        key={passion.id}
                        type="button"
                        onClick={() => togglePassion(passion.id)}
                        className={cn(
                          'group relative h-32 rounded-2xl border-2 transition-all duration-300',
                          'hover:scale-105 hover:shadow-lg',
                          selected 
                            ? 'border-transparent shadow-lg' 
                            : 'border-border hover:border-primary/30 bg-card'
                        )}
                      >
                        {selected && (
                          <div className={cn(
                            'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-10',
                            passion.color
                          )}></div>
                        )}
                        <div className="relative h-full flex flex-col items-center justify-center gap-3 p-4">
                          <div className={cn(
                            'flex h-14 w-14 items-center justify-center rounded-2xl transition-all',
                            selected 
                              ? `bg-gradient-to-br ${passion.color} shadow-md` 
                              : 'bg-muted group-hover:bg-muted/80'
                          )}>
                            <Icon className={cn(
                              'h-7 w-7 transition-colors',
                              selected ? 'text-white' : 'text-muted-foreground'
                            )} />
                          </div>
                          <span className={cn(
                            'text-sm font-medium text-center leading-tight',
                            selected ? 'text-foreground' : 'text-muted-foreground'
                          )}>{passion.label}</span>
                          {selected && (
                            <div className="absolute top-3 right-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-md">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="text-center space-y-3 mb-6">
                    <h3 className="text-xl font-bold">¿Qué te hace único?</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Selecciona al menos 2 de tus mejores cualidades
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
                    {UNIQUE_TRAITS.map((trait) => {
                      const selected = data.uniqueTraits.includes(trait.id);
                      const Icon = trait.icon;
                      return (
                        <button
                          key={trait.id}
                          type="button"
                          onClick={() => toggleUniqueTrait(trait.id)}
                          className={cn(
                            'group inline-flex items-center gap-2.5 px-5 py-3 rounded-full transition-all duration-300',
                            'hover:scale-105 hover:shadow-md',
                            selected
                              ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                              : 'bg-card border-2 border-border text-foreground hover:border-primary/50'
                          )}
                        >
                          <Icon className={cn(
                            'h-5 w-5 transition-transform group-hover:scale-110',
                            selected ? 'text-primary-foreground' : 'text-muted-foreground'
                          )} />
                          <span className="font-medium">{trait.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Focus Areas */}
            {step === 2 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-3">
                  <div className="mx-auto relative w-fit">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                      <Target className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">Áreas de enfoque</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    ¿En qué áreas quieres mejorar?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
                  {FOCUS_AREAS.map((area) => {
                    const selected = data.focusAreas.includes(area.id);
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleFocusArea(area.id)}
                        className={cn(
                          'group relative h-full p-6 rounded-2xl border-2 transition-all duration-300 text-left',
                          'hover:scale-105 hover:shadow-lg',
                          selected 
                            ? 'border-primary bg-primary/5 shadow-lg' 
                            : 'border-border hover:border-primary/50 bg-card'
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl transition-all flex-shrink-0',
                            selected 
                              ? 'bg-gradient-to-br from-primary to-secondary shadow-md' 
                              : 'bg-muted group-hover:bg-muted/80'
                          )}>
                            <area.icon className={cn('h-6 w-6', selected ? 'text-primary-foreground' : 'text-muted-foreground')} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'font-semibold text-lg',
                              selected ? 'text-primary' : 'text-foreground'
                            )}>{area.label}</p>
                          </div>
                          {selected && (
                            <div className="flex-shrink-0">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-3">
                  <div className="mx-auto relative w-fit">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                      <Heart className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">Tus intereses</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Conecta con personas que comparten tus gustos
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
                  {INTERESTS.map((interest) => {
                    const selected = data.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                          'px-6 py-3 rounded-full font-medium transition-all duration-300',
                          'hover:scale-105 hover:shadow-md',
                          selected
                            ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                            : 'bg-card border-2 border-border text-muted-foreground hover:border-primary/50'
                        )}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Social Media */}
            {step === 4 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-3">
                  <div className="mx-auto relative w-fit">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                      <Users className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">Conecta con otros</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Opcional: Comparte tus redes sociales
                  </p>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Instagram</Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                          <Instagram className="h-5 w-5 text-white" />
                        </div>
                        <Input
                          type="text"
                          value={data.instagram}
                          onChange={(e) =>
                            setData({ ...data, instagram: e.target.value })
                          }
                          className="pl-16 h-14 rounded-xl border-2 text-base"
                          placeholder="@tu_usuario"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">LinkedIn</Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                          <Linkedin className="h-5 w-5 text-white" />
                        </div>
                        <Input
                          type="text"
                          value={data.linkedin}
                          onChange={(e) =>
                            setData({ ...data, linkedin: e.target.value })
                          }
                          className="pl-16 h-14 rounded-xl border-2 text-base"
                          placeholder="linkedin.com/in/tu-perfil"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2 h-12 px-6 rounded-xl border-2 hover:scale-105 transition-transform"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Atrás
                </Button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  className="gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all text-primary-foreground"
                  disabled={
                    (step === 1 && (data.passions.length < 3 || data.uniqueTraits.length < 2)) ||
                    (step === 2 && data.focusAreas.length === 0) ||
                    (step === 3 && data.interests.length === 0)
                  }
                >
                  Siguiente
                  <ArrowRight className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleComplete}
                  disabled={loading}
                  className="gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all text-primary-foreground"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      Completar
                      <Check className="h-5 w-5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
