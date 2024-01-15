import Link from 'next/link'
import { db } from '@/db'
import { currentUser } from '@clerk/nextjs'

export default async function Home({ searchParams }: any) {
	const user = await currentUser()

	const userID = user?.id

	let snippets

	if (searchParams.query) {
		snippets = await db.snippet.findMany({
			where: {
				userId: userID,
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
			where: {
				userId: userID,
			},
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
			<Link
				href={`/snippets/${slugs[index]}`}
				className='flex justify-between items-center p-2 border rounded'
			>
				<div>{snippet.title}</div>
				<div>View</div>
			</Link>
			<ul className='flex gap-4 w-full flex-wrap'>
				{snippet.tags.map(tag => (
					<Link key={tag.id} href={`/snippets?query=${tag.id}`}>
						<button className='border border-blue-600 rounded px-2 py-1 mt-2 text-blue-600'>
							<small>{tag.id}</small>
						</button>
					</Link>
				))}
			</ul>
		</div>
	))

	return snippetsToRender
}
