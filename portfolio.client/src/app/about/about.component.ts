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

  textEn: string = `I am a Fullstack developer with experience in .NET, taking my first steps in Angular. I specialize in creating solutions based on ASP.NET, both in MVC and ASPX models. I am proficient in designing and implementing web applications, integrating the frontend with the backend.
  I have extensive knowledge of databases and the ability to create complex queries, functions, and SQL procedures, which allows me to work efficiently with large data sets. Currently, I am developing my frontend skills, focusing on Angular to deliver modern web solutions.
  I enjoy taking on challenges that require combining different technologies, continuously expanding my knowledge to create efficient, scalable applications.`;
  ngAfterViewInit() {
    this.typeText();
  }

  typeText() {
    const element = this.typewriter.nativeElement;
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < this.textEn.length) {
        element.innerHTML += this.textEn.charAt(index);
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 10);
  }
}
