import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { ...corsHeaders }, status: 204 });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(JSON.stringify({ error: "Missing env vars" }), { status: 500, headers: corsHeaders });
    }

    const service = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    // Fluxo público para criação/atualização de conta
    if (action === "create") {
      const rawEmail: string = body?.email ?? "";
      const password: string = body?.password ?? "";
      const nome: string | undefined = body?.nome;
      const sessionId: string | undefined = body?.sessionId; // opcional

      const email = rawEmail.trim().toLowerCase();

      if (!email || !password) {
        return new Response(JSON.stringify({ error: "Missing email/password" }), { status: 400, headers: corsHeaders });
      }

      console.log("create-account: creating user for", email, sessionId ? `(sessionId=${sessionId})` : "");

      // 1) Primeiro, tenta localizar usuário já existente na tabela profiles (se webhook já populou)
      let existing: { id: string } | null = null;
      try {
        const { data: prof, error: profErr } = await service
          .from("profiles")
          .select("user_id")
          .eq("email", email)
          .maybeSingle();
        if (profErr) {
          console.warn("profiles lookup by email failed:", profErr);
        } else if (prof?.user_id) {
          existing = { id: prof.user_id };
        }
      } catch (e) {
        console.warn("profiles lookup exception:", e);
      }

      // 1b) Se não achou por profiles, tenta localizar usuário já existente via listUsers para evitar erro de duplicidade
      try {
        let page = 1;
        const perPage = 100;
        while (!existing && page <= 10) {
          const { data: listData, error: listErr } = await service.auth.admin.listUsers({ page, perPage });
          if (listErr) {
            console.error("pre-check listUsers failed (page", page, "):", listErr);
            break;
          }
          existing = listData.users?.find((u: any) => u.email?.toLowerCase() === email) || null;
          if (existing) break;
          if (!listData.users || listData.users.length < perPage) break;
          page += 1;
        }
      } catch (e) {
        console.warn("pre-check existing user failed:", e);
      }

      if (existing) {
        console.log("User already exists, updating password and ensuring profile");
        const { error: updErr } = await service.auth.admin.updateUserById(existing.id, { password });
        if (updErr) {
          console.error("updateUserById failed:", updErr);
          return new Response(JSON.stringify({ error: "Failed to update existing user password" }), { status: 500, headers: corsHeaders });
        }
        await service
          .from("profiles")
          .upsert({ user_id: existing.id, nome: nome || email.split("@")[0], email, active: true }, { onConflict: "user_id" });
        return new Response(JSON.stringify({ ok: true, message: "Senha atualizada para usuário existente", user_id: existing.id }), { status: 200, headers: corsHeaders });
      }

      // 2) Se não existe, tenta criar usuário no Auth
      const { data: authData, error: authError } = await service.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome },
      });

      if (authError) {
        console.error("createUser error:", authError);
        // Fallback: usuário pode já existir. Vamos listar (com paginação) e tentar atualizar senha
        try {
          let found: { id: string } | null = null;
          let page = 1;
          const perPage = 100;
          // Busca por até 10 páginas para garantir que encontramos usuários antigos
          while (!found && page <= 10) {
            const { data: listData, error: listErr } = await service.auth.admin.listUsers({ page, perPage });
            if (listErr) {
              console.error("listUsers failed (page", page, "):", listErr);
              break;
            }
            found = listData.users?.find((u: any) => u.email?.toLowerCase() === email) || null;
            if (found) break;
            if (!listData.users || listData.users.length < perPage) break; // última página
            page += 1;
          }
          if (found) {
            const { error: updErr } = await service.auth.admin.updateUserById(found.id, { password });
            if (updErr) {
              console.error("updateUserById failed:", updErr);
              return new Response(JSON.stringify({ error: "Failed to update existing user password" }), { status: 500, headers: corsHeaders });
            }

            // Garante profile
            await service
              .from("profiles")
              .upsert(
                { user_id: found.id, nome: nome || email.split("@")[0], email },
                { onConflict: "user_id" }
              );

            return new Response(
              JSON.stringify({ ok: true, message: "Senha atualizada para usuário existente", user_id: found.id }),
              { status: 200, headers: corsHeaders }
            );
          }

          // Se não encontrou, retorna o erro original para debug
          console.error("User not found in listUsers after duplicate error. Returning original error.");
          return new Response(JSON.stringify({ error: authError.message || "auth_create_user_failed" }), { status: 500, headers: corsHeaders });
        } catch (e) {
          console.error("Exception in fallback:", e);
          return new Response(JSON.stringify({ error: "internal_error", detail: String(e) }), { status: 500, headers: corsHeaders });
        }
      }

      // Sucesso: cria profile
      if (authData?.user?.id) {
        try {
          const { error: profileErr } = await service
            .from("profiles")
            .insert({ user_id: authData.user.id, nome: nome || email.split("@")[0], email, active: true });
          if (profileErr) console.error("profile insert error:", profileErr);
        } catch (e) {
          console.error("profile insert exception:", e);
        }

        return new Response(JSON.stringify({ ok: true, user_id: authData.user.id }), { status: 200, headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: "unknown" }), { status: 500, headers: corsHeaders });
    }

    // Para qualquer outra ação, retorne erro explícito
    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: corsHeaders });
  } catch (e) {
    console.error("Unhandled exception:", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});