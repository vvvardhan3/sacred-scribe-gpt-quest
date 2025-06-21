
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  displayName: string
  email: string
}

export const WelcomeEmail = ({
  displayName,
  email,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to HinduGPT - Your spiritual journey begins here!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🕉️ Welcome to HinduGPT!</Heading>
        
        <Text style={text}>
          Namaste {displayName},
        </Text>
        
        <Text style={text}>
          We're delighted to welcome you to HinduGPT, your AI companion for exploring the rich wisdom of Hindu scriptures and philosophy.
        </Text>
        
        <Section style={section}>
          <Text style={text}>
            <strong>What you can do with HinduGPT:</strong>
          </Text>
          <Text style={listItem}>• Chat with our AI about Hindu scriptures and philosophy</Text>
          <Text style={listItem}>• Take interactive quizzes on various Hindu topics</Text>
          <Text style={listItem}>• Explore categories like Vedas, Upanishads, Bhagavad Gita, and more</Text>
          <Text style={listItem}>• Deepen your understanding of ancient wisdom</Text>
        </Section>
        
        <Section style={buttonContainer}>
          <Link
            href="https://wotohsamzagjxfnkwsdo.supabase.co/dashboard"
            style={button}
          >
            Start Your Journey
          </Link>
        </Section>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          If you have any questions, feel free to reach out to us. We're here to support your spiritual journey.
        </Text>
        
        <Text style={footer}>
          With blessings,<br />
          The HinduGPT Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
}

const section = {
  padding: '0 40px',
}

const listItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
  padding: '0 40px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#ea580c',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  padding: '0 40px',
}
