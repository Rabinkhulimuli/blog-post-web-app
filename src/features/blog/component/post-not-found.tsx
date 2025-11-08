import { Link } from "react-router";
import { FileWarning } from "lucide-react";

export default function PostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <FileWarning className="w-16 h-16 text-red-500 mb-6 animate-bounce" />
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Oops! Post Not Found</h1>
      <p className="text-muted-foreground mb-6">
        The post you are looking for might have been removed, renamed, or never existed.
      </p>
      <Link to="/" className="inline-block">
        <button className="bg-primary text-primary-foreground cursor-pointer px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition">
          Go Back Home
        </button>
      </Link>
    </div>
  );
}
