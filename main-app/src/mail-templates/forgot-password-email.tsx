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
              src="https://fastly.nabinkhair.com.np/icon.png"
              alt="Fastly"
              width="150"
              height="150"
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
              Reset Your Password
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>Hi {firstName},</Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              We received a request to reset the password for your Fastly account. No worries - it
              happens to the best of us! If you made this request, click the button below to
              securely reset your password.
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5', marginTop: '10px' }}>
              For your security, this reset link will expire in 24 hours. If you didn&apos;t request
              this password reset, you can safely ignore this email - your account remains secure.
            </Text>

            <Row style={{ marginTop: '30px', justifyContent: 'center' }}>
              <Column style={{ textAlign: 'center' }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/reset-password/?token=${resetToken}`}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#000',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                  }}
                >
                  Reset Password
                </Link>
              </Column>
            </Row>

            <Text
              style={{
                fontSize: '14px',
                color: '#777',
                marginTop: '30px',
                textAlign: 'center',
              }}
            >
              Didn&apos;t request this? No action needed. Your password remains unchanged.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ForgotPasswordEmail;
