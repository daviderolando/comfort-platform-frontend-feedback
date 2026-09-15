import { Routes } from '@angular/router';

import { adminGuard } from './admin/admin.guard';
import { authGuard } from './auth/auth.guard';
import { Data } from './data/data';
import { Feedback } from './feedback/feedback';
import { Login } from './login/login';
import { StaticPage } from './static-page/static-page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'feedback' },
  { path: 'login', component: Login },
  { path: 'feedback', component: Feedback, canActivate: [authGuard] },
  {
    path: 'notifications',
    component: StaticPage,
    canActivate: [authGuard],
    data: {
      title: 'Notifications',
      message: 'Notifications will be connected in the next backend/frontend pass.',
    },
  },
  {
    path: 'data',
    component: Data,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin').then((module) => module.Admin),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'terms',
    component: StaticPage,
    data: {
      title: 'Terms and Conditions',
      message:
        'Comfort App is a prototype application for collecting simple indoor comfort feedback in research and demonstration settings.',
      sections: [
        {
          heading: 'Prototype Use',
          body:
            'This application is provided for testing, demonstration, and research development. It should not be treated as a production service, a safety system, or a guaranteed channel for urgent building maintenance requests.',
        },
        {
          heading: 'Project Background',
          body:
            'The application was first developed within the KTH Live-In Lab project Cost- and Energy-Efficient Control Systems for Buildings and was further developed within PLEXE, Platform for Lighting Effects Experimentation Environments.',
          links: [
            {
              label: 'Cost- and Energy-Efficient Control Systems for Buildings',
              url: 'https://www.liveinlab.kth.se/en/projekt/r-d-projects/kostnads-och-energi/cost-and-energy-efficient-control-systems-for-buildings-1.945916',
            },
            {
              label: 'PLEXE project background',
              url: 'https://www.liveinlab.kth.se/en/projekt/r-d-projects/plexe-platform-for-lighting-effects-experimentation-environments-background-1.1356677',
            },
          ],
        },
        {
          heading: 'Feedback Data',
          body:
            'When you submit feedback, the app may store the selected comfort category, optional comments, timestamps, and the user, room, and building associated with your account. This information is used to inspect prototype workflows and create aggregated datasets.',
        },
        {
          heading: 'Privacy and Access',
          body:
            'Access is limited to configured users. Administrators may view feedback for buildings in order to support the prototype and evaluate collected data. Do not enter sensitive personal information in feedback comments.',
        },
        {
          heading: 'Availability',
          body:
            'The app may change, lose test data, or be temporarily unavailable while it is being developed. Features shown in the interface may be incomplete during the prototype phase.',
        },
        {
          heading: 'Contact',
          body:
            'The prototype has been developed by Davide Rolando, researcher at the KTH Energy Technology Department, Division of Applied Thermodynamics. Contact: davide.rolando@energy.kth.se.',
        },
      ],
    },
  },
  { path: '**', redirectTo: 'feedback' },
];
