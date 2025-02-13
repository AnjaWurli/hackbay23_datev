import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApplicantService } from '../applicant.service';

@Component({
  selector: 'app-upload-cv',
  templateUrl: './upload-cv.component.html',
  styleUrls: ['./upload-cv.component.css'],
})
export class UploadCvComponent implements OnInit {
  public myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
  });
  showSpinner = false;
  file: File | null = null;
  public address = 'https://a45d-62-128-6-5.ngrok-free.app/';
  public errorFetch = false;
  constructor(
    private httpClient: HttpClient,
    private applicantService: ApplicantService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  onButtonSave() {
    this.showSpinner = true;
    let testData: FormData = new FormData();
    testData.append('file', this.file ?? '', 'newFile.pdf');
    this.httpClient
      .post(this.address + 'uploadfile/', testData, {
        params: {
          email: this.applicantService.emailAddress,
        },
        headers: new HttpHeaders({
          'ngrok-skip-browser-warning': 'true',
        }),
      })
      .subscribe(
        (res) => {
          console.log(res);

          this.httpClient
            .get(this.address + 'cv/details/', {
              params: {
                content: res['page-content'],
                question: 'How long are they working?',
              },
              headers: new HttpHeaders({
                'ngrok-skip-browser-warning': 'true',
              }),
            })
            .subscribe(
              (result) => {
                console.log(result);

                this.httpClient
                  .post(
                    this.address + 'register/',
                    this.applicantService.selectedJobs,
                    {
                      params: {
                        email: this.applicantService.emailAddress,
                      },
                      headers: new HttpHeaders({
                        'ngrok-skip-browser-warning': 'true',
                      }),
                    }
                  )
                  .subscribe(
                    (final) => {
                      console.log(final);
                      this.showSpinner = false;
                      this.router.navigate(['thanks']);
                    },
                    (error) => {
                      console.log(error);
                      this.showSpinner = false;
                    }
                  );
              },
              (error) => {
                console.log(error);
                this.showSpinner = false;
              }
            );
        },
        (error) => {
          console.log(error);
          this.showSpinner = false;
          this.errorFetch = true;
        }
      );
  }
}
