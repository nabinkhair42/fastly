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
              Welcome to Fastly, {firstName}!
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '1.5' }}>
              Congratulations! You&apos;ve successfully set up your account on Fastly, your modern
              SaaS foundation built with Next.js, MongoDb and TypeScript.
            </Text>

            <Row style={{ marginTop: '30px', justifyContent: 'center' }}>
              <Column style={{ textAlign: 'center' }}>
                <Link
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
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
                  Go to Your Dashboard
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
