export default function Loading() {
  return (
    <div className="min-h-[60vh] max-w-6xl mx-auto px-6 py-16 animate-pulse">
      <div className="h-4 w-32 bg-[#FCE7F3] rounded mb-6" />
      <div className="h-10 w-2/3 bg-[#4C0519]/10 rounded mb-4" />
      <div className="h-5 w-1/2 bg-[#6E5A64]/15 rounded mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-56 bg-white border border-[#4C0519]/10 rounded-lg" />
        <div className="h-56 bg-white border border-[#4C0519]/10 rounded-lg" />
        <div className="h-56 bg-white border border-[#4C0519]/10 rounded-lg" />
      </div>
    </div>
  );
}
