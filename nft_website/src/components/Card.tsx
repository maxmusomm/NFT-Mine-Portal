import { useState } from "react";
import axios from "axios";
// import loading from "../assets/loading.gif";

const Card = ({ uri, tokenId, ownerOf }) => {
  const [image, setImage] = useState("");
  const [ownerOfNFT, setOwnerOfNft] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const nft = async () => {
    try {
      const URI = await axios.get(uri);
      setImage(URI.data.image);
      setOwnerOfNft(await ownerOf(tokenId));
    } catch (error) {
      console.error("A card issue:", error);
    }
  };
  nft();

  return (
    <>
      <div className="card bg-black bg-opacity-50 w-56 shadow-xl">
        <figure className="px-10 pt-10">
          <img src={image} alt="ICBM" className="rounded-xl w-72 " />
        </figure>
        <div className="card-body items-center text-center   ">
          <h2 className="card-title">NFT Id: {tokenId}</h2>
          <h2
            className="card-title"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            Owner: {ownerOfNFT.slice(0, 6) + "..." + ownerOfNFT.slice(-4)}
            {showTooltip && (
              <div className="absolute bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-lg top-full  left-0">
                {ownerOfNFT}
              </div>
            )}
          </h2>
        </div>
      </div>
    </>
  );
};

export default Card;
