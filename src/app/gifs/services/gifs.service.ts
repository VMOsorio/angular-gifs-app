import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

@Injectable({providedIn: 'root'})
export class GifsService {
  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = '9c165t58SAiO8iiil2fq595o0596n6eP';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gif Service ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  public searchTag(tag: string): void {
    if (tag.length == 0) {
      return;
    }
    this.organizeHistory(tag);

    /* fetch('https://api.giphy.com/v1/gifs/search?api_key=9c165t58SAiO8iiil2fq595o0596n6eP&q=valorant&limit=10')
    .then(resp => resp.json())
    .then(data => console.log(data)) */

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag);

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
    .subscribe(resp => {
      this.gifList = resp.data;
    });
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();
    if (this.tagsHistory.includes(tag)) {
      this._tagsHistory = this.tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) {
      return;
    }
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    this.showGifs();
  }

  private showGifs(): void {
    if (!this._tagsHistory || this._tagsHistory.length === 0) {
      return;
    }
    this.searchTag(this._tagsHistory.shift()!);
  }
}
