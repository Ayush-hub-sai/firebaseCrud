import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Student } from '../model/student';
import { Observable, map } from 'rxjs';

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

}
