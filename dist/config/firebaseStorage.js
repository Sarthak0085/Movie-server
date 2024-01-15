import { getStorage } from "firebase-admin/storage";
import { initializeApp, cert } from "firebase-admin/app";
import dotenv from "dotenv";
dotenv.config();
const firebaseConfig = {
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
