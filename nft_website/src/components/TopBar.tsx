import { ethers } from "ethers";

const TopBar = ({ walletAddress, connectWallet }) => {
  return (
    <>
      <div className="topBar navbar border-b-2 border-slate-950 ">
        {walletAddress ? (
          <div className="flex justify-between items-center">
            <p className="text-xl text-white">
              Wallet Address: {walletAddress}
            </p>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="btn btn-warning btn-outline text-xl"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </>
  );
};

export default TopBar;
