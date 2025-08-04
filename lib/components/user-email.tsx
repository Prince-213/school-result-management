import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  render,
} from "@react-email/components";
import * as React from "react";

interface SchoolResultReminderEmailProps {
  name?: string;
  role?: "student" | "lecturer";
  message?: string;
}

export const SchoolResultReminderEmail = ({
  name,
  role,
  message,
}: SchoolResultReminderEmailProps) => (
  <Html>
    <Head />
    <Preview>School Result Reminder Notification</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>School Result Reminder</Heading>
        <Text style={heroText}>Hi {name ? name : "there"},</Text>
        <Section style={codeBox}>
          <Text style={confirmationCodeText}>
            {message
              ? message
              : role === "lecturer"
              ? "You have pending results to attend to. Please log in to the portal and complete your result submissions."
              : "Your results are available or pending. Please check the portal for updates."}
          </Text>
        </Section>
        <Text style={text}>
          This is an automated reminder from the School Result Management
          System. If you have any questions, please contact the school
          administration.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SchoolResultReminderEmail;

export const userEmailHTML = async ({
  name,
  role,
  message,
}: {
  name: string;
  role: "student" | "lecturer";
  message?: string;
}) =>
  await render(
    <SchoolResultReminderEmail name={name} role={role} message={message} />
  );

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "20px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "14px",
  lineHeight: "1.5rem",
  textAlign: "left" as const,
  verticalAlign: "middle",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
