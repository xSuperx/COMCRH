import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppConfig
{
  urlApi = "http://172.16.1.32:80/ComAPI/";
  urlImage = "http://172.16.1.32:80/ComAPI/uploads/timthumb.php?src=api/uploads/";
  urlSpecFile = "http://172.16.1.32:80/ComAPI/uploads/file/";
  reportUrl = "http://172.16.1.32:80/ComAPI/reports/";

  getYear( value: any ){
    // console.log(value);
    // var rt = (parseInt(value.substr(0,4))-543)+'-'+value.substr(4,2)+'-'+value.substr(6,2)
    // console.log(rt);
    return parseInt(value.substr(0, 4), 10) - 543;
  }

  getMonth( value: any ){
    return parseInt(value.substr(4, 2), 10);
  }

  getDay( value: any ){
    return parseInt(value.substr(6, 2), 10);
  }

  convertDate( dd: string ){
    if (dd === "-") { return dd; }
    let ret = dd.substr(6, 2) + "/";
    ret += dd.substr(4, 2) + "/";
    ret += dd.substr(0, 4);
    return ret;
  }

  convertDate2( dd: string ){
    if (dd === "-") { return dd; }

    let ret = parseInt(dd.substr(6, 2), 10) + " ";
    ret += this.getMonthName(parseInt(dd.substr(4, 2), 10)) + " ";
    ret += dd.substr(0, 4);
    return ret;
  }

  getMonthName( mm: number ){
    switch (mm) {
      case 1: return "ม.ค.";
      case 2: return "ก.พ.";
      case 3: return "มี.ค.";
      case 4: return "เม.ย.";
      case 5: return "พ.ค.";
      case 6: return "มิ.ย.";
      case 7: return "ก.ค.";
      case 8: return "ส.ค.";
      case 9: return "ก.ย.";
      case 10: return "ต.ค.";
      case 11: return "พ.ย.";
      case 12: return "ธ.ค.";
      default: return "-";
    }
  }

  getMonthNameFull( mm: number ){
    switch (mm) {
      case 1: return "มกราคม";
      case 2: return "กุมภาพันธ์";
      case 3: return "มีนาคม";
      case 4: return "เมษายน";
      case 5: return "พฤษภาคม";
      case 6: return "มิถุนายน";
      case 7: return "กรกฎาคม";
      case 8: return "สิงหาคม";
      case 9: return "กันยาคม";
      case 10: return "ตุลาคม";
      case 11: return "พฤศจิกายน";
      case 12: return "ธันวาคม";
      default: return "-";
    }
  }

  padLeft( data, size, paddingChar ){
    return (new Array(size + 1).join(paddingChar || "0") + String(data)).slice(
      -size
    );
  }

  convertDP2Bd( dtp: any ){
    const y = dtp.date.year + 543;
    const m = this.padLeft(dtp.date.month, 2, "0");
    const d = this.padLeft(dtp.date.day, 2, "0");
    return "" + y + m + d;
  }

  GetSelect2IdByTxt( Str, StrArray ){
    for (let j = 0; j < StrArray.length; j++) {
      if (StrArray[j].text == Str) {
        return StrArray[j].id;
      }
    }
    return -1;
  }

  GetSelect2TxtByID( Str, StrArray ){
    for (let j = 0; j < StrArray.length; j++) {
      if (StrArray[j].id === Str) {
        return StrArray[j].text;
      }
    }
    return -1;
  }

  Get3Year(){
    const ObjArray = new Array();
    const ToDay = new Date();
    const sYearBef = ToDay.getFullYear() + 543 - 1;
    for (let i = 0; i <= 2; i++) {
      ObjArray.push({
        id: sYearBef + i,
        text: sYearBef + i
      });
    }
    return ObjArray;
  }

  Get3Year2(){
    const ObjArray = new Array();
    const ToDay = new Date();
    const sYearBef = ToDay.getFullYear() - 1;
    for (let i = 0; i <= 2; i++) {
      ObjArray.push({
        id: sYearBef + i,
        name: sYearBef + i
      });
    }
    return ObjArray;
  } // [{id:2020,name:2020}]

  getCurDateTime2Db(){
    const ToDay = new Date();
    var cYear, cMonth, cDay, cTime, cFullDatetime :string;
    cYear  = "" + ToDay.getFullYear();
    cYear  = cYear.substring( 2, 4 );
    cMonth = "" + (ToDay.getMonth()+1);
    cDay   = "" + ToDay.getDate();
    cMonth = this.padLeft(cMonth, 2, "0");
    cDay   = this.padLeft(cDay, 2, "0");
    cTime  = "" + this.padLeft(ToDay.getHours(), 2, "0") +
             "" + this.padLeft(ToDay.getMinutes(), 2, "0") +
             "" + this.padLeft(ToDay.getSeconds(), 2, "0");
    cFullDatetime = cYear + "" + cMonth + "" + cDay + "" + cTime;
    return cFullDatetime;
  } // Current Time -> YYMMDDHHmmss 191002155623

  getCurDateNow(){
    const ToDay = new Date();
    var cYear, cMonth, cDay, cFullDatetime :string;
    cYear  = "" + ToDay.getFullYear();
    // cYear  = cYear.substring( 2, 4 );
    cMonth = "" + (ToDay.getMonth()+1);
    cDay   = "" + ToDay.getDate();
    cMonth = this.padLeft(cMonth, 2, "0");
    cDay   = this.padLeft(cDay, 2, "0");
    // cFullDatetime = cDay +"-"+ cMonth +"-"+ cYear;
    cFullDatetime = cYear +"-"+ cMonth +"-"+ cDay;
    return cFullDatetime;
  } // Current Date -> YYYY-MM-DD 2019-10-19

  getCurDateTimeNow(){
    const ToDay = new Date();
    var cYear, cMonth, cDay, cTime, cFullDatetime :string;
    cYear  = "" + ToDay.getFullYear();
    // cYear  = cYear.substring( 2, 4 );
    cMonth = "" + (ToDay.getMonth()+1);
    cDay   = "" + ToDay.getDate();
    cMonth = this.padLeft(cMonth, 2, "0");
    cDay   = this.padLeft(cDay, 2, "0");
    cTime  = "" + this.padLeft(ToDay.getHours(), 2, "0") +
             ":" + this.padLeft(ToDay.getMinutes(), 2, "0") +
             ":" + this.padLeft(ToDay.getSeconds(), 2, "0");
    // cFullDatetime = cDay +"-"+ cMonth +"-"+ cYear;
    cFullDatetime = cDay +"/"+ cMonth +"/"+ cYear +"-"+ cTime;
    return cFullDatetime;
  } // Current Time -> DD/MM/YYYY-HHmmss 19/10/2019-09:23:25

  getCurTimeNow(){
    const ToDay = new Date();
    var cTime :string;
    cTime  = "" + this.padLeft(ToDay.getHours(), 2, "0") +
             ":" + this.padLeft(ToDay.getMinutes(), 2, "0") ;
    return cTime;
  } // Current Time -> HH:mm -09:23

  ConvDb2DateTime( zDateTime ){
    var sYear  = zDateTime.substr( 0, 2 );
    var sMonth = zDateTime.substr( 2, 2 );
    var sDay   = zDateTime.substr( 4, 2 );
    var sHours = zDateTime.substr( 6, 2 );
    var sMinute = zDateTime.substr( 8, 2 );
    var sSecond = zDateTime.substr( 10, 2 );
    // console.log( sYear, sMonth, sDay, sHours, sMinute, sSecond );
    sYear = "" + (2000 + parseInt(sYear,10));
    var StrRes = sDay
                 +"/"+ sMonth
                 +"/"+ sYear
                 +"-"+ sHours
                 +":"+ sMinute
                 +":"+ sSecond;
    return StrRes;
  } // YYMMDDHHmmss -> DD/MM/YYYY-HH:mm:ss

  ConvDb2Date( zDateTime ){
    var sYear  = zDateTime.substr( 0, 4 );
    var sMonth = zDateTime.substr( 4, 2 );
    var sDay   = zDateTime.substr( 6, 2 );
    var StrRes = sDay+"/"+ sMonth +"/"+ sYear;
    return StrRes;
  } // YYYYMMDD -> DD/MM/YYYY

  ConvDb2DateYMD( zDateTime ){
    var sYear  = zDateTime.substr( 0, 4 );
    var sMonth = zDateTime.substr( 4, 2 );
    var sDay   = zDateTime.substr( 6, 2 );
    var StrRes = sYear +"-"+ sMonth +"-"+ sDay;
    return StrRes;
  } // YYYYMMDD -> YYYY-MM-DD

  ConvDate2Db( zDateTime ){
    var sDay   = zDateTime.substr( 0, 2 );
    var sMonth = zDateTime.substr( 3, 2 );
    var sYear  = zDateTime.substr( 6, 4 );
    var StrRes = ""+sYear+sMonth+sDay;
    return StrRes;
  } // DD/MM/YYYY -> YYYYMMDD

  ConvDateTime2Db( zDateTime ){
    var sYear  = zDateTime.substr( 6, 4 );
    var sMonth = zDateTime.substr( 3, 2 );
    var sDay   = zDateTime.substr( 0, 2 );
    var sHours = zDateTime.substr( 11, 2 );
    var sMinute = zDateTime.substr( 14, 2 );
    var sSecond = zDateTime.substr( 17, 2 );
    // console.log( sYear, sMonth, sDay, sHours, sMinute, sSecond );
    var StrRes = sYear + sMonth + sDay +
                 sHours + sMinute + sSecond;
    return StrRes;
  } // DD/MM/YYYY-HH:mm:ss -> YYMMDDHHmmss

  GetDiffTime( time1, time2: any ){
    var hour1 = time1.split(':')[0];
    var hour2 = time2.split(':')[0];
    var min1 = time1.split(':')[1];
    var min2 = time2.split(':')[1];
    // var hour1 = time1.substr( 0, 2 );
    // var hour2 = time2.substr( 0, 2 );
    // var min1 = time1.substr( 2, 2 );
    // var min2 = time2.substr( 2, 2 );
    var diff_hour = hour2 - hour1;
    var diff_min = min2 - min1;

    if(diff_hour<0){
      diff_hour+= 24;
    }

    if(diff_min<0){
      diff_min+=60;
      diff_hour--;
    }else if(diff_min>=60){
      diff_min-=60;
      diff_hour++;
    }

    if(diff_hour>0){
      diff_min = (60 * diff_hour) + diff_min;
    }

    return diff_min;
  } // "08:00", "09:15" -> 75 Minite

  MonthList = [
    {id: '01', name: 'มกราคม' },
    {id: '02', name: 'กุมภาพันธ์' },
    {id: '03', name: 'มีนาคม' },
    {id: '04', name: 'เมษายน' },
    {id: '05', name: 'พฤษภาคม' },
    {id: '06', name: 'มิถุนายน' },
    {id: '07', name: 'กรกฏาคม' },
    {id: '08', name: 'สิงหาคม' },
    {id: '09', name: 'กันยายน' },
    {id: '10', name: 'ตุลาคม' },
    {id: '11', name: 'พฤศจิกายน' },
    {id: '12', name: 'ธันวาคม' }
  ];

  YearList = [
    {id: '2019', name: '2019' },
    {id: '2020', name: '2020' },
    {id: '2021', name: '2021' },
    {id: '2022', name: '2022' },
    {id: '2023', name: '2023' },
    {id: '2024', name: '2024' }
  ];

  UseState = [
    {id: 'Y', name: 'ใช้งาน' },
    {id: 'N', name: 'ยกเลิก' }
  ];

  FindCharInString( zChar, zString :string ){
    var index = zString.indexOf(zChar);
    return index;
  }

}
