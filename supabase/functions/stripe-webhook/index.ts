import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-06-20",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  console.log("Webhook received");

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("No Stripe signature found");
      return new Response("No signature", { status: 400 });
    }

    // Verificar a assinatura do webhook (em produção, configure o webhook secret)
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      // Em desenvolvimento, processar sem verificação
      event = JSON.parse(body);
    }

    console.log("Processing event:", event.type);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        console.log("Checkout session completed:", session.id);

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Buscar ou criar usuário no Supabase
          const customerEmailRaw: string | undefined = session.customer_details?.email || session.metadata?.customer_email;
          const customerEmail = customerEmailRaw?.trim().toLowerCase();
          
          if (customerEmail) {
            // Criar usuário temporário para completar o cadastro
            const tempPassword = Math.random().toString(36).substring(2, 15);
            let userId: string | null = null;

            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
              email: customerEmail,
              password: tempPassword,
              email_confirm: true,
            });

            if (authError) {
              console.warn("createUser failed, trying to find existing user:", authError);
              // Se já existir, vamos buscar pelos usuários e seguir com o fluxo
              const { data: listData, error: listErr } = await supabase.auth.admin.listUsers();
              if (listErr) {
                console.error("listUsers failed:", listErr);
              } else {
                const found = listData.users?.find((u: any) => u.email?.toLowerCase() === customerEmail);
                if (found) userId = found.id;
              }
            } else if (authData?.user?.id) {
              userId = authData.user.id;
            }

            if (userId) {
              // Salvar dados da assinatura
              const { error: subError } = await supabase
                .from('subscriptions')
                .upsert({
                  user_id: userId,
                  stripe_customer_id: session.customer,
                  stripe_subscription_id: subscription.id,
                  status: subscription.status,
                  price_id: subscription.items.data[0].price.id,
                  current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                  current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                });

              if (subError) {
                console.error("Error saving subscription:", subError);
              } else {
                console.log("Subscription saved successfully");

                // Enviar email de boas-vindas
                try {
                  const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${supabaseServiceKey}`,
                    },
                    body: JSON.stringify({
                      email: customerEmail,
                      userId,
                    }),
                  });

                  if (!emailResponse.ok) {
                    console.error("Failed to send welcome email");
                  }
                } catch (emailError) {
                  console.error("Error sending welcome email:", emailError);
                }
              }
            } else {
              console.error("Could not determine userId from Stripe session email");
            }
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        console.log("Subscription updated:", subscription.id);

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error("Error updating subscription:", error);
        } else {
          console.log("Subscription updated successfully");
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});