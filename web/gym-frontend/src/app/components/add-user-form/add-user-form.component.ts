import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ApiService } from '../../services/api.service'
import { CommonModule } from '@angular/common'

@Component({ 
  selector: 'app-add-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user-form.component.html',
})
export class AddUserFormComponent implements OnInit {
  userForm!: FormGroup
  submitted = false
  loading = false
  errorMessage = ''

  // event za roditelja – obavijest kad se doda user
  @Output() userAdded = new EventEmitter<void>()

  // dependency injection (novi način, preko inject())
  activeModal = inject(NgbActiveModal)
  private fb = inject(FormBuilder)
  private apiService = inject(ApiService)

  ngOnInit(): void {
    // definicija forme
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]   // default vrijednost = user
    })

    
  }

  // getter za lakši pristup kontrolama u HTML-u
  get f() {
    return this.userForm.controls
  }

  onSubmit() {
    this.submitted = true

    if (this.userForm.invalid) {
      // console.log('Forma nije validna', this.userForm.value) 
      return
    }

    this.loading = true
    this.errorMessage = ''

    // poziv prema backendu
    this.apiService.createUser(this.userForm.value).subscribe({
      next: () => {
        alert('Korisnik uspješno kreiran!')
        this.userAdded.emit()  // javi parent komponenti
        this.activeModal.close()  // zatvoriti modal
      },
      error: (err) => {
      
        this.errorMessage = err.error?.message || 'Došlo je do greške.'
        this.loading = false
      }
    })
  }
}
