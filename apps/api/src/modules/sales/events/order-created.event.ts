export class OrderCreatedEvent {
    constructor(
        public readonly orderId: string,
        public readonly customerEmail: string,
        public readonly totalAmount: number,
        public readonly orderCode: string,
    ) { }
}
