import { DatePipe } from '@angular/common';

export class Employee {
    id!: number;
    fname!: string;
    lname!: string;
    email!: string;
    salary!: number;
    department: string = '';
    designation: string = '';
    joiningDate!: string;
    photoPath: string = '';  
    
  constructor() {
    this.email = "@gmail.com";
    this.salary = 0;
    this.department = "";
    this.designation = "";
    // Set default joining date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.joiningDate = `${year}-${month}-${day}`;
  }
}
