import listFunctions from '.';
import dotenv from 'dotenv';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { OpenSeaPort, Network } from 'opensea-js';

dotenv.config();

interface Asset {
	// The asset's token ID, or null if ERC-20
	tokenId: string | null;
	// The asset's contract address
	tokenAddress: string;
	// Optional for ENS names
	name?: string;
	// Optional for fungible items
	decimals?: number;
}

const BUNDLE_ASSETS: Array<Asset> = [
	{
		tokenAddress: '0x1EF29Bd36e480ebe1a45712D5E37f395459B4D3d',
		tokenId: '5',
	},
	{
		tokenAddress: '0x1EF29Bd36e480ebe1a45712D5E37f395459B4D3d',
		tokenId: '3',
	},
];
const ASSET: Asset = {
	tokenAddress: '0x1EF29Bd36e480ebe1a45712D5E37f395459B4D3d',
	tokenId: '1',
};
const expirationTime: number = Math.round(Date.now() / 1000 + 60 * 60 * 24);
const listingTime: number = Math.round(Date.now() / 1000 + 60);

// web3 provider
const provider = new HDWalletProvider(
	process.env.PRIVATE_KEY ?? '',
	process.env.NETWORK_PROVIDER ?? ''
);

// public key of the account
const accountAddress: string = provider.getAddress();

// OpenSeaJS client
let seaport;
if (process.env.API_KEY) {
	seaport = new OpenSeaPort(provider, {
		networkName: Network.Rinkeby,
	});
} else {
	seaport = new OpenSeaPort(provider, {
		networkName:
			process.env.NETWORK && process.env.NETWORK === 'test'
				? Network.Rinkeby
				: Network.Main,
		apiKey: process.env.API_KEY,
	});
}

// listFunctions object
const newSale = listFunctions(seaport);

// function to sell a single asset
newSale.sellSingleAsset(
	ASSET,
	accountAddress,
	0.5,
	expirationTime,
	listingTime
);

// function to sell a bundle
newSale.sellBundle(
	'Bundle name',
	'Bundle Description',
	BUNDLE_ASSETS,
	accountAddress,
	0.5,
	listingTime
);

// At termination, `provider.engine.stop()' should be called to finish the process elegantly.
provider.engine.stop();
