import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';

const VerificationEmail = ({
  firstName,
  verificationToken,
}: {
  firstName: string;
  verificationToken: string;
}) => {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <Container
          style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
          }}
        >
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Img
              src="https://yourcompany.com/logo.png"
              alt="Company Logo"
              width="150"
              height="50"
              style={{ maxWidth: '100%' }}
            />
          </Section>

          <Section>
            <Text
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2d3e50',
                marginBottom: '15px',
              }}
            >
              Email Verification
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              Hello {firstName},
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              Thank you for signing up with us! To complete your registration,
              please verify your email by clicking the link below.
            </Text>

            <Row style={{ marginTop: '20px', justifyContent: 'center' }}>
              <Column style={{ textAlign: 'center' }}>
                <Link
                  href={`https://yourcompany.com/verify-email/${verificationToken}`}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Verify Email Address
                </Link>
              </Column>
            </Row>

            <Text
              style={{ fontSize: '14px', color: '#777', marginTop: '20px' }}
            >
              If you didn&apos;t request this email, you can ignore it.
            </Text>

            <Text
              style={{ fontSize: '12px', color: '#777', marginTop: '10px' }}
            >
              [Company Name] | [Company Address]
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
