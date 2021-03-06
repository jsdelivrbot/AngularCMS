import { Component, OnInit,Input  } from '@angular/core';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { ShareBottomSheet } from '../../bottom_sheet/app.bottomsheet';
import { HttpService } from '../../utils/app.httpservice';
import { Router, ActivatedRoute,ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PushService } from '../../utils/app.push_service';
import { Title } from '@angular/platform-browser';
import { PostData } from '../../post.data';
@Component({
  selector: 'post-details',
  templateUrl: './postdetails.component.html',
  styleUrls: ['./postdetails.component.scss']
})
export class PostDetailsComponent implements OnInit {
  post:PostData;
  id :any;
  tagValue = null;
  constructor(private titleService: Title, private pushService: PushService,public snackBar: MatSnackBar,private httpService:HttpService,private bottomSheet: MatBottomSheet,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get('id');
    if(this.id){
      console.log(`Id of the selected post is ${this.id}`)
      this.httpService.getPost(this.id).subscribe(postData => {
        this.post = postData[0];
        this.post['views'] = (parseInt(this.post['views'])+1).toString();
        this.httpService.upsertPost(this.post).subscribe((res)=>{
          console.log("Views incremented by "+ this.post['views']);
        }) 
        this.titleService.setTitle( this.post["title"] );
      });
    }else{
      this.snackBar.open("Post id is empty", "Ok", {
        duration: 2000,
      });
    }
    this.pushService.onNewPost().subscribe(data => {
      if(data.post_id == this.post['post_id']){
        this.post = data;
      }
    });
    
  }



  likePost($event: any){
    console.log($event);
    $event.likes = $event.likes?parseInt($event.likes)+1:1;
    this.httpService.upsertPost($event).subscribe(res =>{
      console.log("Post Liked successfully")
    });
  }
  dislikePost($event: any){
    $event.dislikes = $event.dislikes?parseInt($event.dislikes)+1:1;
    this.httpService.upsertPost($event).subscribe(res =>{
      console.log("Post DisLiked successfully")
    });
  }
  openShareBottomSheet(){
    this.bottomSheet.open(ShareBottomSheet);
  }
  
}
