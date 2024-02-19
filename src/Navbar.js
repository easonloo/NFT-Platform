import { useState ,useEffect} from "react";
import { Link, Route, Routes } from "react-router-dom";
import Upload from "./pages/Upload";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Profile from "./pages/Profile";

const style = {
  wrapper: "bg-[#04111d] w-screen px-[1.2rem] py-[0.8rem] flex",
  logoContainer: "flex items-center cursor-pointer",
  logoText: "ml-[0.8rem] text-white font-semibold text-2xl",
  searchBar:
    "flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]",
  searchIcon: "text-[#8a939b] mx-3 font-bold text-lg",
  searchInput:
    "h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]",
  headerItems: "flex items-center justify-end",
  headerItem:
    "text-white px-4 font-bold text-[#c8cacd] hover:text-white cursor-pointer",
  headerIcon:
    "text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer",
  headerProfileIcon:
    "text-white text-3xl font-black px-4 hover:text-white cursor-pointer mr-4",
};

const NavBar = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

useEffect(() => {
  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setConnected(true);
      setWalletAddress(accounts[0]);
      localStorage.setItem("connected", "true");
      localStorage.setItem("walletAddress", accounts[0]);
    } else {
      setConnected(false);
      setWalletAddress("");
      localStorage.removeItem("connected");
      localStorage.removeItem("walletAddress");
    }
  };

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }

  // Check local storage for existing connection
  const connected = localStorage.getItem("connected");
  const walletAddress = localStorage.getItem("walletAddress");
  if (connected && walletAddress) {
    setConnected(true);
    setWalletAddress(walletAddress);
  }

  return () => {
    if (window.ethereum) {
      window.ethereum.off("accountsChanged", handleAccountsChanged);
    }
  };
}, []);

const connectWallet = async () => {
  if (!connecting) {
    setConnecting(true);
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setConnected(true);
          setWalletAddress(accounts[0]);
          localStorage.setItem("connected", "true");
          localStorage.setItem("walletAddress", accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("Please install Metamask to connect your wallet.");
    }
    setConnecting(false);
  }
};
  const formatWalletAddress = (address) => {
    if (address.length > 10) {
      return (
        address.substring(0, 6) + "..." + address.substring(address.length - 4)
      );
    } else {
      return address;
    }
  };
    
  return (
    <>
      <div className="bg-[#04111d] px-4 py-2 md:px-8 md:py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <div className="cursor-pointer">
              <div className="text-white font-semibold text-2xl">
                NFT Gallery
              </div>
            </div>
          </Link>
          <div className="hidden md:flex ml-4 space-x-4">
            <Link
              to="/gallery"
              className="text-white font-bold hover:text-white cursor-pointer"
            >
              Gallery
            </Link>
            <div className="text-white font-bold hover:text-white cursor-pointer">
              Stats
            </div>
            <div className="text-white font-bold hover:text-white cursor-pointer">
              Resources
            </div>
            <Link
              to="/upload"
              className="text-white font-bold hover:text-white cursor-pointer"
            >
              Create
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4 md:mr-0">
            {connecting ? (
              <div className="text-white font-bold">Connecting...</div>
            ) : connected ? (
              <div className="text-white font-bold">
                Wallet: {formatWalletAddress(walletAddress)}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="text-white font-bold flex items-center"
              >
                <svg
                  fill="currentColor"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  title="Wallet"
                  className="mr-1"
                >
                  <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T166-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z"></path>
                </svg>
                Login
              </button>
            )}
          </div>
          <div className="text-white text-3xl font-black cursor-pointer md:hidden">
            <svg
              fill="currentColor"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              title="Menu"
            >
              <path d="M384 112h256v32H384v-32zm0 128h256v32H384v-32zm0 128h256v32H384v-32zm0 128h256v32H384v-32zm-272-48v32H32v-32h80zm0-128v32H32v-32h80zm0-128v32H32v-32h80zm0-128v32H32v-32h80zm-16-176v32H16v-32h80zm0 128v32H16v-32h80zm0 128v32H16v-32h80zm0 128v32H16v-32h80zM96 608v32H16v-32h80zm0 128v32H16v-32h80zm0 128v32H16v-32h80zm16 176h256v32H112v-32zm0-128h256v32H112v-32zm0-128h256v32H112v-32zm0-128h256v32H112v-32z"></path>
            </svg>
          </div>
          <Link to="/profile">
            <div className={`${style.headerProfileIcon} text-white`}>
              <svg
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 -960 960 960"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Account Circle</title>
                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"></path>
              </svg>
            </div>
          </Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default NavBar;
