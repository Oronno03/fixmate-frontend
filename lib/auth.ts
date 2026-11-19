import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("fixmate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
        image: {
            type: 'string',
            required: false,
            defaultValue: null,
        },
        role: {
            type: 'string',
            required: true,
            defaultValue: "customer",
        },
        phone: {
            type: 'string',
            required: true,
        },
        area: {
            type: 'string',
            required: true,
        },
        bio: {
            type: 'string',
            required: false,
            defaultValue: null,
        }
    }
  }
});