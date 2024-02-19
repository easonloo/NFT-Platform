import React, { useState } from "react";
import Web3 from "web3";
import contractABI from "../contractAbi.json";
import axios from "axios";

const contractAddress = "0x698899ea1cd04008ad13f8c5dc9ef451916efe80";
const rpcurl = "https://a0b1e5fyj0-a0o454m545-rpc.au0-aws.kaleido.io/";
const web3 = new Web3(rpcurl);
const contract = new web3.eth.Contract(contractABI, contractAddress);

const UploadArt = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [hash, setHash] = useState("");
  const [error, setError] = useState("");
  const [tokenID, setTokenID] = useState(1); // Initialize token ID to 1

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    if (uploadedFile) {
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleOwnerNameChange = (e) => {
    setOwnerName(e.target.value);
  };

  const uploadImage = async () => {
    try {
      setUploading(true);
      if (!file || !name || !description || !ownerName) {
        setError("All fields are required.");
        return;
      }

      const date = new Date();
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formattedDate = date
        .toLocaleString("en-US", options)
        .replace(/\//g, "-")
        .replace(",", "");

      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3YzkzNWIwNS0xMjcxLTRhMGItYWQxNy02Mzg2ZjlhZmQxYTYiLCJlbWFpbCI6InhhbWV5OTg4MDNAcm9ob3phLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyNGE0MmM5ZTllY2I1OTc1MDgwMiIsInNjb3BlZEtleVNlY3JldCI6Ijg3ZWYzNGQ2YjRkZTJiNTVhMmE5MjAxZjViMjY5OWM2NTI2MjRiOGJiODY0OGNkNjI1Zjc3MDlmOGNjYjRmYTYiLCJpYXQiOjE3MDgzMzQ4NTN9.G5X2DvFsZnm_La5hHAYz8F-sgkDqGJiklVxC4UEmJYo`,
          },
        }
      );
      const ipfsHash = response.data.IpfsHash;
      console.log("File uploaded, CID:", ipfsHash);

      // Mint the NFT
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];

      // Upload metadata to Pinata
      const metadata = {
        name,
        description,
        creator: ownerName,
        date: formattedDate,
        image: `ipfs://${ipfsHash}`,
        walletAddress: account,
      };
      const metadataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata, // This should be the object you want to send, not an object with headers and body.
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: "24a42c9e9ecb59750802",
            pinata_secret_api_key:
              "87ef34d6b4de2b55a2a9201f5b2699c652624b8bb8648cd625f7709f8ccb4fa6",
          },
        }
      );
      const metadataHash = metadataResponse.data.IpfsHash;
      console.log("Metadata uploaded, CID:", metadataHash);

      const tokenIdString = tokenID.toString();
      console.log("Token ID:", tokenIdString);
      await contract.methods
        .mint(account, tokenIdString)
        .send({ from: account });

        setUploadSuccess(true);
        setHash(ipfsHash);
    } catch (error) {
      console.error("Error uploading art:", error);
      // setError("Error uploading art. Please try again.");
    } finally {
      setFile(null);
      setImagePreview(null);
      setName("");
      setDescription("");
      setOwnerName("");
      setUploading(false);
      setTokenID((prevTokenID) => prevTokenID + 1); // Increment token ID
      alert("Art uploaded successfully!");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">
            Upload Your Digital Art
          </h2>
          <div className="flex flex-col space-y-4">
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="upload-file"
              />
              <label
                htmlFor="upload-file"
                className="bg-gray-700 hover:bg-gray-600 cursor-pointer rounded-md px-4 py-2 w-full text-center block text-white"
              >
                Upload File
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 mx-auto rounded-md"
                  style={{ maxWidth: "300px" }}
                />
              )}
            </div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
              className="w-full py-2 px-3 border rounded-md border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full py-2 px-3 border rounded-md border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500"
              rows="4"
            ></textarea>
            <input
              type="text"
              placeholder="Owner's Name"
              value={ownerName}
              onChange={handleOwnerNameChange}
              className="w-full py-2 px-3 border rounded-md border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={uploadImage}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {uploadSuccess && (
              <p className="text-green-500 mt-4 text-center">
                Digital Art Uploaded successfully! Hash: {hash}, Token ID:{" "}
                {tokenID}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArt;
