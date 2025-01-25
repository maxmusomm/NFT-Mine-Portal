import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card } from "./index";
import loadingGif from "../assets/loading.gif";

const NFTCard = ({
  walletAddress,
  signer,
  contractAddress,
  abi,
  getContract_with_signer,
}) => {
  const [loading, setLoading] = useState(false);
  const [nftLoading, setNftLoading] = useState(true);
  const [totalNFTs, setTotalNFTs] = useState(0);
  const [nfts, setNFTs] = useState<string[]>([]);

  const payToMint = async () => {
    try {
      setLoading(true);
      const contract = getContract_with_signer();
      const tx = await contract.payToMint(signer, {
        value: ethers.parseEther("0.002"),
      });
      await tx.wait();

      contract.once("NFTMinted", (_to, tokenId) => {
        alert(`${_to} your NFT with tokenId ${tokenId} has been minted`);
        loadNFTData(); // Reload NFT data after minting
      });
    } catch (error) {
      alert("Error minting NFT");
      console.error("Error minting NFT:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNFTData = async () => {
    try {
      setNftLoading(true);
      const contract = getContract_with_signer();
      const allNfts = Number(await contract.totalSupply());
      setTotalNFTs(allNfts);

      const arr = [];
      for (let i = 1; i <= allNfts; i++) {
        const uri = await contract.tokenURI(i);
        arr.push(uri);
      }
      setNFTs(arr);
    } catch (err) {
      console.error("Error loading NFT data:", err);
    } finally {
      setNftLoading(false);
    }
  };

  const owner_of = async (_tokenId: number) => {
    const contract = getContract_with_signer();
    return await contract.ownerOf(_tokenId);
  };

  useEffect(() => {
    loadNFTData();
  }, [walletAddress]);

  return (
    <div className="container flex flex-col p-4 gap-2">
      <div className="mint-btn flex flex-col justify-center items-center m-8">
        <button
          onClick={payToMint}
          disabled={loading}
          className="btn btn-warning btn-outline text-xl px-16"
        >
          {loading ? (
            <>
              <img src={loadingGif} alt="Loading..." className="w-6 h-6 mr-2" />
              Minting...
            </>
          ) : (
            "Mint"
          )}
        </button>
      </div>
      <div>
        {nftLoading ? (
          <span className="loading loading-dots loading-lg"></span>
        ) : nfts.length > 0 ? (
          <ul className="minted-cards grid grid-cols-4 gap-4">
            {nfts.map((uri, index) => (
              <li key={index}>
                <Card uri={uri} tokenId={index + 1} ownerOf={owner_of} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No NFTs minted yet.</p>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
