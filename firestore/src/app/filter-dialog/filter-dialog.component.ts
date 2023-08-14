/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData, filterCategories, filterCities } from './dialogdata';


@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FilterDialogComponent {
  cities: string[] = filterCities;
  categories: string[] = filterCategories;
  selectedSortOptions: DialogData = structuredClone(this.data);

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.dialogRef.backdropClick().subscribe(_ =>
      dialogRef.close(this.data)
    );
  }

  onApplyClick(): void {
    this.dialogRef.close(this.selectedSortOptions);
  }

  onCancelClick(): void {
    this.dialogRef.close(this.data);
  }

}
