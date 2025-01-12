import axios from 'axios'


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const task_id = searchParams.get('task_id');
  const apiUrl = process.env.OLLABOT_SERVER;

  console.log("TasK ID", task_id)

  try {
    const response = await axios.get(`${apiUrl}/task_status/${task_id}`);
    console.log("Response", response.data)
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error fetching task status:', error);
    return new Response(JSON.stringify({ error: 'Error fetching task status' }), { status: 500 });
  }
}
