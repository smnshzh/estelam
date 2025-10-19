import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // SuperTokens middleware will be implemented here
  res.status(200).json({ message: "Auth endpoint" });
}
