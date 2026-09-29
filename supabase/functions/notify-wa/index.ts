// Supabase Edge Function to proxy WhatsApp notifications to WAHA
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const WAHA_BASE_URL = Deno.env.get("WAHA_BASE_URL") || "http://13.140.178.167:29001";
const WAHA_API_KEY = Deno.env.get("WAHA_API_KEY") || "askdj2934u9jd923dj3jdoi23nuiurio32od23oed2omi3290rmmoiejrw";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { chatId, message } = payload;

    if (!chatId || !message) {
      return new Response(
        JSON.stringify({ error: "chatId and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const wahaRes = await fetch(`${WAHA_BASE_URL}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": WAHA_API_KEY,
      },
      body: JSON.stringify({
        session: "default",
        chatId: chatId,
        text: message,
      }),
    });

    const wahaData = await wahaRes.json();

    return new Response(JSON.stringify({ success: true, result: wahaData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
