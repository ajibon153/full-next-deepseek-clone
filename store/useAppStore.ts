import { create } from 'zustand'

export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

interface AppStore {
    // User
    user: { firstName: string | null; lastName: string | null } | null
    displayName: string

    // Chat
    messages: Message[]
    currentPrompt: string
    isLoading: boolean
    hasMessage: boolean

    // UI
    sidebarExpanded: boolean

    // Actions
    setUser: (user: { firstName: string | null; lastName: string | null } | null) => void
    setDisplayName: (name: string) => void
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
    clearMessages: () => void
    setCurrentPrompt: (prompt: string) => void
    setIsLoading: (loading: boolean) => void
    setHasMessage: (has: boolean) => void
    toggleSidebar: () => void
    setSidebarExpanded: (expanded: boolean) => void

    // Chat actions
    sendMessage: (content: string) => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
    // Initial state
    user: null,
    displayName: 'Guest',
    messages: [],
    currentPrompt: '',
    isLoading: false,
    hasMessage: false,
    sidebarExpanded: false,

    // User actions
    setUser: (user) => set({ user }),
    setDisplayName: (name) => set({ displayName: name }),

    // Chat actions
    addMessage: (message) => set((state) => ({
        messages: [
            ...state.messages,
            {
                ...message,
                id: crypto.randomUUID(),
                timestamp: Date.now()
            }
        ]
    })),

    clearMessages: () => set({ messages: [], hasMessage: false }),

    setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),

    setIsLoading: (loading) => set({ isLoading: loading }),

    setHasMessage: (has) => set({ hasMessage: has }),

    // UI actions
    toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),

    setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),

    // Send message with streaming
    sendMessage: async (content: string) => {
        const { addMessage, setIsLoading, setHasMessage, messages } = get()

        if (!content.trim()) return

        // Add user message
        addMessage({ role: 'user', content })

        setIsLoading(true)
        setHasMessage(true)
        set({ currentPrompt: '' })

        try {
            // Build conversation history for context
            const conversationHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            }))

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...conversationHistory, { role: 'user', content }]
                })
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            // Handle streaming response
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            let assistantMessage = ''

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value)
                    assistantMessage += chunk

                    // Update or create assistant message
                    const existingAssistant = get().messages.find(
                        m => m.role === 'assistant' && !m.content.endsWith('...')
                    )

                    if (existingAssistant) {
                        set((state) => ({
                            messages: state.messages.map(m =>
                                m.id === existingAssistant.id
                                    ? { ...m, content: assistantMessage }
                                    : m
                            )
                        }))
                    } else {
                        addMessage({ role: 'assistant', content: assistantMessage })
                    }
                }
            }
        } catch (error) {
            console.error('Error sending message:', error)
            addMessage({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' })
        } finally {
            setIsLoading(false)
        }
    }
}))