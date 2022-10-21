import { message, Modal, Table } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import PageTitle from '../components/PageTitle';
import { axiosInstance } from '../helpers/axiosInstance';
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { useReactToPrint } from 'react-to-print';

function Bookings() {
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [bookings, setBookings] = useState([]);
    const dispatch = useDispatch();
    const getBookings = async () => {
        try {
            dispatch(ShowLoading());
            const response = await axiosInstance.post('/api/bookings/get-bookings-by-user-id', {});
            dispatch(HideLoading());
            if (response.data.success) {
                const mappedData = response.data.data.map((booking) => {
                    return {
                        ...booking,
                        ...booking.bus,
                        key: booking._id
                    }
                });
                setBookings(mappedData);
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

    const columns = [
        {
            title: "Bus Name",
            dataIndex: "name",
            key: "bus"
        },
        {
            title: "Bus Number",
            dataIndex: "number",
            key: "bus"
        },
        {
            title: "Journey Date",
            dataIndex: "journeyDate",
        },
        {
            title: "Journey Time",
            dataIndex: "departure",
        },
        {
            title: "Your Seats",
            dataIndex: "seats",
            render: (seats) => {
                return seats.join(", ");
            }
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => (
                <div>
                    <i className="ri-coupon-2-fill"
                        onClick={() => {
                            setSelectedTicket(record);
                            setShowPrintModal(true);
                        }}
                    ></i>
                </div>
            )
        }
    ];
    useEffect(() => {
        getBookings();
    }, []);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <PageTitle title="Bookings" />
            <div className="mt-2">
                <Table dataSource={bookings} columns={columns} />
            </div>

            {showPrintModal && <Modal title="Print Ticket" onCancel={
                () => {
                    setShowPrintModal(false);
                    setSelectedTicket(null);
                }
            }
                visible={showPrintModal}
                okText="Print"
                onOk={handlePrint}
            >
                <div className="d-flex flex-column p-5" ref={componentRef}>
                    <p>Bus: {selectedTicket.name}</p>
                    <p>{selectedTicket.from} - {selectedTicket.to}</p>
                    <hr />
                    <p>
                        <span>Journey Date:</span>{" "}
                        {moment(selectedTicket.journeyDate).format("DD-MM-YYYY")}
                    </p>
                    <p>
                        <span>Departure:</span>{" "}
                        {selectedTicket.departure}
                    </p>
                    <hr />
                    <p>
                        <span>Your Seats: </span>{" "} <br />
                        {selectedTicket.seats}
                    </p>
                    <hr />
                    <p>
                        <span>Total Amount: </span>{" "}
                        ₹{selectedTicket.fare * selectedTicket.seats.length} /-
                    </p>
                </div>

            </Modal>}
        </div >
    )
}

export default Bookings;