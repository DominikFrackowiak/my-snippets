'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import type { Snippet, Tag } from '@prisma/client'

interface EditSnippetArgs {
	title: string
	code: string
	tags: string | { id: string }[]
	snippet: Snippet
}

export async function editSnippet({
	title,
	code,
	tags,
	snippet,
}: EditSnippetArgs) {
	// Assuming `tags` is of type `FormDataEntryValue | null`
	if (tags !== null) {
		const tagsArray = String(tags)
			.split(',')
			.map(tag => tag.trim())

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
}

export async function deleteSnippet(id: string) {
	await db.snippet.delete({
		where: { id },
	})

	redirect('/')
}
