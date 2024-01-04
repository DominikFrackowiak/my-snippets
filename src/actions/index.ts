'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import type { Snippet, Tag } from '@prisma/client'

interface EditSnippetArgs {
	title: string
	code: string
	newTags: string
	snippet: Snippet
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
