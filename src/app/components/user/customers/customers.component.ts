import { Component, OnInit } from '@angular/core';
import { CONFIG } from 'config';
declare var $ :any;
import * as io from 'socket.io-client';
import { UserServiceService } from 'src/app/userService/user-service.service';
import { MessageService } from 'src/app/userService/message.service';
import { PaginationService } from 'src/app/userService/pagination.service';
import { AuthGuard } from 'src/app/authGuard/auth.guard';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  data                         :   any=[];
  item                         :   any=[];
  imagePath                    =   CONFIG.API_ENDPOINT;
  imgURL                       :   any;
  selectedBanner               :   any;
  bannerImg                    :   any;
  selected_id                  :   any;
  catList                      :   any=[];
  loading                      =    false;
  checked                      :   boolean=true     ;
  pageSize                     :   number=10;
  pageIndex                    :   number=1;
  edit                         :   boolean=false;
  loadmoreDisable              :   boolean=true;
  selectedUserStatus           :   any="";


  offset_limit     :   any = {
    offset: 0,
    limit: 10,
    searchTerm: ''
 } ;

 page                          :   number=1         ;
 limit                         :   number=10        ;
 pager                         :   any = {}         ;
 pagedItems                    :   any[]            ;
 totalPages                    :   number           ;
 allItems_length               :   number           ;
 doc_type                      :   any=''           ;
 status                        :  any;
 searchUserTerm                :  any="";
 selectedUserId                :  any=''

pdfSrc = "https://nodeserver.mydevfactory.com:3196/uploads/user/govtIssuedId/5fd9faa2f02784253c806a15_1608125011798.pdf";

doc_array=[
      {status:'All', value:''},
      {status:'Approved', value:'approved'},
      {status:'Pending', value:'pending'},
      {status:'Rejected', value:'rejected'}
]
  constructor(
    private _appservice: UserServiceService,
    private _message: MessageService,
    private pagerService: PaginationService,
    private authguard: AuthGuard,
    private spinner: NgxSpinnerService,


)   { }
  ngOnInit()
  {
  this.getUserList(this.offset_limit, 0);

  }
  onDocTypeChange(event){
    this.doc_type=event.target.value;
    this.page=1;
    this.getUserList(this.offset_limit, 0);
  }
  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems_length, page);

    // console.log('pager', this.pager);

    if (this.pager.totalPages > 0) {

        this.offset_limit.offset = this.pager.startIndex;

        this.offset_limit.limit = this.pager.endIndex + 1;

        // console.log('this.offset_limit',this.offset_limit);

        this.page=this.offset_limit.offset/10 +1;

        this.limit=10;

        this.getUserList(this.page, 1);

        }
  }
  getUserList(data, onLoad: any) {
        this.spinner.show();
        let url="admin/get-user-list?limit=" + this.limit +
                "&page="+ this.page +
                "&name="+ this.searchUserTerm +
                "&userType="+"customer"+
                "&doc_verify="+ this.doc_type +
                "&status=" + this.selectedUserStatus;
        this._appservice.getApi(url).then((Response) =>
        {
            this.spinner.hide();

            if (Response.response_code == 4000) {
              this._message.showError(Response.response_message);
              this.authguard.logOut();
              location.reload();
            } else {
                if (Response.response_code === 200) {
                    const result =  Response.response_data.docs;

                    this.data = result;
                    this.data.forEach(element => {
                      if(element.govtIssuedId){
                        let x = element.govtIssuedId.split(".");
                        element.docType = x[3];
                      }
                    });
                    console.log("data",this.data);

                    this.totalPages = Response.response_data.total;

                    this.allItems_length=  this.totalPages ;

                    if (onLoad === 0)
                    {
                        this.setPage(1);
                    }


                } else {
                    this._message.showWarning(Response.message);
                }
            }
         },
        (Error) => {
          this._message.showWarning(Error.message);

        });

  }
  getViewDetails(item)
  {
    $('#modal-form').modal('show');
    this.item=item;
  }
  changeStatus(event,user_id) {
      if(event === true){
        this.status="yes";
      }else{
        this.status="no";
    }
      let obj={
                  user_id:user_id,
                  status : this.status
              }
      this.spinner.show();
      let url="admin/update-user-status";
      this._appservice.postApi(url,obj).then((Response) => {
      this.spinner.hide();

          if (Response.STATUSCODE == 4002) {
            this._message.showError(Response.message);
            this.authguard.logOut();
            location.reload();
          } else {

              if (Response.response_code === 200) {
              this._message.showSuccess(Response.response_message);
              this.getUserList(this.offset_limit, 1);
                  // const result = Response.response;
                  // this.data = result;

              } else {
                  this._message.showWarning(Response.message);
              }
          }
      },
      (Error) => {
        this._message.showWarning(Error.message);

      });


  }
  getSearchedUser(event){
    this.getUserList(this.offset_limit, 0);
  }
  searchUserCloseTerm(){
  this.searchUserTerm="";
  this.getUserList(this.offset_limit, 0);
  }
  openApproveModal(data){
      this.item=data;
      $('#approveModal').modal('show');
      console.log("data",data);
      this.selectedUserId = data._id;

  }
  approveUserDoc(status){

       let obj={
            user_id    : this.selectedUserId,
            doc_verify : status
        }
        this.spinner.show();
        let url="admin/admin-doc-verify";
        this._appservice.postApi(url,obj).then((Response) => {
        this.spinner.hide();

        if (Response.STATUSCODE == 4002) {
        this._message.showError(Response.message);
        this.authguard.logOut();
        location.reload();
        } else {
          if (Response.response_code === 200) {
          this._message.showSuccess(Response.response_message);
          this.item.state = status;
          this.item.doc_verify = status;


          this.getUserList(this.offset_limit, 1);
              // const result = Response.response;
              // this.data = result;
          } else {
              this._message.showWarning(Response.message);
          }
        }
        },
        (Error) => {
        this._message.showWarning(Error.message);

        });
  }

}
