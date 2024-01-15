'use client'

import React from 'react'

import { useState, createContext } from 'react'

const EditorContext = createContext()

export default EditorContext

export const EditorProvider = ({ children }) => {
	const [editorState, setEditorState] = useState('')

	
	const updateEditorState = newState => {
		setEditorState(newState)
	}

	return (
		<EditorContext.Provider value={{ editorState, updateEditorState }}>
			{children}
		</EditorContext.Provider>
	)
}