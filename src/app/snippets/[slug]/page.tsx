import { notFound } from 'next/navigation'
import Link from 'next/link'

import { db } from '@/db'
import { deleteSnippet } from '@/actions'

interface SnippetShowPageProps {
	params: {
		slug: string
	}
}

export default async function SnippetShowPage({
	params,
}: SnippetShowPageProps) {
	const title = params.slug.replaceAll('-', ' ')

	const snippet = await db.snippet.findFirst({
		where: { title },
	})

	if (!snippet) {
		return notFound()
	}

	const deleteSnippetAction = deleteSnippet.bind(null, snippet.id)
	return (
		<div>
			<div className='flex mb-3 justify-between items-center'>
				<h1 className='text-xl font-bold'>{snippet.title}</h1>
				<div className='flex gap-2'>
					<Link href={`/snippets/${params.slug}/edit`}>
						<button className='p-2 border rounded'>Edit</button>
					</Link>
					<form action={deleteSnippetAction}>
						<button className='p-2 border rounded'>Delete</button>
					</form>
				</div>
			</div>
			<pre className='p-3 border rounded bg-gray-200 border-gray-200'>
				<code>{snippet.code}</code>
			</pre>
		</div>
	)
}

// GenerateStaticParams every single snippet page

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
