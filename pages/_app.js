import "../styles/globals.css";
import toast, { Toaster } from "react-hot-toast";
// import merge from "lodash/merge";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  midnightTheme,
} from "@rainbow-me/rainbowkit";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { FaBullseye } from "react-icons/fa";

// NETWORK SETUP
const RootStockTestnetRPC = process.env.NEXT_PUBLIC_ROOTSTOCK_RPC_URL;
const Explorer = process.env.NEXT_PUBLIC_EXPLORER;

const ChainID = process.env.NEXT_PUBLIC_CHAIN_ID;
const Currency = process.env.NEXT_PUBLIC_CURRENCY;
const Decimals = process.env.NEXT_PUBLIC_NETWORK_DECIMALS;
const Name = process.env.NEXT_PUBLIC_NETWORK_NAME;
const Network = process.env.NEXT_PUBLIC_NETWORK;

export default function App({ Component, pageProps }) {
  // NETWORK
  const { chains, provider } = configureChains(
    [
      {
        id: Number(ChainID),
        name: Name,
        network: Network,
        nativeCurrency: {
          name: Name,
          symbol: Currency,
          decimals: Number(Decimals),
        },
        rpcUrls: {
          default: {
            http: [`${RootStockTestnetRPC}`],
          },
          public: {
            http: [`${RootStockTestnetRPC}`],
          },
        },

        blockExplorers: {
          default: {
            name: "RSK explorer",
            url: Explorer,
          },
        },
        testnet: true,
      },
    ],
    [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === Number(ChainID)) {
            return { http: `${RootStockTestnetRPC}` };
          }
          return null;
        },
        priority: 1,
      }),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "RootStake",

    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  // const myTheme = merge(midnightTheme(), {
  //   colors: {
  //     accentColor: "#562C7B",
  //     accentColorForeground: "#fff",
  //   },
  // });

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          {/* // theme={myTheme} */}
          <Component {...pageProps} />
          <Toaster />
        </RainbowKitProvider>
      </WagmiConfig>

      <script src="js/bootstrap.bundle.min.js"></script>
      <script src="js/smooth-scrollbar.js"></script>
      <script src="js/splide.min.js"></script>
      <script src="js/three.min.js"></script>
      <script src="js/vanta.fog.min.js"></script>
      <script src="js/main.js"></script>
    </>
  );
}
