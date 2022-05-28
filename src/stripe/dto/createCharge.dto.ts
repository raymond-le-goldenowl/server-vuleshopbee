import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  amount: number;
}

export default CreateChargeDto;
