import { BlogPost } from "@/types";
import { Clock } from "lucide-react";
import Image from "next/image";

interface PostCardProps {
  post: BlogPost;
  onRead: (post: BlogPost) => void;
}

export const PostCard = ({ post, onRead }: PostCardProps) => (
  <div
    onClick={() => onRead(post)}
    className="bg-white rounded-4xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
  >
    <div className="relative h-56 rounded-3xl overflow-hidden mb-5">
      <Image fill sizes="(max-width: 768px) 100vw, 33vw" src={post.image} alt={post.title} className="object-cover" />
      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 text-xs font-bold rounded-full">
        {post.category}
      </span>
    </div>

    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
        <Clock size={14} />
        <span>{post.readTime}</span> • <span>{post.date}</span>
      </div>

      <h3 className="text-xl font-bold mb-3">{post.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 mb-6">{post.excerpt}</p>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-200">
        <Image src={post.author.avatar} alt={post.author.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
        <span className="text-sm font-medium">{post.author.name}</span>
      </div>
    </div>
  </div>
);
