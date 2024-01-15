'use client'

import { createSnippet } from '@/actions'
import { Editor } from '@monaco-editor/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function Loading() {
	return (
		<div
			style={{
				height: '80vh',
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<h2>Loading...</h2>
		</div>
	)
}


export default function SnippetCreateForm() {
	const router = useRouter()

	const [title, setTitle] = useState('')
	const [code, setCode] = useState('')
	const [tags, setTags] = useState('')
	const [loading, setLoading] = useState(false)

	function handleEditorChange(value: string = '') {
		setCode(value)
	}

	const createSnippetAction = () => {
		setLoading(true)
		createSnippet({ title, code, tags })
		setLoading(false)
		router.push(`/`)
	}
	return (
		<>
			{loading && <Loading />}
			<form action={createSnippetAction}>
				<h3 className='font-bold m-3'>Create a Snippet</h3>
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
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>
					</div>

					<div className='flex gap-4'>
						<label className='w-12' htmlFor='code'>
							Code
						</label>

						<Editor
							height='40vh'
							width='100%'
							theme='vs-dark'
							defaultLanguage='javascript'
							defaultValue={code}
							onChange={handleEditorChange}
							options={{ minimap: { enabled: false } }}
						/>
					</div>

					<div className='flex gap-4'>
						<label className='w-12' htmlFor='tags'>
							Tags
						</label>
						<input
							name='tags'
							id='tags'
							className='border rounded p-2 w-full'
							type='text'
							value={tags}
							onChange={e => setTags(e.target.value)}
						/>
					</div>

					<button className='rounded p-2 bg-blue-200' type='submit'>
						Create
					</button>
				</div>
			</form>
		</>
	)
}
