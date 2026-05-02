export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, message } = req.body
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const userId = process.env.LINE_USER_ID

  if (!token) return res.status(200).json({ ok: false, error: 'token missing' })

  const text = `【新着お問い合わせ】\n名前: ${name}\nメール: ${email}\n内容: ${message}`

  const endpoint = userId
    ? 'https://api.line.me/v2/bot/message/push'
    : 'https://api.line.me/v2/bot/message/broadcast'

  const body = userId
    ? { to: userId, messages: [{ type: 'text', text }] }
    : { messages: [{ type: 'text', text }] }

  const lineRes = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const lineBody = await lineRes.json()

  console.log('LINE API status:', lineRes.status)
  console.log('LINE API response:', JSON.stringify(lineBody))

  res.status(200).json({
    ok: lineRes.ok,
    lineStatus: lineRes.status,
    lineResponse: lineBody,
    endpoint,
    userId: userId ?? '(none)',
  })
}
