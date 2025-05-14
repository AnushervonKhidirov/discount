import { ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BankService } from './bank.service';

const bank = {
  id: 1,
  name: 'Alif',
  logoUrl: null,
  archived: false,
  createdAt: '2025-05-08T16:31:28.000Z',
  updatedAt: '2025-05-08T16:31:28.000Z',
};

@Controller('banks')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @ApiResponse({ example: [bank] })
  @Get()
  async findMany() {
    const [banks, err] = await this.bankService.findMany();
    if (err) throw err;
    return banks;
  }

  @ApiResponse({ example: bank })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [bank, err] = await this.bankService.findOne({ id });
    if (err) throw err;
    return bank;
  }
}
