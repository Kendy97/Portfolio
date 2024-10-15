import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule,HomeComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {

  @ViewChild('typewriter', { static: false }) typewriter!: ElementRef;

  text: string = `Jestem Fullstack developerem z doświadczeniem w .NET, stawiającym pierwsze kroki w Angularze. Specjalizuję się w tworzeniu rozwiązań opartych na ASP.NET, zarówno w modelu MVC, jak i ASPX. Dobrze radzę sobie z projektowaniem i implementacją aplikacji webowych, integrując frontend z backendem.
  Mam szeroką wiedzę na temat baz danych i umiejętność tworzenia złożonych zapytań, funkcji i procedur SQL, co pozwala mi efektywnie pracować z dużymi zbiorami danych. Obecnie rozwijam swoje umiejętności front-endowe, skupiając się na Angularze, aby dostarczać nowoczesne rozwiązania webowe.
  Chętnie podejmuję wyzwania wymagające połączenia różnych technologii, stale poszerzając swoją wiedzę, aby tworzyć wydajne, skalowalne aplikacje.`;

  ngAfterViewInit() {
    this.typeText();
  }

  typeText() {
    const element = this.typewriter.nativeElement;
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < this.text.length) {
        element.innerHTML += this.text.charAt(index);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 10);
  }
}
