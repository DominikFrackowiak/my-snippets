import { redirect } from 'next/navigation'
import { db } from '@/db'
import SnippetEditForm from '@/components/Snippet-edit-form'

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

	console.log(snippet)

	

	return (
		<div>
			

					{snippet && (
						<SnippetEditForm snippet={snippet}/>
					)}

					
		</div>
	)
}
