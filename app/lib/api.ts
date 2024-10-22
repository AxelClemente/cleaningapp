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

export const getMessages = async (orderId: string) => {
  try {
    const response = await fetch(`/api/messages?orderId=${orderId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function markMessageAsRead(messageId: string) {
  const response = await fetch('/api/messages', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageId }),
  })
  return response.json()
}
