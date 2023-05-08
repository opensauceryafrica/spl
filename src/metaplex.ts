import { Metaplex } from '@metaplex-foundation/js';
import { Connection, PublicKey } from '@solana/web3.js';
import env from './env';

const connection = new Connection(env.RPC);

const metaplex = new Metaplex(connection);

export const HoldsCollection = async (
  collection: string,
  address: string
): Promise<boolean> => {
  const nfts = await metaplex.nfts().findAllByOwner({
    owner: new PublicKey(address),
  });

  const collectionNFTs = nfts.filter((nft) =>
    nft.collection?.address.equals(new PublicKey(collection))
  );

  return collectionNFTs.length > 0;
};
