import { Injectable, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, reduce } from "rxjs/operators";
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import * as firebase from "firebase/";

import { IPrivateChatRoom } from "../../interfaces/private-chat-room-interface";
import { IChatMessage } from "../../interfaces/chat-message-interface";
import { IGroupChatRoom } from "../../interfaces/group-chat-room-interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private privateChatsCollection: AngularFirestoreCollection<IPrivateChatRoom>;
  private privateChats: Observable<IPrivateChatRoom[]>;

  private groupChatsCollection: AngularFirestoreCollection<IGroupChatRoom>;
  private groupChats: Observable<IGroupChatRoom[]>;

  private chatMessagesCollection: AngularFirestoreCollection<IChatMessage>;
  private chatMessages: Observable<IChatMessage[]>;

  constructor(private _afs: AngularFirestore) { }

  //GET Requests
  //Gets all the private chat rooms the user is a part of
  getPrivateChatRooms(userID: string): Observable<IPrivateChatRoom[]> {
    this.privateChatsCollection = this._afs.collection<IPrivateChatRoom>("privatechats", ref => {
      return ref.where('members', 'array-contains', userID);
    });
    this.privateChats = this.privateChatsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as IPrivateChatRoom;
          const id = a.payload.doc.id;
          return { id, ...data };
      })));
    return this.privateChats;
  }
  //Gets all the group chat rooms the user is a part of
  getGroupChatRooms(userID: string): Observable<IGroupChatRoom[]> {
    this.groupChatsCollection = this._afs.collection<IGroupChatRoom>("groupchats", ref => {
      return ref.where('members', 'array-contains', userID);
    });
    this.groupChats = this.groupChatsCollection.snapshotChanges().pipe(
      map(actions => 
        actions.map(a => {
          const data = a.payload.doc.data() as IGroupChatRoom;
          const id = a.payload.doc.id;
          return { id, ...data };
      })));
    return this.groupChats;
  }
  //Gets messages for a specific chat room using chatRoomId
  getChatRoomMessages(chatRoomId: string): Observable<IChatMessage[]> {
    this.chatMessagesCollection = this._afs.collection<IChatMessage>("messages", ref => {
      return ref.where('chatRoomID', '==', chatRoomId)
                .orderBy('createdAt', 'asc');
    });
    this.chatMessages = this.chatMessagesCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as IChatMessage;
          const id = a.payload.doc.id;
          return { id, ...data };
      })));
    return this.chatMessages;
  }
  //Gets last chat room message
  getLastChatRoomMessage(chatRoomId: string): Observable<IChatMessage[]> {
    this.chatMessagesCollection = this._afs.collection<IChatMessage>("messages", ref => {
      return ref.where('chatRoomID', '==', chatRoomId)
                .orderBy('createdAt', 'desc')
                .limit(1);
    });
    this.chatMessages = this.chatMessagesCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as IChatMessage;
          const id = a.payload.doc.id;
          return { id, ...data };
      })));
    return this.chatMessages;
  }

  //POST Requests
  //Creates a new private chat room / Adds a new document into private chats collection
  createPrivateChatRoom(privateChatRoom) {
    this.privateChatsCollection.add(privateChatRoom);
  }
  //Creates a new group chat room / Adds a new document into group chats collection
  createGroupChatRoom(groupChatRoom) : void {
    this.groupChatsCollection.add(groupChatRoom);
  }
  //Creates a new message / Adds a new document into messages collection
  createChatMessage(chatMessage): void {
    // this.chatMessagesCollection.add(chatMessage);
    this._afs.collection("messages").add({
      chatRoomID: chatMessage.chatRoomID,
      senderID: chatMessage.senderID,
      senderName: chatMessage.senderName,
      message: chatMessage.message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  //PUT Requests
  //Adds uid of blocked user to string array in current users doc
  addBlockedUser(blockedUid: string, userUid: string){
    this._afs.collection("users").doc(userUid).update({
      blockedUsers: firebase.firestore.FieldValue.arrayUnion(blockedUid)
    });
  }

  //DELETE Requests
  //Remove blocked user
  removeBlockedUser(blockeduid: string, userUid: string){
    this._afs.collection("users").doc(userUid).update({
      blockedUsers: firebase.firestore.FieldValue.arrayRemove(blockeduid)
    });
  }
  //Deletes a private chat room from the private chats collection using id
  deletePrivateChatRoom(chatRoomID: string): void {
    this.privateChatsCollection.doc(chatRoomID).delete();
  }
  //Deletes a group chat room from the group chats collection using id
  deleteGroupChatRoom(chatRoomID: string): void {
    this.groupChatsCollection.doc(chatRoomID).delete();
  }
  //Deletes a message from a chat room using id
  deleteChatRoomMessage(chatMessageId: string): void {
    this.chatMessagesCollection.doc(chatMessageId).delete();
  }
}
