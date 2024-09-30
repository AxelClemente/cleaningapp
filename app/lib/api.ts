export async function updateReservationStatus(orderId: string, newStatus: 'Open' | 'Progress' | 'Completed') {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }
  
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error updating reservation status:', error);
      return { success: false, error: error.message };
    }
  }