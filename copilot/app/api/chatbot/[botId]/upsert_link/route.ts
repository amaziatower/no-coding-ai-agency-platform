// app/api/scrape_and_upsert.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request, context) {
  const body = await request.json();
  const apiKey = process.env.SERVER_API_KEY;
  const apiUrl = process.env.OLLABOT_SERVER;

  const { params } = context;
  const botId = params.botId;

  const supabase = createRouteHandlerClient({ cookies });

  // Fetch the current data_sources_counter and data_sources_limit for the bot
  const { data: botData, error: fetchError } = await supabase
    .from('chatbot')
    .select('data_sources_counter, data_sources_limit')
    .eq('id', botId)
    .single();

  if (fetchError) {
    console.error('Error fetching bot data:', fetchError);
    return new NextResponse(
      JSON.stringify({ error: "Error fetching bot data" }),
      { status: 500 },
    );
  }

  const { data_sources_counter, data_sources_limit } = botData;

  // Check if the data_sources_counter is less than the data_sources_limit
  if (data_sources_counter >= data_sources_limit) {
    return new NextResponse(
      JSON.stringify({ error: "Data sources limit reached" }),
      { status: 403 },
    );
  }

  const upsertBody = {
    ...body, // Spread the original body
    botId: botId, // Add botId to the request body
  };

  try {
    const response = await axios.post(
      `${apiUrl}/scrape_and_upsert`,
      upsertBody,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    // Call the RPC function to increment the data_sources_counter
    const { error: rpcError } = await supabase.rpc('increment_data_sources_counter', {
      bot_id: botId
    });

    if (rpcError) {
      console.error('Error updating data_sources_counter:', rpcError);
      return new NextResponse(
        JSON.stringify({ error: "Error updating data_sources_counter" }),
        { status: 500 },
      );
    }

    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error in scraping and upserting:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error in scraping and upserting" }),
      { status: 500 },
    );
  }
}
