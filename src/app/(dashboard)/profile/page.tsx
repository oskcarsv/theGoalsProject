'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Instagram,
  Linkedin,
  Edit,
  Save,
  X,
  Loader2,
  ArrowLeft,
  Camera,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Tables, UpdateTables } from '@/types/database';
import { FOCUS_AREAS } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type Profile = Tables<'profiles'>;

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    what_makes_you_different: '',
    instagram: '',
    linkedin: '',
    focus_areas: [] as string[],
    interests: [] as string[],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          const profileData = data as unknown as Profile;
          setProfile(profileData);
          setFormData({
            full_name: profileData.full_name || '',
            bio: profileData.bio || '',
            what_makes_you_different: profileData.what_makes_you_different || '',
            instagram: profileData.instagram || '',
            linkedin: profileData.linkedin || '',
            focus_areas: (profileData.focus_areas as string[]) || [],
            interests: (profileData.interests as string[]) || [],
          });
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const updateData: UpdateTables<'profiles'> = {
      full_name: formData.full_name,
      bio: formData.bio,
      what_makes_you_different: formData.what_makes_you_different,
      instagram: formData.instagram || null,
      linkedin: formData.linkedin || null,
      focus_areas: formData.focus_areas,
      interests: formData.interests,
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData as any)
      .eq('id', profile!.id);

    if (!error && profile) {
      setProfile({
        ...profile,
        full_name: formData.full_name,
        bio: formData.bio,
        what_makes_you_different: formData.what_makes_you_different,
        instagram: formData.instagram || null,
        linkedin: formData.linkedin || null,
        focus_areas: formData.focus_areas,
        interests: formData.interests,
      });
      setEditing(false);
    }

    setSaving(false);
    router.refresh();
  };

  const toggleFocusArea = (areaId: string) => {
    setFormData((prev) => ({
      ...prev,
      focus_areas: prev.focus_areas.includes(areaId)
        ? prev.focus_areas.filter((a) => a !== areaId)
        : [...prev.focus_areas, areaId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error al cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al Dashboard
        </Link>
      </Button>

      {/* Header con Avatar destacado */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-secondary p-8 md:p-12 mb-8 shadow-2xl">
        {/* Blobs animados */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-20 w-64 h-64 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white/30 shadow-2xl">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="bg-white/20 text-white text-4xl font-bold backdrop-blur-sm">
                {profile.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {editing && (
              <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </button>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            {editing ? (
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Tu nombre"
                className="text-3xl font-black bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm"
              />
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                  {profile.full_name || 'Sin nombre'}
                </h1>
                <p className="text-white/80 text-lg">{profile.email}</p>
              </>
            )}
            
            {/* Botones de acción en el header */}
            <div className="mt-4 flex gap-2 justify-center md:justify-start">
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  variant="outline"
                >
                  <Edit className="h-4 w-4" />
                  Editar Perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                    className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2 bg-white hover:bg-white/90 text-primary font-bold"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Guardar Cambios
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs para organizar contenido */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 h-auto">
          <TabsTrigger value="about" className="py-3">
            <User className="h-4 w-4 mr-2" />
            Sobre mí
          </TabsTrigger>
          <TabsTrigger value="focus" className="py-3">
            Focus
          </TabsTrigger>
          <TabsTrigger value="social" className="py-3">
            <Mail className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
        </TabsList>

        {/* Tab: Sobre mí */}
        <TabsContent value="about" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <h3 className="text-xl font-bold">Biografía</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-2">
                  <Label htmlFor="bio">Sobre mí</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Cuéntanos sobre ti, tus pasiones y qué te motiva..."
                    className="min-h-[120px]"
                  />
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio || 'No has agregado una biografía todavía. ¡Comparte algo sobre ti!'}
                </p>
              )}

              <Separator className="my-4" />

              {editing ? (
                <div className="space-y-2">
                  <Label htmlFor="what_makes_you_different">¿Qué te hace diferente?</Label>
                  <Textarea
                    id="what_makes_you_different"
                    value={formData.what_makes_you_different}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        what_makes_you_different: e.target.value,
                      })
                    }
                    placeholder="Tu superpoder único, lo que te distingue..."
                    className="min-h-[100px]"
                  />
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">✨ Lo que me hace único</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.what_makes_you_different || 'No especificado'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Focus Areas */}
        <TabsContent value="focus">
          <Card className="border-2">
            <CardHeader>
              <h3 className="text-xl font-bold">Áreas de Enfoque</h3>
              <p className="text-sm text-muted-foreground">
                Selecciona las áreas en las que quieres trabajar
              </p>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FOCUS_AREAS.map((area) => {
                    const isSelected = formData.focus_areas.includes(area.id);
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => toggleFocusArea(area.id)}
                        className={cn(
                          'relative overflow-hidden group rounded-2xl border-2 p-6 text-left transition-all hover:scale-105 hover:shadow-xl',
                          isSelected
                            ? 'border-transparent bg-gradient-to-br shadow-lg'
                            : 'border-border bg-card hover:border-primary/50'
                        )}
                        style={
                          isSelected
                            ? {
                                background: `linear-gradient(to bottom right, ${area.color}, ${area.color}dd)`,
                              }
                            : undefined
                        }
                      >
                        <div className="relative flex items-start gap-4">
                          <div
                            className={cn(
                              'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                              isSelected ? 'bg-white/20' : 'bg-muted'
                            )}
                          >
                            <area.icon
                              className={cn(
                                'h-7 w-7',
                                isSelected ? 'text-white' : 'text-foreground'
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={cn(
                                'font-bold text-lg mb-1',
                                isSelected ? 'text-white' : 'text-foreground'
                              )}
                            >
                              {area.label}
                            </h4>
                            <p
                              className={cn(
                                'text-sm',
                                isSelected ? 'text-white/90' : 'text-muted-foreground'
                              )}
                            >
                              {area.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {((profile.focus_areas as string[]) || []).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {((profile.focus_areas as string[]) || []).map((areaId) => {
                        const area = FOCUS_AREAS.find((a) => a.id === areaId);
                        if (!area) return null;
                        return (
                          <div
                            key={areaId}
                            className="relative overflow-hidden rounded-2xl border-2 border-transparent p-6 shadow-lg"
                            style={{
                              background: `linear-gradient(to bottom right, ${area.color}, ${area.color}dd)`,
                            }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                                <area.icon className="h-7 w-7 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-lg text-white mb-1">
                                  {area.label}
                                </h4>
                                <p className="text-sm text-white/90">
                                  {area.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                      <p className="text-muted-foreground">
                        No has seleccionado áreas de enfoque todavía.
                      </p>
                      <Button
                        onClick={() => setEditing(true)}
                        variant="outline"
                        className="mt-4"
                      >
                        Agregar áreas de enfoque
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Social */}
        <TabsContent value="social">
          <Card className="border-2">
            <CardHeader>
              <h3 className="text-xl font-bold">Redes Sociales</h3>
              <p className="text-sm text-muted-foreground">
                Conecta con otros a través de tus redes
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-500" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      type="text"
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram: e.target.value })
                      }
                      placeholder="@usuario"
                      className="pl-4"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      placeholder="linkedin.com/in/usuario"
                      className="pl-4"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.instagram && (
                    <a
                      href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border-2 hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-lg transition-all group bg-gradient-to-r from-pink-500/5 to-rose-500/5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-md group-hover:scale-110 transition-transform">
                        <Instagram className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">Instagram</p>
                        <p className="text-sm text-muted-foreground">{profile.instagram}</p>
                      </div>
                    </a>
                  )}
                  
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border-2 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg transition-all group bg-gradient-to-r from-blue-500/5 to-cyan-500/5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-md group-hover:scale-110 transition-transform">
                        <Linkedin className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">{profile.linkedin}</p>
                      </div>
                    </a>
                  )}
                  
                  {!profile.instagram && !profile.linkedin && (
                    <div className="text-center py-12 bg-muted/30 rounded-2xl border-2 border-dashed border-border text-muted-foreground">
                      <p>
                        No has agregado redes sociales todavía.
                      </p>
                      <Button
                        onClick={() => setEditing(true)}
                        variant="outline"
                        className="mt-4"
                      >
                        Agregar redes sociales
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email card */}
      <Card className="mt-6 border-2 bg-gradient-to-br from-muted/50 to-muted">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email de contacto</p>
              <p className="font-semibold text-foreground">{profile.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
