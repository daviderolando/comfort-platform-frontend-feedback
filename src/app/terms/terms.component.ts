import { Subscription } from 'rxjs';
import { DataService } from './../data/data.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
})
export class TermsComponent implements OnInit, OnDestroy {
  private termsSub: Subscription;
  public termsHtml: string;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.termsHtml = '<p>Not implemented yet. Terms will be loaded from the FastAPI backend later.</p>';
  }

  ngOnDestroy() {
    if (this.termsSub) {
      this.termsSub.unsubscribe();
    }
  }
}
