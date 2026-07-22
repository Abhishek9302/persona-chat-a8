import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-6 text-slate-400">Page not found.</p>
      <Link
        href="/"
        className="rounded bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500"
      >
        Go home
      </Link>
    </main>
  );
}
