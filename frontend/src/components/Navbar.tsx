import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">📖 BookNexus</h1>
      <div className="space-x-4">
        <Link href="/books">
          <span className="text-blue-500 cursor-pointer">Home</span>
        </Link>
        <Link href="/chatbot">
          <span className="text-blue-500 cursor-pointer">Chatbot</span>
        </Link>
      </div>
    </nav>
  );
}
