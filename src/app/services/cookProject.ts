export async function cookProject(payload: any) {
  const res = await fetch('/cook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to start cooking')
  }

  return data
}
