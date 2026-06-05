"use client";

import Image from "next/image";
import { useState } from "react";
import { 
  FileText, 
  Search, 
  User as UserIcon,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Calendar
} from "lucide-react";
import { clsx } from "clsx";
import BlogActions from "@/components/super-admin/blogs/BlogActions";

export default function AdminBlogsClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const filteredBlogs = initialBlogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(search.toLowerCase()) || false;
    const matchesStatus = statusFilter === "ALL" || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const liveArticlesCount = initialBlogs.filter(b => b.status === "PUBLISHED").length;

  return (
    <>
      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles by title or keyword..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-600 outline-none transition-all"
              />
          </div>
          <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-6 py-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-colors font-bold text-sm outline-none cursor-pointer"
          >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
          </select>
      </div>

      {/* BLOGS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Article Details</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredBlogs.length === 0 ? (
                          <tr>
                              <td colSpan={4} className="px-8 py-20 text-center">
                                  <div className="flex flex-col items-center justify-center space-y-4">
                                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                          <FileText size={40} />
                                      </div>
                                      <p className="text-slate-500 font-medium">No articles found.</p>
                                  </div>
                              </td>
                          </tr>
                      ) : (
                          filteredBlogs.map((blog: any) => (
                              <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                  <td className="px-8 py-6">
                                      <div className="flex items-center gap-4">
                                          <div className="h-12 w-16 bg-slate-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                                              {blog.coverImage ? (
                                                  <Image fill sizes="64px" src={blog.coverImage} alt="" className="object-cover" />
                                              ) : (
                                                  <FileText className="absolute inset-0 m-auto text-slate-300" size={20} />
                                              )}
                                          </div>
                                          <div>
                                              <p className="text-sm font-black text-slate-900 leading-tight mb-1">{blog.title}</p>
                                              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                                  <span className="flex items-center gap-1"><UserIcon size={12} /> {blog.author?.fullName || 'Admin'}</span>
                                                  <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime || 5} min read</span>
                                              </div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <div className={clsx(
                                          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                          blog.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                                      )}>
                                          <span className={clsx("w-1.5 h-1.5 rounded-full", blog.status === "PUBLISHED" ? "bg-emerald-500" : "bg-slate-400")}></span>
                                          {blog.status}
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                          <Calendar size={14} className="text-slate-300" />
                                          {blog.publishedAt 
                                            ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(blog.publishedAt)) 
                                            : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(blog.createdAt))}
                                      </p>
                                  </td>
                                  <td className="px-8 py-6 text-right">
                                      <BlogActions blogId={blog._id} slug={blog.slug} status={blog.status} />
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      {/* QUICK INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
              <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={32} />
              </div>
              <div>
                  <h4 className="text-2xl font-black text-slate-900">{liveArticlesCount}</h4>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Articles</p>
              </div>
          </div>
          <div className="md:col-span-2 bg-primary-700 p-8 rounded-3xl text-white shadow-xl shadow-primary-50 relative overflow-hidden group">
              <ShieldCheck className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-2">Editorial Guidelines</h4>
                  <p className="text-primary-100 text-xs font-medium leading-relaxed max-w-lg mb-4">
                      Ensure all articles follow the EaseVote brand voice. High-quality imagery and clear, concise headings improve engagement by up to 40%.
                  </p>
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-primary-600">
                      <span className="text-[10px] font-black uppercase tracking-widest">Active Policies</span>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">•</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">Version 1.2</span>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}
