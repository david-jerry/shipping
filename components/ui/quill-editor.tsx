"use client"

import { useEffect, useRef } from "react"

type QuillEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

type QuillInstance = {
  root: HTMLElement
  on: (eventName: string, handler: () => void) => void
  off: (eventName: string, handler: () => void) => void
}

export function QuillEditor({
  value,
  onChange,
  placeholder,
}: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<QuillInstance | null>(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    let mounted = true
    let textChangeHandler: (() => void) | null = null

    const init = async () => {
      if (!containerRef.current || quillRef.current) {
        return
      }

      const { default: Quill } = await import("quill")

      if (!mounted || !containerRef.current) {
        return
      }

      const editorRoot = document.createElement("div")
      containerRef.current.innerHTML = ""
      containerRef.current.appendChild(editorRoot)

      const quill = new Quill(editorRoot, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "blockquote"],
            ["clean"],
          ],
        },
      }) as QuillInstance

      if (value) {
        quill.root.innerHTML = value
      }

      textChangeHandler = () => {
        const html = quill.root.innerHTML
        onChangeRef.current(html === "<p><br></p>" ? "" : html)
      }

      quill.on("text-change", textChangeHandler)
      quillRef.current = quill
    }

    void init()

    return () => {
      mounted = false
      if (quillRef.current && textChangeHandler) {
        quillRef.current.off("text-change", textChangeHandler)
      }
      quillRef.current = null
    }
  }, [placeholder, value])

  useEffect(() => {
    const quill = quillRef.current
    if (!quill) {
      return
    }

    const normalizedCurrent =
      quill.root.innerHTML === "<p><br></p>" ? "" : quill.root.innerHTML
    const normalizedIncoming = value || ""

    if (normalizedCurrent !== normalizedIncoming) {
      quill.root.innerHTML = normalizedIncoming || "<p><br></p>"
    }
  }, [value])

  return (
    <div
      ref={containerRef}
      className="rounded-md border border-input bg-background"
    />
  )
}
