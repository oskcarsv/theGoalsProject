import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Shield,
  Users,
  Target,
  TrendingUp,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import type { Profile } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Verify admin role
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  const profile = profileData as { role: string } | null;

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  // Get stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalMacroGoals } = await supabase
    .from('macro_goals')
    .select('*', { count: 'exact', head: true });

  const { count: totalMicroGoals } = await supabase
    .from('micro_goals')
    .select('*', { count: 'exact', head: true });

  const { count: completedMicroGoals } = await supabase
    .from('micro_goals')
    .select('*', { count: 'exact', head: true })
    .eq('completed', true);

  const completionRate =
    totalMicroGoals && totalMicroGoals > 0
      ? Math.round((completedMicroGoals || 0 / totalMicroGoals) * 100)
      : 0;

  // Get recent users
  const { data: recentUsersData } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const recentUsers = (recentUsersData || []) as Profile[];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold text-slate-900">
            Panel de Administración
          </h1>
        </div>
        <p className="text-slate-600">
          Vista general de la plataforma y gestión de usuarios
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Usuarios Registrados"
          value={totalUsers || 0}
          color="bg-blue-500"
        />
        <StatCard
          icon={<Target className="h-6 w-6" />}
          label="Metas Anuales"
          value={totalMacroGoals || 0}
          color="bg-purple-500"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          label="Metas Semanales"
          value={totalMicroGoals || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="Tasa de Completado"
          value={`${completionRate}%`}
          color="bg-amber-500"
        />
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">
            Usuarios Recientes
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Total: {totalUsers} usuarios
          </span>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Usuario
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Metas
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Rol
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Registro
                </th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((userProfile) => (
                <tr
                  key={userProfile.id}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        {userProfile.avatar_url ? (
                          <img
                            src={userProfile.avatar_url}
                            alt={userProfile.full_name || 'Usuario'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-slate-600">
                            {getInitials(userProfile.full_name || 'U')}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-slate-900">
                        {userProfile.full_name || 'Sin nombre'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{userProfile.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        userProfile.role === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {userProfile.role === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        userProfile.onboarding_completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {userProfile.onboarding_completed ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {new Date(userProfile.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 ${color} items-center justify-center rounded-xl text-white`}
          >
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
