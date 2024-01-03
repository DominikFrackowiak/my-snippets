
import { db } from '@/db'

interface SnippetShowPageProps {
	params: {
		slug: string
	}
}

export default async function SnippetShowPage({
	params,
}: SnippetShowPageProps) {
	const title = params.slug.replaceAll('-', ' ')

	console.log(title)

	const snippet = await db.snippet.findFirst({
		where: { title },
	})

	return <div>{title}</div>
}

export async function generateStaticParams() {
	const snippets = await db.snippet.findMany({
		include: {
			tags: true,
		},
	})

	return snippets.map(snippet => ({
		slug: snippet.title.replaceAll(' ', '-'),
	}))
}
