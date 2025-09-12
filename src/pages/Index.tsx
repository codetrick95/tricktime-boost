import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  ListCheck, 
  Star, 
  MessageCircle, 
  Phone, 
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  Calendar,
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
  Gift
} from "lucide-react";

interface FormData {
  nome: string;
  empresa: string;
  telefone: string;
  whatsapp: string;
  email: string;
}

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
  const [form, setForm] = useState<FormData>({ 
    nome: "", 
    empresa: "", 
    telefone: "", 
    whatsapp: "", 
    email: "" 
  });
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hora em segundos
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
      description: "Pacientes agendam em segundos através de link personalizado. Sistema previne conflitos e otimiza sua agenda automaticamente.",
      benefit: "Economize 3h/dia em ligações"
    },
    {
      icon: Bell,
      title: "Lembretes Automáticos Personalizados", 
      description: "WhatsApp, SMS e email automáticos. Mensagens customizáveis que reduzem faltas em até 89%.",
      benefit: "Reduza faltas em 89%"
    },
    {
      icon: Users,
      title: "Gestão Completa de Pacientes",
      description: "Histórico, preferências, observações e prontuário digital. Relacionamento personalizado que fideliza.",
      benefit: "Aumente retenção em 67%"
    },
    {
      icon: Smartphone,
      title: "App Mobile Nativo",
      description: "Gerencie sua agenda onde estiver. Notificações push, sincronização em tempo real.",
      benefit: "Trabalhe de qualquer lugar"
    },
    {
      icon: Link2,
      title: "Link Público Personalizado",
      description: "Compartilhe nas redes sociais. Pacientes agendam 24/7 sem intermediários.",
      benefit: "Agendamentos 24/7"
    },
    {
      icon: Zap,
      title: "Integrações Poderosas",
      description: "Google Calendar, WhatsApp Business, sistemas de pagamento. Tudo conectado e automatizado.",
      benefit: "Automação total"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Dra. Mariana Lopes",
      role: "Fisioterapeuta",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      content: "Minha agenda passou de caótica para organizada. Agora atendo 40% mais pacientes sem estresse. O TrickTime é essencial!",
      rating: 5,
      metric: "+40% pacientes"
    },
    {
      name: "Dr. Ricardo Santos", 
      role: "Dentista",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      content: "Desde que comecei a usar, minhas faltas diminuíram 85%. Os lembretes automáticos são um diferencial incrível.",
      rating: 5,
      metric: "-85% faltas"
    },
    {
      name: "Dra. Camila Ribeiro",
      role: "Esteticista",
      image: "https://images.unsplash.com/photo-1594824475317-2d9fb32f2217?w=150&h=150&fit=crop&crop=face", 
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
    "Recomendado pelo CRM de SP",
    "Certificado LGPD", 
    "Suporte 24/7",
    "99.9% Uptime"
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Aqui você adicionaria a lógica de envio do formulário
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
          <Button className="btn-cta hidden lg:flex">
            Começar Grátis
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
                O sistema que <strong className="text-primary">triplicou a agenda</strong> de +15.000 profissionais da saúde.
                <br />
                <span className="text-accent font-bold">Reduza faltas em 89%</span> e atenda mais em menos tempo.
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-6 h-6 mr-3" />
                  Começar Teste Grátis de 14 Dias
                </motion.button>
                
                <p className="text-sm text-muted-foreground">
                  ✅ Sem cartão de crédito • ✅ Suporte completo • ✅ Cancelamento a qualquer momento
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
            Mais de <strong className="text-primary">15.000 profissionais</strong> já descobriram como o TrickTime revoluciona a gestão de consultas, 
            <strong className="text-accent"> reduzindo faltas em 89%</strong> e <strong className="text-accent">aumentando a receita em até 3x</strong>.
          </p>

          {/* Métricas de Impacto */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { number: "3x", label: "Mais Receita", color: "text-accent" },
              { number: "89%", label: "Menos Faltas", color: "text-primary" },  
              { number: "15k+", label: "Profissionais", color: "text-primary" },
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
                    <Badge className="bg-accent/10 text-accent text-xs font-bold">
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
                
                <div className="flex justify-center items-center gap-4">
                  <div>
                    <h4 className="font-bold text-lg">{testimonials[currentTestimonial].name}</h4>
                    <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                  </div>
                  <Badge className="bg-accent text-accent-foreground font-bold">
                    {testimonials[currentTestimonial].metric}
                  </Badge>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicadores */}
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-primary scale-125' : 'bg-muted'
                }`}
              />
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
              { icon: CheckCircle, text: "14 dias grátis", desc: "Teste sem risco" },
              { icon: Users, text: "Pacientes ilimitados", desc: "Sem limite de cadastros" },
              { icon: Zap, text: "Suporte prioritário", desc: "Atendimento VIP 24/7" }
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
              className="btn-hero text-2xl px-12 py-6 mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 GARANTIR MINHA VAGA COM 82% OFF
            </motion.button>
          )}

          <p className="text-sm text-muted-foreground">
            💳 Sem cartão de crédito • 🔒 Dados protegidos • ⭐ Garantia de 30 dias
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

      {/* Formulário de Contato Otimizado */}
      <section id="contato" className="py-20 px-6 bg-gradient-to-br from-background to-primary-light/5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto max-w-2xl"
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Phone className="w-4 h-4 mr-2" />
              Fale conosco
            </Badge>
            <h3 className="text-4xl font-bold mb-6">
              Pronto para <span className="text-primary">3x sua receita</span>?
            </h3>
            <p className="text-xl text-muted-foreground">
              Preencha o formulário e receba uma <strong className="text-accent">análise gratuita</strong> da sua agenda
            </p>
          </div>

          <motion.form 
            onSubmit={handleFormSubmit}
            className="space-y-6 bg-card p-8 rounded-2xl shadow-md border border-primary/10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome completo *</label>
                <Input
                  placeholder="Dr(a). Seu nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Especialidade</label>
                <Input
                  placeholder="Ex: Fisioterapia"
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">WhatsApp *</label>
                <Input
                  placeholder="(11) 99999-9999"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn-hero w-full text-xl py-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="w-6 h-6 mr-3" />
              Agendar Demonstração Gratuita
            </motion.button>

            <p className="text-center text-sm text-muted-foreground">
              ✅ Demonstração personalizada • ✅ Análise da sua agenda • ✅ Sem compromisso
            </p>
          </motion.form>
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
                <li><a href="#contato" className="hover:text-primary-foreground transition-colors">Contato</a></li>
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
              © 2025 TrickTime - Todos os direitos reservados • CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}