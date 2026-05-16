import Assets from "@/assets"
import Image from "next/image"
import { useAppStore } from "@/store/useAppStore"

function PropmtBox() {
    const currentPrompt = useAppStore((state) => state.currentPrompt)
    const setCurrentPrompt = useAppStore((state) => state.setCurrentPrompt)
    const isLoading = useAppStore((state) => state.isLoading)
    const sendMessage = useAppStore((state) => state.sendMessage)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (currentPrompt.trim() && !isLoading) {
            await sendMessage(currentPrompt)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}
        >
            <textarea
                className="outline-none w-full resize-none overflow-hidden break-words bg-transparent"
                rows={2}
                placeholder="Message DeepSeek"
                required
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
                disabled={isLoading}
            />

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                        <Image className="h-5" src={Assets.deepthink_icon} alt="" /> DeepThink (R1)
                    </p>
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                        <Image className="h-5" src={Assets.search_icon} alt="" /> Search
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Image className="w-4 cursor-pointer" src={Assets.pin_icon} alt="" />{" "}
                    <button
                        type="submit"
                        className={`${currentPrompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}
                        disabled={isLoading}
                    >
                        <Image
                            className="w-3.5 aspect-square"
                            src={currentPrompt ? Assets.arrow_icon : Assets.arrow_icon_dull}
                            alt=""
                        />
                    </button>
                </div>
            </div>
        </form>
    )
}

export default PropmtBox