import React, { useEffect, useState } from "react";
import axios from "axios";

const style = {
  container: "mx-auto px-4 py-8 bg-gray-900",
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8",
  card: "bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg",
  image: "w-full h-64 object-cover object-center rounded-t-lg",
  content: "p-4",
  title: "text-lg font-semibold text-white",
  description: "text-sm text-gray-300 mt-2",
  creator: "text-sm text-gray-400",
  date: "text-sm text-gray-400",
};

const Profile = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (window.ethereum) {
          // Detect Metamask wallet address in Chrome
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const walletAddress = accounts[0];

          const pinListResponse = await axios.get(
            "https://api.pinata.cloud/data/pinList?pageLimit=1000",
            {
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3YzkzNWIwNS0xMjcxLTRhMGItYWQxNy02Mzg2ZjlhZmQxYTYiLCJlbWFpbCI6InhhbWV5OTg4MDNAcm9ob3phLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyNGE0MmM5ZTllY2I1OTc1MDgwMiIsInNjb3BlZEtleVNlY3JldCI6Ijg3ZWYzNGQ2YjRkZTJiNTVhMmE5MjAxZjViMjY5OWM2NTI2MjRiOGJiODY0OGNkNjI1Zjc3MDlmOGNjYjRmYTYiLCJpYXQiOjE3MDgzMzQ4NTN9.G5X2DvFsZnm_La5hHAYz8F-sgkDqGJiklVxC4UEmJYo",
              },
            }
          );

          const pinnedContent = pinListResponse.data.rows;
          const artworksData = await Promise.all(
            pinnedContent.map(async (item) => {
              const metadataResponse = await axios.get(
                `https://gateway.pinata.cloud/ipfs/${item.ipfs_pin_hash}`
              );
              const metadata = metadataResponse.data;

              // Check if metadata contains a valid image URL
              if (metadata.image && metadata.image.startsWith("ipfs://")) {
                metadata.image = metadata.image.slice(7); // Remove 'ipfs://' prefix
              } else {
                console.error("Invalid image URL in metadata:", metadata);
                return null; // Skip this item if image URL is invalid
              }

              const imageUrl = `https://gateway.pinata.cloud/ipfs/${metadata.image}`;
              return { imageUrl, ...metadata };
            })
          );

          // Filter out null values (items with invalid metadata)
          const validArtworks = artworksData.filter((item) => item !== null);

          // Filter artworks by wallet address
          const filteredArtworks = validArtworks.filter(
            (artwork) => artwork.walletAddress === walletAddress
          );

          setArtworks(filteredArtworks);
        } else {
          console.error("Metamask not detected.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // No dependencies array

  // Refresh the page when the wallet changes
  useEffect(() => {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
  }, []);

  return (
    <div className={style.container}>
      <div className={style.grid}>
        {artworks.map((artwork, index) => (
          <div key={index} className={style.card}>
            <div className={style.imageContainer}>
              {/* Disable right-click */}
              <img
                className={style.image}
                src={artwork.imageUrl}
                alt={artwork.name}
                onContextMenu={(e) => e.preventDefault()}
                // Disable image dragging
                draggable="false"
              />
            </div>
            <div className={style.content}>
              <h2 className={style.title}>{artwork.name}</h2>
              <p className={style.description}>{artwork.description}</p>
              <p className={style.creator}>Creator: {artwork.creator}</p>
              <p className={style.date}>Uploaded At: {artwork.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
