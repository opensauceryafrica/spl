import cors from 'cors';
import express, { Application } from 'express';
import { config } from 'dotenv';
config();
import env from './env';
import { HoldsCollection } from './metaplex';

const app: Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(
  cors({
    origin(requestOrigin, callback) {
      // allow all for now
      return callback(null, true);

      // switch to this when you want to restrict the origin
      // if (requestOrigin === undefined) {
      //     return callback(null, true);
      // }
      // const o = new URL(requestOrigin);
      // // check if TLD is in the list of allowed TLDs
      // if (env.allowedTLDs.includes(o.hostname)) {
      //   return callback(null, true);
      // }
      // return callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 204,
  })
);

app.get('/:address/holding/:collection', async (req, res) => {
  try {
    const holding = await HoldsCollection(
      req.params.collection,
      req.params.address
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
