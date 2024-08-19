describe('#create', {

	describe('when is a debit_card transaction', () => {

		it('should create a payable', () => {});

		it('payble status should be "paid"', () => {});

		it('payble dueDate should be now', () => {});

		it('payble discount should be 2% of the transaction amount', () => {});

		it('payable total should be subTotal - discount', () => {

		});
	});

	describe('when is a credit_card transaction', () => {

		it('should create a payable', () => {});

		it('payble status should be "waiting_funds"', () => {});

		it('payble dueDate should be thirty days ahead', () => {});

		it('payble discount should be 4% of the transaction amount', () => {});

		it('payable total should be subTotal - discount', () => {
			
		});
	});
});