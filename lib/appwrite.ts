import {
  Account,
  Avatars,
  Client,
  ID,
  Query,
  TablesDB,
} from "react-native-appwrite";
import { CreateUserPrams, SignInParams } from "../types";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  project: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.foodapp.app",
  databaseId: "6ab6c89a003af1165c38",
  userCollectionId: "6ab6c940001d181d46fa",
  userTableId: "6ab6c940001d181d46fa",
};

export const client = new Client();


client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.project)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new TablesDB(client);
export const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserPrams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars
      .getInitialsURL(name, 200, 200, "000000")
      .toString();



    return await databases.createRow(
      appwriteConfig.databaseId,
      appwriteConfig.userTableId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl },
    );
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
  } catch (e) {
    throw new Error(e as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();

    if (!user) throw new Error("No user found");

    const currentUser = await databases.listRows(
      appwriteConfig.databaseId,
      appwriteConfig.userTableId,
      [Query.equal("accountId", [user.$id])],
    );

    if (!currentUser || currentUser.total === 0)
      throw new Error("No user found in database");

    return currentUser.rows[0];
  } catch (e) {
    throw new Error(e as string);
  }
};
