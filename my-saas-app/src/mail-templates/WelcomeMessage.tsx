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
              Welcome to Fastly, {firstName}!
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              Congratulations! You&apos;ve successfully set up your account on
              Fastly, your modern SaaS foundation built with Next.js and
              TypeScript.
            </Text>
            <Text
              style={{ fontSize: '16px', lineHeight: '1.5', marginTop: '10px' }}
            >
              Fastly provides you with a solid foundation featuring secure
              authentication, user management, file uploads, and a beautiful
              dashboard - everything you need to build and launch your SaaS
              application quickly.
            </Text>
            <Text
              style={{ fontSize: '16px', lineHeight: '1.5', marginTop: '10px' }}
            >
              Here&apos;s what you can do next:
            </Text>
            <Text
              style={{
                fontSize: '16px',
                lineHeight: '1.5',
                marginTop: '10px',
                marginLeft: '20px',
              }}
            >
              • Explore your dashboard and customize your profile
              <br />
              • Review the documentation to understand available features
              <br />
              • Start building your application on this solid foundation
              <br />• Reach out to our community for support and best practices
            </Text>

            <Row style={{ marginTop: '30px', justifyContent: 'center' }}>
              <Column style={{ textAlign: 'center' }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                  }}
                >
                  Go to Your Dashboard
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
              Need help getting started? Check out our{' '}
              <Link
                href="https://github.com/nabinkhair42/fastly"
                style={{ color: '#4CAF50' }}
              >
                documentation on GitHub
              </Link>{' '}
              or contact our support team.
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: '#777',
                marginTop: '10px',
                textAlign: 'center',
              }}
            >
              Questions? Email us at{' '}
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

export default WelcomeEmail;
