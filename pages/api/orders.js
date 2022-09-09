// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { proxy } from "../../utils/api";

export default async function handler(req, res) {
  const dbName = 'plantas_en_desarrollo'

  if (req.method === 'GET') {
    const result = await proxy.getAll(
      process.env.BASE_URL,
      process.env.API_TOKEN,
      process.env.PROJECT_ID,
      dbName,
      { limit: 1000 }
    )
    
    if (!result.ok) {
      return res.status(result.status).json({ data: result.data.msg })
    }
  
    return res.status(result.status).json(result.data)
  }
  
  if (req.method === 'POST') {
    const { id } = req.body
    const result = await proxy.update(
      process.env.BASE_URL,
      process.env.API_TOKEN,
      process.env.PROJECT_ID,
      dbName,
      id,
      req.body
    )

    if (!result.ok) {
      return res.status(result.status).json({ data: result.data.msg })
    }
  
    return res.status(result.status).json(result.data)
  }
}
