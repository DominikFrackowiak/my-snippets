'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import type { Snippet, Tag } from '@prisma/client'
import { currentUser } from '@clerk/nextjs'

interface EditSnippetArgs {
	title: string
	code: string
	newTags: string
	snippet: Snippet
}



export async function createSnippet(formData: FormData) {
		const user = await currentUser()

		const userId = user?.id
		const userName = user?.firstName + ' ' + user?.lastName

		const email = user?.emailAddresses[0]?.emailAddress as string

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
				email,
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

export async function editSnippet({
	title,
	code,
	newTags,
	snippet,
}: EditSnippetArgs) {
	const tagsArray = newTags
		? String(newTags)
				.split(',')
				.map(tag => tag.trim())
		: []

	// Current tags for the snippet
	const currentSnippet = await db.snippet.findUnique({
		where: { id: snippet?.id },
		include: { tags: true },
	})
	const currentTags = currentSnippet?.tags.map(tag => tag.id) || []

	// Tags to be deleted
	const tagsToRemove = currentTags.filter(tag => !tagsArray.includes(tag))
	// Tags to be added
	const tagsToAdd = tagsArray.filter(tag => !currentTags.includes(tag))

	await db.snippet.update({
		where: { id: snippet?.id },
		data: {
			title: title?.toLowerCase(),
			code,
			tags: {
				// Delete tags 
				disconnect: tagsToRemove.map(tag => ({ id: tag })),
				// Add new tags
				connectOrCreate: tagsToAdd.map(tag => ({
					where: { id: tag },
					create: { id: tag },
				})),
			},
		},
	})
}

export async function deleteSnippet(id: string) {
	await db.snippet.delete({
		where: { id },
	})

	redirect('/')
}
