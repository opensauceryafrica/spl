import {
  Connection,
  GetProgramAccountsFilter,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import env from './env';
import { TokenListProvider } from '@solana/spl-token-registry';
import { getMintMetadataViaMetaplex } from './metaplex';

const solanaConnection = new Connection(env.RPC);

export async function getTokenAccounts(wallet: string): Promise<string[]> {
  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165, // size of account (bytes)
    },
    {
      memcmp: {
        offset: 32, //location of our query in the account (bytes)
        bytes: wallet, //our search criteria, a base58 encoded string
      },
    },
  ];
  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    { filters: filters }
  );
  const mints: string[] = [];
  accounts.forEach((account, i) => {
    mints.push(
      (account.account.data as ParsedAccountData)['parsed']['info']['mint']
    );
  });
  return mints;
}

// retrieves information about a mint including decimals, name, symbol, and total supply
export async function getMintMetadataViaAccountInfo(
  mint: string
): Promise<any> {
  const mintInfo = await solanaConnection.getParsedAccountInfo(
    new PublicKey(mint)
  );
  return (mintInfo.value?.data as ParsedAccountData)['parsed']['info'];
}

// retrieves information about a mint including decimals, name, symbol, and total supply
export async function getMintMetadataViaTokenRegistry(
  mint: string
): Promise<any> {
  const tokenListProvider = new TokenListProvider();
  const tokenList = await tokenListProvider.resolve();
  const tokenInfo = tokenList
    ?.filterByClusterSlug('mainnet-beta')
    ?.getList()
    .find((token) => token.address === mint);
  return tokenInfo;
}

export async function getMintMetadata(mint: string): Promise<any> {
  try {
    return getMintMetadataViaTokenRegistry(mint);
  } catch (error) {
    try {
      return getMintMetadataViaAccountInfo(mint);
    } catch (error) {
      return getMintMetadataViaMetaplex(mint);
    }
  }
}
