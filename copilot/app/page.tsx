export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Embedding an Iframe</h1>
      <iframe
        src="/iframe"
        className="w-full h-96 border-none"
      ></iframe>
    </div>
  );
}
