import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId } = await req.json();
    console.log("Sending welcome email to:", email);

    if (!email) {
      throw new Error("Email is required");
    }

    const emailResponse = await resend.emails.send({
      from: "TrickTime <onboarding@resend.dev>",
      to: [email],
      subject: "Bem-vindo ao TrickTime! 🚀",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Bem-vindo ao TrickTime!</h1>
            <p style="color: #6B7280; font-size: 16px;">Obrigado por se juntar a nós! 🎉</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #8B5CF6, #10B981); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; font-size: 24px;">Seu pagamento foi confirmado!</h2>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">Agora você tem acesso completo ao TrickTime</p>
          </div>
          
          <div style="background: #F9FAFB; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #374151; margin: 0 0 15px 0;">Próximos passos:</h3>
            <ol style="color: #6B7280; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Complete seu cadastro criando uma senha</li>
              <li style="margin-bottom: 10px;">Acesse o dashboard do TrickTime</li>
              <li style="margin-bottom: 10px;">Explore todas as funcionalidades disponíveis</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://tricktime.vercel.app/" 
               style="display: inline-block; background: linear-gradient(135deg, #8B5CF6, #10B981); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Acessar TrickTime
            </a>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 14px; margin: 0;">
              Se você não fez esta compra, pode ignorar este email com segurança.
            </p>
            <p style="color: #9CA3AF; font-size: 14px; margin: 10px 0 0 0;">
              © 2024 TrickTime. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});