export class CreateTransactionDto {
	amount: number;
	description: string;
	paymentMethod: string;
	cardNumber: string;
	cardHolderName: string;
	cardExpirationDate: string;
	cardCvv: string;
	merchantId: number;
}