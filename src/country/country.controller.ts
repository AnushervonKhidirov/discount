import { ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CountryService } from './country.service';

const country = {
  id: 1,
  value: 'Tajikistan',
};

const countries = [
  {
    id: 1,
    value: 'Tajikistan',
  },
  {
    id: 2,
    value: 'Uzbekistan',
  },
];

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiResponse({ example: countries })
  @Get()
  async findMany() {
    const [countries, err] = await this.countryService.findMany();
    if (err) throw err;
    return countries;
  }

  @ApiResponse({ example: country })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const [country, err] = await this.countryService.findOne({ id });
    if (err) throw err;
    return country;
  }
}
