import { Injectable } from "@angular/core";
import { IProfile } from "@modules/user/profile/profile.component";
import { BaseProfileService } from "@services/profile/base-profile.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class MockProfileService extends BaseProfileService {

  getProfile(refresh = false): Observable<IProfile> {
    return this.http.get<IProfile>('assets/mock-data/profile.json');
  }

}
