import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PinnedData } from '../../models/immoData';
import { PinnedItem } from '../pinned-item/pinned-item';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-pinned-item-container',
  imports: [PinnedItem, NgFor],
  templateUrl: './pinned-item-container.html',
  styleUrl: './pinned-item-container.scss',
})
export class PinnedItemContainer {
  @Input() pinnedItems: PinnedData[] = [];
  @Output() newItemEvent = new EventEmitter<string>();

  unpinItem(pinName: string) {
    this.newItemEvent.emit(pinName);
  }
}
