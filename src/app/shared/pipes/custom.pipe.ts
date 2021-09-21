import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'Custom' })

export class CustomPipe implements PipeTransform {

  transform( value: any, format: any ){
    if( value!='-' && value!=null ){
        if( format=='fDate' ){
            return value.substr(6,2) +'/'+ value.substr(4,2) +'/'+ value.substr(0,4);
        }else if( format=='fDateTime' ){
            return value.substr(6,2) +'/'+ value.substr(4,2) +'/'+ value.substr(0,4) +'-'+
                   value.substr(8,2) +':'+ value.substr(10,2) +':'+ value.substr(12,2);
        }else if( format=='fDateTime2' ){
            return value.substr(4,2) +'/'+ value.substr(2,2) +'/'+ value.substr(0,2) +'-'+
                   value.substr(6,2) +':'+ value.substr(8,2) +':'+ value.substr(10,2);
        }else if( format=='fTime' ){
            return value.substr(0,2) +':'+ value.substr(2,2);
        }else if( format=='fZero' ){
            if( value=='.000'){ return "0"; }
            else{ return parseInt(value).toFixed(0); }
        }else if( format=='Propblem' ){
            if( value=='HW'){ return "Hardware"; }
            if( value=='SW'){ return "Software"; }
            if( value=='DV'){ return "Developer"; }
            if( value=='PW'){ return "Peopleware"; }
            if( value=='NW'){ return "Network"; }
            if( value=='SR'){ return "Server"; }
            if( value=='SP'){ return "Special"; }
            if( value=='IF'){ return "Information"; }
            else{ return value }
        }else if( format=='SLA' ){
            if( value=='SLA1'){ return "ตอบปัญหาทางโทรศัพท์"; }
            if( value=='SLA2'){ return "เปลี่ยนทดแทนคอมฯ/อุปกรณ์ต่อพ่วง"; }
            if( value=='SLA3'){ return "เปลี่ยนผ้าหมึก"; }
            if( value=='SLA4'){ return "แก้ไขปัญหาใช้งานระบบ HIS"; }
            if( value=='SLA5'){ return "การกู้คืนระบบเครือข่ายคอมฯ"; }
            if( value=='SLA6'){ return "การประมวลข้อมูลสารสนเทศ"; }
            else{ return value }
        }else{
            return value;
        }
    }else{
        return value;
    }
  }

}