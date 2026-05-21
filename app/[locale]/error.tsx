'use client';
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">কিছু একটা সমস্যা হয়েছে</h2>
      <button onClick={reset} className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
        আবার চেষ্টা করুন
      </button>
    </div>
  );
}
