import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BankService } from './bank.service';

@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  async findMany() {
    const [banks, err] = await this.bankService.findMany();
    if (err) throw err;
    return banks;
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [bank, err] = await this.bankService.findOne({ id });
    if (err) throw err;
    return bank;
  }
}
