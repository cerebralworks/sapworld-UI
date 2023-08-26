import { Component,ViewChild,TemplateRef } from '@angular/core';
import {
  isSameDay,
  isSameMonth,
   parse,format
} from 'date-fns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@data/service/user.service';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { Subject } from 'rxjs';
const colors: Record<string, EventColor> = {
  blue: {
    primary: '#0066ff',
    secondary: '#66a3ff',
  },
  green: {
    primary: '#008000',
    secondary: '#b3ffb3',
  },
};


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

 @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  public appliedJobs: any[] = [];	
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh = new Subject<void>();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  
  
  constructor(private modal: NgbModal,private userService : UserService) {}
  
    //Page load function
    ngOnInit(): void {
	  this.onGetAppliedJobs();
    }
    /**
	**	TO get the shortlisted user details
	**/
	
	onGetAppliedJobs = () => {
		let requestParams: any = {};
      requestParams.page = 1;
      requestParams.limit = 100000000;
      requestParams.expand = "job_posting,user,employer";
	  requestParams.sort = "updated_at.desc";
      this.userService.applicationsListForUser(requestParams).subscribe(
        response => {
			this.appliedJobs=[];
          if(response && response.items && response.items.length > 0) {
            this.appliedJobs = [...this.appliedJobs, ...response.items];
          }
          //this.appliedJobMeta = { ...response.meta }
		  this.insertCalendarDetails();
        }, error => {
        }
      )
	}
	
	/** To insert data in the calendar **/
	insertCalendarDetails(){
	
	    if(this.appliedJobs && this.appliedJobs['length'] && this.appliedJobs['length']!=0){
			var tempArray=[];
			for(let i=0;i<=this.appliedJobs.length-1;i++){
			  var ArrayValue = this.appliedJobs[i];
			  var ArrayValueEvents = this.appliedJobs[i]['application_status'];
			  if(ArrayValue && ArrayValueEvents && ArrayValueEvents['length'] &&ArrayValueEvents['length']!=0){
			    for(let j=0;j<=ArrayValueEvents['length']-1;j++){
				
				  var ArrayResource = ArrayValueEvents[j];
				  var MeetingForm = ArrayResource['meeting_form'];
				  if(MeetingForm){
					   for(let k=0;k<=MeetingForm['length']-1;k++){
						  var ArrayMeeting=MeetingForm[k];
						  var dataValue = ArrayMeeting['link'] ;
						  var tempStatus = ArrayResource['status'];
						  var titleUpper =ArrayValue['job_posting']['title'].toUpperCase();
						  var statusUpper = tempStatus.toUpperCase();
						  var input1Date =  new Date();
						  var input2Date =  new Date(ArrayMeeting['interviewdate']);
						  var names =  ArrayValue['user']['first_name']+' '+ ArrayValue['user']['last_name'];
						  var a = input2Date.toDateString()+' '+ArrayMeeting['interviewtime'];
						  var tempTitle= ArrayValue['job_posting']['title']+' - '+tempStatus;
						  var CategoryColor={ ...colors.blue };
						  if (input1Date > input2Date && input1Date.getTime() > new Date(a).getTime()){
							CategoryColor = { ...colors.green };
						  }else{
							CategoryColor = { ...colors.blue };
						  }
						  tempTitle=tempTitle.toUpperCase();
				         var events = {
						  start: new Date(this.concatDateTime(ArrayMeeting['interviewdate'],ArrayMeeting['interviewtime'])),
						  end: new Date(this.concatDateTime(ArrayMeeting['interviewdate'],ArrayMeeting['interviewendtime'])),
						  title: tempTitle,
						  actions: this.actions,
						  meta: {
								user: names,
								zone:ArrayMeeting['zone'],
								startTime:ArrayMeeting['interviewtime'],
								endTime:ArrayMeeting['interviewendtime'],
								interviewerName:ArrayMeeting['name'],
								link:dataValue
							  },
						  color: CategoryColor
						}
						
						this.events.push(events);
						this.refresh.next();
					 }
				  }
				}
			  }	
			}
	    }
	
	}
  
  /** This function is used to combile date and time **/
    concatDateTime(date,time){
        // Convert date and time strings to Date objects
		const dateObject = parse(date, 'yyyy-MM-dd', new Date());
		const timeObject = parse(time, 'hh:mm a', new Date());
		// Combine date and time
		const combinedDateTime = new Date(
		  dateObject.getFullYear(),
		  dateObject.getMonth(),
		  dateObject.getDate(),
		  timeObject.getHours(),
		  timeObject.getMinutes(),
		  timeObject.getSeconds()
		);

		// Format the combined DateTime as desired
		//return format(combinedDateTime, 'yyyy-MM-dd hh:mm a');
		return combinedDateTime;
    }
	
  //To handle the event action
  actions: CalendarEventAction[] = [
    /*{
      label: '<i class="fas fa-fw fa-pencil-alt text-success"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    }*/
  ];

  
  /** To open the list when click the date ***/
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  
 

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'md' });
  }
  
  /** To set the calendar active view **/
  setView(view: CalendarView) {
    this.view = view;
  }
  
  /** To close the list when click **/
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
