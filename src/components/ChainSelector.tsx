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
                className="px-4 py-2 rounded bg-gray-200 text-black"
            >
                {CHAINS.map((chain) => (
                    <option key={chain.id} value={chain.id}>
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