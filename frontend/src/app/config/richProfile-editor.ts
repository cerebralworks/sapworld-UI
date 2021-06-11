import { InjectionToken } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

export const textEditorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  // height: 'auto',
  // minHeight: '200px',
  // maxHeight: 'auto',
  // width: 'auto',
  // minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'times-new-roman', name: 'Times New Roman' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'comic-sans-ms', name: 'Comic Sans MS' }
  ],
  customClasses: [
    {
      name: 'quote',
      class: 'quote',
    },
    {
      name: 'redText',
      class: 'redText'
    },
    {
      name: 'titleText',
      class: 'titleText',
      tag: 'h1',
    },
  ],
 // uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [[
  'insertImage',
    'insertVideo'
  ] 
  ]
};
