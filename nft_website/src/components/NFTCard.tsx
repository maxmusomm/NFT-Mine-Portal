import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card } from "./index";

const NFTCard = ({ walletAddress, signer, contractAddress, abi }) => {
  const [loading, setLoading] = useState(false);
  const [logError, setLogError] = useState("");
  const [totalNFTs, setTotalNFTs] = useState(Number);
  const [nfts, setNFTs] = useState<string[]>([]);

  const getContract_with_signer = () => {
    return new ethers.Contract(contractAddress, abi, signer);
  };

  const payToMint = async () => {
    try {
      setLoading(true);
      const contract = getContract_with_signer();
      await contract.payToMint(signer, {
        value: ethers.parseEther("0.002"),
      });
    } catch (error) {
      setLogError("Error minting NFT");
      console.error("Error minting NFT:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNFTData = async () => {
    try {
      const contract = getContract_with_signer();
      const allNfts = Number(await contract.totalSupply());
      setTotalNFTs(allNfts);
      console.log(allNfts);
      const arr = [];
      for (let i = 0; i < allNfts; i++) {
        const uri = await contract.tokenURI(i + 1);
        arr.push(uri);
      }
      setNFTs(arr);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNFTData();
  }, [walletAddress]);

  return (
    <div className="container flex flex-col p-4 gap-2">
      <div className="mint-btn flex flex-col justify-center align-center m-8">
        <p className="text-xl text-green-950 text-center ">{logError}</p>
        <button
          onClick={payToMint}
          disabled={loading}
          className="btn btn-warning btn-outline text-xl px-16"
        >
          {loading ? "Minting..." : "Mint"}
        </button>
      </div>
      <div>
        {nfts.length > 0 && (
          <ul className="minted-cards grid grid-cols-4 gap-4">
            {nfts.map((uri, index) => (
              <li key={index}>
                <Card
                  uri={uri}
                  tokenId={index + 1}
                  walletAddress={walletAddress}
                  contract={getContract_with_signer}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
