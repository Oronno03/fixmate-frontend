import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const globalForMongo = globalThis as unknown as {
  _fixmateMongoClient?: MongoClient;
};

const client =
  globalForMongo._fixmateMongoClient ??
  new MongoClient(process.env.MONGODB_URI as string);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._fixmateMongoClient = client;
}

const db = client.db("fixmate");

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  trustedOrigins,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      area: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [jwt()],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;

      const body = ctx.body as
        | { password?: unknown; role?: unknown }
        | undefined;

      if (typeof body?.password === "string") {
        if (body.password.length < 6) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must be at least 6 characters.",
          });
        }
        if (!/[A-Z]/.test(body.password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must contain at least one uppercase letter.",
          });
        }
        if (!/[a-z]/.test(body.password)) {
          throw new APIError("BAD_REQUEST", {
            message: "Password must contain at least one lowercase letter.",
          });
        }
      }

      if (body && !["customer", "technician"].includes(String(body.role))) {
        body.role = "customer";
      }
    }),
  },
});
