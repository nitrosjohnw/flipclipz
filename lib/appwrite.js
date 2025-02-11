import SignIn from '@/app/(auth)/sign-in';
import { Client , Account, ID, Avatars, Databases, Query, Storage} from 'react-native-appwrite';
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platfrom: 'com.jmw.FlipClipz',
    projectId: '678fd361000a7106eeb3',
    databaseId: '678fe3e60003cd09d88a',
    userCollectionId: '678fe41e0032bd766258',
    videoCollectionId: '678fe472002256f323b8',
    storageId:'678fe5e300320a334ea6'
}
const  {
    endpoint,
    platfrom,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = appwriteConfig;


const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId) 
    .setPlatform(appwriteConfig.platfrom) 

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


export const createUser = async (email,password,username) => {
try{
const newAccount = await account.create(
    ID.unique(),
    email,
    password,
    username,
)
if(!newAccount) throw Error;
const avatarUrl = avatars.getInitials(username)

await signIn(email,password)
const newUser = await databases.createDocument(
   appwriteConfig.databaseId,
   appwriteConfig.userCollectionId,
   ID.unique(),
   {
    accountId: newAccount.$id,
    email,
    username,
    avatar: avatarUrl
   }
)
return newUser;

}catch(error){
console.log(error);
throw new Error(error);
}
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password); 
        return session;
    } catch (error) {
        console.error("Sign-in Error:", error);
        throw new Error(error.message || "Failed to sign in");
    }
}


export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error('No account found');

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser.documents || currentUser.documents.length === 0) {
            throw new Error('No matching user found');
        }

        return currentUser.documents[0];
    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Error fetching current user');
    }
};

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )
        return posts.documents;
    } catch (error) {
      throw new Error(error)  
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching latest posts');
    }
};
export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error searching posts');
    }
};
export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(error.message || 'Error fetching user posts');
    }
};

export const signOut = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        throw new Error(error.message || 'Error signing out');
    }
};

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
        } else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) throw new Error('Failed to get file preview');

        return fileUrl;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const uploadFile = async (file, type) => {
    if (!file) return null;

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ]);

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(), 
            {
                thumbnail: thumbnailUrl,
                video: videoUrl,
                title: form.title,
                creator: form.userId,
                sport: form.sport,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error.message);
    }
};