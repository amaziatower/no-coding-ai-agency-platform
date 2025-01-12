import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  botName: z.string().optional(),
  companyName: z.string().optional(),
  description: z.string().optional(),
  welcomeMessage: z.string().optional(),
});

export async function PATCH(req: Request, context) {
  const supabase = createRouteHandlerClient({ cookies });
  const { params } = context;
  const botId = params.botId;

  try {
    const body = await req.json();
    const { botName, companyName, description, welcomeMessage } = schema.parse(body);

    const { data, error } = await supabase
      .from('chatbot')
      .update({ botName, companyName, description, welcomeMessage })
      .eq('id', botId);

    if (error) throw new Error(error.message);
    return new Response(JSON.stringify(data));
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 400 });
  }
}
