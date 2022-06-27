import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/auth/state/user.model';
import { GlobalQuery } from 'src/app/state/global.query';
import { Food } from 'src/app/_user-profile/foods/state/food.model';
import { FoodService } from 'src/app/_user-profile/foods/state/food.service';
import { Snackbar } from 'src/app/__share/helper/snackbar';
import { Comment } from '../../_interfaces/comment.interface';
import { CardsService } from '../../_services/cards.service';
import { CommentService } from '../../_services/comment.service';
import { RatingService } from '../../_services/rating.service';
import { UsernamePipe } from './username.pipe';

@Component({
  selector: 'app-more-modal',
  templateUrl: './more-modal.component.html',
  styleUrls: ['./more-modal.component.scss']
})
export class MoreModalComponent implements OnInit, OnChanges, AfterViewInit {

  modal            : HTMLElement;
  iRate            : number;
  rate             : number;
  lengthRating     : number;
  commentForm      : FormGroup;
  comments         : any[] = [];
  user             : User;
  customUser       : { _id: number, image: string };
  message          : string;
  showNotLoginModal: boolean = false;
  mainCommentId    : number;
  isReplay         : boolean = false;
  // replayComments   : any[];

  
  @Input() loggedIn        : boolean | undefined;
  @Input() moreModalShow   : boolean;
  @Input() food            : Food;
  @Input() ref             : string;

  @Output() onCloseMoreModal     = new EventEmitter<boolean>()
  @Output() onSendDataToFoodCard = new EventEmitter<Food[]>()
  @Output() changeZIndexOverlay  = new EventEmitter()
  @ViewChild('modal') moreModal  : ElementRef;
  @ViewChildren('textarea') textarea: QueryList<ElementRef>
  
  constructor(
    private ratingService     : RatingService,
    private _snackbar         : Snackbar,
    private globalQuery       : GlobalQuery,
    private elRef             : ElementRef,
    private commentService    : CommentService,
    private foodService       : FoodService,
    private cardService       : CardsService,
    private renderer          : Renderer2,
  ) {}


  ngAfterViewInit(): void {
    this.textarea.changes.subscribe(value => {
      value.forEach((textarea: ElementRef) => {
        const scrollHeight = textarea.nativeElement.scrollHeight;
        this.renderer.setStyle(textarea.nativeElement, 'height', `${scrollHeight}px`)
      });
      
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    for (const key in changes) {
      if (key === 'food' && this.moreModalShow) {                  
          this.averageRate();
          this.setRateUser();
          this.foodPopulatedComment(); // inint comment
          this.user = this.getUserLocalStorage();
      }
    }
  }

  ngOnInit(): void {
    this.loggedIn = this.globalQuery.isLoggedIn;
    this.initForm();
    this.modal = this.elRef.nativeElement.querySelector('.not-login-modal');
    this.message = 'برای ارسال نظر باید وارد حساب کاربری شوید.';
  }


  changeRating(rate: number) {  
    if (this.globalQuery.isLoggedIn) {
      const id = this.food._id ? this.food._id : 0;      
      this.ratingService.update(id, rate).subscribe(
        res => {
          if (res) {   
            let sum = 0;                     
            res.food.rating.forEach((item: any) => {
              sum += item.rate;
              this.rate = +(sum / res.food.rating.length).toFixed(1);              
            });
            this.setRateUser();
            this.refreshFoodCard();
            this._snackbar.addSnackbar(res.message, res?.err, 3000);
          }
        }
      )
    } else {
      this.showNotLoginModal = true;
    }
  }


  closeNoLoginModal() {
    this.showNotLoginModal = false;
  }


  setRateUser() {        
    this.lengthRating = this.food.rating?.length;
    
    if (this.food._id && this.globalQuery.isLoggedIn) {
      this.ratingService.setRateUser(this.food._id).subscribe(
        res => {
          if (res) {       
            if (Array.isArray(res.rating)) {
              this.lengthRating = res.rating.length;
              const item = res.rating?.filter(
                (rater: { userId: number, rate: number }) => rater.userId === this.user.id)              
              this.iRate = item[0].rate;  
            } else {
              this.iRate = res.rate;
            }            
          };
        }
      )
    }
  }

  closeMoreModal() {
    this.onCloseMoreModal.emit(true);
  }


  averageRate() {               
    this.rate = this.food.average;        
  }


  initForm() {
    this.commentForm = new FormGroup({
      text: new FormControl(null, Validators.required)
    })
  }


  submit(commentForm: FormGroup) {    
    if (this.globalQuery.isLoggedIn) {
      const foodId = this.food._id ? this.food._id : 0
      const comment: Comment = { 
        foodId,
        text: commentForm.value.text 
      };

      if (this.isReplay) this.submitReplayComment(comment, this.mainCommentId); 
      else this.submitComment(comment);
      this.foodPopulatedComment(); // refresh for new comment
    } else {
      this.showNotLoginModal = true;
    }
    commentForm.reset();
  }



  submitComment(comment: Comment) {
    this.commentService.create(comment).subscribe(
      res => {
        if (res) {
          this._snackbar.addSnackbar(res.message, res?.err, 3000)
        }
      }
    )
  }



  submitReplayComment(comment: Comment, mainCommentId: number) {
    this.commentService.replayComment(comment, mainCommentId).subscribe()
  }



  foodPopulatedComment() {
    const id = this.food._id ? this.food._id : 0;    
    this.foodService.getPopulatedComment(id).subscribe(
      res => {
        if (res) { 
          this.food = res;
          this.comments = res.comment;
        }
      }
    )
  }


  refreshFoodCard() {
    if (this.ref === 'most_popular') {
      this.cardService.popular().subscribe(
        res => {
          if (res) {                      
            this.onSendDataToFoodCard.emit(res.foods);
          }
        }
        )
      }
      if (this.ref === 'newest') {
      this.cardService.newest().subscribe(
        res => {
          if (res) {            
            this.onSendDataToFoodCard.emit(res.foods);
          }
        }
      )
    }
  }



  getUserLocalStorage() {
    return JSON.parse(window.localStorage.getItem('elsfu') || '{}');
  }



  replayMainComment(anchorEl: HTMLDivElement, commentForm: FormGroup, comment: any) {
    this.replay(anchorEl)
    const userNamePipe = new UsernamePipe();
    
    this.mainCommentId = comment._id;
    commentForm.patchValue({ text: `@${userNamePipe.transform(comment.userId.email)}`});
  }
  
  
  replaySubComment(anchorEl: HTMLDivElement, commentForm: FormGroup, comment: any, replay: any) {
    this.replay(anchorEl)
    const userNamePipe = new UsernamePipe();

    this.mainCommentId = comment._id;
    commentForm.patchValue({ text: `@${userNamePipe.transform(replay.userId.email)}`})
  }
  
  
  replay(anchorEl: HTMLDivElement) {
    this.isReplay = true;
    anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
