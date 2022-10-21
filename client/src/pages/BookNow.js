import { Col, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import SeatSelection from '../components/SeatSelection';
import StripeCheckout from 'react-stripe-checkout';

function BookNow() {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bus, setBus] = useState(null);

    const getBus = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axiosInstance.post('/api/buses/get-bus-by-id', { _id: params.id });
            dispatch(HideLoading());
            if (response.data.success) {
                setBus(response.data.data);
            }
            else {
                message.error(response.data.message);
            }
        }
        catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const bookNow = async (transactionId) => {
        try {
            dispatch(ShowLoading());
            const response = await axiosInstance.post('/api/bookings/book-seat', {
                bus: bus._id,
                seats: selectedSeats,
                transactionId
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                navigate('/bookings');
            }
            else {
                message.error(response.data.error);
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    };

    const onToken = async (token) => {
        console.log(token);
        try {
            dispatch(ShowLoading());
            const response = await axiosInstance.post('/api/bookings/make-payment', {
                token,
                amount: selectedSeats.length * bus.fare * 100
            });
            dispatch(HideLoading());
            if (response.data.success) {
                message.success(response.data.message);
                bookNow(response.data.data.transactionId);
            }
            else {
                message.error(response.data.message);
            }
        }
        catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    useEffect(() => {
        getBus();
    }, []);

    return (
        <div>
            {bus && (
                <Row className="mt-3" gutter={[30, 30]}>
                    <Col lg={12} xs={24} sm={24}>
                        <h1>
                            <b className="text-xl text-secondary">{bus.name}</b>
                        </h1>

                        <h1 className="text-md">
                            {bus.from} - {bus.to}
                        </h1>

                        <hr />

                        <div className="flex flex-col gap-2">
                            <p className="text-md"><b>Journey Date</b> : {bus.journeyDate}</p>
                            <p className="text-md"><b>Fare</b> : ₹{bus.fare} /-</p>
                            <p className="text-md"><b>Departure Time</b> : {bus.departure} </p>
                            <p className="text-md"><b>Arrival Time</b> : {bus.arrival} </p>
                            <p className="text-md"><b>Total seats</b> : {bus.capacity} </p>
                            <p className="text-md"><b>Seats Left</b> : {bus.capacity - bus.seatsBooked.length} </p>
                        </div>

                        <hr />

                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl mt-2">
                                Selected Seats : {selectedSeats.join(", ")}
                            </h1>
                            <h1 className="text-2xl">Total Amount : ₹{bus.fare * selectedSeats.length}/-</h1>
                            <hr />

                            <StripeCheckout
                                billingAddress
                                token={onToken}
                                amount={bus.fare * selectedSeats.length * 100}
                                currency="INR"
                                stripeKey="pk_test_51Lb5gNSIz68aniFKbUzVoQlwEMqWwixGVy6KB4OfIrltFRAXAE7EdqoRJGUeim5XIFDPvDIT8QGaUCa5BkQcJshN00nYHeXvVQ"
                            >
                                <button
                                    className={`primary-btn ${selectedSeats.length === 0 && 'disabled-btn'
                                        }`}
                                    disabled={selectedSeats.length === 0}>Book Now</button>
                            </StripeCheckout>

                        </div>
                    </Col>
                    <Col lg={12} xs={24} sm={24}>
                        <SeatSelection selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} bus={bus} />
                    </Col>
                </Row>
            )
            }

        </div >
    )
}

export default BookNow;