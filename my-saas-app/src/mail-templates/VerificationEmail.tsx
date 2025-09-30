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
              src="https://starter.nabinkhair.com.np/icon.png"
              alt="Fastly"
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
              Verify Your Email Address
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              Welcome to Fastly, {firstName}!
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              To complete your account setup and ensure the security of your
              Fastly account, please verify your email address by entering the
              verification code below.
            </Text>

            <Row style={{ marginTop: '30px', justifyContent: 'center' }}>
              <Column style={{ textAlign: 'center' }}>
                <Text
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#2d3e50',
                    letterSpacing: '4px',
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    margin: '0 auto',
                  }}
                >
                  {verificationToken}
                </Text>
              </Column>
            </Row>

            <Text
              style={{ fontSize: '16px', lineHeight: '1.5', marginTop: '20px' }}
            >
              Enter this code on the email verification page to activate your
              account. The code will expire in 24 hours for security reasons.
            </Text>

            <Text
              style={{
                fontSize: '14px',
                color: '#777',
                marginTop: '30px',
                textAlign: 'center',
              }}
            >
              Didn&apos;t create an account? You can safely ignore this email.
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: '#777',
                marginTop: '10px',
                textAlign: 'center',
              }}
            >
              Having trouble? Contact our support team at{' '}
              <Link
                href="mailto:support@fastly.com"
                style={{ color: '#4CAF50' }}
              >
                support@fastly.com
              </Link>
            </Text>

            <Text
              style={{
                fontSize: '12px',
                color: '#777',
                marginTop: '20px',
                textAlign: 'center',
              }}
            >
              Fastly Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
