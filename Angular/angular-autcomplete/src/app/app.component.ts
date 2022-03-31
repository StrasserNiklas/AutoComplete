import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import './web-components/auto-complete-web-component.ts'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(http: HttpClient) {
    this.httpClient = http;
  }

  private httpClient: HttpClient;
  private data : string[] = [];
  private lesgo : string = "";

  ngAfterViewInit() {
    this.httpClient.get("assets/names.txt", { responseType: 'text' }).subscribe(data => this.setSomething(data));;
  }

  setSomething(data: string) {
    this.lesgo = data;

    var split = this.lesgo.split('\r\n');
    this.data = split;
    var component = document.querySelector<AutoCompleteElement>('wc-auto-complete');
    document.addEventListener("oncompletionselected", (event) => this.emitSelectedValue2(event));
    component.autoCompleteDataInput = this.data ;
  }

  emitSelectedValue2(event: Event) {
    console.log(event);
  }
}
