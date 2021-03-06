import { Component, Input, OnInit, Inject } from '@angular/core';

import { NbMenuService, NbSidebarService, NB_WINDOW } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { filter, map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReferenceComponent } from "../../../pages/reference/reference.component";
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Sanitizer } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  token: any;
  private httpOptions = {};

  user: any;
  avatar;
  userMenu: any;

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserService,
    private router: Router,
    @Inject(NB_WINDOW) private window,
    private modalService: NgbModal,
    private analyticsService: AnalyticsService,
    private authService: NbAuthService,
    private http: HttpClient,
    protected _sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.token = token.getValue(); // here we receive a payload from the token and assigne it to our `user` variable 
          this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.token
            })
          }
          var username = localStorage.getItem('currentUser');
          const url = `/api/users/username?username=${username}`;
          this.http.get<any>(url, this.httpOptions).subscribe(response => {
            this.user = response;
          })
        }
      });

    this.menuService.onItemClick()
      .pipe(
      filter(({ tag }) => tag === 'my-context-menu'),
      map(({ item }) => item),
    ).subscribe(item => {
      if (item.title == '注销') {
        this.router.navigate(["/auth/logout"]);
      } else if (item.title == '个人信息') {
        this.router.navigate(["/pages/profile/overview"]);
      } else if (item.title == '重置密码') {
        this.router.navigate(["/pages/setting/account"]);
      } else if (item.title == '设置') {
        this.router.navigate(["/pages/setting/profile"]);
      }
    });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  notification() {
    this.router.navigate(["/pages/profile/notification"]);
  }

  showLargeModal() {
    const activeModal = this.modalService.open(ReferenceComponent, { size: 'lg', container: 'nb-layout' });

    activeModal.componentInstance.modalHeader = '使用手册';
  }
}
