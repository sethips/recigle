import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { RecipeRequest } from './recipe-query';

@Injectable()
export class RecipeService {

  private static readonly serverURI = '//yev.pythonanywhere.com/recipes/';
  private matchMatrix: any = {
    'all': {
      'all': '',
      'any': '&match_any_level=seasoning'
    },
    'any': {
      'all': '&match_any_level=ingredients',
      'any': '&match_any_level=all'
    }
  };

  constructor(private http: Http) {}

  getRecipes(requestOb: RecipeRequest): Observable<any> {
    return this.http.get(this.buildRequestURI(requestOb))
      .map( (res) => res.json() );
  }

  private buildRequestURI(requestOb: RecipeRequest): string {

    if (requestOb.ingredients.length === 0) {
      return RecipeService.serverURI;
    }

    let requestURL = RecipeService.serverURI + '?ingredients=' + requestOb.ingredients.join('|');

    if (this.hasSeasonings(requestOb.seasonings)) {
      requestURL += '&seasonings=' + requestOb.seasonings.join('|');
    }

    requestURL += this.getMatchLevel(requestOb);
    return requestURL;
  }

  private hasSeasonings(seasonings: string[] = null): boolean {
    return seasonings !== null && seasonings.length > 0;
  }

  private getMatchLevel(requestOb: RecipeRequest): string {
    const matchLevel = '&match_any_level=';
    if (!this.hasSeasonings(requestOb.seasonings)) {
      return requestOb.ingredientsMatchType === 'any' ? '&match_any_level=ingredient' : '';
    }
    const iMatchType = requestOb.ingredientsMatchType;
    const sMatchType = requestOb.seasoningsMatchType;
    return this.matchMatrix[iMatchType][sMatchType];
  }
}

