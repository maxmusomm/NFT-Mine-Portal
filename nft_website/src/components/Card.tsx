import { useState } from "react";
// import loading from "../assets/loading.gif";

const Card = ({ uri, walletAddress, contract, tokenId }) => {
  const [image, setImage] = useState("");

  const nft = async (_tokenId: number) => {
    const uri = await contract.tokenURI(_tokenId);
    console.log(uri);
    const response = await fetch(uri);
    console.log(response);
    const data = await response.json();
    console.log(data);
    setImage(data.image);
  };
  nft(tokenId);

  return (
    <>
      <div className="card bg-black bg-opacity-50 w-56 shadow-xl">
        <figure className="px-10 pt-10">
          <img src={image} alt="Shoes" className="rounded-xl w-72 " />
        </figure>
        <div className="card-body items-center text-center   ">
          <h2 className="card-title">NFT Id: 1</h2>
          <h2 className="card-title">
            Owner: {walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)}
          </h2>
        </div>
      </div>
    </>
  );
};

export default Card;
