'use client'

import { useEffect, useState } from 'react'
import type { Snippet } from '@prisma/client'
import { Editor } from '@monaco-editor/react'
import { useRouter } from 'next/navigation'
import { editSnippet } from '@/actions'

interface SnippetTags {
	snippet: {
		id: string
		title: string
		code: string
		tags?: { id: string }[]
	}
	newTags?: string
}

export default function SnippetEditForm({ snippet }: SnippetTags) {
	const [code, setCode] = useState(snippet.code)
	const [title, setTitle] = useState(snippet.title)
	// const [tags, setTags] = useState(snippet.tags)

	console.log(snippet)
	const [newTags, setNewTags] = useState('')
	const tags = snippet.tags

	useEffect(() => {
		console.log(tags)
	}, [])

	const slug = snippet.title.replaceAll(' ', '-')
	const originalTitle = slug.replaceAll('-', ' ')

	let originalTags

	if (snippet.tags) {
		originalTags = snippet.tags.map(snippet => snippet.id).join(', ')
	}

	const router = useRouter()

	function handleEditorChange(value: string = '') {
		setCode(value)
	}

	const editSnippetAction = () => {
		editSnippet({ title, code, newTags, snippet })
		router.push(`/snippets/${slug}`)
	}

	return (
		<div>
			<div>
				<form action={editSnippetAction}>
					<h3 className='font-bold m-3'>Edit a Snippet</h3>
					<div className='flex flex-col gap-4'>
						<div className='flex gap-4'>
							<label className='w-12' htmlFor='title'>
								Title
							</label>
							<input
								name='title'
								id='title'
								className='border rounded p-2 w-full'
								required
								type='text'
								defaultValue={originalTitle}
								onChange={e => setTitle(e.target.value)}
							/>
						</div>

						<Editor
							height='40vh'
							width='100%'
							theme='vs-dark'
							defaultLanguage='javascript'
							defaultValue={snippet.code}
							onChange={handleEditorChange}
							options={{ minimap: { enabled: false } }}
						/>

						<div className='flex gap-4'>
							<label className='w-12' htmlFor='tags'>
								Tags
							</label>
							<input
								name='tags'
								id='tags'
								className='border rounded p-2 w-full'
								type='text'
								defaultValue={originalTags}
								onChange={e => setNewTags(e.target.value)}
							/>
						</div>

						<button className='rounded p-2 bg-blue-200' type='submit'>
							Update
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
