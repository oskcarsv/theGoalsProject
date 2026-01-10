'use client';

import { useState } from 'react';
import { ClipboardCheck, Check, Share2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyReportButtonProps {
  completedGoals: number;
  totalGoals: number;
  completionRate: number;
  goals: { title: string; completed: boolean }[];
  weekNumber: number;
}

export default function CopyReportButton({
  completedGoals,
  totalGoals,
  completionRate,
  goals,
  weekNumber,
}: CopyReportButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const completedList = goals
      .filter((g) => g.completed)
      .map((g) => `✅ ${g.title}`)
      .join('\n');
    const pendingList = goals
      .filter((g) => !g.completed)
      .map((g) => `⏳ ${g.title}`)
      .join('\n');

    // Generate trend indicator
    const trendEmoji = completionRate >= 70 ? '📈' : completionRate >= 50 ? '➡️' : '📉';
    const performanceMessage = 
      completionRate >= 90 ? '¡Excelente semana! 🌟' :
      completionRate >= 70 ? 'Buena semana. Vamos por más 💪' :
      completionRate >= 50 ? 'Semana regular. Identificar bloques 🤔' :
      'Semana desafiante. ¿Qué no funcionó? 🔍';

    const report = `*REPORTE SEMANAL - SEMANA ${weekNumber}* ${trendEmoji}

*PROGRESO:*
${completionRate}% completado (${completedGoals}/${totalGoals} metas)
${performanceMessage}

*✅ LOGROS (${completedGoals}):*
${completedList || 'Ninguno aún'}

*⏳ PENDIENTES (${totalGoals - completedGoals}):*
${pendingList || '¡Todo listo! 🎉'}

_Enviado desde The Goals Project 🎯_`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button 
      onClick={handleCopy}
      className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-lg transition-all"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          ¡Copiado!
        </>
      ) : (
        <>
          <ClipboardCheck className="h-4 w-4" />
          Copiar reporte para WhatsApp
        </>
      )}
    </Button>
  );
}
