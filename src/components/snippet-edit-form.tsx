'use client'

import { useState } from 'react'
import type { Snippet } from '@prisma/client'
import { Editor } from '@monaco-editor/react'
import { useRouter } from 'next/navigation'
import { editSnippet } from '@/actions'

interface SnippetEditFormProps {
	snippet: Snippet
}

export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
  const [code, setCode] = useState(snippet.code)

  const slug = snippet.title.replaceAll(" ", '-')

  const router = useRouter()

	function handleEditorChange(value: string = '') {
		router.push(`/snippets/${slug}/edit?value=${value}`)
	}

	return (
		<div>
			<Editor
				height='40vh'
				width='100%'
				theme='vs-dark'
				defaultLanguage='javascript'
				defaultValue={snippet.code}
				onChange={handleEditorChange}
				options={{ minimap: { enabled: false } }}
        
			/>
      
		</div>
	)
}
