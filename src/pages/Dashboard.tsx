import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Crown, 
  Calendar, 
  Settings, 
  LogOut, 
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Subscription {
  id: string;
  status: string;
  price_id: string;
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id: string;
}

interface UserProfile {
  id: string;
  nome: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        navigate("/login");
        return;
      }

      setUser(user);

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else {
        setProfile(profileData);
      }

      // Buscar assinatura
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subError) {
        console.error("Error fetching subscription:", subError);
      } else {
        setSubscription(subData);
      }

    } catch (error) {
      console.error("Error checking auth:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch (error: any) {
      toast.error("Erro ao fazer logout");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Ativa", variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      inactive: { label: "Inativa", variant: "secondary" as const, icon: XCircle, color: "text-red-600" },
      canceled: { label: "Cancelada", variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
      past_due: { label: "Em Atraso", variant: "destructive" as const, icon: Clock, color: "text-orange-600" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TrickTime</h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Perfil do Usuário */}
          <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-xl">{profile?.nome || "Usuário"}</CardTitle>
              <CardDescription>{profile?.email || user?.email}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  {subscription ? (
                    getStatusBadge(subscription.status)
                  ) : (
                    <Badge variant="secondary">Sem assinatura</Badge>
                  )}
                </div>
                
                <Separator />
                
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Assinatura */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Detalhes da Assinatura
              </CardTitle>
              <CardDescription>
                Informações sobre sua assinatura TrickTime
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {subscription ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Status da Assinatura</h4>
                      {getStatusBadge(subscription.status)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">ID do Plano</h4>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {subscription.price_id}
                      </code>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Período Atual</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Início:</span> {formatDate(subscription.current_period_start)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Fim:</span> {formatDate(subscription.current_period_end)}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Customer ID</h4>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all">
                        {subscription.stripe_customer_id}
                      </code>
                    </div>
                  </div>

                  {subscription.status === 'active' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Assinatura Ativa</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Você tem acesso completo a todas as funcionalidades do TrickTime.
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma assinatura encontrada
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Você não possui uma assinatura ativa no momento.
                  </p>
                  <Button 
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  >
                    Ver Planos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Funcionalidades */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Funcionalidades TrickTime
              </CardTitle>
              <CardDescription>
                Explore tudo que o TrickTime tem a oferecer
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Agendamentos", desc: "Gerencie seus compromissos", icon: Calendar },
                  { title: "Pacientes", desc: "Cadastro de pacientes", icon: User },
                  { title: "Relatórios", desc: "Análises e métricas", icon: Shield },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                  >
                    <feature.icon className="h-8 w-8 text-purple-600 mb-2" />
                    <h4 className="font-medium text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}