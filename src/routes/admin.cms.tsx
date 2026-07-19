import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getCMSContent,
  saveCMSContent,
  listCMSRevisions,
  restoreCMSRevision,
  listPages,
  uploadPostCover,
  type AdminPost,
} from "@/lib/admin-store";
import { CmsImageCropper } from "@/components/admin/CmsImageCropper";
import { RichTextEditor } from "@/components/RichTextEditor";
import { 
  FileText, Eye, Save, RotateCcw, Image as ImageIcon, 
  Plus, Trash2, ArrowLeft, Globe, Settings, FileCheck, HelpCircle
} from "lucide-react";

export const Route = createFileRoute("/admin/cms")({
  component: AdminCMS,
});

const STATIC_PAGES = [
  { slug: "home", title: "Home Page", description: "Edit sections like Hero, Stats, Community Impact, and CTA." },
  { slug: "about", title: "About Page", description: "Edit Who We Are details, photo break, and Five Things facts." },
  { slug: "gallery", title: "Gallery Header", description: "Edit the main title, eyebrow, and description for the gallery page." },
  { slug: "contact", title: "Contact Page", description: "Edit contact email, phones, hours, and addresses." },
  { slug: "donate", title: "Donate Page", description: "Edit donation header and customize suggested payment tiers." },
  { slug: "donate-details", title: "Donate Details", description: "Edit payment checkout instructions and security descriptions." },
  { slug: "posts-index", title: "Journal Index Header", description: "Edit the header details for the main blog list." },
];

function AdminCMS() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [formData, setFormData] = useState<any | null>(null);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "history">("edit");
  
  // Cropper States
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropAspect, setCropAspect] = useState<number>(16/9);
  const [cropTargetField, setCropTargetField] = useState<string | null>(null);
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const initData = async () => {
    setLoading(true);
    try {
      const dynamic = await listPages();
      const dynamicFormatted = dynamic.map((p) => ({
        slug: p.slug,
        title: `${p.title} (Custom Page)`,
        description: `Manage title, content body, cover, and metadata for the custom page: ${p.slug}.`,
        isDynamic: true,
        record: p,
      }));
      setPages([...STATIC_PAGES, ...dynamicFormatted]);
    } catch (e) {
      console.error("Error loading pages for CMS:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void initData();
  }, []);

  const handleSelectPage = async (page: any) => {
    setLoading(true);
    setSelectedPage(page);
    setActiveTab("edit");
    setMessage(null);
    try {
      const content = await getCMSContent(page.slug);
      setFormData(content);
      
      // Load revisions
      const revs = await listCMSRevisions(page.slug);
      setRevisions(revs);
    } catch (e) {
      console.error("Error loading page content:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedPage || !formData) return;
    setSaving(true);
    setMessage(null);
    try {
      await saveCMSContent(selectedPage.slug, formData);
      setMessage({ type: "success", text: "Page content published successfully!" });
      
      // Reload revisions
      const revs = await listCMSRevisions(selectedPage.slug);
      setRevisions(revs);
    } catch (e) {
      console.error("Error saving CMS content:", e);
      setMessage({ type: "error", text: "Failed to publish updates." });
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (revId: string) => {
    if (!selectedPage) return;
    setSaving(true);
    setMessage(null);
    try {
      await restoreCMSRevision(revId, selectedPage.slug);
      setMessage({ type: "success", text: "Revision restored successfully!" });
      
      // Reload page content
      const content = await getCMSContent(selectedPage.slug);
      setFormData(content);
      
      // Reload revisions
      const revs = await listCMSRevisions(selectedPage.slug);
      setRevisions(revs);
    } catch (e) {
      console.error("Error restoring revision:", e);
      setMessage({ type: "error", text: "Failed to restore revision." });
    } finally {
      setSaving(false);
    }
  };

  // Image Helper logic
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>, targetField: string, aspect: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCropSrc(reader.result);
        setCropAspect(aspect);
        setCropTargetField(targetField);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (blob: Blob) => {
    if (!cropTargetField || !selectedPage) return;
    setCropSrc(null);
    setSaving(true);
    try {
      const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
      const url = await uploadPostCover(file);
      
      // Update form data deep property
      const updated = { ...formData };
      const keys = cropTargetField.split(".");
      
      let cur = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = url;
      
      setFormData(updated);
      setMessage({ type: "success", text: "Image cropped and uploaded successfully." });
    } catch (e) {
      console.error("Error uploading cropped image:", e);
      setMessage({ type: "error", text: "Failed to upload cropped image." });
    } finally {
      setSaving(false);
      setCropTargetField(null);
    }
  };

  const updateField = (path: string, value: any) => {
    const updated = { ...formData };
    const keys = path.split(".");
    
    let cur = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!cur[keys[i]]) cur[keys[i]] = {};
      cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
    
    setFormData(updated);
  };

  if (loading && !selectedPage) {
    return (
      <div className="flex h-96 items-center justify-center text-sm text-muted-foreground">
        Loading CMS configurations…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      {cropSrc && (
        <CmsImageCropper
          imageSrc={cropSrc}
          aspectRatio={cropAspect}
          onCrop={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {!selectedPage ? (
        // List Pages View
        <div>
          <div className="mb-8">
            <p className="eyebrow">CMS Panel</p>
            <h2 className="mt-3 font-display text-4xl text-foreground">Manage Website Content</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select any page below to edit its sections, upload headers, manage visibility, or edit SEO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {pages.map((p) => (
              <button
                key={p.slug}
                onClick={() => void handleSelectPage(p)}
                className="flex flex-col items-start text-left bg-paper p-6 border border-border rounded-xl transition-all hover:border-primary hover:shadow-md group"
              >
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                  {p.isDynamic ? "Dynamic Route" : "Static Route"}
                </span>
                <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
                <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-transparent group-hover:border-primary group-hover:text-primary transition-all">
                  Open Page Editor →
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Single Page Editor View
        <div className="flex flex-col gap-6">
          {/* Editor Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedPage(null)}
                className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                title="Back to CMS list"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  CMS / PAGE EDITOR
                </p>
                <h2 className="font-display text-2xl text-foreground">{selectedPage.title}</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePublish}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-primary disabled:opacity-60 transition-colors cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {saving ? "Publishing…" : "Publish Updates"}
              </button>
            </div>
          </div>

          {/* Action Message Bar */}
          {message && (
            <div className={`p-4 border-l-4 ${
              message.type === "success" 
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-destructive/10 border-destructive text-destructive"
            } text-sm font-medium`}>
              {message.text}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === "edit"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="h-3.5 w-3.5 inline mr-1.5" />
              Edit Content
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === "preview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3.5 w-3.5 inline mr-1.5" />
              Live Preview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5 inline mr-1.5" />
              Revision History
            </button>
          </div>

          {/* Editor Body */}
          {activeTab === "edit" && formData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
              
              {/* Form Config Fields */}
              <div className="lg:col-span-8 space-y-8 bg-paper border border-border p-6 rounded-xl shadow-sm">
                
                {/* Specific form details for home */}
                {selectedPage.slug === "home" && (
                  <>
                    {/* HERO SECTION */}
                    <SectionBox title="Hero / Header Section">
                      <Field label="Hero Section Visibility">
                        <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={formData.hero?.visible !== false}
                            onChange={(e) => updateField("hero.visible", e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-foreground">Show this section</span>
                        </label>
                      </Field>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Eyebrow / Small Label">
                          <input
                            value={formData.hero?.label || ""}
                            onChange={(e) => updateField("hero.label", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Highlighted / Italic Text">
                          <input
                            value={formData.hero?.highlightedText || ""}
                            onChange={(e) => updateField("hero.highlightedText", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <Field label="Main Heading Title">
                        <input
                          value={formData.hero?.heading || ""}
                          onChange={(e) => updateField("hero.heading", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Description Description">
                        <textarea
                          rows={4}
                          value={formData.hero?.description || ""}
                          onChange={(e) => updateField("hero.description", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Primary Button Text">
                          <input
                            value={formData.hero?.buttonText || ""}
                            onChange={(e) => updateField("hero.buttonText", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Primary Button URL Link">
                          <input
                            value={formData.hero?.buttonUrl || ""}
                            onChange={(e) => updateField("hero.buttonUrl", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Secondary Link Text">
                          <input
                            value={formData.hero?.linkText || ""}
                            onChange={(e) => updateField("hero.linkText", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Secondary Link URL">
                          <input
                            value={formData.hero?.linkUrl || ""}
                            onChange={(e) => updateField("hero.linkUrl", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <ImageField 
                        label="Hero Banner Image" 
                        path="hero.image" 
                        url={formData.hero?.image} 
                        aspect={16/10} 
                        onUpload={handleImageFile} 
                      />
                    </SectionBox>

                    {/* MARQUEE STATS */}
                    <SectionBox title="Marquee Statistics Grid">
                      {formData.marquee?.map((m: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-border/40 pb-4 last:border-0 last:pb-0">
                          <Field label={`Stat ${idx + 1} Big Text`}>
                            <input
                              value={m.stat || ""}
                              onChange={(e) => {
                                const newMarquee = [...formData.marquee];
                                newMarquee[idx].stat = e.target.value;
                                updateField("marquee", newMarquee);
                              }}
                              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </Field>
                          <Field label={`Stat ${idx + 1} Descriptive Label`}>
                            <input
                              value={m.label || ""}
                              onChange={(e) => {
                                const newMarquee = [...formData.marquee];
                                newMarquee[idx].label = e.target.value;
                                updateField("marquee", newMarquee);
                              }}
                              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                          </Field>
                        </div>
                      ))}
                    </SectionBox>

                    {/* COMMUNITY EVENT SECTION */}
                    <SectionBox title="Community Impact Highlights">
                      <Field label="Visibility Status">
                        <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={formData.communityEvent?.visible !== false}
                            onChange={(e) => updateField("communityEvent.visible", e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-foreground">Show this section</span>
                        </label>
                      </Field>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Eyebrow / Small Label">
                          <input
                            value={formData.communityEvent?.label || ""}
                            onChange={(e) => updateField("communityEvent.label", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Italicized Heading Word">
                          <input
                            value={formData.communityEvent?.highlightedText || ""}
                            onChange={(e) => updateField("communityEvent.highlightedText", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <Field label="Heading text">
                        <input
                          value={formData.communityEvent?.heading || ""}
                          onChange={(e) => updateField("communityEvent.heading", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Section description paragraph">
                        <textarea
                          rows={3}
                          value={formData.communityEvent?.description || ""}
                          onChange={(e) => updateField("communityEvent.description", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Button text label">
                          <input
                            value={formData.communityEvent?.buttonText || ""}
                            onChange={(e) => updateField("communityEvent.buttonText", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Button link destination">
                          <input
                            value={formData.communityEvent?.buttonUrl || ""}
                            onChange={(e) => updateField("communityEvent.buttonUrl", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <ImageField 
                        label="Event Feature Image" 
                        path="communityEvent.image" 
                        url={formData.communityEvent?.image} 
                        aspect={16/10} 
                        onUpload={handleImageFile} 
                      />
                    </SectionBox>

                    {/* CTA SECTION */}
                    <SectionBox title="Call-To-Action Banner">
                      <Field label="Visibility Status">
                        <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={formData.cta?.visible !== false}
                            onChange={(e) => updateField("cta.visible", e.target.checked)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-foreground">Show this section</span>
                        </label>
                      </Field>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Eyebrow / Small Label">
                          <input
                            value={formData.cta?.label || ""}
                            onChange={(e) => updateField("cta.label", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Heading Text Title">
                          <input
                            value={formData.cta?.heading || ""}
                            onChange={(e) => updateField("cta.heading", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <Field label="Paragraph description context">
                        <textarea
                          rows={4}
                          value={formData.cta?.description || ""}
                          onChange={(e) => updateField("cta.description", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Left Button Text Label">
                          <input
                            value={formData.cta?.button1Text || ""}
                            onChange={(e) => updateField("cta.button1Text", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Left Button Link Destination">
                          <input
                            value={formData.cta?.button1Url || ""}
                            onChange={(e) => updateField("cta.button1Url", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Right Button Text Label">
                          <input
                            value={formData.cta?.button2Text || ""}
                            onChange={(e) => updateField("cta.button2Text", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Right Button Link Destination">
                          <input
                            value={formData.cta?.button2Url || ""}
                            onChange={(e) => updateField("cta.button2Url", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <ImageField 
                        label="CTA Promo Image" 
                        path="cta.image" 
                        url={formData.cta?.image} 
                        aspect={1.2} 
                        onUpload={handleImageFile} 
                      />
                    </SectionBox>
                  </>
                )}

                {selectedPage.slug === "about" && (
                  <>
                    {/* ABOUT HEADER */}
                    <SectionBox title="Header details">
                      <Field label="Eyebrow small label text">
                        <input
                          value={formData.header?.label || ""}
                          onChange={(e) => updateField("header.label", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Large Heading Title">
                        <input
                          value={formData.header?.heading || ""}
                          onChange={(e) => updateField("header.heading", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                    </SectionBox>

                    {/* WHO WE ARE */}
                    <SectionBox title="Who We Are - Narrative">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Eyebrow Section Title">
                          <input
                            value={formData.whoWeAre?.label || ""}
                            onChange={(e) => updateField("whoWeAre.label", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Large Heading title text">
                          <input
                            value={formData.whoWeAre?.heading || ""}
                            onChange={(e) => updateField("whoWeAre.heading", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                      <div className="space-y-4">
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                          Narrative Copy Paragraphs
                        </span>
                        {formData.whoWeAre?.paragraphs?.map((p: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <textarea
                              rows={4}
                              value={p}
                              onChange={(e) => {
                                const newPara = [...formData.whoWeAre.paragraphs];
                                newPara[idx] = e.target.value;
                                updateField("whoWeAre.paragraphs", newPara);
                              }}
                              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPara = formData.whoWeAre.paragraphs.filter((_: any, i: number) => i !== idx);
                                updateField("whoWeAre.paragraphs", newPara);
                              }}
                              className="p-2 border border-border text-muted-foreground hover:border-destructive hover:text-destructive shrink-0 mt-1"
                              title="Delete paragraph"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newPara = [...(formData.whoWeAre.paragraphs || []), ""];
                            updateField("whoWeAre.paragraphs", newPara);
                          }}
                          className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-secondary text-foreground mt-2"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Paragraph
                        </button>
                      </div>
                    </SectionBox>

                    {/* IMAGE BREAK */}
                    <SectionBox title="Page Sport Highlight Photo Banner">
                      <ImageField 
                        label="Banner Photo Image" 
                        path="imageBreak.image" 
                        url={formData.imageBreak?.image} 
                        aspect={2} 
                        onUpload={handleImageFile} 
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Banner Image Alt Description">
                          <input
                            value={formData.imageBreak?.imageAlt || ""}
                            onChange={(e) => updateField("imageBreak.imageAlt", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                        <Field label="Captioned Footnote text">
                          <input
                            value={formData.imageBreak?.caption || ""}
                            onChange={(e) => updateField("imageBreak.caption", e.target.value)}
                            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                        </Field>
                      </div>
                    </SectionBox>

                    {/* FIVE THINGS FACTS */}
                    <SectionBox title="Five Things Worth Knowing Grid">
                      <Field label="Facts section title label">
                        <input
                          value={formData.factsList?.label || ""}
                          onChange={(e) => updateField("factsList.label", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <div className="space-y-4">
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                          Facts List entries
                        </span>
                        {formData.factsList?.facts?.map((f: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <span className="font-display text-lg text-primary select-none shrink-0 w-8">0{idx + 1}</span>
                            <input
                              value={f}
                              onChange={(e) => {
                                const newFacts = [...formData.factsList.facts];
                                newFacts[idx] = e.target.value;
                                updateField("factsList.facts", newFacts);
                              }}
                              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFacts = formData.factsList.facts.filter((_: any, i: number) => i !== idx);
                                updateField("factsList.facts", newFacts);
                              }}
                              className="p-2 border border-border text-muted-foreground hover:border-destructive hover:text-destructive shrink-0"
                              title="Delete fact entry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newFacts = [...(formData.factsList.facts || []), ""];
                            updateField("factsList.facts", newFacts);
                          }}
                          className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-secondary text-foreground mt-2"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Fact Entry
                        </button>
                      </div>
                    </SectionBox>
                  </>
                )}

                {selectedPage.slug === "donate" && (
                  <>
                    <SectionBox title="Donation Header Info">
                      <Field label="Eyebrow Text Small Label">
                        <input
                          value={formData.header?.label || ""}
                          onChange={(e) => updateField("header.label", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Heading Large Title">
                        <input
                          value={formData.header?.heading || ""}
                          onChange={(e) => updateField("header.heading", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Detailed description description text">
                        <textarea
                          rows={4}
                          value={formData.header?.description || ""}
                          onChange={(e) => updateField("header.description", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                    </SectionBox>
                    
                    <SectionBox title="Donations Form configuration">
                      <Field label="Donation card heading box title">
                        <input
                          value={formData.formConfig?.heading || ""}
                          onChange={(e) => updateField("formConfig.heading", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <div className="space-y-4">
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
                          Preset Donation Amount Tiers (USD)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {formData.formConfig?.amounts?.map((amt: number, idx: number) => (
                            <div key={idx} className="relative flex items-center">
                              <span className="absolute left-3 text-muted-foreground text-sm">$</span>
                              <input
                                type="number"
                                value={amt}
                                onChange={(e) => {
                                  const newAmounts = [...formData.formConfig.amounts];
                                  newAmounts[idx] = parseFloat(e.target.value) || 0;
                                  updateField("formConfig.amounts", newAmounts);
                                }}
                                className="w-full border border-border bg-background pl-6 pr-2 py-3 text-sm outline-none focus:border-primary font-mono"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <Field label="General inquiry mail contact">
                        <input
                          value={formData.formConfig?.inquiryEmail || ""}
                          onChange={(e) => updateField("formConfig.inquiryEmail", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                    </SectionBox>
                  </>
                )}

                {selectedPage.slug === "donate-details" && (
                  <>
                    <SectionBox title="Secure Checkout Header">
                      <Field label="Eyebrow small title header text">
                        <input
                          value={formData.header?.label || ""}
                          onChange={(e) => updateField("header.label", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Checkout amount prefix phrase">
                        <input
                          value={formData.header?.amountPrefix || ""}
                          onChange={(e) => updateField("header.amountPrefix", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                    </SectionBox>
                  </>
                )}

                {selectedPage.slug === "gallery" && (
                  <>
                    <SectionBox title="Gallery Header Info">
                      <Field label="Eyebrow category title text">
                        <input
                          value={formData.header?.label || ""}
                          onChange={(e) => updateField("header.label", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Large Heading Title">
                        <input
                          value={formData.header?.heading || ""}
                          onChange={(e) => updateField("header.heading", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Detailed description summary">
                        <textarea
                          rows={4}
                          value={formData.header?.description || ""}
                          onChange={(e) => updateField("header.description", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                    </SectionBox>
                  </>
                )}

                {selectedPage.slug === "contact" && (
                  <>
                    <SectionBox title="Contact Header Info">
                      <Field label="Eyebrow category title text">
                        <input
                          value={formData.header?.label || ""}
                          onChange={(e) => updateField("header.label", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Large Heading Title">
                        <input
                          value={formData.header?.heading || ""}
                          onChange={(e) => updateField("header.heading", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Detailed description summary">
                        <textarea
                          rows={4}
                          value={formData.header?.description || ""}
                          onChange={(e) => updateField("header.description", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                    </SectionBox>

                    <SectionBox title="Contact details block config">
                      <Field label="Main Inquiry Email Address">
                        <input
                          value={formData.infoBlock?.email || ""}
                          onChange={(e) => updateField("infoBlock.email", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      
                      {/* PHONES */}
                      <div className="space-y-3">
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Contact Phone Numbers
                        </span>
                        {formData.infoBlock?.phones?.map((phone: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              value={phone}
                              onChange={(e) => {
                                const newPhones = [...formData.infoBlock.phones];
                                newPhones[idx] = e.target.value;
                                updateField("infoBlock.phones", newPhones);
                              }}
                              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPhones = formData.infoBlock.phones.filter((_: any, i: number) => i !== idx);
                                updateField("infoBlock.phones", newPhones);
                              }}
                              className="p-2 border border-border text-muted-foreground hover:border-destructive hover:text-destructive shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newPhones = [...(formData.infoBlock.phones || []), ""];
                            updateField("infoBlock.phones", newPhones);
                          }}
                          className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-secondary text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Phone
                        </button>
                      </div>

                      {/* ADDRESS LINES */}
                      <div className="space-y-3 pt-4 border-t border-border/40">
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Address lines
                        </span>
                        {formData.infoBlock?.address?.map((line: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              value={line}
                              onChange={(e) => {
                                const newAddr = [...formData.infoBlock.address];
                                newAddr[idx] = e.target.value;
                                updateField("infoBlock.address", newAddr);
                              }}
                              className="w-full border-border border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newAddr = formData.infoBlock.address.filter((_: any, i: number) => i !== idx);
                                updateField("infoBlock.address", newAddr);
                              }}
                              className="p-2 border border-border text-muted-foreground hover:border-destructive hover:text-destructive shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newAddr = [...(formData.infoBlock.address || []), ""];
                            updateField("infoBlock.address", newAddr);
                          }}
                          className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-secondary text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Line
                        </button>
                      </div>

                      {/* HOURS LINES */}
                      <div className="space-y-3 pt-4 border-t border-border/40">
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Office / Availability hours
                        </span>
                        {formData.infoBlock?.hours?.map((line: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              value={line}
                              onChange={(e) => {
                                const newHrs = [...formData.infoBlock.hours];
                                newHrs[idx] = e.target.value;
                                updateField("infoBlock.hours", newHrs);
                              }}
                              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newHrs = formData.infoBlock.hours.filter((_: any, i: number) => i !== idx);
                                updateField("infoBlock.hours", newHrs);
                              }}
                              className="p-2 border border-border text-muted-foreground hover:border-destructive hover:text-destructive shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newHrs = [...(formData.infoBlock.hours || []), ""];
                            updateField("infoBlock.hours", newHrs);
                          }}
                          className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-secondary text-foreground"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Line
                        </button>
                      </div>
                    </SectionBox>
                  </>
                )}

                {selectedPage.slug === "posts-index" && (
                  <>
                    <SectionBox title="Journal Header Info">
                      <Field label="Eyebrow category label text">
                        <input
                          value={formData.header?.label || ""}
                          onChange={(e) => updateField("header.label", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Large Heading Title">
                        <input
                          value={formData.header?.heading || ""}
                          onChange={(e) => updateField("header.heading", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <Field label="Detailed description summary">
                        <textarea
                          rows={4}
                          value={formData.header?.description || ""}
                          onChange={(e) => updateField("header.description", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                    </SectionBox>
                  </>
                )}

                {/* DYNAMIC PAGE SPECIFIC EDITING FIELDS */}
                {selectedPage.isDynamic && (
                  <>
                    <SectionBox title="Custom Page Body Text">
                      <Field label="Page title name">
                        <input
                          value={formData.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary font-display text-lg"
                        />
                      </Field>
                      <Field label="Description Page Excerpt Summary">
                        <textarea
                          rows={3}
                          value={formData.excerpt || ""}
                          onChange={(e) => updateField("excerpt", e.target.value)}
                          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                      </Field>
                      <ImageField 
                        label="Main Page Cover Banner Photo" 
                        path="cover" 
                        url={formData.cover} 
                        aspect={21/9} 
                        onUpload={handleImageFile} 
                      />
                      <Field label="Narrative Page Body content (HTML)">
                        <RichTextEditor
                          value={formData.body ?? ""}
                          onChange={(v) => updateField("body", v)}
                        />
                      </Field>
                    </SectionBox>
                  </>
                )}

              </div>

              {/* Side Panels - SEO configuration */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-paper border border-border p-6 rounded-xl shadow-sm">
                  <h3 className="font-display text-lg text-foreground font-semibold flex items-center gap-1.5 border-b border-border pb-3 mb-4">
                    <Globe className="h-4 w-4 text-primary" />
                    SEO Meta Configurations
                  </h3>
                  <div className="space-y-4">
                    <Field label="Meta Title Tag">
                      <input
                        value={formData.seo?.title || ""}
                        onChange={(e) => updateField("seo.title", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                        placeholder="Page title displayed in search engines"
                      />
                    </Field>
                    <Field label="Meta Description Paragraph">
                      <textarea
                        rows={5}
                        value={formData.seo?.description || ""}
                        onChange={(e) => updateField("seo.description", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                        placeholder="Compelling abstract content description..."
                      />
                    </Field>
                    <Field label="Keywords (Comma separated)">
                      <input
                        value={formData.seo?.keywords || ""}
                        onChange={(e) => updateField("seo.keywords", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                        placeholder="epilepsy, nurses, yes, rwanda"
                      />
                    </Field>
                  </div>
                </div>

                <div className="bg-secondary/20 border border-border p-6 rounded-xl flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-foreground m-0 mb-1">Editor instructions</p>
                    Ensure all labels and buttons link correctly. Images are saved to your global Supabase bucket. Re-publish details instantly overlay live sites. Use "History" tab to revert any layout choices at any point.
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab Content: Live Preview panel */}
          {activeTab === "preview" && formData && (
            <div className="mt-4 border border-border rounded-xl bg-background overflow-hidden shadow-lg animate-in fade-in duration-300">
              <div className="bg-secondary/40 border-b border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-primary" /> Live Layout Mockup Preview
                </span>
                <span className="font-mono text-[10px]">Viewport simulated</span>
              </div>
              <div className="p-1 sm:p-4 bg-cream/10 min-h-[500px]">
                <PageLayoutPreview slug={selectedPage.slug} data={formData} />
              </div>
            </div>
          )}

          {/* Tab Content: Revision History Panel */}
          {activeTab === "history" && (
            <div className="mt-4 bg-paper border border-border p-6 rounded-xl shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-border pb-3">
                <h3 className="font-display text-lg text-foreground font-semibold">Historic Revision snapshots</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A snapshot is saved automatically each time you update page content. Select a rollback revision.
                </p>
              </div>

              <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-background">
                {revisions.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">No historical revisions available for this page yet.</p>
                ) : (
                  revisions.map((rev) => (
                    <div key={rev.id} className="p-5 flex items-center justify-between gap-4 hover:bg-secondary/10 transition-colors">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{rev.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Saved on {new Date(rev.date).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => void handleRestore(rev.id)}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 border border-primary text-primary px-3.5 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-primary hover:text-white disabled:opacity-50 transition-all cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore version
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// Sub-components helpers
function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border/80 bg-background/50 p-5 rounded-lg space-y-5">
      <h4 className="font-display text-base text-foreground font-semibold border-b border-border pb-2 mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

interface ImageFieldProps {
  label: string;
  path: string;
  url?: string;
  aspect: number;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>, targetField: string, aspect: number) => void;
}

function ImageField({ label, path, url, aspect, onUpload }: ImageFieldProps) {
  return (
    <Field label={label}>
      <div className="flex flex-col gap-3 p-3 border border-dashed border-border rounded bg-secondary/10">
        {url && (
          <img
            src={url}
            alt="Preview field"
            className="h-32 w-auto max-w-sm object-cover rounded border border-border"
          />
        )}
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUpload(e, path, aspect)}
            className="text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:border-0 file:text-[0.65rem] file:font-semibold file:uppercase file:tracking-[0.16em] file:bg-foreground file:text-background hover:file:bg-primary file:cursor-pointer transition-colors"
          />
          {url && <span className="text-[10px] text-primary font-mono">✓ Active Cover</span>}
        </div>
      </div>
    </Field>
  );
}

// Scale Mockup Visualizer Mock components
function PageLayoutPreview({ slug, data }: { slug: string; data: any }) {
  if (slug === "home") {
    return (
      <div className="border border-border rounded-lg bg-background p-6 space-y-12 max-w-4xl mx-auto shadow-inner text-sm leading-relaxed text-muted-foreground">
        
        {/* Mock Hero */}
        {data.hero?.visible !== false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-border">
            <div>
              <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{data.hero?.label}</span>
              <h1 className="font-display text-2xl text-foreground font-bold mt-2 leading-tight">
                {data.hero?.heading} <span className="italic text-primary font-normal">{data.hero?.highlightedText}</span>
              </h1>
              <p className="mt-3 text-xs line-clamp-3">{data.hero?.description}</p>
              <div className="mt-4 flex gap-3">
                {data.hero?.buttonText && <span className="px-3 py-1.5 bg-foreground text-background text-[10px] uppercase font-bold rounded-full">{data.hero?.buttonText}</span>}
                {data.hero?.linkText && <span className="px-3 py-1.5 border border-border text-foreground text-[10px] uppercase font-bold rounded-full">{data.hero?.linkText}</span>}
              </div>
            </div>
            {data.hero?.image && (
              <img src={data.hero.image} alt="Hero banner preview" className="w-full aspect-[16/10] object-cover rounded-lg border border-border shadow-sm" />
            )}
          </div>
        )}

        {/* Mock Stats */}
        {data.marquee && (
          <div className="grid grid-cols-4 gap-3 bg-secondary/20 p-4 rounded-lg text-center border border-border">
            {data.marquee.map((f: any, i: number) => (
              <div key={i}>
                <p className="font-display text-base text-foreground font-bold">{f.stat}</p>
                <p className="text-[8px] text-muted-foreground mt-0.5 truncate">{f.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mock Community Event */}
        {data.communityEvent?.visible !== false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-border items-center">
            {data.communityEvent?.image && (
              <img src={data.communityEvent.image} alt="Event preview" className="w-full aspect-[16/10] object-cover rounded-lg border border-border shadow-sm" />
            )}
            <div>
              <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{data.communityEvent?.label}</span>
              <h2 className="font-display text-xl text-foreground font-bold mt-2 leading-tight">
                {data.communityEvent?.heading} <span className="italic">{data.communityEvent?.highlightedText}</span>
              </h2>
              <p className="mt-3 text-xs line-clamp-3">{data.communityEvent?.description}</p>
              {data.communityEvent?.buttonText && <span className="mt-4 inline-block text-[10px] font-bold text-foreground underline">{data.communityEvent?.buttonText}</span>}
            </div>
          </div>
        )}

        {/* Mock CTA */}
        {data.cta?.visible !== false && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-secondary/10 p-5 rounded-lg border border-border items-center">
            <div className="md:col-span-8">
              <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{data.cta?.label}</span>
              <h3 className="font-display text-lg text-foreground font-bold mt-2 leading-tight">{data.cta?.heading}</h3>
              <p className="mt-3 text-xs line-clamp-3">{data.cta?.description}</p>
              <div className="mt-4 flex gap-3">
                {data.cta?.button1Text && <span className="px-3 py-1.5 border border-border text-foreground text-[10px] uppercase font-bold rounded-full">{data.cta?.button1Text}</span>}
                {data.cta?.button2Text && <span className="px-3 py-1.5 bg-primary text-primary-foreground text-[10px] uppercase font-bold rounded-full">{data.cta?.button2Text}</span>}
              </div>
            </div>
            {data.cta?.image && (
              <div className="md:col-span-4">
                <img src={data.cta.image} alt="CTA details preview" className="w-full aspect-[16/10] object-cover rounded-lg border border-border shadow-sm" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (slug === "about") {
    return (
      <div className="border border-border rounded-lg bg-background p-6 space-y-10 max-w-4xl mx-auto shadow-inner text-sm leading-relaxed text-muted-foreground">
        
        {/* About Header */}
        {data.header && (
          <div className="border-b border-border pb-6 text-center">
            <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{data.header?.label}</span>
            <h1 className="font-display text-2xl text-foreground font-bold mt-2 max-w-xl mx-auto leading-tight">{data.header?.heading}</h1>
          </div>
        )}

        {/* Who we are */}
        {data.whoWeAre && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{data.whoWeAre?.label}</span>
              <h2 className="font-display text-lg text-foreground font-bold mt-1 leading-tight">{data.whoWeAre?.heading}</h2>
            </div>
            <div className="md:col-span-8 space-y-3 text-xs">
              {data.whoWeAre.paragraphs?.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* Banner Break */}
        {data.imageBreak?.image && (
          <div>
            <img src={data.imageBreak.image} alt="About sports banner" className="w-full aspect-[16/8] object-cover rounded-lg border border-border shadow-sm" />
            <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground mt-2">{data.imageBreak.caption}</p>
          </div>
        )}

        {/* Facts List */}
        {data.factsList && (
          <div className="pt-6 border-t border-border">
            <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{data.factsList?.label}</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {data.factsList.facts?.map((f: string, i: number) => (
                <div key={i} className="bg-secondary/15 p-4 border border-border rounded-lg">
                  <span className="font-display text-lg text-primary font-bold">0{i + 1}</span>
                  <p className="text-[10px] text-foreground mt-2 leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (slug === "donate") {
    return (
      <div className="border border-border rounded-lg bg-background p-6 space-y-8 max-w-2xl mx-auto shadow-inner text-sm leading-relaxed text-muted-foreground">
        {data.header && (
          <div className="text-center pb-6 border-b border-border">
            <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{data.header?.label}</span>
            <h1 className="font-display text-xl text-foreground font-bold mt-2 leading-tight">{data.header?.heading}</h1>
            <p className="text-xs mt-3 leading-relaxed max-w-md mx-auto">{data.header?.description}</p>
          </div>
        )}

        {data.formConfig && (
          <div className="bg-secondary/10 border border-border p-6 rounded-lg max-w-md mx-auto">
            <h3 className="font-display text-base text-foreground font-semibold mb-4 text-center">{data.formConfig.heading}</h3>
            <div className="grid grid-cols-3 gap-2">
              {data.formConfig.amounts?.map((amt: number) => (
                <span key={amt} className="py-2.5 bg-background border border-border text-center text-xs font-mono font-bold rounded hover:border-primary transition-all text-foreground cursor-default">
                  ${amt.toFixed(2)}
                </span>
              ))}
              <span className="py-2.5 bg-background border border-border text-center text-xs font-bold rounded text-foreground cursor-default">Other</span>
            </div>
            <p className="text-[9px] text-muted-foreground mt-6 text-center">Inquiries: {data.formConfig.inquiryEmail}</p>
          </div>
        )}
      </div>
    );
  }

  if (slug === "contact") {
    return (
      <div className="border border-border rounded-lg bg-background p-6 space-y-8 max-w-4xl mx-auto shadow-inner text-sm leading-relaxed text-muted-foreground">
        {data.header && (
          <div className="pb-6 border-b border-border">
            <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{data.header?.label}</span>
            <h1 className="font-display text-2xl text-foreground font-bold mt-2 leading-tight">{data.header?.heading}</h1>
            <p className="text-xs mt-2">{data.header?.description}</p>
          </div>
        )}

        {data.infoBlock && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[9px] uppercase font-bold text-primary tracking-widest mb-1.5">Email</p>
              <p className="text-xs font-semibold text-foreground truncate">{data.infoBlock.email}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-primary tracking-widest mb-1.5">Phone</p>
              <div className="text-xs font-semibold text-foreground space-y-1 font-mono">
                {data.infoBlock.phones?.map((p: string) => <p key={p}>{p}</p>)}
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-primary tracking-widest mb-1.5">Studio</p>
              <div className="text-xs font-semibold text-foreground space-y-1">
                {data.infoBlock.address?.map((l: string) => <p key={l}>{l}</p>)}
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-primary tracking-widest mb-1.5">Hours</p>
              <div className="text-xs font-semibold text-foreground space-y-1">
                {data.infoBlock.hours?.map((h: string) => <p key={h}>{h}</p>)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dynamic preview or simple generic details preview
  return (
    <div className="border border-border rounded-lg bg-background p-6 space-y-6 max-w-2xl mx-auto shadow-inner text-sm leading-relaxed text-muted-foreground">
      {data.cover && (
        <img src={data.cover} alt="Header cover dynamic page" className="w-full aspect-[21/9] object-cover rounded-lg border border-border shadow-sm" />
      )}
      <div>
        <h1 className="font-display text-2xl text-foreground font-bold leading-tight">{data.title || "Page Title"}</h1>
        {data.excerpt && <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed">{data.excerpt}</p>}
      </div>
      
      {data.body && (
        <div 
          className="border-t border-border pt-4 text-xs prose prose-neutral max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      )}
    </div>
  );
}
