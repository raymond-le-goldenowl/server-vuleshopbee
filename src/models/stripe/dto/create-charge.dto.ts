import { IsString, IsNotEmpty } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  amount: number;
}

export default CreateChargeDto;
