import { db } from '@/db'
import { redirect } from 'next/navigation'

import { auth, currentUser } from '@clerk/nextjs'
import { emailAddresses } from '@clerk/clerk-sdk-node'

export default async function SnippetCreatePage() {
	const user = await currentUser()
	console.log(user)
	const userId = user?.id
	const userName = user?.firstName + ' ' + user?.lastName
	console.log(typeof userName)
	const email = user?.emailAddresses[0]?.emailAddress
	console.log(email)
	async function createSnippet(formData: FormData) {
		// This need to be a server action!
		'use server'

		// Check the user's inputs and make sure they're valid
		const title = formData.get('title') as string
		const code = formData.get('code') as string
		const tags = formData.get('tags')

		let snippet

		if (!userId) {
			throw new Error('User not logged in')
		}

		// Sprawdzenie, czy użytkownik istnieje w bazie danych
		const existingUser = await db.user.findUnique({
			where: { id: userId },
		})

		// Jeśli użytkownik nie istnieje, stwórz go
		if (!existingUser) {
			await db.user.create({
				data: {
					id: userId,
					name: userName,
     email
				},
			})
		}

		// Assuming `tags` is of type `FormDataEntryValue | null`
		if (tags !== null) {
			const tagsArray = String(tags)
				.split(',')
				.map(tag => tag.trim())

			const createSnippetData = {
				title: title.toLowerCase(),
				code,
				userId,
				tags: {
					connectOrCreate: tagsArray.map(tag => ({
						where: { id: tag },
						create: { id: tag },
					})),
				},
			}

			snippet = await db.snippet.create({
				data: createSnippetData,
			})
		} else {
			// Handle the case where tags are null, perhaps create a snippet without tags
			snippet = await db.snippet.create({
				data: {
					title,
					code,
					userId,
					// tags are not included
				},
			})
		}

		// Redirect
		redirect('/')
	}

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
