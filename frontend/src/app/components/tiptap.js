// 'use client'
// import { useState, useEffect } from 'react'
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import Underline from '@tiptap/extension-underline'
// import Highlight from '@tiptap/extension-highlight'
// import Subscript from '@tiptap/extension-subscript'
// import Superscript from '@tiptap/extension-superscript'
// import TextAlign from '@tiptap/extension-text-align'
// import Heading from '@tiptap/extension-heading'

// const TREATMENT_SECTIONS = [
//     {
//         id: 'title-page',
//         title: 'Title Page',
//         description: 'Project name, writer\'s name, contact info',
//         placeholder: 'Enter your project title, name, and contact information...',
//         minWords: 5
//     },
//     {
//         id: 'logline',
//         title: 'Logline',
//         description: '1–2 sentences summarizing the hook',
//         placeholder: 'Write a compelling 1-2 sentence summary that captures the essence of your story...',
//         minWords: 10
//     },
//     {
//         id: 'synopsis',
//         title: 'Synopsis',
//         description: '1–3 paragraphs covering the full arc',
//         placeholder: 'Provide a 1-3 paragraph overview covering the complete story arc...',
//         minWords: 30
//     },
//     {
//         id: 'characters',
//         title: 'Characters',
//         description: 'Short bios of major characters',
//         placeholder: 'Describe your main characters with brief biographical information...',
//         minWords: 25
//     },
//     {
//         id: 'story',
//         title: 'Story',
//         description: '2–10 pages narrating the entire plot in present tense',
//         placeholder: 'Write the complete story narrative in present tense, describing all major plot events without dialogue formatting...',
//         minWords: 200
//     },
//     {
//         id: 'tone-style',
//         title: 'Tone & Style Notes',
//         description: 'References to similar works, visual style (Optional)',
//         placeholder: 'Describe the tone, style, and any reference works that capture the mood you\'re aiming for...',
//         minWords: 15
//     }
// ]
// export default function Tiptap() {
//     const [currentSection, setCurrentSection] = useState(0)
//         const [sectionContent, setSectionContent] = useState({})
//         const [sectionWordCounts, setSectionWordCounts] = useState({})

//         const currentSectionData = TREATMENT_SECTIONS[currentSection]

//     const editor = useEditor({
//         // Add custom heading configurations for different sizes
//         extensions: [
//             StarterKit.configure({
//                 heading: false, // Disable default heading to add custom ones
//                 history: {
//                     depth: 100,
//                 },
//                 paragraph: {
//                     HTMLAttributes: {
//                         style: 'margin: 8px 0; line-height: 1.5;'
//                     },
//                 },
//                 bulletList: {
//                     HTMLAttributes: {
//                         style: 'margin: 8px 0; padding-left: 24px; list-style-type: disc;'
//                     },
//                 },
//                 orderedList: {
//                     HTMLAttributes: {
//                         style: 'margin: 8px 0; padding-left: 24px; list-style-type: decimal;'
//                     },
//                 },
//                 listItem: {
//                     HTMLAttributes: {
//                         style: 'margin: 4px 0;'
//                     },
//                 },
//                 bold: {
//                     HTMLAttributes: {
//                         style: 'font-weight: bold;'
//                     },
//                 },
//                 italic: {
//                     HTMLAttributes: {
//                         style: 'font-style: italic;'
//                     },
//                 },
//             }),
//             // Use regular Heading extension with renderHTML override
//             Heading.extend({
//                 renderHTML({ node, HTMLAttributes }) {
//                     const level = node.attrs.level
//                     const styles = {
//                         1: 'font-size: 2em; font-weight: bold; margin: 16px 0 8px 0; line-height: 1.3;',
//                         2: 'font-size: 1.5em; font-weight: bold; margin: 16px 0 8px 0; line-height: 1.3;',
//                         3: 'font-size: 1.25em; font-weight: bold; margin: 16px 0 8px 0; line-height: 1.3;',
//                         4: 'font-size: 1.1em; font-weight: bold; margin: 16px 0 8px 0; line-height: 1.3;',
//                     }

//                     return [`h${level}`, { ...HTMLAttributes, style: styles[level] }, 0]
//                 },
//             }).configure({
//                 levels: [1, 2, 3, 4],
//             }),
//             Underline.configure({
//                 HTMLAttributes: {
//                     style: 'text-decoration: underline;'
//                 },
//             }),
//             Highlight.configure({
//                 HTMLAttributes: {
//                     style: 'background-color: yellow; padding: 2px 4px; border-radius: 2px;'
//                 },
//             }),
//             Subscript.configure({
//                 HTMLAttributes: {
//                     style: 'vertical-align: sub; font-size: smaller;'
//                 },
//             }),
//             Superscript.configure({
//                 HTMLAttributes: {
//                     style: 'vertical-align: super; font-size: smaller;'
//                 },
//             }),
//             TextAlign.configure({
//                 types: ['heading', 'paragraph'],
//             }),
//         ],
//         content: 'Hello World! 🌎️',
//         immediatelyRender: false,
//         editorProps: {
//             attributes: {
//                 class: 'focus:outline-none min-h-[200px] p-3',
//                 style: 'background: white; border: none;',
//                 'data-placeholder': 'Start typing...'
//             },
//             handleKeyDown: (view, event) => {
//                 console.log('⌨️ Key pressed:', {
//                     key: event.key,
//                     code: event.code,
//                     ctrlKey: event.ctrlKey,
//                     metaKey: event.metaKey,
//                     shiftKey: event.shiftKey,
//                     target: event.target.tagName
//                 });
//                 return false;
//             },
//             handleTextInput: (view, from, to, text) => {
//                 console.log('📝 Text input:', {
//                     from,
//                     to,
//                     text,
//                     length: text.length,
//                     currentHTML: view.dom.innerHTML
//                 });
//                 return false;
//             }
//         },
//         onUpdate: ({ editor }) => {
//             const html = editor.getHTML();
//             const text = editor.getText();
//             const cleanHTML = html.replace(/<p class="editor-paragraph"><\/p>/g, '').trim();
//             console.log('📝 Content updated:', {
//                 rawHTML: html,
//                 cleanHTML: cleanHTML,
//                 text: text.trim(),
//                 isEmpty: editor.isEmpty,
//                 characterCount: text.trim().length,
//                 wordCount: text.trim().split(/\s+/).filter(word => word.length > 0).length
//             });
//         },
//         onCreate: ({ editor }) => {
//             console.log('🎉 Editor created:', {
//                 html: editor.getHTML(),
//                 canUndo: editor.can().undo(),
//                 canRedo: editor.can().redo(),
//                 isEditable: editor.isEditable
//             });
//         },
//         onSelectionUpdate: ({ editor }) => {
//             const { from, to } = editor.state.selection;
//             const selectedText = editor.state.doc.textBetween(from, to, ' ');
//             console.log('🔍 Selection changed:', {
//                 from,
//                 to,
//                 selectedText,
//                 isEmpty: selectedText === '',
//                 cursorPosition: from === to ? from : `${from}-${to}`
//             });
//         },
//         onTransaction: ({ editor, transaction }) => {
//             console.log('⚡ Transaction:', {
//                 docChanged: transaction.docChanged,
//                 steps: transaction.steps.length,
//                 stepTypes: transaction.steps.map(step => step.constructor.name),
//                 html: editor.getHTML(),
//                 isEditable: editor.isEditable,
//                 isFocused: editor.isFocused
//             });
//         },
//         onFocus: ({ editor }) => {
//             console.log('👁️ Editor focused', {
//                 isEditable: editor.isEditable,
//                 isEmpty: editor.isEmpty,
//                 html: editor.getHTML()
//             });
//         },
//         onBlur: ({ editor }) => {
//             console.log('😴 Editor blurred', {
//                 finalHTML: editor.getHTML(),
//                 finalText: editor.getText()
//             });
//         },
//         // Add keyboard event logging
//         editable: true,
//         parseOptions: {
//             preserveWhitespace: 'full',
//         }
//     })
//     const isSectionComplete = (sectionId) => {
//         const section = TREATMENT_SECTIONS.find(s => s.id === sectionId)
//         const wordCount = sectionWordCounts[sectionId] || 0
//         return wordCount >= section.minWords
//     }

//     const canProceedToNext = () => {
//         return isSectionComplete(currentSectionData.id)
//     }

//     const goToNextSection = () => {
//         if (currentSection < TREATMENT_SECTIONS.length - 1 && canProceedToNext()) {
//             setCurrentSection(currentSection + 1)
//         }
//     }

//     const goToPreviousSection = () => {
//         if (currentSection > 0) {
//             setCurrentSection(currentSection - 1)
//         }
//     }

//     const goToSection = (index) => {
//         // Can only go to sections that are complete or the next incomplete section
//         const canAccess = index <= currentSection ||
//             (index === currentSection + 1 && canProceedToNext()) ||
//             TREATMENT_SECTIONS.slice(0, index).every(section => isSectionComplete(section.id))

//         if (canAccess) {
//             setCurrentSection(index)
//         }
//     }
//     // Add a loading state to prevent hydration issues
//     if (!editor) {
//         return <div className="p-4 border rounded-xl h-32 animate-pulse bg-gray-100"></div>
//     }

//     const currentWordCount = sectionWordCounts[currentSectionData.id] || 0
//     const progress = Math.min((currentWordCount / currentSectionData.minWords) * 100, 100)

//     return (
//         <div style={{
//             width: '100%',
//             maxWidth: '1000px',
//             margin: '0 auto',
//             fontFamily: 'system-ui, -apple-system, sans-serif',
//             color: 'black'
//         }}>
//             {/* Progress Bar */}
//             <div style={{
//                 marginBottom: '24px',
//                 padding: '16px',
//                 backgroundColor: '#f8fafc',
//                 borderRadius: '8px',
//                 border: '1px solid #e2e8f0'
//             }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
//                     <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Script Treatment</h2>
//                     <span style={{ fontSize: '14px', color: '#64748b' }}>
//                         Section {currentSection + 1} of {TREATMENT_SECTIONS.length}
//                     </span>
//                 </div>

//                 <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
//                     gap: '8px',
//                     marginBottom: '16px'
//                 }}>
//                     {TREATMENT_SECTIONS.map((section, index) => {
//                         const isComplete = isSectionComplete(section.id)
//                         const isCurrent = index === currentSection
//                         const isAccessible = index <= currentSection ||
//                             (index === currentSection + 1 && canProceedToNext()) ||
//                             TREATMENT_SECTIONS.slice(0, index).every(s => isSectionComplete(s.id))

//                         return (
//                             <button
//                                 key={section.id}
//                                 onClick={() => goToSection(index)}
//                                 disabled={!isAccessible}
//                                 style={{
//                                     padding: '8px 12px',
//                                     fontSize: '12px',
//                                     borderRadius: '6px',
//                                     border: isCurrent ? '2px solid #3b82f6' : '1px solid #e2e8f0',
//                                     backgroundColor: isComplete ? '#dcfce7' : isCurrent ? '#eff6ff' : 'white',
//                                     color: isComplete ? '#166534' : isCurrent ? '#1d4ed8' : isAccessible ? 'black' : '#9ca3af',
//                                     cursor: isAccessible ? 'pointer' : 'not-allowed',
//                                     opacity: isAccessible ? 1 : 0.5,
//                                     textAlign: 'center',
//                                     fontWeight: isCurrent ? 'bold' : 'normal'
//                                 }}
//                             >
//                                 {isComplete && '✓ '}{section.title}
//                             </button>
//                         )
//                     })}
//                 </div>
//             </div>

//             {/* Current Section */}
//             <div style={{
//                 border: '2px solid #e5e7eb',
//                 borderRadius: '8px',
//                 overflow: 'hidden',
//                 backgroundColor: 'white',
//                 boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
//             }}>
//                 {/* Section Header */}
//                 <div style={{
//                     padding: '16px',
//                     backgroundColor: '#f8fafc',
//                     borderBottom: '1px solid #e5e7eb'
//                 }}>
//                     <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>
//                         {currentSectionData.title}
//                     </h3>
//                     <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '14px' }}>
//                         {currentSectionData.description}
//                     </p>

//                     {/* Word Count Progress */}
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                         <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
//                             <div style={{
//                                 width: `${progress}%`,
//                                 height: '100%',
//                                 backgroundColor: progress >= 100 ? '#22c55e' : '#3b82f6',
//                                 transition: 'width 0.3s ease'
//                             }}></div>
//                         </div>
//                         <span style={{ fontSize: '12px', color: '#64748b', minWidth: '80px' }}>
//                             {currentWordCount}/{currentSectionData.minWords} words
//                         </span>
//                     </div>
//                 </div>

//                 {/* Toolbar */}
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', padding: '12px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
//                     {/* Undo / Redo */}
//                     <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}
//                         style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', opacity: !editor.can().undo() ? 0.5 : 1 }}>Undo</button>
//                     <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}
//                         style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', opacity: !editor.can().redo() ? 0.5 : 1 }}>Redo</button>

//                     <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

//                     {/* Headings */}
//                     {[1, 2, 3, 4].map(level => (
//                         <button key={level}
//                             onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
//                             style={{
//                                 padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                                 background: editor.isActive('heading', { level }) ? '#dbeafe' : 'white',
//                                 borderColor: editor.isActive('heading', { level }) ? '#93c5fd' : '#d1d5db',
//                                 color: editor.isActive('heading', { level }) ? '#1d4ed8' : 'black'
//                             }}>
//                             H{level}
//                         </button>
//                     ))}

//                     <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

//                     {/* Lists */}
//                     <button onClick={() => editor.chain().focus().toggleBulletList().run()}
//                         style={{
//                             padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                             background: editor.isActive('bulletList') ? '#dbeafe' : 'white',
//                             color: editor.isActive('bulletList') ? '#1d4ed8' : 'black'
//                         }}>• List</button>
//                     <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
//                         style={{
//                             padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                             background: editor.isActive('orderedList') ? '#dbeafe' : 'white',
//                             color: editor.isActive('orderedList') ? '#1d4ed8' : 'black'
//                         }}>1. List</button>

//                     <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

//                     {/* Bold / Italic / Underline */}
//                     <button onClick={() => editor.chain().focus().toggleBold().run()}
//                         style={{
//                             padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                             background: editor.isActive('bold') ? '#dbeafe' : 'white',
//                             color: editor.isActive('bold') ? '#1d4ed8' : 'black',
//                             fontWeight: 'bold'
//                         }}>B</button>
//                     <button onClick={() => editor.chain().focus().toggleItalic().run()}
//                         style={{
//                             padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                             background: editor.isActive('italic') ? '#dbeafe' : 'white',
//                             color: editor.isActive('italic') ? '#1d4ed8' : 'black',
//                             fontStyle: 'italic'
//                         }}>I</button>
//                     <button onClick={() => editor.chain().focus().toggleUnderline().run()}
//                         style={{
//                             padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                             background: editor.isActive('underline') ? '#dbeafe' : 'white',
//                             color: editor.isActive('underline') ? '#1d4ed8' : 'black',
//                             textDecoration: 'underline'
//                         }}>U</button>

//                     {/* Highlight */}
//                     <button onClick={() => editor.chain().focus().toggleHighlight().run()}
//                         style={{
//                             padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                             background: editor.isActive('highlight') ? '#fef3c7' : 'white',
//                             borderColor: editor.isActive('highlight') ? '#fbbf24' : '#d1d5db',
//                             color: editor.isActive('highlight') ? '#92400e' : 'black'
//                         }}>Highlight</button>

//                     <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

//                     {/* Subscript / Superscript */}
//                     <button onClick={() => editor.chain().focus().toggleSubscript().run()}
//                         style={{
//                             padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                             background: editor.isActive('subscript') ? '#dbeafe' : 'white',
//                             color: editor.isActive('subscript') ? '#1d4ed8' : 'black'
//                         }}>X₂</button>
//                     <button onClick={() => editor.chain().focus().toggleSuperscript().run()}
//                         style={{
//                             padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                             background: editor.isActive('superscript') ? '#dbeafe' : 'white',
//                             color: editor.isActive('superscript') ? '#1d4ed8' : 'black'
//                         }}>X²</button>

//                     <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

//                     {/* Alignment */}
//                     {[
//                         { align: 'left', label: '⬅' },
//                         { align: 'center', label: '↔' },
//                         { align: 'right', label: '➡' },
//                         { align: 'justify', label: '⬌' },
//                     ].map(({ align, label }) => (
//                         <button key={align}
//                             onClick={() => editor.chain().focus().setTextAlign(align).run()}
//                             style={{
//                                 padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px',
//                                 background: editor.isActive({ textAlign: align }) ? '#dbeafe' : 'white',
//                                 borderColor: editor.isActive({ textAlign: align }) ? '#93c5fd' : '#d1d5db',
//                                 color: editor.isActive({ textAlign: align }) ? '#1d4ed8' : 'black'
//                             }}>{label}</button>
//                     ))}
//                 </div>

//                 {/* Editor */}
//                 <div style={{ backgroundColor: 'white', minHeight: '200px', color: 'black' }}>
//                     <EditorContent editor={editor} style={{ minHeight: '200px', padding: '16px' }} />
//                 </div>

//                 {/* Navigation */}
//                 <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
//                     <button onClick={() => setCurrentSection(currentSection - 1)} disabled={currentSection === 0}
//                         style={{
//                             padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db',
//                             background: currentSection === 0 ? '#f3f4f6' : 'white',
//                             cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
//                         }}>Previous</button>

//                     <button onClick={() => setCurrentSection(currentSection + 1)}
//                         // disabled={!canProceed() || currentSection === sections.length - 1}
//                         style={{
//                             padding: '8px 16px', borderRadius: '6px',
//                             border: '1px solid #d1d5db',
//                             // background: !canProceed() ? '#f3f4f6' : '#2563eb',
//                             // color: !canProceed() ? '#9ca3af' : 'white',
//                             // cursor: !canProceed() ? 'not-allowed' : 'pointer',
//                         }}>
//                         {/* {currentSection === sections.length - 1 ? 'Finish' : 'Next'} */}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }
'use client'
import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Heading from '@tiptap/extension-heading'

const TREATMENT_SECTIONS = [
  {
    id: 'title-page',
    title: 'Title Page',
    description: 'Project name, writer\'s name, contact info',
    placeholder: 'Enter your project title, name, and contact information...',
    minWords: 5
  },
  {
    id: 'logline',
    title: 'Logline',
    description: '1–2 sentences summarizing the hook',
    placeholder: 'Write a compelling 1-2 sentence summary that captures the essence of your story...',
    minWords: 10
  },
  {
    id: 'synopsis',
    title: 'Synopsis',
    description: '1–3 paragraphs covering the full arc',
    placeholder: 'Provide a 1-3 paragraph overview covering the complete story arc...',
    minWords: 30
  },
  {
    id: 'characters',
    title: 'Characters',
    description: 'Short bios of major characters',
    placeholder: 'Describe your main characters with brief biographical information...',
    minWords: 25
  },
  {
    id: 'story',
    title: 'Story',
    description: '2–10 pages narrating the entire plot in present tense',
    placeholder: 'Write the complete story narrative in present tense, describing all major plot events without dialogue formatting...',
    minWords: 200
  },
  {
    id: 'tone-style',
    title: 'Tone & Style Notes',
    description: 'References to similar works, visual style (Optional)',
    placeholder: 'Describe the tone, style, and any reference works that capture the mood you\'re aiming for...',
    minWords: 15
  }
]

const EDITOR_EXTENSIONS = [
  StarterKit.configure({
    heading: false,
    history: { depth: 100 },
    paragraph: {
      HTMLAttributes: {
        style: 'margin: 8px 0; line-height: 1.5;'
      },
    },
    bulletList: {
      HTMLAttributes: {
        style: 'margin: 8px 0; padding-left: 24px; list-style-type: disc;'
      },
    },
    orderedList: {
      HTMLAttributes: {
        style: 'margin: 8px 0; padding-left: 24px; list-style-type: decimal;'
      },
    },
    listItem: {
      HTMLAttributes: {
        style: 'margin: 4px 0;'
      },
    },
    bold: {
      HTMLAttributes: {
        style: 'font-weight: bold;'
      },
    },
    italic: {
      HTMLAttributes: {
        style: 'font-style: italic;'
      },
    },
  }),
  Heading.extend({
    renderHTML({ node, HTMLAttributes }) {
      const level = node.attrs.level
      const styles = {
        1: 'font-size: 2em; font-weight: bold; margin: 16px 0 8px 0; line-height: 1.3;',
        2: 'font-size: 1.5em; font-weight: bold; margin: 16px 0 8px 0; line-height: 1.3;',
        3: 'font-size: 1.25em; font-weight: bold; margin: 16px 0 8px 0; line-height: 1.3;',
        4: 'font-size: 1.1em; font-weight: bold; margin: 16px 0 8px 0; line-height: 1.3;',
      }
      return [`h${level}`, { ...HTMLAttributes, style: styles[level] }, 0]
    },
  }).configure({ levels: [1, 2, 3, 4] }),
  Underline.configure({
    HTMLAttributes: { style: 'text-decoration: underline;' },
  }),
  Highlight.configure({
    HTMLAttributes: { style: 'background-color: yellow; padding: 2px 4px; border-radius: 2px;' },
  }),
  Subscript.configure({
    HTMLAttributes: { style: 'vertical-align: sub; font-size: smaller;' },
  }),
  Superscript.configure({
    HTMLAttributes: { style: 'vertical-align: super; font-size: smaller;' },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
]

const TOOLBAR_BUTTONS = [
  {
    type: 'group', items: [
      { id: 'undo', label: 'Undo', action: (editor) => editor.chain().focus().undo().run(), canExecute: (editor) => editor.can().undo() },
      { id: 'redo', label: 'Redo', action: (editor) => editor.chain().focus().redo().run(), canExecute: (editor) => editor.can().redo() }
    ]
  },
  {
    type: 'group', items: [
      { id: 'h1', label: 'H1', action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: (editor) => editor.isActive('heading', { level: 1 }) },
      { id: 'h2', label: 'H2', action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (editor) => editor.isActive('heading', { level: 2 }) },
      { id: 'h3', label: 'H3', action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: (editor) => editor.isActive('heading', { level: 3 }) },
      { id: 'h4', label: 'H4', action: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(), isActive: (editor) => editor.isActive('heading', { level: 4 }) }
    ]
  },
  {
    type: 'group', items: [
      { id: 'bulletList', label: '• List', action: (editor) => editor.chain().focus().toggleBulletList().run(), isActive: (editor) => editor.isActive('bulletList') },
      { id: 'orderedList', label: '1. List', action: (editor) => editor.chain().focus().toggleOrderedList().run(), isActive: (editor) => editor.isActive('orderedList') }
    ]
  },
  {
    type: 'group', items: [
      { id: 'bold', label: 'B', action: (editor) => editor.chain().focus().toggleBold().run(), isActive: (editor) => editor.isActive('bold'), style: { fontWeight: 'bold' } },
      { id: 'italic', label: 'I', action: (editor) => editor.chain().focus().toggleItalic().run(), isActive: (editor) => editor.isActive('italic'), style: { fontStyle: 'italic' } },
      { id: 'underline', label: 'U', action: (editor) => editor.chain().focus().toggleUnderline().run(), isActive: (editor) => editor.isActive('underline'), style: { textDecoration: 'underline' } }
    ]
  },
  {
    type: 'group', items: [
      { id: 'highlight', label: 'Highlight', action: (editor) => editor.chain().focus().toggleHighlight().run(), isActive: (editor) => editor.isActive('highlight') }
    ]
  },
  {
    type: 'group', items: [
      { id: 'subscript', label: 'X₂', action: (editor) => editor.chain().focus().toggleSubscript().run(), isActive: (editor) => editor.isActive('subscript') },
      { id: 'superscript', label: 'X²', action: (editor) => editor.chain().focus().toggleSuperscript().run(), isActive: (editor) => editor.isActive('superscript') }
    ]
  },
  {
    type: 'group', items: [
      { id: 'align-left', label: '⬅', action: (editor) => editor.chain().focus().setTextAlign('left').run(), isActive: (editor) => editor.isActive({ textAlign: 'left' }) },
      { id: 'align-center', label: '↔', action: (editor) => editor.chain().focus().setTextAlign('center').run(), isActive: (editor) => editor.isActive({ textAlign: 'center' }) },
      { id: 'align-right', label: '➡', action: (editor) => editor.chain().focus().setTextAlign('right').run(), isActive: (editor) => editor.isActive({ textAlign: 'right' }) },
      { id: 'align-justify', label: '⬌', action: (editor) => editor.chain().focus().setTextAlign('justify').run(), isActive: (editor) => editor.isActive({ textAlign: 'justify' }) }
    ]
  }
]

function ToolbarButton({ button, editor }) {
  const isActive = button.isActive ? button.isActive(editor) : false
  const canExecute = button.canExecute ? button.canExecute(editor) : true

  return (
    <button
      onClick={() => button.action(editor)}
      disabled={!canExecute}
      className={`px-3 py-1.5 text-sm border rounded ${isActive
        ? 'bg-blue-50 border-blue-200 text-blue-700'
        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        } ${!canExecute ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={button.style}
    >
      {button.label}
    </button>
  )
}

function Toolbar({ editor }) {
  return (
    <div className="flex flex-wrap gap-1 p-3 bg-gray-50 border-b border-gray-200">
      {TOOLBAR_BUTTONS.map((group, groupIndex) => (
        <div key={groupIndex} className="flex gap-1">
          {group.items.map((button) => (
            <ToolbarButton key={button.id} button={button} editor={editor} />
          ))}
          {groupIndex < TOOLBAR_BUTTONS.length - 1 && (
            <div className="w-px h-6 bg-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  )
}

function SectionHeader({ section, wordCount, progress }) {
  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <h3 className="text-xl font-bold mb-2">{section.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{section.description}</p>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
              }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 min-w-20">
          {wordCount}/{section.minWords} words
        </span>
      </div>
    </div>
  )
}

function SectionNavigation({ sections, currentIndex, wordCounts, onSectionChange }) {
  const isComplete = (sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    const wordCount = wordCounts[sectionId] || 0
    return wordCount >= section.minWords
  }

  const canAccessSection = (index) => {
    if (index <= currentIndex) return true
    return sections.slice(0, index).every(section => isComplete(section.id))
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
      {sections.map((section, index) => {
        const completed = isComplete(section.id)
        const current = index === currentIndex
        const accessible = canAccessSection(index)

        return (
          <button
            key={section.id}
            onClick={() => accessible && onSectionChange(index)}
            disabled={!accessible}
            className={`p-2 text-xs rounded-md border transition-colors ${current
              ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
              : completed
                ? 'border-green-300 bg-green-50 text-green-700'
                : accessible
                  ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {completed && '✓ '}{section.title}
          </button>
        )
      })}
    </div>
  )
}

function NavigationButtons({ currentIndex, sectionsLength, canProceed, onPrevious, onNext }) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === sectionsLength - 1

  return (
    <div className="flex justify-between p-3 border-t border-gray-200 bg-gray-50">
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className={`px-4 py-2 text-sm rounded-md border ${isFirst
          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
      >
        Previous
      </button>

      <button
        onClick={onNext}
        disabled={isLast || !canProceed}
        className={`px-4 py-2 text-sm rounded-md border ${(isLast || !canProceed)
          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'border-blue-300 bg-blue-500 text-white hover:bg-blue-600'
          }`}
      >
        {isLast ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}

export default function TreatmentEditor() {
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionContent, setSectionContent] = useState({})
  const [sectionWordCounts, setSectionWordCounts] = useState({})
  const [currentUserId, setCurrentUserId] = useState(null)
  const [matchId, setMatchId] = useState(null)

  

  const currentSectionData = TREATMENT_SECTIONS[currentSection]

  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: sectionContent[currentSectionData.id] || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-48 p-4',
        style: 'background: white; border: none;'
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const text = editor.getText()
      const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length

      setSectionContent(prev => ({
        ...prev,
        [currentSectionData.id]: html
      }))

      setSectionWordCounts(prev => ({
        ...prev,
        [currentSectionData.id]: wordCount
      }))
    }
  })

  // Update editor content when section changes (but not when content updates)
  useEffect(() => {
    if (editor && currentSectionData) {
      const content = sectionContent[currentSectionData.id] || ''
      editor.commands.setContent(content)
    }
  }, [currentSection, editor])

  const currentWordCount = sectionWordCounts[currentSectionData.id] || 0
  const progress = (currentWordCount / currentSectionData.minWords) * 100
  const canProceed = currentWordCount >= currentSectionData.minWords

  const handleSectionChange = (index) => {
    setCurrentSection(index)
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleNext = () => {
    if (currentSection < TREATMENT_SECTIONS.length - 1 && canProceed) {
      setCurrentSection(currentSection + 1)
    }
  }
  const exportData = () => {
    return {
      sections: sectionContent,
      wordCounts: sectionWordCounts,
      completedSections: TREATMENT_SECTIONS.filter(section =>
        (sectionWordCounts[section.id] || 0) >= section.minWords
      ).map(s => s.id),
      metadata: {
        totalWords: Object.values(sectionWordCounts).reduce((a, b) => a + b, 0),
        completedAt: new Date().toISOString(),
        progress: (Object.keys(sectionContent).length / TREATMENT_SECTIONS.length) * 100
      }
    }
  }
  useEffect(() => {
  const fetchUserAndMatch = async () => {
    // const [currentUserId, setCurrentUserId] = useState(null)
    
    try {
      // Fetch current user
      const userRes = await fetch('http://localhost:8000/auth/me', {
        credentials: 'include'
      })
      if (userRes.ok) {
        const userData = await userRes.json()
        console.log("DADADADADADADAD = = = ",userData);
        
        setCurrentUserId(userData.profile.user_id)
      }

      // Get matchId from URL params (you'll need to pass this)
      const params = new URLSearchParams(window.location.search)
      const matchIdFromUrl = params.get('matchId')
      setMatchId(matchIdFromUrl)
    } catch (error) {
      console.error('Failed to fetch user/match:', error)
    }
  }

  fetchUserAndMatch()
}, [])

  const handleSubmit = async () => {
    const data = exportData()
    console.log("Exp data = = ", data);
    const storyPayload = {
      userId: currentUserId,
      matchId: matchId,
      content: {
        sections: data.sections,
        wordCounts: data.wordCounts,
        completedSections: data.completedSections,
        metadata: data.metadata
      },
      feedback: [],
      averageStars: 0.0,
      status: "submitted"
    }
    console.log("Submitting story:", storyPayload);

  try {
    const response = await fetch('/api/editor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(storyPayload),
    })

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit story');
      }

      const result = await response.json();
      console.log('Story submitted:', result);

      // Redirect or show success message
      alert('Story submitted successfully!');
      window.location.href = '/match-results';

    } catch (error) {
      console.error('Error submitting story:', error);
      alert(error.message);
    }
  }
  if (!editor) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto font-sans text-black">
      {/* Progress Header */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">Script Treatment</h2>
          <span className="text-sm text-gray-500">
            Section {currentSection + 1} of {TREATMENT_SECTIONS.length}
          </span>
        </div>

        <SectionNavigation
          sections={TREATMENT_SECTIONS}
          currentIndex={currentSection}
          wordCounts={sectionWordCounts}
          onSectionChange={handleSectionChange}
        />
      </div>

      {/* Main Editor */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <SectionHeader
          section={currentSectionData}
          wordCount={currentWordCount}
          progress={progress}
        />

        <Toolbar editor={editor} />

        <div className="bg-white min-h-48 text-black">
          <EditorContent editor={editor} />
        </div>

        <NavigationButtons
          currentIndex={currentSection}
          sectionsLength={TREATMENT_SECTIONS.length}
          canProceed={canProceed}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Export Treatment
        </button>
      </div>
    </div>
  )
}