import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
} from "firebase/firestore";

export interface Todo {
  name: string;
  description: string;
  date: Date;
  images: string[];
}

export const todoConverter = {
  toFirestore: (todo: Todo): DocumentData => {
    return {
      name: todo.name,
      description: todo.description,
      date: Timestamp.fromDate(todo.date),
      images: todo.images,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Todo => {
    const data = snapshot.data(options);
    return {
      name: data.name,
      description: data.description,
      date: data.date.toDate(),
      images: data.images,
    };
  },
};
