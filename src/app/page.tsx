import Link from 'next/link'
import { db } from '@/db'

export default async function Home({ searchParams }: any) {
	console.log(searchParams.query)

	let snippets

	if (searchParams.query) {
		snippets = await db.snippet.findMany({
			where: {
				tags: {
					some: {
						id: searchParams.query,
					},
				},
			},
			include: {
				tags: true,
			},
		})
	} else {
		snippets = await db.snippet.findMany({
			include: {
				tags: true,
			},
		})
	}

	const slugs = snippets.map(snippet =>
		snippet.title.toLowerCase().replaceAll(' ', '-')
	)

	const snippetsToRender = snippets.map((snippet, index) => (
		<div key={snippet.id} className='mb-[40px]'>
			<Link href={`/snippets/${slugs[index]}`}>
				<h2>{snippet.title}</h2>
			</Link>
			<ul className='flex gap-4'>
				{snippet.tags.map(tag => (
					<Link key={tag.id} href={`/?query=${tag.id}`}>
						<li>
							<small>{tag.id}</small>
						</li>
					</Link>
				))}
			</ul>
		</div>
	))

	return snippetsToRender
}
