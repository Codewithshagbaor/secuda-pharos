import { useState } from "react";
import { useChainSwitcher } from "@/hooks/useChainSwitcher"; 
import { pharosdevnet, educhain } from "@/chains/customChains";

const CHAINS = [pharosdevnet, educhain];

export default function ChainSelector({ setSelectedChainId }: { 
    setSelectedChainId: (id: number) => void 
}) { 
    const { switchToChain, currentChain } = useChainSwitcher();
    const [isChanging, setIsChanging] = useState(false);

    const handleChange = async (selectedChainId: number) => {
        setIsChanging(true);
        setSelectedChainId(selectedChainId);
        await switchToChain(selectedChainId);
        setIsChanging(false);
    };

    return (
        <div className="relative">
            <select
                value={currentChain?.id || ""}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="h-9 text-sm font-medium bg-[#2B9DDA] hover:bg-[#2589c2] rounded-lg focus:outline-none focus:border-transparent text-white px-4 "
            >
                {CHAINS.map((chain) => (
                    <option key={chain.id} value={chain.id} className="bg-[#040E24] text-white">
                        {chain.name} {currentChain?.id === chain.id ? "(Current)" : ""}
                    </option>
                ))}
            </select>

            {isChanging && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <p>Switching chain, please wait...</p>
                    </div>
                </div>
            )}
        </div>
    );
}