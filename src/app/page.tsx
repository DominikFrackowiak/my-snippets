import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function Page() {
	const { userId } = auth()

	if (userId) redirect('/snippets')
	return (
		<div>
			<h1 className='font-bold mb-2'>Welcome to MySnippets</h1>
			<p>A place where you can store your code snippets</p>
		</div>
	)
}
