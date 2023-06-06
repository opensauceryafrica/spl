import { Metaplex, isMetadata, isNft, isSft } from '@metaplex-foundation/js';
import { Connection, PublicKey } from '@solana/web3.js';
import env from './env';

const connection = new Connection(env.RPC);

const metaplex = new Metaplex(connection);

export const walletHoldsCollection = async (
  collection: string,
  address: string
): Promise<boolean> => {
  const nfts = await metaplex.nfts().findAllByOwner({
    owner: new PublicKey(address),
  });
  const collectionNFTs = nfts.filter(
    (nft) =>
      // if the nft collection address matches the collection address | if the nft creator address matches the collection address
      nft.collection?.address.equals(new PublicKey(collection)) ||
      nft?.creators?.some((creator) =>
        creator.address.equals(new PublicKey(collection))
      )
  );
  return collectionNFTs.length > 0;
};

export const mintlistHoldsCollection = async (
  collection: string,
  mintlist: string[]
): Promise<boolean> => {
  console.log(`Total nfts in wallet: ${mintlist.length}`);
  if (mintlist.length > 500) {
    throw new Error(`Too many nfts in wallet (max. 100)`);
  }
  let counter = 0;
  for (const mint of mintlist) {
    // we are assuming early that a wallet holding a large collection should have a matching collection within the first 300 nfts
    if (counter >= 300) {
      return false;
    }
    const nft = await metaplex.nfts().findByMint({
      mintAddress: new PublicKey(mint),
    });
    console.log(nft.name, nft.address.toString());
    if (
      nft &&
      (isNft(nft) || isMetadata(nft) || isSft(nft)) &&
      (nft.collection?.address.equals(new PublicKey(collection)) ||
        nft?.creators?.some((creator) =>
          creator.address.equals(new PublicKey(collection))
        ))
    ) {
      return true;
    }
    counter++;
  }

  return false;
};

export const mintlistHoldsAnyOfCollectionMints = async (
  collectionMints: string[],
  mintlist: string[]
): Promise<boolean> => {
  // for each mint in the collectionmints check if the mintlist contains it
  for (const mint of collectionMints) {
    if (mintlist.includes(mint)) {
      return true;
    }
  }
  return false;
};
