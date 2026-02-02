import { InvoiceData } from './interfaces/einvoice-provider.interface';

export function buildInvoiceXml(invoice: InvoiceData): string {
  const itemsXml = invoice.items
    .map(
      (item, index) => `
        <Item>
            <LineNumber>${index + 1}</LineNumber>
            <ItemName>${item.name}</ItemName>
            <UnitName>${item.unit}</UnitName>
            <Quantity>${item.quantity}</Quantity>
            <UnitPrice>${item.price}</UnitPrice>
            <TotalAmount>${item.amount}</TotalAmount>
            <VATRate>${item.vatRate}</VATRate>
        </Item>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
    <InvoiceHeader>
        <InvoiceType>SalesInvoice</InvoiceType>
        <InvoiceName>Hóa đơn giá trị gia tăng</InvoiceName>
        <InvoiceSeries>1C24T</InvoiceSeries>
        <InvoiceNumber>${invoice.transactionRef}</InvoiceNumber>
        <InvoiceDate>${new Date().toISOString()}</InvoiceDate>
        <CurrencyCode>VND</CurrencyCode>
    </InvoiceHeader>
    <InvoiceData>
        <Buyer>
            <Name>${invoice.customerName}</Name>
            <Address>${invoice.customerAddress || ''}</Address>
            <Email>${invoice.customerEmail || ''}</Email>
            <TaxCode>${invoice.taxCode || ''}</TaxCode>
        </Buyer>
        <InvoiceItems>${itemsXml}</InvoiceItems>
        <TotalAmount>${invoice.totalAmount}</TotalAmount>
        <VATAmount>${invoice.vatAmount}</VATAmount>
        <TotalAmountWithVAT>${invoice.totalAmount + invoice.vatAmount}</TotalAmountWithVAT>
    </InvoiceData>
</Invoice>`;
}
