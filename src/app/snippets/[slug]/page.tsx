import { db } from '@/db'


interface SnippetShowPageProps {
	params: {
		slug: string
	}
}

export default async function SnippetShowPage({
	params,
}: SnippetShowPageProps) {
	const title =
		params.slug.replaceAll('-', ' ')

    console.log(title)

	const snippet = await db.snippet.findFirst({
	  where: {title}
	})

  console.log(snippet)
	return <div>{title}</div>
}
