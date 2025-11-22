function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-netflix-black">
      <div className="text-center">
        <div className="text-5xl md:text-6xl text-netflix-red font-bold animate-pulse mb-4">
          mezoo
        </div>
        <div className="flex space-x-2 justify-center">
          <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-netflix-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
