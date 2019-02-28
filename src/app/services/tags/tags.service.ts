import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { IPost } from '../../interfaces/post-interface';
import { ITag } from '../../interfaces/tag-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private postsCollection: AngularFirestoreCollection<IPost>;
  private tagsCollection: AngularFirestoreCollection<ITag>

  private taggedPosts: Observable<IPost[]>
  private tags: Observable<ITag[]>

  constructor(private _afs: AngularFirestore, private _firebaseAuth: AngularFireAuth) {
    this.postsCollection = this._afs.collection<IPost>("posts");
    this.tagsCollection = this._afs.collection<ITag>("tags");
  }

  getTags() : Observable<ITag[]> {
    return this.tags = this.tagsCollection.valueChanges();
  }
  getTaggedPosts(tag: string) : Observable<IPost[]> {
    this.postsCollection = this._afs.collection<IPost>('posts', ref => {
      return ref.where("tags", "array-contains", tag )
    });
    return this.taggedPosts = this.postsCollection.valueChanges()
  }
}
