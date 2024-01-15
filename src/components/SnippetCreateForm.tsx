'use client'

import { createSnippet } from '@/actions'

export default function SnippetCreateForm() {
	return (
		<form action={createSnippet}>
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
					/>
				</div>

				<div className='flex gap-4'>
					<label className='w-12' htmlFor='code'>
						Code
					</label>
					<textarea
						name='code'
						id='code'
						className='border rounded p-2 w-full'
						required
					/>
					{/* <CodeEditor name='code'/> */}
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
					/>
				</div>

				<button className='rounded p-2 bg-blue-200' type='submit'>
					Create
				</button>
			</div>
		</form>
	)
}
