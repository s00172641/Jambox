import { Component, OnInit, Input } from "@angular/core";
import { DatabaseService } from "../../services/database/database.service";
import { IComment } from "../../interfaces/comment-interface";

@Component({
  selector: "app-comment-list",
  templateUrl: "./comment-list.component.html",
  styleUrls: ["./comment-list.component.scss"]
})
export class CommentListComponent implements OnInit {
  @Input() post;
  postID: string;
  comments: IComment[] = [];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.postID = this.post.id;
    this.databaseService.getComments(this.postID).subscribe(comments => {
        this.comments = comments
    });
  }
}
