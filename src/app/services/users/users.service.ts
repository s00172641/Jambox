import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../../interfaces/user-interface';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersColection: AngularFirestoreCollection<IUser>;
  private users: Observable<IUser[]>;

  private fireDocUser: AngularFirestoreDocument<IUser>;
  private currentUser: Observable<IUser>;

  constructor(private _afs: AngularFirestore) {
    this.usersColection = _afs.collection<IUser>("users", ref => ref.limit(10));
   }
  
  getUsersByQuery(query: string): Observable<IUser[]> {
    this.usersColection = this._afs.collection<IUser>("users", ref => {
      return ref.orderBy('lowerDisplayName', 'asc')
                .startAt(query)
                .endAt(query + "\uf8ff")
                .limit(5);
    });
    this.users = this.usersColection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as IUser;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
    );
    return this.users;
  }

  getSpecificUserById(userId: string): Observable<IUser> {
    this.fireDocUser = this._afs.doc<IUser>("users/" + userId);
    this.currentUser = this.fireDocUser.valueChanges();
    return this.currentUser;
  }

  checkIfUsernameExists(username: string): Observable<IUser[]> {
    this.usersColection = this._afs.collection<IUser>("users", ref => {
      return ref.where('lowerDisplayName', '==', username.toString().toLowerCase())
    });

    this.users = this.usersColection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as IUser;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
    );
    return this.users;
  }
  
  getAllUsers() : Observable<IUser[]> {
    this.usersColection = this._afs.collection<IUser>("users", ref => ref.limit(10));
    this.users = this.usersColection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as IUser;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
    return this.users;
  }
}