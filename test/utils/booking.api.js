const API_BASE_URL = 'https://restful-booker.herokuapp.com';

class BookingApi {

    async parseResponse(response) {
        const contentType = response.headers.get('content-type') || '';

        const body = contentType.includes('application/json')
            ? await response.json()
            : await response.text();

        return {
            status: response.status,
            body
        };
    }

    async createToken() {
        const response = await fetch(`${API_BASE_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'password123'
            })
        });

        return this.parseResponse(response);
    }

    async createBooking(booking) {
        const response = await fetch(`${API_BASE_URL}/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(booking)
        });

        return this.parseResponse(response);
    }

    async getBooking(bookingId) {
        const response = await fetch(
            `${API_BASE_URL}/booking/${bookingId}`
        );

        return this.parseResponse(response);
    }

    async updateBooking(bookingId, token, booking) {
        const response = await fetch(
            `${API_BASE_URL}/booking/${bookingId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${token}`
                },
                body: JSON.stringify(booking)
            }
        );

        return this.parseResponse(response);
    }

    async deleteBooking(bookingId, token) {
        const response = await fetch(
            `${API_BASE_URL}/booking/${bookingId}`,
            {
                method: 'DELETE',
                headers: {
                    'Cookie': `token=${token}`
                }
            }
        );

        return this.parseResponse(response);
    }
}

export default new BookingApi();