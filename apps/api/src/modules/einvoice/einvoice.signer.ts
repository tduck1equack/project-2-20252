import * as crypto from 'crypto';

export interface SignedXmlResult {
  xml: string;
  signature: string;
}

export function signInvoiceXml(xml: string): SignedXmlResult {
  // In a real scenario, this would use a private key from HSM/USB Token
  // Here we generate a mock signature hash
  const hash = crypto.createHash('sha256').update(xml).digest('base64');
  const signature = `MOCK-SIG-${hash.substring(0, 32)}`;

  // Inject signature into XML (simplified)
  const signedXml = xml.replace(
    '</Invoice>',
    `<Signature>${signature}</Signature></Invoice>`,
  );

  return {
    xml: signedXml,
    signature,
  };
}
