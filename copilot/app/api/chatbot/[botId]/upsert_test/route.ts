// app/api/upsert_docs.ts
import axios from "axios";

export async function POST(request: Request, context) {
  const apiKey = process.env.SERVER_API_KEY;
  const { params } = context;
  const botId = params.botId;

  const formData = new FormData();

  // Assume files are sent as a Blob or similar object; you'll need to adapt based on your client-side implementation
  const files = await request.formData();
  for (const file of files.getAll("files")) {
    formData.append("files", file);
  }
  formData.append("botId", botId);
  console.log("Form data", formData);

  try {
    // Dummy response.data object
    const response = {
      message: "File upserted successfully",
      fileId: "abc123",
      fileName: "example.txt",
      data: "Data test"
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error in upserting documents:", error);
    return new Response(
      JSON.stringify({ error: "Error in upserting documents" }),
      { status: 500 },
    );
  }
}
