export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Studio Display Admin
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Next.js + TypeScript + Tailwind CSS
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Giriş Yap
          </a>
          <a
            href="/admin/dashboard"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
}
