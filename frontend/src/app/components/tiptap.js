'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Heading from '@tiptap/extension-heading'


export default function Tiptap() {
    const editor = useEditor({
        // Add custom heading configurations for different sizes
        extensions: [
            StarterKit.configure({
                heading: false, // Disable default heading to add custom ones
                history: {
                    depth: 100,
                },
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
            // Use regular Heading extension with renderHTML override
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
            }).configure({
                levels: [1, 2, 3, 4],
            }),
            Underline.configure({
                HTMLAttributes: {
                    style: 'text-decoration: underline;'
                },
            }),
            Highlight.configure({
                HTMLAttributes: {
                    style: 'background-color: yellow; padding: 2px 4px; border-radius: 2px;'
                },
            }),
            Subscript.configure({
                HTMLAttributes: {
                    style: 'vertical-align: sub; font-size: smaller;'
                },
            }),
            Superscript.configure({
                HTMLAttributes: {
                    style: 'vertical-align: super; font-size: smaller;'
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: 'Hello World! 🌎️',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'focus:outline-none min-h-[200px] p-3',
                style: 'background: white; border: none;',
                'data-placeholder': 'Start typing...'
            },
            handleKeyDown: (view, event) => {
                console.log('⌨️ Key pressed:', {
                    key: event.key,
                    code: event.code,
                    ctrlKey: event.ctrlKey,
                    metaKey: event.metaKey,
                    shiftKey: event.shiftKey,
                    target: event.target.tagName
                });
                return false;
            },
            handleTextInput: (view, from, to, text) => {
                console.log('📝 Text input:', {
                    from,
                    to,
                    text,
                    length: text.length,
                    currentHTML: view.dom.innerHTML
                });
                return false;
            }
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const text = editor.getText();
            const cleanHTML = html.replace(/<p class="editor-paragraph"><\/p>/g, '').trim();
            console.log('📝 Content updated:', {
                rawHTML: html,
                cleanHTML: cleanHTML,
                text: text.trim(),
                isEmpty: editor.isEmpty,
                characterCount: text.trim().length,
                wordCount: text.trim().split(/\s+/).filter(word => word.length > 0).length
            });
        },
        onCreate: ({ editor }) => {
            console.log('🎉 Editor created:', {
                html: editor.getHTML(),
                canUndo: editor.can().undo(),
                canRedo: editor.can().redo(),
                isEditable: editor.isEditable
            });
        },
        onSelectionUpdate: ({ editor }) => {
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to, ' ');
            console.log('🔍 Selection changed:', {
                from,
                to,
                selectedText,
                isEmpty: selectedText === '',
                cursorPosition: from === to ? from : `${from}-${to}`
            });
        },
        onTransaction: ({ editor, transaction }) => {
            console.log('⚡ Transaction:', {
                docChanged: transaction.docChanged,
                steps: transaction.steps.length,
                stepTypes: transaction.steps.map(step => step.constructor.name),
                html: editor.getHTML(),
                isEditable: editor.isEditable,
                isFocused: editor.isFocused
            });
        },
        onFocus: ({ editor }) => {
            console.log('👁️ Editor focused', {
                isEditable: editor.isEditable,
                isEmpty: editor.isEmpty,
                html: editor.getHTML()
            });
        },
        onBlur: ({ editor }) => {
            console.log('😴 Editor blurred', {
                finalHTML: editor.getHTML(),
                finalText: editor.getText()
            });
        },
        // Add keyboard event logging
        editable: true,
        parseOptions: {
            preserveWhitespace: 'full',
        }
    })

    // Add a loading state to prevent hydration issues
    if (!editor) {
        return <div className="p-4 border rounded-xl h-32 animate-pulse bg-gray-100"></div>
    }

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' ,color:'black'}}>
            <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                {/* Toolbar */}
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '4px', 
                    padding: '12px', 
                    backgroundColor: '#f9fafb', 
                    borderBottom: '1px solid #e5e7eb' 
                }}>
                    {/* Undo / Redo */}
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            opacity: !editor.can().undo() ? 0.5 : 1
                        }}
                    >
                        Undo
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            opacity: !editor.can().redo() ? 0.5 : 1
                        }}
                    >
                        Redo
                    </button>

                    <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

                    {/* Headings */}
                    {[1, 2, 3, 4].map((level) => (
                        <button
                            key={level}
                            onClick={() =>
                                editor.chain().focus().toggleHeading({ level }).run()
                            }
                            style={{
                                padding: '6px 12px',
                                fontSize: '14px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                backgroundColor: editor.isActive('heading', { level }) ? '#dbeafe' : 'white',
                                borderColor: editor.isActive('heading', { level }) ? '#93c5fd' : '#d1d5db',
                                color: editor.isActive('heading', { level }) ? '#1d4ed8' : 'black',
                                cursor: 'pointer'
                            }}
                        >
                            H{level}
                        </button>
                    ))}
                    
                    <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

                    {/* Lists */}
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: editor.isActive('bulletList') ? '#dbeafe' : 'white',
                            borderColor: editor.isActive('bulletList') ? '#93c5fd' : '#d1d5db',
                            color: editor.isActive('bulletList') ? '#1d4ed8' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        • List
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: editor.isActive('orderedList') ? '#dbeafe' : 'white',
                            borderColor: editor.isActive('orderedList') ? '#93c5fd' : '#d1d5db',
                            color: editor.isActive('orderedList') ? '#1d4ed8' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        1. List
                    </button>

                    <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

                    {/* Bold / Italic / Underline */}
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: editor.isActive('bold') ? '#dbeafe' : 'white',
                            borderColor: editor.isActive('bold') ? '#93c5fd' : '#d1d5db',
                            color: editor.isActive('bold') ? '#1d4ed8' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        B
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            fontStyle: 'italic',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: editor.isActive('italic') ? '#dbeafe' : 'white',
                            borderColor: editor.isActive('italic') ? '#93c5fd' : '#d1d5db',
                            color: editor.isActive('italic') ? '#1d4ed8' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        I
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            textDecoration: 'underline',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: editor.isActive('underline') ? '#dbeafe' : 'white',
                            borderColor: editor.isActive('underline') ? '#93c5fd' : '#d1d5db',
                            color: editor.isActive('underline') ? '#1d4ed8' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        U
                    </button>

                    {/* Highlight */}
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: editor.isActive('highlight') ? '#fef3c7' : 'white',
                            borderColor: editor.isActive('highlight') ? '#fbbf24' : '#d1d5db',
                            color: editor.isActive('highlight') ? '#92400e' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        Highlight
                    </button>

                    <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

                    {/* Subscript / Superscript */}
                    <button
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: editor.isActive('subscript') ? '#dbeafe' : 'white',
                            borderColor: editor.isActive('subscript') ? '#93c5fd' : '#d1d5db',
                            color: editor.isActive('subscript') ? '#1d4ed8' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        X₂
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: editor.isActive('superscript') ? '#dbeafe' : 'white',
                            borderColor: editor.isActive('superscript') ? '#93c5fd' : '#d1d5db',
                            color: editor.isActive('superscript') ? '#1d4ed8' : 'black',
                            cursor: 'pointer'
                        }}
                    >
                        X²
                    </button>

                    <div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 8px' }}></div>

                    {/* Alignment */}
                    {[
                        { align: 'left', label: '⬅' },
                        { align: 'center', label: '↔' },
                        { align: 'right', label: '➡' },
                        { align: 'justify', label: '⬌' }
                    ].map(({ align, label }) => (
                        <button
                            key={align}
                            onClick={() => editor.chain().focus().setTextAlign(align).run()}
                            style={{
                                padding: '6px 12px',
                                fontSize: '14px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                backgroundColor: editor.isActive({ textAlign: align }) ? '#dbeafe' : 'white',
                                borderColor: editor.isActive({ textAlign: align }) ? '#93c5fd' : '#d1d5db',
                                color: editor.isActive({ textAlign: align }) ? '#1d4ed8' : 'black',
                                cursor: 'pointer'
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Editor */}
                <div style={{ backgroundColor: 'white', minHeight: '200px',color:'black' }}>
                    <EditorContent 
                        editor={editor} 
                        style={{ 
                            minHeight: '200px',
                            padding: '16px'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}