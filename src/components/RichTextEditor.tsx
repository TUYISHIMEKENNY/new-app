import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Heading2, Heading3 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md w-full my-4 object-cover',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 bg-background border border-border mt-2 rounded-b-md',
      },
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      // 1. Upload to Supabase gallery bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `webinars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Get public URL
      const { data } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // 3. Insert into editor
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please check your connection.');
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-1 border border-border bg-secondary/50 p-2 rounded-t-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md hover:bg-background transition-colors ${editor.isActive('bold') ? 'bg-background shadow-sm' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md hover:bg-background transition-colors ${editor.isActive('italic') ? 'bg-background shadow-sm' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md hover:bg-background transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-background shadow-sm' : ''}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-md hover:bg-background transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-background shadow-sm' : ''}`}
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md hover:bg-background transition-colors ${editor.isActive('bulletList') ? 'bg-background shadow-sm' : ''}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md hover:bg-background transition-colors ${editor.isActive('orderedList') ? 'bg-background shadow-sm' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <label className="p-2 rounded-md hover:bg-background transition-colors cursor-pointer text-primary flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Add Image</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload} 
          />
        </label>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
