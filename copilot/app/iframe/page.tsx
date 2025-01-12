'use client';

import { useSearchParams } from 'next/navigation';

export default function IframePage() {
  const searchParams = useSearchParams();
  const chatbotId = searchParams.get('chatbotId');
  
  return (
    <div className="p-4 bg-gray-100 border border-gray-300">
      <h1 className="text-xl font-semibold mb-2">Content in Iframe</h1>
      <div className="p-4 bg-white shadow rounded">
        This is a div container inside an iframe styled with Tailwind CSS.
      </div>
      <p>Chatbot ID: {chatbotId}</p>
    </div>
  );
}
