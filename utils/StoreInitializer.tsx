"use client"

import { useUser } from '@clerk/nextjs'
import { useAppStore } from '@/store/useAppStore'
import { useEffect } from 'react'

export function StoreInitializer() {
    const { user } = useUser()
    const setUser = useAppStore((state) => state.setUser)
    const setDisplayName = useAppStore((state) => state.setDisplayName)

    useEffect(() => {
        if (user) {
            setUser({
                firstName: user.firstName,
                lastName: user.lastName
            })
            setDisplayName(user.firstName || 'Guest')
        }
    }, [user, setUser, setDisplayName])

    return null
}