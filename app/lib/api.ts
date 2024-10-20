export async function updateReservationStatus(
  orderId: string, 
  newStatus: string,
  workerId?: string
) {
  try {
    const response = await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, status: newStatus, workerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update reservation status');
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating reservation status:', error);
    return { success: false, error: 'Failed to update reservation status' };
  }
}

export async function sendMessage(receiverId: string, orderId: string, content: string) {
  console.log('sendMessage called with:', { receiverId, orderId, content });
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId, orderId, content }),
    })
    console.log('API response status:', response.status);
    const data = await response.json()
    console.log('API response data:', data);
    return data
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

export async function getMessages(reservationId: string) {
  const response = await fetch(`/api/messages?reservationId=${reservationId}`)
  return response.json()
}

export async function markMessageAsRead(messageId: string) {
  const response = await fetch('/api/messages', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageId }),
  })
  return response.json()
}
