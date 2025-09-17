import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, sessionId } = await req.json();
    console.log("Creating account for:", email);

    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser.users.find(user => user.email === email);

    if (userExists) {
      // Atualizar senha do usuário existente
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userExists.id,
        { password }
      );

      if (updateError) {
        throw new Error(`Erro ao atualizar senha: ${updateError.message}`);
      }

      // Criar profile se não existir
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userExists.id,
          nome: email.split('@')[0],
          email: email,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
      }

      console.log("User account updated successfully");
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Conta atualizada com sucesso! Você já pode fazer login.",
        userId: userExists.id 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      // Criar novo usuário
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        throw new Error(`Erro ao criar usuário: ${authError.message}`);
      }

      if (authData.user) {
        // Criar profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            nome: email.split('@')[0],
            email: email,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }

        console.log("New user account created successfully");
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Conta criada com sucesso! Você já pode fazer login.",
          userId: authData.user.id 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }
  } catch (error) {
    console.error("Error in create-account:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});