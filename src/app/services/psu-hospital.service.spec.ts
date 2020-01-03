import { TestBed } from '@angular/core/testing';

import { PsuHospitalService } from './psu-hospital.service';

describe('PsuHospitalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PsuHospitalService = TestBed.get(PsuHospitalService);
    expect(service).toBeTruthy();
  });
});
