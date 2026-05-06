import { Injectable } from "@angular/core";
import { IUserProfile } from "@models/user.model";
import { BaseProfileService } from "@services/profile/base-profile.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockProfileService extends BaseProfileService {

  getProfile(refresh = false): Observable<IUserProfile> {
    return this.httpBaseService.get('assets/mock-responses/profile.json');
  }

}