import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-bold text-green-700 mb-4">৪০৪</p>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">পৃষ্ঠাটি পাওয়া যায়নি</h2>
      <p className="text-gray-500 mb-6">আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি সরানো হয়েছে বা বিদ্যমান নেই।</p>
      <Link href="/" className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
        হোমপেজে ফিরুন
      </Link>
    </div>
  );
}
