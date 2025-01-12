import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types_db";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient<Database>({
    cookies,
  });

  try {
    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    // Retrieve user's subscription details
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('price_id')
      .eq('user_id', session.user.id)
      .single();

    if (subscriptionError || !subscription) {
      return new Response(JSON.stringify({ message: "Subscription not found" }), { status: 404 });
    }

    // Fetch the product details to get the question limit
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('questions_limit')
      .eq('id', subscription.price_id)
      .single();

    if (productError || !product) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    const questionLimit = product.questions_limit;

    // Check the user's chatbot creation limit
    const { data: userChatbots, error: userChatbotsError } = await supabase
      .from('chatbot')
      .select('id', { count: 'exact' })
      .eq('user_id', session.user.id);

    if (userChatbotsError) {
      return new Response(JSON.stringify({ message: "Failed to fetch user's chatbots" }), { status: 500 });
    }

    if (userChatbots?.length >= 1) {  // Assuming 1 chatbot per user based on chatbot_limit in the users table
      return new Response(JSON.stringify({ message: "Chatbot creation limit reached" }), { status: 403 });
    }

    // Insert a new chatbot with default settings and the question limit
    const { data: newChatbot, error: insertError } = await supabase
      .from('chatbot')
      .insert([{ user_id: session.user.id, question_limit: questionLimit }])
      .select('id');  // Request to return the 'id' of the newly created chatbot

    if (insertError) {
      console.log("Insert error", insertError);
      return new Response(JSON.stringify({ message: "Failed to create chatbot" }), { status: 500 });
    }

    return new Response(JSON.stringify(newChatbot), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error", details: error.toString() }), { status: 500 });
  }
}
