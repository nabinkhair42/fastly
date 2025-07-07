import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Img,
  Section,
  Row,
  Column,
  Link,
} from '@react-email/components';

const WelcomeEmail = ({ firstName }: { firstName: string }) => {
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
              Welcome to Our Service!
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              Hello {firstName},
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              We are excited to have you on board. Thank you for signing up with
              us. Our service helps you [describe service briefly]. We are here
              to support you along the way.
            </Text>

            <Row style={{ marginTop: '20px', justifyContent: 'center' }}>
              <Column style={{ textAlign: 'center' }}>
                <Link
                  href="https://yourcompany.com/login"
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '4px',
                  }}
                >
                  Go to Dashboard
                </Link>
              </Column>
            </Row>

            <Text
              style={{ fontSize: '14px', color: '#777', marginTop: '20px' }}
            >
              If you have any questions or need help, feel free to reach out to
              our support team.
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

export default WelcomeEmail;
