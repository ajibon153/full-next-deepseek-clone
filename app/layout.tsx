import type { Metadata } from "next"
import { Inder } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { StoreInitializer } from "@/utils/StoreInitializer"

const inder = Inder({
    variable: "--font-inder",
    subsets: ["latin"],
    weight: "400" // Explicitly set the available weight
})

export const metadata: Metadata = {
    title: "DeepSeek - GreatStack AI Search Engine",
    description: "Full Stack AI Search Engine built with Next.js, TypeScript, and Tailwind CSS."
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${inder.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <ClerkProvider>
                    <StoreInitializer />
                    {children}
                </ClerkProvider>
            </body>
        </html>
    )
}
