import { Component } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    template: `
    <div class="d-flex justify-content-center">
        <div class="spinner-border text-info text-center" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>`
})
export class LoadingSpinnerComponent {

}