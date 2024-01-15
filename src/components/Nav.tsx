import Link from 'next/link'

import { UserButton } from '@clerk/nextjs'

import { currentUser } from '@clerk/nextjs'

export default async function Nav() {
	const user = await currentUser()

	return (
		<nav
			style={{ display: 'flex', justifyContent: 'space-between' }}
			className='mb-4 mt-2'
		>
			<Link href='/'>
				<h2 className='font-bold m-3'>MySnippets</h2>
			</Link>

			<div className='flex gap-4 items-center text-blue-600'>
				{user && (
					<div className=' flex justify-center items-center bg-blue-600 text-white p-2 rounded'>
						<Link href='/snippets/new'>Add New</Link>
					</div>
				)}
				{user && <UserButton />}
				{!user && (
					<>
						<Link href='/sign-in'>Sign in</Link>
						<Link href='/sign-up'>Sign up</Link>
					</>
				)}
			</div>
		</nav>
	)
}
