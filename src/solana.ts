import {
  Connection,
  GetProgramAccountsFilter,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import env from './env';

const solanaConnection = new Connection(env.RPC);

export async function getTokenAccounts(wallet: string): Promise<PublicKey[]> {
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
  const mints: PublicKey[] = [];
  accounts.forEach((account, i) => {
    mints.push(
      new PublicKey(
        (account.account.data as ParsedAccountData)['parsed']['info']['mint']
      )
    );
  });
  return mints;
}
