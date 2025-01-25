import { useState, useEffect } from "react";

const TopBar = ({
  walletAddress,
  connectWallet,
  disconnectWallet,
  getContract_with_signer,
}) => {
  const [isOwner, setIsOwner] = useState(false);

  const is_owner = async (_address: string) => {
    const contract = getContract_with_signer();
    const owner = await contract.owner();
    setIsOwner(_address == (await owner));
  };

  const withdraw_funds = async () => {
    const contract = getContract_with_signer();
    await contract.withdraw();
  };

  useEffect(() => {
    is_owner(walletAddress);
  }, [walletAddress]);

  return (
    <>
      <div className="topBar navbar border-b-2 border-slate-950 ">
        {walletAddress ? (
          <div className="flex flex-col gap-2 justify-between items-center">
            <p className="text-xl text-white">
              Wallet Address: {walletAddress}
            </p>
            <button className="btn btn-warning" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>

            {isOwner ? (
              <button className="btn btn-warning" onClick={withdraw_funds}>
                Withdraw
              </button>
            ) : (
              <></>
            )}
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
