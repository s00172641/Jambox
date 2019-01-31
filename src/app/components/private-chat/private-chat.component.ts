import { Component, OnInit, Input } from '@angular/core';
import { IChatMessage } from '../../interfaces/chat-message-interface';
import { IPrivateChatRoom } from '../../interfaces/private-chat-room-interface';
import { ChatService } from '../../services/chat/chat.service';
import { FirebaseAuthService } from '../../services/firebaseAuth/firebase-auth.service';
import { PrivateChat } from '../../models/private-chat.model';
import { IUser } from '../../interfaces/user-interface';
import { DatabaseService } from '../../services/database/database.service';
import { ModalController } from '@ionic/angular';
import { PrivateChatPage } from '../../pages/private-chat/private-chat.page';

@Component({
  selector: 'private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.scss']
})
export class PrivateChatComponent implements OnInit {
  @Input() currentChat;

  lastMessage: IChatMessage[];
  userId: string;
  otherUser: IUser;


  constructor(
    private chatService: ChatService,
    private firebaseAuth: FirebaseAuthService,
    private databaseService: DatabaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.userId = this.firebaseAuth.getCurrentUserID();
    this.currentChat.members.forEach(element => {
      if(element != this.userId){
        this.databaseService.getCurrentUser(element).subscribe(data => {
          this.otherUser = data
        });
      }
    });
    this.chatService.getLastChatRoomMessage(this.currentChat.id).subscribe(message => {
      this.lastMessage = message;
    });
  }

  selectChat(selectedChat) {
    this.presentModal(selectedChat);
  }

  async presentModal(selectedChat) {
    let props = {
      chat: selectedChat
    };
    const modal = await this.modalController.create({
      component: PrivateChatPage,
      componentProps: props
    });
    return await modal.present();
  }
 
}
