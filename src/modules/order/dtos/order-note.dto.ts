import { IsNotEmpty, IsString } from 'class-validator';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { type OrderNoteEntity } from '../order-note.entity';

export class OrderNoteDto extends AbstractDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  constructor(orderNote: OrderNoteEntity) {
    super(orderNote);
    this.content = orderNote.content;
  }
}
