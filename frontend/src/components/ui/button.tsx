export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
      <button
        onClick={onClick}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        {children}
      </button>
    );
  }
  