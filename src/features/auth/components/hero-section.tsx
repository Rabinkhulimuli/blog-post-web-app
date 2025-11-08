import { Clock, User } from "lucide-react";

interface HeroSectionProps {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  imageUrl: string;
  postId: string;
}

export default function HeroSection({
  title,
  excerpt,
  category,
  author,
  readTime,
  imageUrl,
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[600px] flex items-end overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-white space-y-4">
          <span className="inline-block px-4 py-1 bg-primary/90 text-primary-foreground text-sm font-medium rounded-full" data-testid="text-category">
            {category}
          </span>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" data-testid="text-hero-title">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl" data-testid="text-hero-excerpt">
            {excerpt}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span data-testid="text-author">{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span data-testid="text-readtime">{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
