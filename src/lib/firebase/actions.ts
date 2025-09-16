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
  getDoc,
  WhereFilterOp,
  Timestamp,
} from "firebase/firestore";
import { DB_METHOD_STATUS } from "../config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const dbFetchDocument = async <T>(
  collectionName: string,
  id: string
) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { status: DB_METHOD_STATUS.ERROR, message: "No data found" }; // No data found
    }

    return { status: DB_METHOD_STATUS.SUCCESS, data: docSnap.data() as T };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }
};

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
// types/firestore.ts
export type CustomWhereOp = WhereFilterOp | "between";

export type TCollectionWhere2Props = {
  collectionName: string;
  where: {
    fieldName: string;
    fieldValue:
      | string
      | number
      | boolean
      | Timestamp
      | (string | number | boolean | Timestamp)[];
    operation: CustomWhereOp;
  };
  where2?: {
    fieldName: string;
    fieldValue:
      | string
      | number
      | boolean
      | Timestamp
      | (string | number | boolean | Timestamp)[];
    operation: CustomWhereOp;
  };
};

export const dbFetchCollectionWhere2 = async <T>({
  collectionName,
  where: where1,
  where2,
}: TCollectionWhere2Props) => {
  try {
    const constraints = [];

    // handle first where
    if (where1.operation === "between" && Array.isArray(where1.fieldValue)) {
      const [start, end] = where1.fieldValue as [Timestamp, Timestamp];
      constraints.push(
        where(where1.fieldName, ">=", start),
        where(where1.fieldName, "<=", end)
      );
    } else {
      constraints.push(
        where(
          where1.fieldName,
          where1.operation as WhereFilterOp,
          where1.fieldValue
        )
      );
    }

    // handle second where
    if (where2) {
      if (where2.operation === "between" && Array.isArray(where2.fieldValue)) {
        const [start, end] = where2.fieldValue as [Timestamp, Timestamp];
        constraints.push(
          where(where2.fieldName, ">=", start),
          where(where2.fieldName, "<=", end)
        );
      } else {
        constraints.push(
          where(
            where2.fieldName,
            where2.operation as WhereFilterOp,
            where2.fieldValue
          )
        );
      }
    }

    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    const results: T[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    return { status: DB_METHOD_STATUS.SUCCESS, data: results };
  } catch (e) {
    return {
      status: DB_METHOD_STATUS.ERROR,
      message: e instanceof Error ? e.message : "An unknown error occurred",
    };
  }
};
export type TCollectionWhere1Props = {
  collectionName: string;
  where: {
    fieldName: string;
    fieldValue:
      | string
      | number
      | boolean
      | Timestamp
      | (string | number | boolean | Timestamp)[];
    operation: CustomWhereOp;
  };
};
export const dbFetchCollectionWhere1 = async <T>({
  collectionName,
  where: where1,
}: TCollectionWhere1Props) => {
  try {
    const constraints = [];

    // handle first where
    if (where1.operation === "between" && Array.isArray(where1.fieldValue)) {
      const [start, end] = where1.fieldValue as [Timestamp, Timestamp];
      constraints.push(
        where(where1.fieldName, ">=", start),
        where(where1.fieldName, "<=", end)
      );
    } else {
      constraints.push(
        where(
          where1.fieldName,
          where1.operation as WhereFilterOp,
          where1.fieldValue
        )
      );
    }
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    const results: T[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

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

export const dbUpdateDocumentWhereMulti = async (
  collectionName: string,
  conditions: { field: string; op: WhereFilterOp; value: unknown }[],
  data: Record<string, unknown>
) => {
  try {
    const colRef = collection(db, collectionName);

    // build query with multiple wheres
    let q = query(colRef);
    conditions.forEach((cond) => {
      q = query(q, where(cond.field, cond.op, cond.value));
    });

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { status: DB_METHOD_STATUS.ERROR, message: "No documents found" };
    }

    // update all matched docs
    for (const docSnap of snapshot.docs) {
      await updateDoc(docSnap.ref, data);
    }

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
      return downloadURL as string;
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


export const dbDeleteDocumentByID = async ({
  collectionName,
  id,
}: {
  collectionName: string;
  id: string;
}) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
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