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

// export async function editSnippet({
// 	title,
// 	code,
// 	newTags,
// 	snippet,
// }: EditSnippetArgs) {
// 	// Assuming `tags` is of type `FormDataEntryValue | null`
// 	if (newTags !== null) {
// 		const tagsArray = String(newTags)
// 			.split(',')
// 			.map(tag => tag.trim())

// 		await db.snippet.update({
// 			where: { id: snippet?.id },
// 			data: {
// 				title: title?.toLowerCase(),
// 				code,
// 				tags: {
// 					connectOrCreate: tagsArray.map(tag => ({
// 						where: { id: tag },
// 						create: { id: tag },
// 					})),
// 				},
// 			},
// 		})
// 	} else {
// 		// Handle the case where tags are null, perhaps create a snippet without tags
// 		await db.snippet.update({
// 			where: { id: snippet?.id },
// 			data: {
// 				title,
// 				code,
// 				// tags are not included
// 			},
// 		})
// 	}
// }

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

	// Pobierz aktualne tagi dla snippetu
	const currentSnippet = await db.snippet.findUnique({
		where: { id: snippet?.id },
		include: { tags: true },
	})
	const currentTags = currentSnippet?.tags.map(tag => tag.id) || []

	// Tagi do usunięcia
	const tagsToRemove = currentTags.filter(tag => !tagsArray.includes(tag))
	// Tagi do dodania
	const tagsToAdd = tagsArray.filter(tag => !currentTags.includes(tag))

	await db.snippet.update({
		where: { id: snippet?.id },
		data: {
			title: title?.toLowerCase(),
			code,
			tags: {
				// Usuń niechciane tagi
				disconnect: tagsToRemove.map(tag => ({ id: tag })),
				// Dodaj nowe lub istniejące tagi
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
