import { Component, OnInit } from '@angular/core';
import { CONFIG } from 'config';
declare var $ :any;
declare var google: any
import { Router, ActivatedRoute } from '@angular/router';
import { UserServiceService } from 'src/app/userService/user-service.service';
import { MessageService } from 'src/app/userService/message.service';
import { PaginationService } from 'src/app/userService/pagination.service';
import { AuthGuard } from 'src/app/authGuard/auth.guard';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';
import { MapsAPILoader, MouseEvent, FitBoundsAccessor } from '@agm/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js'
@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit {

  clubownerID                  : any;
  clubId                       :any;
  page                         :   number=1;
  limit                        :   number=10;
  pager                         :   any = {};
  totalPages                    :   number;
  allItems_length               :   number;
  offset_limit     :   any = {
    offset: 0,
    limit: 10,
    searchTerm: ''
 } ;
  searchUserTerm               :   any="";
  data                         :   any = [];
  checked                      :   boolean=true;
  edit                         : boolean= false;
  transfer                     : boolean= false;
  mainTableDiv                 :   boolean=true      ;
  addEditDiv                   :   boolean=false     ;
  viewDataDiv                  :   boolean=false     ;
  transferDiv                  :   boolean=false     ;
  viewData                     :   any;
  clubOwnerList                :   any=[];
  selectedOwner                :  any;
  item                         :   any=[];
  onetimeCallApi               : boolean=false;
  countryListArray             :   any=[];
  imagePath2                   :   any              ;
  LogoImgURL                   :   any              ;
  logo                         :   any;
  public resOpeningTime        : string = 'Opening Time';
  public resClosingTime        : string = 'Closing Time';
  public searchControl         : FormControl;
  formatString                 : string = 'HH:mm';
  interval                     : number = 30;
  zoom                         : number;
  // restAddress                  : any;ss
  latitude                     : any;
  longitude                    : any;
  address                      : string;
  status                        :  any;
  private geoCoder;
  @ViewChild('search',{static: true})
  public searchElementRef : ElementRef;
  masterSelected:boolean;
  checklist:any;
  checkedList:any=[];

  constructor(
    private _appservice: UserServiceService,
    private _message: MessageService,
    private pagerService: PaginationService,
    private authguard: AuthGuard,
    private spinner: NgxSpinnerService,
    private ActivatedRoute: ActivatedRoute,
    private _router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {

    $("#addEditDiv").hide();
    this.ActivatedRoute.params.subscribe(param=>
      {
            this.clubownerID = param.id;

      });
      this.getClubOwnerList();
      this.getClubList(this.offset_limit,0);
      this.getCountryList();
      this.setCurrentPosition();
      this.getgoogleAddress();
  }

  checkUncheckAll() {

    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }

  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
      this.checkedList.push(this.checklist[i]._id);
    }
    this.checkedList = JSON.stringify(this.checkedList);
    console.log("this.checkedList",this.checkedList);

  }
  transferClub() {
    this.transfer = true;

    if (this.checkedList.length < 1 ) {

      let errorMessage = 'please select any club first';
      this._message.showError(errorMessage);
      return false;

    } else {

      this.transferDiv = true;
      this.viewDataDiv=false;
      this.addEditDiv = false;
      this.mainTableDiv=false;


    }

  }
  updateTransfer() {

    if (this.item.transferOwner == '' || this.item.transferOwner == undefined || this.item.transferOwner == null ) {

      let errorMessage = 'please select any club owner';
      this._message.showError(errorMessage);
      return false;

    }

    let obj={
      clubOwnerId:this.item.transferOwner._id,
      clubId : JSON.parse(this.checkedList)
    }
    console.log(obj);
    console.log(typeof(obj.clubId));
    this.spinner.show();
    let url="admin/update-club-ownership";
    this._appservice.postApi(url,obj).then((Response) => {
    this.spinner.hide();

    if (Response.STATUSCODE == 4002) {
      this._message.showError(Response.message);
      this.authguard.logOut();
      location.reload();
    } else {

        if (Response.response_code === 200) {
        this._message.showSuccess(Response.response_message);
        this.transferDiv = false;
        this.viewDataDiv=false;
        this.mainTableDiv=true;
        this.getClubList(this.page, 1);

        } else {
            this._message.showWarning(Response.message);
        }
    }
    },
    (Error) => {
    this._message.showWarning(Error.message);

    });
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

        this.getClubList(this.page, 1);

        }
  }

  backToPreviousPage(){
    this._router.navigate(['/club-module/club']);
  }
  getSearchedUser(event){
    this.getClubList(this.offset_limit, 0);
  }
  searchUserCloseTerm(){
    this.searchUserTerm="";
    this.getClubList(this.offset_limit, 0);
  }
  addNew(){
    this.edit=false;
    this.viewDataDiv=false;
    this.transferDiv = false;
    this.mainTableDiv=false;
    this.item=[];
    $("#addEditDiv").show();

    this.clubOwnerList.forEach(element =>
      {
         if(this.clubownerID == element._id){

          this.item.selectedOwner = element ;



         }

      });



  }
  changeStatus(event,clubId) {

    if(event === true){
      this.status="yes";
    }else{
      this.status="no";
  }
    let obj={
                clubId:clubId,
                status : this.status
            }
    this.spinner.show();
    let url="admin/update-club-status";
    this._appservice.postApi(url,obj).then((Response) => {
    this.spinner.hide();

        if (Response.STATUSCODE == 4002) {
          this._message.showError(Response.message);
          this.authguard.logOut();
          location.reload();
        } else {

            if (Response.response_code === 200) {
            this._message.showSuccess(Response.response_message);
            this.getClubList(this.offset_limit, 1);
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
  closeButtonPress(){
    this.addEditDiv = false;
    this.edit=false;
    this.viewDataDiv=false;
    this.transferDiv = false;
    this.mainTableDiv=true;

    $("#addEditDiv").hide();

  }
  managerDropdownEvent(event)
  {



    this.clubOwnerList.forEach(element =>
      {
         if(event._id == element._id){

          this.item.selectedOwner = element ;



         }

      });

  }
  tranferDropDownEv(event)
  {



    this.clubOwnerList.forEach(element =>
      {
         if(event._id == element._id){

          this.item.transferOwner = element ;



         }

      });

  }

  getCountryList()
  {

    this._appservice.getJSON().subscribe(data => {
      data.map(element =>
        {
           element.countryCode = element.name + '(' + element.dial_code +')';

        });
      this.countryListArray = data;
     });


  }

  countryDropdownEvent(event)
  {


      this.item.dial_code = event.dial_code;




  }
  OnLogoSelect(event,files)
  {
        this.logo = <File>event.target.files[0];

        if (files.length === 0)
        return;

        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null)
        {
          //  let errorMessage = this.translateService.instant(_('Only images are supported'));
          this._message.showError('Only images are supported');
          return;
        }

        var reader = new FileReader();
        this.imagePath2 = files;
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) =>
        {
          this.LogoImgURL = reader.result;
        }

  }
  //*************************** google map autosearch address ********************************//
  getgoogleAddress() {
    //load Places Autocomplete
    this.zoom = 10;

    this.searchControl = new FormControl();
    //set current position
    this.setCurrentPosition();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,
        {

        });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          var myplace = [];
          myplace.push(place);;
          myplace.forEach((element) => {
            var formatted_address = element.formatted_address;
            this.item.address = formatted_address
          });
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
  private setCurrentPosition(lat?: number, long?: number) {

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (lat != null || lat != undefined) {
          this.latitude = lat;
          this.longitude = long;
        } else {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        }
        this.zoom = 12;
      });
    }


  }
  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          // this.address = results[0].formatted_address;

        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  getViewDetails(item){

    this.viewData = item ;

    // this.gymManagerDetails=item.gymManagerDetails;
    this.edit= false;
    this.addEditDiv=false;
    this.viewDataDiv=true;
    this.mainTableDiv=false;
    this.transferDiv = false;
  }
  getDetails(item){

    this.edit=true;
    this.addEditDiv=true;
    this.viewDataDiv=false;
    this.mainTableDiv=false;
    this.transferDiv = false;

    this.clubId = item._id;

    this.item=[];
    $("#addEditDiv").show();

    this.spinner.show();
    var url="admin/get-club-list?clubId="+item._id;

    this._appservice.getApi(url).then((Response) =>
        {
            this.spinner.hide();

            if (Response.response_code == 4000) {
              this._message.showError(Response.response_message);
              this.authguard.logOut();
              location.reload();
            } else {
                if (Response.response_code === 200) {
                    this.item = Response.response_data.docs[0];

                    this.item.phone = this.item.phoneNumber;
                    this.item.webLink = this.item.website;
                    this.item.logo = this.item.clubBanner;
                    this.item.currentLogo = this.item.clubBanner;
                    this.latitude = this.item.lat;
                    this.longitude = this.item.long;


                    this.clubOwnerList.map(element =>
                      {
                         if(this.item.clubOwnerId == element._id){

                          this.item.selectedOwner = element ;



                         }

                      });
                      console.log("data",this.item);


                } else {
                    this._message.showWarning(Response.message);
                }
            }
         },
        (Error) => {
          this._message.showWarning(Error.message);

        });

  }
  saveData() {

    var web =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if (this.item.name == '' || this.item.name == undefined) {
      let errorMessage = 'please provide club name';
      this._message.showError(errorMessage);
      return false;

    } else if (this.item.selectedOwner == '' || this.item.selectedOwner == undefined) {
      let errorMessage = 'please provide club Owner ';
      this._message.showError(errorMessage);
      return false;

    } else if (this.item.address == '' || this.item.address == undefined) {
      let errorMessage = 'please provide  address ';
      this._message.showError(errorMessage);
      return false;

    } else if ((this.item.webLink!=undefined && this.item.webLink!='')  && !web.test(this.item.webLink)) {
      let errorMessage = 'please Provide valid website link';
      this._message.showError(errorMessage);
      return false;

    } else {

      var op = new Date(this.item.openingTime).toJSON();
      var cl = new Date(this.item.closingTime).toJSON()



      const formData = new FormData();
      formData.append('name', this.item.name);
      formData.append('clubOwnerId', this.item.selectedOwner._id);
      formData.append('countryCode', this.item.dial_code != undefined ? this.item.dial_code : '');
      formData.append('phoneNumber', this.item.phone != undefined ? this.item.phone : '');
      formData.append('danceFloor', this.item.danceFloor != undefined ? this.item.danceFloor : 'no');
      formData.append('nudeClub', this.item.nudeClub != undefined ? this.item.nudeClub : 'no');
      formData.append('openingTime', op != undefined ? op : '');
      formData.append('closingTime', cl != undefined ? cl : '');
      formData.append('website', this.item.webLink != undefined ? this.item.webLink : '');
      formData.append('address', this.item.address);
      formData.append('long', this.longitude);
      formData.append('lat', this.latitude);

      if(this.logo != undefined ){

        formData.append('clubBanner', this.logo);
      }




      var url="admin/add-club" ;
      this.spinner.show();
            this._appservice.fileUpload(url,formData).then((Response) =>
            {
              this.spinner.hide();


                if(Response.STATUSCODE == 4002)
                {
                            this._message.showError(Response.message);
                            this.authguard.logOut();
                }
                else
                {
                            if (Response.response_code == 200)
                            {
                                this._message.showSuccess(Response.response_message);



                                $("#addEditDiv").hide();
                                this.viewDataDiv=false;
                                this.mainTableDiv=true;
                                this.getClubList(this.page, 1);


                            } else {
                                this._message.showError(Response.response_message);

                            }

                }
          }, (Error) => {
                    this._message.showError(Error.message);
          });
    }

  }
  updateData() {

    var web =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if (this.item.name == '' || this.item.name == undefined) {
      let errorMessage = 'please provide club name';
      this._message.showError(errorMessage);
      return false;

    } else if (this.item.selectedOwner == '' || this.item.selectedOwner == undefined) {
      let errorMessage = 'please provide club Owner ';
      this._message.showError(errorMessage);
      return false;

    } else if (this.item.address == '' || this.item.address == undefined) {
      let errorMessage = 'please provide  address ';
      this._message.showError(errorMessage);
      return false;

    } else if ((this.item.webLink!=undefined && this.item.webLink!='')  && !web.test(this.item.webLink)) {
      let errorMessage = 'please Provide valid website link';
      this._message.showError(errorMessage);
      return false;

    } else {

      var op = new Date(this.item.openingTime).toJSON();
      var cl = new Date(this.item.closingTime).toJSON()



      const formData = new FormData();
      formData.append('clubId', this.clubId);
      formData.append('name', this.item.name);
      formData.append('clubOwnerId', this.item.selectedOwner._id);
      formData.append('countryCode', this.item.dial_code != undefined ? this.item.dial_code : '');
      formData.append('phoneNumber', this.item.phone != undefined ? this.item.phone : '');
      formData.append('danceFloor', this.item.danceFloor != undefined ? this.item.danceFloor : 'no');
      formData.append('nudeClub', this.item.nudeClub != undefined ? this.item.nudeClub : 'no');
      formData.append('openingTime', op != undefined ? op : '');
      formData.append('closingTime', cl != undefined ? cl : '');
      formData.append('website', this.item.webLink != undefined ? this.item.webLink : '');
      formData.append('address', this.item.address);
      formData.append('long', this.longitude);
      formData.append('lat', this.latitude);

      if(this.logo != undefined ){

        formData.append('clubBanner', this.logo);
      }




      var url="admin/edit-club" ;
      this.spinner.show();
            this._appservice.fileUpload(url,formData).then((Response) =>
            {
              this.spinner.hide();


                if(Response.STATUSCODE == 4002)
                {
                            this._message.showError(Response.message);
                            this.authguard.logOut();
                }
                else
                {
                            if (Response.response_code == 200)
                            {
                                this._message.showSuccess(Response.response_message);



                                $("#addEditDiv").hide();
                                this.viewDataDiv=false;
                                this.mainTableDiv=true;
                                this.getClubList(this.page, 1);


                            } else {
                                this._message.showError(Response.response_message);

                            }

                }
          }, (Error) => {
                    this._message.showError(Error.message);
          });
    }

  }
  deleteData(item)
  {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })

          swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
          }).then((result) =>
          {

            if (result.value)                                     //when click on ok button execute the delete data code
            {                                                     // else  display cancelled message
         // =============== Code for delete record is here=============================//

                this.edit=true;

                var obj=
                            {
                                "clubId"    :   item._id
                            }

                var url="admin/delete-club" ;


                this._appservice.postApi(url,obj).then((Response) =>
                {

                        if(Response.STATUSCODE == 4002)
                        {
                                this._message.showError(Response.message);
                                this.authguard.logOut();
                        }
                        else
                        {
                                if (Response.response_code == 200)
                                {

                              // ========== show successfully deleted dialog box ===========//

                                    swalWithBootstrapButtons.fire(
                                                                      'Deleted!',
                                                                      'Club has been deleted.',
                                                                      'success'
                                                                  )

                                  this._message.showSuccess(Response.response_message);

                                  this.getClubList(this.page, 1);




                                } else {
                                    this._message.showError(Response.response_message);

                                }

                        }
                    }, (Error) => {
                        this._message.showError(Error.message);
                    });

         // =============== Code for delete record is finished  here=============================//


            }
            else if ( result.dismiss === Swal.DismissReason.cancel)
            {
                swalWithBootstrapButtons.fire(
                                                'Cancelled',
                                                'Club not deleted:)',
                                                'error'
                                            )
            }
          })


    }
  getClubList(data,onLoad: any) {
    this.spinner.show();
    var url="admin/get-club-list?clubOwnerId="+this.clubownerID+"&page=" + this.page+ '&name='+ this.searchUserTerm + "&limit=" +this.limit;

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
                    this.checklist = this.data;

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
  getClubOwnerList() {
    this.spinner.show();
    let url="admin/get-user-list?userType=clubowner";
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

                this.clubOwnerList = result;


                this.clubOwnerList.map(element =>
                  {
                     element.name = element.firstName + ' ' + element.lastName;

                  });
                  //console.log("clubOwnerList",this.clubOwnerList);

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
