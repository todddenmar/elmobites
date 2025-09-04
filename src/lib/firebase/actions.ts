import { db, storage } from "@/firebase";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  limit,
  deleteDoc,
  getCountFromServer,
} from "firebase/firestore";
import { DB_METHOD_STATUS } from "../config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const dbFetchCollection = async <T>(collectionName: string) => {
  try {
    const q = query(collection(db, collectionName));
    const querySnapshot = await getDocs(q);
    const results: T[] = querySnapshot.docs.map((doc) => doc.data() as T);
    return { status: DB_METHOD_STATUS.SUCCESS, data: results };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }
};

export const dbFetchCollectionWhere = async <T>({
  collectionName,
  fieldName,
  fieldValue,
  operation,
}: {
  collectionName: string;
  fieldName: string;
  fieldValue: string | number | boolean | null;
  operation?: "==" | "!=";
}) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, operation || "==", fieldValue)
    );
    const querySnapshot = await getDocs(q);
    const results: T[] = querySnapshot.docs.map((doc) => doc.data() as T);
    return { status: DB_METHOD_STATUS.SUCCESS, data: results };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }
};

export const dbFetchCollectionWhereLimit = async <T>({
  collectionName,
  fieldName,
  fieldValue,
  operation,
  collectionLimit,
}: {
  collectionName: string;
  fieldName: string;
  fieldValue: string | number | boolean | null;
  operation?: "==" | "!=";
  collectionLimit: number;
}) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, operation || "==", fieldValue),
      orderBy("timestamp", "desc"), // Sort by latest first
      limit(collectionLimit)
    );
    const querySnapshot = await getDocs(q);
    const results: T[] = querySnapshot.docs.map((doc) => doc.data() as T);
    return { status: DB_METHOD_STATUS.SUCCESS, data: results };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }
};

export type FirestoreWhereOperation = "==" | "!=";

export interface DbFetchCollectionWhere2Props {
  collectionName: string;
  fieldName: string;
  fieldValue: string | number | boolean | null;
  operation?: FirestoreWhereOperation;
  fieldName2: string;
  fieldValue2: string | number | boolean | null;
  operation2?: FirestoreWhereOperation;
  collectionLimit: number;
}
export const dbFetchCollectionWhere2Limit = async <T>({
  collectionName,
  fieldName,
  fieldValue,
  operation = "==",
  fieldName2,
  fieldValue2,
  operation2 = "==",
  collectionLimit,
}: DbFetchCollectionWhere2Props) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, operation, fieldValue),
      where(fieldName2, operation2, fieldValue2),
      orderBy("timestamp", "desc"), // Sort by latest first
      limit(collectionLimit)
    );

    const querySnapshot = await getDocs(q);
    const results: T[] = querySnapshot.docs.map((doc) => doc.data() as T);

    return { status: DB_METHOD_STATUS.SUCCESS, data: results };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }
};

export const dbFetchCollectionWhere2 = async <T>(
  collectionName: string,
  fieldName: string,
  fieldValue: string | number | boolean | null,
  operation: "==" | "!=",
  fieldName2: string,
  fieldValue2: string | number | boolean | null,
  operation2: "==" | "!="
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldName, operation || "==", fieldValue),
      where(fieldName2, operation2 || "==", fieldValue2)
    );
    const querySnapshot = await getDocs(q);
    const results: T[] = querySnapshot.docs.map((doc) => doc.data() as T);
    return { status: DB_METHOD_STATUS.SUCCESS, data: results };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }
};

export const dbUpdateDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T
) => {
  try {
    const userRef = doc(db, collectionName, id);
    await updateDoc(userRef, data);
    return { status: DB_METHOD_STATUS.SUCCESS };
  } catch (e) {
    if (e instanceof Error) {
      return { status: DB_METHOD_STATUS.ERROR, message: e.message };
    }
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: "An unknown error occurred",
    };
  }
};

export const dbUpdateSubDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  subCollectionName: string,
  subID: string,
  data: T
) => {
  try {
    const userRef = doc(db, collectionName, id, subCollectionName, subID);
    await updateDoc(userRef, data);
    return { status: DB_METHOD_STATUS.SUCCESS };
  } catch (e) {
    if (e instanceof Error) {
      return { status: DB_METHOD_STATUS.ERROR, message: e.message };
    }
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: "An unknown error occurred",
    };
  }
};

export const dbSetDocument = async <T extends DocumentData>({
  collectionName,
  id,
  data,
}: {
  collectionName: string;
  id: string;
  data: T;
}) => {
  try {
    await setDoc(doc(db, collectionName, id), data);
    return { status: DB_METHOD_STATUS.SUCCESS };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
};

export const dbSetSubDocument = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  collectionName2: string,
  id2: string,
  data: T
) => {
  try {
    await setDoc(doc(db, collectionName, id, collectionName2, id2), data);
    return { status: DB_METHOD_STATUS.SUCCESS };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "Unknown error",
    };
  }
};

//path sample `receipts/${eventID}/${imageID}`
export const dbUploadMediaByPath = async ({
  mediaFile,
  path,
}: {
  mediaFile: File;
  path: string;
}) => {
  try {
    const imageRef = ref(storage, path);
    const stringURL = await uploadBytes(imageRef, mediaFile).then(async () => {
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    });
    return { status: DB_METHOD_STATUS.SUCCESS, data: stringURL };
  } catch (e) {
    if (e instanceof Error) {
      return { status: DB_METHOD_STATUS.ERROR, message: e.message };
    }
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: "An unknown error occurred",
    };
  }
};

export async function deleteMediaFromStorage(imagePath: string) {
  try {
    const imageRef = ref(storage, imagePath); // e.g. "uploads/images/abc123.jpg"
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
  } catch (e) {
    if (e instanceof Error) {
      return { status: DB_METHOD_STATUS.ERROR, message: e.message };
    }
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: "An unknown error occurred",
    };
  }
}

export const dbDeleteImageReceipt = async ({ id }: { id: string }) => {
  try {
    await deleteDoc(doc(db, "receipts", id));
    return { status: DB_METHOD_STATUS.SUCCESS };
  } catch (e) {
    if (e instanceof Error) {
      return { status: DB_METHOD_STATUS.ERROR, message: e.message };
    }
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: "An unknown error occurred",
    };
  }
};

export const dbCountDocuments = async ({
  collectionName,
  fieldName,
  fieldValue,
  operation = "==",
}: {
  collectionName: string;
  fieldName: string;
  fieldValue: string | number | boolean | null;
  operation?: "==" | "!=";
}) => {
  try {
    const coll = collection(db, collectionName);
    const q = query(coll, where(fieldName, operation, fieldValue));
    const snapshot = await getCountFromServer(q);

    return { status: DB_METHOD_STATUS.SUCCESS, data: snapshot.data().count };
  } catch (e) {
    if (e instanceof Error) {
      return { status: DB_METHOD_STATUS.ERROR, message: e.message };
    }
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: "An unknown error occurred",
    };
  }
};