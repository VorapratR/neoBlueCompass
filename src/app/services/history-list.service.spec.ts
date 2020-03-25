import { TestBed } from '@angular/core/testing';

import { HistoryListService } from './history-list.service';

describe('HistoryListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoryListService = TestBed.get(HistoryListService);
    expect(service).toBeTruthy();
  });
});
