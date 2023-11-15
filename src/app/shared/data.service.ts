import { ElementRef, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Student } from '../model/student';
import { Observable, map } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private firestore: AngularFirestore) { }

  //add student
  addStudent(student: Student) {
    student.id = this.firestore.createId();
    return this.firestore.collection('/Student').add(student)
  }

  getAllStudents(): Observable<any[]> {
    return this.firestore.collection('/Student').snapshotChanges()
  }

  deleteStudent(student: Student) {
    return this.firestore.doc('/Student/' + student.id).delete();
  }

  getStudentDocumentRef(studentId: string): AngularFirestoreDocument<Student> {
    return this.firestore.doc<Student>(`/Student/${studentId}`);
  }

  updateStudent(studentId: string, updatedData: Partial<Student>): Promise<void> {
    const studentRef = this.getStudentDocumentRef(studentId);
    return studentRef.update(updatedData);
  }

  public exportTableElmToExcel(element: ElementRef, fileName: string, studentList: any): void {
    // Clone the studentList to avoid modifying the original data
    const studentListWithoutAction = studentList.map((student) => {
      const { action, ...studentWithoutAction } = student;
      return studentWithoutAction;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentListWithoutAction);

    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');

    let timeSpan = new Date().toISOString();
    fileName = `${fileName}-${timeSpan}`;

    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
  }
}

