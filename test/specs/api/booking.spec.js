import { expect } from 'chai';
import BookingApi from '../../utils/booking.api.js';
import {
    bookingData,
    updatedBookingData
} from '../../data/booking.data.js';

describe('Booking API', () => {

    async function createTestBooking() {
        const response = await BookingApi.createBooking(bookingData);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('bookingid');

        return response.body.bookingid;
    }

    async function getAuthToken() {
        const response = await BookingApi.createToken();

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');

        return response.body.token;
    }

    it('should create a new booking', async () => {
        const response = await BookingApi.createBooking(bookingData);

        expect(response.status).to.equal(200);

        expect(response.body).to.have.property('bookingid');

        expect(response.body.booking).to.include({
            firstname: bookingData.firstname,
            lastname: bookingData.lastname,
            totalprice: bookingData.totalprice,
            depositpaid: bookingData.depositpaid,
            additionalneeds: bookingData.additionalneeds
        });

        expect(response.body.booking.bookingdates).to.deep.equal(
            bookingData.bookingdates
        );
    });

    it('should update an existing booking', async () => {
        const token = await getAuthToken();
        const bookingId = await createTestBooking();

        const response = await BookingApi.updateBooking(
            bookingId,
            token,
            updatedBookingData
        );

        expect(response.status).to.equal(200);

        expect(response.body).to.include({
            firstname: updatedBookingData.firstname,
            lastname: updatedBookingData.lastname,
            totalprice: updatedBookingData.totalprice,
            depositpaid: updatedBookingData.depositpaid,
            additionalneeds: updatedBookingData.additionalneeds
        });

        expect(response.body.bookingdates).to.deep.equal(
            updatedBookingData.bookingdates
        );
    });

    it('should retrieve the updated booking', async () => {
        const token = await getAuthToken();
        const bookingId = await createTestBooking();

        await BookingApi.updateBooking(
            bookingId,
            token,
            updatedBookingData
        );

        const response = await BookingApi.getBooking(bookingId);

        expect(response.status).to.equal(200);

        expect(response.body).to.include({
            firstname: updatedBookingData.firstname,
            lastname: updatedBookingData.lastname,
            totalprice: updatedBookingData.totalprice,
            depositpaid: updatedBookingData.depositpaid,
            additionalneeds: updatedBookingData.additionalneeds
        });

        expect(response.body.bookingdates).to.deep.equal(
            updatedBookingData.bookingdates
        );
    });

    it('should delete an existing booking', async () => {
        const token = await getAuthToken();
        const bookingId = await createTestBooking();

        const deleteResponse = await BookingApi.deleteBooking(
            bookingId,
            token
        );

        expect(deleteResponse.status).to.equal(201);
        expect(deleteResponse.body).to.equal('Created');

        const getResponse = await BookingApi.getBooking(bookingId);

        expect(getResponse.status).to.equal(404);
        expect(getResponse.body).to.equal('Not Found');
    });

    it('should return 404 when retrieving a non-existent booking', async () => {
        const invalidBookingId = 999999999;

        const response = await BookingApi.getBooking(invalidBookingId);

        expect(response.status).to.equal(404);
        expect(response.body).to.equal('Not Found');
    });

    it('should not update a booking without authentication', async () => {
        const bookingId = await createTestBooking();

        const response = await BookingApi.updateBooking(
            bookingId,
            '',
            updatedBookingData
        );

        expect(response.status).to.equal(403);
        expect(response.body).to.equal('Forbidden');
    });

    it('should not delete a booking without authentication', async () => {
        const bookingId = await createTestBooking();

        const response = await BookingApi.deleteBooking(
            bookingId,
            ''
        );

        expect(response.status).to.equal(403);
        expect(response.body).to.equal('Forbidden');
    });

});