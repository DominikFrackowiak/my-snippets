'use client'

import { Editor } from '@monaco-editor/react'
import { useState } from 'react'

export default function CodeEditor() {

  const [code, setCode] = useState('')

  	function handleEditorChange(value: string = '') {
			setCode(value)
		}

  return (
		<Editor
			height='40vh'
			width='100%'
			theme='vs-dark'
			defaultLanguage='javascript'
			defaultValue={code}
			onChange={handleEditorChange}
			options={{ minimap: { enabled: false } }}
   
		/>
	)
}
