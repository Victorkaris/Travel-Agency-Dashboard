import { ID, OAuthProvider, Query } from "appwrite";
import { redirect } from "react-router";
import { account, appwriteConfig, database } from "~/appwrite/client";

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};


export const getUser = async () => {
    try{
        const user = await account.get();

            if (!user) return redirect('/sign-in');

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        );

      return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export const logoutUser = async () => {
    try{
        await account.deleteSession('current');
        return true;
    } catch (e) {
        console.log('Error during logout', e);
    }
}


export const getGooglePicture = async (accessToken: string) => {
    try{
        // Use the token to fetch the user's Google profile picture
        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photos',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            console.error("Failed to fetch Google profile picture");
            return null;
        }


        const data = await response.json();

        // Extract the profile picture URL from the response
        const photoUrl = data.photos && data.photos.length > 0
            ? data.photos[0].url
            : null; 

            return photoUrl;

    } catch (e) {
        console.log('Error fetching Google picture', e);
    }
}

export const storeUserData = async () => {
    try{
        const user = await account.get();

        if (!user) return null;

        // check is user already exists in the database
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', user.$id),
            ]
        );

        if (documents.length > 0)  return documents[0];

        // Get profile photo from Google
        const profilePhoto = await getGooglePicture();

        // Create a new user document in the database
        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                name: user.name,
                email: user.email,
                imageUrl: profilePhoto || ' ', // Fallback image
                joinedAt: new Date().toISOString(),
                accountId: user.$id,
            }
        );
        return newUser;

    } catch (e) {
        console.log('storeUserData', e);
    }
}

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id)]
    );
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};