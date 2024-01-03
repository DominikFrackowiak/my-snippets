import { notFound } from "next/navigation"

import { db } from "@/db"

interface SnippetEditPageProps {
	params: {
		slug: string
	}
}

export default async function EditPage({params: {slug}} : SnippetEditPageProps) {
  const title = slug.replaceAll('-', ' ')

	const snippet = await db.snippet.findFirst({
		where: { title },
	}) 

 if(!snippet){
  return notFound()
 }

 

  return (
    <div>editing {title}</div>
  )
}
