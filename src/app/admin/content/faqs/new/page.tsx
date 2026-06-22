import { FaqCmsForm } from "@/components/admin/cms/faq-cms-form";
import { requireAdminPermission } from "@/server/admin/permissions";
export default async function NewFaqCmsPage() { await requireAdminPermission("content.create"); return <div className="space-y-4"><h2 className="text-2xl font-bold text-slate-950">New FAQ CMS draft</h2><p className="text-sm text-slate-600">Creates an admin-only FAQ draft in cms_content_entries and cms_content_revisions. It does not publish or change public rendering.</p><FaqCmsForm /></div>; }
