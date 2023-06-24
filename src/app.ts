import cors from 'cors';
import express, { Application } from 'express';
import { config } from 'dotenv';
config();
import env from './env';
import * as metaplex from './metaplex';
import * as solana from './solana';

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.raw());
app.use(cors({ origin: '*' }));

app.get('/:address/holding/:collection', async (req, res) => {
  try {
    const holding = await metaplex.mintlistHoldsCollection(
      req.params.collection,
      await solana.getTokenAccounts(req.params.address)
    );
    res.status(200).json({ holding });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post('/holding', async (req, res) => {
  try {
    const holding = await metaplex.mintlistHoldsAnyOfCollectionMints(
      req.body.mintlist,
      await solana.getTokenAccounts(req.body.address)
    );
    res.status(200).json({ holding });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get('/mint/metadata', async (req, res) => {
  try {
    const metadata = await solana.getMintMetadata(req.query.mint as string);
    res.status(200).json({ metadata });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(env.Port, async () => {
  console.log(`All connections established successfully 🚀`);
  console.log(`App is listening on http://localhost:${env.Port}`);
});
