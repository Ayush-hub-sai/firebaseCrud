import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Student } from 'src/app/model/student';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  studentList: Student[] = []

  // studentList$?: Observable<Student[]>;
  id: string = ''
  first_name: string = ''
  last_name: string = ''
  email: string = ''
  mobile: string = ''
  editItem = false;

  updateItem: any = {}

  studentObj: Student = {
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile: ''
  }

  constructor(private _authService: AuthService, private _dataService: DataService) { }
  private searchSubject = new Subject<string>();
  ngOnInit(): void {
    this.getAllStudent()

    // this.studentList = this.searchSubject.pipe(
    //   debounceTime(300), // Adjust the debounce time as needed
    //   distinctUntilChanged(),
    //   switchMap(query => {
    //     if (query.trim() !== '') {
    //       return this._dataService.searchStudents(query);
    //     } else {
    //       return this._dataService.getStudents();
    //     }
    //   })
    // );
  }

  search(query: string): void {
    this.searchSubject.next(query);
  }

  searchQuery = ''
  // search(query: string): void {
  //   if (query.trim() !== '') {
  //     this._dataService.searchStudents(query).subscribe((res: any) => {
  //       this.studentList = res
  //     })
  //   }
  // }


  getAllStudent() {
    this._dataService.getAllStudents().subscribe((res: any) => {
      this.studentList = res.map((e: any) => {
        const data = e.payload.doc.data()
        data.id = e.payload.doc.id;
        return data;
      })
    }, err => {
      alert("Error while fetching the data")
    })
  }

  addStudent() {
    if (this.first_name == '' || this.last_name == '' || this.email == '' || this.mobile == '') {
      alert("Please fill all input fields")
      return
    }

    this.studentObj.id = ''
    this.studentObj.email = this.email
    this.studentObj.first_name = this.first_name
    this.studentObj.last_name = this.last_name
    this.studentObj.mobile = this.mobile

    this._dataService.addStudent(this.studentObj)
    this.resetForm()

  }

  resetForm() {
    this.id = ''
    this.first_name = ''
    this.last_name = ''
    this.email = ''
    this.mobile = ''
  }

  updateStudent(item: any) {
    this.editItem = true
    if (this.editItem) {
      this.id = item.id
      this.first_name = item.first_name
      this.last_name = item.last_name
      this.email = item.email
      this.mobile = item.mobile
    } else {
      this.resetForm()
    }
  }

  EditStudent(): void {
    const studentId = this.id;

    this.updateItem = {
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      mobile: this.mobile
    }

    this._dataService.updateStudent(studentId, this.updateItem)
      .then(() => {
        console.log('Student updated successfully');
      })
      .catch((error) => {
        console.error('Error updating student:', error);
      });

  }

  deleteStudent(student: Student) {
    if (window.confirm('Are you sure you want to delete' + student.first_name + '' + student.last_name + '?')) {
      this._dataService.deleteStudent(student)
    }
  }

  Cancel() {
    this.editItem = false
    this.resetForm()
  }


  

}
