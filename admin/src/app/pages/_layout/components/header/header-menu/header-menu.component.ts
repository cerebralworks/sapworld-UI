import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

function getCurrentURL(location) {
  return location.split(/[?#]/)[0];
}

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  ulCSSClasses: string;
  rootArrowEnabled: boolean;
  location: Location;
  headerMenuDesktopToggle: string;

  constructor( private loc: Location) {
    this.location = this.loc;
  }

  ngOnInit(): void {
    
  }

  getMenuItemActive(url) {
    return this.checkIsActive(url) ? 'menu-item-active' : '';
  }

  checkIsActive(url) {
    const location = this.location.path();
    const current = getCurrentURL(location);
    if (!current || !url) {
      return false;
    }

    if (current === url) {
      return true;
    }

    if (current.indexOf(url) > -1) {
      return true;
    }

    return false;
  }
}
