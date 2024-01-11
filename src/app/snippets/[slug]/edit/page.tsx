// import { redirect } from 'next/navigation'
import { db } from '@/db'
import SnippetEditForm from '@/components/SnippetEditForm'
import { currentUser } from '@clerk/nextjs'

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
	
}: SnippetEditPageProps) {
	
	const originalTitle = slug.replaceAll('-', ' ')
	const user = await currentUser()
	// console.log(user)

	const snippet = await db.snippet.findFirst({
		where: { userId: user?.id, title: originalTitle },
		include: {
			tags: true,
		},
	})

	// console.log(snippet)

	

	return (
		<div>
			

					{snippet && (
						<SnippetEditForm snippet={snippet}/>
					)}

					
		</div>
	)
}



