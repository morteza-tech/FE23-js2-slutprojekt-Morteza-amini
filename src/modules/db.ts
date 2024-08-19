import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, remove, get } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://morteza-db712-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export type Users = {
    username: string;
    password: string;
    profilepic: string;
};

export type Comments = {
    category: "E-Sports" | "Mobile Games" | "Movies/TV-Shows";
    context: string;
    userId: string;
    username: string;
};

export async function getUsers(): Promise<Users> {
    let usersRef = ref(db, '/users');
    let snapshot = await get(usersRef);
    return snapshot.val() ?? {} as Users;
}

export async function getComments(): Promise<Comments> {
  let commentsRef = ref(db, '/comments');
  let snapshot = await get(commentsRef);
  return snapshot.val() ?? {} as Comments;
}

export async function register(username: string, password: string, profilepic: string): Promise<Users> {
  let usersRef = ref(db, '/users');
  let newUserRef = push(usersRef);
  let userInfo = { username, password, profilepic };
  await set(newUserRef, userInfo);
  return userInfo;
}

export async function deleteUser(userId: string): Promise<void> {
  let userRef = ref(db, '/users/' + userId);
  await remove(userRef);
}

export async function postComment(userid: string, category: string, context: string, username: string): Promise<Comments> {
    const url = firebaseConfig.databaseURL + "/comments/.json";
    let commentObject = { userid, category, context, username };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentObject),
    };

    let response = await fetch(url, requestOptions);
    let data = await response.json();
    return data.comments ?? {} as Comments;
}


export async function deleteComment(commentId: string): Promise<void> {
  let commentRef = ref(db, '/comments/' + commentId);
  await remove(commentRef);
}
