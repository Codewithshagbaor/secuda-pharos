import { ConnectKitButton } from "connectkit"
import Button from "./button"


const ConnectWalletButton = () => {
  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected, truncatedAddress }) => (
        <Button
          onClick={show}
          variant="primary"
          className="h-9 text-sm font-medium bg-[#2B9DDA] hover:bg-[#2589c2] truncate rounded-full max-w-[140px] sm:max-w-none"
        >
          {isConnected ? truncatedAddress : "Connect Wallet"}
        </Button>
      )}
    </ConnectKitButton.Custom>
  )
}

export default ConnectWalletButton