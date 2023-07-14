import { NextApiRequest, NextApiResponse } from "next";
import client from "../../twilio-client";

export default function sendMessage(req: NextApiRequest, res: NextApiResponse) {
  client.messages
    .create({
      body: "This is a test message.",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+14086887581",
    })
    .then((message: any) => {
      console.log(message.sid);
      res.json({
        success: true,
        message: "Test message sent successfully!",
      });
    })
    .catch((error: any) => {
      console.log(error);
      res.json({
        success: false,
        message: "Failed to send the test message.",
      });
    });
}
