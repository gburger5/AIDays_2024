const multer = require("multer");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

// load into memory first
const loadIntoMemory = upload.single("image");

const uploadToFirebase = async (req, res, next) => {
  try {
    const dateTime = Date.now();
    const storageRef = ref(
      storage,
      `files/${req.file.originalname + "   " + dateTime}`
    );
    const metadata = {
      contentType: req.file.mimetype,
    };

    // upload to bucket
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    // get url
    const url = await getDownloadURL(snapshot.ref);

    req.fileUpload = {
      name: req.file.originalname,
      type: req.file.mimetype,
      imageURL: url,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { loadIntoMemory, uploadToFirebase };
