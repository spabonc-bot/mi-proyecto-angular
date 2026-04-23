import { Component } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
=======
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
>>>>>>> 301906fa262fcb1aa87e932978248093548adada

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent { 
  title = 'mi-proyecto-angular';
}