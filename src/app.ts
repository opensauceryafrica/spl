import cors from 'cors';
import express, { Application } from 'express';
import { config } from 'dotenv';
config();
import env from './env';
import * as metaplex from './metaplex';
import * as solana from './solana';

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
// app.use(
//   cors({
//     origin(requestOrigin, callback) {
//       // allow all for now
//       // return callback(null, true);
//       console.log(requestOrigin);

//       // switch to this when you want to restrict the origin
//       if (requestOrigin === undefined) {
//         return callback(new Error('Not allowed by CORS'), false);
//       }

//       const o = new URL(requestOrigin!);

//       // check if accessKey is in url query and if it matches the env key
//       if (o.searchParams.get('accessKey') === env.AccessKey) {
//         return callback(null, true);
//       }

//       return callback(new Error('Not allowed by CORS'), false);
//     },
//     optionsSuccessStatus: 204,
//   })
// );

app.get('/:address/holding/:collection', async (req, res) => {
  try {
    // validate query params
    if (req.query.accessKey !== env.AccessKey) {
      throw new Error('Invalid access key');
    }

    const holding = await metaplex.mintlistHoldsCollection(
      req.params.collection,
      await solana.getTokenAccounts(req.params.address)
    );
    res.status(200).json({ holding });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(env.Port, async () => {
  console.log(`All connections established successfully 🚀`);
  console.log(`App is listening on http://localhost:${env.Port}`);
});
