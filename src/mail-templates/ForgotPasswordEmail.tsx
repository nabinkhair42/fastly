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

const ForgotPasswordEmail = ({
  firstName,
  resetToken,
}: {
  firstName: string;
  resetToken: string;
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
              Forgot Password Request
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              Hello {firstName},
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              We received a request to reset your password. If you didn&apos;t
              request this change, you can safely ignore this email. Otherwise,
              click the link below to reset your password.
            </Text>

            <Row style={{ marginTop: '20px', justifyContent: 'center' }}>
              <Column style={{ textAlign: 'center' }}>
                <Link
                  href={`https://yourcompany.com/reset-password/${resetToken}`}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Reset Your Password
                </Link>
              </Column>
            </Row>

            <Text
              style={{ fontSize: '14px', color: '#777', marginTop: '20px' }}
            >
              If you didn&apos;t request this password reset, please ignore this
              email.
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

export default ForgotPasswordEmail;
