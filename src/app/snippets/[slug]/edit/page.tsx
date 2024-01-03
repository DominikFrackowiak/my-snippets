import { redirect } from 'next/navigation'
import { db } from '@/db'
import SnippetEditForm from '@/components/snippet-edit-form'

interface SnippetEditPageProps {
	params: {
		slug: string
	}

	searchParams: {
		value: string
	}
}

export default async function EditPage({
	params: { slug },
	searchParams,
}: SnippetEditPageProps) {
	const originalTitle = slug.replaceAll('-', ' ')

	const snippet = await db.snippet.findFirst({
		where: { title: originalTitle },
		include: {
			tags: true,
		},
	})

	const originalTags = snippet?.tags.map(tag => tag.id).join(', ')

	async function editSnippet(formData: FormData) {
		// This need to be a server action!
		'use server'

		// Check the user's inputs and make sure they're valid
		const title = (formData.get('title') as string) || snippet?.title
		const code = searchParams.value || snippet?.code
		const tags = formData.get('tags') || snippet?.tags

		console.log(code)

		// Assuming `tags` is of type `FormDataEntryValue | null`
		if (tags !== null) {
			const tagsArray = String(tags)
				.split(',')
				.map(tag => tag.trim())

			const createSnippetData = {
				title: title?.toLowerCase(),
				code,
				tags: {
					connectOrCreate: tagsArray.map(tag => ({
						where: { id: tag },
						create: { id: tag },
					})),
				},
			}
		await db.snippet.update({
			where: { id: snippet?.id },
			data: {
				title: title?.toLowerCase(),
				code,
				tags: {
					connectOrCreate: tagsArray.map(tag => ({
						where: { id: tag },
						create: { id: tag },
					})),
				},
			},
		})

		} else {
			// Handle the case where tags are null, perhaps create a snippet without tags
			await db.snippet.update({
				where: { id: snippet?.id },
				data: {
					title,
					code,
					// tags are not included
				},
			})
		}

		// Redirect
		redirect('/')
	}

	return (
		<div>
			<form action={editSnippet}>
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
						/>
					</div>

					{snippet && <SnippetEditForm snippet={snippet} />}

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
						/>
					</div>

					<button className='rounded p-2 bg-blue-200' type='submit'>
						Update
					</button>
				</div>
			</form>
		</div>
	)
}
