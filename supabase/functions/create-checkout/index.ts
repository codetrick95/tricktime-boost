import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("create-checkout function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    console.log("Creating checkout for email:", email);

    if (!email) {
      throw new Error("Email is required");
    }

    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const PRICE_ID = Deno.env.get("PRICE_ID");

    if (!STRIPE_SECRET_KEY) {
      console.error("Missing STRIPE_SECRET_KEY env var");
      return new Response(JSON.stringify({ error: "Configuração ausente: STRIPE_SECRET_KEY" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (!PRICE_ID) {
      console.error("Missing PRICE_ID env var");
      return new Response(JSON.stringify({ error: "Configuração ausente: PRICE_ID" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { 
      apiVersion: "2024-06-20" 
    });

    // Verificar se já existe um cliente Stripe
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
      console.log("Created new customer:", customerId);
    }

    // URLs de redirecionamento
    const origin = req.headers.get("origin") || Deno.env.get("FRONTEND_URL") || "http://localhost:5173";

    // Criar sessão de checkout com o PRICE_ID configurado
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: PRICE_ID, // Price ID do Stripe configurado no ambiente
          quantity: 1,
        },
      ],
      mode: "subscription",
      // Habilita automaticamente métodos suportados (cartão, pix, etc.)
      automatic_payment_methods: { enabled: true },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        customer_email: email,
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = (error as any)?.message || "Erro desconhecido";
    console.error("Error in create-checkout:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});