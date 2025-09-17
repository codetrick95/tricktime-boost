import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ListCheck, 
  Star, 
  MessageCircle, 
  Clock,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Smartphone,
  Bell,
  Link2,
  Shield,
  Zap,
  ArrowRight,
  Play,
  Quote,
  Award,
  Target,
  Gift,
  CreditCard,
  Loader2,
  Crown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Testimonial {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  metric: string;
}

interface Feature {
  icon: any;
  title: string;
  description: string;
  benefit: string;
}

interface Stat {
  number: string;
  label: string;
  icon: any;
}

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hora em segundos
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Contador regressivo
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Gera avatares com IA (DiceBear) com base no nome para fotos consistentes
  const getAIHeadshotUrl = (name: string) =>
    `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${encodeURIComponent(
      name
    )}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50&size=200`;

  const stats: Stat[] = [
    { number: "15.000+", label: "Profissionais ativos", icon: Users },
    { number: "89%", label: "Redução de faltas", icon: TrendingUp },
    { number: "2min", label: "Setup médio", icon: Clock },
    { number: "99.9%", label: "Uptime garantido", icon: Shield }
  ];

  const features: Feature[] = [
    {
      icon: Calendar,
      title: "Agendamento Online Inteligente",
      description: "Clientes agendam em segundos através de link personalizado. Sistema previne conflitos e otimiza sua agenda automaticamente.",
      benefit: "Economize 3h/dia em ligações"
    },
    {
      icon: Users,
      title: "Gestão Completa de Clientes",
      description: "Histórico, preferências e observações. Relacionamento personalizado que fideliza.",
      benefit: "Aumente retenção em 67%"
    },
    {
      icon: Link2,
      title: "Link Público Personalizado",
      description: "Compartilhe nas redes sociais. Clientes agendam 24/7 sem intermediários.",
      benefit: "Agendamentos 24/7"
    },
    {
      icon: Home,
      title: "Dashboard simples e poderoso",
      description: "Visão geral do seu negócio: agendamentos do dia, próximos dias e ações rápidas em um só lugar.",
      benefit: "Tudo em um painel"
    },
    {
      icon: Clock,
      title: "Horários de atendimento flexíveis",
      description: "Defina seus dias e horários de atendimento. Clientes só agendam dentro do que você permitir.",
      benefit: "Controle total da agenda"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Mariana Lopes",
      role: "Cabeleireira",
      image: "/images/testimonials/mariana.jpg",
      content: "Minha agenda passou de caótica para organizada. Agora atendo 40% mais clientes sem estresse. O TrickTime é essencial!",
      rating: 5,
      metric: "+40% clientes"
    },
    {
      name: "Ana Souza", 
      role: "Manicure e Designer de Unhas",
      image: "/images/testimonials/ana.jpg",
      content: "Comecei sozinha e hoje tenho fila de espera. O TrickTime simplificou meus agendamentos e profissionalizou meu negócio.",
      rating: 5,
      metric: "+60% agenda"
    },
    {
      name: "Dra. Camila Ribeiro",
      role: "Esteticista",
      image: "/images/testimonials/camila.jpg", 
      content: "O link de agendamento nas minhas redes sociais trouxe 200% mais agendamentos. Simplesmente revolucionário!",
      rating: 5,
      metric: "+200% agendamentos"
    }
  ];

  // Rotação de depoimentos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const socialProof = [
    "Preferido por microempreendedoras",
    "Certificado LGPD", 
    "Suporte 24/7",
    "99.9% Uptime"
  ];

  const handleCheckout = async () => {
    if (!checkoutEmail) {
      toast.error("Por favor, digite seu email");
      return;
    }

    setIsCheckoutLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email: checkoutEmail }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Abrir checkout em nova aba
        window.open(data.url, '_blank');
        setShowCheckoutModal(false);
        toast.success("Checkout iniciado! Confira a nova aba.");
      } else {
        throw new Error("URL de checkout não encontrada");
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast.error(error.message || "Erro ao iniciar checkout. Tente novamente.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="font-sans text-foreground overflow-x-hidden">
      {/* Header com CTA */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center p-4 lg:p-6 bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-border/50"
      >
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-md">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            TrickTime
          </h1>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { href: "#inicio", icon: Home, label: "Início" },
            { href: "#funcionalidades", icon: ListCheck, label: "Funcionalidades" },
            { href: "#depoimentos", icon: MessageCircle, label: "Depoimentos" },
            { href: "#precos", icon: Star, label: "Oferta" }
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.a
                key={`${item.href}-${index}`}
                href={item.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                whileHover={{ y: -2 }}
              >
                <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">{item.label}</span>
              </motion.a>
            );
          })}
        </nav>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="btn-cta hidden lg:flex" onClick={() => setShowCheckoutModal(true)}>
            Assinar TrickTime Pro
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </motion.header>

      {/* Hero Section - Otimizado para conversão */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary-light/10 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - Conteúdo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              {/* Badge de Autoridade */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center mb-6"
              >
                <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2 text-sm font-semibold">
                  <Award className="w-4 h-4 mr-2" />
                  #1 Sistema de Agendamento no Brasil
                </Badge>
              </motion.div>

              {/* Headline Principal */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl lg:text-6xl font-black mb-6 leading-tight"
              >
                Agende <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">3x mais</span>, 
                perca <span className="text-warning">89% menos</span>
              </motion.h1>

              {/* Subtítulo com Benefício */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl lg:text-2xl text-muted-foreground mb-8 font-medium"
              >
                O sistema que <strong className="text-primary">triplicou a agenda</strong> de +15.000 microempreendedoras.
                <br />
                <span className="text-accent font-bold">✅ Feito para microempreendedoras • ✅ Sistema simples e intuitivo • ✅ Link personalizado para clientes</span>
              </motion.p>

              {/* Social Proof Rápida */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mb-8"
              >
                {socialProof.map((proof, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-accent mr-2" />
                    {proof}
                  </div>
                ))}
              </motion.div>

              {/* CTA Principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="space-y-4"
              >
                <motion.button 
                  className="btn-hero w-full lg:w-auto"
                  onClick={() => setShowCheckoutModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-6 h-6 mr-3" />
                  Assinar TrickTime Pro
                </motion.button>
                
                <p className="text-sm text-muted-foreground">
                  ✅ Feito para microempreendedoras • ✅ Sistema simples e intuitivo • ✅ Link personalizado para clientes
                </p>
              </motion.div>
            </motion.div>

            {/* Lado Direito - Estatísticas Visuais */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Estatísticas em Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div
                      key={`stat-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                      className="feature-card text-center float-animation"
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      <StatIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="stat-number mb-1">{stat.number}</div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção de Autoridade e Credibilidade */}
      <section className="py-16 px-6 bg-gradient-to-r from-card to-primary-light/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto text-center"
        >
          <h3 className="text-3xl font-bold mb-6">Confiança de quem <span className="text-primary">transforma vidas</span></h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Mais de <strong className="text-primary">15.000 microempreendedoras</strong> já descobriram como o TrickTime revoluciona a gestão de consultas, 
            <strong className="text-accent"> reduzindo faltas em 89%</strong> e <strong className="text-accent">aumentando a receita em até 3x</strong>.
          </p>

          {/* Métricas de Impacto */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: "3x", label: "Mais Receita", color: "text-accent" },
              { number: "89%", label: "Menos Faltas", color: "text-primary" },  
              { number: "15k+", label: "Microempreendedoras", color: "text-primary" },
              { number: "24/7", label: "Agendamentos", color: "text-accent" }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`text-5xl font-black mb-2 ${metric.color}`}>{metric.number}</div>
                <p className="text-muted-foreground font-medium">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Funcionalidades com Benefícios Claros */}
      <section id="funcionalidades" className="py-20 px-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Target className="w-4 h-4 mr-2" />
              Funcionalidades que convertem
            </Badge>
            <h3 className="text-4xl font-bold mb-6">
              Cada funcionalidade = <span className="text-accent">Mais dinheiro no seu bolso</span>
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Não são apenas features. São <strong>soluções comprovadas</strong> que geram resultados reais para sua clínica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.div
                  key={`feature-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="feature-card group hover:bg-gradient-to-br hover:from-card hover:to-primary-light/5"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-xl mr-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <FeatureIcon className="w-6 h-6" />
                    </div>
                    <Badge className="bg-accent/10 text-accent">
                      {feature.benefit}
                    </Badge>
                  </div>
                  
                  <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h4>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Depoimentos Rotativos com Credibilidade */}
      <section id="depoimentos" className="py-20 px-6 bg-gradient-to-br from-primary-light/5 to-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
              <Quote className="w-4 h-4 mr-2" />
              Resultados reais
            </Badge>
            <h3 className="text-4xl font-bold mb-6">
              Veja como o TrickTime <span className="text-primary">mudou essas carreiras</span>
            </h3>
          </div>

          {/* Depoimento Principal Rotativo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto mb-16"
            >
              <div className="testimonial-card text-center">
                <div className="flex justify-center mb-6">
                  <img 
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const name = testimonials[currentTestimonial]?.name || 'Cliente';
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EEE&color=555&size=200`;
                    }}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20 shadow-md"
                  />
                </div>
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-2xl font-medium text-foreground mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex justify-center items-center gap-4 flex-wrap">
                  <div className="text-center">
                    <h4 className="font-bold text-lg">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verificado
                  </Badge>
                  <Badge className="bg-accent text-accent-foreground font-bold">
                    {testimonials[currentTestimonial].metric}
                  </Badge>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicadores com fotos reais */}
          <div className="flex justify-center gap-4 mt-4 overflow-x-auto px-4">
            {testimonials.map((t, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`flex flex-col items-center gap-2 focus:outline-none ${index === currentTestimonial ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}
                aria-label={`Ver depoimento de ${t.name}`}
              >
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const name = t?.name || 'Cliente';
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EEE&color=555&size=200`;
                  }}
                  className={`w-14 h-14 rounded-full object-cover ring-2 transition-all ${index === currentTestimonial ? 'ring-primary' : 'ring-transparent'}`}
                />
                <span className="text-xs text-muted-foreground font-medium max-w-[90px] text-center truncate">{t.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Oferta com Urgência e Escassez */}
      <section id="precos" className="py-20 px-6 bg-gradient-to-r from-warning/10 via-background to-accent/10 relative overflow-hidden">
        {/* Elementos de fundo para urgência */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-transparent via-warning/20 to-transparent" />
          <div className="absolute top-0 right-1/4 w-2 h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto text-center relative z-10"
        >
          {/* Badge de Urgência */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center mb-6"
          >
            <Badge className="urgency-badge text-lg px-6 py-3">
              <Gift className="w-5 h-5 mr-2" />
              OFERTA RELÂMPAGO - ÚLTIMAS HORAS
            </Badge>
          </motion.div>

          <h3 className="text-4xl lg:text-5xl font-black mb-6">
            🔥 De <span className="price-strike text-3xl">R$ 120,00</span> por apenas{" "}
            <span className="text-accent text-6xl block lg:inline">R$ 21,99/mês</span>
          </h3>
          
          <p className="text-xl text-muted-foreground mb-8">
            <strong className="text-warning">82% OFF</strong> - Apenas para os primeiros 100 profissionais
          </p>

          {/* Contador Regressivo Melhorado */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg max-w-md mx-auto mb-8"
          >
            <div className="text-sm font-bold mb-2">⏰ OFERTA EXPIRA EM:</div>
            <div className="text-4xl font-black font-mono tracking-wider">
              {timeLeft > 0 ? formatTime(timeLeft) : "ENCERRADA"}
            </div>
          </motion.div>

          {/* Lista de Benefícios da Oferta */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle, text: "✅ Feito para microempreendedoras", desc: "Pensado para o seu dia a dia" },
              { icon: Zap, text: "✅ Sistema simples e intuitivo", desc: "Aprenda em minutos" },
              { icon: Link2, text: "✅ Link personalizado para clientes", desc: "Agendamentos 24/7 com seu link" }
            ].map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <motion.div
                  key={`benefit-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 bg-card p-4 rounded-xl border border-primary/20"
                >
                  <BenefitIcon className="w-6 h-6 text-accent flex-shrink-0" />
                  <div>
                    <div className="font-bold">{benefit.text}</div>
                    <div className="text-sm text-muted-foreground">{benefit.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA da Oferta */}
          {timeLeft > 0 && (
            <motion.button
              onClick={() => setShowCheckoutModal(true)}
              className="btn-hero text-2xl px-12 py-6 mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 ASSINAR AGORA COM 82% OFF
            </motion.button>
          )}

          <p className="text-sm text-muted-foreground">
            💳 Cartão + PIX • 🔒 Pagamento 100% seguro • ⭐ Garantia de 30 dias
          </p>

          {/* Escassez Social */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-xl max-w-md mx-auto"
          >
            <div className="text-warning font-bold text-sm">⚡ RESTAM APENAS 23 VAGAS</div>
            <div className="text-xs text-muted-foreground mt-1">47 profissionais se inscreveram nas últimas 2 horas</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer Profissional */}
      <footer className="py-12 bg-primary text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-foreground text-primary p-2 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-black">TrickTime</h4>
              </div>
              <p className="text-primary-foreground/80 text-sm">
                A solução completa para profissionais da saúde que querem agendar mais e perder menos.
              </p>
            </div>

            <div>
              <h5 className="font-bold mb-4">Produto</h5>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><a href="#funcionalidades" className="hover:text-primary-foreground transition-colors">Funcionalidades</a></li>
                <li><a href="#precos" className="hover:text-primary-foreground transition-colors">Preços</a></li>
                <li><a href="#depoimentos" className="hover:text-primary-foreground transition-colors">Depoimentos</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Suporte</h5>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">WhatsApp</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-8 text-center">
            <p className="text-primary-foreground/60 text-sm">
              &copy; 2025 TrickTime - Todos os direitos reservados
            </p>
          </div>
        </motion.div>
      </footer>

      {/* Modal de Checkout */}
      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Finalizar Assinatura
            </DialogTitle>
            <DialogDescription>
              Digite seu email para prosseguir com o checkout seguro
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="checkout-email">Email</Label>
              <Input
                id="checkout-email"
                type="email"
                placeholder="seu@email.com"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-green-50 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-900">TrickTime Pro</span>
                <Badge className="bg-green-100 text-green-800 text-xs">82% OFF</Badge>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Plano mensal:</span>
                  <span className="line-through text-gray-400">R$ 120,00</span>
                </div>
                <div className="flex justify-between font-bold text-green-600">
                  <span>Valor promocional:</span>
                  <span>R$ 21,99/mês</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleCheckout}
              disabled={isCheckoutLoading || !checkoutEmail}
              className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
              size="lg"
            >
              {isCheckoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Prosseguir para Pagamento
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              Pagamento processado pelo Stripe • Ambiente 100% seguro
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}