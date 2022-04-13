export class CreateProductDto {
  name: string;
  model: string;
  original_price: number;
  price: number;
  slug: string;
  image: string;

  tutorial!: string;
  description!: string;
  platform!: string;

  status: boolean;
  sale_of: number;

  variant_id!: string;
  variant_title!: string;
  variant_text!: string;

  additional_information: string;

  amount: number;

  category_id: string;
  supplier_id: string;
}
