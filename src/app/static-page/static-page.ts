import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface StaticPageLink {
  label: string;
  url: string;
}

interface StaticPageSection {
  heading: string;
  body: string;
  links?: StaticPageLink[];
}

@Component({
  selector: 'app-static-page',
  template: `
    <main class="static-page">
      <section>
        <h1>{{ title }}</h1>
        <p class="lead">{{ message }}</p>

        @for (section of sections; track section.heading) {
          <article>
            <h2>{{ section.heading }}</h2>
            <p>{{ section.body }}</p>
            @if (section.links?.length) {
              <ul>
                @for (link of section.links; track link.url) {
                  <li><a [href]="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a></li>
                }
              </ul>
            }
          </article>
        }
      </section>
    </main>
  `,
  styles: `
    .static-page {
      min-height: calc(100vh - 64px);
      display: grid;
      place-items: start center;
      padding: 40px 16px;
    }

    section {
      width: min(100%, 680px);
    }

    h1 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 500;
    }

    .lead,
    article p {
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.55;
    }

    .lead {
      margin: 0 0 28px;
    }

    article {
      border-top: 1px solid color-mix(in srgb, var(--mat-sys-outline) 28%, transparent);
      padding: 22px 0 0;
      margin-top: 22px;
    }

    h2 {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 8px;
    }

    article p {
      margin: 0;
    }

    ul {
      margin: 10px 0 0;
      padding-left: 20px;
    }

    li + li {
      margin-top: 6px;
    }

    a {
      color: var(--mat-sys-primary);
    }
  `,
})
export class StaticPage {
  private readonly route = inject(ActivatedRoute);

  title = this.route.snapshot.data['title'];
  message = this.route.snapshot.data['message'];
  sections: StaticPageSection[] = this.route.snapshot.data['sections'] ?? [];
}
