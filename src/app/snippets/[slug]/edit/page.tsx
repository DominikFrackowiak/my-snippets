// import { redirect } from 'next/navigation'
// import { db } from '@/db'
// import SnippetEditForm from '@/components/SnippetEditForm'

// interface SnippetEditPageProps {
// 	params: {
// 		slug: string
// 	}

// 	searchParams: {
// 		value: string
// 	}
// }

// export default async function EditPage({
// 	params: { slug },
	
// }: SnippetEditPageProps) {
	
// 	const originalTitle = slug.replaceAll('-', ' ')

// 	const snippet = await db.snippet.findFirst({
// 		where: { title: originalTitle },
// 		include: {
// 			tags: true,
// 		},
// 	})

// 	console.log(snippet)

	

// 	return (
// 		<div>
			

// 					{/* {snippet && (
// 						<SnippetEditForm snippet={snippet}/>
// 					)} */}

					
// 		</div>
// 	)
// }




export default function page() {
		return (
				<div>page</div>
		)
}
