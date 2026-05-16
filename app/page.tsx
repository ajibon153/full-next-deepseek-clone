"use client"

import Image from "next/image"
import Assets from "@/assets"
import Sidebar from "@/components/sidebar"
import PropmtBox from "@/components/PropmtBox"
import { useAppStore } from "@/store/useAppStore"

export default function Home() {
    const messages = useAppStore((state) => state.messages)
    const sidebarExpanded = useAppStore((state) => state.sidebarExpanded)
    const toggleSidebar = useAppStore((state) => state.toggleSidebar)

    return (
        <div>
            <div className="flex flex-row h-screen">
                <Sidebar expand={sidebarExpanded} setExpand={toggleSidebar} />
                <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
                    <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
                        <Image
                            onClick={() => toggleSidebar()}
                            className="rotate-180"
                            src={Assets.menu_icon}
                            alt=""
                        />
                        <Image className="opacity-70" src={Assets.chat_icon} alt="" />
                    </div>
                    {messages.length === 0 ? (
                        <>
                            <div className="flex items-center gap-3">
                                <Image src={Assets.logo_icon} alt="" className="h-16" />
                                <p className="text-2x1 font-medium">Hi, I'm DeepSeek.</p>
                            </div>
                            <p className="text-sm mt-2">How can I help you today?</p>
                        </>
                    ) : (
                        <div></div>
                    )}
                    <PropmtBox />
                    <p className="text-xs absolute bottom-1 text-gray-500">AI-generated, for reference only</p>
                </div>
            </div>
        </div>
    )
}