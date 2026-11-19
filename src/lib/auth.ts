import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string);
const db = client.db("FixMate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: { 
  enabled: true, 
  },    
user: {
  additionalFields: {
    accountType: {
      type: ["Customer", "Technician"],
      required: true,
      defaultValue: "Customer",
      input: true,
    },
  },
},

plugins: [
  admin(),
],
});