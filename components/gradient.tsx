// components/GradientTheme.tsx

export default function GradientTheme() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-white to-purple-50/30 to-pink-100/50 pointer-events-none z-0"></div>
      <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse pointer-events-none z-0"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full opacity-20 animate-pulse delay-1000 pointer-events-none z-0"></div>
    </>
  );
}
