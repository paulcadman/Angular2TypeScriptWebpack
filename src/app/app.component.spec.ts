import { beforeEachProviders, async, describe, inject, it } from '@angular/core/testing';

import { AppComponent } from './app.component.ts';

describe('AppComponent', () => {

    beforeEachProviders(() => [
        AppComponent
    ]);

    it('should be created', inject([AppComponent], (appComponent: AppComponent) => {
        expect(appComponent).toBeDefined();
    }));

    it('should have title', inject([AppComponent], (appComponent: AppComponent) => {
        expect(appComponent.title).toEqual('@@@');
    }));

});