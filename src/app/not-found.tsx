'use client';

import Link from 'next/link';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-6 py-12 text-center">
        {/* 404 Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
            <AlertCircle className="relative w-24 h-24 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-2">404</h1>
        
        {/* Subheading */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          ¡Página no encontrada!
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-lg mb-8">
          Parece que la página que buscas no existe o ha sido movida. 
          No te preocupes, podemos ayudarte a encontrar lo que necesitas.
        </p>

        {/* Quick Links */}
        <div className="space-y-3 mb-8">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Ir al Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg border border-input bg-background hover:bg-accent transition-colors font-medium text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver Atrás
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Accesos rápidos:</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              href="/goals"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Mis Objetivos
            </Link>
            <Link
              href="/review"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Review Semanal
            </Link>
            <Link
              href="/ranking"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Ranking
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Perfil
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <p className="mt-8 text-xs text-muted-foreground">
          Si crees que esto es un error, por favor contacta con soporte.
        </p>
      </div>
    </div>
  );
}
