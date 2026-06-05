import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerApiClient } from "@/lib/api-client";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";
import AdminBlogsClient from "./AdminBlogsClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const session = await getServerSession(authOptions);
  const apiClient = createServerApiClient(session?.accessToken);
  
  const res = (await apiClient.get("/blogs/admin").catch(() => ({}))) || {};
  const blogs = (res as any).blogs || (res as any).data?.blogs || [];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-primary-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-50">
                <FileText className="h-7 w-7" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    CMS Management
                </h1>
                <p className="text-slate-500 font-medium">
                    Create and organize platform editorial content
                </p>
            </div>
        </div>

        <Link 
            href="/dashboard/cms/blogs/new"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-700 !text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary-800 transition-all shadow-md shadow-primary-50"
        >
            <Plus size={18} />
            Write New Post
        </Link>
      </div>

      <AdminBlogsClient initialBlogs={blogs} />
    </div>
  );
}
