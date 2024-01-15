import { getStorage } from "firebase-admin/storage";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import dotenv from "dotenv";

dotenv.config();

interface FirebaseConfig extends ServiceAccount {
    type?: string;
    project_id?: string;
    private_key_id?: string;
    private_key?: string;
    client_email?: string;
    client_id?: string;
    auth_uri?: string;
    token_uri?: string;
    auth_provider_x509_cert_url?: string;
    client_x509_cert_url?: string;
}

const firebaseConfig: FirebaseConfig = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replace newline characters
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

initializeApp({
    credential: cert(firebaseConfig),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

// initializeApp({
//     credential: cert({
//         type: process.env.FIREBASE_TYPE,
//         project_id: process.env.PROJECT_ID,
//         private_key_id: process.env.PRIVATE_KEY_ID,
//         private_key: process.env.PRIVATE_KEY,
//         client_email: process.env.CLIENT_EMAIL,
//         client_id: process.env.CLIENT_ID,
//         auth_uri: process.env.AUTH_URI,
//         token_uri: process.env.TOKEN_URI,
//         auth_provider_x509_cert_url: process.env.AUTH_X509_CERT_URL,
//         client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
//     }),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// });

const storage = getStorage().bucket();

export default storage;