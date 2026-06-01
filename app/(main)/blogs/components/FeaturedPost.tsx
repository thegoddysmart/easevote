import { BlogPost } from "@/types";
import { Clock, ArrowRight } from "lucide-react";
import Image from "next/image";

interface FeaturedPostProps {
  post: BlogPost;
  onRead: (post: BlogPost) => void;
}

export const FeaturedPost = ({ post, onRead }: FeaturedPostProps) => (
  <div
    onClick={() => onRead(post)}
    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer grid grid-cols-1 md:grid-cols-2"
  >
    <div className="relative h-64 md:h-auto overflow-hidden">
      <Image
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        src={post.image}
        alt={post.title}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>

    <div className="p-8 md:p-12 flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold uppercase rounded-full">
          {post.category}
        </span>
        <span className="text-slate-400 text-xs flex items-center gap-1">
          <Clock size={12} /> {post.readTime}
        </span>
      </div>

      <h2 className="text-3xl font-display font-bold mb-4 group-hover:text-primary-700">
        {post.title}
      </h2>

      <p className="text-slate-500 mb-6 line-clamp-3">{post.excerpt}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-bold">{post.author.name}</p>
            <p className="text-xs text-slate-500">{post.date}</p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-700 group-hover:text-white">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  </div>
);
